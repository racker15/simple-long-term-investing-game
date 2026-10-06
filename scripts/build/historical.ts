import { access, readFile } from 'node:fs/promises';
import {
  BROAD_ASSET_IDS,
  type KnownAtStart,
  type Provenance,
} from '../../app/src/lib/contracts';
import { structuralErrors } from '../../app/src/lib/validation';
import {
  getTrailingReturns,
  type BroadDataset,
  type MonthlyReturn,
  type MonthlyValue,
} from '../lib/monthly';
import { readJson, sha256, writeJson } from '../lib/files';

export type StartingInputs = Omit<
  KnownAtStart,
  'recent_returns' | 'hot_stocks'
> & {
  hot_stocks: Omit<
    KnownAtStart['hot_stocks'][number],
    'three_month' | 'one_year'
  >[];
};
export type StockDataset = {
  schema_version: 1;
  currency: 'USD';
  series: Record<
    string,
    { symbol: string; prices: MonthlyValue[]; observations: MonthlyReturn[] }
  >;
};
export const RESEARCH = 'data/research/1999-09';
export const SCENARIO = 'data/scenarios/1999-09';

export function buildKnown(
  inputs: StartingInputs,
  broad: BroadDataset,
  stocks: StockDataset,
): KnownAtStart {
  const date = inputs.metadata.date;
  const recent = (rows: MonthlyReturn[]) => {
    const window = getTrailingReturns(rows, date);
    return {
      three_month: window.trailingThreeMonthReturn,
      one_year: window.trailingOneYearReturn,
    };
  };
  // The starting stock artifact contains only observations ending at cutoff.
  // This path neither loads outcomes nor requests any subsequent month.
  if (
    Object.values(stocks.series).some((series) =>
      [...series.observations, ...series.prices].some(
        (row) => row.month > date.slice(0, 7),
      ),
    )
  )
    throw new Error(
      'Starting stock artifact must not contain future observations',
    );
  const known: KnownAtStart = {
    ...inputs,
    recent_returns: BROAD_ASSET_IDS.map((asset_id) => ({
      asset_id,
      ...recent(broad.series[asset_id].observations),
      source_ids: ['asof-broad-proxies'],
    })),
    hot_stocks: inputs.hot_stocks.map((stock) => {
      const series = stocks.series[stock.ticker];
      if (!series)
        throw new Error(`Missing starting history for ${stock.ticker}`);
      return { ...stock, ...recent(series.observations) };
    }),
  };
  const errors = structuralErrors('known_at_start', known);
  if (errors.length) throw new Error(JSON.stringify(errors));
  return known;
}

export function scenarioPaths(id = '1999-09') {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(id))
    throw new Error('Invalid historical scenario ID');
  return {
    research: `data/research/${id}`,
    scenario: `data/scenarios/${id}`,
    stocks:
      id === '1999-09'
        ? 'data/normalized/stocks'
        : `data/normalized/stocks/${id}`,
  };
}

export async function assertStartingLock(id = '1999-09') {
  const { research: RESEARCH } = scenarioPaths(id);
  const lock = await readJson<{ files: Record<string, string> }>(
    `${RESEARCH}/starting-lock.json`,
  );
  for (const [path, checksum] of Object.entries(lock.files))
    if (sha256(await readFile(path)) !== checksum)
      throw new Error(
        `Starting context lock changed: ${path}. Do not recurate after seeing outcomes.`,
      );
}

export async function buildStartingScenario(
  id: string,
  check = false,
  lock = false,
) {
  const {
    research: RESEARCH,
    scenario: SCENARIO,
    stocks: STOCKS,
  } = scenarioPaths(id);
  if (lock) {
    const hasOutcomes = await access(`${SCENARIO}/future_outcomes.json`).then(
      () => true,
      () => false,
    );
    const hasLock = await access(`${RESEARCH}/starting-lock.json`).then(
      () => true,
      () => false,
    );
    if (hasLock)
      throw new Error(
        'Starting context is already locked; an integrity repair requires a separate audit',
      );
    if (hasOutcomes)
      throw new Error('Cannot relock starting context after outcomes exist');
  }
  const [inputs, broad, stocks, provenance] = await Promise.all([
    readJson<StartingInputs>(`${RESEARCH}/starting-inputs.json`),
    readJson<BroadDataset>('data/normalized/broad-assets/monthly-returns.json'),
    readJson<StockDataset>(`${STOCKS}/starting.json`),
    readJson<Provenance>(`${RESEARCH}/starting-provenance.json`),
  ]);
  const known = buildKnown(inputs, broad, stocks);
  const errors = structuralErrors('provenance', provenance);
  if (errors.length) throw new Error(JSON.stringify(errors));
  const sourceMap = new Map(
    provenance.sources.map((source) => [source.id, source]),
  );
  for (const id of JSON.stringify(known).matchAll(/"source_ids":\[(.*?)\]/g)) {
    for (const sourceId of JSON.parse(`[${id[1]}]`) as string[]) {
      const source = sourceMap.get(sourceId);
      if (
        !source ||
        !source.publication_date ||
        source.publication_date > known.metadata.date
      )
        throw new Error(`Missing or post-cutoff starting source ${sourceId}`);
    }
  }
  if (!lock) await assertStartingLock(id);
  await writeJson(`${SCENARIO}/known_at_start.json`, known, check);
  if (lock) {
    const paths = [
      `${RESEARCH}/starting-inputs.json`,
      `${RESEARCH}/starting-provenance.json`,
      `${RESEARCH}/candidate-pool.json`,
      `${SCENARIO}/known_at_start.json`,
      `${STOCKS}/starting.json`,
      `${STOCKS}/sources.json`,
      'data/normalized/broad-assets/sources.json',
      'data/normalized/broad-assets/monthly-returns.json',
      ...(id === '1999-09'
        ? []
        : ['data/selection/protocol.json', 'data/selection/pilot-draw.json']),
    ];
    const files = Object.fromEntries(
      await Promise.all(
        paths.map(async (path) => [path, sha256(await readFile(path))]),
      ),
    );
    await writeJson(`${RESEARCH}/starting-lock.json`, {
      schema_version: 1,
      scenario_id: id,
      locked_at: '2026-10-05',
      stage:
        'Starting context locked before calculating selected stocks’ future windows or writing events, narrative, and reflections.',
      files,
    });
  }
}

if (process.argv[1]?.endsWith('/build/historical.ts')) {
  const id =
    process.argv.find((arg) => arg.startsWith('--scenario='))?.slice(11) ??
    '1999-09';
  await buildStartingScenario(
    id,
    process.argv.includes('--check'),
    process.argv.includes('--lock'),
  );
}
