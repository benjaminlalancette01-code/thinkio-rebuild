# TASK-095: Add Documentation Manifest And Link Validation

Add a machine-checkable manifest for important documentation and validate that current navigation links do not drift.

## Purpose

The source map and navigation hub should not become another stale manual document. This task adds validation so important current documents, historical documents, and project entrypoints remain discoverable.

## Scope

- Add a documentation manifest.
- Classify docs as current, generated, historical, import-evidence, or reference.
- Validate required entrypoints exist.
- Validate local links from the hub and manifest.
- Add validation to `npm run check`.
- Validate the project-material evaluator outputs required report/navigation inputs.

## Required Evidence

- `documentation-manifest-added`
- `current-vs-historical-docs-validated`
- `local-link-validation-added`
- `check-script-includes-doc-validation`
## Completion

Completed on 2026-07-09 as part of the project material evaluation and navigation pass. Evidence is recorded in docs/project-material-evaluation-completion-report-2026-07-09.md.
