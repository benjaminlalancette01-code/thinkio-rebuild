# Product Expansion Boundaries

Date: 2026-07-09

## Purpose

This document closes the idea review pass for TASK-070 through TASK-075 and TASK-084 through TASK-090.

The decision is conservative: ThinkIO can keep moving as a local VS Code plugin, while future product surfaces are now named, bounded, and testable. The completed tasks do not turn on remote providers, marketplace publishing, cross-machine sync, or a standalone chat app by default.

## Completed Idea Decisions

### TASK-084 User-Facing Rule Policy Model

ThinkIO now has a rule policy boundary with these tiers:

- locked;
- default-on;
- opt-in;
- custom;
- provider-overlay.

Locked rules are not user editable. Custom rules are user editable. Provider overlays require provider identity. Rule conflicts, such as allowing and blocking the same scope, are detected.

Promotion trigger:

Promote a fuller rule manager only when users need to edit rules from the plugin UI or when provider overlays become active runtime behavior.

### TASK-086 Provider Registry And Capability Model

ThinkIO now has a provider registry boundary with:

- provider identity;
- capability profile;
- trust profile;
- context and normalizer metadata;
- secret environment key requirements;
- rule overlay links.

Remote providers require explicit secret boundaries. Provider selection is capability-aware.

Promotion trigger:

Promote real provider registry storage before enabling remote provider calls.

### TASK-088 Chat Session And Provider Turn Ingest Model

ThinkIO now has chat session, turn, and provider-call records for future composer/provider work.

Rules:

- chat sessions are not canonical;
- provider turns require provider call records;
- turns must attach to runtime records;
- raw transcript storage remains policy-gated.

Promotion trigger:

Promote full session persistence when runtime composer starts making real provider calls.

### TASK-072 Remote Model Provider Integration

Remote provider integration remains off by default.

Required before enabling:

- provider registry ready;
- secrets outside workspace files;
- cost limit;
- network failure fallback to defer;
- governed output ingest.

Promotion trigger:

Promote implementation after TASK-086 and TASK-088 are ready for active runtime use.

### TASK-085 Artifact Disposition And Quarantine Model

ThinkIO now has a unified artifact disposition vocabulary:

- canonical;
- provisional;
- quarantined;
- superseded;
- stale;
- rejected;
- historical-reference;
- unsafe-to-promote.

Promotion trigger:

Promote UI actions when proposal review or archive recovery needs user-driven quarantine, supersession, or stale-artifact handling.

### TASK-089 Project Management And Decision Layer

ThinkIO now has a project decision record boundary for:

- decisions;
- milestones;
- risks;
- requirements;
- release records.

This supplements governed tasks; it does not replace task authority.

Promotion trigger:

Promote a richer dashboard when local plugin use needs project planning beyond task Kanban.

### TASK-090 Runtime Maturity Ledger

ThinkIO now has a maturity stage taxonomy:

- design-only;
- schema-defined;
- runtime-enforced;
- UI-exposed;
- tested;
- local-usable;
- release-ready.

Release-ready entries cannot have blockers.

Promotion trigger:

Promote generated maturity reports before public release or when partially implemented subsystems become hard to classify.

### TASK-087 Multi-Project Registry And Profile Model

ThinkIO remains workspace-first.

The future registry model includes:

- active project id;
- project profiles;
- config paths;
- provider and rule profile links.

Cross-project dependencies are blocked until explicit future governance exists.

Promotion trigger:

Promote after single-workspace plugin use is stable.

### TASK-074 Transcript-Grade Audit Capture Implementation

Transcript-grade capture remains opt-in and non-canonical.

Required before enabling:

- explicit storage boundary;
- redaction;
- no default capture;
- no transcript-as-canonical-state behavior.

Promotion trigger:

Promote when trace/audit mode becomes a user workflow.

### TASK-075 Cross-Machine Plugin State Sync

Cross-machine sync remains non-MVP.

Rules:

- manual-review conflict resolution is required;
- provider secrets must not sync;
- canonical runtime state must not sync as plugin UI state.

Promotion trigger:

Promote after one-workspace local plugin behavior is stable and there is a real multi-device use case.

### TASK-070 Marketplace Publishing Metadata Policy

Marketplace publishing requires approved public metadata:

- display name;
- publisher;
- category;
- icon path;
- approved description;
- clear local-MVP scope label.

Promotion trigger:

Promote when the extension is ready for public marketplace packaging.

### TASK-071 Signed Release And Installer Polish

Signed releases require:

- VSIX artifact;
- checksum;
- signature;
- smoke validation;
- platform install notes.

Promotion trigger:

Promote before external distribution.

### TASK-073 Full Standalone App Chatbox

The future standalone chatbox must preserve ThinkIO authority:

- no ungoverned direct model chat in the VS Code plugin;
- route through the composer;
- create governed runtime records;
- keep chat transcript non-canonical.

Promotion trigger:

Promote after VS Code composer behavior is proven and a standalone app plan exists.

## Current Boundary

Allowed now:

- local VS Code plugin use;
- runtime composer shell;
- proposal review;
- local VSIX packaging;
- governed interaction logging;
- future provider/session/rule metadata as local runtime records.

Not allowed by default:

- remote model calls;
- workspace-stored provider secrets;
- marketplace release claims;
- signed public releases;
- cross-machine state sync;
- transcript-grade capture;
- standalone direct chat.

## Validation

Runtime coverage lives in:

- `kernel/product-expansion-boundaries.ts`;
- `tests/product-expansion-boundaries.test.ts`.

