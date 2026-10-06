# Six-scenario implementation review

Comparison: merged PR #2, `0dda89f5d5ec2b195f568dddf0c078a1fa1304ea`, through this milestone. The user’s six-scenario milestone request is the spec source; repository specification, implementation plan, README and historical methodology supply context. Separate Standards and Spec agents reviewed the implementation. The final production audit revision was also inspected and tested after those findings.

## Standards

No documented-standard violations were identified. At the original October 5 review, no applicable AGENTS.md, CODING_STANDARDS.md or CONTRIBUTING.md was present; formatting, TypeScript and repository validation are enforced by the required check.

One maintenance judgement remains: **possible Repeated Switches / Shotgun Surgery**. The preserved September 1999 layout has special handling in the historical builder, outcome builder and collection normalization. A future collection layout descriptor could gather these differences. Keeping the original pilot’s files and hashes intact justifies the limited exceptions in this milestone; this is a heuristic, not a failed requirement.

The separately versioned production selector intentionally retains the frozen pilot algorithm’s initial draw logic while sharing its protocol validation, eligible universe and PRNG helpers. Altering the hash-pinned v1 runner would invalidate the historical selection evidence.

## Spec

Two findings were resolved:

- **Exhaustion audit:** v1 threw on pool exhaustion before saving attempted draws. A separate preregistered v2 production runner now persists `status: failed`, the exhausted slot, all draws and withdrawal evidence, partial selections and input hashes before the CLI returns a nonzero exit code. Synthetic tests cover both initial and replacement exhaustion; no expanded production draw was executed.
- **Replacement ordering:** the original prose implied completion of each exclusion chain before moving to the next slot, while v1 rescans acceptances after appending replacements. The methodology now describes the frozen v1 order accurately. V2 explicitly finishes each original slot’s exclusion chain before the next slot.

No remaining material spec gaps were identified. Six scenarios, chronological selection/starting locks, seven aligned 60-month paths, registry/preview integration, five-distinct queue generation and commitment boundaries are covered by checks. Contemporary-source availability, vendor-adjusted return approximations, incomplete independent dividend reconciliation and editorial concentration remain documented qualifications rather than fabricated evidence.

Standards: zero hard violations, one maintenance judgement. Spec: two resolved findings, zero outstanding material findings. October 5 verification: 113 unit/rendering tests and 20 browser tests passed; desktop/mobile screenshots were manually reviewed.

## October 6 scope realignment

Main now includes [AGENTS.md](../AGENTS.md) and the ages 8–12 materiality guidance in the product documents. The [latest lead comment](https://github.com/racker15/simple-long-term-investing-game/pull/3#issuecomment-6003563669) supersedes source-hardening work: existing research and audits remain historical evidence, publisher URLs are optional provenance references, and source variety is desirable without a quota. This realignment preserves all six dates, locks and the future-information firewall. October 6 verification passed `npm run check` with all 113 unit/rendering tests and `npm run test:browser` with all 20 desktop/mobile tests. Separate Standards and Spec agents reviewed the guidance/documentation realignment against published head `87d83a6`; final findings are recorded below.

### Standards

No documented-standard violations or meaningful heuristic findings were identified in the documentation realignment. The changes follow AGENTS.md's materiality guidance, static runtime requirement and preference for source variety without a quota. Detailed pilot evidence is retained as completed research, rather than a requirement to build more infrastructure. The fresh verification claims were confirmed against the completed check/browser logs.

### Spec

No missing requirements, scope creep or incorrect behavior were identified in the realignment. The updated specification prioritizes player-visible correctness, reasonable approximations and prevention of hindsight leakage. Research-stage notes now distinguish former pending items from completed qualification, and publisher availability is correctly described as a provenance consideration. The changes from `87d83a6` affect documentation only; scenario data, selections, locks and runtime behavior are unchanged.

Realignment findings: Standards zero; Spec zero. The original implementation's maintenance judgement above remains historical context.
