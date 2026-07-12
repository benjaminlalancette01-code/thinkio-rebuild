# TASK-117: Expand Model-Facing BAML Contract Coverage

Evaluate and expand the BAML contracts needed for ThinkIO's model-facing exchanges.

## Required Work

- Review current contracts under `contracts/baml/`.
- Compare against recovered contract signals: classify item, route task context, verify proof package, refactor batch plan, and human review summary.
- Add or defer contracts for project-material classification, proof verification, provider-output classification, task proposal composition, governance review, and proposal summaries.
- Preserve ThinkIO's rule that model output proposes structured data but never writes canonical runtime state directly.

