# TASK-032: Add Mode Policy Engine And Review-Before-Lock Gate

Convert ThinkIO modes from labels into enforceable runtime policy.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

High. Brainstorm, plan, build, review, freeze, and execute should not allow the same actions.

## Subtasks

- Define allowed actions, validation strictness, and ingestion behavior per mode.
- Add mode transition rules.
- Add review-before-lock behavior for promotion into frozen or executable work.
- Ensure exploratory output lands as idea, deferred, or proposal state, not canonical truth.
- Add tests for mode-specific blockers and allowed actions.

## Required Evidence

- `mode-policy-model-defined`
- `review-before-lock-gate-added`
- `mode-action-policy-tests-pass`
- `mode-policy-surface-documented`
