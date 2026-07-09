# Canonical Runtime Persistence Boundary

## Decision

The VS Code plugin may persist UI state and proposal evidence now.

The plugin must not directly persist canonical runtime mutations from webview code.

Canonical runtime writes remain gated by governed mutation transactions, approvals, checkpoints, ledger effects, and rollback records.

## Persistence Classes

### UI-Only Plugin State

Stored through VS Code workspace state:

- selected record;
- collapsed groups;
- layout hints;
- zoom and pan;
- trace visibility mode;
- last refresh time.

This state may improve the user experience, but it has no authority over task status, task authority, evidence, checkpoints, approvals, or file writes.

### Proposal And Interaction Evidence

Stored through plugin interaction stores:

- interaction logs;
- task proposals;
- command intent records;
- result references.

These records are evidence or proposals. They are not canonical task state.

They may become inputs to review, approval, deferred work, task creation, or mutation planning, but they cannot become canonical by being stored in workspace state.

### Generated Support State

Generated support state includes:

- `views/*.json`;
- `state/project.graph.json`.

These files support plugin views and graph inspection. They are generated from canonical task/state records or refreshed by runtime scripts.

They do not replace canonical task JSON.

### Canonical Runtime State

Canonical runtime state includes:

- `tasks/*.json`;
- `state/approvals.json`;
- `state/checkpoints.json`;
- `state/ledger.json`;
- `state/artifact-chains.json`;
- `state/deferred.json`;
- mutation rollback records;
- accepted runtime state files governed by schemas.

Canonical runtime writes require the mutation boundary.

## Mutation Boundary

A canonical mutation must pass through:

1. proposal or command intent;
2. governance decision;
3. approval when required;
4. mutation transaction planning;
5. checkpoint and ledger effects;
6. atomic mutation application;
7. rollback record;
8. projection refresh.

Webviews cannot skip this path.

## Plugin Readiness Impact

The current local plugin can proceed to packaging/install validation if packaging describes the plugin as:

- projection-based;
- proposal-first;
- approval-gated for canonical mutation;
- not yet a direct canonical runtime writer from the UI.

`thinkio.applyApprovedProposal` may stay registered as a command route, but real file/state mutation must remain behind approved mutation transaction handling.

TASK-081 should validate packaging and install behavior without claiming marketplace-grade persistence or direct runtime write support.

## Current Boundary

Allowed now:

- workspace UI state persistence;
- interaction log persistence;
- task proposal persistence;
- generated projection refresh;
- structured command results and blockers.

Blocked now:

- direct webview writes to `tasks/*.json`;
- direct webview writes to `state/*.json`;
- treating workspace state as canonical;
- applying provider/model output without governance;
- packaging the plugin as a fully persistent project runtime before mutation persistence is explicitly validated.
