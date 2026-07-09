# TASK-033: Add Runtime Readiness/Startup Validation Proof

Replace old reentry prompt proof with local workspace readiness validation.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. The runtime should not act until it knows which project state, board state, and validation state are safe.

## Subtasks

- Define a `RuntimeReadinessProof` or equivalent startup validation record.
- Validate required state files, schema health, board invariants, unfinished transactions, and open branches.
- Produce clear blockers for stale, missing, or contradictory state.
- Expose readiness output through the local runtime.
- Add tests for pass and fail readiness cases.

## Required Evidence

- `runtime-readiness-proof-model-defined`
- `startup-validation-checks-added`
- `readiness-blocker-output-added`
- `readiness-tests-pass`
