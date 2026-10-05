# February 29, 2016 outcome evidence

Horizon: March 2016 through February 2021 (60 monthly returns); base observation February 29, 2016. Retrieved October 5, 2026. This is outcome-only research. The locked starting evidence at commit `39d850d` and the selected AAPL, MSFT and XOM series are not edited or reselected. No winner, expected return or later company selection is supplied as an input.

The JSON contains five editorial events, a 213-word narrative and four reflections. Source facts are company/policy reports; statements about interpretation, attention and uncertainty are editorial synthesis. Event months identify the announced event or first adjusted trading month, not the financial period whose results were reported. Null publication dates mean the original date of a current archive was not established, and must not be silently substituted with retrieval date.

```json
{
  "scenario_id": "2016-02",
  "events": [
    {
      "month": "2018-12",
      "title": "Interest rates rise during continued expansion",
      "description": "The Federal Reserve raises its target range to 2.25–2.50%, describing strong economic activity and a strengthening labor market.",
      "source_ids": ["recent-fed-2018"]
    },
    {
      "month": "2020-03",
      "title": "Emergency policy responds to coronavirus disruption",
      "description": "The Federal Reserve cuts its target range to 0–0.25% and announces additional measures supporting markets and credit.",
      "source_ids": ["recent-fed-2020"]
    },
    {
      "month": "2020-07",
      "title": "Microsoft reports stronger cloud demand and mixed pandemic effects",
      "description": "Fiscal 2020 commercial cloud annual revenue exceeds $50 billion; the company describes increased remote-work demand alongside weaker advertising and transactional licensing.",
      "source_ids": ["recent-msft-2020"]
    },
    {
      "month": "2020-08",
      "title": "Apple shares begin trading after a four-for-one split",
      "description": "The split announced July 30 starts adjusted trading August 31. Each existing share becomes four; the split itself does not create a return.",
      "source_ids": ["recent-apple-2020", "recent-apple-actions"]
    },
    {
      "month": "2021-02",
      "title": "ExxonMobil reports its 2020 annual loss",
      "description": "The February 2 release reports a $22.4 billion GAAP loss for 2020 and substantial noncash impairments amid difficult energy-market conditions.",
      "source_ids": ["recent-xom-2020"]
    }
  ],
  "what_happened_next": {
    "text": "The five-year window moved through changing interest-rate and business conditions rather than one uninterrupted economic story. In December 2018, the Federal Reserve raised its target range to 2.25–2.50%, describing strong activity and a strengthening labor market. In March 2020, its assessment changed sharply: coronavirus disruption prompted an emergency reduction to 0–0.25% and additional measures to support markets and credit.\n\nThe selected companies experienced different operating conditions. Microsoft reported that working and learning from home increased cloud demand, while advertising and some license purchases weakened. Its fiscal 2020 results put commercial cloud annual revenue above $50 billion. Apple reported June-quarter revenue of $59.7 billion, 11% above the previous year, and announced a four-for-one stock split. The split changed shares and prices per share; it was not a separate investment gain. ExxonMobil reported a $22.4 billion annual loss for 2020, with substantial noncash impairments and difficult energy-market conditions.\n\nThese releases describe policy decisions and company operations, not a complete causal explanation of investment returns. The monthly paths also include changing prices, valuations and dividends. A headline can be relevant without predicting the eventual result. The endpoint stops in February 2021: it does not establish what would happen over a different holding period, and it does not imply that any selection was obvious in February 2016.",
    "source_ids": [
      "recent-fed-2018",
      "recent-fed-2020",
      "recent-msft-2020",
      "recent-apple-2020",
      "recent-xom-2020"
    ]
  },
  "reflection": {
    "what_people_were_focused_on": "At the starting date, the company releases emphasized Apple’s device ecosystem, Microsoft’s cloud transition and ExxonMobil’s pressure from weak commodity prices. The wider starting news also included civic, health, science and entertainment stories; this is an editorial snapshot, not a survey of all investors.",
    "what_actually_mattered": "Over the holding window, policy conditions changed and company cash flows developed differently. The pandemic disrupted activity while companies reported different demand effects. For the simulated account, the investment weights, full monthly paths and dividend-adjusted convention determine results; these events supply context rather than prove which factor caused each price move.",
    "what_faded_away": "Individual sporting and entertainment stories in the starting screen became dated as their events passed. Their inclusion reflects what people were reading then; this note does not establish that they caused, or had zero influence on, any investment return.",
    "what_nobody_knew": "The starting information did not specify the timing and scale of the later coronavirus disruption, the emergency policy response or the eventual company outcomes. Knowing these outcomes now does not make the 2016 decision obvious or show that a different future was impossible.",
    "source_ids": [
      "recent-apple-start",
      "recent-msft-start",
      "recent-xom-start",
      "recent-fed-2018",
      "recent-fed-2020",
      "recent-msft-2020",
      "recent-apple-2020",
      "recent-xom-2020",
      "recent-nfl-start",
      "recent-academy-start"
    ]
  },
  "sources": [
    {
      "id": "recent-fed-2018",
      "name": "Federal Reserve: December 2018 FOMC statement",
      "url": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20181219a.htm",
      "publication_date": "2018-12-19",
      "observation_date": "2018-12-19",
      "approximation": false,
      "notes": "Contemporary release; target range 2.25–2.50%; not an explanation of any individual security return."
    },
    {
      "id": "recent-fed-2020",
      "name": "Federal Reserve: March 2020 emergency FOMC statement",
      "url": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm",
      "publication_date": "2020-03-15",
      "observation_date": "2020-03-15",
      "approximation": false,
      "notes": "Contemporary release attributes disruption to coronavirus and cuts target range to 0–0.25%."
    },
    {
      "id": "recent-msft-2020",
      "name": "Microsoft: FY2020 Q4 results",
      "url": "https://www.microsoft.com/en-us/Investor/earnings/FY-2020-Q4/press-release-webcast",
      "publication_date": "2020-07-22",
      "observation_date": "2020-06-30",
      "approximation": false,
      "notes": "Fiscal quarter/year end; reported Azure growth 47%, commercial cloud annual revenue above $50 billion. Company describes mixed pandemic effects; management interpretations are attributed."
    },
    {
      "id": "recent-apple-2020",
      "name": "Apple: fiscal 2020 third-quarter results and split announcement",
      "url": "https://www.apple.com/newsroom/2020/07/apple-reports-third-quarter-results/",
      "publication_date": "2020-07-30",
      "observation_date": "2020-06-27",
      "approximation": false,
      "notes": "Fiscal quarter end; $59.7 billion revenue, 11% year-over-year increase. Four-for-one split announcement; first split-adjusted trading date August 31, 2020; record date August 24."
    },
    {
      "id": "recent-xom-2020",
      "name": "ExxonMobil: fourth-quarter and full-year 2020 results",
      "url": "https://investor.exxonmobil.com/sec-filings/all-sec-filings/content/0000034088-21-000004/f8k4q991.htm",
      "publication_date": "2021-02-02",
      "observation_date": "2020-12-31",
      "approximation": false,
      "notes": "Contemporary Exhibit 99.1: annual GAAP loss $22.440 billion; Q4 after-tax noncash impairments $19.3 billion; annual loss is not the amount of Q4 impairments."
    },
    {
      "id": "recent-apple-start",
      "name": "Apple: fiscal 2016 first-quarter results",
      "url": "https://www.apple.com/newsroom/2016/01/26Apple-Reports-Record-First-Quarter-Results/",
      "publication_date": "2016-01-26",
      "observation_date": "2015-12-26",
      "approximation": false,
      "notes": "Starting-only company evidence reused for reflection; no changes to locked starting bundle."
    },
    {
      "id": "recent-msft-start",
      "name": "Microsoft: FY2016 Q2 results",
      "url": "https://www.microsoft.com/en-us/Investor/earnings/FY-2016-Q2/press-release-webcast",
      "publication_date": "2016-01-28",
      "observation_date": "2015-12-31",
      "approximation": false,
      "notes": "Starting-only company evidence; cloud annualized revenue run rate is not comparable to an actual annual revenue measure without that distinction."
    },
    {
      "id": "recent-xom-start",
      "name": "ExxonMobil: fourth-quarter and full-year 2015 results",
      "url": "https://investor.exxonmobil.com/sec-filings/all-sec-filings/content/0000034088-16-000053/f8k4q991.htm",
      "publication_date": "2016-02-02",
      "observation_date": "2015-12-31",
      "approximation": false,
      "notes": "Starting-only company evidence about weak commodity prices and annual earnings."
    },
    {
      "id": "recent-apple-actions",
      "name": "Apple investor relations: dividend and split history",
      "url": "https://investor.apple.com/dividend-history/default.aspx",
      "publication_date": null,
      "observation_date": null,
      "approximation": false,
      "notes": "Current official historical table, original page publication unknown. Amounts explicitly NOT split adjusted; regular quarterly cash distributions in the review window; first split-adjusted trading date footnote. Retrieved 2026-10-05; never assign that retrieval date as historical publication."
    },
    {
      "id": "recent-msft-actions",
      "name": "Microsoft investor relations: dividends and stock history",
      "url": "https://www.microsoft.com/en-us/investor/dividends-and-stock-history",
      "publication_date": null,
      "observation_date": null,
      "approximation": false,
      "notes": "Current official archive. Visible HTML confirms quarterly-dividend practice and 2003 split; its quarterly history is embedded and downloadable; the download failed in this browser retrieval, so no claim here of independently reconciling every vendor dividend date."
    },
    {
      "id": "recent-msft-splits",
      "name": "Microsoft investor relations FAQ: split history",
      "url": "https://www.microsoft.com/en-us/investor/faq",
      "publication_date": null,
      "observation_date": null,
      "approximation": false,
      "notes": "Current official archive lists latest split as February 2003; payable date February 14 versus first adjusted trading February 18. Both precede the review horizon."
    },
    {
      "id": "recent-xom-splits",
      "name": "ExxonMobil investor relations: stock split history",
      "url": "https://investor.exxonmobil.com/stock-info/stock-split-history",
      "publication_date": null,
      "observation_date": null,
      "approximation": false,
      "notes": "Current official archive; most recent listed split June 20, 2001; older Mobil and XTO merger ratios are outside the review window. Current site heading reflects a later company name; do not backdate it into 2016–2021."
    },
    {
      "id": "recent-xom-dividends-2018",
      "name": "ExxonMobil: 2018 financial and operating review",
      "url": "https://corporate.exxonmobil.com/-/media/Global/Files/annual-report/2018-Financial-and-Operating-Review.pdf",
      "publication_date": null,
      "observation_date": "2018-12-31",
      "approximation": false,
      "notes": "Official annual table: 2016/2017/2018 dividends per share 2.98/3.06/3.23. Original public-release date not established from current archive. Corroborates annual amounts, not each ex-date."
    },
    {
      "id": "recent-xom-dividends-2020",
      "name": "ExxonMobil: 2020 financial and operating data",
      "url": "https://corporate.exxonmobil.com/INVESTORS/-/media/F49742A9B72847BB9A339CDBB377D9A4.ashx",
      "publication_date": null,
      "observation_date": "2020-12-31",
      "approximation": false,
      "notes": "Official annual table: 2019/2020 dividends per share 3.43/3.48. Original publication date unestablished; retrospectively used only for outcome review, not starting information."
    },
    {
      "id": "recent-yahoo-adjustments",
      "name": "Yahoo Help: adjusted close methodology",
      "url": "https://in.help.yahoo.com/kb/adjusted-close-sln28256.html",
      "publication_date": null,
      "observation_date": null,
      "approximation": true,
      "notes": "Official help indexed text describes backwards split and dividend multipliers based on preceding close. Direct open returned HTTP 429; primary-domain indexed text was inspected. Current method documentation, not a versioned chart API contract."
    },
    {
      "id": "recent-nfl-start",
      "name": "NFL: Super Bowl 50 result",
      "url": "https://www.nfl.com/news/broncos-outlast-panthers-claim-third-super-bowl-title-0ap3000000634371",
      "publication_date": "2016-02-07",
      "observation_date": "2016-02-07",
      "approximation": false,
      "notes": "Contemporary sporting-result report reused from starting evidence; not a causal investment-return claim."
    },
    {
      "id": "recent-academy-start",
      "name": "Academy: 2016 ceremony archive",
      "url": "https://www.oscars.org/oscars/ceremonies/2016/B",
      "publication_date": null,
      "observation_date": "2016-02-28",
      "approximation": false,
      "notes": "Official retrospective ceremony archive; event February 28, 2016, original page publication unknown. Starting publication evidence is recorded separately in the locked starting research."
    }
  ]
}
```

## Corporate-action review and vendor limits

Scope is the existing three tickers and the holding window; no stock substitution is necessary. In each saved `outcome-*.json` snapshot, the metadata currency is USD and the symbol matches its requested ticker. The final observed endpoint is February 26, 2021, not a fictitious February 28 trade. Raw source hashes and paths are in `data/normalized/stocks/2016-02/outcome-sources.json`.

| Stock | Split evidence and treatment                                                                                                                                                                                                            | Cash distributions                                                                                                                                                                                                                                                                                                                       | Successor, delisting and terminal treatment                                                                                                                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AAPL  | One raw 4:1 split, 2020-08-31, agrees with the [July 30 company release](https://www.apple.com/newsroom/2020/07/apple-reports-third-quarter-results/) and [official history](https://investor.apple.com/dividend-history/default.aspx). | 20 raw ex-date events. Company history has 20 quarterly payments May 2016–February 2021; it reports nominal amounts before the split. Raw pre-split values are already divided by four: $0.57→$0.1425, $0.63→$0.1575, $0.73→$0.1825, $0.77→$0.1925 and $0.82→$0.205. Do not divide again. Company payable dates are not vendor ex-dates. | Existing AAPL observations continue through the endpoint. No successor security, delisting or liquidation payoff is indicated in the inspected action record; carry the existing adjusted series without a invented terminal payment.    |
| MSFT  | No raw split within horizon. [Official FAQ](https://www.microsoft.com/en-us/investor/faq) identifies the most recent split as 2003, outside the window.                                                                                 | 20 raw ex-date events; values move from $0.36 to $0.56. [Official history](https://www.microsoft.com/en-us/investor/dividends-and-stock-history) confirms quarterly practice; its embedded quarterly detail/download could not be inspected here. Raw count is vendor evidence, not independent verification of every event.             | MSFT observations continue through the endpoint; inspected records do not indicate conversion, delisting or terminal payout. No successor mapping applied.                                                                               |
| XOM   | No raw split within horizon. [Official split history](https://investor.exxonmobil.com/stock-info/stock-split-history) lists the last ExxonMobil split in 2001; Mobil/XTO mergers also precede the window.                               | 20 raw ex-date events, $0.75→$0.87. Official 2018/2020 annual tables corroborate calendar-year totals 2016–2020 ($2.98, $3.06, $3.23, $3.43, $3.48); those totals include Q1 2016 before the holding window. Current dividend widget was cookie-gated, so individual dates were not independently reconciled here.                       | XOM observations continue through the endpoint; no relevant security conversion, delisting or terminal payout is indicated by inspected records. Later company naming on the current archive must not alter the historical issuer label. |

The absence of terminal actions is a qualified review conclusion from continuity and the inspected action/company records, not a guarantee that a current vendor feed exhaustively captures all legal events. Missing future values must fail qualification rather than be forward-filled, replaced by another issuer or set to a invented recovery value.

[Yahoo’s official adjustment description](https://in.help.yahoo.com/kb/adjusted-close-sln28256.html) applies backward split/dividend multipliers; its indexed primary text was readable after direct opening returned 429. The saved adjusted-close ratios are a **dividend-adjusted return proxy**, not audited investor-specific total returns: the described dividend multiplier uses the prior close and does not document a broker reinvestment execution price, tax, fees or fractional-share handling. Do not add the listed cash dividends or split gain to those ratios. The chart endpoint has no located supported/version-pinned API contract. Retrospective prices can be revised; raw hashes identify the retrieved bytes, not an immutable upstream revision. Uniform retrospective scaling cancels in adjacent ratios, but that does not establish every event factor is correct.

The surviving security paths are inspectable, but this note makes no selection based on their returns and no general claim about non-survivors. A different horizon or universe may give a different result. Starting-screen narrative and selection remain grounded in their locked evidence; this future research belongs only to outcome/provenance records.
