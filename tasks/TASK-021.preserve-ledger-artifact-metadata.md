# TASK-021: Preserve Ledger Artifact Metadata

Resolve the audit finding that `createArtifactRecord` drops optional `hash` and `dependsOn` metadata.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Preserve `hash` in created artifact records.
- Preserve `dependsOn` with defensive array copying.
- Add tests proving artifact-chain metadata survives helper creation.

## Required Evidence

- `candidate-note-created`
- `ledger-metadata-preserved`
- `ledger-metadata-test-pass`
