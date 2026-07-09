# TASK-065: Implement VS Code Command Adapter And Runtime Bridge

Implement VS Code command handlers that call ThinkIO runtime boundaries.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. If VS Code commands write files or task state directly, the plugin bypasses ThinkIO governance.

## Subtasks

- Map `plugin.*` command contracts to VS Code command IDs.
- Route commands through runtime functions and governance decisions.
- Surface blockers, proposals, approval-required states, and validation results.
- Block direct UI mutation of task JSON, checkpoints, and files.
- Add command adapter tests.

## Detailed Plan For Review

### What Will Be Added

- Command adapter module at `src/commands/register-thinkio-commands.ts`.
- Runtime bridge module at `src/runtime/thinkio-runtime-bridge.ts`.
- Command result/view-message types at `src/commands/command-results.ts`.
- Tests at `tests/vscode-command-adapter.test.ts`.

### Command Mapping

Map ThinkIO plugin command contracts to VS Code commands:

- `plugin.refresh-view` -> `thinkio.refreshView`
- `plugin.select-record` -> `thinkio.selectRecord`
- `plugin.open-record` -> `thinkio.openRecord`
- `plugin.switch-mode` -> `thinkio.switchMode`
- `plugin.add-task-proposal` -> `thinkio.addTaskProposal`
- `plugin.save-task-proposal` -> `thinkio.saveTaskProposal`
- `plugin.create-work-package` -> `thinkio.createWorkPackage`
- `plugin.ingest-provider-output` -> `thinkio.ingestProviderOutput`
- `plugin.request-approval` -> `thinkio.requestApproval`
- `plugin.defer-work` -> `thinkio.deferWork`
- `plugin.reject-proposal` -> `thinkio.rejectProposal`
- `plugin.apply-approved-proposal` -> `thinkio.applyApprovedProposal`
- `plugin.open-proposal-review` -> `thinkio.openProposalReview`
- `plugin.record-interaction` -> `thinkio.recordInteraction`
- `plugin.submit-runtime-composer` -> `thinkio.submitRuntimeComposer`

### Runtime Bridge Rules

The adapter must:

- call functions from `runtime/local-dev-runtime.ts` or a new wrapper around them.
- reject commands not listed in `kernel/plugin-view-contracts.ts`.
- never write `tasks/*.json` directly from a command handler.
- return structured command results:
  - `ok`;
  - `blocked`;
  - `proposal-created`;
  - `approval-required`;
  - `validation-failed`;
  - `applied`.

### How It Will Be Added

1. Add command registration shell.
2. Add runtime bridge functions that call existing runtime boundaries.
3. Add direct-mutation guard around commands that could affect canonical state.
4. Add tests that invoke adapter functions without launching VS Code.
5. Wire activation to call command registration after TASK-064 scaffold exists.

### Review Checklist

- Are the proposed VS Code command IDs acceptable?
- Should commands use `thinkio.*` IDs publicly while internal contracts stay `plugin.*`?
- Should failed governance decisions appear as VS Code notifications, panel messages, or both?
- Should `saveTaskProposal` call mutation planning only, or also apply when approval exists?

### Out Of Scope

- Rendering UI buttons.
- Actual webview providers.
- Direct file writes.
- External model/provider API calls.

## ThinkIO Alignment

- Implements TASK-056 and TASK-057 inside the actual VS Code extension shell.
- Keeps add/save task actions proposal-first.
- Keeps runtime mutation behind approval and validation.

## Required Evidence

- `vscode-command-adapter-added`
- `plugin-command-runtime-routing-implemented`
- `direct-ui-mutation-blocked`
- `command-adapter-tests-pass`

## Completion Evidence

- `extension/commands.js` registers VS Code commands.
- `extension/runtime-bridge.js` routes commands to ThinkIO runtime action names and blocks canonical mutation without approval.
- `tests/vscode-extension-shell.test.ts` validates command wiring and direct-mutation guard text.
