# TASK-064: Scaffold VS Code Extension Manifest And Activation Boundary

Create the actual VS Code extension shell for ThinkIO.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. ThinkIO has plugin architecture contracts, but without a manifest and activation entrypoint it cannot run as a VS Code plugin.

## Subtasks

- Add VS Code extension manifest/contribution metadata.
- Add activation/deactivation entrypoint.
- Declare contributed views and commands for the ThinkIO plugin shell.
- Keep extension activation bound to ThinkIO runtime contracts.
- Add tests or validation proving the extension scaffold is present.

## Detailed Plan For Review

### What Will Be Added

- VS Code extension contribution metadata in `package.json`.
- Extension entrypoint at `src/extension.ts`.
- Extension context/bootstrap helper at `src/thinkio-extension-context.ts`.
- Initial command/view ID constants at `src/extension-contract.ts`.
- A scaffold validation test, likely `tests/vscode-extension-scaffold.test.ts`.

### Manifest Contributions

The extension manifest should declare:

- publisher/name/display name for ThinkIO.
- `main` entrypoint pointing to the compiled extension file.
- activation events for the ThinkIO views and commands.
- command contributions for the plugin command surface.
- view container for ThinkIO.
- views for:
  - task Kanban;
  - artifact mind-map;
  - runtime node diagram;
  - context panel;
  - proposal review;
  - runtime composer/result surface.

### Activation Shape

`activate(context)` should:

- create the ThinkIO extension context.
- register commands through the command adapter created in TASK-065.
- register webview providers created in TASK-066 and TASK-067.
- initialize workspace state through TASK-068 when available.
- fail visibly if required runtime paths or state files are missing.

`deactivate()` should:

- avoid writing canonical state.
- dispose providers/listeners.
- leave runtime state untouched unless a governed command already wrote approved changes.

### How It Will Be Added

1. Add extension metadata without changing current runtime behavior.
2. Add empty-but-valid activation/deactivation entrypoints.
3. Add command/view contribution IDs that match `kernel/plugin-view-contracts.ts`.
4. Add scaffold tests that assert manifest and activation entrypoint exist.
5. Do not implement actual webview rendering in this task. That belongs to TASK-066 and TASK-067.

### Review Checklist

- Does the manifest define the right ThinkIO view names?
- Are command IDs stable enough before implementation?
- Should the extension use one ThinkIO view container or multiple containers?
- Should activation happen on command use, view open, or workspace contains `thinkio.config.json`?

### Out Of Scope

- Webview UI rendering.
- Runtime command execution.
- VSIX packaging.
- Marketplace metadata polish.
- Model/provider calls.

## ThinkIO Alignment

- Turns the plugin-first product boundary into a real extension shell.
- Does not activate old runtime/archive material.
- Keeps the VS Code shell governed by current ThinkIO runtime contracts.

## Required Evidence

- `vscode-extension-manifest-added`
- `activation-entrypoint-added`
- `plugin-contributions-declared`
- `extension-scaffold-tests-pass`

## Completion Evidence

- `package.json` declares VS Code activation events, commands, view container, and ThinkIO views.
- `extension/extension.js` provides activation/deactivation and extension bootstrap.
- `extension/contracts.js` defines stable command and view IDs.
- `tests/vscode-extension-shell.test.ts` validates the extension scaffold.
