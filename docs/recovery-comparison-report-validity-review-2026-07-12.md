# Recovery Comparison Report Validity Review - 2026-07-12

## Scope

Reviewed five external reports copied into `docs/recovery-comparison-reports/`:

- `ThinkIO-v1.0.31R-Reconstruction-Session-Recovery-and-Current-Rebuild-Comparison-Audit-2026-07-12.md`
- `ThinkIO-v1.0.16-Historical-Recovery-and-Current-Rebuild-Comparison-Audit-2026-07-12.md`
- `ThinkIO-Deprecated-Version-Recovery-and-Current-Rebuild-Comparison-Audit-2026-07-12.md`
- `ThinkIO-Skills-and-Agents-Architecture-Report-2026-07-12.md`
- `ThinkIO-Native-Capability-Gap-and-Deprecated-Skill-Translation-Expanded-Report-2026-07-12.md`

The reports were compared against the current rebuild state after `TASK-119`.

## Verdict

The reports are broadly valid and useful, but their recommendations overlap heavily. They should be treated as evidence for consolidated native capabilities, not as direct task lists.

## Confirmed Current Strengths

- Governed tasks, authority, status transitions, execution windows, approvals, checkpoints, closeouts, work packages, provider-output intake, CUE validation, runtime tests, project-material classification, generated views, and VS Code extension shell are real native replacements for much of the old chat-era system.
- The reports correctly avoid reviving the old skill stack as project authority.
- The plugin-first direction remains correct.

## Valid Remaining Gaps

1. Native session grounding, start/resume, and next-action resolution are still incomplete.
2. Project identity, workspace topology, and load-mode classification need one native generated surface.
3. Origin/provenance, impact classification, and explainable gate results are spread across records but not unified.
4. Capability registry, maturity lifecycle, stable evolution points, and promotion blockers need a native registry.
5. Cross-layer contradiction and concept-loss validation are not yet systematic.
6. Git/worktree-to-task reconciliation remains operator-managed.
7. Old skill behavior needs a translation registry so useful responsibilities are either native, external-skill-only, deferred, or superseded.
8. Semantic naming has glossary support but not a native registry/linter.
9. UI requirement traceability needs to connect user flows, plugin views, commands, runtime capabilities, and tests.
10. Export readiness, storage reliability, and version semantics need profiles rather than generic handoff packages.

## Already Covered Or Partially Covered

- Friction signals exist through `TASK-045`, but capability-promotion routing still belongs in `TASK-123`.
- Decision records exist through `TASK-089`, but supersession and rationale chains should be reinforced by `TASK-122` and `TASK-123`.
- Project-material classification/search exists through `TASK-092` through `TASK-101`, but historical translation should be handled by `TASK-126`.
- Core plugin presentation work is already represented by `TASK-109` through `TASK-115`; the reports only add traceability and integrated control-surface requirements.
- BAML coverage is already tracked by `TASK-117` and generator policy by `TASK-118`.

## Superseded Or Deferred

- Recreating the old 23-skill stack is rejected.
- High-autonomy agents remain deferred until native authority, provenance, maturity, and execution records are stronger.
- Multi-project sync and full standalone app behavior remain post-plugin work.
- Old handoff-package semantics are superseded by work packages, exports, checkpoints, and Git-backed state.

## Implementation Mapping

- `TASK-120`: native session grounding and next-action resolver.
- `TASK-121`: project identity, workspace topology, and load-mode registry.
- `TASK-122`: shared origin, provenance, impact, and explainable gate results.
- `TASK-123`: capability registry, maturity, stable evolution, and promotion blockers.
- `TASK-124`: cross-layer contradiction and concept-loss validation.
- `TASK-125`: Git worktree to governed-task reconciliation and closeout readiness.
- `TASK-126`: historical translation registry and old skill disposition workflow.
- `TASK-127`: semantic naming registry and linter.
- `TASK-128`: UI requirement traceability and integrated project control surface.
- `TASK-129`: export readiness, storage reliability, and version semantics profiles.

## Current Recommendation

Prioritize `TASK-120` through `TASK-124` before broad UI expansion, because the UI should present native decisions rather than become another interpretation layer.
