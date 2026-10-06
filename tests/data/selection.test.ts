import { describe, expect, it } from 'vitest';
import { BROAD_ASSET_IDS } from '../../app/src/lib/contracts';
import {
  monthEnd,
  randomWords,
  selectDates,
  validateProtocol,
  type SelectionProtocol,
} from '../../scripts/select/dates';
import { shiftMonth, type BroadDataset } from '../../scripts/lib/monthly';

const protocol: SelectionProtocol = {
  schema_version: 1,
  universe_id: 'synthetic',
  seed: 'test-only',
  algorithm: 'fnv1a-utf16-mulberry32-unbiased-v1',
  start_month: '1980-01',
  end_month: '1985-12',
  trailing_months: 12,
  future_months: 60,
  minimum_spacing_months: 12,
  strata: [
    { id: 'a', start_month: '1980-01', end_month: '1982-12', weight: 1 },
    { id: 'b', start_month: '1983-01', end_month: '1985-12', weight: 1 },
  ],
  cohorts: { pilot: 2, production: 4 },
  important_dates: [{ date: '1981-06-30', reason: 'Synthetic reservation' }],
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

describe('preregistered date selector on synthetic inputs', () => {
  it('replays the same words, uniform pool choices, strata, and spacing', () => {
    const result = selectDates(protocol, broad, 'pilot');
    expect(selectDates(protocol, broad, 'pilot')).toEqual(result);
    expect(result.eligible_dates).toHaveLength(72);
    expect(result.selected.map((row) => row.stratum)).toEqual(['a', 'b']);
    expect(
      result.selected.every(
        (row) =>
          Math.abs(
            Number(row.date.slice(0, 4)) * 12 +
              Number(row.date.slice(5, 7)) -
              (1981 * 12 + 6),
          ) >= 12,
      ),
    ).toBe(true);
    for (const draw of result.draws) {
      expect(draw.words.at(-1)!).toBeLessThan(
        Math.floor(4294967296 / draw.population) * draw.population,
      );
      expect(draw.index).toBe(result.draws.indexOf(draw));
    }
    const random = randomWords('test-only');
    expect([random(), random(), random()]).toEqual(
      result.draws.flatMap((row) => row.words).slice(0, 3),
    );
  });
  it('never uses future return sizes and keeps the pilot initial draw as a production prefix', () => {
    const changed = structuredClone(broad);
    for (const series of Object.values(changed.series))
      series.observations.forEach((row) => {
        row.return = row.month > '1980-01' ? 0.8 : -0.5;
      });
    const pilot = selectDates(protocol, broad, 'pilot');
    expect(selectDates(protocol, changed, 'pilot')).toEqual(pilot);
    const production = selectDates(protocol, broad, 'production');
    expect(production.draws.slice(0, pilot.draws.length)).toEqual(pilot.draws);
    expect(new Set(production.selected.map((row) => row.date)).size).toBe(4);
  });
  it('preserves prior acceptances, logs withdrawals, and deterministically replaces in the same stratum', () => {
    const original = selectDates(protocol, broad, 'pilot');
    const removed = original.selected[0];
    const exclusions = [
      {
        date: removed.date,
        reason: 'starting_sources_unavailable' as const,
        evidence: 'Synthetic archive missing after documented test attempts',
      },
    ];
    const repaired = selectDates(protocol, broad, 'pilot', exclusions);
    expect(repaired.draws.slice(0, original.draws.length)).toEqual(
      original.draws,
    );
    expect(repaired.withdrawals).toEqual([
      {
        draw_index: removed.draw_index,
        reason: exclusions[0].reason,
        evidence: exclusions[0].evidence,
      },
    ]);
    expect(repaired.selected[1]).toEqual(original.selected[1]);
    expect(repaired.selected[0].stratum).toBe(removed.stratum);
    expect(repaired.selected[0].date).not.toBe(removed.date);
    expect(
      repaired.draws.find((row) => row.replacement_for === removed.draw_index),
    ).toBeDefined();
    expect(selectDates(protocol, broad, 'pilot', exclusions)).toEqual(repaired);
  });
  it('rejects unsupported/editorial exclusions, missing evidence, duplicates, bad strata, and ambiguous weights', () => {
    expect(() =>
      selectDates(protocol, broad, 'pilot', [
        { date: '1980-01-31', reason: 'boring' as never, evidence: 'No drama' },
      ]),
    ).toThrow('operational exclusion');
    expect(() =>
      selectDates(protocol, broad, 'pilot', [
        {
          date: '1980-01-31',
          reason: 'stock_history_unreconstructable',
          evidence: '',
        },
      ]),
    ).toThrow();
    expect(() => selectDates(protocol, broad, 'unknown')).toThrow('cohort');
    expect(() =>
      validateProtocol({ ...protocol, strata: [protocol.strata[0]] }, 'pilot'),
    ).toThrow('cover');
    expect(() =>
      validateProtocol({ ...protocol, cohorts: { pilot: 3 } }, 'pilot'),
    ).toThrow('integral');
    expect(() =>
      validateProtocol({ ...protocol, minimum_spacing_months: 0 }, 'pilot'),
    ).toThrow('Spacing');
    expect(() =>
      selectDates({ ...protocol, minimum_spacing_months: 100 }, broad, 'pilot'),
    ).toThrow('exhausted');
  });
  it('excludes incomplete windows, fails malformed histories, and handles calendar month ends', () => {
    const short = structuredClone(broad);
    short.series.cash.observations = short.series.cash.observations.filter(
      (row) => row.month >= '1980-02',
    );
    const result = selectDates(protocol, short, 'pilot');
    expect(result.universe_exclusions).toContainEqual({
      date: '1980-01-31',
      reason: 'broad_history_unavailable',
    });
    expect(result.eligible_dates).not.toContain('1980-12-31');
    const broken = structuredClone(broad);
    broken.series.bonds.observations[5].return = NaN;
    expect(() => selectDates(protocol, broken, 'pilot')).toThrow('Non-finite');
    expect(monthEnd('1980-02')).toBe('1980-02-29');
    expect(monthEnd('1981-02')).toBe('1981-02-28');
  });
});
