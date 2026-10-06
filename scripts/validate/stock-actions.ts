import type { Provenance } from '../../app/src/lib/contracts';
import type { StockDataset } from '../build/historical';
import { readJson } from '../lib/files';
import { adjustedPriceReturns } from '../lib/monthly';
import type { SourceManifest } from '../lib/sources';
import { STOCK_SNAPSHOT_TOLERANCE } from '../lib/stock-snapshots';

type Review = { source_ids: string[]; assessment: string; limitations: string };
type Audit = {
  scenario_id: string;
  overlap_tolerance: number;
  series: Record<
    string,
    {
      raw_sha256: string;
      monthly_endpoints: {
        month: string;
        trading_date: string;
        adjusted_close: number;
      }[];
      future_dividends: { ex_date: string; vendor_adjusted_amount: number }[];
      future_splits: {
        trading_date: string;
        numerator: number;
        denominator: number;
        ratio: string;
      }[];
      maximum_rebased_overlap_relative_difference: number;
      review: Review;
    }
  >;
};

// Normal CI verifies committed audit lineage and endpoints without a network or raw cache.
export async function validateStockAudit(
  id: string,
  stocks: StockDataset,
  manifest: SourceManifest,
  provenance: Provenance,
) {
  const root = `data/research/${id}`;
  const [audit, reviews] = await Promise.all([
    readJson<Audit>(`${root}/corporate-actions.json`),
    readJson<{ stocks: Record<string, Review> }>(
      `${root}/corporate-action-review.json`,
    ),
  ]);
  if (
    audit.scenario_id !== id ||
    audit.overlap_tolerance !== STOCK_SNAPSHOT_TOLERANCE ||
    Object.keys(audit.series).sort().join() !==
      Object.keys(stocks.series).sort().join()
  )
    throw new Error(`Corporate-action audit identity mismatch: ${id}`);
  for (const [ticker, series] of Object.entries(stocks.series)) {
    if (
      JSON.stringify(adjustedPriceReturns(series.prices)) !==
      JSON.stringify(series.observations)
    )
      throw new Error(
        `Normalized stock returns disagree with endpoints: ${id}/${ticker}`,
      );
    const row = audit.series[ticker];
    const source = manifest.sources.find((entry) => entry.series_id === ticker);
    if (
      !source ||
      row.raw_sha256 !== source.sha256 ||
      !Number.isFinite(row.maximum_rebased_overlap_relative_difference) ||
      row.maximum_rebased_overlap_relative_difference < 0 ||
      row.maximum_rebased_overlap_relative_difference > STOCK_SNAPSHOT_TOLERANCE
    )
      throw new Error(
        `Corporate-action audit lineage mismatch: ${id}/${ticker}`,
      );
    if (
      JSON.stringify(row.review) !== JSON.stringify(reviews.stocks[ticker]) ||
      !row.review.assessment ||
      !row.review.limitations ||
      !row.review.source_ids.length ||
      row.review.source_ids.some(
        (ref) => !provenance.sources.some((entry) => entry.id === ref),
      )
    )
      throw new Error(
        `Missing corporate-action review source: ${id}/${ticker}`,
      );
    if (row.monthly_endpoints.length !== series.prices.length)
      throw new Error(
        `Corporate-action endpoint count mismatch: ${id}/${ticker}`,
      );
    row.monthly_endpoints.forEach((endpoint, i) => {
      const price = series.prices[i];
      const date = new Date(`${endpoint.trading_date}T00:00:00Z`);
      const end = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
      );
      if (
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== endpoint.trading_date ||
        endpoint.month !== price.month ||
        !Number.isFinite(endpoint.adjusted_close) ||
        endpoint.adjusted_close <= 0 ||
        endpoint.trading_date.slice(0, 7) !== price.month ||
        endpoint.adjusted_close !== price.value ||
        (end.getTime() - date.getTime()) / 86400000 > 4
      )
        throw new Error(
          `Corporate-action endpoint mismatch: ${id}/${ticker}/${price.month}`,
        );
    });
    for (const actions of [
      row.future_dividends.map((action) => ({
        date: action.ex_date,
        positive: [action.vendor_adjusted_amount],
      })),
      row.future_splits.map((action) => ({
        date: action.trading_date,
        positive: [action.numerator, action.denominator],
      })),
    ]) {
      actions.forEach((action, i) => {
        const date = new Date(`${action.date}T00:00:00Z`);
        if (
          !Number.isFinite(date.getTime()) ||
          date.toISOString().slice(0, 10) !== action.date ||
          action.date.slice(0, 7) <= id ||
          action.date.slice(0, 7) > series.prices.at(-1)!.month ||
          (i > 0 && action.date <= actions[i - 1].date) ||
          action.positive.some((value) => !Number.isFinite(value) || value <= 0)
        )
          throw new Error(
            `Malformed corporate-action observation: ${id}/${ticker}`,
          );
      });
    }
  }
}
