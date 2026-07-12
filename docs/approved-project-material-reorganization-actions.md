# Approved Project Material Reorganization Actions

Date: 2026-07-10

## Purpose

ThinkIO can classify project material, but it cannot silently move, delete, promote, reject, or archive files.

Project material reorganization is a governed action.

## Action Types

Supported action types:

- `label`;
- `move`;
- `archive`;
- `promote-import`;
- `reject-import`;
- `delete`.

## Approval Boundary

Low-risk labeling can be planned without approval.

These actions require approval:

- moving project material;
- archiving project material;
- promoting candidate imports;
- deleting material;
- deleting canonical task/source material is blocked.

## Dry-Run Rule

ThinkIO creates a dry-run reorganization plan first.

The plan lists:

- proposed action;
- source path;
- optional target path;
- sensitivity;
- rationale;
- blockers.

The plan does not perform file operations.

## Current Implementation

Runtime model:

- `kernel/project-materials.ts`

Validation coverage:

- `tests/project-materials.test.ts`

## Follow-Up Boundary

Actual file operations should only be added after a separate approval-aware implementation task.

