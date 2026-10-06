import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BROAD_ASSET_IDS } from '../../app/src/lib/contracts';
import { shiftMonth, type BroadDataset } from '../../scripts/lib/monthly';
import { sha256 } from '../../scripts/lib/files';
import {
  selectDates,
  type OperationalExclusion,
} from '../../scripts/select/dates';
import {
  selectProductionDates,
  writeProductionAudit,
  type ProductionProtocol,
} from '../../scripts/select/production';

// Synthetic fixture only: never execute the preregistered production seed.
const protocol: ProductionProtocol = {
  schema_version: 1,
  audit_version: 2,
  replacement_order: 'finish-original-slot-before-next',
  exhaustion: 'persist-failed-audit',
  universe_id: 'synthetic-production-review',
  seed: 'test-only-production',
  algorithm: 'fnv1a-utf16-mulberry32-unbiased-v1',
  start_month: '1980-01',
  end_month: '1985-12',
  trailing_months: 12,
  future_months: 60,
  minimum_spacing_months: 1,
  strata: [
    { id: 'a', start_month: '1980-01', end_month: '1982-12', weight: 1 },
    { id: 'b', start_month: '1983-01', end_month: '1985-12', weight: 1 },
  ],
  cohorts: { pilot: 2, production: 4 },
  important_dates: [],
};
const observations = Array.from({ length: 156 }, (_, i) => ({
  month: shiftMonth('1979-01', i),
  return: 0.01,
}));
const broad = {
  schema_version: 1,
  currency: 'USD',
  series: Object.fromEntries(
    BROAD_ASSET_IDS.map((id) => [
      id,
      { source_ids: ['synthetic'], observations },
    ]),
  ),
} as BroadDataset;
const exclude = (date: string): OperationalExclusion => ({
  date,
  reason: 'starting_sources_unavailable',
  evidence: `Synthetic missing archive for ${date}, alternatives exhausted`,
});

describe('versioned production selector', () => {
  it('preserves v1 initial draws, pilot prefix, spacing, and unaffected acceptances', () => {
    const spaced = {
      ...protocol,
      minimum_spacing_months: 12,
      important_dates: [
        { date: '1981-06-30', reason: 'Synthetic reservation' },
      ],
    };
    const pilot = selectDates(spaced, broad, 'pilot');
    const expanded = selectProductionDates(spaced, broad);
    expect(expanded.status).toBe('complete');
    expect(expanded.draws).toEqual(
      selectDates(spaced, broad, 'production').draws,
    );
    expect(expanded.draws.slice(0, pilot.draws.length)).toEqual(pilot.draws);
    expect(expanded.selected.slice(0, 2)).toEqual(pilot.selected);
    const removed = expanded.selected[0];
    const repaired = selectProductionDates(spaced, broad, 'production', [
      exclude(removed.date),
    ]);
    expect(repaired.status).toBe('complete');
    expect(repaired.draws.slice(0, expanded.draws.length)).toEqual(
      expanded.draws,
    );
    expect(repaired.selected.slice(1)).toEqual(expanded.selected.slice(1));
    expect(repaired.selected[0].stratum).toBe(removed.stratum);
    expect(repaired.selected[0].date).not.toBe(removed.date);
  });

  it('finishes a chained slot-zero exclusion before repairing slot one', () => {
    const original = selectProductionDates(protocol, broad, 'pilot');
    const firstReplacement = selectProductionDates(protocol, broad, 'pilot', [
      exclude(original.selected[0].date),
    ]).selected[0];
    const exclusions = [
      exclude(original.selected[0].date),
      exclude(firstReplacement.date),
      exclude(original.selected[1].date),
    ];
    const result = selectProductionDates(protocol, broad, 'pilot', exclusions);
    expect(result.status).toBe('complete');
    expect(
      result.withdrawals.map((row) => result.draws[row.draw_index].slot),
    ).toEqual([0, 0, 1]);
    expect(
      result.withdrawals.map((row) => result.draws[row.draw_index].date),
    ).toEqual(exclusions.map((row) => row.date));
    expect(result.withdrawals.map((row) => row.evidence)).toEqual(
      exclusions.map((row) => row.evidence),
    );
    expect(result.draws.slice(0, original.draws.length)).toEqual(
      original.draws,
    );
    expect(
      result.withdrawals.every(
        (row) => result.draws[row.draw_index].status === 'accepted',
      ),
    ).toBe(true);
    expect(
      result.selected.every(
        (row) => !exclusions.some((e) => e.date === row.date),
      ),
    ).toBe(true);
    expect(selectProductionDates(protocol, broad, 'pilot', exclusions)).toEqual(
      result,
    );
  });

  it('persists exhausted replacement evidence and retains the unaffected slot', async () => {
    const original = selectProductionDates(protocol, broad, 'pilot');
    const exclusions = original.eligible_dates
      .filter((date) => date < '1983-01')
      .map(exclude);
    const failed = selectProductionDates(protocol, broad, 'pilot', exclusions);
    expect(failed.status).toBe('failed');
    expect(failed.failure).toEqual({
      reason: 'Selection exhausted stratum a for slot 0',
      slot: 0,
      stratum: 'a',
    });
    expect(failed.selected).toEqual([original.selected[1]]);
    expect(failed.withdrawals).toHaveLength(36);
    expect(failed.draws.filter((row) => row.stratum === 'a')).toHaveLength(36);
    expect(
      new Set(
        failed.draws
          .filter((row) => row.stratum === 'a')
          .map((row) => row.date),
      ).size,
    ).toBe(36);
    const folder = await mkdtemp(join(tmpdir(), 'investing-selection-audit-'));
    try {
      const input = join(folder, 'synthetic-evidence.txt');
      const output = join(folder, 'failed-audit.json');
      await writeFile(
        input,
        'Synthetic evidence, not historical source material.',
      );
      const written = await writeProductionAudit(output, failed, [input]);
      const saved = JSON.parse(await readFile(output, 'utf8'));
      expect(saved).toEqual(written);
      expect(saved.status).toBe('failed');
      expect(saved.withdrawals).toEqual(failed.withdrawals);
      expect(saved.draws).toEqual(failed.draws);
      expect(saved.selected).toEqual([original.selected[1]]);
      expect(saved.input_hashes[input]).toBe(sha256(await readFile(input)));
    } finally {
      await rm(folder, { recursive: true, force: true });
    }
  });

  it('returns the full failed initial attempt log without relaxing spacing', () => {
    const failed = selectProductionDates(
      {
        ...protocol,
        minimum_spacing_months: 100,
        important_dates: [
          { date: '1981-06-30', reason: 'Synthetic blocking reservation' },
        ],
      },
      broad,
      'pilot',
    );
    expect(failed.status).toBe('failed');
    expect(failed.selected).toEqual([]);
    expect(failed.draws).toHaveLength(36);
    expect(
      failed.draws.every(
        (row) =>
          row.status === 'rejected' && row.reason === 'spacing:1981-06-30',
      ),
    ).toBe(true);
  });

  it('fails invalid policies and exclusions before attempting a draw', () => {
    expect(() =>
      selectProductionDates({ ...protocol, audit_version: 1 as never }, broad),
    ).toThrow('audit policy');
    expect(() =>
      selectProductionDates(protocol, broad, 'pilot', [
        { ...exclude('1980-01-31'), reason: 'boring' as never },
      ]),
    ).toThrow('exclusion');
    expect(() =>
      selectProductionDates(protocol, broad, 'pilot', [
        { ...exclude('1980-01-31'), evidence: '' },
      ]),
    ).toThrow('exclusion');
    expect(() =>
      selectProductionDates(protocol, broad, 'pilot', [exclude('1979-12-31')]),
    ).toThrow('exclusion');
    expect(() =>
      selectProductionDates(protocol, broad, 'pilot', [exclude('1980-01-30')]),
    ).toThrow('month-end');
    expect(() =>
      selectProductionDates(protocol, broad, 'pilot', [
        exclude('1980-01-31'),
        exclude('1980-01-31'),
      ]),
    ).toThrow('exclusion');
  });
});
