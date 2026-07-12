# TASK-118: Evaluate BAML CLI Generator Boundary

Decide whether ThinkIO should keep BAML files as architectural contracts under `contracts/baml/` or adopt a BAML CLI-compatible `baml_src/` and generated TypeScript client path.

## Required Work

- Review current BAML CLI layout expectations.
- Decide whether `contracts/baml/` remains documentation-only or becomes mirrored into `baml_src/`.
- Define whether generated BAML clients belong in source, generated output, package artifacts, or deferred provider-integration work.
- Record how this affects remote model/provider integration.

