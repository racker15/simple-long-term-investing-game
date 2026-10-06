# Long-term investing game

An educational static web application about making a five-year investing decision with only the information available at the starting date. Players allocate $10,000, predict one investment winner, lock the decision, and inspect the path and descriptive scorecards. Benchmark outperformance is a comparison, never a game score.

**Current milestone: a six-scenario historical qualification library.** The selected dates span 1982–2016, with three important dates and three preregistered random dates. Each completed scenario provides four broad-asset proxies, three contemporary stock selections and seven 60-month paths. Broad numerical coverage runs January 1975–December 2025. Qualification evidence and completed checks are recorded in [scenario qualification](docs/scenario-qualification.md). The normal `/` demo remains fictional and defaults to a ten-scenario demonstration. Six unique historical entries can support a five-scenario production queue; they cannot satisfy a ten-, fifteen- or twenty-scenario production request, and production queues never duplicate scenarios.

The product sources remain [investing-game-specification.md](investing-game-specification.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Expansion toward 50 scenarios

Draft expansion currently registers **26 complete historical scenarios**. Twenty additions from the 1980s and early 1990s are now complete from the preregistered 25-important/25-random plan. Their starting context was committed before outcome assembly. The original six pilot bundles remain unchanged. Closely spaced random dates and overlapping five-year windows are retained rather than screened for a preferred result. The normal demonstration remains fictional; content expansion does not itself enable the later production-session UI.

## Product scope

The intended audience is roughly **8–12 years old**. This project is a simple educational game, not a professional finance product or research-grade historical database.

Historical scenarios should be believable, materially accurate, and free of hindsight leakage, but the project deliberately accepts transparent approximations when extra precision would not meaningfully change the player's experience. Do not treat institutional-grade index reconstruction, exhaustive source corroboration, archive availability, or forensic corporate-action accounting as default release requirements.

**News-source variety is desirable**, especially when it helps avoid presenting one publication's editorial lens as the whole period, but it is not a hard quota. Use the best readily available contemporary sources and stop once the scenario is credible.

All player-facing historical news and summaries are stored in the static scenario data. The live app does **not** download publisher articles. External URLs are research/provenance references only, so an old source page becoming unavailable does not break the game.

The October 6 PR alignment follows the current educational scope while retaining the six-scenario work. Existing detailed audits and source-specific precision checks document this pilot; they are not a template for additional research infrastructure. [Scenario qualification](docs/scenario-qualification.md#october-6-scope-realignment) records the superseding lead direction and records October 5 verification and the passing October 6 checks.

## Run locally

Use Node.js 22.12+ (CI uses Node 24) and npm.

```sh
npm ci
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). No account, server, API keys, database, or external runtime data service is required.

During `npm run dev`, the isolated historical preview accepts every registered ID in `data/scenarios/manifest.json`. For example, open `http://localhost:5173/?scenario=1982-08`. The preview loads prepared outcomes only after investment, saves no session history, and is excluded from production builds. The normal `/` demo remains fictional. Registry and browser verification status are recorded in [scenario qualification](docs/scenario-qualification.md).

```sh
npm run format       # format implementation files; preserve the product source documents
npm run typecheck
npm test             # deterministic unit and server-rendered firewall tests
npm run validate     # validate every committed scenario and recompute comparisons/winners
npm run schemas      # regenerate committed JSON schemas from canonical contracts
npm run data:check   # offline deterministic scenario rebuild and starting-lock checks
npm run check        # formatting + schema/data freshness + validation + tests + build
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
- `app/src/data/historical.ts`: production manifest metadata, starting-context projection, and lazy static historical outcome loader.
- `data/scenarios/dev-fictional/`: the one committed, clearly labeled fictional fixture.
- `data/scenarios/<YYYY-MM>/`: six selected historical scenarios; `manifest.json` registers complete real scenarios only. Registration is the qualification gate, not the date-selection artifact.
- `data/normalized/`: canonical broad returns and adjusted stock histories with retrieval manifests. Broad/pilot sources use pinned mirrors; the five new stock snapshots are current, unversioned Yahoo history. `data/research/<YYYY-MM>/` retains editorial inputs, candidate pools, source records and starting checksum locks. `data/selection/` retains the protocol and reproducible date draw.
- `scripts/fetch/`, `scripts/normalize/`, `scripts/build/`: public-source retrieval, normalization, deterministic historical assembly, schema export, and fictional fixture generation. `scripts/validate/`: collection validation and recomputation.
- `tests/`: hand-checkable math fixtures, invalid-data cases, seeded queues, scorecards, session transitions, information-firewall rendering, and browser journeys.

The app uses React, Vite, and strict TypeScript, with ordinary component state. SVG supplies the portfolio, broad comparison, and three hot-stock paths with clickable event markers; no chart or state-management framework is needed. There is no backend. Ajv checks the same schemas used to derive TypeScript types.

## Canonical scenario contracts

Each scenario directory has three JSON files:

| File                   | Content                                                                                                                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `known_at_start.json`  | Metadata, contemporary headlines, macro values, forecasts, four broad-asset recent returns, exactly three hot stocks, seven asset definitions, and source references                                                              |
| `future_outcomes.json` | Matching scenario ID, exactly 60 monthly return observations for each asset, per-series source references, 3–5 event annotations, explanation, and the four reflection sections                                                   |
| `provenance.json`      | Matching scenario ID and reusable source records: source name/reference, optional observation date, publication date (or explicit null for genuinely undated outcome-only sources), retrieval date, approximation flag, and notes |

Metadata includes scenario ID, ISO scenario date, display date, `data_kind` (`historical` or `development_fixture`), and a discriminated selection object:

- `important`: nonempty selection reason;
- `random`: universe identifier, seed, draw index (zero-based), method, predeclared exclusions, and optional replacement reference represented as a string or `null`.

The four broad IDs are defined once: `cash`, `bonds`, `us_total`, `international_ex_us`. A hot-stock ID is `hot:<scenario-id>:<company-slug>`. All asset-keyed maps must match these seven playable investments exactly; IDs and their source references are cross-checked. Returns are decimal returns (`0.05` means +5%, `-1` means complete loss). The broad equity series include dividends; stock adjusted-close ratios are dividend-adjusted return proxies, with vendor limitations rather than exact broker dividend-reinvestment accounting. Dividends/corporate-action normalization belongs in the future data layer, never in UI code.

No stored benchmark series or winner summaries are accepted as scenario inputs. They are always recomputed from monthly returns, avoiding inconsistent duplicates.

### Information firewall

The starting content is physically separate from future outcomes. `ScenarioView` and `Allocation` receive only `DecisionContext`, produced from `KnownAtStart`. That projection uses explicit player-facing nested types and allowlists the displayed date, headline/category/summary, macro values, forecast text, recent returns, hot-stock identity/description/returns, and asset IDs/names/descriptions. It excludes scenario selection metadata, provenance, and all future outcomes. Headline selection notes, hot-stock selection rationales, and every nested source ID remain in the known bundle and are absent from `DecisionContext`, so pre-investment components never receive them. Future events, comparisons, ranks, hot-stock paths and outcomes, and reflection render only after commitment. Cohort labels appear only in the final scorecard, never in a checkpoint.

All referenced pre-investment sources must have a non-null `publication_date <= scenario date`. Retrieval may be later: it describes when the project obtained a source, not when the information became public. Unknown references and invalid dates fail validation. Future source records are allowed in provenance but cannot be referenced from starting content.

This is a software/editorial invariant, not a security boundary. A static bundle is inspectable, and date checks cannot detect hindsight embedded in prose. Human editorial review and separately committed starting bundles remain necessary for real scenarios.

The historical scenarios distinguish dated news/statistical releases from reconstructed market returns. The `asof-*` records model availability of underlying market observations through cutoff; their dates are **not** publication dates of modern French/FRED/Yahoo archives. Separate artifact records retain later mirror or served-snapshot availability. These estimates do not reproduce exact contemporary database vintages. [Historical data methodology](docs/historical-data.md) explains the source chain; [scenario qualification](docs/scenario-qualification.md) records source gaps, corporate actions, editorial bias and review status.

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
7. **Milestone scope:** six historical dates and their locked starting bundles have been researched under the committed selection protocol; outcome integration and final qualification checks are recorded in the qualification ledger. Production session UI, broader 24/50-scenario expansion, polished design and lifetime history remain later work.

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

## Qualification and expansion

The selection protocol was committed at `b4d70fb`, before the real draw at `0316e1c`. Random dates were drawn from equal-weight temporal strata; February 2016 replaced a spacing-rejected draw of the already reserved September 2008 date. There are no outcome-based replacements. All five new starting bundles were separately committed before their stock outcome research; the September 1999 pilot remains unchanged. See [date selection](docs/date-selection.md), [selected dates](docs/pilot-selection.md), [qualification ledger](docs/scenario-qualification.md) and the [mapping of authoring commits to published commits](docs/git-publication.md).

On October 5, the six-scenario milestone passed integration, offline rebuilding, player review, 113 unit/rendering tests and 20 browser tests. October 6 verification also passed all 113 unit/rendering tests, the build/data checks and all 20 desktop/mobile browser tests. The six dates have overlapping five-year windows, repeated stock choices and a small cohort size; they do not establish independent evidence about strategy performance. Expansion to 24/50 scenarios needs its own preregistered draw and qualification. This work does not publish or deploy the website.
