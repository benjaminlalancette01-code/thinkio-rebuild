# TASK-046: Add External/Model/Third-Party Intake Review Pipeline

Apply the v1.1.1 external report rule to local model and third-party app outputs.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium-high. External output should be useful, traceable, and non-authoritative until reviewed.

## Subtasks

- Define intake records for model responses, app exports, imported reports, and generated artifacts.
- Classify intake as informational, hypothesis, recommendation, conflict signal, correction candidate, upgrade candidate, rejected, or irrelevant.
- Add promotion decisions: preserve, defer, create derivation, create task, create proposal, reject, or promote after validation.
- Link intake to derivation and friction where needed.
- Add tests for intake classification and promotion routing.

## Required Evidence

- `intake-record-model-defined`
- `external-output-classification-added`
- `promotion-decision-flow-added`
- `intake-pipeline-tests-pass`
