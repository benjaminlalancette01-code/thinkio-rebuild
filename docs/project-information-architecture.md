# Project Information Architecture

Date: 2026-07-09

## Purpose

ThinkIO project knowledge is spread across tasks, generated state, views, docs, audits, and imports. This architecture defines how ThinkIO classifies that material when it evaluates a project.

This is a runtime rule, not only a documentation convention.

## Folder Authority

| Folder | Role | Authority |
|---|---|---|
| `tasks/` | Governed task JSON and task notes | Canonical task source |
| `.devtool/features/` | Open visual mirror cards | Visual mirror only |
| `.devtool/features/done/` | Completed visual mirror cards | Historical visual mirror |
| `state/` | Generated support state | Generated, not canonical unless a schema says otherwise |
| `views/` | Generated UI projections | Generated view state |
| `docs/` | Current guidance, boundaries, reports, and runbooks | Current unless superseded |
| `audit/` | Dated audit evidence | Historical evidence |
| `imports/accepted/` | Imported material accepted into the rebuild | Imported evidence |
| `imports/candidates/` | Imported material still requiring review | Review-needed imported evidence |
| `imports/rejected/` | Imported material rejected or preserved only for context | Rejected reference |

## Project Material Evaluation Trigger

Run project material evaluation when:

- new project documentation, audit reports, or imports are added;
- current-state reports are superseded;
- active task state changes enough to alter what is happening now or what is next;
- plugin navigation needs refreshed project orientation;
- material is moved between current, historical, imported, generated, or rejected authority.

The runtime command is:

```text
npm run update:project-materials
```

## Current-State Report Shape

The generated project-state report must explain:

- where the project started;
- what is happening now;
- what work is next;
- what data has already been included, worked on, accepted, rejected, or retained as historical evidence.

Current generated report:

- `docs/project-state-report.md`

## Entrypoints

The human entrypoint is:

- `docs/current-project-hub.md`

The machine-readable project material state is:

- `state/project.materials.json`
- `state/project.knowledge-index.json`

