# TASK-048: Add Provider/App Output Ingest Record And Validation Pipeline

Normalize, classify, validate, and route returned model/app output.

Source report: `audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md`.

## Risk

Medium-high. Returned output must not skip governance because it came from an expected provider.

## Subtasks

- Define provider/app output records linked to work packages.
- Store raw output references, normalized output, output class, warnings, proposed actions, derivation, validation runs, and final disposition.
- Validate output against expected package contract.
- Route output to context card, deferred item, task, file action proposal, rejected record, or approved mutation path.
- Add tests for each disposition route.

## Required Evidence

- `provider-output-record-model-defined`
- `ingest-validation-pipeline-added`
- `governance-disposition-routing-added`
- `provider-output-ingest-tests-pass`
