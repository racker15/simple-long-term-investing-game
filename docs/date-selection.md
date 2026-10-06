# Historical date selection protocol v1

This is the recorded protocol for the completed six-scenario milestone. Retain its selected dates and existing evidence; it is not a template requiring additional audit layers for future work. Under [AGENTS.md](../AGENTS.md), future selection should use a simple eligible universe, fixed seed and recorded dates, with replacements only for genuine operational/data failures.

This protocol is committed before the first real draw or new-scenario outcome research. It governs the three random pilots and the eventual twelve-date random production cohort. Date selection is separate from the game's existing seeded session queue.

## Universe and coverage

The nominal universe contains all 492 calendar month ends from January 1980 through December 2020, inclusive. The cutoff is after the month's final trading close. Eligibility requires all four existing broad-asset proxies to have twelve consecutive monthly returns ending at cutoff and sixty consecutive subsequent monthly returns. Twelve trailing stock returns also require thirteen monthly price endpoints, to be assessed during starting research.

The selector validates the canonical broad file and checks month labels for coverage. It never uses return size, rankings, winners, drawdowns, or narrative interest. Missing broad coverage removes a date from the universe with a recorded reason. Invalid/gapped/nonfinite canonical series abort rather than being repaired or filled. Existing January 1975–December 2025 broad coverage makes all nominal months eligible. The draw artifact pins the broad payload, protocol, exclusions, and selector using SHA256.

## Strata, weights, and order

Three predeclared, exhaustive, nonoverlapping strata have equal weight:

| ID     | Calendar months            | Weight | Pilot quota | Production quota |
| ------ | -------------------------- | ------ | ----------- | ---------------- |
| early  | January 1980–December 1992 | 1/3    | 1           | 4                |
| middle | January 1993–December 2006 | 1/3    | 1           | 4                |
| late   | January 2007–December 2020 | 1/3    | 1           | 4                |

The early stratum has 156 months; the other two each have 168. Equal weights apply to strata, with uniform draws among remaining eligible months within each stratum. These are deliberately stratified samples, not an equal-probability sample of all months. Conditional inclusion probabilities also depend on spacing and operational exclusions.

Slots are drawn round-robin in the table's order: early, middle, late, repeated until quotas are reached. The three initial pilot slots are the first three initial production slots. Production expansion is a separate audit artifact and must retain already qualified pilot dates; operational exclusions and additional important dates must be committed before that expansion. A changed important cohort can change spacing constraints and requires explicit reconciliation, not silent pilot reselection. Configurable quotas must be positive integers exactly proportional to weights; ambiguous fractional quotas fail.

## Deterministic generator

The seed is `simple-long-term-investing-game/random-cohort/v1/2026-10-05`. It is fixed in `data/selection/protocol.json`; do not try alternative seeds after seeing dates or outcomes.

Hash the JavaScript UTF-16 seed code units using FNV-1a: start at 2166136261, XOR each code unit, multiply by 16777619 with `Math.imul`, and retain the unsigned 32-bit result. Generate each unsigned word with Mulberry32: wrap state plus `0x6d2b79f5` to uint32, then apply the multiplications and shifts in `scripts/select/dates.ts`. No `Math.random`, local time, or machine entropy is used.

Pools start in chronological order. For population `n`, reject PRNG words at or above `floor(2^32/n)*n`, then select `word % n`. This avoids modulo bias. Record all words, including discarded words. Remove the selected date from its stratum pool whether accepted or rejected: sampling is without replacement.

## Spacing and important dates

Selected random dates must be at least twelve calendar months apart, including across stratum boundaries. They must also be at least twelve calendar months from every reserved important date. Exactly twelve months is allowed; an identical month or distance of eleven or fewer is rejected. Overlapping five-year windows are allowed and must not be treated as independent market experiences.

Reserve August 31, 1982 (high inflation/rates and recession), the existing September 30, 1999 technology-boom pilot, and September 30, 2008 (financial-system disruption). These environments differ in monetary conditions and contemporary concerns. The dates are not chosen by investment winner or to demonstrate a preferred moral. Their significance will be sourced in the final selection record before outcome research.

A spacing rejection draws another remaining date in the same stratum for the same slot, continuing the generator. It records the conflicting date and links the replacement attempt to the rejected draw index. Pool exhaustion aborts qualification; it never weakens spacing automatically.

## Operational exclusions and replacement

The only permitted operational exclusions are:

- `starting_sources_unavailable`: an adequately sourced starting bundle, including mixed-topic contemporary news and a professional forecast, cannot be obtained after documented attempts;
- `stock_history_unreconstructable`: three contemporaneously prominent stock candidates cannot be given coherent trailing and future histories or defensible corporate-action treatment after documented candidate assessment;
- `broad_history_unavailable`: a required broad window is unavailable or subsequently found irreparably invalid.

Every exclusion requires an exact calendar cutoff and concrete missing evidence, source attempts, and reason. Failure of one stock first prompts assessment of other candidates from the starting pool; it does not automatically exclude the date. Insufficient research time is not a data exclusion. Source access failure is recorded as pending when alternative publicly accessible sources remain unassessed. Do not replace a pending date.

Operational exclusions live in a separately committed append-only review record. No exclusion may use investment performance, boredom, outcome similarity, forecast correctness, or a desired educational lesson. Candidate future information may establish feasibility only. Existing valid uneventful dates are retained.

For post-draw exclusions the algorithm first replays all initial slots identically, records withdrawal events for excluded acceptances, and appends replacement draws from their remaining stratum pools with the existing PRNG state. The frozen v1 implementation scans current acceptances from the beginning after each repair. Initial acceptances are visited in their original slot order; replacements are appended, so an excluded replacement can be revisited after other original slots. Each replacement continues its original slot and links to the withdrawn draw. This clarifies the originally compressed ordering description; it does not change the committed selector, draw, or any starting lock. Unaffected acceptances remain reserved. A replacement that also matches an operational exclusion is withdrawn and replaced in turn. Original acceptance records remain in the log. Commit each new exclusion and revised audit artifact, retaining the old artifact in Git; never erase failed attempts or original accepted dates.

## Audit and authoring commands

`pilot-draw.json` (or `production-draw.json`) stores version, cohort, universe ID, seed, algorithm, all eligible dates, coverage exclusions, operational exclusions, reserved important dates, input hashes, draws, withdrawals, and final accepted dates. Each draw stores zero-based index, slot, stratum, date, population, PRNG words, accepted/rejected status, reason, and predecessor draw index (`replacement_for`). Withdrawals separately retain original draw index, reason, and evidence. Final accepted rows include their draw index and replacement link. The CLI writes no timestamps so offline replay is byte-identical.

```sh
npm run dates:select -- --cohort=pilot
npm run dates:check
# Run only when production expansion has been authorized and preregistered:
npm run dates:production
```

Commit order is mandatory: (1) protocol, selector, and empty exclusion register; (2) final dates, audit log, and significance evidence; (3) each scenario's starting inputs, candidate pools, provenance, and checksum lock; (4) that scenario's outcomes and qualification evidence. Tests use synthetic dates before the protocol commit; they do not execute the real configured seed/universe.

Selected dates are research commitments, not qualified registry entries. Only complete validated and reviewed scenarios may enter `data/scenarios/manifest.json`. Cohort and audit metadata must remain outside the player-facing starting projection.

## Production audit revision v2

Review after pilot assembly found that v1 throws on pool exhaustion before the CLI can save its accumulated draws. No pilot attempt exhausted a pool, and the operational exclusion register is empty. The frozen `scripts/select/dates.ts`, original protocol, pilot artifact and starting hashes remain unchanged. V1 replay is the historical evidence for these six dates.

The separately versioned `production-protocol-v2.json` and `scripts/select/production.ts` are registered before any expanded production draw. They retain the same universe, temporal weights, seed, PRNG, spacing and operational reasons. With no operational exclusions, the initial accepted slots match v1. V2 finishes each original slot's chained exclusions before moving to the next slot and reserves the unaffected acceptances. Every acceptance/rejection and separate withdrawal remains in the log. Exhaustion records `status: failed`, the exact reason, input hashes, attempted draws, withdrawals and partial selections; the CLI saves that audit before returning a failure exit code. A failed cohort cannot be qualified.

`npm run dates:production` writes `data/selection/production-draw-v2.json`; it has not been executed for the real production cohort in this milestone. Synthetic tests cover chained exclusions and saved exhausted-replacement evidence. Future production work must commit the draw and any additional important-date reservations before researching new outcomes, while retaining already qualified pilot dates. This revision corrects audit behavior for expansion without retrospectively rerunning or editing pilot research.
