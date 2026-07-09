# TASK-019: Extend CUE Validation To Runtime State Schemas

Resolve the audit finding that `npm run validate:cue` validates governed task JSON only.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Add validation targets for non-task schemas and state files.
- Preserve task JSON discovery behavior.
- Include the expanded target set in the workspace validation path.
- Add tests for discovered and explicit non-task CUE targets.

## Required Evidence

- `candidate-note-created`
- `non-task-cue-targets-added`
- `workspace-schema-validation-test-pass`
