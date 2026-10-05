import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { assertAssetSet } from './portfolio';
import {
  assetIds,
  schemaRegistry,
  type Scenario,
  type Session,
  type KnownAtStart,
  type AssetId,
  type BroadAssetId,
  type HotStockId,
} from './contracts';

const ajv = new Ajv({ allErrors: true, strict: true, strictNumbers: true });
addFormats(ajv);
const validators = Object.fromEntries(
  Object.entries(schemaRegistry).map(([name, schema]) => [
    name,
    ajv.compile(schema),
  ]),
);
export type Issue = { path: string; message: string };
export type ValidationReport = {
  valid: boolean;
  errors: Issue[];
  warnings: Issue[];
};
export function structuralErrors(
  name: keyof typeof schemaRegistry,
  input: unknown,
): Issue[] {
  const validate = validators[name];
  return validate(input)
    ? []
    : (validate.errors ?? []).map((error) => ({
        path: error.instancePath || '/',
        message: `${error.message} ${JSON.stringify(error.params)}`,
      }));
}
function visitSources(
  value: unknown,
  path: string,
  callback: (id: string, path: string) => void,
) {
  if (Array.isArray(value))
    value.forEach((item, i) => visitSources(item, `${path}/${i}`, callback));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key === 'source_ids' && Array.isArray(item))
        item.forEach((id: string) => callback(id, `${path}/source_ids`));
      else visitSources(item, `${path}/${key}`, callback);
    }
  }
}
export function validateScenario(input: {
  known: unknown;
  future: unknown;
  provenance: unknown;
}): ValidationReport {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  for (const [part, schema] of [
    ['known', 'known_at_start'],
    ['future', 'future_outcomes'],
    ['provenance', 'provenance'],
  ] as const) {
    errors.push(
      ...structuralErrors(schema, input[part]).map((error) => ({
        ...error,
        path: `/${part}${error.path}`,
      })),
    );
  }
  if (errors.length) return { valid: false, errors, warnings };
  const { known, future, provenance } = input as Scenario;
  const fail = (path: string, message: string) =>
    errors.push({ path, message });
  const id = known.metadata.scenario_id;
  if (future.scenario_id !== id || provenance.scenario_id !== id)
    fail('/', 'All three scenario IDs must agree');
  const scenarioDate = known.metadata.date;
  const date = new Date(`${scenarioDate}T00:00:00Z`);
  const monthEnd = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  )
    .toISOString()
    .slice(0, 10);
  if (monthEnd !== scenarioDate)
    fail('/known/metadata/date', 'Use the calendar month-end convention');
  const ids = assetIds(known);
  if (new Set(ids).size !== 7)
    fail('/known/hot_stocks', 'Hot-stock IDs must be unique');
  known.hot_stocks.forEach((stock, i) => {
    if (!stock.id.startsWith(`hot:${id}:`))
      fail(
        `/known/hot_stocks/${i}/id`,
        `Hot-stock ID must start with hot:${id}:`,
      );
  });
  function exactAssets(actual: string[], path: string, expected = ids) {
    if (
      new Set(actual).size !== expected.length ||
      actual.length !== expected.length ||
      expected.some((id) => !actual.includes(id))
    )
      fail(path, `Expected exactly these asset IDs: ${expected.join(', ')}`);
  }
  exactAssets(
    known.asset_definitions.map((asset) => asset.id),
    '/known/asset_definitions',
  );
  exactAssets(
    known.recent_returns.map((asset) => asset.asset_id),
    '/known/recent_returns',
    ids.slice(0, 4),
  );
  exactAssets(Object.keys(future.monthly_returns), '/future/monthly_returns');
  exactAssets(Object.keys(future.return_sources), '/future/return_sources');
  const sources = new Map(
    provenance.sources.map((source) => [source.id, source]),
  );
  if (sources.size !== provenance.sources.length)
    fail('/provenance/sources', 'Source IDs must be unique');
  provenance.sources.forEach((source, i) => {
    if (
      source.observation_date &&
      source.observation_date > source.publication_date
    )
      fail(
        `/provenance/sources/${i}`,
        'Observation date must not follow publication date',
      );
    if (source.retrieved_at < source.publication_date)
      fail(
        `/provenance/sources/${i}`,
        'Retrieval date must not precede publication date',
      );
  });
  const checkSource = (
    sourceId: string,
    path: string,
    knownAtStart: boolean,
  ) => {
    const source = sources.get(sourceId);
    if (!source) fail(path, `Missing provenance record ${sourceId}`);
    else if (knownAtStart && source.publication_date > scenarioDate)
      fail(
        path,
        `Source ${sourceId} was published ${source.publication_date}, after scenario cutoff ${scenarioDate}`,
      );
  };
  visitSources(known, '/known', (id, path) => checkSource(id, path, true));
  visitSources(future, '/future', (id, path) => checkSource(id, path, false));
  Object.entries(future.return_sources).forEach(([id, refs]) =>
    refs.forEach((ref) =>
      checkSource(ref, `/future/return_sources/${id}`, false),
    ),
  );
  const months = Array.from({ length: 60 }, (_, i) =>
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + i + 1, 1))
      .toISOString()
      .slice(0, 7),
  );
  for (const [asset, series] of Object.entries(future.monthly_returns)) {
    const seen = new Set<string>();
    series.forEach((observation, i) => {
      const path = `/future/monthly_returns/${asset}/${i}`;
      if (seen.has(observation.month))
        fail(path, `Duplicate month ${observation.month}`);
      if (i && observation.month <= series[i - 1].month)
        fail(path, 'Months must be strictly ascending');
      if (observation.month !== months[i])
        fail(
          path,
          `Expected consecutive post-investment month ${months[i]}, got ${observation.month}`,
        );
      if (Math.abs(observation.return) > 0.8)
        warnings.push({
          path,
          message: `Monthly return ${observation.return} exceeds 80%; review source/corporate event`,
        });
      seen.add(observation.month);
    });
  }
  future.events.forEach((event, i) => {
    if (!months.includes(event.month))
      fail(
        `/future/events/${i}/month`,
        'Event must fall within the 60-month outcome window',
      );
  });
  return { valid: errors.length === 0, errors, warnings };
}
export function loadScenario(input: {
  known: unknown;
  future: unknown;
  provenance: unknown;
}): Scenario {
  const report = validateScenario(input);
  if (!report.valid)
    throw new Error(
      report.errors
        .map((error) => `${error.path}: ${error.message}`)
        .join('\n'),
    );
  return input as Scenario;
}
// Explicit player projection: nested fields are allowlisted, never copied wholesale.
export type DecisionHeadline = {
  headline: string;
  category: string;
  summary: string;
};
export type DecisionMacro = { label: string; value: number; unit: string };
export type DecisionForecast = { text: string };
export type DecisionRecentReturn = {
  asset_id: BroadAssetId;
  three_month: number;
  one_year: number;
};
export type DecisionHotStock = {
  id: HotStockId;
  company_name: string;
  ticker: string;
  description: string;
  three_month: number;
  one_year: number;
};
export type DecisionAsset = { id: AssetId; name: string; description: string };
export type DecisionContext = {
  date: string;
  display_date: string;
  headlines: DecisionHeadline[];
  macro: DecisionMacro[];
  forecasts: DecisionForecast[];
  recent_returns: DecisionRecentReturn[];
  hot_stocks: DecisionHotStock[];
  asset_definitions: DecisionAsset[];
};
export function decisionContext(known: KnownAtStart): DecisionContext {
  return {
    date: known.metadata.date,
    display_date: known.metadata.display_date,
    headlines: known.headlines.map(({ headline, category, summary }) => ({
      headline,
      category,
      summary,
    })),
    macro: known.macro.map(({ label, value, unit }) => ({
      label,
      value,
      unit,
    })),
    forecasts: known.forecasts.map(({ text }) => ({ text })),
    recent_returns: known.recent_returns.map(
      ({ asset_id, three_month, one_year }) => ({
        asset_id,
        three_month,
        one_year,
      }),
    ),
    hot_stocks: known.hot_stocks.map(
      ({ id, company_name, ticker, description, three_month, one_year }) => ({
        id,
        company_name,
        ticker,
        description,
        three_month,
        one_year,
      }),
    ),
    asset_definitions: known.asset_definitions.map(
      ({ id, name, description }) => ({ id, name, description }),
    ),
  };
}
export function validateSession(input: unknown): input is Session {
  if (structuralErrors('session', input).length) return false;
  const session = input as Session;
  if (
    session.scenario_ids.length !== session.target_count ||
    session.current_index !== session.completed.length
  )
    return false;
  if (
    !session.development_mode &&
    new Set(session.scenario_ids).size !== session.target_count
  )
    return false;
  if (
    session.completed.some((result, i) => {
      const ids = Object.keys(result.allocations);
      try {
        assertAssetSet(ids);
      } catch {
        return true;
      }
      if (
        ids.some(
          (id) =>
            id.startsWith('hot:') &&
            !id.startsWith(`hot:${result.scenario_id}:`),
        )
      )
        return true;
      return (
        result.scenario_id !== session.scenario_ids[i] ||
        Object.values(result.allocations).reduce((a, b) => a + b, 0) !==
          10000 ||
        !ids.includes(result.expected_winner) ||
        !ids.includes(result.year_one_leader) ||
        ids.some((id) => !(id in result.asset_ending_values))
      );
    })
  )
    return false;
  const count = session.completed.length;
  if (session.phase === 'reveal' && count === 0) return false;
  if (session.phase === 'decision' && count >= session.target_count)
    return false;
  if (
    session.phase === 'checkpoint' &&
    (count === 0 || count % 5 !== 0 || count >= session.target_count)
  )
    return false;
  if (
    session.phase === 'final' &&
    (count === 0 || count % 5 !== 0 || !session.ended_at)
  )
    return false;
  if (session.phase !== 'final' && session.ended_at) return false;
  if (
    session.ended_at &&
    Date.parse(session.ended_at) < Date.parse(session.started_at)
  )
    return false;
  return true;
}
