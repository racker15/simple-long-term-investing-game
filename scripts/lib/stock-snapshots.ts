import type { StockDataset } from '../build/historical';

// Separate unversioned daily requests differ slightly at overlapping endpoints.
// The qualification audit records every difference; reject material revisions.
// This applies only to new Yahoo chart snapshots, never the preserved pilot.
export const STOCK_SNAPSHOT_TOLERANCE = 5e-6;
export function assertStockHistoryAgreement(
  starting: StockDataset,
  full: StockDataset,
) {
  for (const [ticker, series] of Object.entries(starting.series)) {
    const prices = full.series[ticker]?.prices;
    if (!prices) throw new Error(`Missing outcome history for ${ticker}`);
    const base = prices.find((row) => row.month === series.prices[0].month);
    if (!base) throw new Error(`Missing overlap base for ${ticker}`);
    for (const row of series.prices) {
      const other = prices.find((price) => price.month === row.month);
      const expected = row.value / series.prices[0].value;
      if (
        !other ||
        Math.abs(other.value / base.value / expected - 1) >
          STOCK_SNAPSHOT_TOLERANCE
      )
        throw new Error(
          `Starting and outcome stock snapshots disagree for ${ticker} at ${row.month}`,
        );
    }
  }
}
