import { BROAD_ASSET_IDS } from '../../app/src/lib/contracts';
import {
  assertMonthlyReturns,
  treasuryReturns,
  type BroadDataset,
} from '../lib/monthly';
import {
  parseFrenchFactors,
  parseFrenchInternational,
  parseFredCsv,
} from '../lib/parsers';
import { readJson, writeJson } from '../lib/files';
import { readLockedSources, type SourceManifest } from '../lib/sources';

export function normalizeBroadAssets(
  raw: Record<string, string>,
): BroadDataset {
  const us = parseFrenchFactors(raw['french-us']);
  const international = parseFrenchInternational(raw['french-international']);
  const yields = parseFredCsv(raw['fred-gs5'], 'GS5');
  // Preserve a full extra year ahead of the requested 1980 starting era.
  // Explicit fixed endpoint keeps future upstream extensions out of this build.
  const withinCoverage = <T extends { month: string }>(rows: T[]) =>
    rows.filter((row) => row.month >= '1975-01' && row.month <= '2025-12');
  const dataset: BroadDataset = {
    schema_version: 1,
    currency: 'USD',
    series: {
      cash: {
        source_ids: ['french-us'],
        observations: withinCoverage(
          us.map((row) => ({ month: row.month, return: row.rf })),
        ),
      },
      bonds: {
        source_ids: ['fred-gs5'],
        observations: withinCoverage(treasuryReturns(yields)),
      },
      us_total: {
        source_ids: ['french-us'],
        observations: withinCoverage(
          us.map((row) => ({ month: row.month, return: row.market })),
        ),
      },
      international_ex_us: {
        source_ids: ['french-international'],
        observations: withinCoverage(
          international.map((row) => ({ month: row.month, return: row.value })),
        ),
      },
    },
  };
  for (const id of BROAD_ASSET_IDS) {
    const rows = dataset.series[id].observations;
    assertMonthlyReturns(rows);
    if (
      rows[0].month !== '1975-01' ||
      rows.at(-1)!.month !== '2025-12' ||
      rows.length !== 612
    )
      throw new Error(
        `${id}: require full January 1975–December 2025 coverage`,
      );
  }
  return dataset;
}

if (process.argv[1]?.endsWith('/normalize/broad-assets.ts')) {
  const manifest = await readJson<SourceManifest>(
    'data/normalized/broad-assets/sources.json',
  );
  const dataset = normalizeBroadAssets(await readLockedSources(manifest));
  await writeJson(
    'data/normalized/broad-assets/monthly-returns.json',
    dataset,
    process.argv.includes('--check'),
  );
  console.log(
    'Broad assets: 612 aligned monthly observations each, 1975-01–2025-12',
  );
}
