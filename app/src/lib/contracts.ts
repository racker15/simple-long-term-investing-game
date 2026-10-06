import { Type, type Static, type TSchema } from '@sinclair/typebox';

export const BROAD_ASSET_IDS = [
  'cash',
  'bonds',
  'us_total',
  'international_ex_us',
] as const;
export type BroadAssetId = (typeof BROAD_ASSET_IDS)[number];
export type HotStockId = `hot:${string}:${string}`;
export type AssetId = BroadAssetId | HotStockId;
export const INITIAL_CAPITAL = 10_000;
export const ALLOCATION_STEP = 500;
export const HOLDING_MONTHS = 60;
export const SESSION_LENGTHS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] as const;
export const DEFAULT_SESSION_LENGTH = 10;
const object = <T extends Record<string, TSchema>>(fields: T) =>
  Type.Object(fields, { additionalProperties: false });
const text = () => Type.String({ minLength: 1 });
const date = () => Type.String({ format: 'date' });
const timestamp = () => Type.String({ format: 'date-time' });
const hotStockIdSchema = Type.Unsafe<HotStockId>(
  Type.String({ pattern: '^hot:[a-z0-9-]+:[a-z0-9-]+$' }),
);
export const assetIdSchema = Type.Unsafe<AssetId>(
  Type.Union([
    ...BROAD_ASSET_IDS.map((id) => Type.Literal(id)),
    hotStockIdSchema,
  ]),
);
const sourceIds = Type.Array(text(), { minItems: 1, uniqueItems: true });
const recent = { three_month: Type.Number(), one_year: Type.Number() };
export const provenanceRecordSchema = object({
  id: text(),
  source_name: text(),
  source_reference: text(),
  observation_date: Type.Optional(date()),
  publication_date: Type.Union([date(), Type.Null()]),
  retrieved_at: date(),
  approximation: Type.Boolean(),
  notes: Type.String(),
});
export const metadataSchema = object({
  scenario_id: Type.String({ pattern: '^[a-z0-9-]+$' }),
  date: date(),
  display_date: text(),
  data_kind: Type.Union([
    Type.Literal('development_fixture'),
    Type.Literal('historical'),
  ]),
  selection: Type.Union([
    object({ mode: Type.Literal('important'), selection_reason: text() }),
    object({
      mode: Type.Literal('random'),
      draw_universe: text(),
      random_seed: text(),
      draw_index: Type.Integer({ minimum: 0 }),
      method: text(),
      exclusions: Type.Array(text()),
      replacement_for: Type.Union([Type.Null(), text()]),
    }),
  ]),
});
export const knownAtStartSchema = object({
  metadata: metadataSchema,
  headlines: Type.Array(
    object({
      headline: text(),
      category: text(),
      summary: text(),
      selection_note: text(),
      source_ids: sourceIds,
    }),
    { minItems: 1 },
  ),
  macro: Type.Array(
    object({
      label: text(),
      value: Type.Number(),
      unit: text(),
      source_ids: sourceIds,
    }),
    { minItems: 1 },
  ),
  forecasts: Type.Array(object({ text: text(), source_ids: sourceIds }), {
    minItems: 1,
  }),
  recent_returns: Type.Array(
    object({
      asset_id: Type.Union(BROAD_ASSET_IDS.map((id) => Type.Literal(id))),
      ...recent,
      source_ids: sourceIds,
    }),
    { minItems: 4, maxItems: 4 },
  ),
  hot_stocks: Type.Array(
    object({
      id: hotStockIdSchema,
      company_name: text(),
      ticker: text(),
      description: text(),
      selection_rationale: text(),
      ...recent,
      source_ids: sourceIds,
    }),
    { minItems: 3, maxItems: 3 },
  ),
  asset_definitions: Type.Array(
    object({
      id: assetIdSchema,
      name: text(),
      description: text(),
      source_ids: sourceIds,
    }),
    { minItems: 7, maxItems: 7 },
  ),
});
const assetRecord = <T extends TSchema>(value: T) =>
  Type.Unsafe<Record<AssetId, Static<T>>>(
    Type.Record(
      Type.String({
        pattern:
          '^(cash|bonds|us_total|international_ex_us|hot:[a-z0-9-]+:[a-z0-9-]+)$',
      }),
      value,
      { additionalProperties: false, minProperties: 7, maxProperties: 7 },
    ),
  );
export const futureOutcomesSchema = object({
  scenario_id: text(),
  monthly_returns: assetRecord(
    Type.Array(
      object({
        month: Type.String({ pattern: '^\\d{4}-(0[1-9]|1[0-2])$' }),
        return: Type.Number({ minimum: -1 }),
      }),
      { minItems: 60, maxItems: 60 },
    ),
  ),
  return_sources: assetRecord(sourceIds),
  events: Type.Array(
    object({
      month: Type.String({ pattern: '^\\d{4}-(0[1-9]|1[0-2])$' }),
      title: text(),
      description: text(),
      source_ids: sourceIds,
    }),
    { minItems: 3, maxItems: 5 },
  ),
  what_happened_next: object({ text: text(), source_ids: sourceIds }),
  reflection: object({
    what_people_were_focused_on: text(),
    what_actually_mattered: text(),
    what_faded_away: text(),
    what_nobody_knew: text(),
    source_ids: sourceIds,
  }),
});
export const provenanceSchema = object({
  scenario_id: text(),
  sources: Type.Array(provenanceRecordSchema, { minItems: 1 }),
});
export type ScenarioMetadata = Static<typeof metadataSchema>;
export type KnownAtStart = Static<typeof knownAtStartSchema>;
export type FutureOutcomes = Static<typeof futureOutcomesSchema>;
export type Provenance = Static<typeof provenanceSchema>;
export type Scenario = {
  known: KnownAtStart;
  future: FutureOutcomes;
  provenance: Provenance;
};
export type Allocations = Record<AssetId, number>;
export type MonthlyReturns = FutureOutcomes['monthly_returns'];
export const scenarioResultSchema = object({
  scenario_id: text(),
  selection_mode: Type.Union([
    Type.Literal('important'),
    Type.Literal('random'),
  ]),
  allocations: assetRecord(
    Type.Integer({
      minimum: 0,
      maximum: INITIAL_CAPITAL,
      multipleOf: ALLOCATION_STEP,
    }),
  ),
  expected_winner: assetIdSchema,
  asset_ending_values: assetRecord(Type.Number({ minimum: 0 })),
  year_one_leader: assetIdSchema,
  ending_portfolio_value: Type.Number({ minimum: 0 }),
  ending_benchmark_value: Type.Number({ minimum: 0 }),
  max_drawdown: Type.Number({ minimum: 0, maximum: 1 }),
});
export type ScenarioResult = Static<typeof scenarioResultSchema>;
export const sessionSchema = object({
  schema_version: Type.Literal(1),
  session_id: text(),
  target_count: Type.Union(SESSION_LENGTHS.map((n) => Type.Literal(n))),
  scenario_ids: Type.Array(text(), { minItems: 5, maxItems: 50 }),
  current_index: Type.Integer({ minimum: 0, maximum: 50 }),
  completed: Type.Array(scenarioResultSchema, { maxItems: 50 }),
  started_at: timestamp(),
  ended_at: Type.Optional(timestamp()),
  development_mode: Type.Boolean(),
  phase: Type.Union(
    ['decision', 'reveal', 'checkpoint', 'final'].map((p) => Type.Literal(p)),
  ),
});
export type Session = Static<typeof sessionSchema>;
export const schemaRegistry = {
  metadata: metadataSchema,
  known_at_start: knownAtStartSchema,
  future_outcomes: futureOutcomesSchema,
  provenance: provenanceSchema,
  scenario_result: scenarioResultSchema,
  session: sessionSchema,
};

export function assetIds(known: KnownAtStart): AssetId[] {
  return [...BROAD_ASSET_IDS, ...known.hot_stocks.map((stock) => stock.id)];
}
