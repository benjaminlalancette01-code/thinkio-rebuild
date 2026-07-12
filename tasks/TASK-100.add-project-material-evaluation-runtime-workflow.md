# TASK-100: Add Project Material Evaluation Runtime Workflow

Add a kernel/runtime workflow that evaluates ThinkIO project material the same way task intake evaluates and reorders task work.

## Purpose

ThinkIO should be able to inspect the project material around it, classify what each file means, and generate a project-state report. This is part of how ThinkIO works with a project, not a one-time documentation cleanup.

The report should answer:

- where the project started;
- what is happening now;
- what should happen next;
- what data has already been included, worked on, accepted, rejected, or kept as historical evidence.

## Scope

- Add a project material evaluator in the kernel/runtime layer.
- Apply the material disposition rules from TASK-094.
- Generate or refresh a project-state report.
- Document the trigger rules for when ThinkIO runs project material evaluation.
- Validate that classified material can be reorganized without confusing canonical, generated, and historical authority.

## Required Evidence

- `project-material-evaluator-added`
- `material-disposition-rules-applied`
- `project-state-report-generated`
- `runtime-trigger-documented`
- `material-reorganization-validation-added`
## Completion

Completed on 2026-07-09 as part of the project material evaluation and navigation pass. Evidence is recorded in docs/project-material-evaluation-completion-report-2026-07-09.md.
