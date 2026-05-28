# TASK-002: Wire CUE Validation

## Candidate Concept

Schema validation must be a local development runtime boundary before task or state data is treated as reliable.

## Mapped Kernel Capability

Runtime rule and test.

## Rewritten Into

- `runtime/cue-validator.ts`
- `runtime/local-dev-runtime.ts`
- `runtime/command-registry.ts`
- `tests/cue-validator.test.ts`

## Legacy Source Referenced

None. This task wires the already declared rebuild schema role into runtime behavior.

## Acceptance

Accepted after local tests pass.

