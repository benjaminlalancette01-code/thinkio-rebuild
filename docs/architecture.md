# Architecture

ThinkIO is built from small, explicit layers:

- `tasks/` stores governed task records and human task notes.
- `schemas/` defines validation constraints.
- `kernel/` enforces task transitions, gates, context routing, ledger records, and checkpoints.
- `state/` stores current operational state.
- `views/` stores simple JSON projections.
- `runtime/` contains local development runtime entry points.
- `contracts/` documents model-facing BAML boundaries.

Archive material is reference-only. Concepts may be extracted into new files, but old runtime files are not authoritative.

