# IMPLEMENTATION_PLAN

## 1. Objective

Build the curated historical long-term investing game described in `investing-game-specification.md`.

The implementation should prioritize:

- educational clarity
- reproducible historical scenarios
- public-source-first data collection
- simple, auditable data transformations
- deterministic scenario playback
- minimal runtime dependencies
- a child-friendly UI
- explicit separation between information known at the start date and future outcomes

The MVP is **not** a real-time or generative simulation.

---

## 2. High-Level Architecture

Use a static-scenario architecture.

### Build-time / research-time pipeline

A research pipeline collects, normalizes, and curates historical data into version-controlled scenario files.

### Runtime web app

The web app loads prebuilt scenario data and performs only:

- allocation interaction
- portfolio math
- chart rendering
- reveal sequencing
- local player-history tracking

The runtime app should not need:

- a brokerage API
- a market-data API
- live web access
- an LLM
- dynamic article retrieval
- arbitrary-date reconstruction

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
    "at_the_time": "",
    "what_happened": "",
    "long_term_lesson": ""
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

Use a broad source mix.

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

Do not require full article text.

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

Use a two-stage process.

### Stage 1 — Candidate generation

For each scenario date, identify approximately 10–20 plausible candidates using only pre-date information.

Signals may include:

- high news volume
- unusually strong or weak trailing returns
- major IPO
- major product or strategic announcement
- high market capitalization
- unusual public attention
- large corporate controversy
- strong thematic relevance to contemporary discourse

Do not require a rigid mathematical formula for the MVP.

A lightweight ranking score may help, but editorial judgment is allowed.

### Stage 2 — Curated selection

Choose exactly three.

Selection criteria:

- genuinely salient at that time
- sufficiently different narratives where possible
- high-quality-enough public historical data
- five-year outcome can be represented without excessive ambiguity

Store an internal rationale.

### Data-quality gate

Drop a candidate if:

- ticker continuity is unclear
- acquisition treatment is too complex
- spinoffs materially distort the result
- adjusted data is obviously broken
- long gaps exist
- the terminal outcome is ambiguous

Bias introduced by this gate is accepted.

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

Collect approximately 50–200 candidate stories from the previous 30–90 days.

The exact window may vary by scenario.

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

Build scenarios one at a time.

Recommended checklist:

### A. Choose date

Confirm:

- five future years of usable data
- era is not overrepresented
- date is historically interesting but not necessarily famous

### B. Build known-at-start macro bundle

Collect:

- inflation
- unemployment
- Fed rate
- 10Y yield
- sentiment/confidence
- forecast/downside measure

### C. Build recent asset-performance bundle

Calculate:

- trailing 3 months
- trailing 12 months

For:

- cash
- bonds
- US Total
- International ex-US

### D. Build headline pool

Collect broad contemporary stories.

Curate to 6–8.

### E. Build hot-stock candidate list

Collect 10–20 names.

Assess:

- pre-date salience
- trailing performance
- data quality
- five-year survivability/reconstructability

Select exactly three.

### F. Build five-year return series

For all seven assets, create 60 monthly returns.

### G. Build post-reveal history

Add:

- 3–5 major event markers
- 150–250 word “What happened next?”
- three reflection statements

### H. Validate

Run automated checks and human QA.

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

Every macro field, headline, and hot-stock selection should have a provenance record.

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

Can all seven asset histories be explained and reproduced?

### Educational value

Does the five-year reveal illustrate something useful without forcing a single moral?

Reject or revise weak scenarios.

---

## 14. UI Implementation Phases

### Phase 1 — Static scenario viewer

Build:

- scenario selection
- date header
- news feed
- macro dashboard
- recent returns
- hot-stock cards

No allocation logic yet.

### Phase 2 — Allocation interface

Build:

- seven rows
- $500 increments
- automatic cash remainder
- $10,000 cap
- confirmation screen

### Phase 3 — Portfolio engine

Implement:

- monthly compounding
- no rebalancing
- benchmark calculation
- reusable deterministic math library

Add tests before chart work.

### Phase 4 — Reveal chart

Build:

- portfolio line
- US Total line
- diversified benchmark line
- event annotations
- tap/click event details
- responsive rendering

### Phase 5 — Explanations and reflection

Add:

- What happened next?
- At the time
- What happened
- Long-term lesson

### Phase 6 — Player history

Use local browser storage for:

- scenarios played
- first-time allocations
- replay state
- aggregate allocation behavior

Do not require accounts for the MVP.

---

## 15. Initial Scenario Set

Start with a smaller qualification batch before building all 24.

### Pilot set: 6 scenarios

Choose six dates spanning very different environments, for example:

- early 1980s high-rate environment
- mid-1980s ordinary expansion
- late-1990s technology boom
- early-2000s post-bubble period
- 2008 financial crisis
- mid/late-2010s ordinary bull-market period

Do not finalize the exact dates until source availability is checked.

### Qualification gate

Do not scale to 24 until the six pilots demonstrate:

- viable news sourcing
- viable stock histories
- workable bond proxy
- consistent scenario schema
- visually clear UI
- manageable research effort

---

## 16. Suggested First Six Engineering Milestones

### M1 — Repository and schema foundation

Deliver:

- app skeleton
- JSON schemas
- scenario loader
- validator framework
- one hand-authored dummy scenario

### M2 — Broad-asset data pipeline

Deliver reproducible monthly series for:

- Cash
- Bonds
- US Total
- International ex-US

Cover enough history for the pilot dates.

### M3 — First real scenario

Build one full historical scenario end to end.

Recommended target: a well-documented late-1990s date because news and stock data are relatively accessible.

### M4 — Portfolio game loop

Deliver:

- allocation screen
- commit step
- five-year calculation
- chart
- benchmark comparison

### M5 — Six-scenario qualification set

Complete six curated scenarios.

Run data and UX review.

### M6 — Scale to 24 scenarios

Only after the pipeline and schema stabilize.

---

## 17. Codex / ChatGPT Work Split

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

## 18. Source Caching and Reproducibility

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

## 19. CI Checks

Add CI that validates every committed scenario.

Minimum CI:

- schema validation
- no future publication dates in known-at-start data
- exactly three hot stocks
- 60 return observations for each asset
- numeric sanity checks
- recomputed benchmark results
- deterministic portfolio test fixtures

Optional later:

- dead-link report
- duplicate headline detection
- source-domain distribution report
- scenario-era balance report

---

## 20. Acceptance Criteria for MVP

The MVP is complete when:

- 24 curated scenarios are available
- each scenario contains 6–8 sourced contemporary stories
- each has six-ish macro/context indicators
- each has recent broad-market performance
- each has exactly three hot stocks
- the player can allocate exactly $10,000 in $500 increments
- each round locks the allocation
- each result displays 60 months of portfolio history
- dividends/adjusted returns are reflected where source data supports them
- bankruptcy can resolve to zero
- the app shows US Total and diversified benchmark comparisons
- each scenario includes 3–5 post-reveal historical event annotations
- each scenario includes a historical summary and reflection
- no pre-investment content intentionally uses post-date information
- all material scenario inputs retain source provenance

---

## 21. Non-Goals for Implementation

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

## 22. Guiding Engineering Principle

Prefer the **simplest reproducible historical representation that preserves the educational lesson**.

When deciding between:

- a theoretically perfect proprietary dataset
- and a transparent public approximation

prefer the transparent public approximation unless the approximation materially changes the lesson.

When a specific hot stock is too difficult to reconstruct, replace the stock rather than complicating the entire system.

When source quality is uneven, retain provenance and disclose the approximation internally instead of manufacturing false precision.
