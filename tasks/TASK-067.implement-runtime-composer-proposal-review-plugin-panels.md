# TASK-067: Implement Runtime Composer And Proposal Review Plugin Panels

Build the plugin panels for governed model interaction and proposal review.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. Without these panels, ThinkIO cannot gather user/model input or review proposed task/output changes inside VS Code.

## Subtasks

- Implement runtime composer panel.
- Implement proposal review panel.
- Write interaction log records through the governed interaction-log path.
- Support chat-to-task proposal review and save flow.
- Block generic transcript behavior.
- Add panel tests or smoke fixtures.

## Detailed Plan For Review

### What Will Be Added

- `src/views/runtime-composer-provider.ts`
- `src/views/proposal-review-provider.ts`
- `src/interaction/interaction-log-store.ts`
- `src/interaction/task-proposal-store.ts`
- Composer/review web assets under `media/`.
- Tests at `tests/vscode-composer-panels.test.ts`.

### Runtime Composer Panel

The composer should show:

- selected runtime context;
- prompt/instruction input;
- mode/action selector if needed;
- provider/model label placeholder;
- result state;
- follow-up actions.

The composer must produce:

- interaction log records;
- runtime command requests;
- proposal records;
- validation/governance result display.

It must not render a generic long-running chat transcript as the main state.

### Proposal Review Panel

The proposal review panel should show:

- proposal type;
- source interaction log;
- missing fields;
- governance decision;
- validation state;
- approve/reject/revise/defer actions;
- affected records.

For chat-to-task proposals, it should show:

- title;
- mode;
- priority;
- dependencies;
- allowed context;
- blocked context;
- required evidence.

### How It Will Be Added

1. Add interaction log store abstraction.
2. Add task proposal store abstraction.
3. Add composer provider with selected-context input and result state.
4. Add proposal review provider with structured proposal display.
5. Route all actions through TASK-065 command adapter.
6. Add tests proving composer output creates proposals/logs, not canonical task mutations.

### Review Checklist

- Where should interaction logs live initially: `state/interaction-logs.json`, workspace storage, or both?
- Should task proposals live in `state/task-proposals.json` before promotion?
- Should the composer allow freeform brainstorming in MVP, or only governed command modes?
- Should proposal review be a sidebar panel or editor tab?

### Out Of Scope

- Direct model API integration.
- Full standalone app chatbox.
- Transcript-grade capture by default.
- Direct task JSON write from composer.

## ThinkIO Alignment

- Makes model interaction governed and visible.
- Keeps task creation proposal-first.
- Keeps interaction logs non-canonical.

## Required Evidence

- `runtime-composer-panel-added`
- `proposal-review-panel-added`
- `interaction-log-write-path-added`
- `composer-panel-tests-pass`

## Completion Evidence

- `extension/views/composer-proposal-providers.js` registers context, proposal review, and runtime composer panels.
- `extension/interaction/stores.js` provides append-only interaction log and task proposal stores.
- `media/runtime-composer.js` and `media/proposal-review.js` are bundled local panel assets.
- `tests/vscode-extension-shell.test.ts` validates panel wiring.
