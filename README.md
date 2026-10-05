# Long-term investing game

An educational static web application about making a five-year investing decision with only the information available at the starting date. Players allocate $10,000, predict one investment winner, lock the decision, and inspect the path and descriptive scorecards. Benchmark outperformance is a comparison, never a game score.

**Current milestone: foundation plus one fictional end-to-end development fixture.** No historical research or real return data has been collected. All demo news, macro readings, companies, events, and returns are invented. The development UI repeats this single fixture to exercise 5/10/15/20-scenario sessions; production queues never allow duplicates.

The product sources remain [investing-game-specification.md](investing-game-specification.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Run locally

Use Node.js 22.12+ (CI uses Node 24) and npm.

```sh
npm ci
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). No account, server, API keys, database, or external runtime data service is required.

```sh
npm run format       # format implementation files; preserve the product source documents
npm run typecheck
npm test             # deterministic unit and server-rendered firewall tests
npm run validate     # validate every committed scenario and recompute comparisons/winners
npm run schemas      # regenerate committed JSON schemas from canonical contracts
npm run check        # formatting + schema freshness + scenario validation + tests + build
npm run build        # static output in dist/
npm run preview      # serve that build locally
```

Browser checks cover desktop (1280×900) and mobile (390×844):

```sh
npx playwright install --with-deps chromium
npm run test:browser
```

To use an installed Chromium instead of downloading one:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

The CI workflow runs both `npm run check` and browser tests. Browser screenshots are written to ignored `test-results/`. Any static host can serve `dist/`; relative asset URLs support subdirectory hosting. This milestone does not publish or deploy the site.

## Architecture

- `app/src/lib/contracts.ts`: canonical TypeScript contracts and TypeBox schema definitions. The six committed `schemas/*.schema.json` files are generated from these definitions, not maintained separately. CI fails if they drift.
- `app/src/lib/validation.ts`: Ajv structural validation, cross-file/date/source validation, scenario loading, saved-session validation, and an explicit player-facing starting-context projection.
- `app/src/lib/portfolio.ts`: pure allocation normalization, monthly buy-and-hold paths, drawdowns, comparisons, and rankings.
- `app/src/lib/queue.ts`: seeded production session queues.
- `app/src/lib/results.ts`, `scorecards.ts`, `session.ts`: result construction, aggregation, and explicit decision/reveal/checkpoint/final transitions.
- `app/src/components/`: starting scenario, allocation/prediction/confirmation, progressive SVG chart, outcome/reflection, checkpoint, and final scorecard components.
- `app/src/data/fixture.ts`: validated fixture loader. `App.tsx` is the small React coordinator and local-storage adapter.
- `data/scenarios/dev-fictional/`: the one committed, clearly labeled fictional fixture.
- `scripts/build/`: deterministic schema export and fictional fixture generator. `scripts/validate/`: collection validation and recomputation.
- `tests/`: hand-checkable math fixtures, invalid-data cases, seeded queues, scorecards, session transitions, information-firewall rendering, and browser journeys.

The app uses React, Vite, and strict TypeScript, with ordinary component state. SVG supplies the small three-line chart and clickable event markers; no chart or state-management framework is needed. There is no backend. Ajv checks the same schemas used to derive TypeScript types.

## Canonical scenario contracts

Each scenario directory has three JSON files:

| File                   | Content                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `known_at_start.json`  | Metadata, contemporary headlines, macro values, forecasts, four broad-asset recent returns, exactly three hot stocks, seven asset definitions, and source references            |
| `future_outcomes.json` | Matching scenario ID, exactly 60 monthly return observations for each asset, per-series source references, 3–5 event annotations, explanation, and the four reflection sections |
| `provenance.json`      | Matching scenario ID and reusable source records: source name/reference, optional observation date, publication date, retrieval date, approximation flag, and notes             |

Metadata includes scenario ID, ISO scenario date, display date, `data_kind` (`historical` or `development_fixture`), and a discriminated selection object:

- `important`: nonempty selection reason;
- `random`: universe identifier, seed, draw index (zero-based), method, predeclared exclusions, and optional replacement reference represented as a string or `null`.

The four broad IDs are defined once: `cash`, `bonds`, `us_total`, `international_ex_us`. A hot-stock ID is `hot:<scenario-id>:<company-slug>`. All asset-keyed maps must match these seven playable investments exactly; IDs and their source references are cross-checked. Returns are decimal total returns (`0.05` means +5%, `-1` means complete loss). Dividends/corporate-action normalization belongs in the future data layer, never in UI code.

No stored benchmark series or winner summaries are accepted as scenario inputs. They are always recomputed from monthly returns, avoiding inconsistent duplicates.

### Information firewall

The starting content is physically separate from future outcomes. `ScenarioView` and `Allocation` receive only `DecisionContext`, produced from `KnownAtStart`. That projection uses explicit player-facing nested types and allowlists the displayed date, headline/category/summary, macro values, forecast text, recent returns, hot-stock identity/description/returns, and asset IDs/names/descriptions. It excludes scenario selection metadata, provenance, and all future outcomes. Headline selection notes, hot-stock selection rationales, and every nested source ID remain in the known bundle and are absent from `DecisionContext`, so pre-investment components never receive them. Future events, comparisons, ranks, and reflection render only after commitment. Cohort labels appear only in the final scorecard, never in a checkpoint.

All referenced pre-investment sources must have `publication_date <= scenario date`. Retrieval may be later: it describes when the project obtained a source, not when the information became public. Unknown references and invalid dates fail validation. Future source records are allowed in provenance but cannot be referenced from starting content.

This is a software/editorial invariant, not a security boundary. A static bundle is inspectable, and date checks cannot detect hindsight embedded in prose. Human editorial review and separately committed starting bundles remain necessary for real scenarios.

## Validation

Structural schemas reject missing/unknown fields, invalid selection variants, incomplete random provenance, anything other than three hot stocks/seven playable assets/60 returns, malformed dates, non-finite numbers, and returns below −100%.

The deterministic cross-file validator checks matching scenario IDs, unique stock/source IDs, scenario-specific stock IDs, exact asset sets, four distinct broad recent-return rows, referenced provenance, publication cutoff, sensible observation/publication/retrieval order, calendar month-end scenario dates, consecutive aligned outcome months, duplicate or unsorted months, and events outside the outcome window. Errors include the relevant JSON path and corrective detail.

Absolute monthly returns **greater than 80%** produce review warnings, not rejection. The fictional bankruptcy deliberately triggers this warning. Warnings require source review for real data; they do not imply that bankruptcy or a large legitimate gain is invalid. The validation command also computes portfolio/benchmark paths and asset winners so non-finite compounded outcomes fail.

## Portfolio, results, and session state

Initial capital is exactly $10,000. Explicit allocations must be finite nonnegative $500 multiples, use only playable assets, and total at most $10,000. In the allocation editor, Cash is the prominently displayed residual with no +/− controls. The other six investments use $500 controls: adding reduces Cash and removing increases it, keeping the seven final allocations at exactly $10,000. Cash remains selectable for the winner prediction and appears in confirmation, calculations, and rankings. The engine also accepts normalized seven-asset allocations, adding any unallocated remainder to Cash. Positions compound independently each month with no trading or rebalancing. A −100% return makes the position permanently zero. No intermediate rounding is applied; display formatting rounds dollars only.

Paths include each asset position, monthly total, ending value, total return, maximum drawdown, highest value, and lowest value. Drawdown and extrema include the initial $10,000 observation. The diversified comparison starts with $6,000 US Total, $2,000 international ex-US, and $2,000 bonds. The standalone US comparison starts with $10,000 US Total. Both use the identical buy-and-hold engine.

Every investment is ranked from the same normalized $10,000 starting value. `ScenarioResult` retains normalized allocations, expected winner, normalized asset ending values, year-one leader, ending player/benchmark values, max drawdown, and cohort. Actual winner, predicted rank, year-five leader, and reversal are derived from that record. Actual winner and year-five leader are the same value and are not stored twice.

`Session` stores schema version, session ID, target count, ordered scenario IDs, current index (the number of locked results), completed results, start/end timestamps, development flag, and explicit phase. Only the current decision can be locked; repeated commits fail. Every five results creates a checkpoint, target completion creates the final scorecard, and early ending is permitted only at a checkpoint.

Active development sessions survive refresh via a versioned local-storage key, with schema/invariant validation on restoration. Completed summaries use a separate development-only key and are saved once per session ID. Uncommitted allocation/prediction drafts reset on refresh. Storage failures show a message while allowing in-memory play. The fixture demonstration does not create production lifetime history or mark a real scenario completed.

## Explicit conventions and ambiguous choices

These fill in unspecified thresholds/conventions; they do not change the product specification:

1. **Dates:** calendar month-end scenario cutoff; monthly outcomes run from the following calendar month through month 60. All assets share the same months.
2. **Ties:** exact equal ending values receive distinct ordinal ranks using Cash, Bonds, US Total, International ex-US, then hot-stock IDs in lexical order. The same rule applies to year-one leaders and predicted-winner correctness. There is no tolerance-based tie grouping.
3. **Bottom half:** ranks 5–7; the middle rank 4 is excluded.
4. **Concentration:** at least 50% of initial capital in any single investment, including Cash. It describes behavior without judging the choice.
5. **Cohort statistics:** at least five results in a subgroup. Smaller groups return `null`, and the UI explains why the summary is withheld. The repeated fixture is explicitly unsuitable for historical inference even when this count is reached.
6. **Queue precedence:** maximize unseen scenarios first, then minimize full-session cohort imbalance among feasible choices. When this priority or cohort shortages prevent balance, the queue degrades without duplicates. Balanced pools produce alternating 2/3 and 3/2 five-scenario blocks and randomized order, reproducibly from a seed. Source-library input order does not affect the output.
7. **Foundation scope:** the requested domain-first vertical slice combines the plan's schema and game-loop milestones using dummy data. Real pipelines, random-date drawing, production library loading, polished design, and lifetime history remain later work.

Scorecards use the same aggregation primitive for blocks, overall results, and sufficiently large cohort groups. They show average allocations, concentration count/frequency, prediction hits/bottom-three finishes, leader reversals, average player/benchmark values, strict benchmark-beating counts (ties do not beat), 20%+ drawdown count, and largest drawdown. Final cards add median ending value, prediction hit rate, reversal frequency, and every completed five-result block. Ending values summarize independent $10,000 scenarios; they are not sequential wealth accumulation. No overall score, grade, points, or leaderboard is calculated.

## Adding a real scenario

1. Establish date-selection provenance before examining future returns. For a random date, define the universe, exclusions, method, seed, and draw index; retain valid uneventful outcomes.
2. Create `data/scenarios/<scenario-id>/`. Consult the generated schemas and the fixture for structure, without copying its invented facts.
3. Research and commit `known_at_start.json` and starting provenance before outcome narratives. Set `data_kind` to `historical`. Retain contemporary sources for headlines, macro/forecast values, recent returns, hot-stock prominence, and asset definitions. Choose exactly three reconstructable stocks using starting information.
4. Build `future_outcomes.json` with 60 consecutive normalized monthly total returns per asset. Use the same ID set and calendar convention. Document approximations, corporate actions, and source metadata in provenance.
5. Add 3–5 sourced event markers, neutral explanation, and all four reflection sections. Check prose manually for hindsight leakage and unsupported causal claims.
6. Run `npm run validate` and `npm run check`; review extreme-return warnings. Add a loader/manifest entry when integrating the real library. Feed metadata to `buildSessionQueue`; pass only `decisionContext(known)` to starting components. Do not use the development duplicate queue for real sessions.
7. Preserve source retrieval scripts, permitted cached data/hashes, and editorial decisions so the scenario can be reconstructed. Schema changes must be deliberate, documented, regenerated, and tested.

The dummy files can be reproduced with `node --import tsx scripts/build/dummy-fixture.ts`. That script is a test fixture authoring tool, not a historical-data pipeline.

## Next milestone

Build the reproducible public-data pipeline for Cash, Bonds, US Total Market, and International ex-US, then assemble the first real scenario against these contracts. Define the random-date protocol before selecting the random pilot scenarios. Do not scale to 24/50 scenarios until sourcing, normalization, and editorial qualification are demonstrated.
