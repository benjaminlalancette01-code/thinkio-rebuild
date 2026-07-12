# VS Code Plugin Stress Findings Report

Date: 2026-07-10

## Scope

This report closes the TASK-102 through TASK-107 stress phase.

The stress phase covered:

- repeated Extension Host smoke activation;
- projection and project-material regeneration churn;
- Project Navigation and material search;
- command governance and Runtime Composer routing;
- local VSIX package/install/uninstall/reinstall behavior;
- follow-up task creation.

## TASK-102 Extension Host Lifecycle

Result: passed with no remaining blocker.

Evidence:

- `npm run smoke:extension-host` passed five consecutive times.
- The harness activated 17 commands, 7 webview providers, and 3 projection watchers.
- Task Kanban and Project Navigation providers registered.
- Blocked mutation behavior surfaced through governance warning behavior.

Remaining risk:

- The smoke harness simulates VS Code APIs. It does not visually inspect real webview rendering inside a live Extension Development Host.

Follow-up:

- Covered by TASK-115.

## TASK-103 Projection Refresh And Watcher Churn

Result: passed with no remaining blocker.

Evidence:

- `npm run update:views` and `npm run update:project-materials` passed five consecutive cycles.
- Current generated state remained consistent.
- Watcher coverage remains `views/*.json`, `tasks/*.json`, and `state/*.json`.

Remaining risk:

- Current validation proves watcher registration and deterministic regeneration, not high-volume live VS Code file-event behavior.

Follow-up:

- Covered by TASK-115.

## TASK-104 Project Navigation And Search

Result: passed functionally, with a presentation issue.

Queries tested:

- `project`: 50 results with `maxResults: 50`.
- `task`: 50 results with `maxResults: 50`.
- `vscode plugin`: 14 results.
- `historical audit`: 8 results.
- `nonexistentquery`: 0 results.
- empty query: blocked with `Project material search requires query.`

Findings:

- Search routing works.
- Empty search is blocked correctly.
- Result records preserve path, authority, disposition, and current-state signal.
- The Project Navigation UI still renders raw JSON-like result output instead of a designed search/results interface.

Follow-up:

- TASK-111.

## TASK-105 Command Governance And Composer

Result: passed after one local repair.

Commands tested:

- refresh, select, open, switch mode, task proposal, save proposal, work package creation, provider ingest, approval request, defer, reject, apply approved proposal, proposal review, interaction recording, runtime composer submit, project material evaluation, material search, and unknown command.

Findings:

- Approval-gated commands correctly block without `approvalId`.
- Proposal-producing commands return proposal-created status.
- Unknown commands are blocked.
- A proposal ID collision was found when multiple proposal-producing commands ran in the same millisecond.

Repair applied:

- `extension/runtime-bridge.js` now appends a local sequence to proposal IDs.
- `tests/vscode-extension-shell.test.ts` now validates distinct proposal IDs under repeated commands.

Remaining risk:

- Runtime Composer and Proposal Review are command-capable but not yet a mature proposal review UI.

Follow-up:

- TASK-114.

## TASK-106 Local VSIX Install And Workspace

Result: failed once, repaired, then passed.

Initial blocker:

- `code --install-extension local-vsix/thinkio-rebuild-0.2.1.vsix` failed in an isolated extensions directory.
- VS Code reported that `engines.vscode` was mandatory.

Repair applied:

- `package.json` now declares `engines.vscode`.
- `scripts/validate-local-vsix-package.mjs` now blocks local VSIX validation if `engines.vscode` is missing.

Post-repair evidence:

- `npm run package:extension` passed.
- Isolated install passed.
- Isolated list showed `thinkio.thinkio-rebuild`.
- Isolated uninstall passed.
- Isolated reinstall passed.

Remaining risk:

- Isolated CLI install is still manual and not yet part of a package validation script.

Follow-up:

- TASK-108.

## TASK-107 Finding Classification

Blockers:

- Missing `engines.vscode` in the VS Code extension manifest. Fixed during stress phase.

Usability issues:

- Webviews exist but currently present projection data through a shared JSON-heavy shell.
- Task Kanban is not yet a full native Kanban board.
- Artifact Mind Map is not yet a visual second-brain-style map.
- Runtime Node Diagram is not yet a true interactive node diagram.
- Project Navigation search lacks a designed result list and authority filters.
- Runtime Composer and Proposal Review lack a complete task/proposal workflow UI.

Missing validation:

- No isolated VS Code CLI install validation script.
- No visual/webview UI stress harness.

No action:

- Command registration count.
- Basic activation.
- Basic watcher registration.
- Basic search routing.
- Approval blockers for canonical mutation.

## Follow-Up Candidate Tasks

- TASK-108: Add automated isolated VSIX install validation.
- TASK-109: Define ThinkIO-native webview presentation architecture.
- TASK-110: Implement native Task Kanban webview presentation.
- TASK-111: Implement Project Navigation search and material retrieval UI.
- TASK-112: Implement Artifact Mind Map visual presentation.
- TASK-113: Implement Runtime Node Diagram interactive presentation.
- TASK-114: Implement Runtime Composer and Proposal Review workflow UI.
- TASK-115: Add webview UI stress and visual smoke validation.

