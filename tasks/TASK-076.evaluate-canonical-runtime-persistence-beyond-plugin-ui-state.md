# TASK-076: Evaluate Canonical Runtime Persistence Beyond Plugin UI State

Promoted from TASK-068 out-of-scope items.

Review canonical runtime persistence beyond plugin UI state after workspace-state persistence is implemented.

This task is promoted to candidate because the plugin now has command routes for proposal save/apply behavior, but the local extension shell still needs a clear boundary between UI-only state, proposal records, and canonical runtime writes before packaging/install validation.

## Risk

High. Canonical runtime persistence changes authority, replay, rollback, and mutation behavior.

## Dependencies

- TASK-012 for governed mutation transactions.
- TASK-041 for closeout/history validation.
- TASK-068 for plugin UI-state persistence.

## Required Evidence

- `canonical-runtime-persistence-reviewed`
- `ui-state-vs-runtime-state-boundary-defined`
- `runtime-persistence-plugin-readiness-impact-recorded`

## Completion Evidence

- `docs/canonical-runtime-persistence-boundary.md` defines UI-only plugin state, proposal/interaction evidence, generated support state, and canonical runtime state.
- The boundary records that the local plugin may proceed to packaging as projection-based, proposal-first, and approval-gated.
- The boundary blocks direct webview writes to `tasks/*.json` and `state/*.json`.
- `docs/thinkio-vscode-plugin-guide.md` and `docs/vscode-plugin-runbook.md` link the persistence boundary.
- `tests/runtime-persistence-boundary.test.ts` verifies the boundary doc and current plugin stores keep proposal/workspace state non-canonical.
