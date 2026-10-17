# Hot-stock result summaries: proposed improvements

**Report date:** 2026-10-17  
**Base commit:** `44780fade95d6a344b087d9daeaa2111c5172446`

## Purpose and scope

**Coverage:** 150 stock explanations across all 50 historical scenarios, with three hot stocks per round.

The reveal previously repeated each company’s `known_at_start` description on its result card. This proposal adds a separate, future-only summary for each hot stock. It does not alter player choices, starting information, or the monthly return series. New business developments were checked against each exact five-year outcome window; earlier events are identified as starting context. When a retrospective source establishes an event or result that occurred within that window, the source notes below identify its publication timing; a later announcement is not presented as though players could have known it earlier. These stories provide business context for the outcome, not a statistical attribution of share returns.

This report is generated from each historical scenario’s `data/research/<scenario>/outcome-inputs.json` and `outcome-provenance.json`, the corresponding starting descriptions in `known_at_start.json`, and the existing outcome monthly-return and return-source data. The exact proposed player copy and original descriptions below are copied from JSON without editorial rewriting. Five-year returns are calculated as `product(1 + monthly_return) - 1` and displayed to one decimal place.

**Review status:** Research, implementation, and validation completed. The full repository check and both desktop/mobile browser suites passed; details are recorded below. This file was written before the GitHub pull request was created.

## Scenario cards

### 1980-03 — decision date 1980-03-31 through final return month 1985-03

Return observations cover the 60 consecutive months after the starting month and run through **1985-03**.

#### IBM (IBM)

**Five-year total return:** +185.8%

**Proposed future-only summary (exact JSON text):**

> IBM launched its personal computer in August 1981, opening a large new market for the company. The business kept growing: in 1984, annual profit rose about 20% to $6.6 billion. Those were concrete signs of business strength during a five-year stretch that rewarded IBM shareholders.

**Original `known_at_start` description:**

> A major computer maker whose size has brought antitrust scrutiny.

**Business-source references:** [1](#source-1), [2](#source-2)  
**Existing return-series reference(s):** [3](#source-3)

#### Texas Instruments (TXN)

**Five-year total return:** +47.8%

**Proposed future-only summary (exact JSON text):**

> Texas Instruments learned that an exciting product could still lose money. It left the home-computer business in 1983 and reported a $145 million loss for that year. By August 1984, the company was back in profit and focusing on industrial products. Its investment finished higher, but the home-computer adventure had been costly.

**Original `known_at_start` description:**

> A chipmaker also competing in the new home-computer market.

**Business-source references:** [4](#source-4), [5](#source-5)  
**Existing return-series reference(s):** [6](#source-6)

#### Exxon (XOM)

**Five-year total return:** +176.7%

**Proposed future-only summary (exact JSON text):**

> Exxon’s oil business kept earning money through a difficult economy. In 1983, profit rose about 19% to nearly $5 billion. More oil production in places such as the North Sea, Australia and Malaysia helped. That business progress gives more context for Exxon’s strong result than oil-price headlines alone.

**Original `known_at_start` description:**

> Large oil profits have attracted attention and calls for a new tax.

**Business-source references:** [7](#source-7)  
**Existing return-series reference(s):** [8](#source-8)

### 1981-08 — decision date 1981-08-31 through final return month 1986-08

Return observations cover the 60 consecutive months after the starting month and run through **1986-08**.

#### IBM (IBM)

**Five-year total return:** +204.5%

**Proposed future-only summary (exact JSON text):**

> The new IBM PC became a major business: more than 750,000 machines sold within two years of its 1981 launch. Company profit reached $6.6 billion in 1984. But profit stopped growing in 1985 as computer competition intensified. The investment still rose strongly over the whole five years, despite that slowdown.

**Original `known_at_start` description:**

> Its new personal computer brings a giant into the home-computer contest.

**Business-source references:** [9](#source-9), [2](#source-2), [10](#source-10)  
**Existing return-series reference(s):** [3](#source-3)

#### Coca-Cola (KO)

**Five-year total return:** +349.4%

**Proposed future-only summary (exact JSON text):**

> Coca-Cola launched Diet Coke in July 1982, and it became America’s leading diet soft drink by the end of 1983. Another launch went badly: customers rejected New Coke in 1985, so the original formula returned that July. A successful new drink and a quick response to an unpopular change shaped these years of strong investment gains.

**Original `known_at_start` description:**

> Coke and Pepsi compete fiercely for buyers around the world.

**Business-source references:** [11](#source-11), [12](#source-12)  
**Existing return-series reference(s):** [13](#source-13)

#### Exxon (XOM)

**Five-year total return:** +228.5%

**Proposed future-only summary (exact JSON text):**

> Lower oil and gas prices cut Exxon’s annual profit by about 12% in 1985. Yet the company also turned crude oil into fuels and sold them to customers. That side of the business, especially in Europe, helped earnings improve in the second quarter of 1986. Exxon’s strong investment result came with uneven profits along the way.

**Original `known_at_start` description:**

> The oil giant faces weaker demand and lower industry profits.

**Business-source references:** [14](#source-14), [15](#source-15)  
**Existing return-series reference(s):** [8](#source-8)

### 1981-09 — decision date 1981-09-30 through final return month 1986-09

Return observations cover the 60 consecutive months after the starting month and run through **1986-09**.

#### IBM (IBM)

**Five-year total return:** +200.6%

**Proposed future-only summary (exact JSON text):**

> The new IBM PC became a major business: more than 750,000 machines sold within two years of its 1981 launch. Company profit reached $6.6 billion in 1984. But profit stopped growing in 1985 as computer competition intensified. The investment still rose strongly over the whole five years, despite that slowdown.

**Original `known_at_start` description:**

> Its new personal computer brings a giant into the home-computer contest.

**Business-source references:** [9](#source-9), [2](#source-2), [10](#source-10)  
**Existing return-series reference(s):** [3](#source-3)

#### Coca-Cola (KO)

**Five-year total return:** +285.6%

**Proposed future-only summary (exact JSON text):**

> Coca-Cola launched Diet Coke in July 1982, and it became America’s leading diet soft drink by the end of 1983. Another launch went badly: customers rejected New Coke in 1985, so the original formula returned that July. A successful new drink and a quick response to an unpopular change shaped these years of strong investment gains.

**Original `known_at_start` description:**

> Coke and Pepsi compete fiercely for buyers around the world.

**Business-source references:** [11](#source-11), [12](#source-12)  
**Existing return-series reference(s):** [13](#source-13)

#### Exxon (XOM)

**Five-year total return:** +234.9%

**Proposed future-only summary (exact JSON text):**

> Lower oil and gas prices cut Exxon’s annual profit by about 12% in 1985. Yet the company also turned crude oil into fuels and sold them to customers. That side of the business, especially in Europe, helped earnings improve in the second quarter of 1986. Exxon’s strong investment result came with uneven profits along the way.

**Original `known_at_start` description:**

> The oil giant faces weaker demand and lower industry profits.

**Business-source references:** [14](#source-14), [15](#source-15)  
**Existing return-series reference(s):** [8](#source-8)

### 1982-08 — decision date 1982-08-31 through final return month 1987-08

Return observations cover the 60 consecutive months after the starting month and run through **1987-08**.

#### Apple Computer (AAPL)

**Five-year total return:** +501.7%

**Proposed future-only summary (exact JSON text):**

> Apple introduced the Macintosh in January 1984. Pairing Macs with LaserWriter printers then gave businesses a new way to make polished pages. The Macintosh SE and Macintosh II widened the range in 1987; second-quarter sales that year rose 42%. These new uses and growing sales help explain the company’s progress during a strong five-year investment.

**Original `known_at_start` description:**

> Home computer feature discusses Apple machines and consumer enthusiasm.

**Business-source references:** [16](#source-16), [17](#source-17), [18](#source-18)  
**Existing return-series reference(s):** [19](#source-19)

#### International Business Machines (IBM)

**Five-year total return:** +181.4%

**Proposed future-only summary (exact JSON text):**

> IBM’s annual profit rose about 20% in 1984, but its early lead in personal computers attracted cheaper rivals. In 1987 it launched the PS/2 to fight back. The investment ended well above its starting value, while the new product showed that even a computer giant had to keep defending its business.

**Original `known_at_start` description:**

> Central company in industrial espionage investigation.

**Business-source references:** [2](#source-2), [9](#source-9)  
**Existing return-series reference(s):** [3](#source-3)

#### Coca-Cola (KO)

**Five-year total return:** +376.9%

**Proposed future-only summary (exact JSON text):**

> Diet Coke became America’s leading diet soft drink by the end of 1983. Coca-Cola then changed its main drink’s formula in April 1985, angering many customers. The original returned in July. The company’s strong investment result covered both a successful growing brand and a famous product mistake.

**Original `known_at_start` description:**

> Columbia ownership brings consumer brand rivalry into studio business.

**Business-source references:** [11](#source-11), [12](#source-12)  
**Existing return-series reference(s):** [13](#source-13)

### 1982-09 — decision date 1982-09-30 through final return month 1987-09

Return observations cover the 60 consecutive months after the starting month and run through **1987-09**.

#### Apple Computer (AAPL)

**Five-year total return:** +520.9%

**Proposed future-only summary (exact JSON text):**

> Apple introduced the Macintosh in January 1984. Pairing Macs with LaserWriter printers then gave businesses a new way to make polished pages. The Macintosh SE and Macintosh II widened the range in 1987; second-quarter sales that year rose 42%. These new uses and growing sales help explain the company’s progress during a strong five-year investment.

**Original `known_at_start` description:**

> Home computers are drawing attention, including Apple’s machines.

**Business-source references:** [16](#source-16), [17](#source-17), [18](#source-18)  
**Existing return-series reference(s):** [19](#source-19)

#### IBM (IBM)

**Five-year total return:** +142.1%

**Proposed future-only summary (exact JSON text):**

> IBM’s annual profit rose about 20% in 1984, but its early lead in personal computers attracted cheaper rivals. In 1987 it launched the PS/2 to fight back. The investment ended well above its starting value, while the new product showed that even a computer giant had to keep defending its business.

**Original `known_at_start` description:**

> The computer giant is fighting to protect its designs.

**Business-source references:** [2](#source-2), [9](#source-9)  
**Existing return-series reference(s):** [3](#source-3)

#### Coca-Cola (KO)

**Five-year total return:** +336.0%

**Proposed future-only summary (exact JSON text):**

> Diet Coke became America’s leading diet soft drink by the end of 1983. Coca-Cola then changed its main drink’s formula in April 1985, angering many customers. The original returned in July. The company’s strong investment result covered both a successful growing brand and a famous product mistake.

**Original `known_at_start` description:**

> The soft-drink company also owns Columbia Pictures.

**Business-source references:** [11](#source-11), [12](#source-12)  
**Existing return-series reference(s):** [13](#source-13)

### 1982-10 — decision date 1982-10-31 through final return month 1987-10

Return observations cover the 60 consecutive months after the starting month and run through **1987-10**.

#### Apple Computer (AAPL)

**Five-year total return:** +205.3%

**Proposed future-only summary (exact JSON text):**

> Apple introduced the Macintosh in January 1984. Pairing Macs with LaserWriter printers then gave businesses a new way to make polished pages. The Macintosh SE and Macintosh II widened the range in 1987; second-quarter sales that year rose 42%. These new uses and growing sales help explain the company’s progress during a strong five-year investment.

**Original `known_at_start` description:**

> Home computers are drawing attention, including Apple’s machines.

**Business-source references:** [16](#source-16), [17](#source-17), [18](#source-18)  
**Existing return-series reference(s):** [19](#source-19)

#### IBM (IBM)

**Five-year total return:** +80.7%

**Proposed future-only summary (exact JSON text):**

> IBM’s annual profit rose about 20% in 1984, but its early lead in personal computers attracted cheaper rivals. In 1987 it launched the PS/2 to fight back. The investment ended well above its starting value, while the new product showed that even a computer giant had to keep defending its business.

**Original `known_at_start` description:**

> The computer giant is fighting to protect its designs.

**Business-source references:** [2](#source-2), [9](#source-9)  
**Existing return-series reference(s):** [3](#source-3)

#### Coca-Cola (KO)

**Five-year total return:** +246.3%

**Proposed future-only summary (exact JSON text):**

> Diet Coke became America’s leading diet soft drink by the end of 1983. Coca-Cola then changed its main drink’s formula in April 1985, angering many customers. The original returned in July. The company’s strong investment result covered both a successful growing brand and a famous product mistake.

**Original `known_at_start` description:**

> The soft-drink company also owns Columbia Pictures.

**Business-source references:** [11](#source-11), [12](#source-12)  
**Existing return-series reference(s):** [13](#source-13)

### 1983-05 — decision date 1983-05-31 through final return month 1988-05

Return observations cover the 60 consecutive months after the starting month and run through **1988-05**.

#### Apple Computer (AAPL)

**Five-year total return:** +45.0%

**Proposed future-only summary (exact JSON text):**

> The Macintosh arrived in January 1984, followed by a growing market for designing and printing pages on Macs. New Macintosh models helped Apple’s profit more than double in the quarter ending January 1, 1988. The investment finished higher, with real sales and earnings progress behind the company’s computer story.

**Original `known_at_start` description:**

> Its new Lisa computer uses a mouse to make computing easier.

**Business-source references:** [16](#source-16), [17](#source-17), [20](#source-20)  
**Existing return-series reference(s):** [19](#source-19)

#### IBM (IBM)

**Five-year total return:** +19.4%

**Proposed future-only summary (exact JSON text):**

> IBM reached record annual profit of about $6.6 billion in 1984, but profit was slightly lower in 1985. Cheaper competing PCs were taking business, and IBM answered with the PS/2 in 1987. Its investment gained over five years, although the company was finding it harder to turn its famous name into faster growth.

**Original `known_at_start` description:**

> A large computer company at the center of the shift toward high technology.

**Business-source references:** [2](#source-2), [10](#source-10), [9](#source-9)  
**Existing return-series reference(s):** [3](#source-3)

#### Walt Disney Productions (DIS)

**Five-year total return:** +229.4%

**Proposed future-only summary (exact JSON text):**

> Michael Eisner and Frank Wells took charge of Disney in 1984. The company added its first Disney Store in 1987, giving fans another place to buy its characters. That July, Disney reported record quarterly profit of $128 million, helped by parks and films. The strong stock result accompanied an expanding, more profitable entertainment business.

**Original `known_at_start` description:**

> Tokyo Disneyland has opened, taking Disney’s park name overseas.

**Business-source references:** [21](#source-21), [22](#source-22)  
**Existing return-series reference(s):** [23](#source-23)

### 1984-11 — decision date 1984-11-30 through final return month 1989-11

Return observations cover the 60 consecutive months after the starting month and run through **1989-11**.

#### Procter & Gamble (PG)

**Five-year total return:** +169.0%

**Proposed future-only summary (exact JSON text):**

> Procter & Gamble bought Richardson-Vicks in 1985, expanding its health-care brands. Its everyday products also kept selling: profit for the year ending June 1989 rose 18%, helped by record US shipments and strong business abroad. Those growing sales and profits gave the investment’s rise a concrete business foundation.

**Original `known_at_start` description:**

> Its Crest brand is trying pump packaging in the toothpaste contest.

**Business-source references:** [24](#source-24), [25](#source-25)  
**Existing return-series reference(s):** [26](#source-26)

#### Colgate-Palmolive (CL)

**Five-year total return:** +202.7%

**Proposed future-only summary (exact JSON text):**

> Colgate-Palmolive reported higher annual earnings in 1986 as sales and new products did well. In 1987 it bought Softsoap, adding a familiar liquid-soap brand. The company was finding more products to sell alongside toothpaste and other household goods during a five-year stretch of strong investment gains.

**Original `known_at_start` description:**

> A new toothpaste pump is one way it competes for everyday customers.

**Business-source references:** [27](#source-27), [28](#source-28)  
**Existing return-series reference(s):** [29](#source-29)

#### General Electric (GE)

**Five-year total return:** +159.7%

**Proposed future-only summary (exact JSON text):**

> GE completed its purchase of RCA in June 1986, bringing the NBC television network into the company. Its earnings also grew: 1988 profit reached about $3.4 billion, up 16% from 1987. GE’s strong investment result came as the business expanded beyond its familiar appliances and industrial equipment.

**Original `known_at_start` description:**

> This large industrial company is named in the debate over corporate taxes.

**Business-source references:** [30](#source-30), [31](#source-31)  
**Existing return-series reference(s):** [32](#source-32)

### 1985-09 — decision date 1985-09-30 through final return month 1990-09

Return observations cover the 60 consecutive months after the starting month and run through **1990-09**.

#### Apple Computer (AAPL)

**Five-year total return:** +280.3%

**Proposed future-only summary (exact JSON text):**

> New Macintosh SE and Macintosh II computers in 1987 broadened Apple’s appeal to businesses. Profit more than doubled in the quarter ending January 1, 1988. Growth then became bumpier: Apple announced 400 layoffs in February 1990. Its large five-year gain included both a successful product expansion and later pressure to control costs.

**Original `known_at_start` description:**

> Steve Jobs has left the company he helped create and is starting another computer business.

**Business-source references:** [18](#source-18), [20](#source-20), [33](#source-33)  
**Existing return-series reference(s):** [19](#source-19)

#### Coca-Cola (KO)

**Five-year total return:** +287.2%

**Proposed future-only summary (exact JSON text):**

> After the New Coke mistake, Coca-Cola’s drinks business continued to grow. In 1988, sales rose about 9% to $8.3 billion and profit rose 14% to just over $1 billion. Those results show the company earning more from its business during this strong investment stretch, rather than simply recovering from one bad headline.

**Original `known_at_start` description:**

> Customer protests have brought the old drink formula back as Classic Coke.

**Business-source references:** [34](#source-34)  
**Existing return-series reference(s):** [13](#source-13)

#### IBM (IBM)

**Five-year total return:** +3.4%

**Proposed future-only summary (exact JSON text):**

> IBM launched the PS/2 in 1987 and sold roughly three million in its first two years. But cheaper rivals copied improvements and offered competing machines. Selling a popular new computer did not secure IBM’s lead. The investment ended only a little above its starting value as the company faced tough competition.

**Original `known_at_start` description:**

> The computer giant has stopped making its disappointing PCjr home computer.

**Business-source references:** [9](#source-9)  
**Existing return-series reference(s):** [3](#source-3)

### 1985-11 — decision date 1985-11-30 through final return month 1990-11

Return observations cover the 60 consecutive months after the starting month and run through **1990-11**.

#### Apple Computer (AAPL)

**Five-year total return:** +278.4%

**Proposed future-only summary (exact JSON text):**

> Apple expanded its Macintosh family in 1987, then introduced the smaller, less expensive Macintosh IIcx in March 1989 for business customers. The boom was uneven: by February 1990, Apple was cutting 400 jobs. The investment still finished far ahead, but new products did not remove the need to manage costs.

**Original `known_at_start` description:**

> Its co-founder’s departure has added uncertainty to a struggling computer business.

**Business-source references:** [18](#source-18), [35](#source-35), [33](#source-33)  
**Existing return-series reference(s):** [19](#source-19)

#### Walt Disney Productions (DIS)

**Five-year total return:** +315.2%

**Proposed future-only summary (exact JSON text):**

> Disney opened its Disney-MGM Studios park in May 1989. The Little Mermaid in cinemas and Roger Rabbit on home video helped lift film revenue 23% in the first quarter of fiscal 1990. Disney then reported record annual sales and profit that November. Its large investment gain accompanied new attractions and successful entertainment that brought in money.

**Original `known_at_start` description:**

> Its new film The Journey of Natty Gann brings an adventurous young heroine to cinemas.

**Business-source references:** [21](#source-21), [36](#source-36), [37](#source-37)  
**Existing return-series reference(s):** [23](#source-23)

#### Coca-Cola (KO)

**Five-year total return:** +278.1%

**Proposed future-only summary (exact JSON text):**

> Coca-Cola’s familiar drinks became a growing business through these years. In 1988, annual sales increased about 9%, while profit increased 14% to roughly $1 billion. More money coming in and more money left as profit are concrete business improvements behind a period when this investment rose strongly.

**Original `known_at_start` description:**

> The company now sells both the new drink and the revived classic formula.

**Business-source references:** [34](#source-34)  
**Existing return-series reference(s):** [13](#source-13)

### 1987-01 — decision date 1987-01-31 through final return month 1992-01

Return observations cover the 60 consecutive months after the starting month and run through **1992-01**.

#### International Business Machines (IBM)

**Five-year total return:** −14.4%

**Proposed future-only summary (exact JSON text):**

> IBM introduced the PS/2 in 1987, but cheaper competing PCs kept challenging it. For 1991, the company recorded a $2.8 billion annual loss, including large costs for staff cuts and retiree benefits. Its five-year investment lost value: a new computer line had not solved the wider business pressures.

**Original `known_at_start` description:**

> IBM is a prominent industrial company as compatible computers draw consumer attention.

**Business-source references:** [9](#source-9), [38](#source-38)  
**Existing return-series reference(s):** [3](#source-3)

#### General Electric (GE)

**Five-year total return:** +74.6%

**Proposed future-only summary (exact JSON text):**

> GE had several ways to earn money. In the third quarter of 1990, profit rose to about $1 billion, with help from financial services, aircraft engines and power equipment. NBC television and its materials businesses were weaker. The investment gained over five years while stronger divisions helped offset trouble elsewhere.

**Original `known_at_start` description:**

> A prominent industrial conglomerate featured in coverage of major US companies.

**Business-source references:** [39](#source-39)  
**Existing return-series reference(s):** [32](#source-32)

#### Apple Computer (AAPL)

**Five-year total return:** +144.0%

**Proposed future-only summary (exact JSON text):**

> Apple’s Macintosh SE and Macintosh II arrived in 1987, expanding the company’s computer range. Profit more than doubled in the quarter ending January 1, 1988. By February 1990, however, Apple was cutting jobs. The investment still rose strongly, showing a successful product cycle followed by a harder period for the business.

**Original `known_at_start` description:**

> Apple IIGS and Macintosh attract product coverage while clone competition raises uncertainty.

**Business-source references:** [18](#source-18), [20](#source-20), [33](#source-33)  
**Existing return-series reference(s):** [19](#source-19)

### 1987-10 — decision date 1987-10-31 through final return month 1992-10

Return observations cover the 60 consecutive months after the starting month and run through **1992-10**.

#### IBM (IBM)

**Five-year total return:** −31.9%

**Proposed future-only summary (exact JSON text):**

> Competing computer makers made it harder for IBM to protect its lead. The company reported a $2.8 billion loss for 1991, including staff-cut and retiree-benefit costs. Its five-year investment fell. This was a case where a famous, established business still faced expensive changes when its market became more competitive.

**Original `known_at_start` description:**

> The computer giant faces competition from Apple and makers of compatible PCs.

**Business-source references:** [9](#source-9), [38](#source-38)  
**Existing return-series reference(s):** [3](#source-3)

#### McDonald’s (MCD)

**Five-year total return:** +112.3%

**Proposed future-only summary (exact JSON text):**

> McDonald’s opened its first Moscow restaurant in January 1990. Overseas growth helped 1990 profit reach a record $802 million, up 10%. Expansion meant selling meals to more customers in more places. The investment more than doubled across the five years as that international business grew.

**Original `known_at_start` description:**

> The restaurant chain is among advertisers trying space on video-rental boxes.

**Business-source references:** [40](#source-40), [41](#source-41)  
**Existing return-series reference(s):** [42](#source-42)

#### Sony (SONY)

**Five-year total return:** +40.0%

**Proposed future-only summary (exact JSON text):**

> Sony bought CBS Records in January 1988 and Columbia Pictures in November 1989. It now owned music and movies as well as making the equipment used to enjoy them. That gave Sony new businesses to manage and new ways to earn money. The investment ended higher, though the purchases alone could not guarantee success.

**Original `known_at_start` description:**

> The electronics maker is in talks to buy a large record business. This is its US-traded share.

**Business-source references:** [43](#source-43)  
**Existing return-series reference(s):** [44](#source-44)

### 1988-12 — decision date 1988-12-31 through final return month 1993-12

Return observations cover the 60 consecutive months after the starting month and run through **1993-12**.

#### Boeing (BA)

**Five-year total return:** +80.0%

**Proposed future-only summary (exact JSON text):**

> Boeing’s 1990 profit rose 42% to about $1.4 billion. The business later slowed: in November 1992, weaker orders led it to announce lower 757 and 767 production. The investment still ended higher. Strong early earnings and later airline cutbacks both belong in the story of these five years.

**Original `known_at_start` description:**

> Airlines have placed so many jet orders that delivery schedules stretch years ahead.

**Business-source references:** [45](#source-45), [46](#source-46)  
**Existing return-series reference(s):** [47](#source-47)

#### IBM (IBM)

**Five-year total return:** −42.0%

**Proposed future-only summary (exact JSON text):**

> IBM lost nearly $5 billion in 1992, including heavy costs to reorganize the company. Lou Gerstner became chief executive in April 1993, and more job cuts followed that year. The investment finished well below its starting value. A leadership change offered a new direction, but the turnaround was still unfinished at this endpoint.

**Original `known_at_start` description:**

> The computer maker is refreshing products and reorganizing to meet strong competition.

**Business-source references:** [48](#source-48), [49](#source-49), [50](#source-50)  
**Existing return-series reference(s):** [3](#source-3)

#### Sony (SONY)

**Five-year total return:** +9.3%

**Proposed future-only summary (exact JSON text):**

> Sony bought Columbia Pictures in November 1989, adding movies to its electronics and music businesses. Its film group went on to lead the North American box office for three years through 1993. Even with hit films, the investment gained only a little over this window: success in one division did not promise a large return for the whole company.

**Original `known_at_start` description:**

> The electronics maker now owns CBS Records as well as making music-playing equipment. This is its US-traded share.

**Business-source references:** [43](#source-43)  
**Existing return-series reference(s):** [44](#source-44)

### 1989-01 — decision date 1989-01-31 through final return month 1994-01

Return observations cover the 60 consecutive months after the starting month and run through **1994-01**.

#### Boeing (BA)

**Five-year total return:** +72.2%

**Proposed future-only summary (exact JSON text):**

> Boeing earned about $1.4 billion in 1990, up 42%. By the third quarter of 1993, lower aircraft and defense sales and spending on the new 777 were weighing on results. The investment still finished higher, but the business had moved from strong growth into a tougher stretch before the five years ended.

**Original `known_at_start` description:**

> The aircraft maker is handling a large backlog of new airline orders.

**Business-source references:** [45](#source-45), [51](#source-51)  
**Existing return-series reference(s):** [47](#source-47)

#### IBM (IBM)

**Five-year total return:** −45.9%

**Proposed future-only summary (exact JSON text):**

> IBM’s 1992 loss approached $5 billion as it paid heavily to reorganize. New chief executive Lou Gerstner arrived in April 1993, followed by further job cuts. The investment ended far below its starting value. These years capture the costly crisis and the beginning of a rescue, before the later return to annual profit.

**Original `known_at_start` description:**

> The computer giant is refreshing its products while rivals challenge its position.

**Business-source references:** [48](#source-48), [49](#source-49), [50](#source-50)  
**Existing return-series reference(s):** [3](#source-3)

#### Exxon (XOM)

**Five-year total return:** +82.4%

**Proposed future-only summary (exact JSON text):**

> The Exxon Valdez oil spill in March 1989 was a major disaster. Exxon’s business also included turning oil into fuel and selling it: that division earned about $2 billion in 1993, up 28%, helped by earning more from fuel sales and lowering costs. The investment ended higher even though the period included serious damage and setbacks.

**Original `known_at_start` description:**

> A large oil producer in an industry watching a rebound in crude prices.

**Business-source references:** [52](#source-52), [53](#source-53)  
**Existing return-series reference(s):** [8](#source-8)

### 1989-11 — decision date 1989-11-30 through final return month 1994-11

Return observations cover the 60 consecutive months after the starting month and run through **1994-11**.

#### Sony (SONY)

**Five-year total return:** +15.7%

**Proposed future-only summary (exact JSON text):**

> Sony had just bought Columbia Pictures when this window began. In November 1994, it reduced the recorded value of its film business by about $2.7 billion because the investment had not delivered enough profit. The stock investment ended only modestly higher. Owning famous movies had proved different from earning enough to justify the purchase price.

**Original `known_at_start` description:**

> The electronics company has completed its purchase of Columbia Pictures. This is its US-traded share.

**Business-source references:** [43](#source-43), [54](#source-54)  
**Existing return-series reference(s):** [44](#source-44)

#### Coca-Cola (KO)

**Five-year total return:** +187.4%

**Proposed future-only summary (exact JSON text):**

> Coca-Cola kept reaching drinkers around the world. In 1993, the amount of drinks it sold grew 5%, and markets outside the United States supplied 79% of its operating profit. This was a growing global business behind a large investment gain. The familiar American brand was earning much of its money abroad.

**Original `known_at_start` description:**

> Its large Columbia Pictures stake is part of the sale to Sony.

**Business-source references:** [55](#source-55)  
**Existing return-series reference(s):** [13](#source-13)

#### Exxon (XOM)

**Five-year total return:** +61.8%

**Proposed future-only summary (exact JSON text):**

> Exxon’s fuel-making and selling businesses were an important part of its results. In 1993, their earnings rose 28% to about $2 billion, helped by earning more from fuel sales and lowering costs. The five-year investment gained as well. This gives a company-specific reason to look beyond the daily price of crude oil when reading its story.

**Original `known_at_start` description:**

> The company faces public scrutiny after the Exxon Valdez oil spill in Alaska.

**Business-source references:** [53](#source-53)  
**Existing return-series reference(s):** [8](#source-8)

### 1990-08 — decision date 1990-08-31 through final return month 1995-08

Return observations cover the 60 consecutive months after the starting month and run through **1995-08**.

#### IBM (IBM)

**Five-year total return:** +20.4%

**Proposed future-only summary (exact JSON text):**

> IBM went through deep losses and job cuts before Lou Gerstner became chief executive in April 1993. It returned to an annual profit of about $3 billion in 1994. In July 1995 it bought Lotus, adding business software. The investment finished higher after a difficult period in which the company began rebuilding its earnings.

**Original `known_at_start` description:**

> The computer maker is introducing cheaper business computers for smaller companies.

**Business-source references:** [48](#source-48), [49](#source-49), [56](#source-56), [57](#source-57)  
**Existing return-series reference(s):** [3](#source-3)

#### Exxon (XOM)

**Five-year total return:** +73.5%

**Proposed future-only summary (exact JSON text):**

> Exxon earned money from selling fuels as well as finding oil. In 1993, profit from refining and marketing rose 28% to about $2 billion as it earned more from fuel sales and lowered costs. That part of the business helped explain how Exxon could make progress through changing oil markets. Its five-year investment finished higher.

**Original `known_at_start` description:**

> The oil company faces cleanup costs from the Alaska spill and uncertainty in world oil supplies.

**Business-source references:** [53](#source-53)  
**Existing return-series reference(s):** [8](#source-8)

#### Sony (SONY)

**Five-year total return:** +35.5%

**Proposed future-only summary (exact JSON text):**

> Sony’s movie expansion hit trouble: in November 1994, it cut the recorded value of its film business by about $2.7 billion. A new opportunity arrived that December when the PlayStation launched in Japan. The investment ended higher, but the period mixed an expensive disappointment with a promising new product.

**Original `known_at_start` description:**

> The electronics maker has expanded into movies by buying Columbia Pictures. This is its US-traded share.

**Business-source references:** [54](#source-54), [58](#source-58)  
**Existing return-series reference(s):** [44](#source-44)

### 1991-02 — decision date 1991-02-28 through final return month 1996-02

Return observations cover the 60 consecutive months after the starting month and run through **1996-02**.

#### Wal-Mart (WMT)

**Five-year total return:** +23.4%

**Proposed future-only summary (exact JSON text):**

> Walmart expanded stores that sold groceries alongside other goods. Its US supercenters grew from 9 in January 1991 to 239 in January 1996, while annual sales grew from about $33 billion to $94 billion. But profit growth slowed to about 2% in the final year. The business grew much faster than this investment’s modest gain.

**Original `known_at_start` description:**

> The discount retailer has passed Sears in North American sales and still has room to expand.

**Business-source references:** [59](#source-59)  
**Existing return-series reference(s):** [60](#source-60)

#### Harley-Davidson (HOG)

**Five-year total return:** +441.5%

**Proposed future-only summary (exact JSON text):**

> Harley-Davidson had more motorcycle demand than it could easily supply. In the third quarter of 1995, it shipped about 25,000 bikes, 11% more than a year earlier, as daily production increased. Limited supply still frustrated dealers. The large investment gain came alongside a real effort to build and sell more motorcycles.

**Original `known_at_start` description:**

> The motorcycle maker and its striking workers have reached a tentative contract agreement.

**Business-source references:** [61](#source-61), [62](#source-62)  
**Existing return-series reference(s):** [63](#source-63)

#### IBM (IBM)

**Five-year total return:** +11.2%

**Proposed future-only summary (exact JSON text):**

> IBM lost money in the early 1990s, then returned to about $3 billion of profit in 1994. Its 1995 Lotus purchase added business software, and services revenue grew as customers paid IBM for help with their computer systems. The five-year investment ended only slightly higher because this window includes both the crisis and the recovery.

**Original `known_at_start` description:**

> The computer giant is competing for smaller businesses with lower-priced systems.

**Business-source references:** [56](#source-56), [57](#source-57)  
**Existing return-series reference(s):** [3](#source-3)

### 1991-11 — decision date 1991-11-30 through final return month 1996-11

Return observations cover the 60 consecutive months after the starting month and run through **1996-11**.

#### Walt Disney (DIS)

**Five-year total return:** +191.2%

**Proposed future-only summary (exact JSON text):**

> Disney released The Lion King in 1994 and completed its purchase of ABC in February 1996, adding television businesses. There were also costly problems: Euro Disney, opened in 1992, needed a new financing deal to manage its debts in 1994. The investment rose strongly across a period of hit entertainment, a major acquisition and an expensive park setback.

**Original `known_at_start` description:**

> Its new animated film Beauty and the Beast brings music and elaborate visual design to cinemas.

**Business-source references:** [21](#source-21)  
**Existing return-series reference(s):** [23](#source-23)

#### IBM (IBM)

**Five-year total return:** +95.9%

**Proposed future-only summary (exact JSON text):**

> IBM returned to profit in 1994 after deep losses. It bought Lotus in July 1995, expanding its business software, while services revenue rose from about $9.7 billion in 1994 to $12.7 billion in 1995. The investment’s recovery accompanied a company that was earning money again and selling more help with computer systems.

**Original `known_at_start` description:**

> The computer giant is forming partnerships, including a development agreement with Apple.

**Business-source references:** [56](#source-56), [57](#source-57)  
**Existing return-series reference(s):** [3](#source-3)

#### Apple Computer (AAPL)

**Five-year total return:** −50.2%

**Proposed future-only summary (exact JSON text):**

> Apple’s computer business ran into serious trouble. In its fiscal year ending September 1996, sales fell 11% and it lost $816 million, including costs for unsold products and reorganizing the business. The investment lost about half its value. Selling well-known computers was not enough when sales weakened and costs ate up earnings.

**Original `known_at_start` description:**

> The Macintosh maker is working with longtime rival IBM on future computer technology.

**Business-source references:** [64](#source-64)  
**Existing return-series reference(s):** [19](#source-19)

### 1991-12 — decision date 1991-12-31 through final return month 1996-12

Return observations cover the 60 consecutive months after the starting month and run through **1996-12**.

#### Walt Disney (DIS)

**Five-year total return:** +151.6%

**Proposed future-only summary (exact JSON text):**

> The Lion King became a major success in 1994, giving Disney another valuable set of characters. Disney also completed the ABC purchase in February 1996. Meanwhile, its Paris park needed a new financing deal to manage its debts in 1994 after opening in 1992. The strong investment gain covered both successful entertainment and a project that needed financial repair.

**Original `known_at_start` description:**

> Beauty and the Beast is its newest animated musical.

**Business-source references:** [21](#source-21)  
**Existing return-series reference(s):** [23](#source-23)

#### IBM (IBM)

**Five-year total return:** +93.5%

**Proposed future-only summary (exact JSON text):**

> IBM’s recovery produced about $3 billion of profit in 1994 and $4.2 billion in 1995. Buying Lotus in 1995 added software, while growing services helped customers run their computer systems. The investment rose strongly as earnings recovered from the company’s earlier losses and its business became less dependent on selling machines alone.

**Original `known_at_start` description:**

> The computer company is developing technology with partners including Apple.

**Business-source references:** [57](#source-57)  
**Existing return-series reference(s):** [3](#source-3)

#### Wal-Mart (WMT)

**Five-year total return:** −20.3%

**Proposed future-only summary (exact JSON text):**

> Walmart kept growing: sales reached about $94 billion in the year ending January 1996, up 13%, and its US supercenters reached 239. Yet profit grew only about 2% that year. The investment finished lower. More stores and higher sales did not automatically mean equally fast profit growth or a good return from this starting price.

**Original `known_at_start` description:**

> The large discount retailer sells everyday goods, including popular children’s stationery.

**Business-source references:** [59](#source-59)  
**Existing return-series reference(s):** [60](#source-60)

### 1992-02 — decision date 1992-02-29 through final return month 1997-02

Return observations cover the 60 consecutive months after the starting month and run through **1997-02**.

#### Honda (HMC)

**Five-year total return:** +196.9%

**Proposed future-only summary (exact JSON text):**

> Honda found new buyers with vehicles built for families and recreation. It launched the Odyssey minivan in Japan in October 1994 and the CR-V in 1995. These models helped revive its Japanese business during a difficult period. The investment rose strongly while Honda’s product range expanded beyond its familiar cars.

**Original `known_at_start` description:**

> The automaker is considering US price increases amid trade tensions. This is its US-traded share.

**Business-source references:** [65](#source-65)  
**Existing return-series reference(s):** [66](#source-66)

#### Hasbro (HAS)

**Five-year total return:** +72.1%

**Proposed future-only summary (exact JSON text):**

> Hasbro’s games and toys brought in more money. Its 1996 sales passed $3 billion, up 5%, and profit was about $200 million. Board games, computer versions of games and Star Wars toys helped. Those results, reported in February 1997, show concrete business progress during the investment’s five-year rise.

**Original `known_at_start` description:**

> The toy maker is introducing playful monster toys and new doll accessories.

**Business-source references:** [67](#source-67)  
**Existing return-series reference(s):** [68](#source-68)

#### IBM (IBM)

**Five-year total return:** +86.0%

**Proposed future-only summary (exact JSON text):**

> IBM’s deep losses gave way to about $3 billion of profit in 1994 and $4.2 billion in 1995. Services revenue grew, and the July 1995 Lotus acquisition added business software. The investment finished higher as the company rebuilt its earnings. This window includes a painful decline before that recovery took hold.

**Original `known_at_start` description:**

> The computer giant is working with partners on new technology.

**Business-source references:** [57](#source-57)  
**Existing return-series reference(s):** [3](#source-3)

### 1992-11 — decision date 1992-11-30 through final return month 1997-11

Return observations cover the 60 consecutive months after the starting month and run through **1997-11**.

#### Ford (F)

**Five-year total return:** +148.4%

**Proposed future-only summary (exact JSON text):**

> Ford sold a record 2.1 million trucks in the United States in 1996 and launched the Expedition SUV that October. Total annual profit reached about $4.4 billion. Europe’s car business still lost money, so the improvement was uneven. Strong truck demand was a concrete business success during Ford’s large five-year investment gain.

**Original `known_at_start` description:**

> Its car sales are rising while rival General Motors struggles.

**Business-source references:** [69](#source-69)  
**Existing return-series reference(s):** [70](#source-70)

#### Walt Disney (DIS)

**Five-year total return:** +132.5%

**Proposed future-only summary (exact JSON text):**

> The Lion King became a major hit in 1994, and Disney completed its purchase of ABC in February 1996. That deal brought television networks and stations into the business alongside films and parks. The five-year investment rose strongly as Disney added successful entertainment and a much larger television business.

**Original `known_at_start` description:**

> Successful films and theme parks have helped profits recover.

**Business-source references:** [21](#source-21)  
**Existing return-series reference(s):** [23](#source-23)

#### IBM (IBM)

**Five-year total return:** +247.3%

**Proposed future-only summary (exact JSON text):**

> IBM was still in crisis when this round began. It returned to an annual profit of about $3 billion in 1994, bought Lotus in 1995 and expanded computer services. Services revenue reached about $12.7 billion in 1995. The large investment gain covered a recovery in earnings and a broader business beyond computer hardware.

**Original `known_at_start` description:**

> The computer giant has joined development partnerships, including one with Apple.

**Business-source references:** [56](#source-56), [57](#source-57)  
**Existing return-series reference(s):** [3](#source-3)

### 1994-02 — decision date 1994-02-28 through final return month 1999-02

Return observations cover the 60 consecutive months after the starting month and run through **1999-02**.

#### Microsoft (MSFT)

**Five-year total return:** +1355.8%

**Proposed future-only summary (exact JSON text):**

> Windows 95 arrived in August 1995, making home computers easier to use. Office 97 and Windows NT also brought in business customers. By the year ending June 1998, Microsoft earned $4.49 billion on $14.48 billion of sales. June 1998 also brought Windows 98. Growing software sales and profits help explain the stock’s powerful rise.

**Original `known_at_start` description:**

> The software company reports rising quarterly profits.

**Business-source references:** [71](#source-71), [72](#source-72)  
**Existing return-series reference(s):** [73](#source-73)

#### Intel (INTC)

**Five-year total return:** +605.8%

**Proposed future-only summary (exact JSON text):**

> More people buying computers meant more demand for Intel’s chips. Pentium II arrived in 1997, and Intel expanded into cheaper PCs with Celeron in 1998. Annual sales reached $26.3 billion in 1998. Profit slipped that year as prices and costs squeezed earnings, but the much larger chip business helps explain why the shares finished so far ahead.

**Original `known_at_start` description:**

> Its Pentium chip is a new generation of processor for personal computers.

**Business-source references:** [74](#source-74)  
**Existing return-series reference(s):** [75](#source-75)

#### Walt Disney (DIS)

**Five-year total return:** +127.0%

**Proposed future-only summary (exact JSON text):**

> The Lion King became a huge movie hit in 1994. Disney then completed its purchase of Capital Cities/ABC in early 1996, adding a large television business. Animal Kingdom and the Disney Magic cruise ship opened for customers in 1998. These gave Disney more ways to earn money from entertainment, helping the company grow beyond its films and older parks.

**Original `known_at_start` description:**

> Aladdin is selling strongly on home video.

**Business-source references:** [76](#source-76)  
**Existing return-series reference(s):** [23](#source-23)

### 1995-08 — decision date 1995-08-31 through final return month 2000-08

Return observations cover the 60 consecutive months after the starting month and run through **2000-08**.

#### Microsoft (MSFT)

**Five-year total return:** +503.8%

**Proposed future-only summary (exact JSON text):**

> Microsoft kept giving customers reasons to buy new software. Windows 98 arrived in June 1998, while Office and Windows NT sold strongly. By June 2000, businesses were adopting Windows 2000, and annual company sales reached $22.96 billion with $9.42 billion in profit. Those growing earnings supported the large gain over these five years, even though technology shares were becoming volatile.

**Original `known_at_start` description:**

> The software maker has just launched Windows 95.

**Business-source references:** [72](#source-72), [77](#source-77)  
**Existing return-series reference(s):** [73](#source-73)

#### Walt Disney (DIS)

**Five-year total return:** +114.5%

**Proposed future-only summary (exact JSON text):**

> Disney completed the Capital Cities/ABC purchase in 1996, adding television stations and cable-network stakes to its entertainment business. Animal Kingdom opened in 1998, and the Disney Magic began taking families on cruises that year. These additions expanded the places where Disney could sell tickets, holidays and advertising, providing concrete business growth behind the stock’s gain.

**Original `known_at_start` description:**

> The entertainment company is hiring Michael Ovitz and has announced a deal to buy Capital Cities/ABC.

**Business-source references:** [76](#source-76)  
**Existing return-series reference(s):** [23](#source-23)

#### Intel (INTC)

**Five-year total return:** +884.4%

**Proposed future-only summary (exact JSON text):**

> Intel benefited as customers bought PCs and connected to the internet. New Pentium II chips in 1997 and Celeron chips in 1998 served different computer budgets. In the second quarter of 2000, Intel shipped record numbers of processors and memory chips, and sales rose 23% to $8.3 billion. This window ends while that business growth was still strong.

**Original `known_at_start` description:**

> The chip maker is replacing flawed Pentium processors.

**Business-source references:** [74](#source-74), [78](#source-78)  
**Existing return-series reference(s):** [75](#source-75)

### 1996-09 — decision date 1996-09-30 through final return month 2001-09

Return observations cover the 60 consecutive months after the starting month and run through **2001-09**.

#### Nike (NKE)

**Five-year total return:** −21.1%

**Proposed future-only summary (exact JSON text):**

> Nike’s fast growth hit problems. The Asian financial crisis and weaker U.S. demand left too many shoes to sell in 1998, forcing discounts. In 2001, a new planning system left Nike with too much of some products and too little of others. U.S. shoe sales fell about 4% that year. These setbacks help explain the disappointing stock result.

**Original `known_at_start` description:**

> The sportswear maker has reportedly signed an endorsement deal with new professional golfer Tiger Woods.

**Business-source references:** [79](#source-79), [80](#source-80)  
**Existing return-series reference(s):** [81](#source-81)

#### Apple Computer (AAPL)

**Five-year total return:** +39.8%

**Proposed future-only summary (exact JSON text):**

> Steve Jobs returned when Apple bought NeXT in 1997. Apple simplified its products and launched the iMac in 1998, returning to a $309 million annual profit. The recovery was uneven: too many unsold computers helped produce a $195 million loss in the 2000 holiday quarter. Apple finished this window ahead, but the turnaround still had serious setbacks.

**Original `known_at_start` description:**

> The computer maker is dealing with a product recall and a large quarterly loss.

**Business-source references:** [82](#source-82), [83](#source-83)  
**Existing return-series reference(s):** [19](#source-19)

#### Microsoft (MSFT)

**Five-year total return:** +210.4%

**Proposed future-only summary (exact JSON text):**

> Office 97 and Windows NT sold strongly, and Windows 98 arrived in 1998. Microsoft’s annual sales climbed from $14.48 billion in June 1998 to $25.30 billion in June 2001. Businesses adopted Windows 2000, and Office XP launched in May 2001. This expanding software business helped the shares finish well ahead, despite the technology-stock slump near the end.

**Original `known_at_start` description:**

> The software company is expanding Windows and competing in web browsers.

**Business-source references:** [72](#source-72), [84](#source-84)  
**Existing return-series reference(s):** [73](#source-73)

### 1997-04 — decision date 1997-04-30 through final return month 2002-04

Return observations cover the 60 consecutive months after the starting month and run through **2002-04**.

#### Nike (NKE)

**Five-year total return:** −2.7%

**Proposed future-only summary (exact JSON text):**

> Nike’s famous name did not prevent costly mistakes. Weak demand and heavy discounting hurt earnings in 1998. Then a new planning system caused shortages and late deliveries in 2001, when U.S. shoe sales fell about 4%. Overseas sales were growing, so the business had bright spots, but those gains did not turn this five-year stock result positive.

**Original `known_at_start` description:**

> Its advertisements feature Tiger Woods and celebrate Jackie Robinson’s legacy.

**Business-source references:** [79](#source-79), [80](#source-80)  
**Existing return-series reference(s):** [81](#source-81)

#### Walt Disney (DIS)

**Five-year total return:** −11.7%

**Proposed future-only summary (exact JSON text):**

> Disney added attractions, including California Adventure in 2001, but several businesses struggled. Closing its GO.com internet business brought an $878 million charge in 2001. ABC lost viewers and advertising weakened. After September 11, fewer people travelled to Disney’s parks. These problems hurt earnings even while Disney kept opening new places for families to visit.

**Original `known_at_start` description:**

> Its chief executive’s large stock-option award is part of the debate over executive pay.

**Business-source references:** [85](#source-85)  
**Existing return-series reference(s):** [23](#source-23)

#### Apple Computer (AAPL)

**Five-year total return:** +185.5%

**Proposed future-only summary (exact JSON text):**

> The iMac’s 1998 launch helped Apple rebuild its computer business and return to an annual profit. Apple then opened its own stores and introduced the iPod in 2001. It sold more than 125,000 iPods in the first two months, and earned $38 million in the 2001 holiday quarter. These were concrete signs of a turnaround behind the strong stock gain.

**Original `known_at_start` description:**

> Its new leadership faces pressure after losses for shareholders.

**Business-source references:** [82](#source-82), [86](#source-86)  
**Existing return-series reference(s):** [19](#source-19)

### 1997-07 — decision date 1997-07-31 through final return month 2002-07

Return observations cover the 60 consecutive months after the starting month and run through **2002-07**.

#### Walt Disney (DIS)

**Five-year total return:** −31.8%

**Proposed future-only summary (exact JSON text):**

> New parks did not protect Disney from trouble elsewhere. In 2001, ABC’s weaker ratings and advertising hurt its television business, while shutting GO.com brought an $878 million charge. September 11 then disrupted travel and reduced park attendance. These setbacks affected several ways Disney earned money at once, helping explain why the stock finished below its 1997 starting point.

**Original `known_at_start` description:**

> A stage version of The Lion King is being developed in Minneapolis.

**Business-source references:** [85](#source-85)  
**Existing return-series reference(s):** [23](#source-23)

#### Nike (NKE)

**Five-year total return:** −19.2%

**Proposed future-only summary (exact JSON text):**

> Nike faced weak demand and excess shoes in 1998, then planning-system problems caused shortages and late deliveries in 2001. The company kept expanding overseas, and annual sales grew about 4% to $9.89 billion by May 2002. But U.S. shoe sales remained soft. That slower, uneven growth helps explain why a successful sports brand could still disappoint its shareholders.

**Original `known_at_start` description:**

> Its athletic shoes are part of the shift toward specialized sports retailing.

**Business-source references:** [79](#source-79), [80](#source-80)  
**Existing return-series reference(s):** [81](#source-81)

#### Intel (INTC)

**Five-year total return:** −17.4%

**Proposed future-only summary (exact JSON text):**

> The computer boom eventually ran into a sharp slowdown. Businesses had built more technology capacity than they needed, then cut spending. Intel’s 2001 sales fell 21% to $26.5 billion, and profit dropped much more, partly because of charges from earlier purchases of businesses. Even a faster Pentium 4 in August 2001 could not prevent that earnings slump.

**Original `known_at_start` description:**

> The processor maker is promoting new multimedia features for PCs.

**Business-source references:** [87](#source-87)  
**Existing return-series reference(s):** [75](#source-75)

### 1998-08 — decision date 1998-08-31 through final return month 2003-08

Return observations cover the 60 consecutive months after the starting month and run through **2003-08**.

#### Apple Computer (AAPL)

**Five-year total return:** +45.0%

**Proposed future-only summary (exact JSON text):**

> Apple’s recovery included a painful setback: excess computers and weak sales led to a $195 million loss in the 2000 holiday quarter. It then introduced the iPod in October 2001. The iTunes Music Store followed in 2003 and sold over a million songs in its first week. Music gave Apple a new business opportunity as its shares recovered.

**Original `known_at_start` description:**

> Its new iMac has attracted strong early sales.

**Business-source references:** [83](#source-83), [88](#source-88), [89](#source-89)  
**Existing return-series reference(s):** [19](#source-19)

#### Amazon.com (AMZN)

**Five-year total return:** +231.8%

**Proposed future-only summary (exact JSON text):**

> Amazon attracted shoppers with lower prices and free shipping, while letting other sellers offer goods on its website. By the second quarter of 2003, sales were up 37% from a year earlier to $1.1 billion. Its net loss also shrank. These signs of a stronger shopping business supported the stock’s recovery, although Amazon was still losing money overall that quarter.

**Original `known_at_start` description:**

> The online bookstore has expanded into selling music.

**Business-source references:** [90](#source-90)  
**Existing return-series reference(s):** [91](#source-91)

#### Microsoft (MSFT)

**Five-year total return:** +10.9%

**Proposed future-only summary (exact JSON text):**

> Microsoft’s business kept expanding even as internet-stock excitement faded. It entered console gaming with Xbox in 2001 and had sold over 9.4 million consoles by June 2003. Annual company sales reached $32.19 billion, up 13% from a year earlier. The stock’s much smaller five-year gain shows that rising business sales do not always mean equally fast share-price growth.

**Original `known_at_start` description:**

> The software maker faces an antitrust lawsuit and disputes the government’s claims.

**Business-source references:** [92](#source-92)  
**Existing return-series reference(s):** [73](#source-73)

### 1999-09 — decision date 1999-09-30 through final return month 2004-09

Return observations cover the 60 consecutive months after the starting month and run through **2004-09**.

#### Microsoft (MSFT)

**Five-year total return:** −38.2%

**Proposed future-only summary (exact JSON text):**

> Microsoft kept selling more software after the technology boom cooled. Strong Office and Windows Server demand helped annual sales reach $36.84 billion by June 2004, with $8.17 billion in profit. Legal settlements and a European competition fine added costs. The business was profitable, but the shares still fell from a starting price that reflected very high hopes for technology.

**Original `known_at_start` description:**

> A major personal-computer software company, facing a federal antitrust trial.

**Business-source references:** [93](#source-93)  
**Existing return-series reference(s):** [73](#source-73)

#### Cisco Systems (CSCO)

**Five-year total return:** −47.2%

**Proposed future-only summary (exact JSON text):**

> Companies cut orders for Cisco’s internet equipment as the technology boom ended. In 2001, Cisco had to write down $2.2 billion of excess parts and products, helping turn one quarter into a large loss. Business later improved: annual profit reached $4.4 billion in 2004. That recovery still did not bring the shares back to their optimistic 1999 starting price.

**Original `known_at_start` description:**

> A networking equipment supplier expanding into optical transport for data, voice, and video networks.

**Business-source references:** [94](#source-94), [95](#source-95)  
**Existing return-series reference(s):** [96](#source-96)

#### Amazon.com (AMZN)

**Five-year total return:** −48.9%

**Proposed future-only summary (exact JSON text):**

> Amazon made real progress after the internet-stock crash. Lower prices and free shipping helped 2003 sales grow 34% to $5.26 billion, and the company earned a $35 million annual profit after years of losses. But shares bought during the earlier excitement still finished lower. Becoming a stronger business did not erase the high price investors had paid in 1999.

**Original `known_at_start` description:**

> An online retailer expanding its site to include merchandise offered by outside sellers.

**Business-source references:** [97](#source-97)  
**Existing return-series reference(s):** [91](#source-91)

### 2000-01 — decision date 2000-01-31 through final return month 2005-01

Return observations cover the 60 consecutive months after the starting month and run through **2005-01**.

#### Apple Computer (AAPL)

**Five-year total return:** +48.2%

**Proposed future-only summary (exact JSON text):**

> Apple first struggled with unsold computers and lost $195 million in the 2000 holiday quarter. Then the iPod, introduced in October 2001, became a major new business. Apple shipped 4.58 million iPods in the 2004 holiday quarter; company sales rose 74% and profit reached $295 million. That music-player success helped the stock recover from its early troubles.

**Original `known_at_start` description:**

> Its board has rewarded Steve Jobs after a business turnaround and renewed interest in its computers.

**Business-source references:** [83](#source-83), [88](#source-88), [98](#source-98)  
**Existing return-series reference(s):** [19](#source-19)

#### Occidental Petroleum (OXY)

**Five-year total return:** +248.8%

**Proposed future-only summary (exact JSON text):**

> Occidental benefited when oil and gas became more valuable, and it also produced more of them. In 2004, production grew 3.5%, while its chemicals business had its best year since 1997. The company earned a record profit of nearly $2.5 billion that year. Higher selling prices and more production gave concrete support to the stock’s large gain.

**Original `known_at_start` description:**

> An oil-drilling project in Colombia faces opposition from an Indigenous community.

**Business-source references:** [99](#source-99)  
**Existing return-series reference(s):** [100](#source-100)

#### Amazon.com (AMZN)

**Five-year total return:** −33.1%

**Proposed future-only summary (exact JSON text):**

> Amazon survived the internet-stock crash and built a stronger shopping business. Year-round free shipping and lower prices helped sales reach $5.26 billion in 2003, when Amazon earned an annual profit of $35 million. Yet the stock still ended below its early-2000 starting point. The company’s progress was real, but the starting share price had already assumed a very bright future.

**Original `known_at_start` description:**

> The online retailer is adding ways for outside sellers to offer goods on its site.

**Business-source references:** [97](#source-97)  
**Existing return-series reference(s):** [91](#source-91)

### 2000-03 — decision date 2000-03-31 through final return month 2005-03

Return observations cover the 60 consecutive months after the starting month and run through **2005-03**.

#### Cisco Systems (CSCO)

**Five-year total return:** −76.9%

**Proposed future-only summary (exact JSON text):**

> Cisco began this window near the height of internet-stock excitement. Customer orders then collapsed, leaving equipment and parts it could not sell as expected. A $2.2 billion inventory charge helped create a large quarterly loss in 2001. Annual profit recovered to $4.4 billion in 2004, but that recovery could not undo the huge drop from the stock’s boom-time price.

**Original `known_at_start` description:**

> The networking-equipment company is expanding into optical transport through acquisition agreements.

**Business-source references:** [94](#source-94), [95](#source-95)  
**Existing return-series reference(s):** [96](#source-96)

#### Microsoft (MSFT)

**Five-year total return:** −48.5%

**Proposed future-only summary (exact JSON text):**

> The technology boom ended, but Microsoft’s software business kept earning money. Office and Windows Server helped annual sales reach $36.84 billion in June 2004. MSN also recorded its first profitable year, while legal settlements and a European fine added costs. Those business gains were not enough to support the much higher share price investors had paid near the boom’s peak.

**Original `known_at_start` description:**

> The major software maker is involved in a government case about competition.

**Business-source references:** [93](#source-93)  
**Existing return-series reference(s):** [73](#source-73)

#### Amazon.com (AMZN)

**Five-year total return:** −48.9%

**Proposed future-only summary (exact JSON text):**

> Amazon’s shopping business improved even while its shares remained far below their boom-time price. In 2004, sales grew 31% to $6.92 billion and profit from operations reached $440 million. In February 2005, Amazon launched Prime, offering members fast shipping for an annual fee. These gains and new plans did not recover the stock’s high March 2000 starting price.

**Original `known_at_start` description:**

> The online retailer is broadening its marketplace for outside sellers.

**Business-source references:** [101](#source-101)  
**Existing return-series reference(s):** [91](#source-91)

### 2000-06 — decision date 2000-06-30 through final return month 2005-06

Return observations cover the 60 consecutive months after the starting month and run through **2005-06**.

#### Microsoft (MSFT)

**Five-year total return:** −29.5%

**Proposed future-only summary (exact JSON text):**

> Microsoft grew after the technology-stock slump. By the year ending June 2005, annual sales reached $39.79 billion and profit reached $12.25 billion. Businesses bought more SQL Server software, and Xbox sales also grew. Microsoft returned cash through dividends and share buybacks, yet the investment still finished below its June 2000 value because the starting share price had been so high.

**Original `known_at_start` description:**

> A court has ordered a breakup, but that judgment is on hold pending appeal.

**Business-source references:** [102](#source-102)  
**Existing return-series reference(s):** [73](#source-73)

#### Cisco Systems (CSCO)

**Five-year total return:** −70.0%

**Proposed future-only summary (exact JSON text):**

> Cisco’s customers cut technology spending sharply in 2001. Cisco had bought too many parts for demand that failed to arrive, so it recorded a $2.2 billion inventory charge. Sales later recovered to $22 billion in the year ending July 2004, with $4.4 billion in profit. The company recovered faster than its share price, which remained far below the 2000 level.

**Original `known_at_start` description:**

> The supplier is expanding the equipment used to carry internet data.

**Business-source references:** [94](#source-94), [95](#source-95)  
**Existing return-series reference(s):** [96](#source-96)

#### Apple Computer (AAPL)

**Five-year total return:** +40.6%

**Proposed future-only summary (exact JSON text):**

> Apple’s early computer slump made this a rough ride. The 2000 holiday quarter produced a $195 million loss as Apple cleared excess stock. The iPod arrived in October 2001 and later became a hit: Apple shipped 4.58 million in the 2004 holiday quarter. Company profit reached $295 million that quarter, helping the shares climb back above their starting point.

**Original `known_at_start` description:**

> The computer company has attracted attention for its turnaround under Steve Jobs.

**Business-source references:** [83](#source-83), [88](#source-88), [98](#source-98)  
**Existing return-series reference(s):** [19](#source-19)

### 2000-12 — decision date 2000-12-31 through final return month 2005-12

Return observations cover the 60 consecutive months after the starting month and run through **2005-12**.

#### PepsiCo (PEP)

**Five-year total return:** +28.4%

**Proposed future-only summary (exact JSON text):**

> PepsiCo completed its Quaker Oats purchase in August 2001, adding Gatorade to its drinks business. By 2005, Gatorade and Aquafina were growing strongly, helped by new flavours and warm weather. North American beverage sales rose 10% that year, while Frito-Lay’s sales also grew. Selling snacks, sports drinks and bottled water gave PepsiCo several sources of growth behind its stock gain.

**Original `known_at_start` description:**

> The drinks company is pursuing Gatorade and SoBe as demand shifts beyond ordinary soda.

**Business-source references:** [103](#source-103), [104](#source-104)  
**Existing return-series reference(s):** [105](#source-105)

#### Coca-Cola (KO)

**Five-year total return:** −26.4%

**Proposed future-only summary (exact JSON text):**

> Coca-Cola’s size did not guarantee fast growth. In 2004, North American drink volume was flat, and its new C2 drink sold less well than expected. Coca-Cola Zero arrived in 2005, helping improve results, and worldwide drink volume grew 4% that year. The business was still growing, but that progress did not translate into a gain from this window’s starting share price.

**Original `known_at_start` description:**

> The soda leader faces competition in newer types of drinks.

**Business-source references:** [106](#source-106)  
**Existing return-series reference(s):** [13](#source-13)

#### Microsoft (MSFT)

**Five-year total return:** +37.6%

**Proposed future-only summary (exact JSON text):**

> Microsoft expanded beyond Windows and Office while its main software businesses kept producing cash. By June 2005, annual sales reached $39.79 billion, helped by server software and Xbox growth. The company also returned $44 billion to shareholders through dividends and share buybacks during that financial year. Growing earnings and cash payments helped this later starting point finish with a gain.

**Original `known_at_start` description:**

> The software maker’s court-ordered breakup is on hold during appeal.

**Business-source references:** [102](#source-102)  
**Existing return-series reference(s):** [73](#source-73)

### 2001-09 — decision date 2001-09-30 through final return month 2006-09

Return observations cover the 60 consecutive months after the starting month and run through **2006-09**.

#### Boeing (BA)

**Five-year total return:** +157.0%

**Proposed future-only summary (exact JSON text):**

> Airlines placed far more orders for Boeing planes as this window progressed. Boeing received a record 1,002 net orders in 2005, compared with 272 in 2004. Customers ordered 235 of its planned 787 Dreamliners, alongside many 737s and 777s. Those orders promised years of future work and helped improve the business outlook, even though ordering a plane is different from taking delivery.

**Original `known_at_start` description:**

> The aircraft maker plans large job cuts as airlines reduce capacity after the attacks.

**Business-source references:** [107](#source-107)  
**Existing return-series reference(s):** [47](#source-47)

#### Microsoft (MSFT)

**Five-year total return:** +23.4%

**Proposed future-only summary (exact JSON text):**

> Microsoft found growth in business software and games. Demand for SQL Server 2005 and the Xbox 360 helped annual sales reach $44.28 billion by June 2006, with $12.60 billion in profit. It had also returned substantial cash through dividends and share buybacks in 2005. These growing businesses and payments supported a positive, though far from spectacular, five-year stock result.

**Original `known_at_start` description:**

> The software company is preparing to launch Windows XP in October.

**Business-source references:** [102](#source-102), [108](#source-108)  
**Existing return-series reference(s):** [73](#source-73)

#### Apple Computer (AAPL)

**Five-year total return:** +892.7%

**Proposed future-only summary (exact JSON text):**

> Apple introduced the iPod in October 2001, just after this window began. Music players became a large new business: Apple shipped 8.1 million iPods in the quarter ending July 2006. Mac sales also grew as Apple switched computers to Intel chips. Revenue reached $4.37 billion and profit $472 million that quarter, showing business growth behind the stock’s enormous rise.

**Original `known_at_start` description:**

> The computer maker has reported a quarterly profit and is updating its products.

**Business-source references:** [88](#source-88), [109](#source-109)  
**Existing return-series reference(s):** [19](#source-19)

### 2003-03 — decision date 2003-03-31 through final return month 2008-03

Return observations cover the 60 consecutive months after the starting month and run through **2008-03**.

#### Costco (COST)

**Five-year total return:** +124.8%

**Proposed future-only summary (exact JSON text):**

> Costco grew by selling more goods and opening more warehouses. It added 30 warehouses in its 2007 financial year, when merchandise sales rose 7% to $63.1 billion. Membership fees brought in another $1.31 billion, helped by a $5 increase for basic memberships in 2006. More shopping and recurring membership money supported the company’s growth and strong stock result.

**Original `known_at_start` description:**

> The warehouse retailer is among value-focused stores drawing investor attention.

**Business-source references:** [110](#source-110)  
**Existing return-series reference(s):** [111](#source-111)

#### Intel (INTC)

**Five-year total return:** +39.2%

**Proposed future-only summary (exact JSON text):**

> Intel improved its chips and its earnings during this window. It introduced four-core processors in November 2006 and continued moving computers to its newer Core designs in 2007. That year, sales rose 8% to $38.3 billion and profit from operations rose 45%. Better products and stronger earnings helped the shares gain, although the trip was not a steady climb.

**Original `known_at_start` description:**

> The chip maker is discussed as a possible beneficiary of renewed business investment.

**Business-source references:** [112](#source-112)  
**Existing return-series reference(s):** [75](#source-75)

#### Merck (MRK)

**Five-year total return:** −11.6%

**Proposed future-only summary (exact JSON text):**

> Merck withdrew its pain medicine Vioxx in September 2004 after a study found higher risks of heart attacks and strokes. A 2007 agreement to settle many Vioxx lawsuits brought a $4.85 billion charge. New products helped: Gardasil vaccine sales reached $1.5 billion in 2007. But losing a medicine and facing large legal costs weighed on the business during this disappointing stock window.

**Original `known_at_start` description:**

> The medicine maker attracts attention from investors seeking dividend-paying companies.

**Business-source references:** [113](#source-113), [114](#source-114)  
**Existing return-series reference(s):** [115](#source-115)

### 2004-05 — decision date 2004-05-31 through final return month 2009-05

Return observations cover the 60 consecutive months after the starting month and run through **2009-05**.

#### Apple Computer (AAPL)

**Five-year total return:** +868.0%

**Proposed future-only summary (exact JSON text):**

> Apple’s music business took off, with 4.58 million iPods shipped in the 2004 holiday quarter. It began selling the iPhone in 2007, then expanded into more countries with the iPhone 3G in July 2008. By the quarter ending March 2009, Apple sold 3.79 million iPhones and earned $1.21 billion. Those successful products helped support its large gain despite the recession.

**Original `known_at_start` description:**

> iPod shipments grew sharply and quarterly revenue rose 29%.

**Business-source references:** [98](#source-98), [116](#source-116)  
**Existing return-series reference(s):** [19](#source-19)

#### Microsoft (MSFT)

**Five-year total return:** −4.4%

**Proposed future-only summary (exact JSON text):**

> Microsoft launched Windows Vista and Office 2007 for home users in January 2007, giving customers new versions to buy. But the recession later weakened computer and server sales. In the quarter ending March 2009, Microsoft’s revenue fell 6% from a year earlier, and profit also fell. This slowdown helps explain why the investment finished slightly below its starting value.

**Original `known_at_start` description:**

> Enterprise software demand and legal charges both drew attention.

**Business-source references:** [117](#source-117), [118](#source-118)  
**Existing return-series reference(s):** [73](#source-73)

#### eBay (EBAY)

**Five-year total return:** −60.3%

**Proposed future-only summary (exact JSON text):**

> eBay’s growth ran into trouble. Its 2005 Skype purchase led to a $1.4 billion charge in 2007 when the deal fell short of hopes. During the first quarter of 2009, marketplace revenue fell 18% as the economy weakened. PayPal was still growing, but it could not offset the marketplace’s decline. These problems help explain why the shares finished much lower.

**Original `known_at_start` description:**

> Record quarterly sales rose 59%; company raised full-year guidance.

**Business-source references:** [119](#source-119), [120](#source-120)  
**Existing return-series reference(s):** [121](#source-121)

### 2005-09 — decision date 2005-09-30 through final return month 2010-09

Return observations cover the 60 consecutive months after the starting month and run through **2010-09**.

#### Toyota Motor (TM)

**Five-year total return:** −14.5%

**Proposed future-only summary (exact JSON text):**

> Toyota was hit by two big setbacks. During the financial crisis, fewer people bought cars, and it lost about 437 billion yen in the year ended March 2009. Accelerator recalls brought more trouble in 2010. Toyota returned to profit that year, but sales were still weak. That uneven recovery helps explain why its shares finished below their 2005 starting point.

**Original `known_at_start` description:**

> Its new president emphasizes cost control and avoiding complacency as the automaker grows. This is its US-traded share.

**Business-source references:** [122](#source-122), [123](#source-123), [124](#source-124)  
**Existing return-series reference(s):** [125](#source-125)

#### Walt Disney (DIS)

**Five-year total return:** +47.2%

**Proposed future-only summary (exact JSON text):**

> Disney bought Pixar in 2006, adding its popular characters and animation team. By summer 2010, Toy Story 3 and Alice in Wonderland were helping movie profits, while Toy Story toys brought in more money. Disney’s quarterly sales rose 16%. These successes helped the business recover from the recession and gave investors more reasons to value its movies, characters and other businesses.

**Original `known_at_start` description:**

> New leadership is trying to rebuild its animation business amid computer-animation competition.

**Business-source references:** [126](#source-126), [127](#source-127)  
**Existing return-series reference(s):** [23](#source-23)

#### ExxonMobil (XOM)

**Five-year total return:** +7.9%

**Proposed future-only summary (exact JSON text):**

> ExxonMobil earned a record $45.2 billion in 2008, helped by high oil prices. Then the recession reduced demand for fuel, and its 2009 profit fell to $19.3 billion. It kept paying dividends and raised its yearly payment per share even during that slump. Those payments helped the investment, but the sharp change in oil profits left only a modest overall gain.

**Original `known_at_start` description:**

> The oil producer has reported record quarterly results amid strong energy prices.

**Business-source references:** [128](#source-128), [129](#source-129)  
**Existing return-series reference(s):** [8](#source-8)

### 2006-07 — decision date 2006-07-31 through final return month 2011-07

Return observations cover the 60 consecutive months after the starting month and run through **2011-07**.

#### Hewlett-Packard (HPQ)

**Five-year total return:** +14.7%

**Proposed future-only summary (exact JSON text):**

> HP expanded beyond computers and printers by buying technology-services company EDS in 2008. Its annual sales reached $126 billion in 2010. But in May 2011, weak consumer demand and problems in services led HP to lower its forecast. Its shares gained only modestly: a bigger business did not remove worries about how much profit it could keep making.

**Original `known_at_start` description:**

> The computer maker is gaining ground while rival Dell struggles with slower growth.

**Business-source references:** [130](#source-130), [131](#source-131), [132](#source-132)  
**Existing return-series reference(s):** [133](#source-133)

#### Apple Computer (AAPL)

**Five-year total return:** +474.6%

**Proposed future-only summary (exact JSON text):**

> Apple introduced the iPhone in 2007 and the iPad in 2010, creating huge new businesses alongside the Mac and iPod. In the quarter ended June 2011, it sold over 20 million iPhones and 9 million iPads. Quarterly profit more than doubled from a year earlier to $7.3 billion. The share-price rise came with a dramatic increase in actual sales and profits.

**Original `known_at_start` description:**

> The maker of Macs and iPods has reported rising sales and earnings.

**Business-source references:** [134](#source-134), [135](#source-135), [136](#source-136)  
**Existing return-series reference(s):** [19](#source-19)

#### Microsoft (MSFT)

**Five-year total return:** +25.2%

**Proposed future-only summary (exact JSON text):**

> Microsoft kept earning money from software that businesses needed, including Office and programs for company computers. Xbox added another source of growth. In the year ended June 2011, revenue reached about $70 billion and profit rose 23% to $23.2 billion. That business strength supported a gain, although the shares grew far less than Apple’s during its new-product boom.

**Original `known_at_start` description:**

> The company is preparing Windows Vista, with broad consumer availability planned for January 2007.

**Business-source references:** [137](#source-137)  
**Existing return-series reference(s):** [73](#source-73)

### 2007-06 — decision date 2007-06-30 through final return month 2012-06

Return observations cover the 60 consecutive months after the starting month and run through **2012-06**.

#### Apple (AAPL)

**Five-year total return:** +378.5%

**Proposed future-only summary (exact JSON text):**

> The iPhone became a much bigger business, and Apple added the iPad in 2010. In the quarter ended March 2012, it sold 35 million iPhones and nearly 12 million iPads. Profit almost doubled from a year earlier to $11.6 billion. These were millions of paying customers, not just excitement about a new gadget, helping support the large rise in Apple’s shares.

**Original `known_at_start` description:**

> The company is bringing the iPhone to US shops and promoting its touchscreen design.

**Business-source references:** [135](#source-135), [138](#source-138)  
**Existing return-series reference(s):** [19](#source-19)

#### Microsoft (MSFT)

**Five-year total return:** +15.7%

**Proposed future-only summary (exact JSON text):**

> Office 2010 gave businesses a reason to buy updated software. In the quarter ended March 2012, Microsoft’s business-software sales rose 9%, while Windows sales also grew. Total operating profit rose 12%. Microsoft remained a profitable company through the recession, but its shares posted only a modest gain. Steady software earnings did not produce the explosive growth seen in some new mobile products.

**Original `known_at_start` description:**

> Its Surface computing demonstration explores larger touch-controlled displays.

**Business-source references:** [137](#source-137), [139](#source-139)  
**Existing return-series reference(s):** [73](#source-73)

#### Walt Disney (DIS)

**Five-year total return:** +51.5%

**Proposed future-only summary (exact JSON text):**

> Disney bought Marvel in 2009, and The Avengers opened in May 2012 with a record $207 million US and Canadian weekend. Its TV networks and parks were also growing. The movie business still had misses: John Carter lost money earlier in 2012. Having several sources of income helped Disney grow profits even when one expensive film disappointed, supporting the stock’s recovery.

**Original `known_at_start` description:**

> Bob Iger is reshaping the entertainment company’s strategy and digital offerings.

**Business-source references:** [140](#source-140), [141](#source-141)  
**Existing return-series reference(s):** [23](#source-23)

### 2007-08 — decision date 2007-08-31 through final return month 2012-08

Return observations cover the 60 consecutive months after the starting month and run through **2012-08**.

#### Lennar (LEN)

**Five-year total return:** +24.4%

**Proposed future-only summary (exact JSON text):**

> The housing crash hurt Lennar badly: it lost about $1.1 billion in 2008 as home sales weakened and land values fell. By the quarter ended May 2012, new orders were up 40% from a year earlier and its homebuilding business was earning more money. That recovery helped the shares finish higher, despite a very difficult journey through the housing slump.

**Original `known_at_start` description:**

> The homebuilder advertises new houses in a market where buyers are receiving large incentives.

**Business-source references:** [142](#source-142), [143](#source-143)  
**Existing return-series reference(s):** [144](#source-144)

#### KB Home (KBH)

**Five-year total return:** −58.8%

**Proposed future-only summary (exact JSON text):**

> The housing crash cut deeply into KB Home’s business. Its annual revenue more than halved in 2008, and it lost about $976 million as sales shrank and it reduced the value of land and other assets. Conditions later improved, but the quarter ended May 2012 still brought a $24 million loss. The recovery had not repaired the damage to profits or the share price.

**Original `known_at_start` description:**

> The builder faces a weakening housing market and pressure to attract buyers.

**Business-source references:** [145](#source-145), [146](#source-146)  
**Existing return-series reference(s):** [147](#source-147)

#### Walt Disney (DIS)

**Five-year total return:** +57.1%

**Proposed future-only summary (exact JSON text):**

> Disney added Marvel in 2009, bringing superheroes into its movies and merchandise. The Avengers became a major hit in May 2012. TV networks and parks also helped earnings grow, even while the costly film John Carter hurt movie profits earlier that year. Disney’s range of businesses helped it recover from the recession and finish these five years with a share-price gain.

**Original `known_at_start` description:**

> High School Musical has become a prominent part of its youth entertainment business.

**Business-source references:** [140](#source-140), [141](#source-141)  
**Existing return-series reference(s):** [23](#source-23)

### 2007-11 — decision date 2007-11-30 through final return month 2012-11

Return observations cover the 60 consecutive months after the starting month and run through **2012-11**.

#### Amazon.com (AMZN)

**Five-year total return:** +178.3%

**Proposed future-only summary (exact JSON text):**

> Amazon kept attracting shoppers and introduced the Kindle Fire tablet in 2011. Annual sales jumped 41% that year to $48 billion, but profit fell as the business expanded. It even reported a loss in the quarter ended September 2012. The shares still rose strongly: investors were paying for a much larger business and the hope of future profits, despite uneven earnings along the way.

**Original `known_at_start` description:**

> The online retailer has introduced Kindle, a device for reading downloaded books.

**Business-source references:** [148](#source-148), [149](#source-149)  
**Existing return-series reference(s):** [91](#source-91)

#### Citigroup (C)

**Five-year total return:** −89.0%

**Proposed future-only summary (exact JSON text):**

> Mortgage and other investment losses helped push Citigroup to a $27.7 billion loss in 2008. Government support helped it survive, but the rescue and fundraising created billions of new shares in 2009. Each old share then represented a smaller piece of the bank. Citi returned to profit in 2010, yet that business recovery did not undo the huge damage to earlier shareholders.

**Original `known_at_start` description:**

> Its chief executive is leaving after large losses linked to mortgage investments.

**Business-source references:** [150](#source-150), [151](#source-151), [152](#source-152)  
**Existing return-series reference(s):** [153](#source-153)

#### Apple (AAPL)

**Five-year total return:** +224.0%

**Proposed future-only summary (exact JSON text):**

> Apple turned the iPhone into a major global business and introduced the iPad in 2010. In the quarter ended September 2012, iPhone sales were 58% higher than a year earlier. Apple earned $8.2 billion in profit that quarter and was paying a dividend. Its large stock gain was backed by a business selling far more products and earning far more money.

**Original `known_at_start` description:**

> The company has entered the mobile-phone market with the iPhone.

**Business-source references:** [135](#source-135), [154](#source-154)  
**Existing return-series reference(s):** [19](#source-19)

### 2008-09 — decision date 2008-09-30 through final return month 2013-09

Return observations cover the 60 consecutive months after the starting month and run through **2013-09**.

#### Apple (AAPL)

**Five-year total return:** +331.3%

**Proposed future-only summary (exact JSON text):**

> Apple introduced the iPad in 2010 while the iPhone kept reaching more customers. By the quarter ended June 2013, it sold over 31 million iPhones, a record for that part of the year. But profit fell from a year earlier as Apple kept less money from each dollar of sales. The strong five-year gain included both a product boom and later pressure on profits.

**Original `known_at_start` description:**

> New music-player line and continuing consumer-device attention.

**Business-source references:** [135](#source-135), [155](#source-155)  
**Existing return-series reference(s):** [19](#source-19)

#### Microsoft (MSFT)

**Five-year total return:** +41.6%

**Proposed future-only summary (exact JSON text):**

> Microsoft’s business software kept bringing in money even as the personal-computer market weakened. Annual revenue reached $77.9 billion in the year ended June 2013. Its new Surface RT tablet struggled, however, leading to a $900 million charge for unsold inventory. The stock’s gain came from a company with valuable, profitable software businesses, alongside costly attempts to find its place in tablets.

**Original `known_at_start` description:**

> Authorized another $40 billion buyback and raised quarterly dividend 18%.

**Business-source references:** [156](#source-156)  
**Existing return-series reference(s):** [73](#source-73)

#### Exxon Mobil (XOM)

**Five-year total return:** +25.4%

**Proposed future-only summary (exact JSON text):**

> The recession hit fuel demand, and ExxonMobil’s profit fell sharply in 2009. It remained profitable and kept paying dividends. By the quarter ended June 2013, it earned $6.9 billion and spent $4 billion buying back shares. That continuing flow of cash helped shareholders through an uneven period, even though oil and gas profits did not simply rise every year.

**Original `known_at_start` description:**

> July release reported $11.68 billion quarterly income amid high energy prices.

**Business-source references:** [129](#source-129), [157](#source-157)  
**Existing return-series reference(s):** [8](#source-8)

### 2009-03 — decision date 2009-03-31 through final return month 2014-03

Return observations cover the 60 consecutive months after the starting month and run through **2014-03**.

#### American International Group (AIG)

**Five-year total return:** +203.4%

**Proposed future-only summary (exact JSON text):**

> AIG’s shares started this period after an enormous crash. The insurer rebuilt its finances, and the US Treasury sold its remaining AIG shares in December 2012. AIG then earned $9.1 billion in 2013. Those signs of recovery helped an investment made at the battered 2009 price. The big gain from that low starting point did not mean earlier shareholders had recovered their losses.

**Original `known_at_start` description:**

> The insurer is receiving major government support and faces anger over executive bonuses.

**Business-source references:** [158](#source-158), [159](#source-159)  
**Existing return-series reference(s):** [160](#source-160)

#### Moody’s (MCO)

**Five-year total return:** +274.7%

**Proposed future-only summary (exact JSON text):**

> Moody’s still earned money after the crisis, and demand for its ratings and financial research grew again. Annual revenue rose from about $1.8 billion in 2009 to nearly $3 billion in 2013. Rating company debt and selling tools that help customers study financial risks both contributed. The stock’s strong recovery came with a larger business, despite the criticism of its earlier mortgage ratings.

**Original `known_at_start` description:**

> The debt-rating company faces scrutiny of ratings given to mortgage-related investments.

**Business-source references:** [161](#source-161), [162](#source-162)  
**Existing return-series reference(s):** [163](#source-163)

#### Amazon.com (AMZN)

**Five-year total return:** +358.0%

**Proposed future-only summary (exact JSON text):**

> Amazon expanded from online shopping and Kindle readers into a bigger mix of services. By 2013, Prime had tens of millions of members and annual sales reached $74.5 billion. Yet annual profit was only $274 million after a loss in 2012. The shares rose much faster than current profits as investors expected Amazon’s growing customer base and new services to pay off later.

**Original `known_at_start` description:**

> The online retailer has released the Kindle 2 electronic reader.

**Business-source references:** [164](#source-164)  
**Existing return-series reference(s):** [91](#source-91)

### 2011-08 — decision date 2011-08-31 through final return month 2016-08

Return observations cover the 60 consecutive months after the starting month and run through **2016-08**.

#### Apple (AAPL)

**Five-year total return:** +110.8%

**Proposed future-only summary (exact JSON text):**

> Apple sold many more iPhones and added products such as the Apple Watch. Its annual sales grew 28% to nearly $234 billion in 2015. Growth later slowed: both revenue and profit fell in the quarter ended June 2016, although services kept growing. The shares still finished well ahead because Apple’s business had grown substantially across the full five years.

**Original `known_at_start` description:**

> Tim Cook takes over as chief executive after Steve Jobs resigns.

**Business-source references:** [165](#source-165), [166](#source-166)  
**Existing return-series reference(s):** [19](#source-19)

#### Bank of America (BAC)

**Five-year total return:** +105.8%

**Proposed future-only summary (exact JSON text):**

> Bank of America spent years dealing with problems left by the housing crash. In 2014 it agreed to a $16.65 billion mortgage settlement, including help for borrowers. As legal costs fell, annual profit recovered to $15.9 billion in 2015. The shares benefited as investors saw the bank move past some expensive problems, though cleaning them up took much of this five-year period.

**Original `known_at_start` description:**

> Berkshire Hathaway agrees to invest. Its special deal has different terms from the ordinary shares you can buy here.

**Business-source references:** [167](#source-167), [168](#source-168)  
**Existing return-series reference(s):** [169](#source-169)

#### Microsoft (MSFT)

**Five-year total return:** +148.3%

**Proposed future-only summary (exact JSON text):**

> Microsoft built a growing business renting software and computing power over the internet. In the quarter ended June 2016, Office 365 business revenue rose 54%, and Azure revenue more than doubled. Its phone business was shrinking sharply at the same time. The growing cloud and subscription businesses gave investors new reasons for optimism beyond Windows, helping support the stock’s strong gain.

**Original `known_at_start` description:**

> The software maker has agreed to buy Skype, a voice and video communication service.

**Business-source references:** [170](#source-170)  
**Existing return-series reference(s):** [73](#source-73)

### 2012-03 — decision date 2012-03-31 through final return month 2017-03

Return observations cover the 60 consecutive months after the starting month and run through **2017-03**.

#### Apple (AAPL)

**Five-year total return:** +84.9%

**Proposed future-only summary (exact JSON text):**

> Apple kept turning its large customer base into sales of iPhones, Macs, watches and services. The holiday quarter ended December 2016 brought record revenue of $78.4 billion, with records across those product groups. Apple also returned money through dividends and share buybacks. Those earnings and cash payments helped the investment grow, although product sales did not rise smoothly every quarter.

**Original `known_at_start` description:**

> The company reports strong early sales of its new iPad.

**Business-source references:** [166](#source-166), [171](#source-171)  
**Existing return-series reference(s):** [19](#source-19)

#### Amazon.com (AMZN)

**Five-year total return:** +337.8%

**Proposed future-only summary (exact JSON text):**

> Amazon’s growth came from more than shopping. Its Amazon Web Services business sold computing power to other companies and became a major source of profit. In 2016, AWS earned $3.1 billion before company-wide costs, while Amazon’s total annual sales reached $136 billion. Prime and online shopping also expanded. The company was beginning to turn years of investment into much larger earnings.

**Original `known_at_start` description:**

> Its Kindle Fire tablet joins its electronic readers and online shopping business.

**Business-source references:** [172](#source-172)  
**Existing return-series reference(s):** [91](#source-91)

#### ExxonMobil (XOM)

**Five-year total return:** +10.1%

**Proposed future-only summary (exact JSON text):**

> Low oil and gas prices squeezed ExxonMobil’s earnings during the later part of this period. In 2016 it earned $7.8 billion, less than half its 2015 profit. That included a roughly $2 billion cut to the value of gas assets. Continued dividends helped the investment finish slightly ahead, but weak energy profits limited the reward from holding the shares.

**Original `known_at_start` description:**

> The large oil producer is in focus as high fuel prices and energy supply draw attention.

**Business-source references:** [173](#source-173)  
**Existing return-series reference(s):** [8](#source-8)

### 2013-05 — decision date 2013-05-31 through final return month 2018-05

Return observations cover the 60 consecutive months after the starting month and run through **2018-05**.

#### Hasbro (HAS)

**Five-year total return:** +123.2%

**Proposed future-only summary (exact JSON text):**

> Hasbro grew through toys and games such as Nerf, Transformers and Monopoly. Annual sales reached $5.2 billion in 2017, and its gaming business also expanded. Then the Toys R Us collapse hurt: Hasbro’s sales fell 16% in the first quarter of 2018, which ended in a loss. Earlier growth and dividends still left shareholders ahead, despite that late setback.

**Original `known_at_start` description:**

> A campaign asks the toy maker for Easy-Bake Oven colors that appeal to more children.

**Business-source references:** [174](#source-174), [175](#source-175)  
**Existing return-series reference(s):** [68](#source-68)

#### Tesla Motors (TSLA)

**Five-year total return:** +191.3%

**Proposed future-only summary (exact JSON text):**

> Tesla grew into a much bigger carmaker, delivering over 100,000 vehicles in 2017. It also began making the Model 3, aimed at reaching more buyers. But battery-production problems slowed the launch, and Tesla still reported a loss of about $2 billion that year. The stock’s gain reflected a growing business and hopes for future mass production, while reliable profits were still unproven.

**Original `known_at_start` description:**

> The electric-car maker has reported its first quarterly profit.

**Business-source references:** [176](#source-176)  
**Existing return-series reference(s):** [177](#source-177)

#### Apple (AAPL)

**Five-year total return:** +220.2%

**Proposed future-only summary (exact JSON text):**

> Apple’s iPhone business kept growing, while services and wearables added more sales. By the quarter ended March 2018, revenue was up 16% from a year earlier to $61.1 billion. The iPhone X was its best-selling phone throughout that quarter. Apple also increased its dividend and announced another $100 billion for share buybacks, sharing some of its large cash earnings with investors.

**Original `known_at_start` description:**

> The company announces a larger program of dividends and share buybacks.

**Business-source references:** [165](#source-165), [178](#source-178)  
**Existing return-series reference(s):** [19](#source-19)

### 2016-01 — decision date 2016-01-31 through final return month 2021-01

Return observations cover the 60 consecutive months after the starting month and run through **2021-01**.

#### Walt Disney (DIS)

**Five-year total return:** +86.0%

**Proposed future-only summary (exact JSON text):**

> Disney gained a new growth story with Disney+, which reached nearly 87 million paid subscriptions by December 2020. That success arrived while COVID-19 closed parks and disrupted movie releases, badly hurting its older businesses. The shares still finished higher as investors looked toward streaming growth and reopening. The stock’s gain therefore included hopes for recovery as well as a successful new service.

**Original `known_at_start` description:**

> The Force Awakens has become a major box-office success.

**Business-source references:** [179](#source-179), [180](#source-180)  
**Existing return-series reference(s):** [23](#source-23)

#### Boeing (BA)

**Five-year total return:** +80.2%

**Proposed future-only summary (exact JSON text):**

> Boeing first enjoyed strong aircraft sales: in 2018 it delivered a record 806 commercial planes and earned about $10.5 billion. Then the 737 MAX grounding and the pandemic badly damaged the business. Boeing lost $11.9 billion in 2020. Its shares still finished above the January 2016 starting price, but the later crises wiped away much of the optimism from its earlier boom.

**Original `known_at_start` description:**

> The aircraft maker is reporting results and setting delivery expectations for the new year.

**Business-source references:** [181](#source-181), [182](#source-182)  
**Existing return-series reference(s):** [47](#source-47)

#### Tesla Motors (TSLA)

**Five-year total return:** +1975.1%

**Proposed future-only summary (exact JSON text):**

> Tesla expanded production of the Model 3 and added the Model Y in 2020. It delivered about 500,000 vehicles that year and recorded its first full-year profit, helped by selling emissions credits to other carmakers. Those were major steps toward a larger car business. The enormous stock gain also reflected investors’ hopes for much more growth, beyond the profits Tesla had already earned.

**Original `known_at_start` description:**

> The electric-car maker is adding Model X and preparing to show its next model.

**Business-source references:** [183](#source-183)  
**Existing return-series reference(s):** [177](#source-177)

### 2016-02 — decision date 2016-02-29 through final return month 2021-02

Return observations cover the 60 consecutive months after the starting month and run through **2021-02**.

#### Apple (AAPL)

**Five-year total return:** +439.3%

**Proposed future-only summary (exact JSON text):**

> Apple began this period with slowing sales, but its iPhone, services and wearables businesses later reached new records. The holiday quarter ended December 2020 brought $111.4 billion in sales, up 21% from a year earlier, while earnings per share rose 35%. That return to strong growth helped support the shares, alongside a larger business earning money from both devices and ongoing services.

**Original `known_at_start` description:**

> Consumer devices and services, with record quarterly revenue and cautious guidance.

**Business-source references:** [166](#source-166), [184](#source-184)  
**Existing return-series reference(s):** [19](#source-19)

#### Microsoft (MSFT)

**Five-year total return:** +398.1%

**Proposed future-only summary (exact JSON text):**

> Microsoft’s cloud services and software subscriptions became much bigger businesses. In the quarter ended December 2020, Azure revenue rose 50% and Office 365 business revenue rose 21%. Total profit reached $15.5 billion, up one-third from a year earlier. Companies’ growing use of online tools helped Microsoft earn more money, supporting a large stock gain during these five years.

**Original `known_at_start` description:**

> Established software business emphasizing cloud services and Windows 10.

**Business-source references:** [185](#source-185)  
**Existing return-series reference(s):** [73](#source-73)

#### ExxonMobil (XOM)

**Five-year total return:** −13.4%

**Proposed future-only summary (exact JSON text):**

> ExxonMobil struggled with weak energy profits, then COVID-19 sharply reduced travel and fuel demand in 2020. It recorded a $22.4 billion annual loss, including large cuts to the value of oil and gas assets. The company reduced spending and kept paying dividends. Those payments softened the blow, but they did not fully offset the fall in the share price.

**Original `known_at_start` description:**

> An integrated energy company facing weak commodity prices.

**Business-source references:** [173](#source-173), [186](#source-186)  
**Existing return-series reference(s):** [8](#source-8)

### 2018-12 — decision date 2018-12-31 through final return month 2023-12

Return observations cover the 60 consecutive months after the starting month and run through **2023-12**.

#### Nintendo (NTDOY)

**Five-year total return:** +96.2%

**Proposed future-only summary (exact JSON text):**

> Nintendo’s Switch and Animal Crossing: New Horizons became popular ways to play during the pandemic. In the year ended March 2021, Switch sales rose 37% and operating profit rose 82%. New hits kept the business going: Zelda: Tears of the Kingdom sold 19.5 million copies by September 2023, and the Mario movie brought in more money from Nintendo’s characters. Those successes supported the shares.

**Original `known_at_start` description:**

> The Switch maker has released Super Smash Bros. Ultimate. This is its US-traded share.

**Business-source references:** [187](#source-187), [188](#source-188)  
**Existing return-series reference(s):** [189](#source-189)

#### Apple (AAPL)

**Five-year total return:** +408.7%

**Proposed future-only summary (exact JSON text):**

> Apple’s devices and services produced a huge holiday quarter in 2020, with revenue reaching $111.4 billion. Growth later cooled: sales fell slightly in the quarter ended September 2023. Yet services set another sales record, and Apple returned nearly $25 billion through dividends and buybacks that quarter. Its large stock gain reflected both its profitable customer base and investors’ expectations for future earnings.

**Original `known_at_start` description:**

> The device maker has reported record fiscal-year revenue and earnings.

**Business-source references:** [184](#source-184), [190](#source-190)  
**Existing return-series reference(s):** [19](#source-19)

#### Microsoft (MSFT)

**Five-year total return:** +289.9%

**Proposed future-only summary (exact JSON text):**

> Microsoft grew as businesses paid for Azure computing services and Office subscriptions. Its annual revenue reached $211.9 billion in the year ended June 2023. Even with weak personal-computer sales, Azure and other cloud revenue grew 26% in that final quarter. Cloud profits and the company’s move into new AI tools gave investors reasons to expect more growth, helping support the strong share-price rise.

**Original `known_at_start` description:**

> Cloud services are helping its sales and earnings grow.

**Business-source references:** [185](#source-185), [191](#source-191)  
**Existing return-series reference(s):** [73](#source-73)

### 2020-01 — decision date 2020-01-31 through final return month 2025-01

Return observations cover the 60 consecutive months after the starting month and run through **2025-01**.

#### Boeing (BA)

**Five-year total return:** −44.2%

**Proposed future-only summary (exact JSON text):**

> Boeing faced years of trouble turning plane orders into profitable deliveries. The pandemic hurt airlines in 2020 while Boeing was dealing with the 737 MAX grounding. Later production problems continued, and a factory strike disrupted 2024. That year Boeing delivered only 348 commercial planes and lost $11.8 billion. Repeated delays and losses help explain why the shares remained below their January 2020 level.

**Original `known_at_start` description:**

> The aircraft maker reports losses as the 737 MAX remains grounded.

**Business-source references:** [182](#source-182), [192](#source-192)  
**Existing return-series reference(s):** [47](#source-47)

#### Tesla (TSLA)

**Five-year total return:** +832.9%

**Proposed future-only summary (exact JSON text):**

> Tesla expanded far beyond its early scale. Annual deliveries grew from about 500,000 vehicles in 2020 to nearly 1.8 million in 2024, and its battery-storage business also grew. The final year was tougher: car deliveries slipped and operating profit fell. Its very large stock gain therefore combined real business growth with high hopes for future products and profits, even when recent results weakened.

**Original `known_at_start` description:**

> The electric-car maker reports a quarterly profit and plans more production.

**Business-source references:** [183](#source-183), [193](#source-193)  
**Existing return-series reference(s):** [177](#source-177)

#### Walt Disney (DIS)

**Five-year total return:** −17.2%

**Proposed future-only summary (exact JSON text):**

> COVID-19 shut Disney parks and disrupted movies, while building its streaming services cost billions. By fiscal 2024, its entertainment streaming business had turned profitable, and Inside Out 2 and Deadpool & Wolverine helped film results. But traditional TV revenue was still shrinking. The recovery was uneven, leaving the shares below their January 2020 starting price despite successful films and reopened parks.

**Original `known_at_start` description:**

> Its latest Star Wars film has passed a major worldwide box-office milestone.

**Business-source references:** [180](#source-180), [194](#source-194)  
**Existing return-series reference(s):** [23](#source-23)

### 2020-03 — decision date 2020-03-31 through final return month 2025-03

Return observations cover the 60 consecutive months after the starting month and run through **2025-03**.

#### Walt Disney (DIS)

**Five-year total return:** +3.4%

**Proposed future-only summary (exact JSON text):**

> Disney began near the pandemic shock, with parks closing and movies disrupted. Its parks later recovered, and entertainment streaming moved from a $2.5 billion annual loss in fiscal 2023 to a small profit in 2024. Inside Out 2 was another bright spot, but traditional TV kept shrinking. Those improvements and problems pulled in different directions, leaving only a small overall gain from March 2020.

**Original `known_at_start` description:**

> The entertainment company is closing theme parks as the virus spreads.

**Business-source references:** [180](#source-180), [194](#source-194)  
**Existing return-series reference(s):** [23](#source-23)

#### Amazon.com (AMZN)

**Five-year total return:** +95.2%

**Proposed future-only summary (exact JSON text):**

> Online shopping surged during the pandemic: Amazon’s sales rose 40% in the quarter ended June 2020. Over the following years, cloud computing and a more efficient delivery network helped turn growth into much bigger profits. In 2024, Amazon earned $59.2 billion, nearly twice its 2023 profit. AWS alone produced $39.8 billion in operating profit, showing why Amazon’s business was about more than shopping.

**Original `known_at_start` description:**

> The retailer plans a large hiring increase as more people order deliveries.

**Business-source references:** [195](#source-195), [196](#source-196)  
**Existing return-series reference(s):** [91](#source-91)

#### Netflix (NFLX)

**Five-year total return:** +148.3%

**Proposed future-only summary (exact JSON text):**

> Netflix found new ways to earn money from its audience. It launched a cheaper plan with advertisements in November 2022, then expanded charges for sharing accounts outside a household in 2023. By the end of 2024, it had over 300 million paid memberships. Annual revenue grew 16% and operating profit passed $10 billion, giving the stock’s rise support from stronger business results.

**Original `known_at_start` description:**

> The streaming service is reducing data traffic in some places as home internet use rises.

**Business-source references:** [197](#source-197), [198](#source-198), [199](#source-199)  
**Existing return-series reference(s):** [200](#source-200)

## Global source bibliography

<a id="source-1"></a>**1. [IBM: The IBM PC](https://www.ibm.com/history/personal-computer)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-ibm-pc`
- Provenance note: Undated retrospective company history of the August 1981 PC launch; outcome context only.

<a id="source-2"></a>**2. [UPI: IBM reports 1984 earnings](https://www.upi.com/Archives/1985/01/17/IBM-reported-Thursday-that-net-earnings-rose-166-percent/8728474786000/)**

- Publication date: 1985-01-17
- Source IDs: `hot-ibm-1984-profit`
- Provenance note: Indexed original archive report consulted: annual net income of $6.58 billion versus $5.48 billion, about 20% growth. The 16.6% in the headline refers to the quarter.

<a id="source-3"></a>**3. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/IBM?period1=289094400&period2=481161600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-ibm`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1985-03-29. Retrieved raw payload SHA256: de27e9959e3c6731f9edd291e125d4ea7c11fe8ff463efd6cea46791712f66ce. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 7825f641cbd0f3370cac5d7f19378a46651c344b before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-4"></a>**4. [UPI: Texas Instruments ends 1983 with a loss](https://www.upi.com/Archives/1984/01/27/Texas-Instruments-ended-its-1983-fiscal-year-with-a/5455444027600/)**

- Publication date: 1984-01-27
- Source IDs: `hot-txn-1983-loss`
- Provenance note: Indexed original archive report consulted: $145.4 million annual net loss, largely from leaving the home-computer business.

<a id="source-5"></a>**5. [Washington Post: Texas Instruments Finding Its Niche Market](https://www.washingtonpost.com/archive/business/1984/08/26/texas-instruments-finding-its-niche-market/f1d7cdf7-1c4f-42d0-8612-e04a510c07be/)**

- Publication date: 1984-08-25
- Source IDs: `hot-txn-1984-recovery`
- Provenance note: The archive page displays August 25 although its URL uses August 26. Contemporary report describes a return to profit and a shift toward industrial products.

<a id="source-6"></a>**6. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/TXN?period1=289094400&period2=481161600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-txn`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1985-03-29. Retrieved raw payload SHA256: ca40b95d6ea1e509bc41f9f78137f440dce7dcbb4c4d4ce0b6062291c7455a9f. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 7825f641cbd0f3370cac5d7f19378a46651c344b before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-7"></a>**7. [UPI: Exxon reports higher profits](https://www.upi.com/Archives/1984/01/24/Exxon-reports-higher-profits/2136443768400/)**

- Publication date: 1984-01-24
- Source IDs: `hot-xom-1983-profit`
- Provenance note: Indexed original archive report consulted: 1983 net income $4.98 billion, up 19.1%, helped by foreign oil production including the North Sea, Australia and Malaysia.

<a id="source-8"></a>**8. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/XOM?period1=289094400&period2=481161600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-xom`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1985-03-29. Retrieved raw payload SHA256: 972bf9e08caf00ccd65ab4898896bfcb0b4ea92cdf7f0aaaac9d3d49c9159d0c. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 7825f641cbd0f3370cac5d7f19378a46651c344b before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-9"></a>**9. [IBM: The PS/2](https://www.ibm.com/history/ps-2)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-ibm-ps2`
- Provenance note: Undated retrospective company history: early PC sales, competition from clones, 1987 PS/2 launch, and the subsequent competitive response. Only facts inside each scenario window are used.

<a id="source-10"></a>**10. [UPI: IBM reports 1985 earnings](https://www.upi.com/Archives/1986/01/17/International-Business-Machines-Corp-Friday-reported-yearly-earnings-of/5559506322000/)**

- Publication date: 1986-01-17
- Source IDs: `hot-ibm-1985-profit`
- Provenance note: Indexed original archive report consulted: annual earnings slipped about 0.4%, despite revenue growth.

<a id="source-11"></a>**11. [Coca-Cola: Diet Coke global premiere in 1982](https://www.coca-colacompany.com/about-us/history/diet-coke-global-premiere-1982)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-ko-diet`
- Provenance note: Undated retrospective company history: July 1982 launch, largest US diet soft drink by end-1983, third-largest US soft drink by end-1984.

<a id="source-12"></a>**12. [Coca-Cola: New Coke and the return of the original formula](https://www.coca-colacompany.com/about-us/history/new-coke-the-most-memorable-marketing-blunder-ever)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-ko-new-coke`
- Provenance note: Retrospective company history: new formula April 23, 1985; original formula returned July 11, 1985 after customer opposition. No precise publication day asserted.

<a id="source-13"></a>**13. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/KO?period1=333936000&period2=525916800&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-ko`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1986-08-29. Retrieved raw payload SHA256: f8626f0ca318e48a5b2febba8cdc2f0fb60c301a2bb7af836af3681654f89d5f. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 7825f641cbd0f3370cac5d7f19378a46651c344b before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-14"></a>**14. [UPI: Exxon earnings up in fourth quarter](https://www.upi.com/Archives/1986/01/28/Exxons-earnings-up-264-percent-in-fourth-quarter/4416507272400/)**

- Publication date: 1986-01-28
- Source IDs: `hot-xom-1985-profit`
- Provenance note: Indexed original archive report consulted: full-year profit fell 11.9% to $4.87 billion with lower crude oil and natural gas prices. The headline increase refers only to the fourth quarter.

<a id="source-15"></a>**15. [UPI: Exxon reports higher earnings](https://www.upi.com/Archives/1986/07/23/Exxon-reports-higher-earnings/7686522475200/)**

- Publication date: 1986-07-23
- Source IDs: `hot-xom-1986-refining`
- Provenance note: Indexed original archive report consulted: second-quarter earnings improved, including stronger European refining and marketing; year-over-year percentage also reflects a prior-year charge, so the copy avoids presenting it as pure operating growth.

<a id="source-16"></a>**16. [Wired: The Macintosh at 30, an eyewitness account](https://www.wired.com/2014/01/macintosh-30th-anniversary)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-aapl-mac-launch`
- Provenance note: Retrospective account of the January 24, 1984 Macintosh launch. Used only for the launch fact, not later events.

<a id="source-17"></a>**17. [Christian Science Monitor: Apple and desktop publishing](https://www.csmonitor.com/layout/set/amphtml/1986/1007/fapple.html)**

- Publication date: 1986-10-07
- Source IDs: `hot-aapl-publishing`
- Provenance note: Contemporary report describes Macintosh and LaserWriter desktop publishing and rising Macintosh sales during summer 1986.

<a id="source-18"></a>**18. [TIME: Apple expands its business-computer market](https://content.time.com/time/subscriber/article/0%2C33009%2C965238-4%2C00.html)**

- Publication date: 1987-08-17
- Source IDs: `hot-aapl-1987-macs`
- Provenance note: Contemporary report: Macintosh SE and Macintosh II expanded the business market; second fiscal quarter revenue was $637 million, up 42%. The copy does not use later full-year results for earlier endpoints.

<a id="source-19"></a>**19. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/AAPL?period1=365472000&period2=557452800&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-aapl`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-05. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1987-08-31. Retrieved raw payload SHA256: bdaa21be855026acab891ab4b1258a1229b67919f38433a2473e1491a4ccb3a0. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Daily USD adjusted close; last trading observation in each calendar month; adjacent price ratio minus one. Yahoo adjustments incorporate splits and cash dividends; do not add dividends again. Current reconstructed history, not a contemporary database vintage. Daily observations, nulls, currency, symbol, endpoints, and monthly gaps are strictly checked. No revision-pinned endpoint is available; the raw byte hash identifies this retrieval, not an immutable downloadable revision. Normalized monthly endpoints are committed for deterministic offline rebuilding. Corporate-action assessment belongs in the scenario research record.

<a id="source-20"></a>**20. [UPI: Apple Computer reports record quarterly profits](https://www.upi.com/amp/Archives/1988/01/20/Apple-Computer-reports-record-quarterly-profits/7569569653200/)**

- Publication date: 1988-01-20
- Source IDs: `hot-aapl-1988-profit`
- Provenance note: Indexed original archive report consulted: first fiscal quarter net income $121.4 million, up 108%, following the expanded Macintosh line.

<a id="source-21"></a>**21. [Disney: 2004 Fact Book, company milestones](https://adisney.go.com/adownload/investorrelations/disney_fb04.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-dis-factbook`
- Provenance note: Original company fact book used retrospectively for dated milestones: 1984 leadership, 1987 store, 1989 Disney-MGM Studios, 1992 Euro Disney, 1994 Lion King and Paris refinancing, and February 1996 completion of the ABC acquisition. Only in-window milestones are used; the publication day is not established.

<a id="source-22"></a>**22. [UPI: Disney posts record earnings](https://www.upi.com/Archives/1987/07/23/Disney-posts-record-earnings/9076554011200/)**

- Publication date: 1987-07-23
- Source IDs: `hot-dis-1987-profit`
- Provenance note: Indexed original archive report consulted: record third-quarter net income of $128.3 million, supported by theme parks and movies.

<a id="source-23"></a>**23. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/DIS?period1=389059200&period2=581126400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-dis`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1988-05-31. Retrieved raw payload SHA256: 61ebcb353c5100907630dce623bb07fc93deaa4eed3a30cbc59b22a4dd4f2155. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 7825f641cbd0f3370cac5d7f19378a46651c344b before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-24"></a>**24. [Procter & Gamble: Company history](https://us.pg.com/pg-history/)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-pg-history`
- Provenance note: Undated retrospective history; the 1985 Richardson-Vicks acquisition expanded health-care brands.

<a id="source-25"></a>**25. [UPI: Procter & Gamble posts 18 percent earnings gain](https://www.upi.com/Archives/1989/08/10/Procter-Gamble-posts-18-percent-earnings-gain/1489618724800/)**

- Publication date: 1989-08-10
- Source IDs: `hot-pg-1989-profit`
- Provenance note: Indexed original archive report consulted: fiscal-year earnings up 18%, with record US shipments and strong international business.

<a id="source-26"></a>**26. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/PG?period1=436492800&period2=628473600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-pg`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1989-11-30. Retrieved raw payload SHA256: 9c7667b6b4329d3da0542f67dad24b4ee05545ea17e545aae5466b9797964fe3. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 469871da62f91731aede5576a186143a325c8773 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-27"></a>**27. [UPI: Colgate-Palmolive earnings advance](https://www.upi.com/Archives/1987/02/12/Colgate-Palmolive-earnings-advance/2697540104400/)**

- Publication date: 1987-02-12
- Source IDs: `hot-cl-1986-profit`
- Provenance note: Indexed original archive report consulted: improved annual earnings, strong sales and successful new products.

<a id="source-28"></a>**28. [Colgate-Palmolive: Company history](https://www.colgatepalmolive.com/en-us/who-we-are/history)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-cl-history`
- Provenance note: Undated retrospective history confirms the 1987 Softsoap acquisition.

<a id="source-29"></a>**29. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/CL?period1=436492800&period2=628473600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-cl`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1989-11-30. Retrieved raw payload SHA256: a16b7ec65cee67de701e74260367210abbbc28fc1ca3ee6ee9595e9bd6dc39bb. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 469871da62f91731aede5576a186143a325c8773 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-30"></a>**30. [UPI: General Electric, RCA complete merger](https://www.upi.com/Archives/1986/06/09/General-Electric-RCA-complete-merger/8804518673600/)**

- Publication date: 1986-06-09
- Source IDs: `hot-ge-rca`
- Provenance note: Indexed original archive report consulted: acquisition completed and RCA, including NBC, became GE subsidiaries.

<a id="source-31"></a>**31. [UPI: GE annual report shows globalization](https://www.upi.com/Archives/1989/03/06/GEs-annual-report-shows-globalization/6095605163600/)**

- Publication date: 1989-03-06
- Source IDs: `hot-ge-1988-profit`
- Provenance note: Indexed original archive report consulted: 1988 earnings about $3.4 billion, up 16%.

<a id="source-32"></a>**32. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/GE?period1=436492800&period2=628473600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-ge`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1989-11-30. Retrieved raw payload SHA256: 6851858bae1a81c48aab218ba45964f2db0aae21707c3b6eba5c96405cb3dea5. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 469871da62f91731aede5576a186143a325c8773 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-33"></a>**33. [UPI: Apple Computer lays off 400](https://www.upi.com/Archives/1990/02/21/Apple-Computer-lays-off-400/3273635576400/)**

- Publication date: 1990-02-21
- Source IDs: `hot-aapl-1990-cuts`
- Provenance note: Indexed original archive report consulted: 400 layoffs and reserves for restructuring and severance.

<a id="source-34"></a>**34. [UPI: Coca-Cola reports earnings](https://www.upi.com/Archives/1989/01/31/Coca-Cola-reports-earnings/5652602226000/)**

- Publication date: 1989-01-31
- Source IDs: `hot-ko-1988-profit`
- Provenance note: Indexed original archive report consulted: 1988 net income about $1.04 billion, up 14%, and sales about $8.34 billion, up 8.9%.

<a id="source-35"></a>**35. [UPI: Apple unveils new personal computer](https://www.upi.com/Archives/1989/03/07/Apple-unveils-new-personal-computer/5576605250000/)**

- Publication date: 1989-03-07
- Source IDs: `hot-aapl-1989-mac`
- Provenance note: Contemporary report on the smaller, less expensive Macintosh IIcx, aimed at business users.

<a id="source-36"></a>**36. [UPI: Disney earnings up](https://www.upi.com/Archives/1990/01/23/Disney-earnings-up/6483633070800/)**

- Publication date: 1990-01-23
- Source IDs: `hot-dis-1990-quarter`
- Provenance note: Indexed original archive report consulted: first fiscal quarter revenue rose to about $1.3 billion from $1.0 billion; The Little Mermaid and Roger Rabbit home video helped film revenue grow 23%.

<a id="source-37"></a>**37. [UPI: Disney earnings up 9 percent in fourth quarter](https://www.upi.com/Archives/1990/11/08/Disney-earnings-up-9-percent-in-4th-quarter/1297658040400/)**

- Publication date: 1990-11-08
- Source IDs: `hot-dis-1990-year`
- Provenance note: Indexed original archive report consulted: Disney reported record full-year revenue and earnings. The 9% headline is a quarter measure, not the full-year growth rate.

<a id="source-38"></a>**38. [UPI: IBM reports fourth-quarter loss, will keep cutting jobs](https://www.upi.com/Archives/1992/01/17/IBM-reports-fourth-quarter-loss-will-keep-cutting-jobs/2743695624400/)**

- Publication date: 1992-01-17
- Source IDs: `hot-ibm-1991-loss`
- Provenance note: Indexed original archive report consulted. The $2.8 billion annual loss included retiree-benefit accounting and restructuring charges; the copy does not describe it as an operating loss.

<a id="source-39"></a>**39. [UPI: GE earnings up, stock down sharply](https://www.upi.com/Archives/1990/10/16/GE-earnings-up-stock-down-sharply/7929656049600/)**

- Publication date: 1990-10-16
- Source IDs: `hot-ge-1990-profit`
- Provenance note: Indexed original archive report consulted: quarterly profit $1.026 billion versus $945 million; financial services, aircraft engines, power systems and appliances helped, while NBC and materials weakened.

<a id="source-40"></a>**40. [Los Angeles Times: Beeg Maks win big Da in Moscow debut](https://www.latimes.com/archives/la-xpm-1990-01-31-mn-1194-story.html)**

- Publication date: 1990-01-31
- Source IDs: `hot-mcd-moscow`
- Provenance note: Contemporary report on the opening of the first Moscow McDonald’s. Used for the opening fact only.

<a id="source-41"></a>**41. [Los Angeles Times: McDonald’s reports record earnings](https://www.latimes.com/archives/la-xpm-1991-01-29-fi-45-story.html)**

- Publication date: 1991-01-29
- Source IDs: `hot-mcd-1990-profit`
- Provenance note: Contemporary earnings brief: 1990 profit about $802 million, up 10%; overseas sales helped. Used only for these concise financial facts.

<a id="source-42"></a>**42. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/MCD?period1=528508800&period2=720576000&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-mcd`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1992-10-30. Retrieved raw payload SHA256: 477b9443725265f79050c60e5b381939bfe022cc6fe3f78553d662447997bfa1. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at ee0c2cbecd31bef59ac81275858cd59956b5b52a before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-43"></a>**43. [Sony: The acquisition of entertainment businesses](https://www.sony.com/en/SonyInfo/CorporateInfo/History/SonyHistory/2-08.html)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-sony-music-films`
- Provenance note: Undated retrospective company history: CBS Records January 1988, Columbia Pictures November 1989, film box-office performance through 1993, and a 265.2 billion yen film-business write-down in fiscal 1994. Each scenario uses only facts before its endpoint.

<a id="source-44"></a>**44. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/SONY?period1=528508800&period2=720576000&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-sony`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1992-10-30. Retrieved raw payload SHA256: 0fe40f08d5d0abc2463aae4979ad625fe0a099b439a4d0c5a52ef0996ff187bd. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at ee0c2cbecd31bef59ac81275858cd59956b5b52a before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-45"></a>**45. [UPI: Boeing says 1990 profits up 42 percent](https://www.upi.com/Archives/1991/01/28/Boeing-says-1990-profits-up-42-percent/4510665038800/)**

- Publication date: 1991-01-28
- Source IDs: `hot-ba-1990-profit`
- Provenance note: Indexed original archive report consulted: 1990 profit $1.38 billion, up 42%, on sales of $27.95 billion.

<a id="source-46"></a>**46. [UPI: Boeing to cut 757, 767 production rates](https://www.upi.com/Archives/1992/11/24/Boeing-to-cut-757-767-production-rates/7891722581200/)**

- Publication date: 1992-11-24
- Source IDs: `hot-ba-1992-cuts`
- Provenance note: Indexed original archive report consulted: falling orders led to announced 757 and 767 production reductions and job cuts.

<a id="source-47"></a>**47. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/BA?period1=565315200&period2=757382400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-ba`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1993-12-31. Retrieved raw payload SHA256: 9bc7824dc3a045b09d9bb9f3eb3c76604af1b46c7c9c05480527ad62fa6ddb67. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at ee0c2cbecd31bef59ac81275858cd59956b5b52a before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-48"></a>**48. [UPI: IBM posts worst year ever](https://www.upi.com/Archives/1993/01/19/IBM-posts-worst-year-ever/3920727419600/)**

- Publication date: 1993-01-19
- Source IDs: `hot-ibm-1992-loss`
- Provenance note: Indexed original archive report consulted: $4.97 billion net loss for 1992, including substantial restructuring charges.

<a id="source-49"></a>**49. [IBM: Louis V. Gerstner Jr.](https://www.ibm.com/history/louis-gerstner)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-ibm-gerstner`
- Provenance note: Undated retrospective company history confirms Gerstner took over as CEO in April 1993.

<a id="source-50"></a>**50. [UPI: IBM posts loss, announces job cuts](https://www.upi.com/amp/Archives/1993/07/27/IBM-posts-loss-announces-job-cuts/1007743745600/)**

- Publication date: 1993-07-27
- Source IDs: `hot-ibm-1993-cuts`
- Provenance note: Indexed original archive report consulted: major restructuring and job cuts, including an $8.9 billion second-quarter charge.

<a id="source-51"></a>**51. [UPI: Boeing reports lower third-quarter results](https://www.upi.com/Archives/1993/10/25/Boeing-reports-lower-third-quarter-results/6766751521600/)**

- Publication date: 1993-10-25
- Source IDs: `hot-ba-1993-results`
- Provenance note: Indexed original archive report consulted: lower aircraft and defense sales and development spending on the 777 weighed on results.

<a id="source-52"></a>**52. [ExxonMobil: Our history](https://corporate.exxonmobil.com/who-we-are/our-global-organization/our-history)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-xom-valdez`
- Provenance note: Undated retrospective corporate history identifies the Exxon Valdez oil spill on March 24, 1989.

<a id="source-53"></a>**53. [Oil & Gas Journal: Profits for OGJ group show big gain in 1993, revenues dip](https://www.ogj.com/general-interest/companies/article/17212109/profits-for-ogj-group-show-big-gain-in-1993-revenues-dip)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-xom-1993-refining`
- Provenance note: 1994 contemporary industry review; exact publication day not established. Exxon refining and marketing earnings rose 28% to $2.015 billion in 1993, helped by margins and lower costs. For January 1994 endpoints, cited retrospectively for the completed 1993 operating year, not as news already published at the endpoint.

<a id="source-54"></a>**54. [UPI: Sony may sell studio](https://www.upi.com/amp/Archives/1994/11/18/Sony-may-sell-studio/2593785134800/)**

- Publication date: 1994-11-18
- Source IDs: `hot-sony-1994-writeoff`
- Provenance note: Indexed original archive report consulted: about $2.7 billion film-business write-down, distinct from the reported $3.2 billion quarterly loss.

<a id="source-55"></a>**55. [Coca-Cola: 1993 Annual Report, Exhibit 13](https://investors.coca-colacompany.com/filings-reports/all-sec-filings/content/0000950144-94-000600/EX-13_1.txt)**

- Publication date: 1994-03-14
- Source IDs: `hot-ko-1993-report`
- Provenance note: Filed annual report: worldwide unit-case volume grew 5% in 1993; international markets produced 79% of operating income. These are volume and operating-income measures, not stock-return measures.

<a id="source-56"></a>**56. [IBM: 1994 Annual Report](https://www.ibm.com/investor/att/pdf/IBM_Annual_Report_1994.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-ibm-1994-report`
- Provenance note: Original annual report, publication day not established. IBM returned to roughly $3.0 billion net income in 1994 after its 1993 loss. Indexed report text consulted.

<a id="source-57"></a>**57. [IBM: 1995 Annual Report](https://www.ibm.com/investor/att/pdf/IBM_Annual_Report_1995.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-ibm-1995-report`
- Provenance note: Original annual report, publication day not established. Net income was $4.178 billion in 1995; services revenue rose from $9.715 billion to $12.714 billion; Lotus was acquired July 5, 1995. Indexed report text consulted. Some windows end before the report was published; only the earlier business events and fiscal results are described.

<a id="source-58"></a>**58. [Sony: The PlayStation](https://www.sony.com/en/SonyInfo/CorporateInfo/History/SonyHistory/2-09.html)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-sony-playstation`
- Provenance note: Undated retrospective company history confirms the original PlayStation launched in Japan on December 3, 1994. Later sales totals and overseas launches are not used.

<a id="source-59"></a>**59. [Walmart: 1996 Annual Report, Exhibit 13](https://stock.walmart.com/sec-filings/all-sec-filings/content/0000104169-96-000002/EX-13.txt)**

- Publication date: 1996-04-23
- Source IDs: `hot-wmt-1996-report`
- Provenance note: Original filing: fiscal 1991 sales $32.602 billion versus fiscal 1996 $93.627 billion; domestic supercenters grew from 9 to 239. Fiscal 1996 sales grew 13%, net income only 2.2%. Fiscal years end January 31. For February 1996 endpoint, this is retrospective documentation of the year already completed, not an in-window filing.
- Retrospective timing: used for an in-window business fact in 1991-02 (Wal-Mart, window ending 1996-02); publication is after the listed endpoint. This supports the event as historical context and does not imply the later report was available during the investment window.

<a id="source-60"></a>**60. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/WMT?period1=633830400&period2=825638400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-wmt`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1996-02-29. Retrieved raw payload SHA256: e9044b21589c6734e7608363f5fcfa817a693b67cd0b19a2216f5164cf181598. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at d5099a44d4cd563671ea674a9852c93ee95a7bb8 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-61"></a>**61. [Harley-Davidson: Form 10-Q for September 24, 1995](https://www.companiesmarketcap.com/harley-davidson/sec-reports-10q/0000897069-95-000159/)**

- Publication date: 1995-10-27
- Source IDs: `hot-hog-1995-quarter`
- Provenance note: Original SEC filing reproduced by CompaniesMarketCap, signed October 27. Quarterly motorcycle shipments 25,012 versus 22,503, up 11.1%; production 430 per day versus about 380. Use these realized figures, not the annual shipment forecast.

<a id="source-62"></a>**62. [Reuters / Los Angeles Times: Harley a victim of hog-wild demand](https://www.latimes.com/archives/la-xpm-1995-09-23-fi-49236-story.html)**

- Publication date: 1995-09-23
- Source IDs: `hot-hog-demand`
- Provenance note: Contemporary report: demand outstripped motorcycle supply, reducing showroom traffic and related apparel business. Used for the supply constraint only.

<a id="source-63"></a>**63. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/HOG?period1=633830400&period2=825638400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-hog`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1996-02-29. Retrieved raw payload SHA256: a1913a2c4aa0319edf18b77d50b61e2eb4aa263a2282c9a850d8b4bd1e1974fa. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at d5099a44d4cd563671ea674a9852c93ee95a7bb8 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-64"></a>**64. [Apple: 1996 Form 10-K](https://d18rn0p25nwr6d.cloudfront.net/CIK-0000320193/1adc4027-e65b-4c5b-b5b1-d205af19d6cb.html)**

- Publication date: 1996-12-19
- Source IDs: `hot-aapl-1996-report`
- Provenance note: Original company filing confirms fiscal 1996 sales fell 11% and net loss was $816 million, including inventory and restructuring charges. Filing is after November 1996; used retrospectively for the fiscal year already ended, not as an in-window announcement.
- Retrospective timing: used for an in-window business fact in 1991-11 (Apple Computer, window ending 1996-11); publication is after the listed endpoint. This supports the event as historical context and does not imply the later report was available during the investment window.

<a id="source-65"></a>**65. [Honda: 75 years of history, recovery through new recreational vehicles](https://global.honda/en/about/history-digest/75years-history/chapter1/section3/)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-hmc-products`
- Provenance note: Retrospective official history: Odyssey launched October 20, 1994 and CR-V in 1995; new recreational vehicles helped the Japanese business recover. Does not use the later 36-month Odyssey sales milestone.

<a id="source-66"></a>**66. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/HMC?period1=665366400&period2=857174400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-hmc`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1997-02-28. Retrieved raw payload SHA256: 4374ee3fd320f6c06a8d772df0769c70185d571ed8d38672ec4d3edb1a2f0eb6. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 39064cd980ea5ce02d02b14aedd945cbc512c901 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-67"></a>**67. [Hasbro: 1996 full-year results](https://investor.hasbro.com/static-files/428bf746-694e-464d-8b2c-ea4bb024e68e)**

- Publication date: 1997-02-06
- Source IDs: `hot-has-1996-results`
- Provenance note: Original company release: 1996 sales $3.002 billion, up 5%; net earnings $199.912 million. Board games, CD-ROM games and Star Wars products contributed. The release’s 15% earnings-growth figure excludes a prior-year charge and is not used.

<a id="source-68"></a>**68. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/HAS?period1=665366400&period2=857174400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-has`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1997-02-28. Retrieved raw payload SHA256: 6d38e8652b07f1c486830eb9a56ff26a3f94119543f2ebdd8132cd39356d7e82. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 39064cd980ea5ce02d02b14aedd945cbc512c901 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-69"></a>**69. [Ford: Fourth-quarter and 1996 earnings release](https://www.theautochannel.com/news/press/date/19970129/press000661.html)**

- Publication date: 1997-01-29
- Source IDs: `hot-f-1996-results`
- Provenance note: Original company release distributed through PR Newswire and reproduced by The Auto Channel; indexed full text consulted. Ford sold a record 2.1 million US trucks in 1996; Expedition launched in October. Total earnings $4.4 billion, while European automotive operations lost $291 million.

<a id="source-70"></a>**70. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/F?period1=688953600&period2=880934400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-f`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1997-11-28. Retrieved raw payload SHA256: cc6a211ba9707f93972b8a416e9f58fda9b1f6ae2f2cbce795c98d87869c5378. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 39064cd980ea5ce02d02b14aedd945cbc512c901 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-71"></a>**71. [Microsoft: Looking back, the 25th Anniversary of Windows 95](https://blogs.windows.com/windows-insider/2020/08/24/looking-back-the-25th-anniversary-of-windows-95/)**

- Publication date: 2020-08-24
- Source IDs: `windows95`
- Provenance note: Retrospective product history.
- Retrospective timing: used for an in-window business fact in 1994-02 (Microsoft, window ending 1999-02); publication is after the listed endpoint. This supports the event as historical context and does not imply the later report was available during the investment window.

<a id="source-72"></a>**72. [Microsoft: Record Fiscal 1998 Revenue and Income](https://news.microsoft.com/source/1998/07/16/microsoft-announces-record-fiscal-1998-revenue-and-income/)**

- Publication date: 1998-07-16
- Source IDs: `hot-msft-1998-results`
- Provenance note: Contemporary earnings release: fiscal 1998 revenue $14.48 billion, net income $4.49 billion, Office 97 demand, Windows NT growth, and June 25 Windows 98 release.

<a id="source-73"></a>**73. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/MSFT?period1=728524800&period2=920246400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-msft`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1999-02-26. Retrieved raw payload SHA256: ca3cd40e83190b212643be4553abf626e920ac81ff8b5ccfb6ec7b4393731d6a. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 51751d83a3a99896590caabaef1016d5aeade4c8 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-74"></a>**74. [Intel: 1998 Annual Report](https://www.intel.com/content/dam/www/central-libraries/us/en/documents/2025-05/history-1998-annual-report.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-intel-1998-report`
- Provenance note: Company archive of the contemporary report. Pentium II and Pentium with MMX drove 1997 processor growth; Celeron and Pentium II Xeon expanded the range in 1998. Fiscal 1998 revenue $26.3 billion and profit $6.1 billion, down from $6.9 billion in 1997. Archive path is modern; facts concern 1996–1998.

<a id="source-75"></a>**75. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/INTC?period1=728524800&period2=920246400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-intc`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 1999-02-26. Retrieved raw payload SHA256: 2aa4606090083972bc4b8383e2114162d5dca3efb9db1e3ba1ec39e69b73b643. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 51751d83a3a99896590caabaef1016d5aeade4c8 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-76"></a>**76. [Walt Disney Archives / D23: Disney History](https://d23.com/disney-history/)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-disney-history`
- Provenance note: Company history: The Lion King was a hit in 1994; Capital Cities/ABC purchase completed early 1996; Animal Kingdom and Disney Magic cruise ship began operating in 1998. Later history on the same page is not used.

<a id="source-77"></a>**77. [Microsoft: Record Fiscal Year Revenue and Income](https://news.microsoft.com/source/2000/07/18/microsoft-announces-record-fiscal-year-revenue-and-income/)**

- Publication date: 2000-07-18
- Source IDs: `hot-msft-2000-results`
- Provenance note: Contemporary earnings release: fiscal 2000 revenue $22.96 billion, net income $9.42 billion, and business adoption of Windows 2000 and server software.

<a id="source-78"></a>**78. [Intel: Record Second Quarter Revenue (company release via Cision)](https://news.cision.com/intel/r/q2-revenue-a-record--8-3-billion--up-23-percent-q2-earnings-excluding-acquisition-related-costs---0-50-per-share--1-00-,e26315)**

- Publication date: 2000-07-19
- Source IDs: `hot-intel-2000-q2`
- Provenance note: Company-issued earnings release: second-quarter revenue $8.3 billion, up 23%; record microprocessor and flash-memory unit shipments and strong PC/server demand. Profit growth included substantial investment income, so it is not presented as purely chip operating performance. Stock splits are not treated as returns.

<a id="source-79"></a>**79. [Nike: Fiscal 1998 Annual Report](https://d1lge852tjjqow.cloudfront.net/CIK-0000320187/b24db717-6b9c-45ad-86c9-09627b0f4564.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-nike-1998-report`
- Provenance note: Company annual-report archive: Asian financial crisis and weaker U.S. demand left excess stock and discounting in fiscal 1998; revenue growth slowed to 4% and gross margin fell from 40.1% to 36.5%.

<a id="source-80"></a>**80. [Nike: Fiscal 2002 Form 10-K](https://investors.nike.com/sec-filings/all-sec-filings/content/0000891020-02-001248/v83383ore10vk.htm)**

- Publication date: 2002-08-14
- Source IDs: `hot-nike-2002-report`
- Provenance note: Retrospective fiscal 2001 discussion: new demand/supply planning system caused excess stock, shortages and late deliveries; U.S. footwear revenue fell 4.2%, international revenue grew, and net income was $589.7 million. Fiscal 2002 revenue grew 4.3% to $9.89 billion. Scenarios ending before May 2002 use only the report’s 2001 facts.
- Retrospective timing: used for an in-window business fact in 1996-09 (Nike, window ending 2001-09); 1997-04 (Nike, window ending 2002-04); 1997-07 (Nike, window ending 2002-07); publication is after the listed endpoint. This supports the event as historical context and does not imply the later report was available during the investment window.

<a id="source-81"></a>**81. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/NKE?period1=809913600&period2=1001894400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-nke`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2001-09-28. Retrieved raw payload SHA256: 9054c33a2733fa370d862b0461e1b42225768029a6fe94fe728fa3ac7e836b13. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 58bb922ff86753274a437704507fe623f7ccc070 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-82"></a>**82. [Apple: Fiscal 1998 Form 10-K](https://d18rn0p25nwr6d.cloudfront.net/CIK-0000320193/fb365068-0d4f-4c51-a0b1-7755ee7fc1d5.html)**

- Publication date: 1998-12-23
- Source IDs: `hot-apple-1998-report`
- Provenance note: Annual filing linked from Apple Investor Relations (FilingId=107083): 1997 NeXT acquisition, August 1998 iMac launch, product simplification and $309 million fiscal 1998 profit after a $1.045 billion 1997 loss. Uses figures as reported at the time.

<a id="source-83"></a>**83. [Apple: First Quarter Results, Fiscal 2001](https://www.apple.com/newsroom/2001/01/17Apple-Reports-First-Quarter-Results/)**

- Publication date: 2001-01-17
- Source IDs: `hot-apple-2001-q1`
- Provenance note: Holiday quarter ended December 30, 2000: revenue $1 billion, down 57%, and net loss $195 million while Apple reduced excess inventory.

<a id="source-84"></a>**84. [Microsoft: Record Revenue for Fiscal Year 2001](https://news.microsoft.com/source/2001/07/19/microsoft-announces-record-revenue-for-fiscal-year-2001/)**

- Publication date: 2001-07-19
- Source IDs: `hot-msft-2001-results`
- Provenance note: Contemporary earnings release: fiscal 2001 revenue $25.30 billion, Windows 2000 adoption, and Office XP release on May 31. Windows XP and Xbox launches were still future events and are not used for the September 2001 endpoint.

<a id="source-85"></a>**85. [Disney: Fiscal 2002 Form 10-K, Retrospective 2001 Operations](https://www.sec.gov/Archives/edgar/data/1001039/000095014802002854/v86195e10vk.htm)**

- Publication date: 2002-12-04
- Source IDs: `hot-disney-2001-operations`
- Provenance note: Only fiscal 2001 facts used: GO.com closure caused $878 million restructuring/impairment charges; ABC had lower ratings and weaker advertising; September 11 closures and reduced travel hurt park attendance. Disney California Adventure opened in fiscal 2001. Does not narrate fiscal 2002 totals after the April/July endpoints.
- Retrospective timing: used for an in-window business fact in 1997-04 (Walt Disney, window ending 2002-04); 1997-07 (Walt Disney, window ending 2002-07); publication is after the listed endpoint. This supports the event as historical context and does not imply the later report was available during the investment window.

<a id="source-86"></a>**86. [Apple: First Quarter Profit of $38 Million](https://www.apple.com/newsroom/2002/01/16Apple-Reports-First-Quarter-Profit-of-38-Million/)**

- Publication date: 2002-01-16
- Source IDs: `hot-apple-2002-q1`
- Provenance note: Quarter ended December 29, 2001: net profit $38 million versus a $195 million year-earlier loss; over 125,000 iPods sold in two months and 27 Apple retail stores open by year end.

<a id="source-87"></a>**87. [Intel: 2001 Annual Report](https://www.intel.com/content/dam/www/central-libraries/us/en/documents/2025-05/history-2001-annual-report.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-intel-2001-report`
- Provenance note: Company archive: recession and technology spending cuts followed overbuilding; fiscal 2001 revenue fell 21% to $26.5 billion and net income fell 88%, including acquisition charges. Intel introduced a 2 GHz Pentium 4 in August 2001.

<a id="source-88"></a>**88. [Apple: Apple Presents iPod](https://www.apple.com/newsroom/2001/10/23Apple-Presents-iPod/)**

- Publication date: 2001-10-23
- Source IDs: `hot-apple-ipod-launch`
- Provenance note: Contemporary announcement of the first iPod on October 23, 2001. This event is excluded from the scenario ending September 2001.

<a id="source-89"></a>**89. [Apple: iTunes Music Store Sells Over One Million Songs in First Week](https://www.apple.com/newsroom/2003/05/05iTunes-Music-Store-Sells-Over-One-Million-Songs-in-First-Week/)**

- Publication date: 2003-05-05
- Source IDs: `hot-apple-itunes-2003`
- Provenance note: First-week milestone after the April 2003 iTunes Music Store launch: more than one million songs purchased; music store and iPod integration.

<a id="source-90"></a>**90. [Amazon: Free Shipping and Low Prices Fuel 42% Unit Growth](https://press.aboutamazon.com/2003/7/amazon-com-announces-free-shipping-and-low-prices-fuel-42-unit-growth)**

- Publication date: 2003-07-22
- Source IDs: `hot-amazon-2003-q2`
- Provenance note: Release body dated July 22 (archive header is one day earlier): Q2 2003 sales $1.1 billion (+37%), operating income $42 million, net loss $43 million; lower prices/free shipping and third-party sellers supported growth. Full-year 2003 profit is outside the August 2003 endpoint and excluded.

<a id="source-91"></a>**91. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/AMZN?period1=870393600&period2=1062374400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-amzn`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2003-08-29. Retrieved raw payload SHA256: 4759f0b222cf54e6bc28f18a9ebf9f8cb47d86cd90c4cac14047480e9e542b37. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 512620e29d09e553a25e2d78441a944a4157e5cc before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-92"></a>**92. [Microsoft: Fourth Quarter Earnings, Fiscal 2003](https://news.microsoft.com/source/2003/07/17/microsoft-reports-fourth-quarter-earnings/)**

- Publication date: 2003-07-17
- Source IDs: `hot-msft-2003-results`
- Provenance note: Contemporary earnings release: fiscal 2003 revenue $32.19 billion, 13% growth; over 9.4 million Xbox consoles sold since the 2001 launch. Profit comparisons across this era are avoided because later statements changed stock compensation accounting.

<a id="source-93"></a>**93. [Microsoft: Strong Fourth Quarter Earnings, Fiscal 2004](https://news.microsoft.com/source/2004/07/22/microsoft-reports-strong-fourth-quarter-earnings/)**

- Publication date: 2004-07-22
- Source IDs: `hot-msft-2004-results`
- Provenance note: Contemporary earnings release: fiscal 2004 revenue $36.84 billion and net income $8.17 billion; Windows Server 2003 and Office demand; Sun settlement and European Commission fine. The stock summary does not treat the proposed July special dividend as already paid.

<a id="source-94"></a>**94. [Cisco: Third Quarter Earnings, Fiscal 2001](https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2001/m05/cisco-systems-reports-third-quarter-earnings.html)**

- Publication date: 2001-05-08
- Source IDs: `hot-cisco-2001-q3`
- Provenance note: Contemporary release: sharp reversal in orders, technology capital-spending weakness, $2.2 billion excess-inventory charge and $2.69 billion GAAP quarterly loss. Distinguishes inventory write-down from the separate $1.17 billion restructuring charge.

<a id="source-95"></a>**95. [Cisco: Fourth Quarter and Fiscal Year 2004 Earnings](https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2004/m08/cisco-systems-reports-fourth-quarter-and-fiscal-year-2004-earnings.html)**

- Publication date: 2004-08-10
- Source IDs: `hot-cisco-2004-results`
- Provenance note: Fiscal 2004 revenue $22.0 billion (+16.8%) and GAAP net income $4.4 billion versus $3.6 billion the prior year. Records an operating recovery while scenario return paths remain below their late-1999/2000 starting prices.

<a id="source-96"></a>**96. [Yahoo Finance historical adjusted close, public 2016 CSV snapshot](https://raw.githubusercontent.com/rpandya1990/Stock-Prediction-Web-Application/df6002f3b04ef7fcd43aa84ce5cb1428bf98b5fd/Scripts/CSCO_His.csv)**

- Publication date: 2016-05-03
- Source IDs: `yahoo-csco`
- Provenance note: Retrospective archive used for outcomes. Publication date is that of the pinned public mirror revision (https://github.com/rpandya1990/Stock-Prediction-Web-Application/commit/df6002f3b04ef7fcd43aa84ce5cb1428bf98b5fd), not original market reporting or first dataset publication. Canonical source: https://finance.yahoo.com/quote/CSCO/history/. Series: CSCO. Raw SHA256: ede150e95419d9f2dfb69ea036d987c1a7883eb8a6c29809e05b65be5f9d9e0d. Same pinned Yahoo provider chain and month-end adjusted-price ratio method as MSFT. Use split-adjusted prices; subsequent adjustment scaling cancels in historical ratios. No dividend during this scenario horizon. No successor or acquisition-cash mapping. Current reconstruction, not contemporaneous database vintage.

<a id="source-97"></a>**97. [Amazon: 2003 Results and Year-Round Free Shipping](https://press.aboutamazon.com/2004/1/amazon-com-announces-record-free-cash-flow-fueled-by-lower-prices-and-year-round-free-shipping)**

- Publication date: 2004-01-27
- Source IDs: `hot-amazon-2003-results`
- Provenance note: Fiscal 2003 sales $5.264 billion (+34%), net income $35 million versus a $149 million 2002 loss, operating income $271 million. Lower prices and year-round free shipping were central strategies; international sales exceeded $2 billion.

<a id="source-98"></a>**98. [Apple: First Quarter Results, Fiscal 2005](https://www.apple.com/newsroom/2005/01/12Apple-Reports-First-Quarter-Results/)**

- Publication date: 2005-01-12
- Source IDs: `hot-apple-2005-q1`
- Provenance note: Holiday quarter ended December 25, 2004: 4.58 million iPods shipped, revenue $3.49 billion up 74%, profit $295 million versus $63 million. These results were public before the January 2005 endpoint.

<a id="source-99"></a>**99. [Occidental Petroleum: Record 2004 Results (company release)](https://www.globenewswire.com/news-release/2005/01/24/321819/3/en/Occidental-Petroleum-Announces-Record-2004-Results.html)**

- Publication date: 2005-01-24
- Source IDs: `hot-oxy-2004-results`
- Provenance note: Company-issued release via PRIMEZONE/GlobeNewswire: 2004 reported net income nearly $2.5 billion; oil/gas production grew 3.5% to 566,000 barrels of oil equivalent per day; higher energy prices and stronger chemicals earnings contributed. Uses contemporary figures, not later restatements.

<a id="source-100"></a>**100. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/OXY?period1=915148800&period2=1107216000&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-oxy`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2005-01-31. Retrieved raw payload SHA256: 07c725633155972c0aa85f4832b647f283bb48fb4e0f87809a4cd64aff3e029b. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 6d685968970958efe69c2d1422ac21cd5e2dc187 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-101"></a>**101. [Amazon: 2004 Results and Introduction of Amazon Prime](https://press.aboutamazon.com/2005/2/amazon-com-announces-record-free-cash-flow-fueled-by-lower-prices-and-free-shipping-introduces-new-express-shipping-program-amazon-prime)**

- Publication date: 2005-02-02
- Source IDs: `hot-amazon-2004-results`
- Provenance note: 2004 revenue $6.92 billion (+31%) and operating income $440 million; Amazon Prime introduced February 2, 2005. Operating profit is used rather than net profit inflated by a $244 million tax benefit. Prime is excluded from the scenario ending January 2005.

<a id="source-102"></a>**102. [Microsoft: Strong Revenue Growth, Fiscal 2005 (SEC exhibit)](https://www.sec.gov/Archives/edgar/data/789019/000119312505146318/dex991.htm)**

- Publication date: 2005-07-21
- Source IDs: `hot-msft-2005-results`
- Provenance note: Fiscal year ended June 30, 2005: revenue $39.79 billion, net income $12.25 billion, SQL Server growth, Xbox growth, and $44 billion returned through dividends and repurchases. For the June 2005 endpoint, this is retrospective evidence of operations completed within the window, not an in-window July announcement.
- Retrospective timing: used for an in-window business fact in 2000-06 (Microsoft, window ending 2005-06); publication is after the listed endpoint. This supports the event as historical context and does not imply the later report was available during the investment window.

<a id="source-103"></a>**103. [PepsiCo: Quaker Merger, Supplemental SEC Financial Statements](https://www.sec.gov/Archives/edgar/data/77476/000095010301501343/aug2701_ex9901.htm)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-pepsico-quaker-2001`
- Provenance note: SEC exhibit records August 2, 2001 completion of Quaker Oats merger and combined Gatorade beverage operations. Historical restated financial comparisons are not described as future organic growth.

<a id="source-104"></a>**104. [PepsiCo: Fiscal 2005 Form 10-K](https://www.sec.gov/Archives/edgar/data/77476/000119312506039968/d10k.htm)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-pepsico-2005-report`
- Provenance note: Retrospective 2005 operations: North American beverage revenue rose 10%, with strong Gatorade/Aquafina growth and new Gatorade Lemonade/Aquafina FlavorSplash; Frito-Lay North America revenue grew 8%. The extra reporting week contributed one point to beverage revenue growth and two points to Frito-Lay revenue growth.

<a id="source-105"></a>**105. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/PEP?period1=944006400&period2=1136073600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-pep`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2005-12-30. Retrieved raw payload SHA256: 7f9d916279a83268e1bdad335c6c12f215a307560045c791ed661b0a5b320de9. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 679203e5c4daf05266b23528280fbd62860d94d9 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-106"></a>**106. [Coca-Cola: Fiscal 2005 Form 10-K](https://investors.coca-colacompany.com/filings-reports/all-sec-filings/content/0001047469-06-002588/a2167326z10-k.htm)**

- Publication date: 2006-02-28
- Source IDs: `hot-coke-2005-report`
- Provenance note: Retrospective in-window operations: 2004 North American volume flat and Coca-Cola C2 weaker than expected; Coca-Cola Zero launched in North America in 2005; worldwide 2005 volume grew 4%, and North American volume 2%.
- Retrospective timing: used for an in-window business fact in 2000-12 (Coca-Cola, window ending 2005-12); publication is after the listed endpoint. This supports the event as historical context and does not imply the later report was available during the investment window.

<a id="source-107"></a>**107. [Boeing: 2005 Record Airplane Orders](https://boeing.mediaroom.com/2006-01-05-Boeing-Ends-2005-with-New-Records-for-Airplane-Orders)**

- Publication date: 2006-01-05
- Source IDs: `hot-boeing-2005-orders`
- Provenance note: Company report: 1,002 net commercial airplane orders in 2005, up from 272 in 2004; 235 orders for the 787. These are orders, not aircraft deliveries or already earned revenue; no later 787 delivery is implied.

<a id="source-108"></a>**108. [Microsoft: Fourth Quarter Results, Fiscal 2006](https://news.microsoft.com/source/2006/07/20/microsoft-reports-fourth-quarter-results-and-announces-share-repurchase-program/)**

- Publication date: 2006-07-20
- Source IDs: `hot-msft-2006-results`
- Provenance note: Fiscal 2006 revenue $44.28 billion and net income $12.60 billion; demand for Xbox 360, SQL Server 2005 and Visual Studio 2005 contributed to growth.

<a id="source-109"></a>**109. [Apple: Third Quarter Results, Fiscal 2006](https://www.apple.com/newsroom/2006/07/19Apple-Reports-Third-Quarter-Results/)**

- Publication date: 2006-07-19
- Source IDs: `hot-apple-2006-q3`
- Provenance note: Quarter ended July 1, 2006: 8.111 million iPods and 1.327 million Macs shipped, $4.37 billion revenue and $472 million profit; more than 75% of Macs sold used Intel processors.

<a id="source-110"></a>**110. [Costco: Fiscal 2007 Form 10-K](https://www.sec.gov/Archives/edgar/data/909832/000119312507225805/d10k.htm)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-costco-2007-report`
- Provenance note: Fiscal 2007 merchandise sales $63.09 billion (+7%), 30 new warehouses, comparable warehouse sales +6%, membership fee revenue $1.31 billion (+10.5%) following a $5 increase for basic memberships in 2006. Merchandise sales are distinguished from total revenue including membership fees.

<a id="source-111"></a>**111. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/COST?period1=1014940800&period2=1207008000&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-cost`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2008-03-31. Retrieved raw payload SHA256: 9e1be16ca09de88eba1fa7b4c5fd4c9c8857407d3b81299ca82d88602b5b29e7. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 679203e5c4daf05266b23528280fbd62860d94d9 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-112"></a>**112. [Intel: 2007 Annual Report, Letter to Stockholders](https://media.corporate-ir.net/media_files/irol/10/101302/2007annualreport/introduction/ceo/index.html)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-intel-2007-report`
- Provenance note: Company annual report: Core-based product transition continued during 2007; quad-core products launched November 2006; fiscal 2007 revenue $38.3 billion (+8%) and operating income $8.2 billion (+45%).

<a id="source-113"></a>**113. [Merck: Worldwide Vioxx Withdrawal (SEC exhibit)](https://www.sec.gov/Archives/edgar/data/64978/000129993304000969/exhibit1.htm)**

- Publication date: 2004-09-30
- Source IDs: `hot-merck-vioxx-2004`
- Provenance note: Contemporary September 30, 2004 worldwide withdrawal following a clinical trial showing increased cardiovascular risks including heart attack and stroke.

<a id="source-114"></a>**114. [Merck: 2007 Financial Results (SEC exhibit)](https://www.sec.gov/Archives/edgar/data/64978/000095012308000919/y47535exv99w1.htm)**

- Publication date: 2008-01-30
- Source IDs: `hot-merck-2007-results`
- Provenance note: 2007 results: $4.85 billion pretax charge for November Vioxx settlement agreement; Gardasil sales $1.5 billion. Settlement charge is not described as cash paid immediately or as resolving every claim.

<a id="source-115"></a>**115. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/MRK?period1=1014940800&period2=1207008000&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-mrk`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2008-03-31. Retrieved raw payload SHA256: 494c694ed058a62cdc2cdada948584552a6e2c339a690efe2298c7bcbf1ae9a2. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 679203e5c4daf05266b23528280fbd62860d94d9 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-116"></a>**116. [Apple: Second Quarter Results, Fiscal 2009](https://www.apple.com/ie/newsroom/2009/04/22Apple-Reports-Second-Quarter-Results/)**

- Publication date: 2009-04-22
- Source IDs: `hot-apple-2009-q2`
- Provenance note: Contemporary GAAP results: $8.16 billion revenue, $1.21 billion profit, 3.79 million iPhones sold (+123%), and Mac units down 3%. The release describes the first iPhone in fiscal 2007 and July 2008 iPhone 3G launch. No June 2009 iPhone 3GS event is used.

<a id="source-117"></a>**117. [Microsoft: Windows Vista and Office 2007 Consumer Launch](https://news.microsoft.com/source/2007/01/29/microsoft-launches-windows-vista-and-microsoft-office-2007-to-consumers-worldwide/)**

- Publication date: 2007-01-29
- Source IDs: `hot-msft-vista-office-launch`
- Provenance note: Contemporary January 29 release announces worldwide consumer availability of Windows Vista and Office 2007 the following day, January 30, 2007. Observation date records the announcement.

<a id="source-118"></a>**118. [Microsoft: Third-Quarter Results, Fiscal 2009](https://news.microsoft.com/source/2009/04/23/microsoft-reports-third-quarter-results-2/)**

- Publication date: 2009-04-23
- Source IDs: `hot-msft-2009-q3`
- Provenance note: Revenue in the quarter ended March 31 fell 6% to $13.65 billion as global PC and server markets weakened. Net income fell 32%, including investment and severance charges.

<a id="source-119"></a>**119. [eBay: October 2007 Skype Charge, Form 8-K](https://www.sec.gov/Archives/edgar/data/1065088/000089161807000579/f34172e8vk.htm)**

- Publication date: 2007-10-01
- Source IDs: `hot-ebay-skype-2007`
- Provenance note: Following the 2005 Skype purchase, eBay announced a total $1.4 billion charge in October 2007, reflecting Skype impairment and the earn-out settlement.

<a id="source-120"></a>**120. [eBay: First Quarter 2009 Results (SEC exhibit)](https://www.sec.gov/Archives/edgar/data/1065088/000119312509084618/dex991.htm)**

- Publication date: 2009-04-22
- Source IDs: `hot-ebay-2009-q1`
- Provenance note: Quarter ended March 31, 2009: marketplace revenue fell 18%; payments revenue grew 11%; total company revenue fell 8%. Weak marketplace performance, the economy and currency effects were relevant; no later Skype sale or PayPal separation is used.

<a id="source-121"></a>**121. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/EBAY?period1=1051747200&period2=1243814400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-ebay`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-05. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2009-05-29. Retrieved raw payload SHA256: 626e8b1dcc9cbef7938dd48e8431e2d1d1e93acef8b0b9bd584a970ae01250dc. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Daily USD adjusted close; last trading observation in each calendar month; adjacent price ratio minus one. Yahoo adjustments incorporate splits and cash dividends; do not add dividends again. Current reconstructed history, not a contemporary database vintage. Daily observations, nulls, currency, symbol, endpoints, and monthly gaps are strictly checked. No revision-pinned endpoint is available; the raw byte hash identifies this retrieval, not an immutable downloadable revision. Normalized monthly endpoints are committed for deterministic offline rebuilding. Corporate-action assessment belongs in the scenario research record.

<a id="source-122"></a>**122. [Toyota: FY2009 financial results](https://global.toyota/en/detail/307960)**

- Publication date: 2009-05-08
- Source IDs: `hot-toyota-fy2009`
- Provenance note: Fiscal year ended March 2009: vehicle sales fell 15.1%; net loss was 436.9 billion yen amid the global economic downturn.

<a id="source-123"></a>**123. [Toyota: NHTSA civil penalty settlement](https://pressroom.toyota.com/toyota-motor-corporation-agrees-to-settle-nhtsa-civil-penalty/)**

- Publication date: 2010-04-19
- Source IDs: `hot-toyota-recall2010`
- Provenance note: Toyota agreed to settle the penalty related to the timing of its sticky-accelerator recall. Supports the recall setback, not an estimate of its stock-price effect.

<a id="source-124"></a>**124. [Toyota: FY2010 financial results](https://global.toyota/en/detail/334713)**

- Publication date: 2010-05-11
- Source IDs: `hot-toyota-fy2010`
- Provenance note: Fiscal year ended March 2010: net income recovered to 209.4 billion yen, while revenue fell 7.7%.

<a id="source-125"></a>**125. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/TM?period1=1093996800&period2=1285891200&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-tm`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2010-09-30. Retrieved raw payload SHA256: ae18c7c9b8fed78ec0d089a1d9826794f3a9a729f9daf610b16a736bb31ae0bf. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 41e0172a01657625cb173bfb9526143406ca2092 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-126"></a>**126. [Disney completes Pixar acquisition](https://thewaltdisneycompany.com/press-releases/disney-completes-pixar-acquisition/)**

- Publication date: 2006-05-05
- Source IDs: `hot-disney-pixar2006`
- Provenance note: Completion of the Pixar acquisition in May 2006.

<a id="source-127"></a>**127. [Disney: third-quarter fiscal 2010 earnings](https://thewaltdisneycompany.com/app/uploads/2015/10/Q3-FY10-Earnings-Report.pdf)**

- Publication date: 2010-08-10
- Source IDs: `hot-disney-q32010`
- Provenance note: Revenue rose 16% to $10 billion; studio operating profit was $123 million versus a $12 million loss. Toy Story 3 and Alice in Wonderland helped theatrical results; Toy Story merchandise also performed well.

<a id="source-128"></a>**128. [ExxonMobil: record 2008 results](https://investor.exxonmobil.com/sec-filings/all-sec-filings/content/0000034088-09-000016/r8k4q991.htm)**

- Publication date: 2009-01-30
- Source IDs: `hot-exxon-fy2008`
- Provenance note: Full-year 2008 net income was a record $45.22 billion. High oil prices earlier in the year supported strong annual earnings despite the late-year downturn.

<a id="source-129"></a>**129. [ExxonMobil: full-year 2009 results](https://www.sec.gov/Archives/edgar/data/34088/000003408810000008/f8k4q991.htm)**

- Publication date: 2010-02-01
- Source IDs: `hot-exxon-fy2009`
- Provenance note: Net income fell 57% to $19.28 billion in 2009. Lower commodity prices, weaker margins and demand hurt results; the annual dividend per share increased 7%.

<a id="source-130"></a>**130. [HP history: EDS acquisition](https://www.hp.com/hpinfo/abouthp/histnfacts/timeline/hist_00s.html)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-hp-eds2008`
- Provenance note: Retrospective company timeline documents the 2008 acquisition of EDS for $13.9 billion, expanding enterprise technology services.

<a id="source-131"></a>**131. [HP: fourth-quarter and full-year 2010 results](https://investor.hp.com/news-events/news/news-details/2010/HP-Reports-Fourth-Quarter-2010-Results/default.aspx)**

- Publication date: 2010-11-22
- Source IDs: `hot-hp-fy2010`
- Provenance note: Full-year 2010 revenue was $126 billion, up 10%; earnings per share increased. This predates the scenario endpoint in July 2011.

<a id="source-132"></a>**132. [HP: second-quarter fiscal 2011 results](https://investor.hp.com/news-events/news/news-details/2011/HP-Reports-Second-Quarter-2011-Results/default.aspx)**

- Publication date: 2011-05-17
- Source IDs: `hot-hp-q22011`
- Provenance note: Commercial servers and software grew, while weak consumer demand and services challenges accompanied a reduced full-year outlook. The August 2011 strategic announcements occur after this scenario and are excluded.

<a id="source-133"></a>**133. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/HPQ?period1=1120176000&period2=1312156800&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-hpq`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2011-07-29. Retrieved raw payload SHA256: 1a2733bd47d08e3b5bd65e37df274fbca36d203f19f277cb98b1d2d05efa5f45. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 41e0172a01657625cb173bfb9526143406ca2092 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-134"></a>**134. [Apple introduces iPhone](https://www.apple.com/uk/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/)**

- Publication date: 2007-01-09
- Source IDs: `hot-apple-iphone2007`
- Provenance note: Original iPhone introduction. Used as an in-window event only for the July 2006 scenario.

<a id="source-135"></a>**135. [Apple launches iPad](https://www.apple.com/newsroom/2010/01/27Apple-Launches-iPad/)**

- Publication date: 2010-01-27
- Source IDs: `hot-apple-ipad2010`
- Provenance note: Apple introduced the iPad tablet in January 2010; announcement distinguished from its later retail availability.

<a id="source-136"></a>**136. [Apple: third-quarter fiscal 2011 results](https://www.apple.com/newsroom/2011/07/19Apple-Reports-Third-Quarter-Results/)**

- Publication date: 2011-07-19
- Source IDs: `hot-apple-q32011`
- Provenance note: Revenue was $28.57 billion and net profit $7.31 billion. Apple sold 20.34 million iPhones, up 142%, and 9.25 million iPads, up 183%.

<a id="source-137"></a>**137. [Microsoft: fourth-quarter and full-year fiscal 2011 results](https://news.microsoft.com/source/2011/07/21/microsoft-reports-record-fourth-quarter-and-full-year-results/)**

- Publication date: 2011-07-21
- Source IDs: `hot-microsoft-fy2011`
- Provenance note: Fiscal 2011 revenue was $69.94 billion, up 12%, and net income was $23.15 billion, up 23%. Office, server software and Xbox supported growth.

<a id="source-138"></a>**138. [Apple: second-quarter fiscal 2012 results](https://www.apple.com/newsroom/2012/04/24Apple-Reports-Second-Quarter-Results/)**

- Publication date: 2012-04-24
- Source IDs: `hot-apple-q22012`
- Provenance note: Quarterly revenue $39.2 billion and net profit $11.6 billion; 35.1 million iPhones and 11.8 million iPads sold, up 88% and 151% respectively.

<a id="source-139"></a>**139. [Microsoft: third-quarter fiscal 2012 results](https://news.microsoft.com/source/2012/04/19/microsoft-reports-record-third-quarter-revenue/)**

- Publication date: 2012-04-19
- Source IDs: `hot-microsoft-q32012`
- Provenance note: Revenue rose 6% to $17.41 billion; operating income rose 12%. Office 2010 drove Business Division revenue growth of 9%, and Windows revenue grew 4%.

<a id="source-140"></a>**140. [Disney completes Marvel acquisition](https://thewaltdisneycompany.com/press-releases/disney-completes-marvel-acquisition/)**

- Publication date: 2009-12-31
- Source IDs: `hot-disney-marvel2009`
- Provenance note: Disney completed the acquisition of Marvel at the end of 2009.

<a id="source-141"></a>**141. [Disney: second-quarter fiscal 2012 earnings](https://thewaltdisneycompany.com/app/uploads/2015/10/Q2-FY12-Earnings-Report.pdf)**

- Publication date: 2012-05-08
- Source IDs: `hot-disney-q22012`
- Provenance note: Quarter ended March 31: net income rose 21% to $1.143 billion; TV networks and parks grew while John Carter hurt studio results. The release also reports the May Avengers opening weekend of $207.1 million domestically.

<a id="source-142"></a>**142. [Lennar: fourth-quarter and fiscal 2008 results](https://www.sec.gov/Archives/edgar/data/920760/000119312508255608/dex991.htm)**

- Publication date: 2008-12-18
- Source IDs: `hot-lennar-fy2008`
- Provenance note: Fiscal 2008 net loss was $1.1 billion, with falling home deliveries and prices and substantial valuation charges.

<a id="source-143"></a>**143. [Lennar: second-quarter fiscal 2012 results](https://investors.lennar.com/press-releases/2012/06-27-12-015731012)**

- Publication date: 2012-06-27
- Source IDs: `hot-lennar-q22012`
- Provenance note: New orders rose 40%; home deliveries rose 20%; homebuilding operating earnings were $55.8 million versus $21.2 million. The much larger reported net profit included a $403 million tax benefit, so the summary uses operating results.

<a id="source-144"></a>**144. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/LEN?period1=1154390400&period2=1346457600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-len`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2012-08-31. Retrieved raw payload SHA256: cd78e82511aaa2abd452cee81c1ed9bf4106a10b0e9dc89472b2b5799c7f4a53. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 00f38eba17590043db11827ae71dcbfa048c55d2 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-145"></a>**145. [KB Home: fourth-quarter and fiscal 2008 results](https://www.sec.gov/Archives/edgar/data/795266/000095013409000314/v51029exv99w1.htm)**

- Publication date: 2009-01-09
- Source IDs: `hot-kb-fy2008`
- Provenance note: Fiscal 2008 net loss was $976.1 million; revenue fell to $3.03 billion from $6.42 billion. Asset write-downs and tax valuation allowances contributed to losses.

<a id="source-146"></a>**146. [KB Home: second-quarter fiscal 2012 results](https://www.sec.gov/Archives/edgar/data/795266/000119312512288703/d372183dex991.htm)**

- Publication date: 2012-06-29
- Source IDs: `hot-kb-q22012`
- Provenance note: KB Home still recorded a $24.1 million quarterly net loss, improved from a $68.5 million loss a year earlier, despite improving revenue and margins.

<a id="source-147"></a>**147. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/KBH?period1=1154390400&period2=1346457600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-kbh`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2012-08-31. Retrieved raw payload SHA256: 119a21428a9bd53e602e385272429b36d713a8fb9314714baf9b1fb415d277f0. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 00f38eba17590043db11827ae71dcbfa048c55d2 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-148"></a>**148. [Amazon: fourth-quarter and full-year 2011 results](https://press.aboutamazon.com/2012/1/amazon-com-announces-fourth-quarter-sales-up-35-to-17-43-billion-kindle-device-sales-nearly-triple-during-the-holidays)**

- Publication date: 2012-01-31
- Source IDs: `hot-amazon-fy2011`
- Provenance note: Annual sales rose 41% to $48.08 billion while net income fell 45% to $631 million. Kindle Fire was introduced in September 2011 and Kindle holiday unit sales nearly tripled.

<a id="source-149"></a>**149. [Amazon: third-quarter 2012 results](https://press.aboutamazon.com/2012/10/amazon-com-announces-third-quarter-sales-up-27-to-13-81-billion)**

- Publication date: 2012-10-25
- Source IDs: `hot-amazon-q32012`
- Provenance note: Quarterly sales rose 27% to $13.81 billion, but Amazon lost $274 million, including a $169 million loss related to LivingSocial. Growth and investment did not produce consistently growing current profits.

<a id="source-150"></a>**150. [Citigroup: 2008 annual report](https://www.citigroup.com/rcs/citigpa/akpublic/storage/public/ar08c_en.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-citi-ar2008`
- Provenance note: Citigroup lost $27.7 billion in 2008 amid mortgage and other asset losses and received government support. Annual report is a retrospective source for 2008 events.

<a id="source-151"></a>**151. [Citigroup: 2009 annual report](https://www.citigroup.com/rcs/citigpa/akpublic/storage/public/ar09c_en.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-citi-ar2009`
- Provenance note: In 2009 Treasury preferred stock became approximately 7.7 billion common shares; Citi also issued approximately 5.4 billion shares in December. These issuances diluted existing ownership. Publication date is not inferred from the reporting year.

<a id="source-152"></a>**152. [Citigroup: 2010 annual report](https://www.citigroup.com/rcs/citigpa/storage/public/ar10c_en.pdf)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `hot-citi-ar2010`
- Provenance note: Citigroup returned to a $10.6 billion annual profit in 2010. Bank-level recovery did not restore each old share to its pre-crisis value.

<a id="source-153"></a>**153. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/C?period1=1162339200&period2=1354320000&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-c`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2012-11-30. Retrieved raw payload SHA256: 681b4a36770a9c92335873d575f28ebc2fdfe6375fcff0c9cf35da030117d6ae. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 00f38eba17590043db11827ae71dcbfa048c55d2 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-154"></a>**154. [Apple: fourth-quarter fiscal 2012 results](https://www.apple.com/newsroom/2012/10/25Apple-Reports-Fourth-Quarter-Results/)**

- Publication date: 2012-10-25
- Source IDs: `hot-apple-q42012`
- Provenance note: Quarterly revenue reached $36 billion and net profit $8.2 billion; iPhone units rose 58% to 26.9 million. The release also confirms a quarterly dividend.

<a id="source-155"></a>**155. [Apple: third-quarter fiscal 2013 results](https://www.apple.com/newsroom/2013/07/23Apple-Reports-Third-Quarter-Results/)**

- Publication date: 2013-07-23
- Source IDs: `hot-apple-q32013`
- Provenance note: Apple sold 31.2 million iPhones, a June-quarter record. Revenue was $35.3 billion but net profit fell to $6.9 billion from $8.8 billion; gross margin also fell.

<a id="source-156"></a>**156. [Microsoft: fourth-quarter and full-year fiscal 2013 results](https://news.microsoft.com/source/2013/07/18/microsoft-reports-fourth-quarter-and-full-year-results/)**

- Publication date: 2013-07-18
- Source IDs: `hot-microsoft-fy2013`
- Provenance note: Fiscal 2013 revenue was $77.85 billion and operating income $26.76 billion. Enterprise software growth contrasted with weak consumer PCs and a $900 million Surface RT inventory charge.

<a id="source-157"></a>**157. [ExxonMobil: second-quarter 2013 results](https://investor.exxonmobil.com/sec-filings/all-sec-filings/content/0000034088-13-000033/f8k2q991.htm)**

- Publication date: 2013-08-01
- Source IDs: `hot-exxon-q22013`
- Provenance note: Quarterly profit was $6.86 billion. The company bought $4 billion of shares to reduce shares outstanding. The reported 57% profit decline largely reflected prior-year divestment and tax gains, so it is not presented as a 57% operating collapse.

<a id="source-158"></a>**158. [US Treasury: final AIG common-stock sale](https://home.treasury.gov/news/press-releases/tg1796)**

- Publication date: 2012-12-11
- Source IDs: `hot-aig-treasury2012`
- Provenance note: Treasury announced the sale of its remaining AIG common shares in December 2012. Government investment returns are not treated as ordinary-share investor returns.

<a id="source-159"></a>**159. [AIG: fourth-quarter and full-year 2013 results](https://www.sec.gov/Archives/edgar/data/5272/000119312514051043/d675287dex991.htm)**

- Publication date: 2014-02-13
- Source IDs: `hot-aig-fy2013`
- Provenance note: AIG recorded 2013 net income of $9.1 billion versus $3.4 billion in 2012. The starting scenario already records a 97.7% one-year share-price decline, so its later gain is measured from a deeply depressed base.

<a id="source-160"></a>**160. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/AIG?period1=1204329600&period2=1396310400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-aig`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2014-03-31. Retrieved raw payload SHA256: a7cf5e6ba7499f0b41e1a37dc51640a209c54195826f99800b9ff7648d4f3cb4. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 00f38eba17590043db11827ae71dcbfa048c55d2 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-161"></a>**161. [Moody's: fourth-quarter and full-year 2009 results](https://ir.moodys.com/press-releases/news-details/2010/Moodys-Corporation-Reports-Results-for-Fourth-Quarter-and-Full-Year-2009/default.aspx)**

- Publication date: 2010-02-04
- Source IDs: `hot-moodys-fy2009`
- Provenance note: 2009 revenue was $1.7972 billion; the company remained profitable after the financial crisis.

<a id="source-162"></a>**162. [Moody's: fourth-quarter and full-year 2013 results](https://ir.moodys.com/press-releases/news-details/2014/Moodys-Corporation-Reports-Results-for-Fourth-Quarter-and-Full-Year-2013/default.aspx)**

- Publication date: 2014-02-07
- Source IDs: `hot-moodys-fy2013`
- Provenance note: 2013 revenue reached $2.9725 billion, up 9%. Ratings revenue and analytics revenue grew; corporate-finance ratings revenue reached $996.8 million versus $857.6 million in 2012.

<a id="source-163"></a>**163. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/MCO?period1=1204329600&period2=1396310400&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-mco`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2014-03-31. Retrieved raw payload SHA256: 2f3c5682ead8c20907c1fdc00cb3a8118f62aa4ad2791ad49c4af219141c1d41. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 00f38eba17590043db11827ae71dcbfa048c55d2 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-164"></a>**164. [Amazon: fourth-quarter and full-year 2013 results](https://www.sec.gov/Archives/edgar/data/1018724/000101872414000004/amzn-20131231xex991.htm)**

- Publication date: 2014-01-30
- Source IDs: `hot-amazon-fy2013`
- Provenance note: Annual sales rose 22% to $74.45 billion, with net income of $274 million after a 2012 loss. Prime had tens of millions of members; Kindle, Prime delivery and AWS offerings expanded.

<a id="source-165"></a>**165. [Apple: fourth-quarter fiscal 2015 results](https://www.apple.com/newsroom/2015/10/27Apple-Reports-Record-Fourth-Quarter-Results/)**

- Publication date: 2015-10-27
- Source IDs: `hot-apple-fy2015`
- Provenance note: Fiscal 2015 revenue grew 28% to nearly $234 billion; iPhone sales, expanded Apple Watch availability, and record services and Mac revenue supported results.

<a id="source-166"></a>**166. [Apple: third-quarter fiscal 2016 results](https://www.apple.com/newsroom/2016/07/apple-reports-third-quarter-results/)**

- Publication date: 2016-07-26
- Source IDs: `hot-apple-q32016`
- Provenance note: Revenue fell to $42.4 billion from $49.6 billion and net profit to $7.8 billion from $10.7 billion, while services revenue increased 19%.

<a id="source-167"></a>**167. [US Department of Justice: Bank of America mortgage settlement](https://www.justice.gov/archives/opa/pr/bank-america-pay-1665-billion-historic-justice-department-settlement-financial-fraud-leading)**

- Publication date: 2014-08-21
- Source IDs: `hot-bofa-settlement2014`
- Provenance note: Bank of America agreed to a $16.65 billion settlement over mortgage-related conduct. This includes consumer relief and is not described as entirely a cash fine.

<a id="source-168"></a>**168. [Bank of America: fourth-quarter and full-year 2015 results](https://www.sec.gov/Archives/edgar/data/70858/000007085816000118/bac-12312015ex991.htm)**

- Publication date: 2016-01-19
- Source IDs: `hot-bofa-fy2015`
- Provenance note: 2015 net income was $15.9 billion, up from $4.8 billion. Lower litigation expenses were a major contributor to improved annual results.

<a id="source-169"></a>**169. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/BAC?period1=1280620800&period2=1472688000&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-bac`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2016-08-31. Retrieved raw payload SHA256: b29c3d09bd6e62a3c302eb764e6dbdf477c2fc5e334551b8cd66fe332285690a. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 784ee7ae4a360d1ac1339e3f949871d82d455e76 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-170"></a>**170. [Microsoft: fourth-quarter fiscal 2016 results](https://www.microsoft.com/en-us/Investor/earnings/FY-2016-Q4/press-release-webcast)**

- Publication date: 2016-07-19
- Source IDs: `hot-microsoft-q42016`
- Provenance note: Office 365 commercial revenue rose 54%, Azure revenue rose 102%, and phone revenue fell 71% in the quarter. Supports the shift toward cloud services and subscriptions despite phone setbacks.

<a id="source-171"></a>**171. [Apple: first-quarter fiscal 2017 results](https://www.apple.com/newsroom/2017/01/apple-reports-record-first-quarter-results/)**

- Publication date: 2017-01-31
- Source IDs: `hot-apple-q12017`
- Provenance note: Holiday-quarter revenue reached a record $78.4 billion, with records for iPhone, services, Mac and Apple Watch. Apple had returned over $200 billion to shareholders since August 2012.

<a id="source-172"></a>**172. [Amazon: fourth-quarter and full-year 2016 results](https://ir.aboutamazon.com/news-release/news-release-details/2017/Amazoncom-Announces-Fourth-Quarter-Sales-up-22-to-437-Billion/default.aspx)**

- Publication date: 2017-02-02
- Source IDs: `hot-amazon-fy2016`
- Provenance note: Annual sales reached $135.99 billion and net income $2.371 billion. AWS sales were $12.219 billion and segment operating income was $3.108 billion; Prime also expanded.

<a id="source-173"></a>**173. [ExxonMobil: full-year 2016 results](https://investor.exxonmobil.com/sec-filings/all-sec-filings/content/0000034088-17-000014/f8k4q991.htm)**

- Publication date: 2017-01-31
- Source IDs: `hot-exxon-fy2016`
- Provenance note: 2016 profit was $7.8 billion versus $16.2 billion in 2015, including a roughly $2 billion write-down mainly of US dry-gas assets. Lower commodity prices and refining margins reduced earnings; dividends continued.

<a id="source-174"></a>**174. [Hasbro: fourth-quarter and full-year 2017 results](https://investor.hasbro.com/news-releases/news-release-details/hasbro-reports-full-year-and-fourth-quarter-2017-financial)**

- Publication date: 2018-02-07
- Source IDs: `hot-hasbro-fy2017`
- Provenance note: Annual revenue reached $5.21 billion, up 4%. Franchise brands grew 10%, with Transformers, Nerf, Monopoly and My Little Pony contributing; total gaming revenue rose 8%.

<a id="source-175"></a>**175. [Hasbro: first-quarter 2018 results](https://corp.hasbro.com/news-releases/news-release-details/hasbro-reports-first-quarter-2018-financial-results)**

- Publication date: 2018-04-23
- Source IDs: `hot-hasbro-q12018`
- Provenance note: Revenue fell 16% and net loss was $112.5 million, including Toys R Us-related charges as well as tax and severance charges. Toys R Us liquidation and lower European inventory purchases hurt the quarter.

<a id="source-176"></a>**176. [Tesla: fourth-quarter and full-year 2017 update](https://digitalassets.tesla.com/tesla-contents/image/upload/IR/TSLA_Update_Letter_2017-4Q)**

- Publication date: 2018-02-07
- Source IDs: `hot-tesla-fy2017`
- Provenance note: 2017 revenue was $11.76 billion; deliveries exceeded 100,000. Model 3 production had begun but battery-production bottlenecks slowed its ramp. Net loss attributable to common shareholders was $1.96 billion.

<a id="source-177"></a>**177. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/TSLA?period1=1335830400&period2=1527811200&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-tsla`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2018-05-31. Retrieved raw payload SHA256: 9a19ac6da497b346c28e11bc84d5742f9802c856f948f0dd48fb4300c346c6c9. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 784ee7ae4a360d1ac1339e3f949871d82d455e76 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-178"></a>**178. [Apple: second-quarter fiscal 2018 results](https://www.apple.com/newsroom/2018/05/apple-reports-second-quarter-results/)**

- Publication date: 2018-05-01
- Source IDs: `hot-apple-q22018`
- Provenance note: Revenue rose 16% to $61.1 billion and EPS rose 30%; iPhone X was the best-selling iPhone every week in the quarter. Services and wearables grew; Apple authorized an additional $100 billion in repurchases.

<a id="source-179"></a>**179. [Disney: December 2020 investor-day streaming update](https://thewaltdisneycompany.com/press-releases/the-walt-disney-company-surpasses-137m-paid-subscriptions-across-its-direct-to-consumer-services-shattering-previous-guidance-increases-paid-subscriptions-target-to-300-350m-by-2024/)**

- Publication date: 2020-12-10
- Source IDs: `hot-disney-streaming2020`
- Provenance note: Disney+ reached 86.8 million paid subscriptions by December 2, 2020. The 137 million headline counts multiple streaming services, not Disney+ alone.

<a id="source-180"></a>**180. [Disney: fourth-quarter and full-year fiscal 2020 earnings](https://thewaltdisneycompany.com/app/uploads/2020/11/q4-fy20-earnings.pdf)**

- Publication date: 2020-11-12
- Source IDs: `hot-disney-fy2020`
- Provenance note: Documents pandemic closures of theme parks, disruption to theaters and cruises, and fiscal 2020 losses.

<a id="source-181"></a>**181. [Boeing: record 2018 results](https://investors.boeing.com/investors/news/press-release-details/2019/Boeing-Reports-Record-2018-Results-and-Provides-2019-Guidance/default.aspx)**

- Publication date: 2019-01-30
- Source IDs: `hot-boeing-fy2018`
- Provenance note: 2018 revenue reached a record $101.1 billion, with 806 commercial-airplane deliveries and net income of approximately $10.5 billion.

<a id="source-182"></a>**182. [Boeing: fourth-quarter and full-year 2020 results](https://investors.boeing.com/investors/news/press-release-details/2021/Boeing-Reports-Fourth-Quarter-Results/default.aspx)**

- Publication date: 2021-01-27
- Source IDs: `hot-boeing-fy2020`
- Provenance note: The 737 MAX grounding and pandemic hurt results. Revenue fell to $58.2 billion and the annual net loss reached $11.9 billion, including a $6.5 billion 777X charge. MAX deliveries resumed in late 2020.

<a id="source-183"></a>**183. [Tesla: fourth-quarter and full-year 2020 update](https://digitalassets.tesla.com/tesla-contents/image/upload/IR/TSLA-Q4-2020-Update)**

- Publication date: 2021-01-27
- Source IDs: `hot-tesla-fy2020`
- Provenance note: Tesla delivered roughly 500,000 vehicles in 2020 and earned $721 million attributable to common shareholders, its first full-year GAAP profit. Regulatory-credit revenue was $1.58 billion. Model Y deliveries began in 2020, while Model 3 and Shanghai production expanded.

<a id="source-184"></a>**184. [Apple: first-quarter fiscal 2021 results](https://www.apple.com/newsroom/2021/01/apple-reports-first-quarter-results/)**

- Publication date: 2021-01-27
- Source IDs: `hot-apple-q12021`
- Provenance note: Holiday-quarter revenue reached $111.4 billion, up 21%, and EPS grew 35%; iPhone, wearables and services posted records.

<a id="source-185"></a>**185. [Microsoft: second-quarter fiscal 2021 results](https://www.microsoft.com/en-us/Investor/earnings/FY-2021-Q2/press-release-webcast)**

- Publication date: 2021-01-26
- Source IDs: `hot-microsoft-q22021`
- Provenance note: Revenue rose 17% to $43.1 billion and net income rose 33% to $15.5 billion. Azure revenue grew 50%; Office 365 commercial revenue grew 21%.

<a id="source-186"></a>**186. [ExxonMobil: fourth-quarter and full-year 2020 results](https://www.sec.gov/Archives/edgar/data/34088/000003408821000004/f8k4q991.htm)**

- Publication date: 2021-02-02
- Source IDs: `hot-exxon-fy2020`
- Provenance note: 2020 net loss was $22.44 billion, including major noncash write-downs. Pandemic conditions hurt fuel demand, commodity prices and refining results; spending was cut and dividends continued.

<a id="source-187"></a>**187. [Nintendo: fiscal year ended March 2021 results](https://www.nintendo.co.jp/ir/pdf/2021/210506e.pdf)**

- Publication date: 2021-05-06
- Source IDs: `hot-nintendo-fy2021`
- Provenance note: Nintendo sold 28.83 million Switch consoles, up 37.1%, during the year ended March 2021. Animal Crossing: New Horizons was a major seller; operating profit rose 81.8%.

<a id="source-188"></a>**188. [Nintendo: six months ended September 2023 results](https://www.nintendo.co.jp/ir/pdf/2023/231107e.pdf)**

- Publication date: 2023-11-07
- Source IDs: `hot-nintendo-sep2023`
- Provenance note: The Legend of Zelda: Tears of the Kingdom, released in May, sold 19.5 million units. The Super Mario Bros. Movie also increased income from Nintendo characters.

<a id="source-189"></a>**189. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/NTDOY?period1=1512086400&period2=1704067200&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-ntdoy`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2023-12-29. Retrieved raw payload SHA256: c533f1a2bdc12ca872565156467cb914a959f9586a4676634e5809f6a62f7b84. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 5d8533a35a8c13fb45f4bf756a555f47daabb400 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

<a id="source-190"></a>**190. [Apple: fourth-quarter fiscal 2023 results](https://www.apple.com/newsroom/2023/11/apple-reports-fourth-quarter-results/)**

- Publication date: 2023-11-02
- Source IDs: `hot-apple-q42023`
- Provenance note: September-quarter revenue fell 1% to $89.5 billion while EPS rose 13%. Services reached an all-time revenue record; Apple returned nearly $25 billion to shareholders in the quarter.

<a id="source-191"></a>**191. [Microsoft: fourth-quarter and full-year fiscal 2023 results](https://www.microsoft.com/en-us/investor/earnings/fy-2023-q4/press-release-webcast)**

- Publication date: 2023-07-25
- Source IDs: `hot-microsoft-fy2023`
- Provenance note: Fiscal-year revenue was $211.9 billion. Azure and Office cloud services supported growth; the June quarter saw Azure and other cloud revenue grow 26% despite weaker PC demand. The release discusses the new AI platform shift.

<a id="source-192"></a>**192. [Boeing: fourth-quarter and full-year 2024 results](https://investors.boeing.com/investors/news/press-release-details/2025/Boeing-Reports-Fourth-Quarter-Results/default.aspx)**

- Publication date: 2025-01-28
- Source IDs: `hot-boeing-fy2024`
- Provenance note: 2024 revenue fell 14% to $66.5 billion, with 348 commercial-airplane deliveries and an $11.8 billion annual net loss. The IAM strike, commercial-airplane charges and defense-program losses weighed on results.

<a id="source-193"></a>**193. [Tesla: fourth-quarter and full-year 2024 update](https://www.sec.gov/Archives/edgar/data/1318605/000162828025002993/exhibit991.htm)**

- Publication date: 2025-01-29
- Source IDs: `hot-tesla-fy2024`
- Provenance note: Deliveries rose from about 500,000 in 2020 to 1.789 million in 2024, but fell 1% from 2023. Annual operating income fell 20% to $7.076 billion. Energy-storage deployments more than doubled. Forward-looking robotaxi plans are treated as hopes, not delivered results.

<a id="source-194"></a>**194. [Disney: fourth-quarter and full-year fiscal 2024 earnings](https://thewaltdisneycompany.com/press-releases/the-walt-disney-company-reports-fourth-quarter-and-full-year-earnings-for-fiscal-2024/)**

- Publication date: 2024-11-14
- Source IDs: `hot-disney-fy2024`
- Provenance note: Entertainment streaming earned $143 million for the year versus a $2.496 billion loss in 2023. Linear-network revenue fell 9%. Inside Out 2 and Deadpool & Wolverine boosted film results; parks generated record full-year revenue and operating income.

<a id="source-195"></a>**195. [Amazon: second-quarter 2020 results](https://ir.aboutamazon.com/news-release/news-release-details/2020/Amazon.com-Announces-Second-Quarter-Results/)**

- Publication date: 2020-07-30
- Source IDs: `hot-amazon-q22020`
- Provenance note: Quarterly sales rose 40% to $88.9 billion during the pandemic, despite over $4 billion in COVID-related costs.

<a id="source-196"></a>**196. [Amazon: fourth-quarter and full-year 2024 results](https://ir.aboutamazon.com/news-release/news-release-details/2025/Amazon-com-Announces-Fourth-Quarter-Results/default.aspx)**

- Publication date: 2025-02-06
- Source IDs: `hot-amazon-fy2024`
- Provenance note: Annual sales reached $638 billion; net income rose to $59.2 billion from $30.4 billion. AWS operating income reached $39.8 billion; the release highlights faster delivery and fulfillment efficiencies.

<a id="source-197"></a>**197. [Netflix launches its advertising-supported plan](https://about.netflix.com/news/our-newest-plan-now-available-us)**

- Publication date: 2022-11-03
- Source IDs: `hot-netflix-ads2022`
- Provenance note: Netflix launched its lower-priced advertising-supported plan in November 2022.

<a id="source-198"></a>**198. [Netflix: US account-sharing update](https://about.netflix.com/news/update-on-sharing-may-us)**

- Publication date: 2023-05-23
- Source IDs: `hot-netflix-sharing2023`
- Provenance note: US members sharing outside their household could add a paid extra member; the policy expanded paid sharing in May 2023.

<a id="source-199"></a>**199. [Netflix: fourth-quarter 2024 shareholder letter](https://www.sec.gov/Archives/edgar/data/1065280/000106528025000033/ex991_q424.htm)**

- Publication date: 2025-01-21
- Source IDs: `hot-netflix-fy2024`
- Provenance note: Netflix ended 2024 with 301.63 million paid memberships. Annual revenue rose 16% to $39 billion and operating income exceeded $10 billion, supporting an earnings-based explanation of its recovery and growth.

<a id="source-200"></a>**200. [Yahoo Finance daily adjusted close, current chart snapshot](https://query1.finance.yahoo.com/v8/finance/chart/NFLX?period1=1551398400&period2=1743465600&interval=1d&events=div%2Csplits&includeAdjustedClose=true)**

- Publication date: unknown (publication_date is null in provenance)
- Source IDs: `yahoo-nflx`
- Provenance note: Current retrospective Yahoo snapshot used for outcomes, retrieved 2026-10-06. Original publication and archive revision dates are unknown (publication_date is null); retrieval does not establish a contemporary vintage. Daily observations run through 2025-03-31. Retrieved raw payload SHA256: c9ad027412c64f8964d2bf00a6c5f9c239ee117ca772d761ef02d0859a8a0958. Endpoint is unversioned; the committed normalized monthly endpoints allow offline rebuilding. Last valid daily adjusted-close observation each month; adjacent ratio minus one. Vendor adjustments include dividends and splits; no second dividend addition. Starting choices and input lock committed at 5d8533a35a8c13fb45f4bf756a555f47daabb400 before this outcome request. Current retrospective snapshot, not a point-in-time vendor database.

## Scope and review notes

- The proposed summaries are a reveal-only content change; the selected hot stocks, their starting descriptions, decision context, and committed monthly-return observations remain as they were in the base scenario data.
- Each card displays the existing five-year total return compounded from its 60 monthly observations. Business-source and return-series references are shown separately so reviewers can distinguish company-history context from the source used for the share-return series.
- Source publication dates recorded as `null` are reported as unknown. Retrieval dates are not substituted for publication dates.
- The editorial review checked age-appropriate clarity, support in the cited sources, and event timing. It distinguished annual results from quarterly results and product announcements from actual availability. For example, the September 2001 Apple endpoint excludes the later iPod launch, and the January 2005 Amazon endpoint excludes the later Prime launch.

## Implementation and validation

The result cards now read `future_outcomes.hot_stock_outcomes`, keyed by each stock’s `asset_id`. Each outcome has `text` and `source_ids`. Schema and cross-file validation require exactly three entries, with each selected stock represented once. The reveal renders these summaries after the animation finishes. The pre-investment `DecisionContext` and its starting descriptions are unchanged.

| Check                                                   | Result                                                                                                                                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                                         | Passed: formatting, generated schemas, deterministic data rebuild checks, scenario validation, 193 tests in 19 files, type checking, and production build.                         |
| `npm run test:browser`                                  | Passed: 160 desktop/mobile browser checks, including all 50 historical scenario flows.                                                                                             |
| `npm run test:browser:production`                       | Passed: 46 desktop/mobile session checks against the production preview.                                                                                                           |
| Starting-information comparison against the base commit | All 51 starting bundles, including the fictional fixture, are byte-identical.                                                                                                      |
| Outcome-data comparison against the base commit         | Every monthly-return series, return-source mapping, and pre-existing outcome field is unchanged in all 51 bundles.                                                                 |
| New regression coverage                                 | Missing, wrong, or duplicate stock IDs are rejected; cards match summaries by asset ID even if their array order changes; browser checks verify the new text on each stock’s card. |
| Report-to-data correspondence                           | All 150 proposed summaries are copied exactly from the authored JSON, with linked business evidence and the existing return-series sources.                                        |

Browser checks used Chrome for Testing 153.0.8010.12, matching the installed Playwright browser revision, through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. These checks establish software behavior and data integrity; the company-event explanations remain evidence-based editorial context, rather than a calculation of how much each event caused a share price to move.
