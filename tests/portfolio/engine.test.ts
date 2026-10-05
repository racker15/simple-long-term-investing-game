import { describe, expect, it } from 'vitest';
import {
  calculatePortfolio,
  calculateComparisons,
  calculateWinners,
  normalizeAllocations,
  rankAssets,
} from '../../app/src/lib/portfolio';
import {
  assetIds,
  type AssetId,
  type MonthlyReturns,
} from '../../app/src/lib/contracts';
import { fixture } from '../../app/src/data/fixture';
const ids = assetIds(fixture.known);
export function returnsFixture(length = 60): MonthlyReturns {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      Array.from({ length }, (_, i) => ({
        month: new Date(Date.UTC(2000, i + 1, 1)).toISOString().slice(0, 7),
        return: 0,
      })),
    ]),
  ) as MonthlyReturns;
}
describe('buy-and-hold portfolio', () => {
  it('adds remaining dollars to explicit cash and preserves input', () => {
    const input = { us_total: 3500, cash: 500 };
    const result = normalizeAllocations(ids, input);
    expect(result.cash).toBe(6500);
    expect(Object.values(result).reduce((a, b) => a + b)).toBe(10000);
    expect(input).toEqual({ us_total: 3500, cash: 500 });
  });
  it.each([-500, 250, NaN, Infinity])(
    'rejects invalid allocation %s',
    (amount) =>
      expect(() => normalizeAllocations(ids, { bonds: amount })).toThrow(),
  );
  it('rejects over-allocation and unknown assets', () => {
    expect(() =>
      normalizeAllocations(ids, { us_total: 10000, cash: 500 }),
    ).toThrow('exceed');
    expect(() =>
      normalizeAllocations(ids, { unknown: 500 } as Partial<
        Record<AssetId, number>
      >),
    ).toThrow('Unknown');
  });
  it('compounds independently: 5k * 1.1 * .5 + 5k * 1.2 * 1.1 = 9350', () => {
    const returns = returnsFixture();
    returns.us_total[0].return = 0.1;
    returns.us_total[1].return = -0.5;
    returns.bonds[0].return = 0.2;
    returns.bonds[1].return = 0.1;
    const path = calculatePortfolio(returns, { us_total: 5000, bonds: 5000 });
    expect(path.points[0].total).toBeCloseTo(11500);
    expect(path.points[1].positions.us_total).toBeCloseTo(2750);
    expect(path.points[1].positions.bonds).toBeCloseTo(6600);
    expect(path.ending_value).toBeCloseTo(9350);
    expect(path.total_return).toBeCloseTo(-0.065);
    expect(path.max_drawdown).toBeCloseTo(2150 / 11500);
    expect(path.highest_value).toBeCloseTo(11500);
    expect(path.lowest_value).toBeCloseTo(9350);
    expect(returns.us_total[0].return).toBe(0.1);
  });
  it('includes initial $10k in drawdown and extrema; bankruptcy stays zero', () => {
    const returns = returnsFixture();
    returns[ids[4]][0].return = -1;
    returns[ids[4]][1].return = 5;
    const path = calculatePortfolio(returns, { [ids[4]]: 10000 });
    expect(path.points.every((point) => point.total === 0)).toBe(true);
    expect(path.max_drawdown).toBe(1);
    expect(path.highest_value).toBe(10000);
    expect(path.lowest_value).toBe(0);
  });
  it('uses buy-and-hold benchmark: 6000*1.2*.5 + 2000*1.1*1.1 + 2000 = 8020', () => {
    const returns = returnsFixture();
    returns.us_total[0].return = 0.2;
    returns.us_total[1].return = -0.5;
    returns.international_ex_us[0].return = 0.1;
    returns.international_ex_us[1].return = 0.1;
    const comparisons = calculateComparisons(returns);
    expect(comparisons.diversified.ending_value).toBeCloseTo(8020);
    expect(comparisons.us_total.ending_value).toBeCloseTo(6000);
  });
  it.each([NaN, Infinity, -1.01])(
    'rejects invalid monthly return %s',
    (value) => {
      const returns = returnsFixture();
      returns.bonds[0].return = value;
      expect(() => calculatePortfolio(returns, {})).toThrow();
    },
  );
  it('rejects unknown or missing asset keys before compounding or ranking', () => {
    const returns = returnsFixture();
    const { bonds: _omitted, ...missing } = returns;
    expect(() => calculatePortfolio(missing as MonthlyReturns, {})).toThrow(
      'four canonical',
    );
    expect(() =>
      calculatePortfolio(
        { ...returns, unknown: returns.cash } as MonthlyReturns,
        {},
      ),
    ).toThrow('four canonical');
    expect(() =>
      rankAssets({
        ...Object.fromEntries(ids.map((id) => [id, 10000])),
        unknown: 10000,
      }),
    ).toThrow('four canonical');
  });
  it('rejects missing, duplicate, unsorted and misaligned series', () => {
    const returns = returnsFixture();
    returns.bonds.pop();
    expect(() => calculatePortfolio(returns, {})).toThrow('aligned');
    const duplicate = returnsFixture();
    duplicate.cash[1].month = duplicate.cash[0].month;
    expect(() => calculatePortfolio(duplicate, {})).toThrow();
    const unsorted = returnsFixture();
    [unsorted.cash[0], unsorted.cash[1]] = [unsorted.cash[1], unsorted.cash[0]];
    expect(() => calculatePortfolio(unsorted, {})).toThrow();
  });
});
describe('rankings', () => {
  it('breaks ties in canonical order even when object order differs', () => {
    const endings = Object.fromEntries(
      [...ids].reverse().map((id) => [id, 10000]),
    );
    expect(rankAssets(endings)).toEqual([
      ...ids.slice(0, 4),
      ...ids.slice(4).sort(),
    ]);
  });
  it('compares year one with year five using equal starting amounts', () => {
    const winners = calculateWinners(fixture.future.monthly_returns);
    expect(winners.year_one_leader).toBe('hot:dev-fictional:acme');
    expect(winners.actual_winner).toBe('hot:dev-fictional:retail');
    expect(winners.leader_reversed).toBe(true);
    expect(winners.asset_ending_values['hot:dev-fictional:telecom']).toBe(0);
    expect(
      calculateComparisons(fixture.future.monthly_returns).diversified
        .max_drawdown,
    ).toBeGreaterThan(0.2);
  });
});
