# Open Task Priority Review

Date: 2026-07-09

## Current Objective

Make ThinkIO usable as a local VS Code plugin while making the current project state easy to find, trust, and maintain.

## Trigger

All previous tasks are done, but current ThinkIO knowledge is spread across multiple folders:

- `docs/`;
- `audit/`;
- `imports/`;
- `tasks/`;
- `state/`;
- `views/`;
- `.devtool/features/`.

The next queue should organize that information before more product features are added.

The source-map, navigation, and historical classification work is not just documentation. It defines a reusable ThinkIO project-material evaluation loop: classify the project material, reorganize it by authority/disposition, and produce a project-state report.

## Candidate Order

1. TASK-092: Define project information architecture and source map.
2. TASK-093: Create current project navigation hub.
3. TASK-094: Classify historical import and audit material.
4. TASK-100: Add project material evaluation runtime workflow.
5. TASK-098: Evaluate generated project knowledge index.
6. TASK-095: Add documentation manifest and link validation.
7. TASK-096: Surface project navigation in plugin.
8. TASK-097: Define current-state report maintenance workflow.

## Idea Order

1. TASK-099: Evaluate in-plugin project search and retrieval.

## Why This Order

TASK-092 comes first because the project needs a source-of-truth map before creating another navigation document.

TASK-093 follows because users need one obvious project entrypoint.

TASK-094 separates current guidance from historical evidence.

TASK-100 turns the source map and material classification rules into a kernel/runtime workflow that can classify project material and generate a project-state report.

TASK-098 is promoted because the generated project knowledge index is an output of the project-material evaluator.

TASK-095 adds validation so the new map and evaluator outputs do not drift.

TASK-096 brings the organized map and report into the local VS Code plugin after file-level trust exists.

TASK-097 defines how current-state reports stay current after this pass.

TASK-099 stays an idea because search/retrieval should wait until the project material map is stable in local plugin use.

## Expected Outcome

After this queue, ThinkIO should have:

- one current project entrypoint;
- clear folder authority;
- historical reports that are labeled as historical;
- a runtime-backed project-material evaluator;
- a project-state report covering project origin, current activity, next work, and already-included data;
- validation around important documentation links;
- plugin-visible navigation for current project state;
- a workflow for future report maintenance.
