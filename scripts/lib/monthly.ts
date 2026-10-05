import type { BroadAssetId } from '../../app/src/lib/contracts';

export type MonthlyReturn = { month: string; return: number };
export type MonthlyValue = { month: string; value: number };
export type BroadDataset = {
  schema_version: 1;
  currency: 'USD';
  series: Record<
    BroadAssetId,
    { source_ids: string[]; observations: MonthlyReturn[] }
  >;
};

export function monthIndex(month: string): number {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))
    throw new Error(`Invalid month ${month}`);
  return Number(month.slice(0, 4)) * 12 + Number(month.slice(5)) - 1;
}

export function shiftMonth(month: string, offset: number): string {
  if (!Number.isInteger(offset))
    throw new Error('Month offset must be an integer');
  const index = monthIndex(month) + offset;
  return `${Math.floor(index / 12)
    .toString()
    .padStart(4, '0')}-${((index % 12) + 1).toString().padStart(2, '0')}`;
}

export function cutoffMonth(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error(`Invalid scenario date ${date}`);
  const month = date.slice(0, 7);
  monthIndex(month);
  const end = new Date(
    Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)), 0),
  );
  if (end.toISOString().slice(0, 10) !== date)
    throw new Error('Scenario date must be calendar month-end');
  return month;
}

export function assertMonthlyValues(values: MonthlyValue[]): void {
  if (!values.length) throw new Error('Empty monthly series');
  values.forEach((row, i) => {
    monthIndex(row.month);
    if (!Number.isFinite(row.value))
      throw new Error(`Non-finite value at ${row.month}`);
    if (i && row.month !== shiftMonth(values[i - 1].month, 1))
      throw new Error(`Duplicate, unsorted, or missing month at ${row.month}`);
  });
}

export function assertMonthlyReturns(series: MonthlyReturn[]): void {
  assertMonthlyValues(
    series.map((row) => ({ month: row.month, value: row.return })),
  );
  if (series.some((row) => row.return < -1))
    throw new Error('Monthly return below -100%');
}

export function compound(series: MonthlyReturn[]): number {
  const result = series.reduce((value, row) => value * (1 + row.return), 1) - 1;
  if (!Number.isFinite(result)) throw new Error('Non-finite compounded return');
  return result;
}

function requestedMonths(
  series: MonthlyReturn[],
  start: string,
  length: number,
): MonthlyReturn[] {
  assertMonthlyReturns(series);
  const byMonth = new Map(series.map((row) => [row.month, row]));
  return Array.from({ length }, (_, i) => {
    const month = shiftMonth(start, i);
    const row = byMonth.get(month);
    if (!row) throw new Error(`Missing requested month ${month}`);
    return { ...row };
  });
}

// Market returns through the cutoff month's close are treated as known.
// This function deliberately does not need or read a future window.
export function getTrailingReturns(
  series: MonthlyReturn[],
  scenarioDate: string,
) {
  const cutoff = cutoffMonth(scenarioDate);
  return {
    trailingThreeMonthReturn: compound(
      requestedMonths(series, shiftMonth(cutoff, -2), 3),
    ),
    trailingOneYearReturn: compound(
      requestedMonths(series, shiftMonth(cutoff, -11), 12),
    ),
  };
}

export function getScenarioWindow(
  series: MonthlyReturn[],
  scenarioDate: string,
) {
  const cutoff = cutoffMonth(scenarioDate);
  return {
    ...getTrailingReturns(series, scenarioDate),
    futureMonthlyReturns: requestedMonths(series, shiftMonth(cutoff, 1), 60),
  };
}

export function getBroadAssetScenarioWindow(
  dataset: BroadDataset,
  scenarioDate: string,
  assetId: BroadAssetId,
) {
  return getScenarioWindow(dataset.series[assetId].observations, scenarioDate);
}

// Buy a synthetic five-year par bond at last month's yield, receive one
// monthly coupon, and reprice its remaining 59 payments at this month's yield.
// Monthly coupons and a flat curve are explicit approximations.
export function treasuryProxy(
  previousYieldPercent: number,
  currentYieldPercent: number,
): number {
  if (
    [previousYieldPercent, currentYieldPercent].some(
      (yieldValue) => !Number.isFinite(yieldValue) || yieldValue < 0,
    )
  )
    throw new Error('Treasury yields must be finite and nonnegative');
  const coupon = previousYieldPercent / 100 / 12;
  const discount = 1 + currentYieldPercent / 100 / 12;
  let price = 0;
  for (let payment = 1; payment <= 59; payment++)
    price += coupon / discount ** payment;
  price += 1 / discount ** 59;
  return price + coupon - 1;
}

export function treasuryReturns(yields: MonthlyValue[]): MonthlyReturn[] {
  assertMonthlyValues(yields);
  return yields.slice(1).map((row, i) => ({
    month: row.month,
    return: treasuryProxy(yields[i].value, row.value),
  }));
}

export function adjustedPriceReturns(prices: MonthlyValue[]): MonthlyReturn[] {
  assertMonthlyValues(prices);
  if (prices.some((row) => row.value <= 0))
    throw new Error('Adjusted prices must be positive');
  return prices.slice(1).map((row, i) => ({
    month: row.month,
    return: row.value / prices[i].value - 1,
  }));
}
