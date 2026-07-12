# TASK-101: Add Approved Project Material Reorganization Actions

Define governed actions for moving, removing, promoting, archiving, or labeling project material after the project material evaluator classifies it.

## Why This Exists

TASK-092 through TASK-100 let ThinkIO classify and report on project material. They do not give ThinkIO authority to silently move or delete files.

Project material reorganization needs an explicit approval boundary.

## Scope

- Define material action types.
- Define approval rules for moving, removing, promoting, archiving, and labeling files.
- Add a dry-run reorganization plan model.
- Block destructive material actions without explicit approval.

## Required Evidence

- `project-material-action-types-defined`
- `move-remove-promote-archive-approval-boundary-defined`
- `dry-run-reorganization-plan-added`
- `destructive-material-actions-blocked-without-approval`
## Completion

Completed on 2026-07-10. Evidence is recorded in $evidence and covered by 	ests/project-materials.test.ts.
