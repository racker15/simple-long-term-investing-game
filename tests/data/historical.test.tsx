import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import broadJson from '../../data/normalized/broad-assets/monthly-returns.json';
import stocksJson from '../../data/normalized/stocks/monthly-returns.json';
import startsJson from '../../data/normalized/stocks/starting.json';
import startingInputsJson from '../../data/research/1999-09/starting-inputs.json';
import editorialJson from '../../data/research/1999-09/outcome-inputs.json';
import known from '../../data/scenarios/1999-09/known_at_start.json';
import future from '../../data/scenarios/1999-09/future_outcomes.json';
import provenance from '../../data/scenarios/1999-09/provenance.json';
import broadManifest from '../../data/normalized/broad-assets/sources.json';
import stockManifest from '../../data/normalized/stocks/sources.json';
import candidates from '../../data/research/1999-09/candidate-pool.json';
import { BROAD_ASSET_IDS, assetIds } from '../../app/src/lib/contracts';
import {
  decisionContext,
  loadScenario,
  validateScenario,
} from '../../app/src/lib/validation';
import { buildSessionQueue } from '../../app/src/lib/queue';
import {
  historicalDecisionContext,
  loadHistoricalScenario,
  productionLibrary,
} from '../../app/src/data/historical';
import { ScenarioView } from '../../app/src/components/ScenarioView';
import { Allocation } from '../../app/src/components/Allocation';
import {
  assertMonthlyReturns,
  getBroadAssetScenarioWindow,
  compound,
  type BroadDataset,
} from '../../scripts/lib/monthly';
import {
  parseFrenchInternational,
  parseYahooDailyCsv,
} from '../../scripts/lib/parsers';
import { sha256 } from '../../scripts/lib/files';
import {
  readLockedSources,
  type SourceManifest,
} from '../../scripts/lib/sources';
import {
  assertStartingLock,
  buildKnown,
  type StartingInputs,
  type StockDataset,
} from '../../scripts/build/historical';
import { buildFuture, type OutcomeInputs } from '../../scripts/build/outcomes';

const broad = broadJson as BroadDataset;
const stocks = stocksJson as StockDataset;
const starts = startsJson as StockDataset;
const inputs = startingInputsJson as StartingInputs;
const editorial = editorialJson as OutcomeInputs;
const scenario = loadScenario({ known, future, provenance });

describe('canonical public datasets', () => {
  it('has consecutive finite decimal returns and resolves every broad/stock source lock', () => {
    const sources = new Map(
      [...broadManifest.sources, ...stockManifest.sources].map((source) => [
        source.id,
        source,
      ]),
    );
    for (const id of BROAD_ASSET_IDS) {
      const series = broad.series[id];
      assertMonthlyReturns(series.observations);
      expect(series.observations).toHaveLength(612);
      expect(series.observations[0].month).toBe('1975-01');
      expect(series.observations.at(-1)!.month).toBe('2025-12');
      for (const sourceId of series.source_ids)
        expect(sources.has(sourceId)).toBe(true);
      for (const date of ['1980-01-31', '2020-12-31']) {
        const window = getBroadAssetScenarioWindow(broad, date, id);
        expect(window.futureMonthlyReturns).toHaveLength(60);
        expect(Number.isFinite(window.trailingOneYearReturn)).toBe(true);
      }
      expect(() =>
        getBroadAssetScenarioWindow(broad, '2021-01-31', id),
      ).toThrow('2026-01');
    }
    for (const source of sources.values()) {
      expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(source.download_url).toMatch(
        /raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[a-f0-9]{40}\//,
      );
    }
    for (const series of Object.values(stocks.series)) {
      assertMonthlyReturns(series.observations);
      expect(series.prices).toHaveLength(73);
      expect(series.observations).toHaveLength(72);
      expect(compound(series.observations)).toBeCloseTo(
        series.prices.at(-1)!.value / series.prices[0].value - 1,
        12,
      );
    }
  });
  it('selects the USD dividend-inclusive international market table, not local or price-only tables', () => {
    const text =
      'Preamble\nValue-Weight Dollar Returns      All 4 Data Items Not Reqd\n\nMkt   High    Low   High    Low   High    Low   High    Low   Zero\n199908  2.00 1 2 3 4 5 6 7 8 9\n199909 -3.00 1 2 3 4 5 6 7 8 9\n\nValue-Weight Local Returns\n199908 999\n';
    expect(parseFrenchInternational(text)).toEqual([
      { month: '1999-08', value: 0.02 },
      { month: '1999-09', value: -0.03 },
    ]);
    expect(() =>
      parseFrenchInternational(text.replace('-3.00', '-99.99')),
    ).toThrow('sentinel');
    expect(() =>
      parseFrenchInternational(text.replace('199909', '199908')),
    ).toThrow();
    expect(() =>
      parseFrenchInternational(text.replace('Dollar', 'Local')),
    ).toThrow();
  });
  it('uses last trading adjusted close, accepts reverse order, and rejects incomplete or invalid daily inputs', () => {
    const header = 'Symbol,Date,Open,High,Low,Close,Volume,Adj Close\n';
    const rows = [
      'TEST,1999-10-29,1,1,1,999,1,15',
      'TEST,1999-09-30,1,1,1,999,1,10',
      'TEST,1999-09-29,1,1,1,999,1,8',
    ];
    const parse = (body: string) =>
      parseYahooDailyCsv(header + body, 'TEST', '1999-09', '1999-10');
    expect(parse(rows.join('\n'))).toEqual([
      { month: '1999-09', value: 10 },
      { month: '1999-10', value: 15 },
    ]);
    expect(parse([...rows].reverse().join('\n'))).toEqual(
      parse(rows.join('\n')),
    );
    expect(() => parse([...rows, rows[0]].join('\n'))).toThrow('Duplicate');
    expect(() => parse(rows.slice(1).join('\n'))).toThrow('endpoint');
    expect(() =>
      parse(rows.join('\n').replace('1999-10-29', '1999-10-01')),
    ).toThrow('Stale');
    expect(() =>
      parse(rows.join('\n').replace('1999-09-30', '1999-09-31')),
    ).toThrow('Invalid');
    expect(() => parse(rows.join('\n').replace(',15', ',0'))).toThrow(
      'invalid price',
    );
    expect(() => parse(rows.join('\n').replace(',15', ',NaN'))).toThrow(
      'invalid',
    );
    expect(() =>
      parse(rows.join('\n').replace('TEST,1999-10', 'OTHER,1999-10')),
    ).toThrow('Invalid');
  });
  it('fails closed when a downloaded raw payload differs from its checksum', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'historical-sources-'));
    try {
      const path = join(dir, 'raw.csv');
      const payload = 'DATE,GS5\n1999-09-01,5.7\n';
      await writeFile(path, payload);
      const manifest: SourceManifest = {
        schema_version: 1,
        sources: [
          {
            id: 'sample',
            source_name: 'test',
            canonical_url: 'https://example.test',
            download_url: 'https://example.test/data',
            series_id: 'GS5',
            raw_path: path,
            sha256: sha256(payload),
            retrieved_at: '2026-10-05',
            transformation: 'test',
          },
        ],
      };
      expect(await readLockedSources(manifest)).toEqual({ sample: payload });
      await writeFile(path, payload + 'changed');
      await expect(readLockedSources(manifest)).rejects.toThrow(
        'checksum mismatch',
      );
    } finally {
      await rm(dir, { recursive: true });
    }
  });
});

describe('September 1999 historical pilot', () => {
  it('passes the unchanged contract, all source dates/IDs, and exact seven-by-sixty horizon', () => {
    expect(validateScenario({ known, future, provenance })).toEqual({
      valid: true,
      errors: [],
      warnings: [],
    });
    expect(scenario.known.metadata.selection.mode).toBe('important');
    expect(scenario.known.metadata.data_kind).toBe('historical');
    expect(scenario.known.hot_stocks).toHaveLength(3);
    expect(scenario.known.macro).toHaveLength(6);
    expect(scenario.known.headlines).toHaveLength(8);
    expect(assetIds(scenario.known)).toHaveLength(7);
    for (const rows of Object.values(scenario.future.monthly_returns)) {
      expect(rows).toHaveLength(60);
      expect(rows[0].month).toBe('1999-10');
      expect(rows.at(-1)!.month).toBe('2004-09');
      assertMonthlyReturns(rows);
    }
    expect(
      scenario.future.what_happened_next.text.split(/\s+/).length,
    ).toBeGreaterThanOrEqual(150);
    expect(
      scenario.future.what_happened_next.text.split(/\s+/).length,
    ).toBeLessThanOrEqual(250);
    expect(candidates.news_candidates.length).toBeGreaterThanOrEqual(50);
    expect(
      candidates.stock_candidates
        .filter((stock) => stock.selected)
        .map((stock) => stock.ticker),
    ).toEqual(scenario.known.hot_stocks.map((stock) => stock.ticker));
    const afterCutoff = structuredClone(provenance);
    afterCutoff.sources.find(
      (source) => source.id === 'bls-jobs-aug',
    )!.publication_date = '1999-10-08';
    expect(
      validateScenario({ known, future, provenance: afterCutoff }).valid,
    ).toBe(false);
    for (const id of ['asof-broad-proxies', 'asof-stock-prices']) {
      const source = scenario.provenance.sources.find(
        (record) => record.id === id,
      )!;
      expect(source.approximation).toBe(true);
      expect(source.notes).toContain('NOT the publication date');
    }
    expect(
      scenario.provenance.sources.find((record) => record.id === 'yahoo-msft')!
        .publication_date,
    ).toBe('2016-05-03');
  });
  it('rebuilds deterministically from locked inputs without manually entered returns', async () => {
    await assertStartingLock();
    expect(buildKnown(inputs, broad, starts)).toEqual(known);
    expect(buildFuture(scenario.known, broad, stocks, editorial)).toEqual(
      future,
    );
    const changed = structuredClone(broad);
    for (const series of Object.values(changed.series))
      series.observations
        .filter((row) => row.month > '1999-09')
        .forEach((row) => {
          row.return = 0.5;
        });
    expect(buildKnown(inputs, changed, starts)).toEqual(known);
    expect(() => buildKnown(inputs, broad, stocks)).toThrow(
      'future observations',
    );
    const stale = structuredClone(stocks);
    stale.series.MSFT.observations[0].return += 0.01;
    expect(() => buildFuture(scenario.known, broad, stale, editorial)).toThrow(
      'disagree',
    );
  });
  it('loads the pilot through the qualified registry and rejects missing scenarios', async () => {
    expect(productionLibrary).toContainEqual({
      scenario_id: '1999-09',
      selection_mode: 'important',
    });
    expect(await loadHistoricalScenario('1999-09')).toEqual(scenario);
    expect(historicalDecisionContext('1999-09')).toEqual(
      decisionContext(scenario.known),
    );
    expect(() => historicalDecisionContext('dev-fictional')).toThrow('Unknown');
    await expect(loadHistoricalScenario('missing')).rejects.toThrow('Unknown');
    expect(
      new Set(buildSessionQueue(productionLibrary, 5, [], 'pilot')).size,
    ).toBe(5);
  });
  it('renders only the decision projection, without cohort, selection notes, citations, or future text', () => {
    const context = historicalDecisionContext('1999-09');
    const html = renderToStaticMarkup(
      <>
        <ScenarioView context={context} />
        <Allocation context={context} onCommit={() => {}} />
      </>,
    );
    expect(html).toContain('September 30, 1999');
    expect(html).toContain('Serena Williams');
    expect(html).toContain('Dreamcast');
    expect(html).toContain('Microsoft');
    for (const text of [
      scenario.known.metadata.selection.mode,
      scenario.known.headlines[0].selection_note,
      scenario.known.hot_stocks[0].selection_rationale,
      scenario.future.events[0].title,
      scenario.future.what_happened_next.text,
      'source_ids',
      'source_reference',
    ])
      expect(html).not.toContain(text);
    expect(JSON.stringify(context)).not.toContain('future');
    expect(JSON.stringify(context)).not.toContain('selection');
  });
});
