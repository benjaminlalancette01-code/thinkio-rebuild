# TASK-057: Define Plugin Cross-View Selection And Sync

Define how Kanban, artifact mind-map, node diagram, context panel, and proposal review stay synchronized without duplicating authority.

## Risk

Medium-high. Cross-view sync can create hidden state drift if selection is confused with mutation.

## Subtasks

- Define selected runtime record shape.
- Define how selecting a task filters artifact and runtime diagrams.
- Define how selecting an artifact highlights related tasks, context cards, derivations, and validations.
- Define cross-view commands for switching mode, adding a task, saving a task, deferring work, opening proposal review, and requesting approval.
- Ensure add/save task commands create governed task proposals first and only mutate canonical task JSON through runtime validation.
- Define how view-local layout state persists without altering runtime state.
- Add tests that selection changes never mutate task status or authority.

## ThinkIO Alignment

- Selection is UI state.
- Canonical state changes require runtime commands, validation, and checkpoint evidence.
- Mode switching, new-task creation, and task saving are governed commands, not direct UI writes.
- All views share the same runtime record IDs.

## Required Evidence

- `cross-view-selection-model-defined`
- `cross-view-command-contract-added`
- `view-sync-boundary-added`
- `canonical-state-protection-added`
- `cross-view-sync-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines `CrossViewSelectionSyncContract`.
- `tests/plugin-view-contracts.test.ts` verifies cross-view selection highlights/filters records without mutating task status or authority.
- TASK-057 command scope is covered by the plugin command route contract for switch mode, add task proposal, save task proposal, defer work, proposal review, and approval.
