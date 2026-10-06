# IMPLEMENTATION_PLAN


## 1. Objective

Build the prebuilt historical long-term investing game described in `investing-game-specification.md`.

The implementation should optimize for the educational objective:

> **Help the player experience how difficult it is to make a long-term investment decision in the moment, and how actual outcomes often differ from what contemporary narratives make plausible.**

The implementation should prioritize:

- educational clarity;
- reproducible historical scenarios;
- a **50% historically important / 50% randomly selected date mix**;
- public-source-first data collection;
- simple, auditable data transformations;
- deterministic scenario playback;
- explicit capture of one player expectation before reveal;
- comparison of expectation with reality;
- minimal runtime dependencies;
- a child-friendly UI;
- explicit separation between information known at the start date and future outcomes.

The MVP is **not** a real-time or generative simulation.

Do not optimize the scenario set to prove that hot stocks lose, that indexes always win, or that experts are usually wrong. The collection should preserve genuine uncertainty.

### Product audience and quality bar

The primary audience is roughly **8–12 years old**. This is a simple educational game, not a financial research product, institutional backtest, or authoritative finance reference.

The implementation should therefore use a **materiality-based quality bar**:

- historical context should be plausible, understandable, and free of obvious factual errors;
- starting information must not leak knowledge of the future;
- returns should be reasonable historical total-return approximations whose errors are unlikely to change the player-facing lesson;
- obvious failures such as impossible returns, broken corporate-action handling, wrong winners caused by bad data, or invented history must be fixed;
- small discrepancies that do not materially affect what the player sees are acceptable;
- research should stop once the scenario is credible enough for the educational purpose.

Do **not** add research or validation infrastructure merely to make the project defensible as a scholarly or institutional dataset. In particular, multi-source corroboration of every fact, repeated live-URL availability checks, archive-body hashing, parts-per-million vendor reconciliation, transaction-level dividend reconstruction, and elaborate audit/versioning systems are not default requirements.

News-source variety remains desirable because different publications reflect different editorial lenses. Prefer a varied mix when it is readily available, but do not treat outlet counts as a hard qualification gate or spend substantial effort replacing strong contemporary stories solely to diversify publishers.

---


## 2. High-Level Architecture

Use a static-scenario architecture.

### Build-time / research-time pipeline

A research pipeline collects, normalizes, and curates historical data into version-controlled scenario files.

### Runtime web app

The web app loads prebuilt scenario data and performs:

- start-of-session scenario-count selection;
- session-queue construction;
- allocation interaction;
- expected-winner capture;
- portfolio math;
- chart rendering;
- reveal sequencing;
- five-scenario checkpoint aggregation;
- end-of-session scorecard aggregation;
- local player-history tracking.

The runtime app should not need:

- a brokerage API;
- a market-data API;
- live web access;
- an LLM;
- dynamic article retrieval;
- arbitrary-date reconstruction.

This keeps the user experience fast and makes scenarios reviewable.

---

## 3. Repository Structure

Recommended initial layout:

```
/
  README.md
  investing-game-specification.md
  IMPLEMENTATION_PLAN.md

  app/
    src/
      components/
      data/
      lib/
      pages/
      styles/
    public/

  data/
    raw/
      fred/
      alfred/
      philly-fed/
      french/
      treasury/
      news/
      stocks/

    normalized/
      macro/
      markets/
      stocks/
      news/

    scenarios/
      1999-09/
        known_at_start.json
        future_outcomes.json
        provenance.json
      ...

  scripts/
    fetch/
    normalize/
    build/
    validate/

  schemas/
    known_at_start.schema.json
    future_outcomes.schema.json
    provenance.schema.json

  tests/
    data/
    portfolio/
    scenarios/
```

Raw externally sourced data does not all need to be committed if redistribution terms are unclear. When raw files cannot be committed, commit the retrieval script plus checksums/metadata and the normalized derived values permitted for the project.

---

## 4. Technology Choice

For the web app, prefer a simple TypeScript stack.

Recommended:

- React
- Vite or Next.js in static-export mode
- TypeScript
- a lightweight charting library such as Recharts, Visx, or Chart.js
- static JSON scenario bundles

Avoid server complexity unless it becomes necessary.

The game can be hosted as a fully static site.

---


## 5. Scenario Data Model

Each scenario has three files.

### `known_at_start.json`

Contains only information that may be shown before the player invests.

Suggested shape:

```json
{
  "scenario_id": "1999-09",
  "date": "1999-09-30",
  "display_date": "September 1999",
  "selection": {
    "mode": "important",
    "selection_reason": "Late-1990s technology boom"
  },
  "intro": {
    "starting_amount": 10000,
    "holding_period_months": 60
  },
  "headlines": [],
  "macro": {},
  "recent_returns": {},
  "hot_stocks": [],
  "asset_definitions": {}
}
```

For a random scenario, store reproducibility metadata such as:

```json
{
  "selection": {
    "mode": "random",
    "draw_universe": "eligible-months-v1",
    "random_seed": "2026-mvp-01",
    "draw_index": 7,
    "replacement_for": null
  }
}
```

The player's expected winner is **runtime player state**, not scenario source data.

### `future_outcomes.json`

Contains all post-investment data.

Suggested shape:

```json
{
  "scenario_id": "1999-09",
  "monthly_returns": {
    "cash": [],
    "bonds": [],
    "us_total": [],
    "international_ex_us": [],
    "hot_stock_1": [],
    "hot_stock_2": [],
    "hot_stock_3": []
  },
  "benchmark": {
    "us_total": [],
    "diversified_60_20_20": []
  },
  "events": [],
  "what_happened_next": "",
  "reflection": {
    "what_people_were_focused_on": "",
    "what_actually_mattered": "",
    "what_faded_away": "",
    "what_nobody_knew": ""
  }
}
```

### `provenance.json`

Stores sources and approximations.

Every material data item should be traceable.

Suggested fields:

```json
{
  "scenario_id": "1999-09",
  "sources": [
    {
      "item": "macro.unemployment",
      "source_name": "ALFRED",
      "source_url": "...",
      "observation_date": "1999-08-01",
      "publication_date": "1999-09-03",
      "retrieved_at": "2026-10-05",
      "approximation": false,
      "notes": ""
    }
  ]
}
```

---

## 6. Data Source Strategy

Use public sources whenever practical.

Do not block the project waiting for perfect institutional-grade data.

### 6.1 Macroeconomic data

Preferred sources:

- FRED
- ALFRED
- BLS
- BEA
- Federal Reserve

Target fields:

- inflation
- unemployment
- Fed policy rate
- 10-year Treasury yield
- consumer sentiment/confidence
- optional GDP-growth context

Use ALFRED vintages when practical.

If exact point-in-time vintage data is difficult, use a credible historical value and mark it as an approximation.

### 6.2 Professional forecasts

Preferred source:

- Philadelphia Fed Survey of Professional Forecasters

Use:

- growth outlook
- inflation outlook where useful
- probability of negative real GDP growth / similar near-term downside probability

Do not label the SPF contraction-probability measure more strongly than the source supports.

### 6.3 Cash returns

Preferred source hierarchy:

1. public 1-month or 3-month Treasury-bill return series
2. Fama/French risk-free monthly return
3. another reproducible Treasury proxy

Cash represents a Treasury/cash-equivalent investment rather than literal non-interest-bearing cash.

### 6.4 US Total Market

Preferred source hierarchy:

1. Kenneth French US market return series
2. another credible broad-US total-return series

The label is conceptual. Exact replication of a modern ETF is not required.

### 6.5 International ex-US

Preferred source hierarchy:

1. Kenneth French international/developed ex-US-style data
2. a public EAFE-like or broad non-US return series
3. another documented public proxy

The series should conceptually exclude US equities.

### 6.6 Bonds

Use the best practical public broad US bond proxy.

Preferred hierarchy:

1. publicly available broad investment-grade total-return series
2. public Treasury total-return approximation
3. constructed intermediate-Treasury proxy from public yields

Do not delay the MVP seeking perfect Bloomberg Aggregate replication.

Document which proxy each scenario uses if the series changes across eras.

### 6.7 News

Prefer a broad source mix when practical. Source variety is **desirable, not a hard release gate**. A scenario may rely heavily on one strong historical archive when that is the efficient way to recreate the period; do not perform expensive source-chasing solely to satisfy an outlet-count quota.

Potential sources:

- WSJ where publicly usable
- NYT
- AP
- Reuters
- major broadcast organizations
- magazines
- regional newspapers
- technology publications
- entertainment publications
- GDELT metadata
- historically popular tabloids or lower-quality publications

The goal is to represent contemporary discourse.

The runtime game must use **locally stored, prebuilt headline/summary content**. Publisher URLs are provenance for research and optional inspection; the player experience must not depend on those URLs continuing to work.

Do not require full article text, mirrored article bodies, or ongoing live-source availability checks.

Store enough metadata to support:

- original or shortened headline
- source
- date
- URL/archive reference
- short grounded summary

### 6.8 Individual stocks

Use public historical adjusted-price data plus targeted research.

Candidate sources may vary by era.

A stock is eligible only if the project can obtain:

- reliable trailing pre-scenario performance
- a reasonably complete five-year monthly history
- understandable treatment of any major corporate event

If not, drop the candidate.

---


## 7. Hot-Stock Selection Process

Use a two-stage process based only on information available by the scenario date.

### Stage 1 — Candidate generation

For each scenario date, identify approximately 10–20 plausible candidates using pre-date signals such as:

- high news volume;
- unusually strong or weak trailing returns;
- major IPO;
- major product or strategic announcement;
- high market capitalization;
- unusual public attention;
- large corporate controversy;
- strong thematic relevance to contemporary discourse.

Do not require a rigid mathematical formula for the MVP.

A lightweight ranking score may help, but editorial judgment is allowed.

### Stage 2 — Curated selection

Choose exactly three.

Selection criteria:

- genuinely salient at that time;
- sufficiently different narratives where possible;
- high-quality-enough public historical data;
- five-year outcome can be represented without excessive ambiguity.

Store an internal rationale.

### No outcome-driven stock selection

Do **not** select or reject a stock because its subsequent five-year return creates a better story.

In particular, do not intentionally choose:

- a future bankruptcy to punish a popular stock;
- a future superstar to manufacture surprise;
- three future losers to make diversification look superior.

Five-year outcome data may be checked for **data reconstructability**, but not used as an editorial desirability test.

### Data-quality gate

Drop a candidate if:

- ticker continuity is unclear;
- acquisition treatment is too complex;
- spinoffs materially distort the result;
- adjusted data is obviously broken;
- long gaps exist;
- the terminal outcome is ambiguous.

Bias introduced by this data-quality gate is accepted and should be documented.

---

## 8. Simplified Corporate-Action Rules

The objective is understandable educational output, not institutional accounting.

### Bankruptcy / worthless stock

Set to zero from a defensible terminal month.

### Clear ticker rename

Continue seamlessly.

### Cash acquisition

Convert the position into the acquisition cash value when practical.

Afterward, hold that value as cash through the remainder of the five-year period.

### Simple stock acquisition

Map to the successor only if the conversion is obvious and easily sourced.

Otherwise exclude the stock from candidate selection.

### Complex merger, split-off, or spinoff

Exclude the stock unless a reliable adjusted series already handles the event.

### Missing data

Exclude the stock.

---

## 9. News-Curation Workflow

Each scenario should begin with a broad candidate pool.

### Candidate collection

Collect enough candidate stories from the previous 30–90 days to assemble a credible 6–8-story feed. **Do not target a large candidate count for its own sake.** In many scenarios, roughly 15–40 reasonable candidates will be more than sufficient.

The exact window and candidate count may vary by scenario. Stop collecting once the final feed can represent the period without obvious gaps or hindsight selection.

### Curation categories

Aim for a balanced final feed of 6–8 stories across:

- business/markets/economy
- US current events
- global current events
- science/technology/social change
- culture/entertainment

### Selection principle

Choose stories based on how prominent or representative they appeared at the time.

Do not optimize for what later became historically important.

### LLM use

ChatGPT may help:

- deduplicate similar stories
- summarize candidate articles
- classify categories
- rank apparent salience
- propose a balanced final set
- identify hindsight language

However, final scenario data should store citations and be reviewed before release.

---


## 10. Scenario-Curation Workflow

Build scenarios one at a time, but select the scenario set using the cohort rules before researching outcomes.

### A. Establish the important-date cohort

Choose 12 historically important dates across the target period.

Historical significance may be used deliberately for this half.

Do not choose dates because they produce a preferred investment winner or moral.

### B. Establish the random-date cohort

Define the eligible monthly universe before examining future returns.

Recommended approach:

1. divide the target period into predeclared time strata, such as decades or broad eras;
2. define operational exclusions based only on known data feasibility;
3. use a deterministic pseudorandom seed;
4. draw 12 dates;
5. record the draw metadata;
6. retain selected dates unless an allowed operational exclusion is discovered.

Allowed post-draw rejection reasons include:

- required source data is unavailable;
- a five-year broad-asset series cannot be constructed;
- the month is effectively duplicated by another selected scenario under a predeclared spacing rule.

Do not reject a random date because the subsequent outcome is boring, unsurprising, or educationally inconvenient.

### C. Lock the starting information bundle

Before using future outcomes to write narrative material, build and commit the known-at-start bundle:

- date;
- macro data;
- professional forecasts;
- recent broad-asset returns;
- candidate headline pool;
- final 6–8 headlines;
- hot-stock candidate list;
- final three hot stocks;
- hot-stock trailing performance;
- selection rationales.

For random scenarios especially, this establishes a clear ex-ante record. A simple committed bundle or checksum is sufficient; do not build additional lock/version/audit machinery unless it prevents a concrete integrity problem.

### D. Build future return series

For all seven assets, create 60 monthly returns.

Future data may be used now for:

- return construction;
- corporate-action simplification;
- chart events;
- post-reveal explanation.

Do not go back and change the date or stock choices merely to improve the narrative, except for documented data-quality failures.

### E. Build post-reveal historical context

Add:

- 3–5 major events during the period;
- 150–250 word “What happened next?” narrative;
- “What people were focused on”;
- “What actually mattered”;
- “What faded away”;
- “What nobody knew.”

Avoid forcing a single moral.
Write the narrative and reflections for ages 8–12, using common words, short sentences, compact paragraphs, and concrete details. Explain unavoidable financial terms simply. Keep research methods, sources, proxy or return calculations, vendor details, and model or editorial decisions out of player-facing prose; preserve useful technical detail in provenance or developer documentation. Keep the future uncertain from the starting date.

### F. Validate

Run automated checks and human QA.

### G. Collection-level educational audit

After multiple scenarios exist, inspect the collection for accidental one-sided patterns such as:

- nearly every hot stock losing;
- diversified portfolios always winning;
- professional forecasts nearly always appearing foolish;
- every important headline proving irrelevant.

If such patterns occur, first determine whether they are genuine consequences of the selected dates.

Do **not** manipulate valid random scenarios simply to force balance.

The audit is a warning against editorial bias, not a target-return quota.

---

## 11. Return Calculation Rules

Use monthly returns.

All seven assets begin at their player-selected dollar allocations.

For asset `i`:

```
value_i(t+1) = value_i(t) * (1 + monthly_return_i(t+1))
```

Total portfolio value:

```
portfolio(t) = sum(value_i(t))
```

Do not rebalance.

### Dividends

Use total-return or adjusted-return series when available.

If a source's adjusted series includes dividends, do not add them again.

### Cash remainder

Any unallocated dollars remain in Cash at the initial allocation step.

### Benchmark

Default diversified benchmark:

- 60% US Total Market
- 20% International ex-US
- 20% Bonds

This benchmark is also buy-and-hold unless the product specification is later changed.

---

## 12. Validation Rules

Create automated scenario validators.

### Structural checks

Require:

- exactly 3 hot stocks
- exactly 7 investment options
- exactly 60 future monthly returns per asset
- valid scenario date
- all required UI fields present

### Leakage checks

For every pre-investment source:

```
publication_date <= scenario_date
```

Flag any item that fails.

### Return checks

Reject:

- NaN
- Infinity
- impossible missing months
- duplicate months
- unsorted dates

Flag suspicious monthly returns for manual review.

Example threshold:

- absolute monthly return > 80%

Do not automatically reject because bankruptcies or unusual events can be extreme.

### Provenance checks

Every macro field, headline, and hot-stock selection should have at least one reasonable provenance record. Multiple independent sources are not required unless a claim is genuinely uncertain or disputed.

A historical publisher URL later becoming unavailable is not by itself a scenario failure because player-facing content is stored locally.

### Outcome consistency

Recompute:

- ending values
- benchmark values
- total returns
- chart extrema

during CI rather than trusting hand-entered summary values.

---


## 13. Scenario Quality Rubric

Before accepting a scenario, score it qualitatively.

### Historical atmosphere

Does the news feed make the period feel recognizably different from other dates?

### No hindsight framing

Would the starting context have made sense to a person living then?

### Investment ambiguity

Are multiple reasonable allocations plausible?

### Hot-stock credibility

Would a contemporaneous observer recognize the selected stocks as notable?

### Data coherence

Are all seven asset histories coherent enough that no obvious data or corporate-action error materially changes the player's outcome? Exact institutional-grade reconstruction is not required.

### Expectation value

Does the scenario give the player enough real contemporary evidence to form an expectation, without signaling the future?

### Honest outcome

Is the five-year path presented without forcing it into a preselected moral?

A scenario is **not weak merely because the expected outcome occurs**.

A random scenario is **not weak merely because nothing dramatic happens**.

### Reflection quality

Does the post-reveal material distinguish:

- what people were focused on;
- what actually mattered;
- what faded away;
- what nobody reasonably knew?

### Collection role

Does the scenario add a meaningfully different information environment or random observation to the collection?

Reject or revise scenarios for **material** factual/data problems, hindsight leakage, or genuinely duplicative coverage—not because their future outcome lacks surprise or because provenance could be made more exhaustive.

Once a scenario is historically plausible, internally coherent, and unlikely to materially mislead the player, prefer shipping and improving the game over additional research precision.

---



## 14. Session State and Scorecard Model

Treat a play session as an explicit runtime object.

Suggested shape:

```ts
type Session = {
  sessionId: string;
  targetScenarioCount: number;
  scenarioIds: string[];
  currentIndex: number;
  completed: ScenarioResult[];
  startedAt: string;
  endedAt?: string;
};
```

Each first-time scenario result should retain enough derived state to reproduce checkpoint and final scorecards:

```ts
type ScenarioResult = {
  scenarioId: string;
  selectionMode: "important" | "random";
  allocations: Record<string, number>;
  expectedWinner: string;
  actualWinner: string;
  expectedWinnerRank: number;
  endingPortfolioValue: number;
  endingBenchmarkValue: number;
  maxDrawdown: number;
  yearOneLeader: string;
  yearFiveLeader: string;
};
```

### Session-count selector

Before a session begins, offer scenario counts in multiples of five.

Initial choices:

- 5
- 10
- 15
- 20

Default to 10.

As the library expands, expose additional multiples of five up to the usable unseen-scenario pool.

### Session queue construction

Construct the full session queue before scenario 1.

Rules:

- prefer unplayed scenarios;
- avoid duplicates within a session;
- keep important/random cohort mix as close to 50/50 as the session length permits;
- within each five-scenario block, use a 2/3 or 3/2 cohort split when possible;
- alternate the imbalance between adjacent blocks when possible;
- randomize presentation order;
- do **not** expose `selectionMode` to the player until the final scorecard.

### Checkpoint aggregation

After scenarios 5, 10, 15, and so on, compute statistics for exactly the most recent five first-time scenarios.

Required block metrics:

- average allocation to broad equities;
- average allocation to hot stocks;
- average allocation to bonds;
- average allocation to cash;
- concentration frequency;
- expected-winner hit count;
- expected-winner bottom-half count;
- year-one versus year-five leader-reversal count;
- average ending portfolio value;
- average diversified-benchmark ending value;
- benchmark-beating count;
- 20%+ drawdown count;
- largest drawdown in the block.

The checkpoint may derive one short explanatory observation from deterministic rules or from a small set of templates. An LLM is not required at runtime.

### End-of-session aggregation

At normal session completion, compute:

- all checkpoint metrics across the full session;
- median ending portfolio value;
- largest session drawdown;
- overall prediction hit rate;
- overall leader-reversal frequency;
- separate important-versus-random cohort summaries where sample sizes permit;
- one compact record for each five-scenario block.

The final UI must show both:

1. overall session summary;
2. each five-scenario block summary.

### Early ending

Allow **End session now** only at a five-scenario checkpoint.

This guarantees that every completed session is composed of whole five-scenario blocks and always has comparable block scorecards.

### Persistence

Persist active-session state locally so an accidental refresh does not lose progress.

Persist completed session summaries separately from cumulative lifetime history.

Replays outside the active first-time queue do not modify completed session statistics.

---


## 15. UI Implementation Phases

Show negative investment-return or gain/loss values in red while keeping the numeric minus sign. Use color as an extra cue, and leave positive and zero values in the normal style.

### Phase 1 — Session setup and static scenario viewer

Build:

- start-of-session scenario-count selector;
- session progress indicator;
- deterministic session-queue constructor;
- scenario selection/loading;
- date header;
- news feed;
- macro dashboard;
- recent returns;
- hot-stock cards.

No allocation logic yet.

### Phase 2 — Allocation and expectation interface

Build:

- seven allocation rows;
- $500 increments;
- automatic cash remainder;
- $10,000 cap;
- exactly one “Which investment will do best?” choice;
- confirmation screen showing both allocation and expected winner.

### Phase 3 — Portfolio engine

Implement:

- monthly compounding;
- no rebalancing;
- benchmark calculation;
- reusable deterministic math library.

Add tests before chart work.

### Phase 4 — Five-year reveal

Build:

- progressively revealed 60-month chart;
- sparse historical year labels derived from the scenario dates;
- a secondary dotted $10,000 starting-value reference across each chart panel;
- portfolio line;
- US Total comparison line;
- diversified benchmark line;
- one path for each of the scenario's three hot stocks;
- show hot-stock paths in a clearly labeled lower panel with its own dollar scale and the same timeline as the portfolio and broad comparisons above;
- a compact post-reveal outcome for each hot stock with its company name, ticker, short description, and five-year percentage return derived from the 60 monthly returns;
- event annotations;
- tap/click event details;
- responsive rendering;
- reduced-motion fallback.

Keep the player's portfolio and broad comparisons understandable beside the hot-stock paths. The chart path should be visually primary; the ending benchmark comparison should be secondary. Do not expose hot-stock future paths or returns before commitment.

### Phase 5 — Expectation vs. reality

Add:

- expected winner;
- actual winner;
- rank of expected winner;
- optional path-dependence observation such as a one-year leader differing from the five-year leader.

### Phase 6 — Historical reflection

Add:

- What happened next?
- What people were focused on
- What actually mattered
- What faded away
- What nobody knew

### Phase 7 — Five-scenario checkpoint scorecard

Build the required checkpoint shown after every five completed scenarios.

Display:

- allocation behavior;
- expectation accuracy;
- leader reversals;
- average portfolio and benchmark outcomes;
- benchmark-beating count;
- drawdown frequency;
- one compact block observation;
- Continue or End session now.

### Phase 8 — End-of-session scorecard

Build:

- overall session summary;
- important-versus-random comparison;
- one card for each five-scenario block;
- data-grounded session synthesis;
- start-new-session action.

### Phase 9 — Persistent player history

Use local browser storage for:

- sessions played;
- scenarios played;
- first-time allocations;
- expected winners;
- replay state;
- aggregate allocation behavior;
- prediction-hit frequency;
- selected path-dependence statistics.

Do not require accounts for the MVP.

Do not make cumulative benchmark outperformance the primary player score.

---

## 16. Initial Scenario Set

Start with a smaller qualification batch before building all 24.

### Pilot set: 6 scenarios

Use:

- **3 historically important dates**
- **3 randomly selected eligible dates**

The important dates should span visibly different environments.

The three random dates should be drawn using the same intended production protocol, including recorded seed and allowed exclusion rules.

Do not select all six manually.

### Full MVP set

Scale to:

- **12 important dates**
- **12 random dates**

Preserve approximate temporal coverage across 1980–2020.

### Qualification gate

Do not scale to 24 until the six pilots demonstrate:

- viable news sourcing;
- viable stock histories;
- workable bond proxy;
- consistent scenario schema;
- functional important/random selection metadata;
- visually clear UI;
- useful expectation-versus-reality reveal;
- manageable research effort.

A random pilot does not fail qualification merely because its future is uneventful.

---


## 17. Suggested First Six Engineering Milestones

### M1 — Repository and schema foundation

Deliver:

- app skeleton;
- JSON schemas;
- scenario loader;
- validator framework;
- selection-mode metadata;
- one hand-authored dummy scenario.

### M2 — Broad-asset data pipeline

Deliver reproducible monthly series for:

- Cash;
- Bonds;
- US Total;
- International ex-US.

Cover enough history for the pilot dates.

### M3 — Scenario-selection protocol and first real scenario

Deliver:

- eligible random-date universe definition;
- deterministic random seed mechanism;
- allowed exclusion rules;
- one full important historical scenario end to end.

### M4 — Portfolio and expectation game loop

Deliver:

- allocation screen;
- expected-winner choice;
- commit step;
- five-year calculation;
- progressive chart reveal;
- benchmark comparison;
- expectation-versus-reality result.

### M5 — Six-scenario qualification set

Complete:

- 3 important scenarios;
- 3 random scenarios selected by the production protocol.

Run data, editorial-bias, and UX review.

### M6 — Scale to 24 scenarios

Scale to 12 important + 12 random only after the pipeline, schema, and educational loop stabilize.

---

## 18. Codex / ChatGPT Work Split

### Codex should own

- source retrieval scripts
- parsing
- data normalization
- monthly return calculations
- scenario schemas
- build tooling
- validation
- deterministic scenario compilation
- tests
- frontend implementation
- provenance consistency

### ChatGPT can assist with

- historical research
- candidate headline curation
- narrative summaries
- hot-stock candidate review
- explanation writing
- event annotation suggestions
- hindsight-bias review
- child-friendly language

Do not use model memory as a data source.

Numerical values must come from explicit source material or deterministic derived calculations.

---

## 19. Source Caching and Reproducibility

Public websites and APIs can change.

For every retrieval:

- store retrieval date
- store source URL
- store raw file hash when practical
- cache permitted raw responses
- normalize into a stable project format

If redistribution of raw source data is unclear:

- do not commit the raw payload
- commit the retrieval script
- commit derived scenario values as permitted
- commit source metadata and hashes

Scenario builds should not silently change when upstream sources change.

---


## 20. CI Checks

Add CI that validates every committed scenario.

Minimum CI:

- schema validation;
- no future publication dates in known-at-start data;
- valid `selection.mode` of `important` or `random`;
- required random-selection metadata for random scenarios;
- exactly three hot stocks;
- 60 return observations for each asset;
- numeric sanity checks;
- recomputed benchmark results;
- deterministic portfolio test fixtures.

For a complete 24-scenario MVP dataset, validate:

- exactly 12 important scenarios;
- exactly 12 random scenarios.

Optional later:

- dead-link report;
- duplicate headline detection;
- source-domain distribution report;
- scenario-era balance report;
- collection-level outcome-bias report;
- one-year-leader versus five-year-leader reversal report.

CI cannot prove absence of editorial hindsight, so the random-date draw log and known-at-start commit history remain part of the review process.

---



## 21. Acceptance Criteria for MVP

The MVP is complete when:

- 24 prebuilt scenarios are available;
- exactly 12 use historically important dates;
- exactly 12 use the documented random-date selection protocol;
- every random scenario retains its draw provenance;
- each scenario contains 6–8 sourced contemporary stories;
- each has approximately six macro/context indicators;
- each has recent broad-market performance;
- each has exactly three hot stocks selected without using future desirability;
- the player chooses a session length before play;
- available session lengths are multiples of five;
- the initial selector supports at least 5, 10, 15, and 20 scenarios;
- the full session queue is constructed before scenario 1;
- session composition is approximately balanced between important and random scenarios without exposing that classification during play;
- the player can allocate exactly $10,000 in $500 increments;
- the player makes exactly one expected-winner prediction before reveal;
- each round locks the allocation and prediction;
- each result displays 60 months of portfolio history;
- the chart emphasizes the path rather than only the endpoint;
- dividends/adjusted returns are reflected where source data supports them;
- bankruptcy can resolve to zero;
- the app shows US Total and diversified benchmark comparisons;
- the app explicitly compares expected winner with actual winner;
- each scenario includes 3–5 post-reveal historical event annotations;
- event annotations avoid unsupported causal claims;
- each scenario includes “What happened next?”;
- each scenario includes the four reflection categories: focused on, mattered, faded away, nobody knew;
- a **How you are doing** checkpoint appears after every five scenarios;
- each checkpoint summarizes exactly that five-scenario block;
- checkpoints allow continuing or ending the session at the block boundary;
- session completion shows a required **How you did** scorecard;
- the final scorecard shows both overall-session metrics and each five-scenario block;
- the final scorecard reveals and compares important-versus-random scenarios without over-interpreting small samples;
- no scorecard reduces performance to a single numeric grade or leaderboard score;
- active-session state survives a normal browser refresh;
- no pre-investment content intentionally uses post-date information;
- all material scenario inputs retain source provenance;
- cumulative player history emphasizes behavior and expectation accuracy rather than benchmark-beating as a score.

---

## 22. Non-Goals for Implementation

Do not spend MVP effort on:

- arbitrary-date generation
- live market feeds
- perfect CRSP-like delisting returns
- perfect modern-index replication back to 1980
- user accounts
- multiplayer
- leaderboards
- trading mechanics
- server-side portfolio simulation
- automatic daily scenario generation
- high-frequency data
- intraday data
- advanced tax modeling
- transaction costs
- portfolio optimization

---

## 23. Guiding Engineering Principle

Prefer the **simplest reproducible historical representation that preserves the educational lesson**.

When deciding between:

- a theoretically perfect proprietary dataset
- and a transparent public approximation

prefer the transparent public approximation unless the approximation materially changes the lesson.

When a specific hot stock is too difficult to reconstruct, replace the stock rather than complicating the entire system.

When source quality is uneven, retain provenance and disclose the approximation internally instead of manufacturing false precision.
