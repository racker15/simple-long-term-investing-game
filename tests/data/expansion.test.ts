import { describe, expect, it } from 'vitest';
import protocol from '../../data/selection/expansion-50-protocol.json';
import draw from '../../data/selection/expansion-50-draw.json';
import manifest from '../../data/scenarios/manifest.json';
import { randomWords } from '../../scripts/select/dates';
import {
  assertStartingLock,
  buildStartingScenario,
} from '../../scripts/build/historical';
import { buildOutcomeScenario } from '../../scripts/build/outcomes';
import { loadHistoricalScenario } from '../../app/src/data/historical';

const important = protocol.important_dates.map((row) => row.month);
const planned = [
  ...important,
  ...protocol.preserved_random_ids,
  ...draw.draws.map((row) => row.month),
];
const additions = manifest.scenarios.filter(
  (row) => !protocol.preserved_pilot_ids.includes(row.scenario_id),
);

describe('preregistered expansion to fifty historical scenarios', () => {
  it('preserves the pilots and selects 25 important plus 25 random dates without outcome input', () => {
    expect(important).toHaveLength(25);
    expect(draw.draws).toHaveLength(22);
    expect(protocol.preserved_random_ids).toHaveLength(3);
    expect(new Set(planned).size).toBe(50);
    expect(draw.outcomes_used).toBe(false);
    for (const id of protocol.preserved_pilot_ids)
      expect(planned).toContain(id);
    const excluded = new Set([...important, ...protocol.preserved_random_ids]);
    const pool: string[] = [];
    for (let year = 1980; year <= 2020; year++)
      for (let month = 1; month <= 12; month++) {
        const id = `${year}-${String(month).padStart(2, '0')}`;
        if (!excluded.has(id)) pool.push(id);
      }
    const random = randomWords(protocol.seed);
    for (const entry of draw.draws) {
      expect(entry.population).toBe(pool.length);
      const limit = Math.floor(4294967296 / pool.length) * pool.length;
      const words: number[] = [];
      let word: number;
      do {
        word = random();
        words.push(word);
      } while (word >= limit);
      expect(entry.words).toEqual(words);
      expect(pool.splice(word % pool.length, 1)[0]).toBe(entry.month);
    }
  });

  it('registers only selected complete dates and never pads the library with duplicates', () => {
    expect(manifest.scenarios).toHaveLength(50);
    expect(new Set(manifest.scenarios.map((row) => row.scenario_id)).size).toBe(
      manifest.scenarios.length,
    );
    for (const row of manifest.scenarios) {
      expect(planned).toContain(row.scenario_id);
      expect(row.selection_mode).toBe(
        important.includes(row.scenario_id) ? 'important' : 'random',
      );
    }
    if (manifest.scenarios.length === 50) {
      expect(
        manifest.scenarios.filter((row) => row.selection_mode === 'important'),
      ).toHaveLength(25);
      expect(
        manifest.scenarios.filter((row) => row.selection_mode === 'random'),
      ).toHaveLength(25);
    }
  });

  it.each(additions)(
    '$scenario_id has a locked start and a reproducible seven-choice, sixty-month reveal',
    async ({ scenario_id }) => {
      await assertStartingLock(scenario_id);
      await buildStartingScenario(scenario_id, true);
      await buildOutcomeScenario(scenario_id, true);
      const scenario = await loadHistoricalScenario(scenario_id);
      const narrativeWords = scenario.future.what_happened_next.text
        .trim()
        .split(/\s+/).length;
      expect(narrativeWords).toBeGreaterThanOrEqual(150);
      expect(narrativeWords).toBeLessThanOrEqual(250);
      expect(scenario.known.hot_stocks).toHaveLength(3);
      expect(scenario.known.headlines.length).toBeGreaterThanOrEqual(6);
      expect(scenario.known.headlines.length).toBeLessThanOrEqual(8);
      expect(Object.values(scenario.future.monthly_returns)).toHaveLength(7);
      for (const rows of Object.values(scenario.future.monthly_returns))
        expect(rows).toHaveLength(60);
    },
  );
});
