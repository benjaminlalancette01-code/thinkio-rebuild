# TASK-060: Add Chat-To-Task Proposal Pipeline

Define how ThinkIO gathers information through model/chat interaction and turns it into reviewed task proposals.

Source report: `audit/v1.1.1-plugin-interaction-emulation-gap-report-2026-07-03.md`.

## Risk

High. New task creation from chat must be useful without letting model output write canonical task files directly.

## Subtasks

- Define the command flow for `add task`, `save task`, `revise task proposal`, `reject task proposal`, and `promote task proposal`.
- Define how ThinkIO asks gathering questions when the user/model conversation lacks title, mode, priority, dependencies, allowed context, blocked context, or required evidence.
- Route task proposals through intake review, governance decision, validation, and approved mutation/write boundaries.
- Require user-visible review before any proposed task becomes canonical task JSON or a Kanban card.
- Add tests proving chat-derived tasks remain proposals until approved.

## ThinkIO Alignment

- Uses TASK-057 command sync for mode switching, add task, and save task actions.
- Uses TASK-046 intake review and TASK-056 command routing rather than direct plugin file writes.
- Makes the model a drafting assistant inside ThinkIO governance, not the task authority.

## Required Evidence

- `chat-to-task-proposal-flow-defined`
- `task-gathering-question-policy-added`
- `new-task-save-review-gate-added`
- `chat-task-proposal-tests-pass`

## Completion Evidence

- `kernel/plugin-view-contracts.ts` defines chat-to-task proposal records and required field gathering.
- `docs/thinkio-full-spec-sheet.md` documents the chat-to-task proposal pipeline.
- `tests/plugin-view-contracts.test.ts` verifies canonical task creation is blocked before review/approval.
