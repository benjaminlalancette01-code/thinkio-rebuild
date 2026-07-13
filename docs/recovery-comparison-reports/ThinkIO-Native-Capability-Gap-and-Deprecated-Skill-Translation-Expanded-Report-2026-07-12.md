# ThinkIO Native Capability Gap and Deprecated Skill Translation — Expanded Report

**Date:** 2026-07-12  
**Scope:** deeper evaluation of `all-skills-complete-ui-planning-updated-v3.zip` against the current local `thinkio-rebuild` workspace operated through Codex in VS Code  
**Purpose:** identify useful behavior still trapped in the deprecated skill architecture, determine what is already translated into native ThinkIO functions, and define additional native components that should replace—not revive—the old chat-era skill stack.

---

## 1. Executive finding

The earlier report correctly identified five capabilities worth carrying forward, but those five represent only the most visible gaps.

The deprecated skills were not merely a collection of writing prompts. Together they formed an informal operating system for:

- project entry and resume;
- stage routing;
- context control;
- planning progression;
- module refinement;
- dependency reasoning;
- scope and priority decisions;
- naming governance;
- experiment review;
- reusable-capability detection;
- skill lifecycle management;
- UI planning;
- closeout and handoff;
- artifact packaging.

The current ThinkIO runtime has already translated much of the **data authority and enforcement layer** behind these functions. It now has governed tasks, JSON state, CUE validation, deterministic TypeScript rules, approval boundaries, work packages, checkpoints, generated project projections, project-material evaluation, search, a runtime composer, provider ingestion, and a VS Code extension shell.

However, several deprecated skills still expose missing behavior in one of four forms:

1. **The native primitive exists, but no complete operator workflow exposes it.**
2. **The behavior exists in documentation or task history, but not as an enforced runtime function.**
3. **The runtime can store the result, but cannot yet derive or recommend it.**
4. **The old skill solved a real continuity or governance problem that changed shape under local Codex work but did not disappear.**

### Expanded conclusion

ThinkIO should not recreate the old 23-skill stack. It should translate the remaining value into approximately **15 native capability families**, of which:

- 4 are substantially present and need productization;
- 6 are partially present and need explicit runtime workflows;
- 3 are mostly absent and should become governed future capabilities;
- 2 should remain external/domain-specific helpers with controlled intake boundaries.

The most important newly identified gaps are:

- a deterministic session bootstrap and closeout cycle;
- a native next-action/router engine;
- a capability registry and promotion lifecycle;
- friction-to-improvement telemetry;
- a governed naming and semantic consistency service;
- scoped module refinement and decomposition assistance;
- decision records with supersession and rationale chains;
- Git/worktree-aware local change governance;
- UI requirement traceability from user flow to runtime task and test;
- release/export profiles rather than generic handoff packages.

---

## 2. The correct translation principle

A deprecated skill should not be translated one-to-one into a new command merely because it existed before.

The correct native translation test is:

```text
old repeated behavior
  -> identify the enduring system responsibility
  -> identify current source of truth
  -> decide whether the responsibility is deterministic, model-assisted, or human-only
  -> assign the correct native filetype and boundary
  -> expose the smallest useful command/view/workflow
  -> validate through tasks, schemas, tests, and projections
```

### Target placement by behavior

| Behavior | Native ThinkIO target |
|---|---|
| invariant or policy | CUE candidate plus explanatory Markdown |
| mutable operational state | JSON schema and governed JSON record |
| deterministic transition or classifier | TypeScript kernel/runtime function |
| model-assisted interpretation | BAML contract plus provider adapter boundary |
| operator action | VS Code command and/or webview interaction |
| explanation, rationale, navigation | Markdown documentation |
| derived project visibility | generated JSON projection and native view |
| temporary external specialization | external skill with governed project-material intake |

This prevents a return to the old pattern where Markdown artifacts simultaneously acted as plan, state, instruction, and handoff authority.

---

## 3. Current native foundation relevant to the translation

The current workspace already contains the following important foundations:

- `AGENTS.md` defines local operating rules and archive-import boundaries.
- `tasks/` contains 119 governed task records.
- `state/` contains approvals, artifact chains, checkpoints, execution windows, handoffs, ledger state, project graph, project materials, and a knowledge index.
- `kernel/` contains checkpoint, context, project-material, state-machine, projection, and work-package primitives.
- `runtime/` contains validation and projection update functions.
- `contracts/baml/` establishes the model-contract location.
- the VS Code extension declares 17 commands and 7 views.
- current-state reports, project information architecture, search, material evaluation, stress reports, and navigation documents exist under `docs/`.
- tasks 108–119 identify the current open productization and model-contract queue.

This means the remaining work is not to invent a new continuity system. It is to finish the missing **control loops and user-facing orchestration** around the existing native substrate.

---

# 4. Expanded native capability findings

## 4.1 Session bootstrap, re-entry, and orientation

### Deprecated sources

- `project-stack-orchestrator`
- `chat-length-guard`
- `project-master-updater`
- `artifact-packager`
- portions of `execution-handoff`

### Enduring problem

Local files solve transcript loss, but they do not automatically solve orientation. A new Codex session can still:

- start on the wrong branch;
- work from a dirty or partially accepted tree;
- select the wrong task;
- miss an active execution window;
- use stale generated views;
- read too much archive material;
- confuse candidate work with accepted work;
- begin from documentation that is behind runtime state.

### Current native coverage

Partially present through:

- `AGENTS.md`;
- task records;
- execution windows;
- checkpoints;
- context cards and context router;
- current project hub;
- project-state reports;
- project search;
- Git history.

### Missing component

A deterministic **Session Bootstrap Resolver** that produces a bounded session context from current local state.

### Recommended native function

`resolveSessionBootstrap()` should inspect:

1. workspace root and expected project identity;
2. branch, HEAD, staged files, unstaged files, and untracked files;
3. current task status and highest-priority candidate;
4. active execution window and approval state;
5. latest accepted checkpoint;
6. stale generated projections;
7. unresolved validation failures;
8. relevant context card or work package;
9. next allowed action and prohibited actions.

### Suggested outputs

- JSON session-bootstrap record;
- compact VS Code “Start/Resume” panel;
- a generated human-readable session brief;
- warnings for dirty-tree, stale-view, and authority-conflict conditions.

### Native placement

- CUE: bootstrap-record constraints;
- TypeScript: deterministic resolver;
- JSON: current bootstrap result or ephemeral workspace state;
- VS Code: `ThinkIO: Start or Resume Governed Work`;
- Markdown: only explanatory procedure.

### Priority

**Critical.** This is the direct native successor to the old continuity stack.

---

## 4.2 Session closeout and local continuity checkpoint

### Deprecated sources

- `chat-length-guard`
- `artifact-packager`
- `project-master-updater`
- `execution-handoff`

### Enduring problem

A local session can end with code changes, task-state changes, generated outputs, and unresolved findings spread across the worktree. Git alone records changes but does not explain whether the task is accepted, blocked, deferred, partially complete, or safe to resume.

### Current coverage

- checkpoints;
- closeout/history/version validation task lineage;
- artifact-chain validation;
- work packages;
- Git;
- project-state reports.

### Missing component

A unified **Session Closeout Resolver** that validates semantic completion before commit or pause.

### Required checks

- task state matches implementation state;
- tests and validations relevant to the task were run;
- generated projections are current;
- decisions and blockers were recorded;
- temporary files are classified;
- accepted versus candidate changes are explicit;
- return anchor is recorded for parallel work;
- next exact action is identified;
- package/export is not created unless explicitly requested.

### Important distinction

This is not a handoff package generator. It is a local semantic checkpoint that may optionally feed Git commit preparation or an export profile.

### Priority

**Critical.** Bootstrap without closeout leaves the continuity loop incomplete.

---

## 4.3 Native next-action and workflow router

### Deprecated sources

- `project-stack-orchestrator`
- `project-support-router`
- parts of `prioritize-scope`
- parts of `review-project-loop`

### Enduring problem

The old stack could answer, “What is the smallest correct next step?” The current repository has excellent records but still largely expects the operator or Codex to interpret them manually.

### Current coverage

- task priority reorder workflow;
- current project hub;
- project search;
- runtime mode policy;
- task dependencies;
- approvals and execution windows.

### Missing component

A deterministic **Next Action Resolver**.

### Recommended behavior

Given the current project state, it should return:

- one primary next action;
- why it is allowed now;
- prerequisites already satisfied;
- blockers;
- required approval;
- relevant files and context packet;
- actions explicitly not allowed yet;
- optional secondary actions that do not conflict.

### Why this should be native

Without it, Codex can still over-read, skip task order, or choose attractive but premature work. The project graph and task state already contain most of the data needed to make routing deterministic.

### Native placement

- TypeScript resolver over tasks, approvals, graph, ledger, and mode;
- generated next-action projection;
- VS Code command/panel;
- optional BAML only for explanatory summaries, never for the authorization decision.

### Priority

**High.** This is the native replacement for the old skill router family.

---

## 4.4 Capability promotion classifier

### Deprecated sources

- `extract-skill-from-workflow`
- `skill-opportunity-auditor`
- `skill-trigger-auditor`

### Enduring problem

Repeated useful behavior still needs to be recognized and promoted. The difference is that the destination is no longer automatically a ChatGPT skill.

### Current coverage

- friction signal model;
- derivation reports;
- project-material evaluation;
- task proposal intake;
- model-contract boundary;
- runtime maturity concepts.

### Missing component

A complete **Capability Promotion Classifier**.

### Required classification destinations

- no promotion: one-off behavior;
- update existing rule;
- update documentation;
- CUE policy/invariant;
- JSON record/schema;
- TypeScript deterministic function;
- BAML model contract;
- VS Code command;
- VS Code view or interaction;
- generated projection;
- reusable external skill;
- domain-specific helper outside core ThinkIO.

### Required decision factors

- repetition frequency;
- determinism;
- authority impact;
- user-visible value;
- failure cost;
- need for model interpretation;
- cross-project reuse;
- validation feasibility;
- overlap with existing capability;
- lifecycle ownership.

### Recommended result

A governed capability proposal, not an automatically generated implementation.

### Priority

**Critical.** ThinkIO is intended to evolve; without this classifier, evolution remains ad hoc.

---

## 4.5 Native capability registry and maturity lifecycle

### Deprecated sources

- `skill-library-reviewer`
- `skill-opportunity-auditor`
- `skill-trigger-auditor`
- `project-support-router`

### Enduring problem

Once behaviors are translated into native forms, ThinkIO needs to know what capabilities exist, their boundaries, maturity, owners, tests, interfaces, and supersession state.

### Current coverage

- command registry;
- task graph;
- runtime maturity evaluation;
- BAML contracts;
- project knowledge index;
- documentation manifest.

### Missing component

A first-class **Capability Registry** that is broader than a command list and more semantic than the task graph.

### Suggested capability record

- capability ID and name;
- responsibility;
- authority class;
- implementation type;
- source files;
- commands/views exposed;
- input/output contracts;
- validation and tests;
- maturity: proposed, experimental, accepted, deprecated, superseded;
- replacement/supersession links;
- known limitations;
- project applicability;
- external dependency or provider requirements.

### Why this matters

The old skill library implicitly served as a discoverable capability catalog. As skills disappear into TypeScript, CUE, commands, views, and state models, discoverability can actually get worse unless ThinkIO creates a native registry.

### Priority

**High.** This is a newly identified structural gap.

---

## 4.6 Friction and repeated-work signal loop

### Deprecated sources

- `skill-opportunity-auditor`
- `skill-trigger-auditor`
- `analyze-project-experiment`
- `review-project-loop`

### Enduring problem

The system should detect when the user or Codex repeatedly:

- explains the same rule;
- repairs the same class of drift;
- performs the same file search;
- manually assembles the same context;
- repeats the same validation sequence;
- reclassifies the same output;
- struggles with the same UI surface.

### Current coverage

Task 045 added a friction-signal model and UI surfacing concept. Interaction logging and trace policies also exist.

### Missing component

The full **Friction-to-Capability Improvement Loop**:

```text
interaction or failure evidence
  -> friction signal
  -> deduplication and severity scoring
  -> affected capability lookup
  -> classify as bug, UX gap, missing automation, missing rule, missing documentation, or model-contract gap
  -> propose task or capability promotion
  -> review outcome
  -> close signal with evidence
```

### Additional requirement

The system must distinguish user friction caused by immature UI from genuine missing kernel capability. Otherwise every rough interface could incorrectly generate a new runtime abstraction.

### Priority

**High.** The model exists conceptually, but the closed loop is incomplete.

---

## 4.7 Native project review and experiment analysis

### Deprecated sources

- `review-project-loop`
- `analyze-project-experiment`

### Enduring problem

ThinkIO needs a repeatable way to review not only files but the relation among:

- intended behavior;
- actual runtime behavior;
- user behavior;
- Codex behavior;
- validation outcomes;
- UI friction;
- authority boundaries;
- project evolution.

### Current coverage

- stress tests and compiled findings;
- current-state reports;
- project-material evaluation;
- task proposal pipeline;
- trace and interaction logs;
- audit reports.

### Missing component

A formal **Project Review Run** with selectable review profiles.

### Suggested profiles

1. **State integrity review** — tasks, approvals, checkpoints, graph, generated views.
2. **Runtime behavior review** — command path, gates, mutation, validation, rollback.
3. **UX review** — task completion paths, information scent, blocked states, recovery.
4. **Experiment review** — hypothesis, observed interaction, outcome, reusable learning.
5. **Architecture drift review** — authority inversion, duplicate registries, boundary leakage.
6. **Release readiness review** — clean tree, tests, package, docs, migration, known issues.

### Output

A structured review record should generate findings and task proposals; Markdown reports should be derived presentation.

### Priority

**High.** Existing reviews are strong but mostly bespoke rather than one reusable native workflow.

---

## 4.8 Decision records, supersession, and rationale chains

### Deprecated sources

- `prioritize-scope`
- `review-project-loop`
- `project-master-updater`
- `variant-decision-helper`
- `connect-modules`

### Enduring problem

Tasks record work, but not every durable decision is equivalent to a task. ThinkIO needs explicit records for decisions such as:

- why one architecture was selected;
- why a capability was deferred;
- why a filetype or boundary was chosen;
- why a UI approach was rejected;
- what decision superseded an earlier one;
- what evidence would reopen the decision.

### Current coverage

- approval state;
- ledger;
- derivation reports;
- task histories;
- documentation rationale.

### Missing component

A native **Decision Record and Supersession Model**.

### Suggested fields

- decision ID;
- question;
- options considered;
- selected option;
- rationale and evidence;
- authority level;
- affected capabilities/tasks/files;
- effective date;
- status: proposed, accepted, superseded, reversed;
- supersedes/superseded-by;
- reopen conditions;
- reviewer/approval link.

### Priority

**High.** This prevents project history from being reconstructed indirectly from task prose and Git diffs.

---

## 4.9 Scoped module refinement and decomposition assistant

### Deprecated sources

- `organize-modules`
- `refine-module`
- `connect-modules`
- portions of `brainstorm-project`

### Enduring problem

The current runtime can accept tasks and work packages, but there remains a useful planning operation between a broad capability idea and implementation-ready tasks: bounded decomposition.

### Current coverage

- governed decomposition model;
- task proposals;
- context cards;
- work packages;
- project graph;
- runtime composer.

### Missing or incomplete behavior

A native **Scoped Decomposition Workflow** that can take one accepted capability or problem and produce reviewable:

- responsibilities;
- boundaries;
- inputs/outputs;
- dependencies;
- risks;
- acceptance criteria;
- task candidates;
- required tests and projections;
- explicit exclusions.

### Guardrail

It must never decompose the entire archive or create a broad migration plan by default. It should honor the existing “one old concept per task” rule and the current mode/approval boundary.

### Native placement

- BAML contract for model-assisted decomposition;
- TypeScript validator and proposal constructor;
- task proposal review UI;
- project graph impact preview.

### Priority

**Medium-high.** Many primitives exist; the operator workflow needs completion.

---

## 4.10 Governed naming and semantic consistency service

### Deprecated source

- `naming-convention-enforcer`

### Enduring problem

CUE and tests can enforce structural naming patterns, but semantic drift can still occur:

- two terms for the same capability;
- one term used for different concepts;
- command names diverging from task and documentation language;
- inconsistent status vocabulary;
- stale historical terms leaking into current UI;
- duplicate IDs or aliases across registries.

### Current coverage

- schemas;
- glossary lineage;
- documentation validation;
- command registry;
- project information architecture.

### Missing component

A **Semantic Naming Registry and Linter**.

### Recommended functions

- canonical term and allowed aliases;
- deprecated term and replacement;
- domain scope;
- file/path/component naming rules;
- collision detection;
- command/view/task vocabulary consistency;
- migration warning, not automatic broad rename;
- generated glossary projection.

### Priority

**Medium-high.** The old skill’s value was broader than filename formatting.

---

## 4.11 UI flow, detailed UI planning, and requirement traceability

### Deprecated sources

- `ui-flow-planner`
- `ui-detail-planner`

### Enduring problem

The runtime is more mature than the product UI. Current candidate tasks 109–115 explicitly recognize the need for native presentation architecture, improved Kanban, project navigation, mind map, runtime node diagram, composer/review UI, and visual smoke validation.

### Current coverage

- view architecture and command bridge;
- seven extension views;
- interaction logs;
- project graph and projections;
- candidate UI implementation tasks.

### Missing component beyond the earlier report

Not just UI planning documents, but a **UI Requirement Traceability Model** connecting:

```text
user goal
  -> user flow
  -> screen/view
  -> visible state
  -> operator action
  -> command
  -> runtime capability
  -> approval/gate behavior
  -> success/error/empty/loading states
  -> task and acceptance test
```

### Why this matters

Without traceability, the UI can become an attractive wrapper over raw projections while missing critical governed actions, recovery states, or explanations.

### Recommended native outputs

- JSON UI-flow records;
- view-state contracts;
- interaction-to-command mappings;
- acceptance-criteria generation;
- visual smoke scenarios;
- candidate task creation.

### Role of model assistance

A BAML contract may help derive user flows and missing states, but command mapping and authority checks must remain deterministic.

### Priority

**Critical for the next product phase.** This should be aligned with tasks 109–115 rather than creating a separate UI authority tree.

---

## 4.12 Git/worktree-aware mutation governance

### Deprecated sources

This responsibility was only indirectly covered by:

- `artifact-packager`;
- `execution-handoff`;
- `chat-length-guard`;
- repository setup rules.

### Enduring problem revealed by the current workflow

The previous full audit found a heavily modified local worktree. Local-first development introduces concerns that the old artifact model did not fully solve:

- changes from multiple tasks mixed in one tree;
- generated files mixed with source changes;
- accepted and experimental edits combined;
- untracked files with unclear authority;
- stale task status after code edits;
- commits that do not map cleanly to governed tasks;
- branch or worktree context lost across Codex sessions.

### Current coverage

- mutation transaction planning and applier;
- writer boundaries;
- checkpoints;
- artifact chains;
- Git itself.

### Missing component

A **Git/Worktree Reconciliation Adapter** that remains subordinate to ThinkIO governance.

### Recommended behavior

- map changed files to task/capability scope;
- identify out-of-scope edits;
- distinguish source, generated, state, documentation, archive, and package outputs;
- warn when generated files are stale or manually edited;
- prepare a semantic commit plan;
- prevent claiming checkpoint acceptance from a dirty ambiguous tree;
- record branch and commit anchors in session bootstrap/closeout.

### Guardrail

ThinkIO should not become a full Git client. The adapter should provide governance context and invoke normal Git operations only with explicit operator action.

### Priority

**Critical for dependable local Codex work.** This is a major newly identified gap.

---

## 4.13 Context budget and relevance router

### Deprecated source

- `chat-length-guard`
- portions of `project-stack-orchestrator`

### Enduring problem

The context problem changed from “the chat is too long” to “the repository is too large and contains multiple authority classes.” `AGENTS.md` already forbids reading the full archive unless a task names a concept.

### Current coverage

- context router;
- context cards;
- work packages;
- project search and knowledge index;
- source map;
- current project hub.

### Missing component

A measurable **Context Budget and Provenance Resolver**.

### Recommended behavior

For a selected task, produce:

- required files;
- optional supporting files;
- prohibited or irrelevant roots;
- source authority and freshness;
- token/size estimate;
- why each item is included;
- whether a generated projection can replace reading raw records;
- archive access exception with reason.

### Priority

**Medium-high.** This converts the archive-reading rule into an enforceable and inspectable workflow.

---

## 4.14 Explicit export, release, and external review profiles

### Deprecated sources

- `artifact-packager`
- `execution-handoff`

### Enduring problem

External packaging is still needed, but not as the routine continuity mechanism.

### Current coverage

- work-package export model;
- checkpoints;
- handoff state;
- artifact-chain manifests and checksums;
- VSIX packaging and validation;
- generated reports.

### Missing component

A profile-driven **Export Adapter** with explicit intent.

### Recommended profiles

1. **Release package** — validated source/package, manifest, version, known issues.
2. **External audit package** — selected evidence, hashes, state report, no activation claim.
3. **Reviewer package** — bounded task/capability context and review instructions.
4. **Cross-machine resume bundle** — only when Git/remote state is insufficient.
5. **Archive checkpoint** — provenance-preserving immutable snapshot.
6. **Provider work package** — bounded prompt/context/contract for external model work.

### Required rules

- export never changes canonical authority;
- every package declares source commit/checkpoint;
- generated and source artifacts are distinguished;
- excluded roots are explicit;
- no package is called a baseline merely because it is complete;
- import/re-entry validation is defined.

### Priority

**Medium.** Important, but downstream of local stabilization.

---

## 4.15 External/domain-specific helper intake

### Deprecated sources

- `block-classifier`
- `variant-decision-helper`
- `attitude-tech-writer`

### Finding

These do not need to become kernel capabilities. They remain useful specialist helpers, but their outputs must enter ThinkIO through governed project-material or provider-output intake.

### Missing native component

A clearer **External Helper Contract Profile**:

- declares helper type and authority limits;
- identifies expected input/output schema;
- marks output as proposal, analysis, or presentation-only;
- prevents direct mutation of accepted runtime state;
- maps useful results to tasks, materials, or decisions;
- records provenance and provider/tool identity.

### Priority

**Medium.** This generalizes the provider intake boundary to non-model helper workflows.

---

# 5. Revised disposition of the deprecated skills

| Deprecated skill | Native status | Expanded disposition |
|---|---|---|
| analyze-project-experiment | partial | translate into Project Review Run + friction/capability proposal flow |
| artifact-packager | largely superseded | retire routine use; retain export profiles only |
| attitude-tech-writer | external helper | keep outside authority; ingest reviewed output |
| block-classifier | external domain helper | keep outside core; use project-material intake |
| brainstorm-project | largely translated | Runtime Composer + scoped decomposition + task proposals |
| chat-length-guard | obsolete trigger, valid responsibility | replace with session bootstrap/closeout and context budget |
| connect-modules | translated backend | use project graph; add impact/dependency explanation UI if needed |
| execution-handoff | mostly translated | work package, execution window, next-action resolver, export profile |
| extract-skill-from-workflow | not fully translated | capability promotion classifier |
| naming-convention-enforcer | partial | semantic naming registry and linter |
| organize-modules | partial | scoped decomposition and capability registry |
| prioritize-scope | partial | task priority exists; add decision record and portfolio/scope rationale |
| project-master-updater | superseded as authority | generated current-state view plus semantic closeout record |
| project-stack-orchestrator | partial | session bootstrap + next-action resolver |
| project-support-router | partial | capability registry + command discovery + next-action resolver |
| refine-module | partial | bounded decomposition workflow with task/acceptance generation |
| review-project-loop | partial | project review profiles and architecture-drift review |
| skill-library-reviewer | missing native equivalent | capability registry lifecycle and periodic capability review |
| skill-opportunity-auditor | partial signals only | friction-to-capability loop + promotion classifier |
| skill-trigger-auditor | partial signals only | same promotion classifier with deterministic thresholds |
| ui-detail-planner | needed | UI traceability and candidate task generation |
| ui-flow-planner | needed | UI traceability and user-flow records |
| variant-decision-helper | external domain helper | keep outside core; decision output enters governed intake |

---

# 6. Newly identified native component set

The five capabilities from the earlier report should be expanded into the following recommended component set.

## Tier 1 — Local workflow integrity

1. **Session Bootstrap Resolver**
2. **Session Closeout Resolver**
3. **Next Action Resolver**
4. **Git/Worktree Reconciliation Adapter**
5. **Context Budget and Provenance Resolver**

These make local Codex work deterministic, resumable, and bounded.

## Tier 2 — Evolution and governance

6. **Capability Promotion Classifier**
7. **Capability Registry and Maturity Lifecycle**
8. **Friction-to-Capability Improvement Loop**
9. **Decision Record and Supersession Model**
10. **Semantic Naming Registry and Linter**

These replace the deprecated skill-management and review layer with a native evolution system.

## Tier 3 — Planning and productization

11. **Project Review Run with profiles**
12. **Scoped Decomposition Workflow**
13. **UI Requirement Traceability Model**

These translate planning skills into governed task, contract, and acceptance flows.

## Tier 4 — Controlled boundaries

14. **Profile-driven Export Adapter**
15. **External Helper Contract Profile**

These preserve portability and specialist value without restoring parallel authority.

---

# 7. Recommended implementation sequence

## Phase A — Stabilize the local Codex operating loop

Implement or formalize:

1. Session Bootstrap Resolver.
2. Git/Worktree Reconciliation Adapter.
3. Session Closeout Resolver.
4. Next Action Resolver.
5. Context Budget and Provenance Resolver.

### Why first

These capabilities directly address how ThinkIO is now being built. They reduce orientation errors, mixed-task changes, stale state, over-reading, and ambiguous resume points.

## Phase B — Complete the UI productization queue

Coordinate with current candidate tasks 109–115:

1. define UI requirement traceability;
2. attach user flows and states to each view task;
3. map each interaction to commands and governance outcomes;
4. add visual/error/empty/loading smoke scenarios;
5. ensure views expose blockers and next valid actions.

### Why second

The current runtime already has more capability than the UI communicates. Native UI should expose existing governance rather than introduce new parallel state.

## Phase C — Build the evolution loop

Implement:

1. Capability Registry.
2. Capability Promotion Classifier.
3. Friction-to-Capability loop.
4. Decision records and supersession.
5. Semantic naming registry.

### Why third

Once local workflow and UI surfaces stabilize, ThinkIO can safely reason about its own capability evolution without promoting temporary interface friction into permanent architecture.

## Phase D — Planning and review workflows

Implement:

1. Project Review Run profiles.
2. Scoped Decomposition Workflow.
3. BAML contracts where model interpretation is justified.
4. Task and acceptance-criteria generation through the existing proposal pipeline.

## Phase E — Controlled external boundaries

Implement:

1. export profiles;
2. external helper contract profiles;
3. release/audit/resume package validation;
4. import/re-entry checks.

---

# 8. Proposed native task candidates

The following are candidate titles only. They should pass through normal task intake and priority review rather than being treated as accepted work.

1. `Add governed session bootstrap resolver`
2. `Add semantic session closeout and resume checkpoint workflow`
3. `Add Git worktree task-scope reconciliation adapter`
4. `Add deterministic next-action resolver and plugin surface`
5. `Add context budget and provenance packet generator`
6. `Define native capability registry schema and projections`
7. `Add capability promotion classifier and review workflow`
8. `Close friction-signal to task-and-capability proposal loop`
9. `Add decision record supersession and reopen-condition model`
10. `Add semantic naming registry and consistency validation`
11. `Define UI requirement traceability and command mapping model`
12. `Add scoped capability decomposition composer contract`
13. `Add reusable project review run profiles`
14. `Define export profiles and source-checkpoint manifest rules`
15. `Define external helper output authority contract`

### Relationship to the existing queue

- UI traceability should precede or become a prerequisite for tasks 110–115.
- session bootstrap and worktree reconciliation should be considered before broad archive cleanup under task 119.
- capability promotion and BAML coverage should coordinate with tasks 117–118.
- export profiles should build on the existing work-package and package-history models rather than replace them.

---

# 9. What should not be translated

The following old behaviors should remain retired:

- automatic recreation of `project-artifacts/` as a parallel canonical tree;
- mandatory ZIP handoff after ordinary local milestones;
- manual project master documents as operational source of truth;
- stage-folder progression as the governing state machine;
- skill creation as the default destination for repeated behavior;
- broad repository organization by a general-purpose skill;
- direct editing of task/state authority by writing or planning helpers;
- chat-length as the primary continuity trigger;
- duplicated dependency graphs maintained in Markdown;
- skill routers that can bypass task order, approvals, execution windows, or runtime gates.

---

# 10. Risks if the translation is incomplete

## 10.1 Backend-native but operator-manual

ThinkIO may possess the correct records and validators while Codex still manually reconstructs the workflow every session. This leaves the most error-prone step outside the governed system.

## 10.2 Capability invisibility

As skills dissolve into many filetypes and commands, users may no longer know what ThinkIO can do. A capability registry and next-action surface are needed to prevent functional opacity.

## 10.3 Evolution without lifecycle

Repeated friction may create tasks, commands, or contracts without a clear promotion, maturity, deprecation, and supersession lifecycle.

## 10.4 UI/runtime divergence

The VS Code UI may present raw projections or incomplete actions that do not fully map to runtime governance. UI traceability is the protection against this drift.

## 10.5 Git becomes accidental authority

If dirty-tree and branch context are not reconciled with tasks and checkpoints, commit history can become the only practical explanation of project state even though it lacks semantic governance.

## 10.6 External helper leakage

Specialist skills may remain useful, but without a helper contract they can silently generate files or terminology that appear authoritative.

---

# 11. Final assessment

The deprecated skill bundle still contains valuable design intelligence, but its remaining value is not primarily in the individual prompts. Its deeper value is the set of operational responsibilities it once coordinated.

ThinkIO has successfully translated many of those responsibilities into stronger native primitives. The next maturity step is to connect those primitives into explicit native control loops:

```text
start/resume
  -> select next valid work
  -> assemble bounded context
  -> perform governed mutation
  -> validate and review
  -> record decisions and friction
  -> close out semantically
  -> promote repeated behavior when justified
  -> optionally export at a real boundary
```

That loop is the true native successor to the deprecated skill stack.

The highest-priority additions are therefore not new general-purpose skills. They are:

1. session bootstrap and closeout;
2. worktree/task reconciliation;
3. next-action resolution;
4. UI requirement traceability;
5. capability registry and promotion lifecycle.

Once these are native, the old skill bundle can remain safely archived as historical lineage, design evidence, and a source of specialized external helpers—without competing with the governed ThinkIO runtime.
