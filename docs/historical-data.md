# Historical data and the six-scenario library

Chronology references use the original local authoring IDs; the [publication audit](git-publication.md) maps them to identical-tree commits in the PR.

The committed inputs are prepared static data. React performs no external market-data requests. The portfolio engine and production queue requirements are unchanged; provenance now represents unknown publication dates explicitly for outcome-only archives.

## Scope note: current pipeline vs. required quality bar

This document describes the detailed implementation used for the six-scenario library, including the September 1999 pilot. Some of that implementation is intentionally more reproducible and precise than future scenarios need to be.

The project is an educational game for roughly ages 8–12. The minimum standard for future scenario work is **reasonable historical accuracy and player-facing coherence**, not forensic financial reconstruction. Existing checksum pinning, byte-for-byte rebuilds, frozen locks, or source-specific precision checks may be retained where already useful, but should **not** be generalized into mandatory infrastructure unless they prevent a concrete data error or hindsight leak.

In particular, future work does not need parts-per-million agreement between vendor snapshots, transaction-level dividend reconstruction, repeated live-URL verification, or exhaustive source-body archival checks when a simpler transparent approximation produces the same educational result.

News-source variety remains desirable, but historical publisher links are provenance only. Player-facing headlines and summaries are stored locally, and the live application must not depend on publisher pages remaining reachable.

## Source coverage and interpretation

The canonical broad dataset is `data/normalized/broad-assets/monthly-returns.json`: four USD monthly decimal total-return series with 612 observations each, January 1975–December 2025. It supports complete trailing 12-month and following 60-month windows for starts from December 1975 through December 2020, including every month in the requested 1980–2020 era. It does not provide a complete five-year outcome for a start in 2025.

| Game label          | Public source and series                                                                                                                                                                                                                | Interpretation                                                                                                                                                                                                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cash                | [Kenneth French US research factors](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html), `RF`                                                                                                                   | One-month Treasury/cash-equivalent return. Source preamble identifies Ibbotson inputs through May 2024 and ICE BofA one-month Treasury bill inputs from June 2024.                                                                                                                                                                                               |
| US Total Market     | Same file, `Mkt-RF + RF`                                                                                                                                                                                                                | Broad value-weighted US academic equity market proxy, including dividends. This is not a particular Vanguard ETF. Both columns are percent; sum before dividing by 100.                                                                                                                                                                                          |
| International ex-US | [French International Index Portfolios](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/int_index_port_formed.html), first dividend-inclusive **USD** value-weight market `Mkt` table, “All 4 Data Items Not Reqd” | EAFE plus Canada country-weighted non-US developed-equity proxy. No US equity or project-level splice. Not all global ex-US stocks: emerging-market and small-stock coverage is incomplete. Country availability changes in the original methodology. Source inputs are MSCI through 2006 and Bloomberg from 2007. The original archive member is `Ind_all.Dat`. |
| Bonds               | [Federal Reserve H.15/FRED `GS5`](https://fred.stlouisfed.org/series/GS5)                                                                                                                                                               | A constructed rolling five-year Treasury return, not the Bloomberg US Aggregate. No corporate credit, spread, fund-fee, or transaction-cost exposure.                                                                                                                                                                                                            |

The legacy manifests in `data/normalized/{broad-assets,stocks}/sources.json` record canonical URLs, actual download URLs, exact revision-pinned public mirrors, retrieval dates, series IDs, raw SHA256s, and transformations. New per-scenario stock manifests use current Yahoo snapshots, as described below. The French mirrors retain the original library payloads; the Treasury mirror is a FRED CSV. This environment initially blocked direct Dartmouth/FRED/stock-site downloads, so ordinary public GitHub snapshots were used. No authentication, paywall, CAPTCHA, or proxy-policy workaround was used.

Raw payloads are ignored under `data/raw/`; normalized numerical returns and needed adjusted monthly observations are committed. No full article bodies or vendor price databases are included. Preserve upstream attribution and distinguish project code licensing from upstream source terms.

### Treasury approximation

For month `t`, let `y0` be the previous month's GS5 yield divided by 100, and `y1` the current month's yield divided by 100. Buy a synthetic five-year par bond at the prior yield, receive monthly coupon `c = y0/12`, and value the remaining 59 monthly payments at a flat current curve:

```text
price = sum(k=1..59, c / (1 + y1/12)^k) + 1 / (1 + y1/12)^59
monthly_return = price + c - 1
```

At constant yields, the return is the monthly coupon; falling yields increase prices and rising yields reduce prices. The proxy renews its five-year exposure every month within the asset series. Player positions and benchmarks still buy and hold the resulting asset without allocation rebalancing. Monthly-average yields, monthly rather than semiannual coupons, a flat curve, and par renewal are explicit simplifications. They do not model an investable Treasury fund exactly. December 1974 yields supply the first January 1975 return.

### Stocks

The unchanged September 1999 pilot uses Yahoo's legacy daily `Adj Close` through April 28, 2016, preserved in a [revision-pinned public snapshot](https://github.com/rpandya1990/Stock-Prediction-Web-Application/tree/df6002f3b04ef7fcd43aa84ce5cb1428bf98b5fd/Scripts). Its source script documents the legacy Yahoo download and added Symbol column. Five new scenarios use daily USD Yahoo chart snapshots retrieved October 5, 2026. The chart endpoint has no located supported, revision-pinned API contract. Per-scenario manifests retain request URLs, raw paths, hashes, symbols and transformations.

Use daily observations: monthly chart timestamps can denote month starts and must not be read as month-end prices. The parser validates matching symbol, USD currency, daily granularity, aligned timestamps/prices, finite positive values and valid dates. It selects the last actual trading observation of each calendar month, rejects duplicate dates and missing months/endpoints, and never fills gaps. Actual observation dates can precede calendar month end on weekends or holidays.

Starting artifacts contain thirteen monthly price endpoints ending at cutoff and twelve trailing returns; they contain no future observation. Subsequent artifacts add sixty outcome months only after the committed starting lock. The outcome builder compares the future snapshot with the locked starting estimates. The original September 1999 stocks and all broad histories retain the existing `1e-12` agreement check. For the fifteen new stock histories, independently requested starting/future Yahoo snapshots have small differences even for overlapping dates. After rebasing to a common endpoint, the observed maximum relative overlap-price error was `1.3353e-6` (about 1.34 parts per million); the largest absolute trailing-return difference was `2.2464e-6`, for GE. The new-stock check requires all thirteen overlapping monthly endpoints to agree within a documented five-parts-per-million relative bound. It rejects larger differences, missing endpoints or inconsistent dates. The source of these vendor differences was not independently established; do not attribute them to a specific floating-point mechanism. Locked bytes stay unchanged, with no integrity repair or editorial reselection. Per-scenario action audits retain the overlap metrics. Stock identity is historical: a convenient modern ticker does not establish continuity for original AT&T, pre-bankruptcy GM or any acquired issuer.

Yahoo's [official adjusted-close description](https://in.help.yahoo.com/kb/adjusted-close-sln28256.html) applies backward split and dividend multipliers, including a dividend factor based on the previous close. Adjacent adjusted-close ratios are **dividend-adjusted return proxies**, not audited broker dividend-reinvestment returns. They do not specify an investor's reinvestment price, tax, fees or fractional-share treatment. Do not add cash dividends or split gains again. A common later scale factor cancels in ratios, but does not independently prove every corporate-action factor is correct. Current history can be revised. The raw SHA identifies retrieved bytes; it cannot guarantee that a future fetch from an unversioned URL returns the same bytes.

[Scenario qualification](scenario-qualification.md) links each stock/action review. Relevant examples include Microsoft's combined $3 special plus $0.08 ordinary dividend in November 2004, Apple's February 2005 and August 2020 splits, and Apple's later splits rescaling historical cash-dividend amounts. Ex-date, record date, distribution date and first adjusted trading date have different meanings. Current official archives with unknown original publication dates use null in outcome-only provenance and are referenced by the corporate-action audit; no invented historical publication date is used to qualify starting information.

## Reproduction

Use Node 22.12+ and Python 3's standard library from the repository root. Normal development and CI are offline with respect to historical data:

```sh
npm ci
npm run dates:check
npm run data:build
npm run data:check
npm run validate
npm run check
```

`data:build` iterates registered scenarios, rebuilds starts only from their starting artifacts and editorial inputs, checks their frozen hashes, then assembles outcomes and provenance. `data:check` replays the committed date draw and checks rebuilt scenario JSON byte for byte. These commands require committed normalized data, not downloads or ignored raw files. `npm run check` also checks formatting, schemas, validation, tests, types and production build. Browser tests are separate.

Optional source-level work requires network access and the relevant raw cache:

```sh
# Legacy broad/pilot pinned manifests only:
npm run data:fetch
# Normalize legacy sources plus each registered new scenario's cached chart payloads:
npm run data:normalize
# Inspect a cached new stock snapshot without changing its outputs:
node --import tsx scripts/normalize/yahoo-chart.ts --scenario=2016-02 --outcome --check
python3 scripts/normalize/stock-actions.py 2016-02 --check
```

`data:fetch` downloads the legacy pinned broad/pilot manifests, verifies SHA256 bytes and does not refetch the five new Yahoo scenario snapshots. The source-specific `scripts/fetch/scenario-stocks.py` is an authoring tool: it refuses an existing snapshot manifest and requires an unchanged committed starting lock before `--outcome`. It is not an idempotent refresh command. Reconstructing a raw cache from an unversioned endpoint may fail checksum verification even when the URL remains accessible. Preserve available cached bytes; normalized endpoints provide deterministic offline rebuilding regardless of future vendor availability.

Raw payloads are ignored under `data/raw/`; source manifests and normalized numerical artifacts are committed. No full article body or vendor database is redistributed. A source refresh is an explicit reviewed change, never a silent overwrite or relock. The authoring lock command refuses an existing lock or outcomes. Integrity repairs require a documented audit rather than re-curating starts after seeing outcomes.

### Window API and dates

`scripts/lib/monthly.ts` exports `getBroadAssetScenarioWindow(dataset, scenarioDate, assetId)` and `getScenarioWindow(series, scenarioDate)`. They return compounded trailing three-month and one-year returns, plus copies of exactly 60 subsequent observations. Invalid calendar month ends, missing windows, duplicate/unsorted/gapped observations, non-finite values, and impossible losses fail.

For `1999-09-30`, three-month returns compound July–September, one-year returns compound October 1998–September 1999, and outcomes run October 1999–September 2004. The cutoff is after the final trading close of the calendar month. Returns ending in the cutoff month are treated as known from market observations. `getTrailingReturns` requires no subsequent window; starting assembly uses a separate stock artifact without future observations.

## Point-in-time limits

The unchanged September 1999 pilot illustrates the date discipline; the other five dates are detailed in [scenario qualification](scenario-qualification.md). News and macro values use dated contemporary publications, not later releases bearing the same observation month:

| Indicator                   | Value and observation                                       | Publication used                                       |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| CPI inflation               | August 1999 CPI-U, unadjusted 12-month change, 2.3%         | BLS September 15, 1999                                 |
| Unemployment                | August seasonally adjusted rate, 4.2%                       | BLS September 3, 1999                                  |
| Fed policy rate             | Federal funds target, 5.25%                                 | FOMC August 24, 1999                                   |
| 10-year Treasury            | Week ending September 24 average, 5.88%                     | H.15 September 27, 1999                                |
| Consumer confidence         | September Conference Board index, 134.2 (1985=100)          | AP/CBS September 29 report of the September 28 release |
| Professional growth outlook | Q2 SPF summary: “up to” 3.9% growth in 1999, 37 forecasters | University of Wisconsin Internet Scout August 26, 1999 |

The last indicator is an **older secondary summary**, explicitly marked as an approximation. Direct inspection of the original Philadelphia Fed PDF was blocked in this environment. It is not represented as a Q3 median forecast, an annualized next-quarter growth rate, a probability of negative growth, or a recession probability. September CPI and employment releases are excluded because they came after the cutoff. Amazon's archive header says September 29 while its release dateline says September 30; the later date is used conservatively.

Market return reconstruction has a different limitation. French/FRED series are modern reconstructed histories and the Yahoo adjusted-price snapshot was published in 2016. We do **not** claim those files were published in 1999. Starting provenance records `asof-broad-proxies` and `asof-stock-prices` use a **modeled availability date of September 30 for underlying market observations** and mark the reconstruction as approximate. Then-observable prices/dividends/yields conceptually support trailing estimates, but exact contemporary database vintages, aggregate publication timing, and retroactive source revisions are not replicated. The publication field now permits null for genuinely undated outcome-only archives. Starting references still require an established pre-cutoff date; the original pilot records and lock remain unchanged.

Separate retrospective artifact records reference the actual pinned mirror dates: October 5, 2026 for the French mirror revision; September 21, 2026 for the FRED mirror revision; May 3, 2016 for Yahoo. They are used for outcomes, never directly referenced by starting fields. `artifact-publications.json` retains the GitHub commit references. Schema date checks enforce the declared approximation; they cannot establish perfect real-time replication. This is the principal historical-data limitation reviewers should assess.

## Selection, editorial audit and integration

The [date-selection protocol](date-selection.md) was committed at `b4d70fb` before the real draw at `0316e1c`. All 492 nominal month ends in 1980–2020 have the required broad windows. Equal-weight early/middle/late strata produced January 1987, May 2004 and February 2016; the first late attempt duplicated reserved September 2008 and was rejected by the predeclared spacing rule. August 1982, September 1999 and September 2008 are the important dates. No operational exclusion or outcome-based replacement is recorded.

The existing September 1999 start stays locked at `6fade75`; the new start commits are `58d21c9` (1982), `bf18540` (1987), `6f9179b` (2004), `a09dc69` (2008) and `39d850d` (2016). Each `starting-lock.json` hashes editorial choices, starting data, source manifests and other inputs; new locks also pin the date protocol and draw. Selected dates do not become qualified registry entries merely by being selected.

Each discovery pool has at least fifty contemporary topics and at least ten stock candidates. Public publisher indexes, especially TIME, are overrepresented. Index-topic evidence is distinct from inspected article bodies; pools are editorial archive samples rather than an exhaustive or probability-sampled news corpus. Final feeds preserve mixed topics, including sport, culture and science, without requiring a subsequent investment connection. Selected stocks repeatedly emphasize established technology businesses. No claim is made that they fairly represent all then-prominent stocks, or that omitted banks, failed issuers and acquired firms had no usable history.

The [qualification record](scenario-qualification.md) gives each date's macro/news provenance, stock feasibility, action treatment, broad window, starting lock, research limits and player-review status. In particular, 1982's original CPI-U is 6.5%, not the experimental rental-equivalence measure or a modern revised series. January 1987 lacks verified consumer confidence and explicitly uses bank prime instead; its growth card is the upper end of a stale July 1986 forecast range. The 1999 older secondary SPF summary remains unchanged. Other forecasts use their original professional-survey vintage and stated horizon, not subsequent revisions.

The development historical preview accepts every registered ID through `?scenario=<YYYY-MM>`. It loads future/provenance chunks after commitment, saves no progress and is excluded from production builds. The normal demo remains fictional, defaulting to ten repeated fixture scenarios. With six unique historical entries the existing queue can supply a five-scenario request, but must reject requests for ten, fifteen or twenty; a historical session launcher is not supplied by this preview.

## Verification ledger

The prior September 1999 milestone passed 86 unit/rendering tests and eight desktop/mobile browser tests on October 5, 2026, together with validation, formatting, schema/data checks, types and build. Those results are a baseline, not proof that the five new outcomes or all six previews passed after integration.

**Final six-scenario verification:** `npm run check` passed with 113 unit/rendering tests, and `npm run test:browser` passed 20 desktop/mobile tests. Hash-checked normalization replayed from the retained raw cache; all six builders reproduce their committed files offline. No historical return exceeds the 80% monthly warning threshold. Desktop/mobile starting and reveal screenshots were manually inspected, including forecast units, allocations, event markers and reflections. The [qualification ledger](scenario-qualification.md) records the evidence and remaining research limits.

Do not expand to 24/50 scenarios until the six-scenario qualification is complete. The small cohorts and overlapping outcome periods are unsuitable for broad statistical conclusions; no website deployment or production lifetime history is included in this milestone.
