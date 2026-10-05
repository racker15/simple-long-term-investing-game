# Historical data and the September 1999 pilot

The committed inputs are prepared static data. React performs no external market-data requests. The existing contracts, portfolio engine, and production queue requirements are unchanged.

## Scope note: current pipeline vs. required quality bar

This document describes the detailed implementation used for the September 1999 pilot. Some of that implementation is intentionally more reproducible and precise than future scenarios need to be.

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

The manifests in `data/normalized/{broad-assets,stocks}/sources.json` record canonical URLs, actual download URLs, exact revision-pinned public mirrors, retrieval dates, series IDs, raw SHA256s, and transformations. The French mirrors retain the original library payloads; the Treasury mirror is a FRED CSV. This environment initially blocked direct Dartmouth/FRED/stock-site downloads, so ordinary public GitHub snapshots were used. No authentication, paywall, CAPTCHA, or proxy-policy workaround was used.

Raw payloads are ignored under `data/raw/`; normalized numerical returns and needed adjusted monthly observations are committed. No full article bodies or vendor price databases are included. Preserve upstream attribution and distinguish project code licensing from upstream source terms.

### Treasury approximation

For month `t`, let `y0` be the previous month's GS5 yield divided by 100, and `y1` the current month's yield divided by 100. Buy a synthetic five-year par bond at the prior yield, receive monthly coupon `c = y0/12`, and value the remaining 59 monthly payments at a flat current curve:

```text
price = sum(k=1..59, c / (1 + y1/12)^k) + 1 / (1 + y1/12)^59
monthly_return = price + c - 1
```

At constant yields, the return is the monthly coupon; falling yields increase prices and rising yields reduce prices. The proxy renews its five-year exposure every month within the asset series. Player positions and benchmarks still buy and hold the resulting asset without allocation rebalancing. Monthly-average yields, monthly rather than semiannual coupons, a flat curve, and par renewal are explicit simplifications. They do not model an investable Treasury fund exactly. December 1974 yields supply the first January 1975 return.

### Stocks

The pilot uses Yahoo Finance's legacy daily `Adj Close` through April 28, 2016, preserved in a [public snapshot](https://github.com/rpandya1990/Stock-Prediction-Web-Application/tree/df6002f3b04ef7fcd43aa84ce5cb1428bf98b5fd/Scripts). The same revision's `historical.py` documents downloading Yahoo's `ichart.finance.yahoo.com/table.csv` and adding the Symbol column. The pipeline sorts valid dates, takes the last trading observation in each calendar month, and computes adjacent adjusted-price ratios minus one. It rejects duplicate daily dates, invalid prices, missing months/endpoints, and observations more than four calendar days before month-end. It never fills gaps.

The starting artifact contains only September 1998–September 1999 prices and October 1998–September 1999 returns. Only after the starting commit was the full September 1998–September 2004 monthly artifact built. Six-decimal source precision is retained. Splits and dividends rely on Yahoo's adjustments; total-return reinvestment is approximate. Later uniform adjustment scaling cancels in ratios. The 2016 Amazon scale predates its 2022 split, which does not change these ratios. Microsoft's November 2004 special dividend lies beyond the horizon. These three stocks require no successor, merger, acquisition-cash, bankruptcy, or spin-off mapping in the selected period. No other candidates' corporate actions were qualified.

## Reproduction

Use Node 22.12+ and Python 3's standard library, from the repository root:

```sh
npm ci
npm run data:fetch
npm run data:normalize
npm run data:build
npm run data:check
npm run validate
npm run check
```

`data:fetch` requires public network access to `raw.githubusercontent.com`. It verifies exact bytes against the committed SHA256s before replacing the raw source set for each manifest. Retrieval uses Python's normal proxy-aware `urlopen`; there are no credentials or retries around access controls. The pinned revisions prevent ordinary upstream changes from silently altering the result.

`data:normalize` verifies raw checksums again and writes canonical data with fixed endpoints. Parser headers identify monthly versus annual French tables and USD versus local-currency international tables. FRED dots and French missing-value sentinels fail rather than becoming zeros. `data:build` derives trailing/future returns from normalized observations and assembles editorial inputs. `data:check` runs offline, compares deterministic rebuilt scenario JSON byte for byte, and checks the frozen starting hashes. CI needs only committed normalized data; no source website downloads are required.

For an intentional source refresh, edit a manifest to a reviewed public source/revision and run the fetch script with `--refresh`, then normalize and inspect differences. This pilot's frozen start must not be silently relocked after outcomes are seen. The authoring `--lock` command refuses when outcomes already exist. Changing starting content would require an explicit, explained integrity repair with an audit trail; it is not part of the normal rebuild.

### Window API and dates

`scripts/lib/monthly.ts` exports `getBroadAssetScenarioWindow(dataset, scenarioDate, assetId)` and `getScenarioWindow(series, scenarioDate)`. They return compounded trailing three-month and one-year returns, plus copies of exactly 60 subsequent observations. Invalid calendar month ends, missing windows, duplicate/unsorted/gapped observations, non-finite values, and impossible losses fail.

For `1999-09-30`, three-month returns compound July–September, one-year returns compound October 1998–September 1999, and outcomes run October 1999–September 2004. The cutoff is after the final trading close of the calendar month. Returns ending in the cutoff month are treated as known from market observations. `getTrailingReturns` requires no subsequent window; starting assembly uses a separate stock artifact without future observations.

## Point-in-time limits

News and macro values use dated contemporary publications, not later releases bearing the same observation month:

| Indicator                   | Value and observation                                       | Publication used                                       |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| CPI inflation               | August 1999 CPI-U, unadjusted 12-month change, 2.3%         | BLS September 15, 1999                                 |
| Unemployment                | August seasonally adjusted rate, 4.2%                       | BLS September 3, 1999                                  |
| Fed policy rate             | Federal funds target, 5.25%                                 | FOMC August 24, 1999                                   |
| 10-year Treasury            | Week ending September 24 average, 5.88%                     | H.15 September 27, 1999                                |
| Consumer confidence         | September Conference Board index, 134.2 (1985=100)          | AP/CBS September 29 report of the September 28 release |
| Professional growth outlook | Q2 SPF summary: “up to” 3.9% growth in 1999, 37 forecasters | University of Wisconsin Internet Scout August 26, 1999 |

The last indicator is an **older secondary summary**, explicitly marked as an approximation. Direct inspection of the original Philadelphia Fed PDF was blocked in this environment. It is not represented as a Q3 median forecast, an annualized next-quarter growth rate, a probability of negative growth, or a recession probability. September CPI and employment releases are excluded because they came after the cutoff. Amazon's archive header says September 29 while its release dateline says September 30; the later date is used conservatively.

Market return reconstruction has a different limitation. French/FRED series are modern reconstructed histories and the Yahoo adjusted-price snapshot was published in 2016. We do **not** claim those files were published in 1999. Starting provenance records `asof-broad-proxies` and `asof-stock-prices` use a **modeled availability date of September 30 for underlying market observations** and mark the reconstruction as approximate. Then-observable prices/dividends/yields conceptually support trailing estimates, but exact contemporary database vintages, aggregate publication timing, and retroactive source revisions are not replicated. This distinction is necessary because the existing provenance contract has a single publication-date field; the contract and cutoff validator remain unchanged.

Separate retrospective artifact records reference the actual pinned mirror dates: October 5, 2026 for the French mirror revision; September 21, 2026 for the FRED mirror revision; May 3, 2016 for Yahoo. They are used for outcomes, never directly referenced by starting fields. `artifact-publications.json` retains the GitHub commit references. Schema date checks enforce the declared approximation; they cannot establish perfect real-time replication. This is the principal historical-data limitation reviewers should assess.

## Editorial audit and integration

The starting choice was committed in [`6fade75`](https://github.com/racker15/simple-long-term-investing-game/commit/6fade75b7762330af672eea232b83fa8a1eb3afd) before selected-stock future windows, event markers, narrative, or reflections were constructed. `starting-lock.json` hashes the starting content, source manifests, normalized starting history, and editorial inputs.

The candidate pool contains 56 contemporary news topics and 12 stock candidates, drawn from WIRED digests, CNNfn, AP/CBS, Inter Press Service, company releases, and economic releases. It is an editorial pilot, not an exhaustive corpus or probability sample. Eight stories span economy, business, US weather, global news, technology, gaming, and sports. Dreamcast and Serena Williams remain because people paid attention to them then, without requiring a later investment connection.

Microsoft was selected for software prominence and its September antitrust closing arguments; Cisco for its August optical-networking agreements; Amazon for its September merchant-services announcement. Their selection represents three distinct contemporary business themes. The other nine candidates were excluded editorially, not because of future returns or claimed data defects. **No selected stock was rejected for data quality.**

`data/scenarios/manifest.json` registers one historical important-date scenario. The production queue still requires five or more unique scenarios. The default fictional demo and its tests remain intact. `app/src/data/historical.ts` exposes the starting projection and a lazy outcome loader through the same validator. The optional `?scenario=1999-09` development preview uses the existing allocation and reveal components, loads historical outcome/provenance chunks only after commitment, and saves no session progress. It is omitted from the production build.

The five event markers give context, not a causal explanation of each monthly return. The 212-word outcome narrative and four reflections avoid claiming the five-year rankings were knowable. Build checks recompute comparisons and winners; none are stored as scenario inputs.

## Verification and next milestone

Automated coverage includes parser table/units selection, malformed/missing observations, raw checksum failures, compounded windows and endpoints, 1975–2025 alignment, deterministic rebuilding, the starting hash lock, cutoff failures, source references, registry loading, queue insufficiency, and pre-investment rendering. Desktop/mobile browser tests exercise historical allocation, commitment, lazy loading, 60 rows, event/reflection reveal, overflow, and separation from fictional session history. Existing portfolio and firewall tests remain unchanged.

Inspect browser screenshots in ignored `test-results/`; `npm run dev` enables a player review of the dated headlines, understandable macro labels, plausible stock prominence, and absence of future text before investment. Review the reveal for qualified historical explanation without hindsight-shaming or simplistic market causality.

On October 5, 2026, all six payloads were fetched again and matched their pinned SHA256s. Normalization and scenario freshness checks passed. `npm run check` passed 86 unit/rendering tests, validation, schema/data freshness, formatting, type checking, and the production build; all eight desktop/mobile browser tests passed. The fictional bankruptcy warning remains expected, and the historical scenario has no extreme-return warnings. Player screenshot review confirmed readable macro labels and controls, mixed contemporary stories, no outcome language before investment, and a qualified reveal without claims that the rankings were obvious.

The next milestone is to record the random-date protocol first, then qualify six historical scenarios: three important and three random. This change does not start the random draw, add more scenarios, introduce a backend, or publish the website.
