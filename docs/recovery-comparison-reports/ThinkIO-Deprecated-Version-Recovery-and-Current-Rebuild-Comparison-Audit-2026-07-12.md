# ThinkIO Deprecated-Version Recovery and Current-Rebuild Comparison Audit

**Date:** July 12, 2026  
**Audit subject:** Deprecated ThinkIO skill-stack, architecture, planning files, historical design evidence, and their relationship to the current `thinkio-rebuild` workspace  
**Primary goal:** Identify planned ThinkIO elements that were lost, weakened, partially translated, deferred, or insufficiently carried forward through refactors and rebuilds  
**Current comparison target:** `thinkio-rebuild`  
**Historical evidence sources:** Deprecated skill bundle, project-artifact template, architecture and protocol documents, skill definitions, current archive index, historical audit reports, imported concept notes, Git history, and current task records

---

# Executive Summary

The current ThinkIO rebuild is substantially stronger than the deprecated system in several important ways.

It has replaced a chat-centered artifact continuity model with:

- governed task records;
- explicit task and authority transitions;
- CUE schemas;
- deterministic TypeScript kernel functions;
- runtime validation;
- execution windows;
- approvals;
- work packages;
- provider-output intake boundaries;
- checkpoints;
- project-material classification;
- generated project graphs and views;
- a functioning VS Code extension shell;
- tests and packaging validation;
- Git-backed local continuity.

This translation was directionally correct.

However, the audit also found that the refactor did not carry every useful capability forward.

The main loss was not individual old files. It was a set of **project-operating loops** that the deprecated architecture attempted to preserve through artifacts and skills:

1. deterministic project bootstrap;
2. explicit project profile and workspace-root governance;
3. session re-entry and orientation;
4. authoritative next-action resolution;
5. per-project operating behavior;
6. durable decision and lock-in history;
7. structured project review runs;
8. promotion thresholds for recurring behavior;
9. system-evolution tracking;
10. UI requirement traceability;
11. capability maturity and implementation coverage;
12. export and external-handoff profiles;
13. semantic naming governance;
14. friction-to-capability promotion;
15. full lifecycle linkage between planned behavior, implementation, tests, views, and user-visible readiness.

Some of these concepts exist in the rebuild as kernel primitives or design documents. Several others exist only as:

- evaluation tasks;
- candidate boundaries;
- prose decisions;
- unintegrated types;
- isolated tests;
- historical audit findings;
- command registrations without complete user workflows.

The most important finding is:

> **The rebuild has successfully native-ized many low-level governance mechanisms, but some of the old system’s higher-level operating intelligence has not yet been reassembled into complete native workflows.**

This creates a risk that ThinkIO becomes:

```text
technically governed
but operationally interpreted by Codex
```

Codex can read local files and perform work, but it still often has to manually determine:

- which task is truly active;
- which files are relevant;
- whether the worktree matches the governed task;
- what the next valid action is;
- whether a design-only capability is actually usable;
- which old decision still applies;
- whether a session can safely close;
- whether a repeated workaround should become a native capability;
- whether a UI surface accurately represents runtime behavior.

The report therefore recommends a focused recovery program. It does **not** recommend restoring the old artifact-first stack. It recommends translating the remaining useful intent into native ThinkIO capabilities.

---

# 1. Audit Scope

## 1.1 Historical corpus

The historical corpus used in this audit includes:

- the deprecated all-skills bundle;
- editable skill sources;
- packaged skill ZIPs;
- `project-artifacts-template/`;
- JSON schemas and examples;
- archived architecture plans;
- bootstrap protocol;
- handoff protocol;
- canonical/non-canonical rules;
- Codex/VS Code rules;
- project repository structure;
- workspace-map schema;
- end-of-chat validation checklist;
- system-review documents;
- experiment-analysis and skill-promotion design;
- current rebuild audit reports describing v1.1.1 and earlier intent;
- current import candidates and accepted imports;
- Git history included in the rebuild.

## 1.2 Current corpus

The current comparison corpus includes:

- `AGENTS.md`;
- `thinkio.config.json`;
- `package.json`;
- `tasks/*.json`;
- `tasks/*.md`;
- `state/*.json`;
- `schemas/*.cue`;
- `kernel/*.ts`;
- `runtime/*.ts`;
- `extension/`;
- `media/`;
- `views/`;
- `docs/`;
- `audit/`;
- `archive-index/`;
- `imports/`;
- tests;
- Git status and history.

## 1.3 Excluded from semantic authority

The following were treated as supporting evidence only:

- `node_modules/`;
- generated VSIX contents;
- tool binaries;
- `.git` internals other than commit history and worktree state;
- packaged skill ZIPs when equivalent source files were available;
- generated views when canonical source records were available.

## 1.4 Important limitation

No separate complete pre-rebuild ThinkIO repository was present as a standalone package.

Historical reconstruction therefore relies on:

- the deprecated skill-stack repository;
- historical protocol and template files;
- current audit reports that explicitly reviewed v1.1.1;
- retained task lineage;
- current import and archive policy.

This is sufficient to identify missing concepts and translation gaps, but not to prove every implementation detail of every deprecated version.

---

# 2. Historical Architecture Audit

# 2.1 The deprecated operating model

The deprecated system centered continuity on a canonical artifact folder:

```text
project-artifacts/
  00-meta/
  01-vision/
  02-modules/
  03-ui/
  04-priority/
  05-connections/
  06-execution/
  07-review/
  handoff/
```

The minimum permanent JSON layer was:

- `project-bootstrap.json`;
- `project-state.json`;
- `artifact-index.json`.

Conditional JSON included:

- `module-list.json`;
- `dependency-graph.json`;
- `agent-prompts.json`.

The system expected ChatGPT or another model to maintain canonical continuity by updating these artifacts before handoff.

## Strengths

The old architecture recognized several real problems:

- chat memory is not reliable authority;
- continuity must be externalized;
- the next step must be explicit;
- generated implementation does not automatically become project truth;
- project structure needs declared roots;
- decisions need to be locked in;
- recurring workflows should be promoted;
- project-specific behavior should be persisted;
- review should produce system evolution.

## Weaknesses

Its enforcement model was weak:

- Markdown and JSON files depended on model discipline;
- canonical artifacts could become stale;
- multiple skills could mutate overlapping project state;
- handoff packaging was expensive;
- session continuity depended on artifact refresh rituals;
- validation was mostly procedural;
- Git and local implementation state were secondary;
- no deterministic runtime owned the full state transition model.

The rebuild correctly moved away from this model.

---

# 2.2 Historical bootstrap design

The old bootstrap protocol attempted to determine whether a project was:

- fresh;
- active;
- resumed;
- handoff-ready.

It also collected:

- project name;
- project size;
- workspace preset;
- project type;
- first planning step.

Workspace presets included:

- `single-app`;
- `multi-app`;
- `fullstack`.

The old system also required declared roots and prohibited undeclared app, service, or package roots.

## Recovered intent

This was not merely template convenience.

It encoded four architectural functions:

1. project identity;
2. workspace topology;
3. allowed root boundaries;
4. initial operating profile.

These functions remain relevant in a local runtime.

---

# 2.3 Historical project-mode and assistant-behavior design

The deprecated bundle introduced:

- `project-mode.md`;
- `assistant-operating-rules.md`;
- full-reply capture modes;
- project-specific review behavior;
- stronger lock-in behavior;
- system-experiment modes.

## Recovered intent

The useful core was:

> A project should be able to define operating behavior that is stronger or more specific than global defaults.

The current task-mode system partially carries this intent, but task mode and project behavior profile are not equivalent.

Task mode describes the governance strictness or work style of a task.

A project behavior profile may define:

- archive-reading defaults;
- trace requirements;
- review cadence;
- provider restrictions;
- required validation sets;
- allowed project roots;
- documentation requirements;
- decision-record requirements;
- export policy;
- UI visibility preferences.

---

# 2.4 Historical decision and lock-in design

The deprecated template introduced:

- `decision-register.md`;
- `lock-in-log.md`;
- promotion notes;
- review/evolution artifacts.

These were intended to prevent stable conclusions from disappearing into chat history.

## Recovered intent

The important functions were:

- durable decision identity;
- rationale;
- alternatives considered;
- acceptance point;
- affected modules;
- supersession;
- reopen conditions;
- relationship to implementation;
- relationship to future tasks.

The current rebuild has governance decision logic and future project-decision boundaries, but no complete durable decision-record workflow is evident in the active state files or extension UI.

---

# 2.5 Historical review and evolution loop

The old review layer included:

- experiment analysis;
- skill opportunities;
- template update notes;
- promotion thresholds;
- system evolution.

This was one of the most valuable ideas in the deprecated architecture.

The intended loop was:

```text
project work
→ observe friction or repeated behavior
→ analyze the interaction
→ decide whether it is project-specific or reusable
→ choose skill/template/flow/project-mode destination
→ record promotion recommendation
→ update the system
```

The old implementation destination—skills and templates—is no longer correct.

The loop itself remains highly valuable.

Its modern form should be:

```text
project work
→ record evidence
→ classify friction or repeated behavior
→ identify candidate capability
→ classify native destination
→ create governed task
→ implement schema/runtime/view/test
→ update capability maturity
```

---

# 2.6 Historical project-support routing

The deprecated system distinguished:

- the main planning orchestrator;
- support-skill routing;
- review routing;
- UI planning routing;
- packaging routing;
- continuity updates.

The old skill implementation created overlap and was not a suitable authority layer.

However, it encoded a useful user-level function:

> Given the current project condition, determine the smallest appropriate support action.

This function is still not clearly exposed as a complete native Next Action Resolver.

---

# 2.7 Historical UI-planning design

The old system separated:

- UI flow planning;
- UI detail planning.

UI flow planning handled:

- user goals;
- navigation;
- journey structure;
- page relationships;
- major states.

UI detail planning handled:

- component behavior;
- interaction rules;
- responsive behavior;
- loading states;
- error states;
- empty states;
- state transitions.

The current rebuild has strong runtime-view contracts and candidate UI presentation tasks, but it does not yet demonstrate a complete native traceability chain from:

```text
user goal
→ flow
→ view
→ command
→ runtime capability
→ visible state
→ acceptance criteria
→ test
```

This gap is especially important because the runtime is more mature than the user-facing presentation layer.

---

# 3. Current ThinkIO Rebuild Audit Summary

# 3.1 Current implementation strength

The rebuild contains a meaningful native architecture.

Implemented areas include:

- task state transitions;
- authority transitions;
- task modes;
- workboards;
- branches and return anchors;
- execution windows;
- approvals;
- checkpoints;
- artifact chains;
- closeout records;
- context packets;
- mode-aware context;
- process ledger entries;
- model input/output contracts;
- provider normalization;
- provider output classification;
- governed intake;
- work packages;
- governance decisions;
- validation stages;
- mutation transactions;
- project-material classification;
- project knowledge indexing;
- project search;
- runtime projections;
- plugin view contracts;
- runtime composer contracts;
- proposal review contracts;
- interaction logs;
- historical chat policies;
- project-expansion boundaries.

This is significantly more enforceable than the old skill stack.

# 3.2 Current task state

The package contains:

- 119 governed tasks;
- 108 marked done;
- 11 marked candidate.

Current candidate work is concentrated in:

- isolated VSIX validation;
- native webview presentation;
- Kanban presentation;
- project navigation UI;
- mind-map presentation;
- runtime-node presentation;
- composer/proposal UI;
- visual stress testing;
- BAML coverage;
- BAML CLI boundary;
- archive path migration review.

# 3.3 Current repository condition

The embedded Git repository shows a large dirty worktree:

- many modified task records;
- modified `.devtool` mirrors;
- multiple modified evaluation records;
- untracked feature files.

This weakens confidence in the exact relationship between:

- committed state;
- package state;
- generated state;
- task completion claims.

The audit therefore treats “done” as task-record status, not automatic proof of integrated user-facing completion.

# 3.4 Current extension surface

The extension declares:

- Task Kanban;
- Artifact Mind Map;
- Runtime Node Diagram;
- Context;
- Proposal Review;
- Runtime Composer;
- Project Navigation.

It also declares commands for:

- refresh;
- select/open record;
- mode switching;
- task proposals;
- work packages;
- provider output intake;
- approvals;
- deferral;
- proposal rejection/application;
- interaction logging;
- runtime composer;
- project-material evaluation and search.

This is a strong shell.

However, the remaining candidate tasks show that much of the native visual presentation is still unfinished.

---

# 4. Translation Outcome Matrix

| Historical capability | Current translation | Audit status |
|---|---|---|
| Canonical project artifacts | Governed tasks, state, schemas, runtime | Strongly translated |
| Artifact index | Project-material registry and knowledge index | Strongly translated |
| Dependency graph | Project graph and mind-map projection | Strongly translated |
| Handoff continuity | Checkpoints, closeout, Git, work packages | Partially translated |
| Project state | Task/state JSON and generated reports | Strongly translated |
| Next-step file | No complete native next-action resolver | Missing workflow |
| Bootstrap protocol | `AGENTS.md`, config, manual reading | Partial |
| Workspace map | Fixed roots in config and conventions | Incomplete |
| Declared root enforcement | “work only inside” rule | Weakly enforced |
| Project presets | No active single/multi/fullstack profile | Missing |
| Project mode | Task modes and mode policy | Partial |
| Assistant operating rules | `AGENTS.md` | Partial and global |
| Decision register | Governance decision functions and future boundary | Incomplete |
| Lock-in log | Checkpoints and approvals | Partial |
| Experiment analysis | Historical audits and friction model | Partial |
| Promotion thresholds | Product promotion triggers in prose | Partial |
| System evolution log | Task history and audits | Incomplete |
| Skill opportunity detection | Friction signal and capability ideas | Partial |
| Skill extraction | No complete native promotion classifier | Missing workflow |
| Project support router | Commands and task runtime | No unified resolver |
| Project orchestrator | Runtime and command registry | Partial |
| UI flow planner | UI roadmap and candidate presentation tasks | Partial |
| UI detail planner | View contracts and visual tasks | Partial |
| End-of-chat validation | Closeout record model | Model exists, workflow incomplete |
| Artifact packager | Work-package and package-history models | Partial |
| Export profiles | No mature user-facing export subsystem | Missing |
| Naming enforcer | File conventions and schemas | Partial |
| Semantic naming registry | Glossary only | Missing |
| Maturity tracking | Maturity taxonomy in boundary code/docs | Not operationalized |
| Provider capability registry | Boundary exists | Deferred |
| Rule policy model | Boundary exists | Deferred |
| Quarantine/disposition | Vocabulary exists | Deferred |
| Multi-project profiles | Boundary exists | Deferred |
| Project management layer | Boundary exists | Deferred |
| Transcript-grade audit | Policy exists | Deferred |
| Cross-machine continuity | Intentionally deferred | Correctly deferred |

---

# 5. Important Distinction: Implemented, Modeled, and Evaluated

One of the largest audit risks is the use of “completed” for evaluation tasks.

Several current tasks are marked done because the project:

- evaluated a capability;
- defined its boundary;
- documented a promotion trigger;
- added a type or test.

That does not necessarily mean the capability is usable.

The following maturity states should be distinguished:

1. historical idea;
2. documented boundary;
3. type defined;
4. schema defined;
5. deterministic function implemented;
6. runtime-integrated;
7. command-exposed;
8. UI-exposed;
9. tested;
10. locally usable;
11. release-ready.

The project already defined a similar maturity taxonomy, but it has not yet made it an active generated ledger.

This missing maturity ledger is itself one of the highest-value recovery opportunities.

---

# 6. Missing or Incompletely Carried-Forward Native Functions

# 6.1 Session Bootstrap Resolver

## Historical source

- bootstrap protocol;
- canonical reading order;
- Codex/VS Code rules;
- v1.1.1 reentry grounding;
- project state and next-step artifacts.

## Current coverage

- `AGENTS.md`;
- `thinkio.config.json`;
- task and state files;
- context packet builder;
- runtime readiness functions.

## Gap

There is no clear single native workflow that returns:

- active project;
- active task;
- current branch;
- worktree cleanliness;
- active execution window;
- active approval;
- current checkpoint;
- relevant context files;
- generated-view freshness;
- blockers;
- next valid action.

## Recommendation

Create a native `SessionBootstrapResult`.

Suggested output:

```text
projectId
repositoryState
activeTask
activeWorkSlice
executionWindow
approvals
checkpoint
contextPacket
changedFiles
taskScopeMismatch
validationState
blockers
nextValidAction
```

This should be available as:

- runtime command;
- VS Code command;
- Context view;
- machine-readable JSON record.

## Priority

Critical.

---

# 6.2 Next Action Resolver

## Historical source

- `next-step.md`;
- project-stack orchestrator;
- project-support router;
- fail-safe objective to route the smallest useful step.

## Current coverage

- task state machine;
- execution windows;
- mode policy;
- governance decisions;
- runtime readiness.

## Gap

The primitives exist, but no single resolver appears to determine the smallest currently authorized action.

## Recommendation

Implement a resolver that considers:

- current task;
- status;
- dependencies;
- branch state;
- workboard step;
- approvals;
- execution window;
- mode;
- validation blockers;
- worktree state;
- project-material requirements;
- pending proposals.

Possible result:

```text
action
reason
requiredContext
requiredApproval
blockingRecords
allowedCommands
stopConditions
```

## Priority

Critical.

---

# 6.3 Workspace Topology and Root Policy

## Historical source

- workspace-map schema;
- single-app/multi-app/fullstack presets;
- declared-root enforcement.

## Current coverage

- fixed root names in `thinkio.config.json`;
- `AGENTS.md` instruction to work inside the rebuild.

## Gap

The current config identifies authority, state, schema, and runtime roots, but not a complete project topology.

Missing functions include:

- declared application roots;
- service roots;
- package roots;
- documentation roots;
- generated-output roots;
- prohibited roots;
- external mount boundaries;
- per-root authority and mutation policy.

## Recommendation

Create a native project profile and workspace topology schema.

Example:

```text
projectProfile
workspacePreset
roots[]
root.kind
root.authority
root.mutable
root.generated
root.external
root.allowedTaskScopes
```

## Priority

High.

---

# 6.4 Project Behavior Profile

## Historical source

- `project-mode.md`;
- `assistant-operating-rules.md`;
- project-specific modes.

## Current coverage

- task modes;
- mode policy;
- `AGENTS.md`;
- global config.

## Gap

Task mode does not fully replace project-level operating policy.

## Recommendation

Add a governed project profile that can define:

- default mode;
- archive-read policy;
- trace policy;
- validation profile;
- review cadence;
- required decision records;
- provider policy;
- export policy;
- UI behavior;
- documentation requirements;
- root policy;
- project-specific terminology.

Locked rules should remain non-editable.

## Priority

High.

---

# 6.5 Durable Decision Record and Supersession Workflow

## Historical source

- decision register;
- lock-in log;
- project evolution review.

## Current coverage

- governance decision functions;
- project-management decision boundary;
- checkpoints;
- task history.

## Gap

No active decision registry is evident.

## Recommendation

Create native decision records with:

- ID;
- title;
- status;
- decision;
- rationale;
- alternatives;
- evidence;
- affected capabilities;
- affected tasks;
- accepted-by;
- accepted-at;
- supersedes;
- superseded-by;
- reopen conditions;
- implementation status.

Expose decisions in Project Navigation and Context views.

## Priority

High.

---

# 6.6 Lock-In and Acceptance Ledger

## Historical source

- lock-in log;
- explicit stable-finding preservation.

## Current coverage

- approvals;
- checkpoints;
- authority transitions.

## Gap

A checkpoint records a state boundary, but not every accepted conceptual conclusion is naturally a checkpoint.

## Recommendation

Add an acceptance ledger for:

- accepted findings;
- accepted terminology;
- accepted architecture decisions;
- accepted constraints;
- accepted UI behavior;
- accepted external evidence.

This may be implemented through decision records rather than as a separate subsystem.

## Priority

Medium-high.

---

# 6.7 Capability Promotion Classifier

## Historical source

- skill-opportunity auditor;
- extract-skill-from-workflow;
- promotion thresholds;
- template update notes.

## Current coverage

- friction signal model;
- derivation reports;
- task intake;
- product promotion triggers.

## Gap

No complete native classifier determines whether repeated behavior belongs in:

- CUE;
- JSON;
- TypeScript;
- BAML;
- command;
- view;
- documentation;
- provider adapter;
- external skill;
- agent contract;
- project-specific rule.

## Recommendation

Implement a capability proposal and classification workflow.

The classifier should evaluate:

- recurrence;
- authority impact;
- determinism;
- statefulness;
- user visibility;
- provider specificity;
- model dependence;
- validation requirements;
- reuse scope;
- security risk.

## Priority

Critical for future evolution.

---

# 6.8 Capability Registry

## Historical source

- system evolution;
- skill library review;
- skill maturity and trigger audits.

## Current coverage

- task list;
- glossary;
- source code;
- maturity taxonomy.

## Gap

There is no single registry connecting a capability to:

- source files;
- schema;
- runtime functions;
- commands;
- views;
- tests;
- docs;
- maturity;
- limitations;
- supersession.

## Recommendation

Create a generated capability registry.

Example entry:

```text
capabilityId
name
owner
authority
status
maturity
schemaPaths
runtimePaths
commandIds
viewIds
testPaths
taskIds
decisionIds
knownLimitations
promotionTrigger
supersedes
```

## Priority

Critical.

---

# 6.9 Runtime Maturity Ledger

## Historical source

- review and promotion thresholds;
- later task 090.

## Current coverage

- maturity taxonomy in documentation and boundary code.

## Gap

The maturity taxonomy is not a generated operational report.

## Recommendation

Generate the ledger from the capability registry and repository evidence.

Do not infer “UI-exposed” merely because a command is registered.

Require direct evidence for each stage.

## Priority

Critical because task status currently overstates some capabilities.

---

# 6.10 Structured Review Runs

## Historical source

- review-project-loop;
- analyze-project-experiment;
- end-of-chat validation;
- system evolution review.

## Current coverage

- audit documents;
- tests;
- friction signals;
- project-material evaluation.

## Gap

Reviews are still mostly ad hoc reports.

## Recommendation

Define native review profiles:

- state integrity;
- task/worktree alignment;
- architecture drift;
- runtime behavior;
- UI traceability;
- documentation drift;
- release readiness;
- provider boundary;
- archive recovery;
- experiment outcome.

Each run should produce a structured record with:

- scope;
- evidence;
- findings;
- severity;
- proposed tasks;
- accepted/rejected status;
- follow-up.

## Priority

High.

---

# 6.11 Friction-to-Capability Loop

## Historical source

- skill opportunity auditor;
- experiment analysis;
- template update notes.

## Current coverage

- friction signal type;
- runtime/UI surfacing task;
- task intake.

## Gap

The full promotion loop is incomplete.

## Recommendation

Connect:

```text
friction signal
→ grouping/deduplication
→ recurrence threshold
→ capability proposal
→ classifier
→ governed task
→ implementation
→ validation
→ closure
```

## Priority

High.

---

# 6.12 UI Requirement Traceability

## Historical source

- UI flow planner;
- UI detail planner.

## Current coverage

- plugin view contracts;
- candidate native presentation tasks;
- UI audit reports.

## Gap

The project lacks a durable traceability model connecting requirements to implementation and tests.

## Recommendation

Create records for:

- user goal;
- user flow;
- screen/view;
- state;
- command;
- runtime function;
- blocker;
- acceptance criterion;
- test;
- visual evidence.

## Priority

Critical for the current product phase.

---

# 6.13 Session Closeout Resolver

## Historical source

- end-of-chat checklist;
- handoff protocol;
- v1.1.1 closeout.

## Current coverage

- closeout record type and validation;
- checkpoints;
- package history.

## Gap

The model exists, but there is no clearly complete operator workflow that:

- detects changed files;
- maps them to task scope;
- runs required validations;
- verifies generated projections;
- records decisions;
- writes closeout;
- updates checkpoint;
- produces a resume anchor.

## Recommendation

Add a native closeout command and VS Code surface.

## Priority

Critical.

---

# 6.14 Worktree-to-Task Reconciliation

## Historical source

The old system tried to reflect implementation discoveries back into canonical artifacts.

## Current coverage

- Git;
- task scope;
- mutation transactions.

## Gap

The current package itself demonstrates the problem: many modified files and untracked mirrors exist without a clean task-bound checkpoint.

## Recommendation

Implement:

- changed-file inventory;
- changed-file to task mapping;
- generated/source distinction;
- mixed-task detection;
- out-of-scope warning;
- stale mirror detection;
- checkpoint eligibility.

## Priority

Critical.

---

# 6.15 Export Profiles and External Continuity

## Historical source

- artifact packager;
- handoff protocol;
- cross-chat package.

## Current coverage

- work package;
- package history;
- checksums;
- VSIX packaging.

## Gap

The rebuild correctly avoids routine handoff packages, but still needs explicit export profiles for:

- release;
- audit;
- archival checkpoint;
- external review;
- cross-machine continuation;
- provider evaluation;
- migration.

## Recommendation

Create a profile-driven export adapter.

## Priority

Medium-high.

---

# 6.16 Semantic Naming Registry

## Historical source

- naming convention enforcer;
- module organization.

## Current coverage

- file naming;
- glossary;
- schemas.

## Gap

There is no visible semantic linter ensuring consistent use of terms such as:

- task;
- proposal;
- work package;
- artifact;
- material;
- checkpoint;
- closeout;
- decision;
- capability;
- provider output;
- projection.

## Recommendation

Create a terminology registry and linter for:

- task titles;
- schema field names;
- command labels;
- view labels;
- documentation;
- runtime types.

## Priority

Medium.

---

# 6.17 Project Profile and Multi-Project Readiness

## Historical source

- project bootstrap;
- workspace presets.

## Current coverage

- workspace-first plugin;
- deferred multi-project registry boundary.

## Gap

Even before multi-project support, a single workspace needs a richer project profile.

## Recommendation

Implement the single-project profile first.

Do not begin multi-project orchestration until:

- project identity;
- root topology;
- provider profile;
- rule profile;
- export policy;
- capability registry

are stable.

## Priority

Medium-high.

---

# 6.18 Artifact Disposition and Quarantine Workflow

## Historical source

- canonical/non-canonical promotion rules;
- later quarantine analysis.

## Current coverage

- disposition vocabulary;
- project-material classification;
- provider output dispositions.

## Gap

The vocabulary is modeled, but operational actions are deferred.

## Recommendation

Add native actions for:

- quarantine;
- supersede;
- mark stale;
- reject;
- retain as historical;
- revalidate;
- propose promotion.

Each action must preserve provenance.

## Priority

Medium, higher before archive recovery.

---

# 6.19 User-Facing Rule Policy

## Historical source

- assistant operating rules;
- project rules;
- project modes.

## Current coverage

- rule tiers defined;
- mode policy;
- locked behavior in code.

## Gap

No complete editable rule manager exists.

## Recommendation

Do not prioritize full UI immediately.

First create:

- native rule records;
- source and precedence;
- conflict resolution;
- project/provider overlays;
- explanation output.

## Priority

Medium.

---

# 6.20 Documentation Synchronization

## Historical source

- project-master updater;
- reflect-back rule;
- end-of-chat validation.

## Current coverage

- documentation manifest;
- project state reports;
- docs validation.

## Gap

The root README remains stale relative to the implemented extension.

## Recommendation

Add a documentation synchronization review that compares:

- commands;
- views;
- capabilities;
- current task status;
- package scripts;
- limitations;
- README and onboarding claims.

## Priority

High.

---

# 7. Concepts Correctly Superseded

Not every old concept should return.

The following were correctly replaced or should remain retired.

## 7.1 `project-artifacts/` as exclusive canonical authority

Correctly replaced by native task/state/schema/runtime authority.

## 7.2 Routine ZIP handoff

Correctly replaced by local files, Git, checkpoints, and native state.

## 7.3 Full-reply Markdown capture as default continuity

Should remain optional trace/audit behavior.

## 7.4 Skill-based project orchestration

Should remain retired.

## 7.5 Skill-based project state mutation

Should remain retired.

## 7.6 Manual artifact-index maintenance

Correctly replaced by generated project-material indexing.

## 7.7 Separate skill for every adjacent planning step

Should remain retired in favor of native workflows and bounded external skills.

## 7.8 Chat transcript as execution authority

Correctly rejected.

---

# 8. Concepts Correctly Deferred

The following should not be treated as accidental losses.

They are reasonable future boundaries:

- remote provider calls;
- provider secrets;
- multi-project registry;
- cross-machine state sync;
- marketplace release;
- signed public releases;
- full standalone chat application;
- transcript-grade audit capture;
- autonomous archive promotion.

However, each deferred item should appear in a maturity/capability registry with:

- current stage;
- promotion trigger;
- blocker;
- dependency;
- explicit non-goal status.

---

# 9. Recommended Native Recovery Program

# Phase A — Local Workflow Integrity

Implement first:

1. Session Bootstrap Resolver.
2. Next Action Resolver.
3. Worktree-to-Task Reconciliation.
4. Session Closeout Resolver.
5. Workspace Topology and Root Policy.
6. Project Behavior Profile.

These close the largest gap between governed backend state and daily Codex operation.

# Phase B — Capability and Decision Governance

Implement:

1. Capability Registry.
2. Runtime Maturity Ledger.
3. Capability Promotion Classifier.
4. Durable Decision Records.
5. Acceptance/Supersession lifecycle.
6. Friction-to-Capability loop.
7. Semantic naming registry.

# Phase C — Product UI Traceability

Implement:

1. UI requirement traceability.
2. Native webview presentation tasks 109–115.
3. command-to-runtime mappings;
4. visible blocker and recovery states;
5. visual evidence records;
6. accessibility and responsive acceptance criteria.

# Phase D — Review and Documentation

Implement:

1. structured review runs;
2. documentation synchronization;
3. release-readiness review;
4. architecture drift review;
5. project-state integrity review.

# Phase E — Controlled External Boundaries

Implement:

1. export profiles;
2. migration intake;
3. quarantine actions;
4. provider registry activation only when needed;
5. external agent contracts.

---

# 10. Proposed New Governed Task Candidates

The following are candidate tasks, not accepted changes.

## TASK-CAND-001 — Add Session Bootstrap Resolver

Create a deterministic startup result from project, Git, task, state, checkpoint, execution-window, approval, and context evidence.

## TASK-CAND-002 — Add Next Action Resolver

Resolve the smallest valid action and explain blockers and required approvals.

## TASK-CAND-003 — Add Worktree-to-Task Reconciliation

Map changed files to governed task scope and checkpoint readiness.

## TASK-CAND-004 — Integrate Session Closeout Command

Turn the existing closeout model into a complete runtime and VS Code workflow.

## TASK-CAND-005 — Define Workspace Topology and Root Policy

Restore the useful intent of the old workspace map as native project configuration.

## TASK-CAND-006 — Add Governed Project Behavior Profile

Separate project-level operating policy from task-level mode.

## TASK-CAND-007 — Add Durable Decision Registry

Implement decision, rationale, supersession, reopen, and implementation linkage.

## TASK-CAND-008 — Generate Capability Registry

Connect capabilities to schemas, code, tasks, commands, views, tests, and docs.

## TASK-CAND-009 — Generate Runtime Maturity Ledger

Compute maturity from repository evidence rather than task labels.

## TASK-CAND-010 — Add Capability Promotion Classifier

Translate repeated behavior into a native destination proposal.

## TASK-CAND-011 — Connect Friction Signals to Capability Proposals

Create recurrence and evidence thresholds.

## TASK-CAND-012 — Add Structured Review Runs

Support state, architecture, UI, release, documentation, and migration review profiles.

## TASK-CAND-013 — Add UI Requirement Traceability

Connect user goals to views, commands, runtime functions, acceptance criteria, and tests.

## TASK-CAND-014 — Add Profile-Driven Export Adapter

Support release, audit, archive, review, migration, and cross-machine profiles.

## TASK-CAND-015 — Add Semantic Naming Registry and Linter

Enforce terminology across source, tasks, commands, views, and docs.

## TASK-CAND-016 — Add Documentation Synchronization Review

Detect stale README, command, architecture, and onboarding claims.

## TASK-CAND-017 — Operationalize Artifact Disposition Actions

Implement quarantine, supersession, stale marking, rejection, and revalidation.

## TASK-CAND-018 — Add Project Profile

Capture identity, topology, rules, providers, exports, and capability links for the current workspace.

---

# 11. Priority Ranking

## Critical

- Session Bootstrap Resolver;
- Next Action Resolver;
- Worktree-to-Task Reconciliation;
- Session Closeout integration;
- Capability Registry;
- Runtime Maturity Ledger;
- UI Requirement Traceability.

## High

- Workspace Topology;
- Project Behavior Profile;
- Decision Registry;
- Capability Promotion Classifier;
- Structured Review Runs;
- Friction-to-Capability Loop;
- Documentation Synchronization.

## Medium-high

- Export Profiles;
- Project Profile;
- Artifact Disposition Actions.

## Medium

- Semantic Naming Registry;
- User-Facing Rule Policy UI;
- provider and multi-project activation.

---

# 12. Final Findings

The deprecated architecture should not be restored.

Its artifact-first implementation has been surpassed by the current governed runtime.

However, the old system contained valuable operating intentions that were not fully carried forward.

The most important missing layer is not another package format or another set of skills.

It is a native operational intelligence layer that can answer:

- Where is the project now?
- What work is active?
- Is the worktree aligned with that work?
- What context is authoritative?
- What action is allowed next?
- What must be approved?
- What has been accepted and why?
- What capability is only designed versus actually usable?
- What repeated friction should become native?
- What UI behavior is required and tested?
- Can this session safely close?
- Can this checkpoint be trusted?
- What can be exported, and for whom?

The rebuild already contains many of the necessary primitives.

The next step is to compose them into complete native workflows.

The strongest architectural conclusion is:

> **ThinkIO successfully moved authority from chat artifacts into local governed state, but it has not yet fully moved orchestration, orientation, maturity awareness, and evolution intelligence into the runtime.**

That is the primary recovery opportunity.

A mature ThinkIO should not require Codex to manually reconstruct these answers from dozens of files.

It should expose them directly, deterministically, and visibly through native functions and the VS Code interface.

---

# 13. Recommended Decision

Adopt the following disposition:

1. Preserve the deprecated bundle as historical design evidence.
2. Do not reactivate its skill-based authority model.
3. Register the missing capabilities identified in this report as governed candidates.
4. Prioritize local workflow integrity before adding external agents.
5. Build capability and maturity registries before claiming broad product completeness.
6. Finish UI traceability alongside the current native webview tasks.
7. Treat evaluation-complete tasks as design boundaries unless implementation maturity is independently proven.
8. Use the current runtime as the authority for all future translations.

The resulting target is:

```text
historical intent
→ evidence-backed capability candidate
→ native classification
→ governed task
→ schema/runtime/view/test
→ maturity evidence
→ accepted capability
```

This preserves the strongest ideas from deprecated ThinkIO without reintroducing the weaknesses of the old artifact and skill stack.
