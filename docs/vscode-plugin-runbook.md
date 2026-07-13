# VS Code Plugin Runbook

## Current Scope

This runbook covers the local ThinkIO VS Code extension shell.

For the broader user/developer guide, see `docs/thinkio-vscode-plugin-guide.md`.

The extension currently provides:

- manifest contributions;
- activation entrypoint;
- command registration;
- native webview provider scaffolds;
- runtime composer/proposal panels;
- workspace-state helpers;
- bundled local assets;
- extension package validation.

## Local Validation

Run:

```text
npm run validate:extension
```

This checks:

- extension entrypoint exists;
- required command contributions exist;
- required view contributions exist;
- bundled assets exist;
- no external view plugin dependency is declared.

Full project validation:

```text
npm run check
```

BAML contract inventory validation:

```text
npm run validate:baml
```

Automated Extension Host smoke harness:

```text
npm run smoke:extension-host
```

This uses a local mock VS Code host to validate activation, command registration, view provider registration, watcher registration, a core webview render, and approval-required behavior for direct mutation commands.

## Extension Development Host

Use the checked-in launch profile:

```text
ThinkIO: Extension Host
```

This opens `test-workspace/` as the Extension Development Host workspace while using the current repository as the extension development path.

The launch profile runs:

```text
ThinkIO: update views
```

before launch.

Smoke checklist:

- `docs/extension-host-smoke-checklist.md`

The test workspace includes `thinkio.config.json` and minimal generated projection fixtures so activation and view loading can be tested without relying on another project.

## Local Plugin Shape

Extension entrypoint:

- `extension/extension.js`

Core extension modules:

- `extension/contracts.js`
- `extension/commands.js`
- `extension/runtime-bridge.js`
- `extension/views/core-view-providers.js`
- `extension/views/composer-proposal-providers.js`
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

## Current Packaging Strategy

The first packaging step is local and validation-first.

Run:

```text
npm run package:extension
```

This runs:

- extension package validation;
- local VSIX allowlist validation;
- local no-network VSIX creation;
- isolated VSIX install dry-run validation.

The generated artifact is written to:

```text
local-vsix/thinkio-rebuild-0.2.1.vsix
```

`local-vsix/` is ignored by Git.

Local install:

```text
code --install-extension local-vsix/thinkio-rebuild-0.2.1.vsix
```

Isolated install dry-run:

```text
npm run validate:vsix:isolated
```

This validates the local VSIX artifact and prints the uninstall/install/reinstall plan without mutating the user's installed extensions.

Local uninstall:

```text
code --uninstall-extension thinkio.thinkio-rebuild
```

A later task may replace or extend the local packer with `@vscode/vsce`, marketplace metadata, or signed release polish.

## Guardrails

- Webviews read ThinkIO projections and route actions through commands.
- Commands return structured results and block canonical mutation without approval.
- Interaction logs and task proposals are stored as plugin/workspace evidence, not canonical state.
- View state stays UI-only.
- No external Kanban, mind-map, graph, flowchart, or node-diagram extension is required.
- Canonical runtime persistence remains proposal-first and approval-gated; see `docs/canonical-runtime-persistence-boundary.md`.
