# ThinkIO Plugin View UI Audit

Date: 2026-07-10

## Summary

ThinkIO has the VS Code webview infrastructure required to host its own views, but the current UI layer is still a technical projection shell.

The plugin is not dependent on another Kanban plugin at the package level. It declares and registers its own Task Kanban, Artifact Mind Map, Runtime Node Diagram, Context, Proposal Review, Runtime Composer, and Project Navigation views.

However, those views are not yet mature product interfaces. They mostly render JSON payloads and simple click/submit handlers. This is enough for smoke validation, but not enough for ThinkIO to feel like a self-contained working plugin.

## Current View Files

Extension-side providers:

- `extension/views/webview-html.js`
- `extension/views/core-view-providers.js`
- `extension/views/composer-proposal-providers.js`
- `extension/views/webview-messages.js`
- `extension/views/governance-ui.js`

Webview assets:

- `media/thinkio.css`
- `media/task-kanban.js`
- `media/artifact-mindmap.js`
- `media/runtime-node-diagram.js`
- `media/runtime-composer.js`
- `media/proposal-review.js`
- `media/project-navigation.js`

Projection data:

- `views/kanban.json`
- `views/mindmap.json`
- `views/thinkio-runtime-flow.json`
- `views/dashboard.json`
- `state/project.materials.json`
- `state/project.knowledge-index.json`

## What Exists

The current plugin has:

- a VS Code Activity Bar container;
- seven registered webview views;
- a shared HTML renderer with CSP and nonce support;
- local media scripts per view;
- a shared governance result area;
- command message validation;
- projection refresh messages;
- package allowlist validation;
- local VSIX package generation;
- isolated VSIX install verified after repair.

## What Is Missing

Task Kanban:

- no lane board layout;
- no task cards with status, authority, priority, dependencies, blockers, or evidence;
- no selection model visible in the UI;
- no command affordances for add, save, defer, request approval, or open record;
- no drag/reorder boundary, even as proposal-only behavior.

Artifact Mind Map:

- no visual graph/map surface;
- no artifact clustering by canonical/generated/historical/import status;
- no zoom, pan, selection, or neighbor expansion;
- no second-brain-style project material browsing.

Runtime Node Diagram:

- no node-link layout;
- no visible runtime flow stages;
- no edge labels or blocker state;
- no interactive node details panel.

Project Navigation:

- search works through the bridge;
- result presentation is raw output instead of cards/rows;
- no filters for authority, disposition, current-only, report inputs, generated material, or import review-needed;
- no open/copy/link actions for material records.

Runtime Composer:

- command route exists;
- no structured form for mode, intent, source material, proposed task, required evidence, approval need, or output class;
- no preview of the governance decision before submission.

Proposal Review:

- command route exists;
- no proposal list;
- no proposal detail view;
- no blocker/evidence checklist;
- no approval request/apply/reject controls with clear state.

Shared UI:

- shared CSS is minimal and dark-only;
- most views share duplicated `renderGovernance` code;
- no view-specific empty/loading/error states beyond raw JSON;
- no visual regression or browser/webview screenshot harness.

## Maturity Assessment

Architecture readiness: high.

The plugin shell, command bridge, local assets, CSP, package validation, and projection state are present.

Product UI readiness: low to medium.

The current views prove that ThinkIO can host and refresh its own data, but they do not yet replace a real Kanban/mind-map/diagram workflow.

Local plugin usability: blocked by presentation quality, not by the extension boundary.

## Recommendation

The next phase should be a view presentation phase.

Priority order:

1. Define a shared ThinkIO webview UI architecture.
2. Build native Task Kanban first, because it replaces the external Kanban plugin dependency in practice.
3. Build Project Navigation search UI next, because it helps work continue inside ThinkIO.
4. Build Artifact Mind Map and Runtime Node Diagram as visual browsing surfaces.
5. Build Runtime Composer and Proposal Review as governed workflow surfaces.
6. Add visual/webview stress validation before calling the plugin usable.

