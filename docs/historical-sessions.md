# Historical sessions

The next milestone after the 50-scenario expansion makes the normal app use the historical library. The existing allocation, reveal, five-round checkpoints and final scorecard remain the game loop.

- Choose any multiple of five from 5 to 50 rounds (default 10), limited by the unseen pool.
- Build a unique, seeded queue before the first round. Existing cohort-balancing rules apply; labels remain hidden until the final scorecard.
- Save the committed allocation and prediction before requesting the static outcome module. A refresh during loading restores the same locked decision. Failed module loads have a retry action that reloads the document if the decision is safely saved.
- Save completed sessions once and offer their scorecards from the start screen. New sessions exclude previously completed dates, including when a longer session ended at a checkpoint.
- Keep fictional demo storage separate. The fictional demo is now development-only at `?demo=1`; historical single-date previews remain development-only at `?scenario=YYYY-MM`.
- No accounts, server, runtime financial API, new dependencies or deployment.

Completed dates can be replayed in a separate practice view. Practice choices and the open practice date survive refresh when storage is available; they never write to first-time session history. A secondary learning-history panel summarizes first-time allocations, predictions, concentration, drawdowns and leader changes without a benchmark-beating grade. Once the pool is exhausted, previous scorecards remain accessible without silently recycling dates into first-time statistics. Storage is local to one browser; private browsing, cleared storage or another device do not carry progress. Concurrent-tab synchronization is not implemented.

## Verification

The initial slice passed 167 unit/render/data tests and 122 desktop/mobile browser checks. Follow-on coverage extends queues and saved sessions through 50 rounds and runs the session journeys against the built production app as well as the development server. New browser journeys cover five distinct real scenarios, refresh during decision and reveal, final archive deduplication, unseen queues, early ending, reopening scorecards, failed outcome loading with locked refresh/retry, invalid storage and responsive overflow. Existing fictional journeys remain on their explicit development route. CI browser results are recorded in the PR after execution; local browser execution remains unavailable under the previously verified socket restriction.

## Staged replay

The October 6 owner update adds mandatory pauses at months 12 and 36. Chart legends show values and cumulative returns so far; a click resumes toward year three or five. Reduced-motion playback preserves the pauses. Animation skipping reaches only the current checkpoint. Scales and monthly rows do not expose later values, and the full result/reflection remains hidden until month 60. Refresh restores the locked decision and restarts its staged reveal from the first checkpoint.

At head 80685a4, full checks passed with 175 unit/render/data tests, 126 development browser checks and 12 built-app browser checks. Retained production screenshots were reviewed on desktop and mobile, including the new pauses. These are screenshot-based visual checks rather than interactive local-browser QA.
