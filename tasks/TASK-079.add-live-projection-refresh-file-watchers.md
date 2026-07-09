# TASK-079: Add Live Projection Refresh And File Watchers

Make ThinkIO views refresh when generated projections or canonical task/state files change.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

Medium-high. Static webview data is acceptable for the first shell, but real plugin use needs reliable refresh behavior.

## Subtasks

- Watch generated `views/*.json` files.
- Optionally watch `tasks/*.json` and state files to trigger `update:views`.
- Add debounced refresh events to webviews.
- Surface stale/missing projection errors inside the relevant view.
- Preserve selected record and layout state across refresh.
- Add tests for refresh event routing and stale projection handling.

## ThinkIO Alignment

- Keeps views as projections.
- Refreshes projection data without mutating canonical task state.
- Preserves UI state as non-authoritative.

## Required Evidence

- `projection-file-watchers-added`
- `webview-refresh-event-added`
- `stale-projection-handling-added`
- `live-refresh-tests-pass`

## Completion Evidence

- `extension/projection-watchers.js` registers debounced watchers for `views/*.json`, `tasks/*.json`, and `state/*.json`.
- Extension activation registers projection refresh watchers for all core and panel providers.
- Core and panel providers expose `refresh()` and post `thinkio.projectionRefresh` messages with fresh projection data or stale/missing projection blockers.
- Media scripts handle refresh messages and update the visible projection payload/status.
- `tests/vscode-extension-shell.test.ts` covers watcher patterns, refresh event routing, stale blocker payloads, and extension validation coverage.
