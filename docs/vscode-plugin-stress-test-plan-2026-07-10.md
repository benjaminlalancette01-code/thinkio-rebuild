# VS Code Plugin Stress Test Plan

Date: 2026-07-10

## Purpose

The next phase should test ThinkIO as a real local VS Code plugin, not only as kernel code and projection files.

Each stress test should produce a short report and create follow-up tasks for any real blocker.

## Stress Areas

1. Extension Host activation and view lifecycle.
2. Cross-view projection refresh under repeated file changes.
3. Project Navigation readability and search behavior.
4. Command routing and governance blocker display.
5. Runtime Composer and Proposal Review repeated-use behavior.
6. Local VSIX install, uninstall, reinstall, and clean workspace behavior.

## Reporting Rule

Each stress task must leave a report in `audit/` or `docs/` and classify findings as:

- blocker;
- usability issue;
- missing validation;
- future idea;
- no action.

Findings that affect local plugin use should become candidate tasks.

