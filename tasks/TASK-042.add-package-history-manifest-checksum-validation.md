# TASK-042: Add Package/History Manifest And Checksum Validation

Add package and history integrity checks for versioned local runtime state.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium-high. Version/history trust requires more than file presence.

## Subtasks

- Define package/history manifest records.
- Add checksum or hash fields for tracked artifacts.
- Validate stale, missing, or mismatched manifest entries.
- Connect manifest validation to readiness and closeout.
- Add tests for pass, stale, and mismatch cases.

## Required Evidence

- `package-history-manifest-model-defined`
- `checksum-validation-added`
- `manifest-staleness-blockers-added`
- `manifest-validation-tests-pass`
