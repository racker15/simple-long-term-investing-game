import {
  BROAD_ASSET_IDS,
  type AssetId,
  type FutureOutcomes,
  type KnownAtStart,
  type Provenance,
} from '../../app/src/lib/contracts';
import { loadScenario } from '../../app/src/lib/validation';
import {
  getScenarioWindow,
  shiftMonth,
  type BroadDataset,
} from '../lib/monthly';
import { monthEnd } from '../select/dates';
import { readJson, writeJson } from '../lib/files';
import type { SourceManifest } from '../lib/sources';
import { validateStockAudit } from '../validate/stock-actions';
import {
  assertStockHistoryAgreement,
  STOCK_SNAPSHOT_TOLERANCE,
} from '../lib/stock-snapshots';
import {
  assertStartingLock,
  scenarioPaths,
  type StockDataset,
} from './historical';

export type OutcomeInputs = Omit<
  FutureOutcomes,
  'monthly_returns' | 'return_sources'
>;

export {
  assertStockHistoryAgreement,
  STOCK_SNAPSHOT_TOLERANCE,
} from '../lib/stock-snapshots';

export function buildFuture(
  known: KnownAtStart,
  broad: BroadDataset,
  stocks: StockDataset,
  editorial: OutcomeInputs,
  stockTolerance = 1e-12,
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
    const tolerance = asset.id.startsWith('hot:') ? stockTolerance : 1e-12;
    if (
      Math.abs(
        (1 + window.trailingThreeMonthReturn) / (1 + asset.recent.three_month) -
          1,
      ) > tolerance ||
      Math.abs(
        (1 + window.trailingOneYearReturn) / (1 + asset.recent.one_year) - 1,
      ) > tolerance
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
  publications: Record<
    string,
    { date: string | null; reference: string; observation_date?: string }
  >,
  observationDate = '2004-09-30',
): Provenance['sources'] {
  return manifest.sources.map((source) => ({
    id: source.id,
    source_name: source.source_name,
    source_reference: source.download_url,
    observation_date:
      publications[source.id].observation_date ?? observationDate,
    publication_date: publications[source.id].date,
    retrieved_at: source.retrieved_at,
    approximation: true,
    notes: source.download_url.includes('query1.finance.yahoo.com')
      ? `Current retrospective Yahoo snapshot used for outcomes, retrieved ${source.retrieved_at}. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through ${publications[source.id].observation_date ?? observationDate}. Retrieved raw payload SHA256: ${source.sha256}. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. ${source.transformation}`
      : `Retrospective archive used for outcomes. Publication date is that of the pinned public mirror revision (${publications[source.id].reference}), not original market reporting or first dataset publication. Canonical source: ${source.canonical_url}. Series: ${source.series_id}. Raw SHA256: ${source.sha256}. ${source.transformation}`,
  }));
}

export async function buildOutcomeScenario(id: string, check = false) {
  const {
    research: RESEARCH,
    scenario: SCENARIO,
    stocks: STOCKS,
  } = scenarioPaths(id);
  await assertStartingLock(id);
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
    readJson<StockDataset>(`${STOCKS}/monthly-returns.json`),
    readJson<OutcomeInputs>(`${RESEARCH}/outcome-inputs.json`),
    readJson<Provenance>(`${RESEARCH}/starting-provenance.json`),
    readJson<Provenance>(`${RESEARCH}/outcome-provenance.json`),
    readJson<SourceManifest>('data/normalized/broad-assets/sources.json'),
    readJson<SourceManifest>(
      `${STOCKS}/${id === '1999-09' ? 'sources' : 'outcome-sources'}.json`,
    ),
    readJson<{
      publications: Record<
        string,
        { date: string | null; reference: string; observation_date?: string }
      >;
    }>(`${RESEARCH}/artifact-publications.json`),
  ]);
  if (id !== '1999-09') {
    const starting = await readJson<StockDataset>(`${STOCKS}/starting.json`);
    assertStockHistoryAgreement(starting, stocks);
  }
  const future = buildFuture(
    known,
    broad,
    stocks,
    editorial,
    id === '1999-09' ? 1e-12 : STOCK_SNAPSHOT_TOLERANCE,
  );
  const observationDate = monthEnd(
    shiftMonth(known.metadata.date.slice(0, 7), 60),
  );
  const provenance: Provenance = {
    scenario_id: known.metadata.scenario_id,
    sources: [
      ...startingSources.sources,
      ...artifactProvenance(
        broadManifest,
        artifactDates.publications,
        id === '1999-09' ? '2004-09-30' : observationDate,
      ),
      ...artifactProvenance(
        stockManifest,
        artifactDates.publications,
        id === '1999-09' ? '2004-09-30' : observationDate,
      ),
      ...outcomeSources.sources,
    ],
  };
  loadScenario({ known, future, provenance });
  if (id !== '1999-09')
    await validateStockAudit(id, stocks, stockManifest, provenance);
  await writeJson(`${SCENARIO}/future_outcomes.json`, future, check);
  await writeJson(`${SCENARIO}/provenance.json`, provenance, check);
}

if (process.argv[1]?.endsWith('/build/outcomes.ts')) {
  const id =
    process.argv.find((arg) => arg.startsWith('--scenario='))?.slice(11) ??
    '1999-09';
  await buildOutcomeScenario(id, process.argv.includes('--check'));
}
