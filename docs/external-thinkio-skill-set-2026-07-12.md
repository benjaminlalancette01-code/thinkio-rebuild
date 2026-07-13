# External ThinkIO Skill Set - 2026-07-12

Six external-facing ThinkIO skills were created from the salvageable, non-native portion of the deprecated skill architecture.

## Created Skills

- `thinkio-workspace-operator`: safe external operation inside a ThinkIO repo.
- `thinkio-legacy-recovery`: archive-to-rebuild comparison and native translation.
- `thinkio-independent-audit`: bounded external review without mutation.
- `thinkio-export-assistant`: governed handoffs, exports, and review bundles.
- `thinkio-capability-proposal`: rough idea or friction to candidate capability proposal.
- `thinkio-ui-review`: plugin UI review against runtime governance.

## Boundary

These skills are external adapters. They can orient, review, propose, package, or recover evidence, but they must not define canonical state or bypass ThinkIO task, schema, runtime, approval, and validation boundaries.

## Validation

The skills were initialized with `skill-creator` and validated with `quick_validate.py` after installing `pyyaml`.
