# TASK-029: Define Full Product Runtime Boundary

Convert the report finding that ThinkIO is still a local scaffold into a future product-boundary task.

Source report: `audit/current-state-report-2026-06-30.md`.

## Risk

Low for the current kernel, high if started too early. Keep this as `idea` until the write orchestration path is safe.

## Subtasks

- Define what belongs in a full runtime versus the current local scaffold.
- Decide whether VS Code extension packaging is in scope.
- Decide whether a persistent daemon, UI command palette, external API integration, or autonomous replay belong in the first product runtime.
- Update architecture or roadmap notes once the boundary is clear.

## Required Evidence

- `missing-work-task-created`
- `product-runtime-boundary-defined`
- `runtime-roadmap-note-added`
