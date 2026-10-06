# Six-scenario pilot selection

Protocol and selector commit: `b4d70fb` (October 5, 2026). The configured real draw was executed only after that commit. This selection record and `data/selection/pilot-draw.json` are committed before researching the five new scenarios' future stock outcomes or writing outcome narratives. The existing pilot's already-known outcomes and lock are preserved.

| Cutoff             | Cohort    | Selection basis                                        | Draw index |
| ------------------ | --------- | ------------------------------------------------------ | ---------- |
| August 31, 1982    | important | High interest rates, inflation concerns, and recession | —          |
| January 31, 1987   | random    | First early-stratum draw                               | 0          |
| September 30, 1999 | important | Existing locked technology-boom pilot                  | —          |
| May 31, 2004       | random    | First middle-stratum draw                              | 1          |
| September 30, 2008 | important | Contemporary financial-system disruption               | —          |
| February 29, 2016  | random    | Second late-stratum attempt, after a spacing rejection | 3          |

All 492 nominal month ends have the required broad coverage. The first late-stratum attempt drew September 2008 (index 2), exactly duplicating the reserved important date; the preregistered spacing rule rejected it and continued the generator. The replacement drew February 2016. There are no operational exclusions or outcome-based replacements. Random dates will remain selected even if uneventful or if popular stocks perform as expected.

## Important-date significance evidence

August 1982 is selected for a high-rate recession environment, not a stock-market turning point. The [August 1982 Federal Reserve Bulletin](https://fraser.stlouisfed.org/title/federal-reserve-bulletin-62/august-1982-20492/fulltext) reproduces the July 20, 1982 Monetary Policy Report to Congress, pp. 443–452. It describes continuing contraction, reduced inflation, and still-high interest rates. This is contemporary significance evidence. Original observation period is the first half of 1982; the report's public date is July 20; the archive volume is August 1982; retrieval is October 5, 2026. Exact archive digitization date is unverified. None of those dates is interchangeable. Only the original report's dated material may later be used in starting content.

September 2008 is selected for financial-system stress visible at the cutoff. The [Federal Reserve's September 16, 2008 AIG lending announcement](https://www.federalreserve.gov/newsevents/pressreleases/other20080916a.htm) is dated contemporary evidence of emergency institutional support. Its observation and original publication date are September 16; retrieval is October 5, 2026. Later September meeting minutes were published October 7 and are ineligible for September starting content. Neither this selection nor the early-date selection uses subsequent investment rankings.

September 1999 retains the existing selection rationale and starting hash lock. No integrity repair was made.

## Status at selection time

When this selection record was authored, only September 1999 was qualified and registered; the other five dates were research commitments. All six scenarios subsequently completed the October 5 checks and player review recorded in [scenario qualification](scenario-qualification.md). The October 6 scope realignment preserves these dates and locks; historical publisher URL failures do not reopen the draw.
