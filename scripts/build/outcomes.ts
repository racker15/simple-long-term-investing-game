import {
  BROAD_ASSET_IDS,
  type AssetId,
  type FutureOutcomes,
  type KnownAtStart,
  type Provenance,
} from '../../app/src/lib/contracts';
import { loadScenario } from '../../app/src/lib/validation';
import { getScenarioWindow, type BroadDataset } from '../lib/monthly';
import { readJson, writeJson } from '../lib/files';
import type { SourceManifest } from '../lib/sources';
import {
  assertStartingLock,
  RESEARCH,
  SCENARIO,
  type StockDataset,
} from './historical';

export type OutcomeInputs = Omit<
  FutureOutcomes,
  'monthly_returns' | 'return_sources'
>;

export function buildFuture(
  known: KnownAtStart,
  broad: BroadDataset,
  stocks: StockDataset,
  editorial: OutcomeInputs,
): FutureOutcomes {
  if (editorial.scenario_id !== known.metadata.scenario_id)
    throw new Error('Outcome scenario ID mismatch');
  const date = known.metadata.date;
  const windows = [
    ...BROAD_ASSET_IDS.map((id) => ({
      id,
      series: broad.series[id].observations,
      sources: broad.series[id].source_ids,
      recent: known.recent_returns.find((row) => row.asset_id === id)!,
    })),
    ...known.hot_stocks.map((stock) => ({
      id: stock.id,
      series: stocks.series[stock.ticker].observations,
      sources: [`yahoo-${stock.ticker.toLowerCase()}`],
      recent: stock,
    })),
  ].map((asset) => {
    const window = getScenarioWindow(asset.series, date);
    if (
      Math.abs(window.trailingThreeMonthReturn - asset.recent.three_month) >
        1e-12 ||
      Math.abs(window.trailingOneYearReturn - asset.recent.one_year) > 1e-12
    )
      throw new Error(
        `Starting and future source histories disagree for ${asset.id}`,
      );
    return { ...asset, window };
  });
  return {
    ...editorial,
    monthly_returns: Object.fromEntries(
      windows.map(({ id, window }) => [id, window.futureMonthlyReturns]),
    ) as Record<AssetId, FutureOutcomes['monthly_returns'][AssetId]>,
    return_sources: Object.fromEntries(
      windows.map(({ id, sources }) => [id, sources]),
    ) as FutureOutcomes['return_sources'],
  };
}

export function artifactProvenance(
  manifest: SourceManifest,
  publications: Record<string, { date: string; reference: string }>,
): Provenance['sources'] {
  return manifest.sources.map((source) => ({
    id: source.id,
    source_name: source.source_name,
    source_reference: source.download_url,
    observation_date: '2004-09-30',
    publication_date: publications[source.id].date,
    retrieved_at: source.retrieved_at,
    approximation: true,
    notes: `Retrospective archive used for outcomes. Publication date is that of the pinned public mirror revision (${publications[source.id].reference}), not original market reporting or first dataset publication. Canonical source: ${source.canonical_url}. Series: ${source.series_id}. Raw SHA256: ${source.sha256}. ${source.transformation}`,
  }));
}

if (process.argv[1]?.endsWith('/build/outcomes.ts')) {
  await assertStartingLock();
  const [
    known,
    broad,
    stocks,
    editorial,
    startingSources,
    outcomeSources,
    broadManifest,
    stockManifest,
    artifactDates,
  ] = await Promise.all([
    readJson<KnownAtStart>(`${SCENARIO}/known_at_start.json`),
    readJson<BroadDataset>('data/normalized/broad-assets/monthly-returns.json'),
    readJson<StockDataset>('data/normalized/stocks/monthly-returns.json'),
    readJson<OutcomeInputs>(`${RESEARCH}/outcome-inputs.json`),
    readJson<Provenance>(`${RESEARCH}/starting-provenance.json`),
    readJson<Provenance>(`${RESEARCH}/outcome-provenance.json`),
    readJson<SourceManifest>('data/normalized/broad-assets/sources.json'),
    readJson<SourceManifest>('data/normalized/stocks/sources.json'),
    readJson<{
      publications: Record<string, { date: string; reference: string }>;
    }>(`${RESEARCH}/artifact-publications.json`),
  ]);
  const future = buildFuture(known, broad, stocks, editorial);
  const provenance: Provenance = {
    scenario_id: known.metadata.scenario_id,
    sources: [
      ...startingSources.sources,
      ...artifactProvenance(broadManifest, artifactDates.publications),
      ...artifactProvenance(stockManifest, artifactDates.publications),
      ...outcomeSources.sources,
    ],
  };
  loadScenario({ known, future, provenance });
  const check = process.argv.includes('--check');
  await writeJson(`${SCENARIO}/future_outcomes.json`, future, check);
  await writeJson(`${SCENARIO}/provenance.json`, provenance, check);
}
