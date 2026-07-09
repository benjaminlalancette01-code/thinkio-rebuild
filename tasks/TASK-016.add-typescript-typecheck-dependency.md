# TASK-016: Add TypeScript Typecheck Dependency

Resolve the high-priority audit finding that strict TypeScript validation is configured but the project does not depend on the TypeScript compiler.

Source audit: `audit/runtime-kernel-dependency-audit-2026-06-28.md`.

## Subtasks

- Add the real `typescript` dev dependency.
- Add a `typecheck` script that runs `tsc --noEmit`.
- Include typecheck in the standard check path if it passes.
- Preserve the existing Node strip-types test path.

## Required Evidence

- `candidate-note-created`
- `typescript-dependency-added`
- `typecheck-script-pass`
