// Deterministic fictional test material. This script retrieves no historical data.
import { writeFile } from 'node:fs/promises';
import { BROAD_ASSET_IDS } from '../../app/src/lib/contracts';
import { format, resolveConfig } from 'prettier';
const scenario_id = 'dev-fictional';
const broad = [...BROAD_ASSET_IDS];
const hot = ['acme', 'telecom', 'retail'].map(
  (slug) => `hot:${scenario_id}:${slug}`,
);
const ids = [...broad, ...hot];
const names = [
  'Cash',
  'Bonds',
  'US Total Market',
  'International ex-US',
  'Acme Computing',
  'Example Telecom',
  'Sample Retail',
];
const descriptions = [
  'Short-term Treasury-style cash equivalent.',
  'Loans to governments and companies.',
  'A little piece of thousands of US companies.',
  'A little piece of companies outside the United States.',
  'Fictional computing company drawing attention to its new devices.',
  'Fictional telecom company expanding its network.',
  'Fictional retailer opening neighborhood stores.',
];
const before = ['fictional-start'];
const after = ['fictional-outcomes'];
const known = {
  metadata: {
    scenario_id,
    date: '2000-01-31',
    display_date: 'January 2000 — fictional development fixture',
    data_kind: 'development_fixture',
    selection: {
      mode: 'important',
      selection_reason:
        'Developer-selected fictional fixture; no historical significance is claimed.',
    },
  },
  headlines: [
    ['business', 'Acme announces a new pocket computer'],
    ['business', 'Example Telecom plans a nationwide expansion'],
    ['US', 'Imaginary city debates a new library'],
    ['global', 'Fictional countries propose a rail link'],
    ['science', 'Example laboratory unveils a water filter'],
    ['culture', 'Sample film festival draws record attendance'],
  ].map(([category, headline]) => ({
    headline,
    category,
    summary:
      'Invented news for development testing; this is not a real historical story.',
    selection_note: 'Exercise the known-at-start view.',
    source_ids: before,
  })),
  macro: [
    ['Inflation', 2.5, '%'],
    ['Unemployment', 4.2, '%'],
    ['Policy rate', 4.5, '%'],
    ['10-year Treasury', 5, '%'],
    ['Consumer sentiment', 110, 'index'],
    ['Forecast contraction probability', 18, '%'],
  ].map(([label, value, unit]) => ({ label, value, unit, source_ids: before })),
  forecasts: [
    {
      text: 'Fictional forecasters expect moderate growth, with disagreement about its pace.',
      source_ids: before,
    },
  ],
  recent_returns: broad.map((asset_id, i) => ({
    asset_id,
    three_month: [0.01, 0.02, 0.08, 0.05][i],
    one_year: [0.04, 0.05, 0.18, 0.12][i],
    source_ids: before,
  })),
  hot_stocks: hot.map((id, i) => ({
    id,
    company_name: names[i + 4],
    ticker: ['ACME-FAKE', 'EXT-FAKE', 'SAM-FAKE'][i],
    description: descriptions[i + 4],
    selection_rationale:
      'Fictional contemporary attention; chosen to exercise development contracts.',
    three_month: [0.2, 0.15, 0.08][i],
    one_year: [0.7, 0.4, 0.2][i],
    source_ids: before,
  })),
  asset_definitions: ids.map((id, i) => ({
    id,
    name: names[i],
    description: descriptions[i],
    source_ids: before,
  })),
};
function monthlyReturn(asset: number, month: number) {
  if (asset === 0) return 0.002;
  if (asset === 1) return month >= 18 && month <= 22 ? -0.01 : 0.003;
  if (asset === 2) return month >= 18 && month <= 22 ? -0.09 : 0.009;
  if (asset === 3) return month >= 18 && month <= 22 ? -0.08 : 0.007;
  if (asset === 4)
    return month <= 12 ? 0.04 : month === 18 || month === 19 ? -0.4 : 0.008;
  if (asset === 5) return month === 36 ? -1 : month > 36 ? 0 : 0.015;
  return month <= 12 ? 0.01 : month >= 18 && month <= 22 ? -0.05 : 0.04;
}
const future = {
  scenario_id,
  monthly_returns: Object.fromEntries(
    ids.map((id, asset) => [
      id,
      Array.from({ length: 60 }, (_, i) => ({
        month: new Date(Date.UTC(2000, i + 1, 1)).toISOString().slice(0, 7),
        return: monthlyReturn(asset, i + 1),
      })),
    ]),
  ),
  return_sources: Object.fromEntries(ids.map((id) => [id, after])),
  events: [
    [12, 'Acme draws attention'],
    [18, 'Fictional expansion stalls'],
    [36, 'Example Telecom becomes worthless'],
    [48, 'Sample Retail keeps growing'],
  ].map(([month, title]) => ({
    month: new Date(Date.UTC(2000, Number(month), 1)).toISOString().slice(0, 7),
    title,
    description:
      'Invented event marker for development. It is context for this synthetic path, not a claim about real history or simple market causality.',
    source_ids: after,
  })),
  what_happened_next: {
    text: 'This entire scenario is invented for development and testing. Acme Computing leads after the first year, while Sample Retail eventually ends with the highest five-year value. An intermediate decline tests whether the engine measures peak-to-trough drawdowns rather than just losses from the initial investment. Example Telecom becomes worthless, testing that a stock position remains at zero after bankruptcy. Broad investments also fall during the synthetic downturn before recovering. The fictional headlines, economic readings, forecasts, companies, and monthly returns were constructed to exercise software behavior. None of these values describe historical markets. They are not investment advice or evidence for how any asset class usually performs. The fixture makes no claim that hot stocks must fail or that diversified portfolios must win. One fictional stock wins while another reaches zero. Real scenarios will need public sources, a documented selection process, and independent editorial review. This development example exists only to test the flow from a decision made with limited information to an outcome and descriptive scorecard.',
    source_ids: after,
  },
  reflection: {
    what_people_were_focused_on:
      'In this fictional setting, new devices and network expansion attracted attention.',
    what_actually_mattered:
      'The synthetic path includes a downturn, recovery, steady retailer growth, and one bankruptcy.',
    what_faded_away:
      'The invented film festival and library debate did not determine these generated returns.',
    what_nobody_knew:
      'The future synthetic downturn and company outcomes were absent from the starting information.',
    source_ids: after,
  },
};
const provenance = {
  scenario_id,
  sources: [
    {
      id: before[0],
      source_name: 'Fictional fixture author',
      source_reference: 'repository:scripts/build/dummy-fixture.ts#known',
      observation_date: '2000-01-01',
      publication_date: '2000-01-30',
      retrieved_at: '2026-10-05',
      approximation: true,
      notes:
        'All dates and facts invented. Publication date models the cutoff for tests; no real publication exists.',
    },
    {
      id: after[0],
      source_name: 'Synthetic return generator',
      source_reference:
        'repository:scripts/build/dummy-fixture.ts#monthlyReturn',
      observation_date: '2005-01-31',
      publication_date: '2005-02-01',
      retrieved_at: '2026-10-05',
      approximation: true,
      notes:
        'Invented deterministic monthly returns, events and reflection. Not historical data.',
    },
  ],
};
for (const [name, value] of Object.entries({
  known_at_start: known,
  future_outcomes: future,
  provenance,
}))
  await writeFile(
    `data/scenarios/${scenario_id}/${name}.json`,
    await format(JSON.stringify(value), {
      ...(await resolveConfig('.prettierrc.json')),
      parser: 'json',
    }),
  );
