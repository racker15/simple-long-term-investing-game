# Historical Long-Term Investing Game Specification

## 1. Product Purpose

Build a simple educational web game that teaches players how to think about **long-term investing while surrounded by short-term news, forecasts, recent market performance, and popular narratives**.

The experience should recreate what the world actually looked and felt like at a specific historical moment, ask the player to make **one $10,000 investment decision**, and then reveal what happened over the following five years.

The player cannot trade after making the allocation.

The game is intentionally **not** a trading simulator. It should feel closer to an interactive historical exhibit or newspaper than a brokerage terminal.

The central question is:

> **Given only what you could reasonably have known at the time, what would you have done?**

The educational objective is not to reward forecasting skill. It is to help the player experience the difficulty of making a durable long-term decision while contemporary discourse is noisy, emotionally salient, and often focused on events that later prove unimportant.

---

## 2. Product Model: Curated Historical Scenarios

The product is a **curated historical game**, not a generative historical simulator.

For the MVP, every playable historical date is researched, assembled, reviewed, and stored ahead of time.

The production game should not dynamically ask an LLM to reconstruct an arbitrary date.

Initial target:

- approximately **24 carefully curated scenarios**
- approximately 1980–2020 starting dates
- each scenario has exactly five subsequent years of monthly outcome data
- dates include both famous periods and deliberately ordinary periods
- approximately half of the scenarios should not be obvious crisis or market-turning-point dates

The game may expand to 40–50 curated scenarios later.

---

## 3. Core Game Loop

Each round has only three major steps.

### Step 1 — Step Into History

The player is placed at a real historical date and shown a compact snapshot of the world as it appeared then.

### Step 2 — Invest $10,000

The player allocates $10,000 among seven investment choices.

### Step 3 — See What Happened

The portfolio is locked.

The game immediately reveals the next five years as a monthly total-return chart.

There are no intermediate decisions.

No buying, selling, timing, rebalancing, or changing the portfolio is allowed during the five-year period.

---

## 4. Historical Date Selection

Scenario dates should collectively expose players to different investing environments, including:

- ordinary expansion periods
- bull markets
- recessions
- crashes
- recoveries
- bubbles
- high inflation
- low inflation
- high interest rates
- low interest rates
- geopolitical crises
- periods dominated by technology enthusiasm
- periods dominated by pessimism
- periods when financial news was relatively boring

Do not select dates merely because hindsight makes them famous.

A scenario should be interesting because of the **decision environment at that time**, not because the designer knows something dramatic happens immediately afterward.

Dates should use a consistent monthly convention. The implementation may use month-end or the first trading day of a month, but the convention must be consistent within the return engine and documented.

---

## 5. Screen 1 — “You Are Here”

The first screen should feel more like opening a newspaper than opening Bloomberg.

Example:

> ## September 1999
>
> You have **$10,000 to invest for the next five years.**
>
> You will not be able to change your investments after today.

The historical date is fully visible.

The player should know when they are. This is not a date-guessing game.

The player may scroll through the historical context before investing, but there should be no rapidly updating market UI, fake ticker tape, order entry, or trading controls.

---

## 6. Historical News Feed

The historical news feed is the most important atmospheric component.

Show approximately **6–8 real contemporary stories** from the preceding few weeks or months.

The goal is to recreate **what dominated discourse at the time**, not to retrospectively choose only stories that proved financially consequential.

The mix should normally contain:

- 1–3 business, financial, or economic stories
- 1–2 major US stories
- 1–2 major global stories
- 1 technology, science, social, or cultural story
- 1 entertainment or popular-culture story when useful

These are guidelines, not rigid quotas.

### Source philosophy

Use a **broad range of historically relevant publications**.

The Wall Street Journal should be weighted more heavily for business and financial context when usable public material is available, but it is **not required** and should not dominate every scenario.

The source mix may include:

- major financial publications
- major national newspapers
- wire services
- television-network or radio news
- magazines
- local or regional newspapers where historically important
- technology publications
- entertainment publications
- historically popular tabloids or lower-quality outlets

The game is reconstructing the **information environment**, not awarding a quality score to publishers. A low-quality source can be historically valuable if it genuinely shaped or reflected public attention at the time.

### Headline representation

For each story store:

- original headline when legally and technically practical
- a faithful shortened display headline when needed
- publication
- publication date
- source URL or archival reference
- category
- optional one-sentence summary
- short internal note describing why the story was selected

Do not fabricate historical stories.

Do not require full article text.

Prefer metadata, short excerpts where permitted, and human/AI-written summaries grounded in the source.

### No hindsight selection

Stories should be selected based on their apparent prominence **at the scenario date**.

A story should not be promoted merely because later history made it important.

Stories that later proved irrelevant are desirable because they reinforce the game's educational purpose.

---

## 7. “The World Right Now”

Under the headlines, show a small economic dashboard.

Keep the default view to approximately six indicators.

Example:

| Indicator | Current reading |
|---|---:|
| Inflation | 2.3% |
| Unemployment | 4.2% |
| Fed rate | 5.25% |
| 10-year Treasury | 5.9% |
| Consumer confidence / sentiment | 134 |
| Economists' near-term contraction probability | Low / 18% |

Where reliable contemporaneous forecasts exist, include a short statement such as:

> **Economists' outlook:** Most professional forecasters currently expect continued economic growth.

Use point-in-time or vintage data when readily available.

However, **perfect vintage alignment is not required**. If an exact real-time vintage is unavailable or disproportionately difficult to obtain, use the best credible public historical source and document the approximation.

Do not let data purity block an otherwise strong scenario.

A **More context** affordance may expose extra economic data without cluttering the default interface.

---

## 8. Recent Market Performance

Show only recent performance before the player invests.

Do not initially show long historical charts.

Example:

| Investment | 3 months | 1 year |
|---|---:|---:|
| US stocks | +8% | +22% |
| International ex-US stocks | +4% | +12% |
| Bonds | −1% | +2% |
| Cash | +1% | +5% |

The purpose is to communicate what recent performance would have felt salient to the player at the time.

Use total return when practical.

If the public source available for an older scenario is an imperfect but directionally appropriate proxy, that is acceptable if consistently documented.

---

## 9. “Stocks Everyone Is Talking About”

Each scenario contains exactly **3 individual hot stocks**.

Each stock must have been genuinely prominent around that historical date based only on information available at the time.

For each stock display:

- company name
- ticker used at that time
- trailing 3-month and/or 1-year performance
- one short explanation of why people were talking about it

Example:

> **Cisco (CSCO)**  
> +72% over the past year  
> “A major beneficiary of enthusiasm for internet infrastructure.”

No valuation model, analyst research screen, balance sheet, or trading chart is required.

The individual stocks exist to expose the player to the attraction of concentrated bets amid contemporary narratives.

---

## 10. Selecting the Three Hot Stocks

Hot-stock selection must avoid deliberate hindsight.

Candidate generation may use:

- contemporary news prominence
- unusually strong or weak trailing 3–12 month performance
- a surge in news volume
- major recent IPOs
- major products or corporate events
- high market capitalization
- strong public or investor attention

A scenario should store a brief internal selection rationale for each chosen stock.

### Public-data-first simplification

Perfect survivorship-bias-free stock data is **not required**.

Hot-stock candidates should be restricted to companies for which the project can reconstruct a sufficiently credible history using public sources.

If a candidate has messy, ambiguous, or incomplete historical data, **drop it and choose another candidate**.

This knowingly creates some data-availability bias. That tradeoff is acceptable for the educational MVP.

### Simplified terminal-event rules

The project should prefer understandable deterministic rules over complex institutional-grade corporate-action accounting.

Use the following principles:

- **Bankruptcy / clearly worthless equity:** set the stock value to zero from the first reasonably supportable terminal month.
- **Ticker/name change:** continue the same economic investment when the mapping is clear.
- **Cash acquisition:** convert to the documented cash acquisition value when practical; thereafter that amount remains in cash for the rest of the five-year period unless the source's adjusted series already handles the event cleanly.
- **Stock acquisition / complex merger:** use a reliable adjusted series or clear successor mapping when readily available; otherwise drop the stock as a candidate.
- **Complex spinoff or distribution that cannot be reconstructed confidently:** drop the stock as a candidate.
- **Missing multi-month price history:** drop the stock as a candidate.

The game does not need CRSP-grade delisting accounting.

---

## 11. Screen 2 — Allocate $10,000

The investment decision should be deliberately simple.

The player sees exactly **7 choices**:

1. Cash
2. Bonds
3. US Total Market
4. International ex-US
5. Hot Stock 1
6. Hot Stock 2
7. Hot Stock 3

### Cash

Represent a short-term US Treasury / cash-equivalent return.

### Bonds

Represent broad, relatively safe US bond exposure.

The underlying historical series may use the best practical public proxy available for the scenario period.

Perfect replication of a modern aggregate-bond index is not required. A Treasury-heavy public proxy is acceptable when necessary.

### US Total Market

Broad US equity exposure.

### International ex-US

Broad non-US equity exposure.

### Equity-bucket rule

**US Total Market and International ex-US are mutually exclusive and collectively exhaustive (MECE) equity buckets in the game's conceptual model.**

- **US Total Market** = US equities only
- **International ex-US** = non-US equities only

The historical return proxies do not need to reproduce a modern ETF perfectly. They should be credible broad public-market approximations consistent with those two buckets.

Do not offer a “Global Total” choice that overlaps with US Total Market.

---

## 12. Allocation Interface

The interface should resemble a simple allocation exercise, not a brokerage ticket.

Example:

> ## Invest your $10,000
>
> Cash  
> **$1,000**  [−] [+]
>
> Bonds  
> **$2,000**  [−] [+]
>
> US Total Market  
> **$5,000**  [−] [+]
>
> International ex-US  
> **$1,000**  [−] [+]
>
> Cisco  
> **$1,000**  [−] [+]
>
> Microsoft  
> **$0**
>
> Yahoo  
> **$0**

At the bottom:

> **$10,000 / $10,000 invested**

### Interaction rules

Use **$500 increments**.

That gives the player 20 allocation units and avoids false precision.

Whenever explicit allocations sum to less than $10,000, the unallocated amount remains in Cash.

The player cannot invest more than $10,000.

The interaction must work well by tap/click on mobile and desktop.

---

## 13. Commit Screen

Before revealing the future:

> ## Ready?
>
> You are investing **$10,000 in September 1999**.
>
> You cannot make any changes for five years.
>
> **Invest and see what happens**

Do not warn about upcoming events.

Do not provide hints.

Do not generate a risk score.

---

## 14. Information Firewall

Each scenario should be stored in two conceptual halves:

### Known at Start

May be displayed before investment:

- scenario date
- headlines
- historical context
- economic indicators
- contemporaneous forecasts
- recent broad-asset performance
- hot-stock identities
- hot-stock trailing performance
- hot-stock descriptions

### Future Outcomes

Must not be used to select or describe the pre-investment information:

- following 60 months of returns
- future events
- terminal corporate events
- post-period explanation
- reflection text
- benchmark results

The implementation should keep these structures separate and validate that pre-investment content contains no post-date source material.

This is an **editorial and software leakage control**, not an anti-cheating security boundary. Static game data may still be inspectable by a technically sophisticated user.

---

## 15. Screen 3 — Five-Year Reveal

After the player commits, immediately reveal the next five years.

The centerpiece is one large chart.

### Portfolio value

Example:

**September 1999 → September 2004**

Y-axis:

> Value of your original $10,000

X-axis:

> Monthly dates

Use actual or reconstructed **monthly total returns** when available, including dividends and distributions where the public source supports them.

For a source that provides an adjusted return series, use that series.

The portfolio is buy-and-hold.

There is **no periodic rebalancing**.

Each initial allocation evolves independently, so outperforming assets naturally become a larger share of the portfolio over time.

---

## 16. Comparison Lines

The default chart should show:

### Your portfolio

The strongest visual line.

### US Total Market

A muted comparison line.

### Simple diversified benchmark

Default benchmark:

- 60% US Total Market
- 20% International ex-US
- 20% Bonds

Do not show all seven asset lines initially.

A **Compare investments** control may reveal individual asset results afterward.

The primary question should remain:

> **What happened to my decision?**

not:

> **Which stock won?**

---

## 17. Outcome Summary

Above or below the chart, show:

> ## Five years later
>
> Your $10,000 became:
>
> **$12,840**
>
> US Total Market:
> **$9,950**
>
> Diversified benchmark:
> **$11,730**

Also show a small number of understandable statistics:

- total five-year return
- ending value
- lowest observed monthly portfolio value
- highest observed monthly portfolio value

Avoid arcade-game scoring.

Do not award coins, points, streaks, or grades for beating the market.

---

## 18. Historical Events on the Chart

After the result is revealed, place approximately **3–5 event markers** on the chart.

Examples:

- March 2000 — dot-com stocks begin falling sharply
- September 2001 — September 11 attacks; US markets temporarily close
- October 2002 — US bear market reaches its low

Event annotations are revealed only after the investment is committed.

They exist to explain the path the player just experienced, not to turn the game into a history quiz.

---

## 19. “What Happened Next?”

Below the graph, include a short, neutral explanation of the five-year period.

Target approximately 150–250 words.

The explanation should:

- summarize the major economic and market developments
- connect chart movements to important historical events where appropriate
- mention when highly salient starting-date concerns later faded from importance
- avoid hindsight-shaming language
- avoid implying that subsequent outcomes should have been obvious

The tone should be descriptive rather than prescriptive.

---

## 20. Reflection

Finish each scenario with three compact observations:

### At the time

What narratives, recent returns, or concerns were especially salient?

### What happened

What actually occurred over the next five years?

### Long-term lesson

What investing principle can be learned without pretending the future was predictable?

These observations must be scenario-specific.

---

## 21. Next Round

Provide only two obvious actions:

- **Try another year**
- **Replay this year**

If replayed, clearly mark:

> You have already seen this future.

Replays should not count toward first-time behavioral statistics.

---

## 22. Player History

After several rounds, optionally show behavioral history.

Example:

> Across 12 first-time rounds:
>
> **Average in individual stocks:** 31%  
> **Average in diversified stock funds:** 48%  
> **Average in bonds/cash:** 21%
>
> Your portfolios beat the US market in 5 of 12 periods.

Emphasize patterns in the player's choices, not a leaderboard score.

Useful behavioral summaries include:

- average allocation to individual stocks
- average allocation to broad equity
- average allocation to bonds/cash
- frequency of concentrated allocations
- frequency of beating the US market benchmark
- average ending portfolio value across played scenarios

The purpose is reflection, not competition.

---

## 23. Child-Friendly Design

The game should be understandable by approximately a **10–12-year-old** without looking childish.

Use:

- large readable typography
- plain English
- short cards and sections
- recognizable dollar amounts
- seven choices only
- minimal financial jargon
- tap/click explanations for unfamiliar terms
- strong responsive behavior

Example definitions:

**Bonds**

> Loans to governments and companies. They usually move less dramatically than stocks.

**US Total Market**

> A little piece of thousands of US companies.

**International ex-US**

> A little piece of companies outside the United States.

Avoid:

- candlestick charts
- order books
- bid/ask prices
- ticker tape
- technical indicators
- limit orders
- trading terminology
- flashing prices
- portfolio optimization tools
- dense finance dashboards

The visual language should be closer to a **museum exhibit or interactive newspaper** than Robinhood.

---

## 24. Data Philosophy

The game optimizes for **historical authenticity, transparency, and educational usefulness**, not institutional backtest perfection.

### Public-source first

Prefer public, reproducible sources.

Do not make the MVP dependent on expensive proprietary financial datasets.

### Practical proxies are acceptable

A credible high-level proxy is acceptable when a perfect historical index is difficult to obtain.

Examples:

- broad public US equity returns may stand in for a modern “total market” implementation
- a public developed/non-US series may stand in for modern international ex-US coverage
- a Treasury-heavy return series may stand in for a broad US bond fund

Document the source and approximation internally.

### Known bias is preferable to opaque precision

If public-data availability causes some hot stocks to be excluded, accept the bias and document it.

Do not fabricate precision.

### Source provenance

Every scenario should retain enough metadata to answer:

- where did this number/story come from?
- when was the underlying information published?
- was it available by the scenario date?
- was an approximation or fallback used?

---

## 25. Preferred Public Source Families

The implementation may change sources over time, but the preferred starting points are:

### Economic and point-in-time data

- FRED
- ALFRED for historical vintages when useful
- Bureau of Labor Statistics
- Bureau of Economic Analysis
- Federal Reserve publications

### Contemporary forecasts

- Federal Reserve Bank of Philadelphia Survey of Professional Forecasters
- contemporaneous public economic outlooks from major institutions when needed

### Broad market returns

- Kenneth French Data Library
- public Federal Reserve / Treasury data
- other reproducible public academic or government series

### News and cultural context

Use multiple source families rather than a single newspaper.

Potential sources include:

- Wall Street Journal when publicly usable
- New York Times
- Associated Press
- Reuters
- major broadcast networks
- magazines
- technology publications
- entertainment publications
- regional newspapers
- GDELT or other public news metadata datasets
- historically prominent tabloids or lower-quality mass-market sources when they reflect discourse

The final displayed feed should favor historical prominence and breadth over modern editorial-quality judgments.

### Individual stocks

Use public historical adjusted-price/return sources plus targeted public research.

A stock is eligible only when the project can build a sufficiently coherent pre-period and five-year outcome history.

---

## 26. Data Integrity Rules

### No intentional future leakage

Everything displayed before allocation must have been available by the scenario date.

### Point-in-time when practical

Use vintage values when they are readily obtainable.

Approximate historical values are allowed where exact vintages would add disproportionate complexity.

### Total return when practical

Prefer total-return or adjusted-return data.

If a proxy or simplification is used, document it.

### Hot-stock eligibility filter

Exclude any hot-stock candidate whose return history or corporate actions cannot be reconstructed confidently enough for the educational purpose.

### Bankruptcy

A clearly bankrupt/worthless stock may simply go to zero.

### Headlines

Do not invent historical stories.

Keep original publication/date/source provenance even when the UI uses a shortened headline.

### Reproducibility

Generated scenario files should be deterministic once curated source inputs and editorial choices are committed.

---

## 27. MVP Scope

Build approximately **24 scenarios**.

Candidate eras should span the full range rather than cluster around the 2000s.

An illustrative—not final—set of years:

- 1982
- 1985
- 1987
- 1990
- 1994
- 1995
- 1997
- 1998
- 1999
- 2000
- 2001
- 2003
- 2005
- 2007
- 2008
- 2009
- 2011
- 2013
- 2015
- 2016
- 2018
- 2019
- early 2020
- late 2020

The exact month for each should be chosen during curation.

Several dates must be intentionally ordinary.

---

## 28. Explicit Non-Goals

The MVP should not contain:

- live trading
- repeated buy/sell decisions
- portfolio rebalancing during a round
- short selling
- options
- leverage
- crypto
- day-by-day progression
- real-time market feeds
- arbitrary-date generation
- LLM-generated fictional history
- “beat the market” arcade mechanics
- points or coins
- portfolio optimization

The scarcity of decisions is a feature.

---

## 29. Product Principle

Every proposed feature should pass this test:

> **Does this help the player understand what making a long-term investment decision felt like at that historical moment?**

If not, remove it.

The player sees a noisy world, makes one consequential but simple choice, and then discovers how little of the next five years was obvious at the time.
