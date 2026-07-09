# Task Intake Priority Reorder Workflow

## Purpose

ThinkIO needs a standing rule for new work:

When a task, idea, or deferred item is added, ThinkIO reviews the whole open set and reorders it against the current objective.

The goal is not to keep tasks sorted by creation date. The goal is to keep the next work aligned with the current state of the project.

## Current Objective

The current objective is:

Make ThinkIO usable as a local VS Code plugin while preserving the governed runtime boundary.

This objective controls promotion and ordering until it is replaced by a newer accepted objective.

## Input Sources

Every reorder pass should read:

- `tasks/*.json` for canonical task state;
- `.devtool/features/*.md` for visual mirror order and priority;
- `state/deferred.json` for deferred work;
- `state/project.graph.json` for dependency and graph coverage;
- `views/dashboard.json` for active counts;
- current audit and priority docs;
- the latest accepted user intent.

## Trigger Conditions

Run a reorder review when:

- a new task is added;
- an idea is promoted;
- a candidate is completed;
- a dependency changes;
- a deferred item becomes relevant;
- the current objective changes;
- a plugin-hardening task exposes a new blocker.

## Candidate Promotion Test

Promote an idea to candidate only when it satisfies at least one condition:

- it blocks the current objective;
- it protects canonical state from likely drift;
- it is required before local plugin validation can be trusted;
- it is required before packaging/install validation;
- it resolves a dependency needed by an existing candidate.

Do not promote an idea only because it is important to the full product vision.

## Candidate Ordering Test

Order candidates by this sequence:

1. State trust and source-of-truth repair.
2. Repeatable local execution workflow.
3. Security and message-boundary hardening.
4. Live refresh and projection correctness.
5. Governance visibility in the UI.
6. Canonical persistence and mutation boundary review.
7. Packaging/install validation.
8. Automated smoke coverage.

If a new candidate enters the queue, place it at the earliest point where its output is needed by later candidates.

## Idea Ordering Test

Order ideas by promotion likelihood:

1. likely to affect current plugin blockers;
2. likely to affect model/provider interaction;
3. likely to affect proposal, quarantine, or review flows;
4. broader project/product features;
5. marketplace, release polish, sync, and standalone-app expansion.

Ideas stay ideas until their promotion condition becomes concrete.

## Deferred Item Rule

Deferred items are not invisible backlog.

During reorder review, check whether any deferred item:

- is now unblocked;
- is now a dependency of current candidates;
- conflicts with current objective;
- should become an idea task;
- should remain deferred with a reason.

Deferred work should not jump directly to candidate without the same promotion test as ideas.

## Visual Card Rule

Canonical status lives in `tasks/*.json`.

Visual priority and order live in `.devtool/features/*.md`.

After a reorder pass:

- candidate cards use `order: "c001"`, `c002`, and so on;
- idea cards use `order: "i001"`, `i002`, and so on;
- priority is `high`, `medium`, or `low`;
- generated views are refreshed with `npm run update:views`;
- validation is run with `npm run check`.

`npm run check` includes `npm run validate:task-order`, which verifies that open candidate/idea task JSON and `.devtool/features` cards agree and that open card ordering is contiguous.

## Required Output

Every reorder pass should leave behind one short priority note or update the current one.

That note should record:

- current objective;
- promoted tasks;
- demoted tasks, if any;
- candidate order;
- idea order;
- deferred items that changed;
- validation result.
