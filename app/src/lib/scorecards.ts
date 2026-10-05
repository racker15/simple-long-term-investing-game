import { INITIAL_CAPITAL, type ScenarioResult } from './contracts';
import { resultExpectations } from './results';
export const CONCENTRATION_THRESHOLD = 0.5; // At least half the initial capital in one investment, including cash.
export const COHORT_MINIMUM_SAMPLE = 5;
export function aggregateResults(results: readonly ScenarioResult[]) {
  if (!results.length)
    throw new Error('A scorecard requires at least one result');
  const count = results.length;
  const sum = (get: (r: ScenarioResult) => number) =>
    results.reduce((total, result) => total + get(result), 0);
  const countIf = (get: (r: ScenarioResult) => boolean) =>
    results.filter(get).length;
  return {
    count,
    allocations: {
      broad_equity:
        sum((r) => r.allocations.us_total + r.allocations.international_ex_us) /
        count /
        INITIAL_CAPITAL,
      hot_stocks:
        sum((r) =>
          Object.entries(r.allocations)
            .filter(([id]) => id.startsWith('hot:'))
            .reduce((total, [, value]) => total + value, 0),
        ) /
        count /
        INITIAL_CAPITAL,
      bonds: sum((r) => r.allocations.bonds) / count / INITIAL_CAPITAL,
      cash: sum((r) => r.allocations.cash) / count / INITIAL_CAPITAL,
    },
    concentration_count: countIf(
      (r) =>
        Math.max(...Object.values(r.allocations)) / INITIAL_CAPITAL >=
        CONCENTRATION_THRESHOLD,
    ),
    concentration_frequency:
      countIf(
        (r) =>
          Math.max(...Object.values(r.allocations)) / INITIAL_CAPITAL >=
          CONCENTRATION_THRESHOLD,
      ) / count,
    prediction_hits: countIf((r) => resultExpectations(r).correct),
    prediction_bottom_half: countIf(
      (r) => resultExpectations(r).expected_winner_rank >= 5,
    ), // Middle rank 4 is excluded.
    leader_reversals: countIf((r) => resultExpectations(r).leader_reversed),
    average_ending_value: sum((r) => r.ending_portfolio_value) / count,
    average_benchmark_value: sum((r) => r.ending_benchmark_value) / count,
    benchmark_beating_count: countIf(
      (r) => r.ending_portfolio_value > r.ending_benchmark_value,
    ),
    drawdown_20_count: countIf((r) => r.max_drawdown >= 0.2),
    largest_drawdown: Math.max(...results.map((r) => r.max_drawdown)),
  };
}
export type Aggregate = ReturnType<typeof aggregateResults>;
export function blockScorecard(results: readonly ScenarioResult[]) {
  if (results.length !== 5)
    throw new Error('A checkpoint must contain exactly five results');
  return aggregateResults(results);
}
export function sessionScorecard(results: readonly ScenarioResult[]) {
  if (!results.length || results.length % 5 !== 0)
    throw new Error('Final scorecards require completed five-scenario blocks');
  const overall = aggregateResults(results);
  const sorted = results
    .map((r) => r.ending_portfolio_value)
    .sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2
      ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;
  const cohorts = Object.fromEntries(
    (['important', 'random'] as const).map((mode) => {
      const subgroup = results.filter((r) => r.selection_mode === mode);
      return [
        mode,
        subgroup.length >= COHORT_MINIMUM_SAMPLE
          ? aggregateResults(subgroup)
          : null,
      ];
    }),
  );
  return {
    overall,
    median_ending_value: median,
    prediction_hit_rate: overall.prediction_hits / overall.count,
    reversal_frequency: overall.leader_reversals / overall.count,
    cohorts,
    blocks: Array.from({ length: results.length / 5 }, (_, i) => ({
      start: i * 5 + 1,
      end: i * 5 + 5,
      ...blockScorecard(results.slice(i * 5, i * 5 + 5)),
    })),
  };
}
export function scorecardObservation(card: Aggregate): string {
  return `Your expected winner finished first in ${card.prediction_hits} of ${card.count} scenarios. The year-one leader changed by year five in ${card.leader_reversals} of ${card.count}. These describe the outcomes, not the quality of your judgment.`;
}
