# Implementation status — October 6, 2026

The owner-expanded 50-scenario implementation is on main through PR15. This is an implementation and test status, not a deployment receipt.

## Implemented game flow

| Plan area                       | Current behavior                                                                                                                                           | Main evidence                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Historical library              | 50 unique dates, 25 important and 25 preregistered random; all have starting context, seven choices and 60 monthly outcomes                                | [Expansion](expansion-progress.md), [editorial review](expansion-editorial-review.md), PR11 |
| Session setup                   | Multiples of five from 5–50, default ten, bounded by unseen dates; seeded unique queues and hidden cohort labels                                           | `queue.ts`, `App.tsx`, real-library queue tests, PR13                                       |
| Allocation and prediction       | $10,000 in $500 steps; cash remainder; one prediction; explicit confirmation                                                                               | `Allocation.tsx`, `portfolio.ts`, browser allocation tests                                  |
| Five-year path                  | Required year-one and year-three pauses with returns so far; click to continue; final year-five result                                                     | `PathChart.tsx`, staged replay browser tests, PR13                                          |
| Information separation          | Starting projection excludes future/cohort fields; outcome fetch follows commitment; later chart values and final reflection stay hidden until their stage | Firewall tests, whole-library browser tests                                                 |
| Reflection and comparison       | Full path, individual-stock outcomes, prediction rank, historical events, short narratives and four reflection sections                                    | `Reveal.tsx`, all 50 scenario checks                                                        |
| Checkpoints and final scorecard | Five-round blocks, early ending at checkpoints, final overall and block summaries, qualified cohort comparisons; no grade or leaderboard                   | `scorecards.ts`, session tests, PR13                                                        |
| History and practice            | Local saved sessions, first-time learning history, separate practice; completed dates excluded from new first-time queues                                  | [Historical sessions](historical-sessions.md), PR13                                         |
| Recovery                        | Locked commitment and failed-load retry; unfinished edits survive refresh; drafts retained if commitment storage fails                                     | [Unfinished choices](unfinished-choices.md), PR14                                           |
| Keyboard and readability        | Screen/pause focus ordering, direct continuation, readable chart labels and negative-return cues                                                           | [Keyboard navigation](keyboard-navigation.md), PR12/PR15                                    |

## Verification

The final PR15 head `30483e94fa5450ed54a17fba21d7dd6f7c25f2b4` passed [CI 37469126634](https://github.com/racker15/simple-long-term-investing-game/actions/runs/37469126634): 185 unit/render/data tests, 134 desktop/mobile development browser checks and 20 built-production browser checks. Aggregate checks include formatting, schema freshness, deterministic data rebuilding, validation, TypeScript and production build.

Browser coverage includes recovery into the final round of a 50-round session, the final block scorecard, archive persistence and exhaustion of the unseen pool. This seeds a saved state produced by the normal session/math functions; it is not a claim that a human manually played 50 rounds.

Retained production screenshots were inspected for representative desktop/mobile start, history, decision/result and year-one/year-three pause views. Local interactive browser execution was blocked by socket restrictions. No comprehensive screen-reader certification or cross-browser qualification is claimed.

PR14 and PR15 each received an owner-requested independent review. The parent fixed the identified persistence/focus issues and the same reviewer cleared each final head before merge.

## Release limits and next decisions

- No website deployment has been performed. A static host can serve `dist/`; destination and deployment approval are still needed.
- Saves are local to the browser. Cross-device sync and concurrent-tab editing are not implemented, and there are no accounts.
- Historical returns use disclosed public-data approximations. Overlapping windows and repeated companies are not independent evidence of investing skill.
- The current core implementation-plan flow is present. Prefer real play feedback and bounded fixes over adding accounts, live prices, extra research infrastructure or unrelated features.
