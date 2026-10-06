# Historical sessions

The next milestone after the 50-scenario expansion makes the normal app use the historical library. The existing allocation, reveal, five-round checkpoints and final scorecard remain the game loop.

- Choose 5, 10, 15 or 20 rounds (default 10), limited by the unseen pool.
- Build a unique, seeded queue before the first round. Existing cohort-balancing rules apply; labels remain hidden until the final scorecard.
- Save the committed allocation and prediction before requesting the static outcome module. A refresh during loading restores the same locked decision. Failed module loads have a retry action that reloads the document if the decision is safely saved.
- Save completed sessions once and offer their scorecards from the start screen. New sessions exclude previously completed dates, including when a longer session ended at a checkpoint.
- Keep fictional demo storage separate. The fictional demo is now development-only at `?demo=1`; historical single-date previews remain development-only at `?scenario=YYYY-MM`.
- No accounts, server, runtime financial API, new dependencies or deployment.

The first slice retains the existing 5/10/15/20 lengths. Longer sessions, replaying completed scenarios and a richer lifetime-history view remain later improvements. Once the pool is exhausted, previous scorecards remain accessible without silently recycling dates into first-time statistics. Storage is local to one browser; private browsing, cleared storage or another device do not carry progress. Concurrent-tab synchronization is not implemented.

## Verification

Local aggregate checks passed with 167 unit/render/data tests before publication. New browser journeys cover five distinct real scenarios, refresh during decision and reveal, final archive deduplication, unseen queues, early ending, reopening scorecards, failed outcome loading with locked refresh/retry, invalid storage and responsive overflow. Existing fictional journeys remain on their explicit development route. CI browser results are recorded in the PR after execution; local browser execution remains unavailable under the previously verified socket restriction.
