import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  productionLibrary,
  historicalDecisionContext,
  loadHistoricalScenario,
} from '../../app/src/data/historical';
import { buildSessionQueue } from '../../app/src/lib/queue';
import { decisionContext } from '../../app/src/lib/validation';
import { ScenarioView } from '../../app/src/components/ScenarioView';
import { Allocation } from '../../app/src/components/Allocation';
import { readJson } from '../../scripts/lib/files';
import { shiftMonth, type BroadDataset } from '../../scripts/lib/monthly';
import {
  assertStartingLock,
  buildKnown,
  buildStartingScenario,
  scenarioPaths,
  type StartingInputs,
  type StockDataset,
} from '../../scripts/build/historical';
import {
  assertStockHistoryAgreement,
  STOCK_SNAPSHOT_TOLERANCE,
  buildFuture,
  buildOutcomeScenario,
  type OutcomeInputs,
} from '../../scripts/build/outcomes';

const ids = ['1982-08', '1987-01', '1999-09', '2004-05', '2008-09', '2016-02'];
const important = new Set(['1982-08', '1999-09', '2008-09']);
const pilotLibrary = productionLibrary.filter((entry) =>
  ids.includes(entry.scenario_id),
);

describe('locked six-scenario historical collection', () => {
  it('preserves the qualified pilot pool and makes reproducible five-distinct-date queues', () => {
    expect(pilotLibrary.map((entry) => entry.scenario_id).sort()).toEqual(ids);
    for (const entry of pilotLibrary)
      expect(entry.selection_mode).toBe(
        important.has(entry.scenario_id) ? 'important' : 'random',
      );
    for (let seed = 0; seed < 20; seed++) {
      const queue = buildSessionQueue(
        pilotLibrary,
        5,
        [],
        `collection-${seed}`,
      );
      expect(queue).toHaveLength(5);
      expect(new Set(queue).size).toBe(5);
      expect(queue.every((id) => ids.includes(id))).toBe(true);
      expect([2, 3]).toContain(queue.filter((id) => important.has(id)).length);
      expect(
        buildSessionQueue(
          [...pilotLibrary].reverse(),
          5,
          [],
          `collection-${seed}`,
        ),
      ).toEqual(queue);
      const unseen = ids[seed % ids.length];
      expect(
        buildSessionQueue(
          pilotLibrary,
          5,
          ids.filter((id) => id !== unseen),
          `return-${seed}`,
        ),
      ).toContain(unseen);
    }
    expect(() => buildSessionQueue(pilotLibrary, 10, [], 'collection')).toThrow(
      'Need 10 unique scenarios, have 6',
    );
  });

  it.each(ids)(
    '%s resolves its complete aligned reveal, preserves its lock and rebuilds offline exactly',
    async (id) => {
      const scenario = await loadHistoricalScenario(id);
      const { research, stocks } = scenarioPaths(id);
      const [broad, starts, outcomes, editorial, inputs] = await Promise.all([
        readJson<BroadDataset>(
          'data/normalized/broad-assets/monthly-returns.json',
        ),
        readJson<StockDataset>(`${stocks}/starting.json`),
        readJson<StockDataset>(`${stocks}/monthly-returns.json`),
        readJson<OutcomeInputs>(`${research}/outcome-inputs.json`),
        readJson<StartingInputs>(`${research}/starting-inputs.json`),
      ]);
      const months = Array.from({ length: 60 }, (_, i) =>
        shiftMonth(id, i + 1),
      );
      expect(Object.keys(scenario.future.monthly_returns)).toHaveLength(7);
      for (const rows of Object.values(scenario.future.monthly_returns)) {
        expect(rows.map((row) => row.month)).toEqual(months);
        expect(
          rows.every((row) => Number.isFinite(row.return) && row.return >= -1),
        ).toBe(true);
      }
      if (id !== '1999-09') {
        expect(() =>
          assertStockHistoryAgreement(starts, outcomes),
        ).not.toThrow();
        const revised = structuredClone(outcomes);
        const ticker = Object.keys(starts.series)[0];
        const month = starts.series[ticker].prices[1].month;
        revised.series[ticker].prices.find(
          (row) => row.month === month,
        )!.value *= 1.01;
        expect(() => assertStockHistoryAgreement(starts, revised)).toThrow(
          'snapshots disagree',
        );
      }
      await assertStartingLock(id);
      expect(buildKnown(inputs, broad, starts)).toEqual(scenario.known);
      expect(
        buildFuture(
          scenario.known,
          broad,
          outcomes,
          editorial,
          id === '1999-09' ? 1e-12 : STOCK_SNAPSHOT_TOLERANCE,
        ),
      ).toEqual(scenario.future);
      // Check mode compares exact serialized outputs and cannot overwrite a stale artifact.
      await buildStartingScenario(id, true);
      await buildOutcomeScenario(id, true);
      const alteredFuture = structuredClone(broad);
      for (const series of Object.values(alteredFuture.series))
        for (const row of series.observations)
          if (row.month > id) row.return = 0.75;
      expect(buildKnown(inputs, alteredFuture, starts)).toEqual(scenario.known);
    },
  );

  it.each(ids)(
    '%s projects and renders only starting information, even when private metadata changes',
    async (id) => {
      const scenario = await loadHistoricalScenario(id);
      const context = historicalDecisionContext(id);
      const html = renderToStaticMarkup(
        <>
          <ScenarioView context={context} />
          <Allocation context={context} onCommit={() => {}} />
        </>,
      );
      expect(context).toEqual(decisionContext(scenario.known));
      expect(html).toContain(context.display_date);
      expect(html.match(/type="radio"/g)).toHaveLength(7);
      for (const event of scenario.future.events)
        expect(html).not.toContain(event.title);
      expect(html).not.toContain(scenario.future.what_happened_next.text);
      expect(html).not.toContain(scenario.future.reflection.what_nobody_knew);
      const serialized = JSON.stringify(context);
      for (const field of [
        'selection',
        'source_ids',
        'selection_rationale',
        'selection_note',
        'future',
      ])
        expect(serialized).not.toContain(`"${field}"`);
      const changed = structuredClone(scenario.known);
      changed.metadata.selection = {
        mode: 'important',
        selection_reason: 'PRIVATE_COHORT_SENTINEL',
      };
      changed.headlines.forEach((story) => {
        story.selection_note = 'PRIVATE_HEADLINE_SENTINEL';
      });
      changed.hot_stocks.forEach((stock) => {
        stock.selection_rationale = 'PRIVATE_STOCK_SENTINEL';
      });
      expect(decisionContext(changed)).toEqual(context);
    },
  );
});
