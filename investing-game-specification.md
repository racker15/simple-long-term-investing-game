# Historical Long-Term Investing Game Specification


## 1. Product Purpose

Build a simple educational web game about the difficulty of making long-term investing decisions **in the moment**, when the future is unknowable and attention is dominated by contemporary news, forecasts, recent returns, and popular narratives.

The experience should recreate what the world actually looked and felt like at a specific historical moment, ask the player to make **one $10,000 investment decision**, capture one simple expectation about the future, and then reveal what actually happened over the following five years.

The player cannot trade after making the allocation.

The game is intentionally **not** a trading simulator. It should feel closer to an interactive historical exhibit or newspaper than a brokerage terminal.

The central question is:

> **Given only what you could reasonably have known at the time, what would you have done—and how different was the future from what seemed likely then?**

The educational objective is not to reward forecasting skill or to prove that any one asset class is always best. It is to help the player experience several related truths:

- investment decisions must be made with incomplete information;
- contemporary narratives can feel much more predictive than they really are;
- recent winners can keep winning or fail spectacularly;
- expert forecasts can be useful without making the future obvious;
- events that dominate attention can later prove financially unimportant;
- events that matter enormously may not yet be imaginable;
- whether a decision looks smart can depend heavily on when it is judged.

The game should not teach that hot stocks are always bad, that news should always be ignored, or that the consensus is always wrong. Sometimes the obvious-looking investment should work. The lesson is **uncertainty, not contrarianism**.

### Audience and fidelity

The primary audience is roughly **8–12 years old**.

This is a simple educational game, not a professional finance tool, authoritative historical database, or attempt to teach a single “true” model of investing. Historical data and context should be good enough to create a believable, materially accurate experience without implying more precision than the sources support.

Prefer:

- clear concepts over technical completeness;
- reasonable historical approximations over institutional-grade reconstruction;
- player-visible correctness over forensic auditability;
- shipping a coherent scenario over continuing research that would not materially change the child's experience.

A scenario does not need exhaustive source corroboration, transaction-level accounting, perfect vintage datasets, or precision beyond what matters to the game. It **does** need to avoid invented history, obvious factual errors, material return errors, and hindsight leakage.

---


## 2. Product Model: Prebuilt Historical Scenarios

The product uses **prebuilt, researched historical scenarios**, not a generative historical simulator.

For the MVP, every playable scenario is researched, assembled, reviewed, and stored ahead of time. The production game should not dynamically ask an LLM to reconstruct an arbitrary date.

However, the **dates themselves must not all be chosen because history later made them interesting**.

Initial target:

- **24 prebuilt scenarios**
- approximately 1980–2020 starting dates
- each scenario has exactly five subsequent years of monthly outcome data
- **12 historically important dates**
- **12 randomly selected eligible dates**
- all 24 receive the same research and quality standards after selection

The 50/50 mix is deliberate:

- the **important half** gives the player recognizable periods where historical context is especially educational;
- the **random half** represents the fact that an investor living through a month does not know whether that month will later be considered important.

A random scenario may turn out to be boring, surprising, disastrous, or spectacular. Do not replace a random date merely because its subsequent five-year story lacks drama.

The game may expand to 40–50 prebuilt scenarios later while preserving the approximate 50/50 important-versus-random mix.

---



## 3. Start-of-Game Session Setup

Before the first scenario, ask the player how many scenarios they want to play in this session.

The selector should be simple and child-friendly.

Recommended initial choices:

- **5 scenarios**
- **10 scenarios** — default
- **15 scenarios**
- **20 scenarios**

As the scenario library grows, add larger choices in **increments of five** up to the available unseen scenario pool.

Session lengths should be multiples of five so the game can provide a consistent progress checkpoint after every five scenarios.

### Session composition

Build the session queue before the first scenario begins.

Prefer scenarios the player has not previously completed.

Across the full session, keep the mix of historically important and randomly selected scenarios as close to 50/50 as the chosen session length allows.

For each five-scenario block, a 2/3 or 3/2 important/random split is acceptable. Alternate the imbalance across adjacent blocks when possible so that a 10-scenario session can total 5 important and 5 random.

Do not reveal whether an upcoming scenario came from the “important” or “random” cohort before it is played. That label would itself leak information about how history later judged the date.

### Session framing

Tell the player:

> **You’ll make one long-term investing decision in each historical moment. Every five scenarios, we’ll pause and look at how your decisions and expectations are turning out.**

Do not describe the session as a test.

The player should be able to see simple progress such as:

> **Scenario 3 of 10**

---

## 4. Core Game Loop

Each round has four simple stages.

### Step 1 — Step Into History

The player is placed at a real historical date and shown a compact snapshot of the world as it appeared then:

- contemporary headlines
- economic conditions
- professional forecasts
- recent broad-market performance
- exactly three hot stocks

### Step 2 — Invest $10,000

The player allocates $10,000 among seven investment choices.

After allocating, ask exactly one expectation question:

> **Which investment do you think will do best over the next five years?**

The player selects one of the same seven choices.

Do not ask for a predicted return, price target, recession call, or other forecast.

### Step 3 — See What Happened

The portfolio is locked.

The next five years are revealed as a monthly total-return chart.

There are no intermediate decisions.

No buying, selling, timing, rebalancing, or changing the portfolio is allowed during the five-year period.

The visual emphasis is the **path through time**, not merely the ending score.

### Step 4 — Expectation vs. Reality

After the chart is revealed, compare the player's ex-ante expectation with what actually happened.

Examples:

> **You expected Cisco to do best.**  
> It finished 5th of 7.

or:

> **You expected Amazon to do best.**  
> It did.

The experience then explains what people were focused on, what actually mattered, what faded from importance, and what was not reasonably knowable at the starting date.

---


## 5. Historical Date Selection

The 24-scenario MVP should contain two distinct date-selection cohorts.

### Cohort A — Historically Important Dates: 50%

Select approximately 12 dates because the period is historically useful or recognizable.

These may include:

- major bull or bear markets
- recessions
- crashes
- recoveries
- bubbles
- high-inflation or high-rate environments
- geopolitical crises
- major technological transitions
- other periods that later became historically significant

These dates may knowingly use historical importance as a selection criterion.

Even here, do not choose dates merely to manufacture a particular investment moral such as “hot stocks lose.”

### Cohort B — Random Dates: 50%

Select approximately 12 dates randomly from an eligible monthly universe spanning the target period.

The random-selection process should be defined **before examining the subsequent five-year returns**.

It may be stratified by decade or broad era to avoid accidental clustering, but future investment outcomes must not influence whether a selected date is retained.

A random date may be rejected only for predeclared operational reasons such as:

- insufficient public data;
- inability to construct the required five-year asset series;
- irreparable source gaps;
- duplicate or near-duplicate coverage of another selected month.

Do **not** reject a random date because:

- nothing dramatic happened;
- all major assets behaved similarly;
- the hot stocks performed as expected;
- the subsequent five years are not narratively exciting.

For random dates, record the selection method and random seed/draw metadata so the process is auditable.

### Collection-wide environment coverage

Across both cohorts, the scenario set should expose players to environments including:

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

Dates should use a consistent monthly convention. The implementation may use month-end or the first trading day of a month, but the convention must be consistent within the return engine and documented.

---

## 6. Screen 1 — “You Are Here”

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

## 7. Historical News Feed

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

A **broad range of historically relevant publications is desirable**, because different outlets reflect different parts of the information environment.

However, source diversity is a preference rather than a hard quota. A strong historical archive may supply many of a scenario's stories. Do not replace better contemporary stories or perform disproportionate research solely to increase the number of publishers.

The Wall Street Journal may be weighted more heavily for business and financial context when usable public material is available, but it is **not required**.

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

The game should store the player-facing headline and summary locally as part of the prebuilt scenario. Publisher URLs and archive references are provenance only; the live game must not depend on those external pages remaining available.

Prefer metadata, short excerpts where permitted, and human/AI-written summaries grounded in the source. A source URL later becoming unavailable does not invalidate an otherwise well-supported stored scenario.

### No hindsight selection

Stories should be selected based on their apparent prominence **at the scenario date**.

A story should not be promoted merely because later history made it important.

Stories that later proved irrelevant are desirable because they reinforce the game's educational purpose.

---

## 8. “The World Right Now”

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

## 9. Recent Market Performance

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

## 10. “Stocks Everyone Is Talking About”

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

## 11. Selecting the Three Hot Stocks

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

## 12. Screen 2 — Allocate $10,000

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

## 13. Allocation Interface

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


## 14. Prediction and Commit Screen

After the allocation is complete, ask exactly one expectation question:

> ## What do you think will do best over the next five years?
>
> Cash  
> Bonds  
> US Total Market  
> International ex-US  
> Cisco  
> Microsoft  
> Yahoo

The player taps one choice.

Then show the commitment:

> ## Ready?
>
> You are investing **$10,000 in September 1999**.
>
> You cannot make any changes for five years.
>
> You think **Cisco** will do best.
>
> **Invest and see what happens**

The prediction is deliberately simple. Do not ask for a percentage return, market level, or probability forecast.

Do not warn about upcoming historical events.

Do not provide hints.

Do not generate a risk score.

---

## 15. Information Firewall

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


## 16. Screen 3 — Five-Year Reveal

After the player commits, reveal the next five years.

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

### Reveal behavior

The chart should reveal the 60-month path progressively over a short, bounded animation rather than instantly jumping to the ending value.

The purpose is to make the player experience:

- drawdowns;
- recoveries;
- reversals in apparent winners;
- long periods when a decision looks wrong before recovering;
- periods when an early winner later collapses.

Respect reduced-motion settings and provide the complete static chart when animation is disabled.

Do not pause for trading decisions during the reveal.

---

## 17. Comparison Lines

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


## 18. Outcome and Expectation Summary

After the chart path has been revealed, show the ending values.

Example:

> ## Five years later
>
> Your $10,000 became:
>
> **$12,840**

Then show comparisons with lower visual emphasis:

> US Total Market: **$9,950**  
> Diversified benchmark: **$11,730**

Also show:

- total five-year return;
- lowest observed monthly portfolio value;
- highest observed monthly portfolio value.

Then explicitly compare expectation with reality:

> ## What did you expect?
>
> You picked **Cisco** to do best.
>
> **Actual best performer: Bonds**  
> Cisco finished **5th of 7**.

If the player's prediction was correct, say so plainly. The product must not assume that popular or concentrated choices are destined to fail.

Where useful, call out path dependence:

> After 18 months, your portfolio was down 32%. By year five, it had recovered and finished ahead of the US market.

Avoid arcade-game scoring.

Do not award coins, points, streaks, grades, or cumulative rewards for beating the market.

---


## 19. Historical Events on the Chart

After the result is revealed, place approximately **3–5 event markers** on the chart.

Examples:

- March 2000 — dot-com stocks begin falling sharply
- September 2001 — September 11 attacks; US markets temporarily close
- October 2002 — US bear market reaches its low

Label these as **major events during the period**, not automatically as explanations for specific market movements.

Avoid implying simple causality unless it is unusually well supported.

The chart should teach that markets and economies do not always provide a clean narrative explanation for every rise or fall.

Event annotations are revealed only after the investment is committed.

They exist to give historical context to the path the player just experienced, not to turn the game into a history quiz.

---

## 20. “What Happened Next?”

Below the graph, include a short, neutral explanation of the five-year period.

Target approximately 150–250 words.

The explanation should:

- summarize the major economic and market developments
- connect chart movements to important historical events where appropriate
- mention when highly salient starting-date concerns later faded from importance
- avoid hindsight-shaming language
- avoid implying that subsequent outcomes should have been obvious

The tone should be descriptive rather than prescriptive.

Write the narrative and four reflections for ages 8–12: use common words, short sentences, short paragraphs, and concrete events. Explain any financial term that cannot be avoided. Keep research methods, data sources, proxy choices, return calculations, vendor details, and model or editorial decisions out of player-facing prose; keep useful technical detail in provenance or developer documentation. Make clear that the future was uncertain at the starting date.

---


## 21. Reflection

Do not end each round with a single neat “lesson” that implies the five-year result should have been predictable.

Instead, use four compact scenario-specific reflections.

### What people were focused on

What narratives, recent returns, forecasts, fears, or enthusiasms were especially salient at the starting date?

### What actually mattered

Which subsequent developments appear to have materially shaped the five-year investing environment?

Use cautious language about causality.

### What faded away

Which stories or concerns seemed prominent at the start but later became much less consequential to the five-year outcome?

### What nobody knew

Identify an important subsequent development that was not reasonably knowable at the starting date.

This section should reinforce uncertainty rather than imply that the player missed an obvious clue.

Sometimes the correct reflection is that the popular expectation was broadly right. Sometimes the surprise is the size, timing, or path of the outcome rather than its direction.

---


## 22. Between-Scenario Flow and Five-Scenario Checkpoints

After an ordinary scenario, provide a clear **Next scenario** action.

After every fifth completed scenario in the current session, pause before continuing and show a **How you are doing** checkpoint scorecard.

The checkpoint covers only the most recent five-scenario block.

Example:

> ## How you are doing — Scenarios 1–5

### Your decisions

Show:

- average allocation to broad stock funds;
- average allocation to the three hot stocks;
- average allocation to bonds;
- average allocation to cash;
- how often the player made a highly concentrated allocation, using a simple predeclared threshold.

### Your expectations

Show:

- expected winner correctly identified: **2 of 5**;
- expected winner finished in the bottom half: **2 of 5**;
- one-year leader differed from five-year winner: **3 of 5**.

### What your portfolios experienced

Show:

- average ending value of the five $10,000 hypothetical portfolios;
- diversified-benchmark average ending value for the same five scenarios;
- player portfolio finished above the diversified benchmark: **2 of 5**;
- portfolio experienced a 20%+ peak-to-trough drawdown: **3 of 5**.

These figures are descriptive, not a grade.

Do not combine them into one numeric score.

### One compact observation

Generate or select one short observation grounded in the block's statistics, for example:

> **Your expectations were more confident than the outcomes:** you picked the eventual winner once, while three of the five apparent leaders changed before year five.

or:

> **This block was unusually straightforward:** the investment leading after year one also won after five years in four of five scenarios.

The observation must not shame the player or pretend that a low prediction hit rate indicates poor judgment.

### Continue or end

If the chosen session length has not been reached, offer:

- **Continue**
- **End session now**

If the player ends early at a five-scenario checkpoint, show the normal end-of-session scorecard using the completed blocks.

If the session target has been reached, go directly to the end-of-session scorecard.

Replaying a previously completed scenario should not alter first-time session statistics unless the session itself explicitly includes replays.

---


## 23. End-of-Session Scorecard

At the end of the selected session, show a required **How you did** scorecard.

Do not reduce the session to a single score, letter grade, or “beat the market” result.

The scorecard has two levels:

1. **Overall session**
2. **Each five-scenario sub-session**

### Overall session summary

Show the same core measures used at five-scenario checkpoints, aggregated across the entire session.

#### How you invested

- average allocation to broad stock funds;
- average allocation to individual hot stocks;
- average allocation to bonds;
- average allocation to cash;
- concentration frequency.

#### What you expected

- number and percentage of scenarios where the expected winner actually won;
- number where the expected winner finished in the bottom half;
- number where the year-one leader differed from the five-year winner.

#### What happened to your portfolios

- average five-year ending value;
- median five-year ending value;
- average diversified-benchmark ending value;
- number of scenarios where the player's portfolio finished above the diversified benchmark;
- number of scenarios with a 20%+ drawdown;
- largest drawdown experienced in any scenario.

#### Important vs. random history

After the entire session is over, reveal which scenarios came from the historically important cohort and which came from the random cohort.

Summarize the two groups separately where sample size is large enough to be meaningful.

Useful comparisons include:

- prediction hit rate;
- average ending portfolio value;
- benchmark-beating frequency;
- leader-reversal frequency;
- drawdown frequency.

The purpose is to show that an ordinary-looking date can produce surprising outcomes and that a historically famous date was not necessarily easier to predict while living through it.

Do not over-interpret differences from small samples.

### Five-scenario block scorecards

Below the overall summary, show one compact card for every completed five-scenario block:

> **Scenarios 1–5**  
> Winner predictions: 2/5  
> Avg. hot-stock allocation: 31%  
> Avg. ending value: $12,140  
> Above diversified benchmark: 2/5  
> 20%+ drawdowns: 3/5  
> Leader changed by year five: 3/5

> **Scenarios 6–10**  
> Winner predictions: 1/5  
> Avg. hot-stock allocation: 18%  
> Avg. ending value: $13,020  
> Above diversified benchmark: 3/5  
> 20%+ drawdowns: 2/5  
> Leader changed by year five: 4/5

This lets the player compare how their behavior and outcomes changed across the session without implying that later blocks are necessarily “better.”

### End-of-session synthesis

Finish with a short synthesis based on the player's actual session data.

Good examples:

> **The future was hard to rank:** your expected winner was correct in 3 of 10 scenarios, and the investment leading after one year changed by year five in 6 of 10.

> **Your allocations became less concentrated over the session, but both concentrated and diversified choices sometimes worked.**

Avoid generic praise and avoid statements such as “you should have known.”

### Persistent player history

Outside an active session, the game may also maintain cumulative history across sessions.

Keep cumulative history secondary to the current session scorecard.

Useful cumulative measures include:

- scenarios completed;
- average allocation by asset category;
- prediction hit rate;
- concentration frequency;
- drawdown frequency;
- leader-reversal frequency.

Do not make cumulative benchmark outperformance the primary score or objective.

---

## 24. Child-Friendly Design

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

## 25. Data Philosophy

The game optimizes for **historical plausibility, transparency, and educational usefulness**, not institutional backtest perfection or research-grade historical reconstruction.

### Materiality over precision

Use enough precision to avoid materially misleading the player.

Examples of material problems that require correction:

- an impossible or clearly wrong return path;
- a corporate action that causes the wrong economic outcome;
- a fabricated or misdated story;
- starting information that relies on future knowledge;
- a data error large enough to meaningfully change the five-year comparison.

Examples that normally do **not** justify more research:

- small differences between reputable adjusted-price vendors;
- exact dividend-reinvestment timing;
- obtaining multiple independent sources for an ordinary uncontested headline;
- proving that an archived URL is still reachable years later;
- reconstructing institutional index methodology when a transparent proxy teaches the same concept.

The project should stop researching once the scenario is credible, coherent, and fit for the intended 8–12-year-old audience.

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

Every scenario should retain **lightweight** metadata sufficient to answer:

- where did this number/story come from?
- was the underlying information available by the scenario date?
- was an approximation or fallback used?

One credible source is generally enough for an ordinary uncontested item. Additional corroboration is useful when a fact is ambiguous, disputed, or materially important, but is not a default requirement.

---

## 26. Preferred Public Source Families

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

Prefer multiple source families when practical. Variety is desirable because a single outlet can overrepresent one editorial lens, but it is **not a hard qualification gate**.

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

The final displayed feed should favor historical prominence and breadth over modern editorial-quality judgments. Do not spend substantial effort chasing alternative sources solely to satisfy a diversity count.

### Individual stocks

Use public historical adjusted-price/return sources plus targeted public research.

A stock is eligible only when the project can build a sufficiently coherent pre-period and five-year outcome history.

---

## 27. Data Integrity Rules

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

Reproducibility is a practical engineering property, not a requirement for forensic archival proof. Byte-level source-body archives, repeated live-source checks, and elaborate research audit trails are unnecessary unless they solve a concrete correctness problem.

---


## 28. MVP Scope

Build **24 prebuilt scenarios**.

The scenario set must contain:

- **12 historically important dates**
- **12 randomly selected eligible dates**

Candidate eras should span the full target range rather than cluster around the 2000s.

### Important-date cohort

Choose dates that provide useful exposure to recognizable economic and investing environments.

The important cohort should include a mix of famous crises, booms, recoveries, and major transitions.

### Random-date cohort

Define the eligible month universe and random-selection method before inspecting future outcomes.

Prefer a reproducible stratified random draw across decades or broad eras so that the sample is geographically temporal rather than accidentally concentrated.

Record:

- eligible universe definition;
- exclusions known before the draw;
- random seed;
- selected dates;
- any post-draw rejection and its allowed operational reason;
- replacement draw, if needed.

Do not replace a valid random date because its future is boring or because its outcome weakens a preferred teaching narrative.

### Outcome neutrality

Do not curate the collection so that:

- hot stocks usually lose;
- diversified portfolios always win;
- forecasts usually fail;
- the consensus is usually wrong.

Across the collection, audit for obvious one-sided outcome patterns, but **do not manipulate individual scenarios to hit a target result distribution**.

The desired lesson is that the outcome was uncertain at the time—including cases where the obvious-looking bet worked.

---

## 29. Explicit Non-Goals

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


## 30. Product Principle

Every proposed feature should pass this test:

> **Does this help the player experience what it was like to make a long-term investment decision without knowing the future?**

If not, remove it.

The player sees a noisy world, makes one consequential but simple allocation, records one expectation, and then watches an unknowable five-year future unfold.

The game's thesis is:

> **Investment decisions must be made using the information available now, while outcomes are determined by a future nobody gets to see. Contemporary news, expert forecasts, recent returns, and popular investments can all contain useful information—but their importance is much easier to understand in hindsight than in the moment.**

The game should preserve genuine ambiguity. Sometimes the popular stock wins. Sometimes diversification wins. Sometimes bonds or cash surprise. Sometimes the major headline matters. Sometimes it fades away. Sometimes the most consequential event has not happened yet.

The product succeeds when the player finishes a round thinking:

> **“That outcome makes sense now that I know it—but I could not have known it then.”**

---

