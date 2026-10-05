import {
  assetIds,
  type Scenario,
  type Allocations,
  type AssetId,
  type ScenarioResult,
} from './contracts';
import {
  calculatePortfolio,
  calculateComparisons,
  calculateWinners,
  rankAssets,
} from './portfolio';
export function createResult(
  scenario: Scenario,
  allocation: Partial<Allocations>,
  expected: AssetId,
): ScenarioResult {
  if (!assetIds(scenario.known).includes(expected))
    throw new Error('Prediction must name a playable asset');
  const portfolio = calculatePortfolio(
    scenario.future.monthly_returns,
    allocation,
  );
  const winners = calculateWinners(scenario.future.monthly_returns);
  return {
    scenario_id: scenario.known.metadata.scenario_id,
    selection_mode: scenario.known.metadata.selection.mode,
    allocations: portfolio.initial,
    expected_winner: expected,
    asset_ending_values: winners.asset_ending_values,
    year_one_leader: winners.year_one_leader,
    ending_portfolio_value: portfolio.ending_value,
    ending_benchmark_value: calculateComparisons(
      scenario.future.monthly_returns,
    ).diversified.ending_value,
    max_drawdown: portfolio.max_drawdown,
  };
}
export function resultExpectations(result: ScenarioResult) {
  const ranking = rankAssets(result.asset_ending_values);
  const expectedRank = ranking.indexOf(result.expected_winner as AssetId) + 1;
  if (!expectedRank) throw new Error('Expected winner absent from result');
  return {
    actual_winner: ranking[0],
    expected_winner_rank: expectedRank,
    correct: ranking[0] === result.expected_winner,
    leader_reversed: ranking[0] !== result.year_one_leader,
  };
}
