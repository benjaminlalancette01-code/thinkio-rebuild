# TASK-066: Implement Native VS Code Webview Providers For Core Views

Build the native VS Code view providers for task Kanban, artifact mind-map, and runtime node diagram.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. ThinkIO cannot be used as a plugin until the required views exist inside VS Code.

## Subtasks

- Implement task Kanban webview/provider.
- Implement artifact mind-map webview/provider.
- Implement runtime node diagram webview/provider.
- Load data from ThinkIO projections.
- Route view actions through the command adapter.
- Add provider tests or smoke fixtures.

## Detailed Plan For Review

### What Will Be Added

- `src/views/task-kanban-provider.ts`
- `src/views/artifact-mindmap-provider.ts`
- `src/views/runtime-node-diagram-provider.ts`
- Shared webview HTML/CSP helper at `src/views/webview-html.ts`.
- Shared message schema at `src/views/webview-messages.ts`.
- Bundled assets under `media/`.
- Provider tests at `tests/vscode-webview-providers.test.ts`.

### View Responsibilities

Task Kanban provider:

- reads native board projection.
- renders lanes/cards.
- sends card action messages to command adapter.
- does not mutate task JSON.

Artifact mind-map provider:

- reads runtime mind-map projection.
- renders nodes/edges for artifacts, sources, tasks, context cards, derivations, validations, and work packages.
- filters by selected runtime record.
- sends node selection/actions to command adapter.

Runtime node diagram provider:

- reads runtime projection/flow data.
- renders task, provider output, validation, governance, proposal, checkpoint, and closeout nodes.
- supports select, focus path, expand/collapse, blocker inspection.
- stores geometry only as UI state.

### Asset Strategy

The first implementation should use bundled local assets only:

- no external VS Code view extensions.
- no CDN scripts.
- no remote images.
- local CSS/JS under `media/`.
- strict Content Security Policy.

### How It Will Be Added

1. Add provider classes with minimal HTML output.
2. Add projection loading from existing generated `views/*.json` and/or runtime projection builders.
3. Add postMessage handlers from webviews to command adapter.
4. Add basic CSS/JS assets.
5. Add tests that assert providers register correct view IDs and generate CSP-safe HTML.

### Review Checklist

- Should the initial webviews render from generated JSON files or call runtime projection builders live?
- Should the core views be all visible at once or split into a primary/secondary layout?
- Is a minimal static render acceptable before interaction polish?
- Should visual layout be hand-written first or use a bundled graph library?

### Out Of Scope

- Proposal review panel.
- Runtime composer panel.
- Workspace state persistence.
- Packaging into VSIX.
- External plugin dependency.

## ThinkIO Alignment

- Implements native views without external view plugins.
- Keeps views as projections, not authority.
- Uses existing plugin view contracts and runtime projections.

## Required Evidence

- `task-kanban-webview-provider-added`
- `artifact-mindmap-webview-provider-added`
- `runtime-node-diagram-webview-provider-added`
- `core-view-provider-tests-pass`

## Completion Evidence

- `extension/views/core-view-providers.js` registers task Kanban, artifact mind-map, and runtime node diagram providers.
- `extension/views/webview-html.js` provides CSP-safe webview HTML scaffolding.
- `media/task-kanban.js`, `media/artifact-mindmap.js`, and `media/runtime-node-diagram.js` are bundled local assets.
- `tests/vscode-extension-shell.test.ts` validates provider and asset presence.
