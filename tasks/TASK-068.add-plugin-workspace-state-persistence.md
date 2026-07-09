# TASK-068: Add Plugin Workspace State Persistence

Persist plugin UI state without turning it into runtime authority.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

Medium-high. Persisted UI state can accidentally become state authority if selection, layout, or trace settings are confused with canonical records.

## Subtasks

- Persist selected runtime record.
- Persist collapsed groups, zoom, pan, and layout hints.
- Persist trace/execution visibility setting.
- Keep persisted state separate from task JSON, checkpoints, and runtime truth.
- Add tests proving persisted view state cannot mutate task status or authority.

## Detailed Plan For Review

### What Will Be Added

- `src/state/plugin-workspace-state.ts`
- `src/state/view-state-store.ts`
- optional state schema or type tests for persisted UI state.
- Tests at `tests/vscode-workspace-state.test.ts`.

### Persisted State Fields

Persist only UI state:

- selected runtime record;
- active view;
- collapsed groups;
- zoom;
- pan;
- layout hints;
- trace/execution visibility mode;
- last refresh timestamp.

Do not persist as authority:

- task status;
- task authority;
- evidence;
- checkpoint validity;
- approval state;
- file write permission.

### Storage Strategy

Use VS Code workspace state for plugin UI state.

If a file-backed cache is added later, it must:

- live outside canonical task records;
- be clearly marked as plugin cache;
- be rebuildable from canonical state;
- never be read as authority.

### How It Will Be Added

1. Add typed persistence wrapper over VS Code `ExtensionContext.workspaceState`.
2. Add read/write helpers for each view state.
3. Add trace visibility persistence.
4. Add tests using an in-memory workspace-state mock.
5. Connect providers to persistence after TASK-066 and TASK-067.

### Review Checklist

- Should trace mode persist per workspace or globally?
- Should selected record restore automatically on activation?
- Should view layout reset when projections change substantially?
- Do we need migration/versioning for plugin UI state?

### Out Of Scope

- Canonical runtime persistence.
- Task mutation.
- Interaction log storage.
- Proposal storage.
- Sync across machines.

## ThinkIO Alignment

- Implements TASK-057 behavior inside VS Code.
- Keeps view-local state UI-only.
- Preserves cross-view selection continuity.

## Required Evidence

- `workspace-state-store-added`
- `selected-record-persistence-added`
- `layout-state-authority-boundary-preserved`
- `workspace-state-tests-pass`

## Completion Evidence

- `extension/state/workspace-state.js` persists selected record, collapsed groups, zoom, pan, layout hints, trace mode, and refresh timestamp.
- Persisted state is sanitized as UI state and does not include task status, authority, evidence, checkpoint validity, or write permission.
- `tests/vscode-extension-shell.test.ts` validates the workspace-state module is included in the extension package.
