# AGENTS.md

## Subagent usage

- Use **GPT6-Luna-Max** subagents whenever a task is not very challenging. This includes data retrieval, probes, straightforward integration work, simple code changes, and other small objectives.
- Reserve stronger models for work that is genuinely difficult, ambiguous, high-risk, or architecture-heavy.
- When delegating, give the subagent a complete objective, relevant constraints, and ask it to respond when the task is complete.
- Do **not** poll a subagent more frequently than once every 5 minutes. Prefer waiting for the subagent's completion response instead of repeatedly checking status.
