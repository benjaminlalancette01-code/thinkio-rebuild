# TASK-077: Add Extension Host Launch And Manual Smoke Workflow

Add the local developer workflow for running ThinkIO inside a VS Code Extension Development Host.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. The extension shell validates on disk, but it still needs a repeatable Extension Host workflow before real VS Code behavior can be hardened.

## Subtasks

- Add `.vscode/launch.json` for Extension Development Host launch.
- Add a small `test-workspace/` fixture with `thinkio.config.json`.
- Document how to launch, activate, inspect views, run commands, and collect failures.
- Add a manual smoke checklist for the six ThinkIO views and core commands.
- Add validation that the launch config and test workspace exist.

## ThinkIO Alignment

- Uses the local extension shell before adding marketplace or remote-provider scope.
- Keeps validation grounded in real VS Code behavior.
- Does not promote future idea tasks unless the Extension Host workflow exposes a real blocker.

## Required Evidence

- `extension-host-launch-config-added`
- `manual-smoke-workflow-documented`
- `test-workspace-fixture-added`
- `extension-host-smoke-checklist-added`

## Completion Evidence

- `.vscode/launch.json` adds the `ThinkIO: Extension Host` launch profile.
- `.vscode/tasks.json` adds the `ThinkIO: update views` pre-launch task.
- `test-workspace/` includes `thinkio.config.json` and minimal projection fixtures for activation/view loading.
- `docs/extension-host-smoke-checklist.md` documents launch, activation, six-view smoke checks, command checks, and failure capture.
- `docs/vscode-plugin-runbook.md` documents the Extension Development Host workflow.
- `scripts/validate-vscode-extension-package.mjs` validates the launch workflow and fixture files.
- `tests/vscode-extension-shell.test.ts` covers the launch config, fixture config, and smoke checklist.
