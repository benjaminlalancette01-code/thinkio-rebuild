# TASK-080: Render Governance Results And Blockers In Plugin UI

Show governance decisions, blockers, approval requirements, and validation results inside the plugin UI.

Source report: `audit/vscode-plugin-maturity-audit-2026-07-04.md`.

## Risk

High. If governance results only appear as generic notifications, users cannot confidently understand why ThinkIO allowed, deferred, blocked, or requested approval.

## Subtasks

- Define a command result rendering model for views and panels.
- Render blockers and validation failures in context.
- Render proposal-created and approval-required states in proposal review/composer panels.
- Keep notifications as secondary feedback, not the only feedback.
- Add tests for command result rendering payloads.

## ThinkIO Alignment

- Makes governance visible where the user acts.
- Preserves ThinkIO as a governed layer over model/UI interaction.
- Keeps command results structured and reviewable.

## Required Evidence

- `governance-result-ui-model-added`
- `blocker-rendering-added`
- `proposal-review-result-rendering-added`
- `governance-ui-tests-pass`

## Completion Evidence

- `extension/views/governance-ui.js` maps structured command results into plugin UI view models.
- Webview command acknowledgements include a `governance` payload for blockers, proposal states, approval requirements, command IDs, and runtime actions.
- `extension/views/webview-html.js` includes a `thinkio-governance` region in every webview.
- `media/thinkio.css` styles governance states and blocker lists.
- Webview media scripts render command governance results and stale projection blockers inline.
- `tests/vscode-extension-shell.test.ts` covers governance result model behavior and inline rendering hooks.
