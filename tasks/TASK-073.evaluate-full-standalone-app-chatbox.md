# TASK-073: Evaluate Full Standalone App Chatbox

Promoted from TASK-067 out-of-scope items.

Review a future full-app chatbox after the VS Code plugin composer/result surface is stable.

## Risk

Medium-high. A full app chatbox can easily drift into generic chat and weaken ThinkIO's governed runtime boundary.

## Dependencies

- TASK-029 for full product runtime boundary.
- TASK-061 for runtime composer/result surface.
- TASK-067 for plugin composer and proposal panels.

## Required Evidence

- `standalone-chatbox-scope-reviewed`
- `full-app-chat-non-mvp-boundary-defined`
- `chatbox-runtime-authority-boundary-preserved`
## Completion

Completed on 2026-07-09 as part of the product expansion boundary pass. The outcome is documented in docs/product-expansion-boundaries.md and validated by 	ests/product-expansion-boundaries.test.ts.

