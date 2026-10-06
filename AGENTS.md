# AGENTS.md

## Subagent usage

- Use **GPT6-Luna-Max** subagents whenever a task is not very challenging. This includes data retrieval, probes, straightforward integration work, simple code changes, and other small objectives.
- Reserve stronger models for work that is genuinely difficult, ambiguous, high-risk, or architecture-heavy.
- When delegating, give the subagent a complete objective, relevant constraints, and ask it to respond when the task is complete.
- Do **not** poll a subagent more frequently than once every 5 minutes. Prefer waiting for the subagent's completion response instead of repeatedly checking status.

## Product scope and engineering posture

- The product is a **simple educational investing game for roughly ages 8–12**, not a financial research product, investment backtester, or authoritative “finance truth” system.
- Prioritize **clarity, fun, historical plausibility, and materially correct outcomes** over exhaustive provenance, forensic reconstruction, or precision that a player will not perceive.
- Use reasonable, transparent approximations when they preserve the educational experience. Do not chase institutional-grade precision unless a simpler approximation would materially change the player-facing result.
- Before adding a check, audit, source-retrieval layer, versioned protocol, or other infrastructure, ask: **Does this materially improve gameplay, prevent a real correctness problem, or prevent hindsight leakage?** If not, do not build it.
- Do not spend substantial effort on multi-source corroboration for every fact, continuously re-checking old URLs, archive/body hashes, parts-per-million vendor reconciliation, transaction-level dividend reconstruction, or exhaustive corporate-action forensics unless an actual error or ambiguous outcome requires it.
- Keep the runtime game **fully static**. Player-facing headlines, summaries, values, and outcomes are stored with the app. External publisher URLs are research/provenance references only; the live game must not depend on them remaining reachable.
- **News-source variety is desirable.** Prefer multiple source families when this is easy and helps avoid presenting one publication’s editorial lens as the whole information environment. It is not a hard quota or release blocker, and agents should not replace stronger contemporary stories or burn substantial effort solely to increase outlet count.
- Random-date selection should remain deterministic and future-neutral, but keep the mechanism simple: define the eligible universe, use a fixed seed, record the selected dates, and reject only genuine operational/data failures.
- Testing should concentrate on player-visible behavior and core invariants: no future leakage, valid allocations, seven choices, 60 monthly outcomes, sane return math, working sessions/scorecards, and usable responsive UI.
- When historical precision and simplicity conflict, prefer the **simplest approach that is unlikely to materially mislead an 8–12-year-old player about the scenario**.
- Write player-facing scenario narratives and reflections for ages 8–12 with common words, short sentences, and concrete events; keep research and return-method details in provenance or developer docs.
