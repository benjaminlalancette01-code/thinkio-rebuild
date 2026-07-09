# TASK-058: Validate Plugin Self-Contained View Bundle

Validate that the ThinkIO VS Code plugin provides Kanban, artifact mind-map, and interactive node diagram views without relying on other plugins.

## Risk

High. Depending on external plugins would make ThinkIO incomplete as a governed product shell.

## Subtasks

- Define packaging rules for bundled view assets.
- Add a dependency check that blocks runtime dependency on external Kanban, mind-map, or node-diagram VS Code plugins.
- Allow ordinary library dependencies only if they are packaged with ThinkIO or declared as normal extension dependencies.
- Add smoke validation for all three native views.
- Document acceptable inspiration versus prohibited runtime dependency.

## ThinkIO Alignment

- ThinkIO owns its MVP user surfaces.
- External plugins are not required to inspect task, artifact, or runtime diagrams.
- Views remain governed projections of ThinkIO runtime state.

## Required Evidence

- `plugin-view-bundle-self-contained`
- `external-plugin-dependency-check-added`
- `view-assets-packaging-plan-added`
- `self-contained-plugin-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines plugin bundle validation.
- `docs/thinkio-full-spec-sheet.md` documents bundled view and asset expectations.
- `tests/plugin-view-contracts.test.ts` verifies required bundled views and blocks external view plugin dependencies.
