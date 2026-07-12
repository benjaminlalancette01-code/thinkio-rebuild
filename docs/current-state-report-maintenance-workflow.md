# Current-State Report Maintenance Workflow

Date: 2026-07-09

## Purpose

ThinkIO should never accumulate several competing current-state reports.

## Current Report Pointer

The generated current project-state report is:

- `docs/project-state-report.md`

The human navigation entrypoint is:

- `docs/current-project-hub.md`

Older dated reports stay available as historical evidence.

## Update Trigger

Run:

```text
npm run update:project-materials
```

when:

- active candidate or idea tasks change;
- a new audit, report, or import is added;
- a project material file changes disposition;
- plugin navigation needs a refreshed report;
- a project closeout changes what is next.

## Supersession Rule

Dated reports are retained. Once a newer current-state report or generated project-state report exists, older dated reports become historical evidence.

Do not delete old reports just because they are superseded.

## Validation

Run:

```text
npm run validate:docs
```

or:

```text
npm run check
```

to validate required entrypoints and local links.

