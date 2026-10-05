import {
  ALLOCATION_STEP,
  INITIAL_CAPITAL,
  BROAD_ASSET_IDS,
  type AssetId,
  type Allocations,
  type MonthlyReturns,
} from './contracts';

export function canonicalAssetOrder(ids: string[]): AssetId[] {
  return [
    ...BROAD_ASSET_IDS,
    ...ids.filter((id) => id.startsWith('hot:')).sort(),
  ] as AssetId[];
}
export function assertAssetSet(ids: string[]) {
  if (
    ids.length !== 7 ||
    new Set(ids).size !== 7 ||
    BROAD_ASSET_IDS.some((id) => !ids.includes(id)) ||
    ids.filter((id) => /^hot:[a-z0-9-]+:[a-z0-9-]+$/.test(id)).length !== 3
  )
    throw new Error(
      'Expected four canonical broad assets and three unique hot-stock IDs',
    );
}
export function normalizeAllocations(
  ids: AssetId[],
  input: Partial<Allocations>,
): Allocations {
  assertAssetSet(ids);
  if (Object.keys(input).some((id) => !ids.includes(id as AssetId)))
    throw new Error('Unknown asset in allocation');
  const allocation = Object.fromEntries(
    ids.map((id) => [id, input[id] ?? 0]),
  ) as Allocations;
  for (const amount of Object.values(allocation)) {
    if (
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount % ALLOCATION_STEP !== 0
    )
      throw new Error(
        'Allocations must be nonnegative finite dollars in $500 increments',
      );
  }
  const total = Object.values(allocation).reduce((a, b) => a + b, 0);
  if (total > INITIAL_CAPITAL) throw new Error('Allocations exceed $10,000');
  allocation.cash += INITIAL_CAPITAL - total;
  return allocation;
}
export type PortfolioPoint = {
  month: string;
  positions: Allocations;
  total: number;
};
export type PortfolioPath = {
  initial: Allocations;
  points: PortfolioPoint[];
  ending_value: number;
  total_return: number;
  max_drawdown: number;
  highest_value: number;
  lowest_value: number;
};
export function calculatePortfolio(
  returns: MonthlyReturns,
  input: Partial<Allocations>,
): PortfolioPath {
  assertAssetSet(Object.keys(returns));
  const ids = canonicalAssetOrder(Object.keys(returns));
  const initial = normalizeAllocations(ids, input);
  const length = returns.cash.length;
  if (
    length === 0 ||
    Object.values(returns).some((series) => series.length !== length)
  )
    throw new Error('Return series must be nonempty and aligned');
  let positions = { ...initial };
  let peak = INITIAL_CAPITAL,
    low = INITIAL_CAPITAL,
    drawdown = 0;
  const points = returns.cash.map((observation, index) => {
    if (index && observation.month <= returns.cash[index - 1].month)
      throw new Error('Return months must be sorted and unique');
    positions = Object.fromEntries(
      ids.map((id) => {
        const current = returns[id][index];
        if (
          current.month !== observation.month ||
          !Number.isFinite(current.return) ||
          current.return < -1
        )
          throw new Error(
            `Invalid/alignment error for ${id} month ${index + 1}`,
          );
        const value = positions[id] * (1 + current.return);
        if (!Number.isFinite(value))
          throw new Error(`Non-finite compounded value for ${id}`);
        return [id, value];
      }),
    ) as Allocations;
    const total = Object.values(positions).reduce((a, b) => a + b, 0);
    if (!Number.isFinite(total)) throw new Error('Non-finite portfolio total');
    peak = Math.max(peak, total);
    low = Math.min(low, total);
    drawdown = Math.max(drawdown, (peak - total) / peak);
    return { month: observation.month, positions, total };
  });
  const ending = points.at(-1)!.total;
  return {
    initial,
    points,
    ending_value: ending,
    total_return: ending / INITIAL_CAPITAL - 1,
    max_drawdown: drawdown,
    highest_value: peak,
    lowest_value: low,
  };
}
export function calculateComparisons(returns: MonthlyReturns) {
  return {
    diversified: calculatePortfolio(returns, {
      us_total: 6000,
      international_ex_us: 2000,
      bonds: 2000,
    }),
    us_total: calculatePortfolio(returns, { us_total: INITIAL_CAPITAL }),
  };
}
export function rankAssets(endings: Record<string, number>) {
  assertAssetSet(Object.keys(endings));
  const ids = canonicalAssetOrder(Object.keys(endings));
  assertAssetSet(ids);
  if (
    Object.values(endings).some((value) => !Number.isFinite(value) || value < 0)
  )
    throw new Error('Invalid asset ending value');
  // Exact ties receive distinct ordinal ranks using canonical broad order, then hot IDs lexically.
  return [...ids].sort(
    (a, b) => endings[b] - endings[a] || ids.indexOf(a) - ids.indexOf(b),
  );
}
export function calculateWinners(returns: MonthlyReturns) {
  const ids = canonicalAssetOrder(Object.keys(returns));
  const paths = ids.map(
    (id) =>
      [id, calculatePortfolio(returns, { [id]: INITIAL_CAPITAL })] as const,
  );
  if (paths.some(([, path]) => path.points.length < 12))
    throw new Error('Winner calculation requires at least 12 months');
  const asset_ending_values = Object.fromEntries(
    paths.map(([id, path]) => [id, path.ending_value]),
  ) as Record<AssetId, number>;
  const oneYear = Object.fromEntries(
    paths.map(([id, path]) => [id, path.points[11].total]),
  );
  const ranking = rankAssets(asset_ending_values);
  const year_one_leader = rankAssets(oneYear)[0];
  return {
    asset_ending_values,
    ranking,
    actual_winner: ranking[0],
    year_one_leader,
    leader_reversed: year_one_leader !== ranking[0],
  };
}
