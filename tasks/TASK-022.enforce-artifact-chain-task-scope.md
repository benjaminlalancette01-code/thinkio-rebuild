# TASK-022: Enforce Artifact Chain Task Scope

Resolve the audit finding that artifact chain validation does not enforce manifest task scope.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Require manifest artifacts to belong to `manifest.taskId`.
- Require the root artifact to appear in `manifest.artifactIds`.
- Decide whether cross-task dependency links need explicit modeling.
- Add focused validation tests.

## Required Evidence

- `candidate-note-created`
- `artifact-chain-task-scope-enforced`
- `artifact-chain-scope-test-pass`
