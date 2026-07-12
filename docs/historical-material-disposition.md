# Historical Material Disposition

Date: 2026-07-09

## Purpose

ThinkIO keeps audits, imports, and superseded reports because they explain how the project got here. Keeping them does not make them current authority.

## Disposition Rules

| Disposition | Meaning | Example |
|---|---|---|
| `canonical-source` | Current source of governed state | `tasks/*.json` |
| `current-guidance` | Current docs and runbooks | `docs/current-project-hub.md` |
| `generated-state` | Runtime-generated state or views | `state/project.graph.json`, `views/kanban.json` |
| `historical-evidence` | Dated audit or review evidence | `audit/*.md` |
| `imported-evidence` | Imported material already accepted into the rebuild | `imports/accepted/*.md` |
| `visual-mirror` | UI/card mirror of canonical state | `.devtool/features/*.md` |
| `stale-superseded` | Older current-state report superseded by a newer report | `docs/current-project-state-report-2026-07-04.md` |
| `review-needed` | Imported material still requiring review | `imports/candidates/*.md` |
| `rejected-reference` | Rejected material retained only for reference | `imports/rejected/*.md` |

## Reorganization Rule

Project material can be reorganized only after classification.

Allowed without approval:

- updating generated material maps;
- adding navigation links;
- marking historical material as historical in docs.

Requires explicit task or approval:

- moving canonical task files;
- deleting historical evidence;
- promoting candidate imports;
- changing generated state into canonical state.

## Report Inputs

The project-state report may use:

- canonical tasks;
- current docs;
- generated state/views;
- accepted imports;
- audits and superseded reports as historical evidence.

The report must label historical material as historical.

