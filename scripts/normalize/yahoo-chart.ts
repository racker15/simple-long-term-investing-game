import { readJson, writeJson } from '../lib/files';
import { readLockedSources, type SourceManifest } from '../lib/sources';
import { adjustedPriceReturns, shiftMonth } from '../lib/monthly';
import { parseYahooDailyCsv } from '../lib/parsers';
import { scenarioPaths, type StartingInputs } from '../build/historical';

// Adapt the current Yahoo chart response to the existing strict daily parser.
// Request daily prices: monthly chart timestamps mark month STARTS and must not
// be interpreted as month-end prices for an information cutoff.
export function parseYahooChart(
  payload: string,
  symbol: string,
  start: string,
  end: string,
) {
  const chart = JSON.parse(payload).chart;
  if (chart?.error || chart?.result?.length !== 1)
    throw new Error('Invalid Yahoo chart response');
  const result = chart.result[0];
  if (
    result.meta?.symbol !== symbol ||
    result.meta?.currency !== 'USD' ||
    result.meta?.dataGranularity !== '1d'
  )
    throw new Error('Expected matching USD daily chart');
  const dates = result.timestamp,
    prices = result.indicators?.adjclose?.[0]?.adjclose;
  if (
    !Array.isArray(dates) ||
    !Array.isArray(prices) ||
    dates.length !== prices.length
  )
    throw new Error('Missing or misaligned Yahoo adjusted prices');
  const rows = dates.map((timestamp: unknown, index: number) => {
    const price = prices[index];
    if (
      typeof timestamp !== 'number' ||
      !Number.isInteger(timestamp) ||
      typeof price !== 'number' ||
      !Number.isFinite(price) ||
      price <= 0
    )
      throw new Error(`Malformed Yahoo adjusted observation ${index}`);
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
    return `${symbol},${date},1,1,1,1,1,${price}`;
  });
  return parseYahooDailyCsv(
    'Symbol,Date,Open,High,Low,Close,Volume,Adj Close\n' + rows.join('\n'),
    symbol,
    start,
    end,
  );
}

if (process.argv[1]?.endsWith('/normalize/yahoo-chart.ts')) {
  const id = process.argv
    .find((arg) => arg.startsWith('--scenario='))
    ?.slice(11);
  if (!id || id === '1999-09') throw new Error('Specify a new scenario ID');
  const starting = !process.argv.includes('--outcome');
  const paths = scenarioPaths(id);
  const inputs = await readJson<StartingInputs>(
    `${paths.research}/starting-inputs.json`,
  );
  const manifest = await readJson<SourceManifest>(
    `${paths.stocks}/${starting ? 'sources' : 'outcome-sources'}.json`,
  );
  const raw = await readLockedSources(manifest);
  const start = shiftMonth(id, -12),
    end = starting ? id : shiftMonth(id, 60);
  const series = Object.fromEntries(
    inputs.hot_stocks.map((stock) => {
      const source = manifest.sources.find(
        (row) => row.series_id === stock.ticker,
      );
      if (!source) throw new Error(`Missing Yahoo source ${stock.ticker}`);
      const prices = parseYahooChart(raw[source.id], stock.ticker, start, end);
      return [
        stock.ticker,
        {
          symbol: stock.ticker,
          prices,
          observations: adjustedPriceReturns(prices),
        },
      ];
    }),
  );
  await writeJson(
    `${paths.stocks}/${starting ? 'starting' : 'monthly-returns'}.json`,
    { schema_version: 1, currency: 'USD', series },
    process.argv.includes('--check'),
  );
}
