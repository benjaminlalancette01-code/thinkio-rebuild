# TASK-028: Decide Kanban Markdown Sync Boundary

Convert the report finding that Kanban Markdown cards are visual mirrors into a governed decision task.

Source report: `audit/current-state-report-2026-06-30.md`.

## Risk

Medium. Confusing visual mirrors with canonical task state can create governance drift.

## Subtasks

- Decide whether `.devtool/features` remains read-only visual support.
- If read-only, document that card movement does not update task JSON.
- If writable, define a safe sync command from card frontmatter back into `tasks/*.json`.
- Add a validation note or test that prevents silent board/source drift.

## Required Evidence

- `missing-work-task-created`
- `kanban-sync-boundary-decided`
- `kanban-sync-boundary-test-or-note-added`
