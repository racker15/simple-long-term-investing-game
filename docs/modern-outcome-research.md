# Modern locked-scenario outcome research

Research observation date: 2026-10-05. This note is outcome-only. Starting selections remain fixed at commit `6f9179 b` (2004-05) and `a09dc69` (2008-09). No starting inputs or stock choices were edited. The JSON blocks match the existing canonicalOutcomeInput fields. Starting-headline source IDs in reflections resolve against the already locked starting provenance. No winner field is stored; quantitative rankings must be derived by the outcome builder.

## Corporate-action and terminal-mapping audit

All six selected securities retain the same symbol through their scenario endpoint: AAPL/MSFT/EBAY through May 2009; AAPL/MSFT/XOM through September 2013. No terminal liquidation, delisting payout, ticker substitution or successor-chain reconstruction is applied. Yahoo daily adjusted-close ratios are a vendor total-return approximation, with cash reinvestment implicit in the adjustments; dividend cash is never added a second time. Raw snapshots, hashes and normalized endpoints are recorded in each scenario’s outcome-sources.json. Post-window adjustments can rescale both endpoints; those common factors should cancel in ratios, but this assumption does not independently certify Yahoo’s methodology. Current history can be revised, so cached raw bytes and normalized prices—not a later download—define this build. No fees, tax, inflation conversion, FX conversion or transaction timing simulation is included.

- **AAPL 2004:** [Original Apple release](https://www.apple.com/newsroom/2005/02/11Apple-Announces-Two-for-One-Stock-Split/) confirms 2:1 split trading February 28, 2005; record February18. Raw split matches. No cash dividends in horizon. Later 2014/2020 splits and post 2012 dividends are outside this horizon; no separate credits apply.
- **MSFT 2004:** [Original July20 announcement](https://news.microsoft.com/source/2004/07/20/microsoft-outlines-quarterly-dividend-four-year-stock-buyback-plan-and-special-dividend-to-shareholders/) and [company historical table](https://www.microsoft.com/en-us/investor/dividends-and-stock-history) confirm $3 special dividend, ex-November15, record-November17, payable-December2. Raw November15 amount $3.08 combines $3 special and $0.08 ordinary dividends; it is neither a $3.08 special dividend nor a November cash-payment date. Adjusted closes include the distribution; do not add $3 or $3.08 again. No split in outcome window.
- **EBAY 2004:** [January19 original company release, p1](https://ebay.q4cdn.com/610426115/files/doc_news/archive/EBAY_News_2005_1_19_Earnings.pdf) confirms 2:1 distribution February16, recordJanuary31. Raw event uses February17 trading date; one-day convention is explained, not corrected with an extra return. Raw August 2003 split is before the start. No in-window dividend. PayPal separation in 2015 is outside May 2009 endpoint; no PYPL holding is credited. Later vendor backward rescaling of pre 2015 EBAY prices is assumed common across this in-window ratio and remains a limitation of current vendor history.
- **AAPL 2008:** No in-window split. [Company dividend history](https://investor.apple.com/dividend-history/default.aspx) lists the first modern $2.65 payment August 16, 2012, declaredJuly24, recordAugust13. Raw ex-date August9 amount $0.094643 equals $2.65/28, rounded: later7:1 and4:1 splits rescale the vendor cash series. There are five in-window quarterly ex-dividend observations; no extra dividend credit.
- **MSFT 2008:** Regular quarterly cash dividends appear in raw events; no in-window split. The 2004 special is outside this horizon and must not be credited.
- **XOM 2008:** Regular quarterly cash dividends appear in raw events; no in-window split. [ExxonMobil company FAQ](https://investor.exxonmobil.com/company-information/faq) identifies its last split as June 20, 2001. XTO’s 2010 merger changes ExxonMobil’s business, but a continuing XOM shareholder needs no ticker or share-exchange mapping.

Monthly endpoint audit, mechanically calculated from cached adjusted closes: 2004-05→2009-05 AAPL+867.998%, MSFT−4.381%, EBAY−60.315%; 2008-09→2013-09 AAPL+331.290%, MSFT+41.563%, XOM+25.405%. These are audit evidence, not hand-entered outcome winners. Horizon months are June 2004–May 2009 and October 2008–September 2013, each60 monthly returns.

## 2004-05 canonical outcome input

```json
{
  "scenario_id": "2004-05",
  "events": [
    {
      "month": "2004-06",
      "title": "The Fed begins raising its policy target",
      "description": "The Fed raises its federal funds target by 25 basis points to 1.25%, reporting solid output growth and improved labor markets.",
      "source_ids": ["fomc-jun04"]
    },
    {
      "month": "2004-07",
      "title": "Microsoft announces a large capital return",
      "description": "Microsoft announces quarterly dividends, a four-year buyback plan and a special $3 dividend. The special dividend goes ex-dividend November 15 and is paid December 2.",
      "source_ids": ["msft-capital04", "msft-dividend-history"]
    },
    {
      "month": "2007-01",
      "title": "Apple introduces iPhone",
      "description": "Apple announces a device combining phone, music player and Internet functions. This is business context, not a guarantee of future shareholder returns.",
      "source_ids": ["apple-iphone07"]
    },
    {
      "month": "2008-12",
      "title": "The NBER announces a recession",
      "description": "The NBER identifies December 2007 as the economic peak; the determination is retrospective.",
      "source_ids": ["nber-peak08"]
    },
    {
      "month": "2008-12",
      "title": "The Fed moves its target close to zero",
      "description": "The Fed establishes a 0–0.25% target range amid declining activity and strained credit markets.",
      "source_ids": ["fomc-dec08"]
    }
  ],
  "what_happened_next": {
    "text": "The five years after May 2004 included a major change in the economic setting. In June 2004 the Federal Reserve raised its policy target to 1.25%, reporting solid output growth and improving labor markets. By December 2008 it had established a target range of 0–0.25% as economic activity weakened and financial markets remained strained. That month the NBER announced that the expansion had ended in December 2007; this was a retrospective determination rather than a warning available at the starting date. Company developments also differed. Microsoft announced a special dividend and a substantial repurchase plan in July 2004. Apple introduced iPhone in January 2007, adding a new product direction to the business investors had known in May 2004. The reconstructed five-year stock paths diverge sharply: Apple finishes substantially above its starting value, Microsoft slightly below, and eBay well below. Those comparisons include the vendor’s dividend and split adjustments and describe only these locked selections and this window. A successful product narrative, an established company and a growing marketplace did not produce interchangeable investment outcomes. The event markers provide context for the changing environment; they do not measure how much any announcement caused a return. May 2009 is the scenario endpoint, not a declaration that the financial crisis or all economic uncertainty had ended.",
    "source_ids": [
      "fomc-jun04",
      "msft-capital04",
      "apple-iphone07",
      "nber-peak08",
      "fomc-dec08",
      "yahoo-aapl-2004-05",
      "yahoo-msft-2004-05",
      "yahoo-ebay-2004-05"
    ]
  },
  "reflection": {
    "what_people_were_focused_on": "The locked May headlines cover job growth, expensive gasoline, Iraq, the election, cicadas, film and sport. Company prospects mattered to investors, while everyday attention understandably extended beyond markets.",
    "what_actually_mattered": "Starting valuation, company exposure and the full sequence of returns shaped these results. Dividends and splits require consistent accounting. Economic contraction and changing interest rates formed part of the setting; this exercise does not isolate their causal contribution.",
    "what_faded_away": "The approaching sporting and election deadlines and the immediate cicada emergence passed into later news cycles. Their prominence did not supply a reliable forecast of these five-year stock returns.",
    "what_nobody_knew": "A May 2004 investor could not know the timing of the credit crisis, the later near-zero policy target, each company’s future product reception or the final return ordering. Even the recession start was dated afterward.",
    "source_ids": [
      "fomc-jun04",
      "msft-capital04",
      "apple-iphone07",
      "nber-peak08",
      "fomc-dec08",
      "yahoo-aapl-2004-05",
      "yahoo-msft-2004-05",
      "yahoo-ebay-2004-05",
      "n04-jobs",
      "n04-hybrid",
      "n04-iraq",
      "n04-nader",
      "n04-cicada",
      "n04-cannes"
    ]
  }
}
```

## 2008-09 canonical outcome input

```json
{
  "scenario_id": "2008-09",
  "events": [
    {
      "month": "2008-12",
      "title": "The NBER confirms a recession",
      "description": "The NBER announces that the economic peak occurred in December 2007, before the locked September 2008 decision. The dating is retrospective.",
      "source_ids": ["nber-peak08"]
    },
    {
      "month": "2008-12",
      "title": "The Fed establishes a near-zero target range",
      "description": "The Fed sets a federal funds target range of 0–0.25% and describes weakening activity and tight credit.",
      "source_ids": ["fomc-dec08"]
    },
    {
      "month": "2010-09",
      "title": "The NBER dates the recession’s end",
      "description": "The NBER announces June 2009 as the trough. It explicitly distinguishes the start of recovery from a return to normal conditions.",
      "source_ids": ["nber-trough09"]
    },
    {
      "month": "2012-03",
      "title": "Apple announces plans to resume dividends",
      "description": "Apple announces a planned quarterly dividend and share repurchases; its first payment follows in August 2012.",
      "source_ids": ["apple-capital12", "apple-dividend-history"]
    },
    {
      "month": "2013-09",
      "title": "The Fed continues asset purchases",
      "description": "The Fed retains its near-zero rate target and continues purchases at $40 billion monthly in mortgage-backed securities and $45 billion in longer-term Treasuries.",
      "source_ids": ["fomc-sep13"]
    }
  ],
  "what_happened_next": {
    "text": "September 2008 was already a period of financial-system disruption, but the five-year outcome was still unknown. In December the NBER announced that the economy had peaked a year earlier. The Federal Reserve established a 0–0.25% policy target range as activity weakened and credit remained strained. In September 2010 the NBER determined that the recession had ended in June 2009. This later announcement did not mean households or businesses had returned to normal conditions; the committee explicitly distinguished a recovery’s beginning from its completeness. Company policies evolved during that recovery. Apple announced plans for dividends and repurchases in March 2012, with its first modern dividend payment following in August. By the September 2013 endpoint, the Fed still maintained its near-zero rate target and continued substantial asset purchases. The reconstructed stock data finish above the September 2008 starting values for all three locked companies, with markedly different cumulative gains and paths. Apple’s result is much larger than Microsoft’s or ExxonMobil’s in this particular window. These are dividend-adjusted USD comparisons for the companies selected before the outcomes were examined, not a rule about technology versus energy or a promise that every five-year crisis investment recovers. Event markers help describe the environment. They neither identify a precise turning point an investor could have traded nor allocate investment gains among individual policy announcements.",
    "source_ids": [
      "nber-peak08",
      "fomc-dec08",
      "nber-trough09",
      "apple-capital12",
      "apple-dividend-history",
      "fomc-sep13",
      "yahoo-aapl-2008-09",
      "yahoo-msft-2008-09",
      "yahoo-xom-2008-09"
    ]
  },
  "reflection": {
    "what_people_were_focused_on": "The locked September headlines include the rejected rescue plan, AIG lending and rising unemployment, alongside the election, Pakistan, science, music and consumer technology. Concern about financial stability was reasonable; ordinary life continued too.",
    "what_actually_mattered": "The starting price, company concentration, dividends and the sequence of declines and recoveries shaped these outcomes. A five-year endpoint can hide substantial uncertainty along the path. Policy support and the economic recovery are context rather than mechanically assigned explanations for gains.",
    "what_faded_away": "The immediate rescue-plan vote, campaign moments and product or album launches were followed by new decisions and news. Their urgency in September did not reveal the eventual ranking of these investments.",
    "what_nobody_knew": "Nobody at the September 2008 start had the later NBER trough date, the duration of near-zero rates or each stock’s final path. Positive endpoint returns do not make the contemporary fear irrational or the route to recovery obvious.",
    "source_ids": [
      "nber-peak08",
      "fomc-dec08",
      "nber-trough09",
      "apple-capital12",
      "fomc-sep13",
      "yahoo-aapl-2008-09",
      "yahoo-msft-2008-09",
      "yahoo-xom-2008-09",
      "n08-house",
      "n08-aig",
      "n08-jobs",
      "n08-palin",
      "n08-pakistan",
      "n08-lhc",
      "n08-ipod",
      "n08-metal"
    ]
  }
}
```

## Outcome source registry

`publication_date: null` means no historical public release date is established for this current table/vendor reconstruction; it must not be replaced by retrieval date. `observation_date` is the event or measured period, not when this note was written. `approximation` marks return-proxy methodology; official event facts are not return estimates.

```json
{
  "sources": [
    {
      "id": "fomc-jun04",
      "name": "Federal Reserve June 30, 2004 statement",
      "url": "https://www.federalreserve.gov/boarddocs/press/monetary/2004/20040630/default.htm",
      "publication_date": "2004-06-30",
      "observation_date": "2004-06-30",
      "approximation": false,
      "notes": "Original public statement, retrieved from official archive on 2026-10-05."
    },
    {
      "id": "msft-capital04",
      "name": "Microsoft announces dividend and repurchases",
      "url": "https://news.microsoft.com/source/2004/07/20/microsoft-outlines-quarterly-dividend-four-year-stock-buyback-plan-and-special-dividend-to-shareholders/",
      "publication_date": "2004-07-20",
      "observation_date": "2004-07-20",
      "approximation": false,
      "notes": "Original public announcement; not the November ex-dividend date or December payment date."
    },
    {
      "id": "apple-iphone07",
      "name": "Apple introduces iPhone",
      "url": "https://www.apple.com/uk/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/",
      "publication_date": "2007-01-09",
      "observation_date": "2007-01-09",
      "approximation": false,
      "notes": "Original company announcement, official archive; announcement precedes sale."
    },
    {
      "id": "nber-peak08",
      "name": "NBER dates December 2007 peak",
      "url": "https://www.nber.org/news/business-cycle-dating-committee-announcement-december-1-2008",
      "publication_date": "2008-12-01",
      "observation_date": "2007-12",
      "approximation": false,
      "notes": "Originally published December 1; page revised December 11, 2008. December 2007 observation was determined retrospectively, not publicly known then."
    },
    {
      "id": "fomc-dec08",
      "name": "Federal Reserve December 16, 2008 statement",
      "url": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20081216 b.htm",
      "publication_date": "2008-12-16",
      "observation_date": "2008-12-16",
      "approximation": false,
      "notes": "Original public statement, official archive."
    },
    {
      "id": "nber-trough09",
      "name": "NBER dates June 2009 trough",
      "url": "https://www.nber.org/news/business-cycle-dating-committee-announcement-september-20-2010",
      "publication_date": "2010-09-20",
      "observation_date": "2009-06",
      "approximation": false,
      "notes": "Retrospective decision announced September 20, 2010; neither an announcement in June 2009 nor evidence of normal conditions."
    },
    {
      "id": "apple-capital12",
      "name": "Apple plans dividend and repurchases",
      "url": "https://www.apple.com/newsroom/2012/03/19Apple-Announces-Plans-to-Initiate-Dividend-and-Share-Repurchase-Program/",
      "publication_date": "2012-03-19",
      "observation_date": "2012-03-19",
      "approximation": false,
      "notes": "Original announcement; dividend plan subject to board declaration, not a March payment."
    },
    {
      "id": "fomc-sep13",
      "name": "Federal Reserve September 18, 2013 statement",
      "url": "https://www.federalreserve.gov/newsevents/pressreleases/monetary20130918 a.htm",
      "publication_date": "2013-09-18",
      "observation_date": "2013-09-18",
      "approximation": false,
      "notes": "Original public statement; purchases continued, taper was not announced on this date."
    },
    {
      "id": "apple-split05",
      "name": "Apple announces two-for-one split",
      "url": "https://www.apple.com/newsroom/2005/02/11Apple-Announces-Two-for-One-Stock-Split/",
      "publication_date": "2005-02-11",
      "observation_date": "2005-02-28",
      "approximation": false,
      "notes": "Original announcement; Feb18 record, Feb28 split-adjusted trading."
    },
    {
      "id": "ebay-split05",
      "name": "eBay Q4 2004 results and split announcement",
      "url": "https://ebay.q4cdn.com/610426115/files/doc_news/archive/EBAY_News_2005_1_19_Earnings.pdf",
      "publication_date": "2005-01-19",
      "observation_date": "2005-02-16",
      "approximation": false,
      "notes": "Company-hosted original release, p1: record Jan31, distribution Feb16. Yahoo event is Feb17 trading date. Archive hosting date is not original publication date."
    },
    {
      "id": "msft-dividend-history",
      "name": "Microsoft dividend and stock history",
      "url": "https://www.microsoft.com/en-us/investor/dividends-and-stock-history",
      "publication_date": null,
      "observation_date": "2004-11-15",
      "approximation": false,
      "notes": "Undated current company table retrieved 2026-10-05. Special $3 announcedJul20, exNov15, recordNov17, payableDec2; current archive is not a 2004 database vintage."
    },
    {
      "id": "apple-dividend-history",
      "name": "Apple dividend history",
      "url": "https://investor.apple.com/dividend-history/default.aspx",
      "publication_date": null,
      "observation_date": "2012-08-16",
      "approximation": false,
      "notes": "Undated current company table retrieved 2026-10-05. Original amounts not split adjusted. First modern dividend declaredJul24, recordAug13, paidAug16 2012; subsequent 2014 7:1 and 2020 4:1 splits outside horizon."
    },
    {
      "id": "xom-split-history",
      "name": "ExxonMobil investor FAQ",
      "url": "https://investor.exxonmobil.com/company-information/faq",
      "publication_date": null,
      "observation_date": "2001-06-20",
      "approximation": false,
      "notes": "Undated current company page retrieved 2026-10-05 says most recent splitJune20 2001, outside 2008–13 horizon."
    },
    {
      "id": "yahoo-aapl-2004-05",
      "name": "Yahoo Finance daily adjusted close, current chart snapshot (2004-05)",
      "url": "https://finance.yahoo.com/quote/AAPL/history/",
      "publication_date": null,
      "observation_date": "2004-05 to 2009-05",
      "approximation": true,
      "notes": "Vendor reconstructed adjusted-close history retrieved 2026-10-05; not original public vintage. Raw data/raw/stocks/2004-05/outcome-AAPL.json; SHA256 9c78d37da61b13e585d25a32978 ae9615957 b97ea5b412d9c093e789c5bdc77d. Monthly last-trading close ratios approximate dividend-reinvested gross USD return; no taxes, fees or separate dividend addition. Deterministic cached endpoints; future vendor history may revise."
    },
    {
      "id": "yahoo-msft-2004-05",
      "name": "Yahoo Finance daily adjusted close, current chart snapshot (2004-05)",
      "url": "https://finance.yahoo.com/quote/MSFT/history/",
      "publication_date": null,
      "observation_date": "2004-05 to 2009-05",
      "approximation": true,
      "notes": "Vendor reconstructed adjusted-close history retrieved 2026-10-05; not original public vintage. Raw data/raw/stocks/2004-05/outcome-MSFT.json; SHA256 7d13e48a06d811988 fe0c85187 da7ca42f4df774b2efe7404 c7cff9a4c748953. Monthly last-trading close ratios approximate dividend-reinvested gross USD return; no taxes, fees or separate dividend addition. Deterministic cached endpoints; future vendor history may revise."
    },
    {
      "id": "yahoo-ebay-2004-05",
      "name": "Yahoo Finance daily adjusted close, current chart snapshot (2004-05)",
      "url": "https://finance.yahoo.com/quote/EBAY/history/",
      "publication_date": null,
      "observation_date": "2004-05 to 2009-05",
      "approximation": true,
      "notes": "Vendor reconstructed adjusted-close history retrieved 2026-10-05; not original public vintage. Raw data/raw/stocks/2004-05/outcome-EBAY.json; SHA256 626e8b1dcc9cbef7938 dd48e8431 e2d1d1e93acef8b0b9bd584a970ae01250 dc. Monthly last-trading close ratios approximate dividend-reinvested gross USD return; no taxes, fees or separate dividend addition. Deterministic cached endpoints; future vendor history may revise."
    },
    {
      "id": "yahoo-aapl-2008-09",
      "name": "Yahoo Finance daily adjusted close, current chart snapshot (2008-09)",
      "url": "https://finance.yahoo.com/quote/AAPL/history/",
      "publication_date": null,
      "observation_date": "2008-09 to 2013-09",
      "approximation": true,
      "notes": "Vendor reconstructed adjusted-close history retrieved 2026-10-05; not original public vintage. Raw data/raw/stocks/2008-09/outcome-AAPL.json; SHA256 6cc4ca660f1eed6fc204daee5f2ab4ebe8d8e120749 fbb0cf575053 f6c920b5f. Monthly last-trading close ratios approximate dividend-reinvested gross USD return; no taxes, fees or separate dividend addition. Deterministic cached endpoints; future vendor history may revise."
    },
    {
      "id": "yahoo-msft-2008-09",
      "name": "Yahoo Finance daily adjusted close, current chart snapshot (2008-09)",
      "url": "https://finance.yahoo.com/quote/MSFT/history/",
      "publication_date": null,
      "observation_date": "2008-09 to 2013-09",
      "approximation": true,
      "notes": "Vendor reconstructed adjusted-close history retrieved 2026-10-05; not original public vintage. Raw data/raw/stocks/2008-09/outcome-MSFT.json; SHA256 ab3970067 d74c95057 e316e8a8e280ae3089 f2bf86785454 ad2f4c4ff7ba9b31. Monthly last-trading close ratios approximate dividend-reinvested gross USD return; no taxes, fees or separate dividend addition. Deterministic cached endpoints; future vendor history may revise."
    },
    {
      "id": "yahoo-xom-2008-09",
      "name": "Yahoo Finance daily adjusted close, current chart snapshot (2008-09)",
      "url": "https://finance.yahoo.com/quote/XOM/history/",
      "publication_date": null,
      "observation_date": "2008-09 to 2013-09",
      "approximation": true,
      "notes": "Vendor reconstructed adjusted-close history retrieved 2026-10-05; not original public vintage. Raw data/raw/stocks/2008-09/outcome-XOM.json; SHA256 bbcc1132 c3966 af30bc84a520d26fb2bf82f61d0cdc6e10a9d2b8bd282974654. Monthly last-trading close ratios approximate dividend-reinvested gross USD return; no taxes, fees or separate dividend addition. Deterministic cached endpoints; future vendor history may revise."
    }
  ]
}
```
