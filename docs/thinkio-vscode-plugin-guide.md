# ThinkIO VS Code Plugin Guide

## Current Status

ThinkIO now has a first local VS Code extension shell.

It is not marketplace-ready. It is meant for local Extension Development Host testing and hardening.

Use this guide to:

- validate the plugin shell;
- open it in VS Code;
- understand what each view is supposed to do;
- continue development without weakening ThinkIO governance.

## What Exists Now

Extension shell:

- `extension/extension.js`
- `extension/contracts.js`
- `extension/commands.js`
- `extension/runtime-bridge.js`

Views and panels:

- `extension/views/core-view-providers.js`
- `extension/views/composer-proposal-providers.js`
- `extension/views/webview-html.js`

State and interaction stores:

- `extension/state/workspace-state.js`
- `extension/interaction/stores.js`

Bundled assets:

- `media/thinkio.svg`
- `media/thinkio.css`
- `media/task-kanban.js`
- `media/artifact-mindmap.js`
- `media/runtime-node-diagram.js`
- `media/runtime-composer.js`
- `media/proposal-review.js`

Validation:

- `scripts/validate-vscode-extension-package.mjs`
- `tests/vscode-extension-shell.test.ts`

## Validate The Plugin Shell

Run:

```text
npm run check
```

This runs:

- Node version check;
- TypeScript typecheck;
- CUE schema validation;
- extension package validation;
- Node test suite.

For extension-only validation:

```text
npm run validate:extension
```

For projection refresh:

```text
npm run update:views
```

## Open ThinkIO As A Local Plugin

Current local path:

```text
c:\Users\benja\Downloads\Thinkio-1\thinkio-rebuild
```

Recommended near-term workflow:

1. Open `thinkio-rebuild` in VS Code.
2. Run `npm run check`.
3. Start an Extension Development Host using the extension path for this workspace.
4. Open a workspace containing `thinkio.config.json`.
5. Open the ThinkIO activity view.
6. Check these views:
   - Task Kanban;
   - Artifact Mind Map;
   - Runtime Node Diagram;
   - Context;
   - Proposal Review;
   - Runtime Composer.

Use the `ThinkIO: Extension Host` launch profile to open the checked-in `test-workspace` fixture.

## How To Use The Views

### Task Kanban

Use it to inspect governed task/workboard state.

Expected behavior:

- reads generated/native projections;
- shows task state as a view;
- routes card actions through commands;
- does not write `tasks/*.json` directly.

### Artifact Mind Map

Use it to inspect relationships between tasks, artifacts, context, validations, work packages, provider output, and derivations.

Expected behavior:

- graph is a projection;
- node selection changes UI state;
- graph layout is not authority.

### Runtime Node Diagram

Use it to inspect runtime flow:

- validation stages;
- provider output;
- governance decisions;
- proposals;
- checkpoints;
- blockers.

Expected behavior:

- interactions route through commands;
- geometry is UI metadata only.

### Runtime Composer

Use it for governed model-style interaction.

Expected behavior:

- attaches to selected context;
- creates interaction-log evidence;
- creates proposals;
- does not become a generic chat transcript;
- does not write files directly.

### Proposal Review

Use it to review proposed task/output changes before they become canonical.

Expected behavior:

- shows missing fields;
- shows blockers;
- shows approval-required states;
- routes accept/reject/defer through runtime commands.

## Command Boundary

Public VS Code command IDs use `thinkio.*`.

Internal plugin command IDs use `plugin.*`.

Examples:

- `thinkio.refreshView`
- `thinkio.selectRecord`
- `thinkio.addTaskProposal`
- `thinkio.saveTaskProposal`
- `thinkio.submitRuntimeComposer`

Rules:

- commands must route through `extension/runtime-bridge.js`;
- canonical mutation requires approval;
- proposal creation is allowed without direct mutation;
- command results must remain structured.

Persistence boundary:

- UI state and proposal evidence may persist through VS Code workspace state.
- Canonical runtime writes still require the governed mutation boundary.
- Full boundary: `docs/canonical-runtime-persistence-boundary.md`.

## Development Rules

### Do

- Run `npm run check` before accepting task completion.
- Keep generated views current with `npm run update:views`.
- Add tests for every new boundary.
- Keep webview messages allowlisted.
- Keep UI state separate from canonical state.
- Keep model/provider output proposal-first.

### Do Not

- Do not write task JSON directly from webview code.
- Do not treat webview layout as authority.
- Do not add external Kanban, mind-map, graph, flowchart, or node-diagram extension dependencies.
- Do not turn runtime composer into a generic chat transcript.
- Do not activate archive/old-runtime material.
- Do not add future product work without a task intake priority review.

## Current Next Tasks

There are no active candidate or idea tasks after the July 9 product expansion boundary pass.

Before adding or promoting new work, run the task intake priority reorder workflow in `docs/task-intake-priority-reorder-workflow.md`.

Completed product expansion boundary reviews:

- TASK-070 marketplace publishing metadata policy.
- TASK-071 signed release and installer polish.
- TASK-072 remote model provider integration.
- TASK-073 full standalone app chatbox.
- TASK-074 transcript-grade audit capture implementation.
- TASK-075 cross-machine plugin state sync.
- TASK-084 user-facing rule policy model.
- TASK-085 artifact disposition and quarantine model.
- TASK-086 provider registry and capability model.
- TASK-087 multi-project registry and profile model.
- TASK-088 chat session and provider turn ingest model.
- TASK-089 project management and decision layer.
- TASK-090 runtime maturity ledger.

The July 8 design recovery comparison is recorded in `docs/design-recovery-comparison-vscode-plugin-gap-report-2026-07-08.md`.
The open-task priority order is recorded in `docs/open-task-priority-review-2026-07-08.md`.
The July 9 completed boundary review is recorded in `docs/product-expansion-boundaries.md`.

## How To Keep Working

Use this sequence:

1. Run the task intake priority reorder workflow before adding new work.
2. Read its task note and dependencies.
3. Implement only its scope.
4. Add or update tests.
5. Run `npm run update:views` if task state changed.
6. Run `npm run check`.
7. Mark the task done/accepted only after required evidence exists.
8. Move the mirror card to `.devtool/features/done`.
9. Refresh the current state report when the work changes plugin readiness.
10. Keep future product expansion behind explicit boundary reviews.

## Current Recommendation

Use the local plugin workflow next:

1. Run `npm run check`.
2. Run `npm run smoke:extension-host`.
3. Run `npm run package:extension`.
4. Manually launch `ThinkIO: Extension Host` if you want a visual smoke pass.
5. Promote a future idea only if these workflows expose a real blocker.
