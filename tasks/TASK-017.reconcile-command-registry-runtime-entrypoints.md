# TASK-017: Reconcile Command Registry Runtime Entrypoints

Resolve the audit finding that the command registry allow-lists actions that have no callable runtime entrypoint.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Decide whether each command-registry action is implemented or reserved.
- Add explicit runtime entrypoints or separate reserved actions from implemented actions.
- Add tests that prove registry claims match runtime behavior.

## Required Evidence

- `candidate-note-created`
- `command-registry-runtime-map-added`
- `command-registry-test-pass`
