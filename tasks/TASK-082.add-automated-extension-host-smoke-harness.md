# TASK-082: Add Automated Extension Host Smoke Harness

Add automated smoke testing inside a VS Code Extension Host or equivalent test harness.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. Disk-level validation is useful, but real VS Code behavior can still fail at activation, command registration, or webview provider loading.

## Subtasks

- Choose test harness strategy.
- Add automated activation smoke test.
- Add command registration smoke test.
- Add core view provider smoke test.
- Add blocker/direct-mutation smoke test.
- Document how and when to run extension-host tests.

## ThinkIO Alignment

- Hardens real VS Code behavior without expanding product scope.
- Keeps plugin validation local and repeatable.
- Promotes future idea tasks only if smoke tests expose a blocker.

## Required Evidence

- `extension-host-test-harness-added`
- `activation-smoke-automated`
- `core-command-smoke-automated`
- `extension-host-tests-pass`

## Completion Evidence

- `tests/extension-host-smoke-harness.test.ts` adds a local mock VS Code Extension Host smoke harness.
- The harness activates ThinkIO, registers commands, registers core/panel views, registers projection watchers, resolves a core webview, and verifies direct mutation remains approval-required.
- `package.json` adds `smoke:extension-host`.
- `docs/vscode-plugin-runbook.md` and `docs/extension-host-smoke-checklist.md` document the automated smoke command.
- `npm run smoke:extension-host` passes.
