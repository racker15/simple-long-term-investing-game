import { adjustedPriceReturns } from '../lib/monthly';
import { parseYahooDailyCsv } from '../lib/parsers';
import { readJson, writeJson } from '../lib/files';
import { readLockedSources, type SourceManifest } from '../lib/sources';

export function normalizeStock(raw: string, symbol: string, end: string) {
  const prices = parseYahooDailyCsv(raw, symbol, '1998-09', end);
  return { symbol, prices, observations: adjustedPriceReturns(prices) };
}

if (process.argv[1]?.endsWith('/normalize/stocks.ts')) {
  const starting = process.argv.includes('--starting');
  const manifest = await readJson<SourceManifest>(
    'data/normalized/stocks/sources.json',
  );
  const raw = await readLockedSources(manifest);
  const series = Object.fromEntries(
    manifest.sources.map((source) => [
      source.series_id,
      normalizeStock(
        raw[source.id],
        source.series_id,
        starting ? '1999-09' : '2004-09',
      ),
    ]),
  );
  await writeJson(
    `data/normalized/stocks/${starting ? 'starting' : 'monthly-returns'}.json`,
    { schema_version: 1, currency: 'USD', series },
    process.argv.includes('--check'),
  );
}
