# ThinkIO Skills and Agents Architecture Report

**Date:** July 12, 2026  
**Subject:** What should remain as Skills after native ThinkIO translation, and which capabilities should become Agents  
**Status:** Architectural recommendation  
**Audience:** ThinkIO project owners, architects, Codex operators, extension developers, and governance designers

---

# Executive Summary

ThinkIO is moving from a chat-centered workflow system toward a governed local operating environment inside VS Code, with Codex working directly against local files, tasks, schemas, runtime functions, tests, generated projections, Git state, and extension surfaces.

As more deprecated skills are translated into native ThinkIO capabilities, the role of skills should narrow substantially.

The correct end state is not a large library of ThinkIO-specific skills and autonomous agents. It is:

> **ThinkIO as the governed operating substrate, a small set of external interaction skills, and a limited number of bounded agents that perform delegated work through native ThinkIO capabilities.**

The key architectural distinction is:

- **Native ThinkIO functions** own project truth, state, constraints, transitions, validation, coordination, approvals, and deterministic behavior.
- **Skills** teach external models how to interact with ThinkIO or perform specialized procedures that do not belong in the runtime.
- **Agents** pursue bounded objectives over time, through explicitly permitted native functions, while producing evidence, findings, or proposals.

If a behavior determines project truth, it belongs in ThinkIO.

If a behavior teaches ChatGPT, Codex, or another model how to use ThinkIO, it may remain a skill.

If a behavior independently pursues an ongoing objective, reacts to new information, and operates through multiple steps, it may become an agent.

Most deprecated ThinkIO workflow skills should therefore not survive as active skills, and they should not be converted directly into agents. Their authoritative and deterministic responsibilities should first be translated into the native runtime.

---

# 1. Context

The deprecated ThinkIO skill set emerged from an earlier operating model centered on:

```text
ChatGPT session
→ project-artifacts folder
→ artifact index and project state
→ handoff package
→ next session
```

That model used skills to maintain continuity, organize project materials, prioritize work, connect modules, generate handoffs, create planning artifacts, and reconstruct context.

The current ThinkIO workflow has a different center of gravity:

```text
governed local tasks and state
→ CUE validation
→ TypeScript kernel and runtime
→ tests and approval boundaries
→ generated projections
→ VS Code commands and views
→ Git history and checkpoints
→ Codex operating inside the repository
```

This shift changes the appropriate role of skills.

Skills should no longer reproduce system authority outside the repository. They should become thin external adapters, procedural guides, or specialized helpers.

Agents should not become alternative authorities either. They should operate as replaceable workers constrained by native ThinkIO contracts.

---

# 2. Core Architectural Principle

The central rule should be:

> **Project truth must remain native. External intelligence may interpret, propose, review, or execute bounded work, but it must not silently define authority.**

This produces the following separation.

## 2.1 Native ThinkIO functions

Native functions should own:

- project state;
- task state;
- accepted decisions;
- capability registration;
- dependency graphs;
- schemas;
- validation;
- permissions;
- execution windows;
- approvals;
- checkpoint creation;
- context resolution;
- next-action resolution;
- review-run definitions;
- export eligibility;
- generated projections;
- state transitions;
- authoritative naming;
- lifecycle and supersession rules.

## 2.2 Skills

Skills should contain:

- reusable procedural instructions;
- external model interaction rules;
- tool or connector guidance;
- import and migration guidance;
- reporting conventions;
- review procedures;
- provider-specific best practices;
- domain-specific analysis that remains outside ThinkIO authority.

Skills should not calculate canonical project truth independently.

## 2.3 Agents

Agents should:

- receive bounded objectives;
- operate through native ThinkIO capabilities;
- use authorized context;
- maintain only reconstructible working state;
- produce evidence, findings, or proposals;
- stop at approval boundaries;
- report uncertainty and blockers;
- avoid self-acceptance or silent promotion.

Agents should not contain irreplaceable project knowledge or private authority hidden in prompts.

---

# 3. What Should No Longer Remain as Skills

Once translated into native ThinkIO functions, the following responsibilities should disappear from the active skill layer.

| Former behavior | Native ThinkIO destination |
|---|---|
| Session-state reconstruction | Session Bootstrap Resolver |
| Session closeout and continuity | Session Closeout Resolver |
| Next-step selection | Next Action Resolver |
| Task prioritization | Governed task runtime |
| Project-state mutation | Native state transitions |
| Dependency connection | Project graph subsystem |
| Naming enforcement | Schemas, semantic registry, and linter |
| Artifact indexing | Native project-material registry |
| Routine checkpoint creation | Checkpoint subsystem |
| Routine handoff creation | Git, state, closeout, and checkpointing |
| Context selection | Context Budget and Provenance Resolver |
| Capability classification | Capability Promotion Classifier |
| Capability maturity tracking | Capability registry and lifecycle |
| Review coordination | Native review-run subsystem |
| Friction analysis | Friction-to-capability improvement loop |
| Decision tracking | Decision record and supersession model |
| UI requirement management | UI traceability model |
| Routine packaging | Native export adapter |
| Module organization | Capability and material classification |
| Scope decomposition | Governed decomposition workflow |
| Project-master synchronization | Generated current-state projections |
| Workflow routing | Native command and next-action resolution |
| Work-package progression | Governed execution windows and tasks |

Keeping these responsibilities as skills would create duplicate logic and competing authority.

---

# 4. What Should Remain as Skills

After full native translation, the active skill layer should become much smaller.

A realistic target is approximately six to nine skill families.

---

## 4.1 ThinkIO Workspace Interaction Skill

### Purpose

Teach an external model how to recognize and interact with a ThinkIO workspace correctly.

### Responsibilities

The skill should explain how to:

- identify a ThinkIO repository;
- locate and read `AGENTS.md`;
- invoke native bootstrap behavior;
- inspect the current governed task;
- distinguish source records from generated projections;
- detect branch and worktree state;
- request the next valid action;
- respect approval and execution-window boundaries;
- load only relevant context;
- invoke native closeout behavior;
- avoid reproducing native logic manually.

### Non-responsibilities

It should not:

- infer project state independently;
- choose priority outside the native resolver;
- mutate task status directly;
- create substitute handoff artifacts;
- define authority from chat history;
- bypass native validation.

### Recommended name

```text
thinkio-workspace
```

### Why it remains a skill

This behavior teaches an external model how to enter the environment. It is an interaction protocol, not project authority.

---

## 4.2 ThinkIO Project Migration Skill

### Purpose

Interpret foreign, legacy, or partially governed project material and prepare it for native ThinkIO intake.

### Supported sources

- old ThinkIO handoff packages;
- project-artifacts directories;
- deprecated skill bundles;
- planning repositories;
- mixed documentation and source trees;
- external workflow systems;
- partially governed codebases;
- archival project packages.

### Responsibilities

The skill may:

- inventory incoming material;
- identify authority conflicts;
- separate source, generated material, evidence, and residue;
- map old concepts to current ThinkIO structures;
- identify possible native capability candidates;
- create migration proposals;
- classify what should remain archived;
- identify unresolved provenance;
- generate governed migration tasks.

### Non-responsibilities

It should not:

- directly activate imported material;
- silently assign canonical status;
- bypass project-material review;
- overwrite accepted state;
- treat recent timestamps as authority;
- assume all old skills should become native capabilities.

### Recommended name

```text
thinkio-project-migration
```

### Why it remains a skill

Migration requires interpreting conventions that originate outside ThinkIO. This is precisely where an external procedural skill remains valuable.

---

## 4.3 ThinkIO Independent Audit Skill

### Purpose

Evaluate ThinkIO from outside its own runtime assumptions.

### Responsibilities

The skill may:

- compare claimed state with repository evidence;
- verify that generated projections match source records;
- compare Git state with reported state;
- detect stale documentation;
- look for circular self-validation;
- review authority boundaries;
- inspect export completeness;
- identify runtime/documentation divergence;
- assess release or checkpoint trustworthiness;
- report inconsistencies without mutating accepted state.

### Independence requirement

The audit skill should not rely exclusively on native summary outputs. It should inspect primary records and compare them with generated reports.

### Recommended name

```text
thinkio-independent-audit
```

### Why it remains a skill

An independent review should preserve distance from the system it evaluates. Making every audit fully native risks circular confirmation.

---

## 4.4 ThinkIO Export Assistant Skill

### Purpose

Help an external model or user choose, invoke, and interpret native export profiles.

### Native responsibility

ThinkIO itself should determine:

- trusted checkpoint;
- eligible files;
- manifest contents;
- provenance;
- exclusions;
- hashes;
- package profile;
- validation status.

### Skill responsibility

The skill may:

- help choose an export profile;
- explain export options;
- request the native export;
- interpret validation results;
- summarize package contents;
- generate an external cover note.

### Example export profiles

- release;
- independent audit;
- archival checkpoint;
- external reviewer;
- cross-machine continuation;
- provider evaluation;
- legal or compliance review;
- incident investigation.

### Recommended name

```text
thinkio-export-assistant
```

### Why it remains a skill

The export itself is native. Selecting and explaining a profile is a user-facing procedural concern.

---

## 4.5 ThinkIO Capability Proposal Skill

### Purpose

Help users and external models formulate high-quality capability proposals before submitting them to the native classifier.

### Questions the skill should resolve

- What recurring behavior has been observed?
- Is the behavior deterministic or interpretive?
- Does it affect authority?
- What are the inputs and outputs?
- Does it require state?
- Is it user-facing?
- Does it require an AI worker?
- Is it provider-specific?
- Does it belong in the kernel, runtime, extension, documentation, or an external adapter?
- What validation and acceptance evidence are required?
- What existing capability may already cover it?
- What is the cost of not promoting it?

### Native responsibility

The native Capability Promotion Classifier should determine final placement.

### Recommended name

```text
thinkio-capability-proposal
```

### Why it remains a skill

The skill improves proposal quality. It does not decide project truth.

---

## 4.6 ThinkIO UI Review Skill

### Purpose

Evaluate screenshots, prototypes, Figma designs, implemented views, and interaction flows.

### Responsibilities

The skill may assess:

- information hierarchy;
- navigation;
- visual density;
- command discoverability;
- empty states;
- error states;
- loading states;
- blocked states;
- recovery behavior;
- interaction clarity;
- accessibility;
- consistency with ThinkIO concepts;
- alignment with native UI requirements.

### Output

Findings should become:

- review evidence;
- governed issue candidates;
- task proposals;
- acceptance-criteria amendments;
- design recommendations.

### Non-responsibilities

It should not create a separate UI authority tree or redefine product requirements independently.

### Recommended name

```text
thinkio-ui-review
```

### Why it remains a skill

Visual and interaction interpretation remains a strong model task, while requirement ownership should stay native.

---

## 4.7 ThinkIO Technical Communication Skill

### Purpose

Transform accepted ThinkIO state into different communication formats.

### Possible outputs

- contributor onboarding;
- architecture overview;
- release notes;
- implementation reports;
- stakeholder summaries;
- user documentation;
- developer guides;
- migration instructions;
- executive briefs;
- audit summaries.

### Required discipline

The skill must:

- read accepted source state;
- distinguish facts from interpretation;
- identify generated narrative as a projection;
- avoid introducing new authority;
- reference the source checkpoint or accepted state;
- preserve terminology from the semantic registry.

### Recommended name

```text
thinkio-technical-communication
```

### Why it remains a skill

Communication is a presentation layer. It should not be embedded deeply into the runtime.

---

## 4.8 Provider-Specific Integration Skills

### Purpose

Teach models how to use external systems while respecting ThinkIO authority.

### Examples

- GitHub pull-request workflow;
- Figma synchronization;
- Google Drive publishing;
- deployment-provider integration;
- issue-tracker synchronization;
- documentation-platform publishing;
- cloud release workflows;
- external AI-provider evaluation.

### Architectural boundary

ThinkIO should expose stable native contracts.

Provider skills should handle provider-specific execution.

Example:

```text
ThinkIO native:
create an accepted release candidate

GitHub skill:
create branch, commit, push, and draft pull request from the accepted candidate
```

### Why they remain skills

Provider details are external, change frequently, and should not contaminate the core runtime.

---

## 4.9 ThinkIO Legacy Recovery Skill

### Purpose

Interpret deprecated ThinkIO packages, quarantined reconstruction material, and superseded artifacts.

### Responsibilities

The skill may:

- reconstruct provenance;
- identify last-known authority;
- distinguish superseded from current material;
- map historical concepts to current structures;
- identify salvage candidates;
- produce migration evidence;
- preserve do-not-use warnings.

### Non-responsibilities

It should not:

- directly reactivate old artifacts;
- promote historical material;
- bypass revalidation;
- use chat approval as proof of artifact existence.

### Recommended name

```text
thinkio-legacy-recovery
```

### Long-term note

This may eventually merge into the migration skill if the workflows converge.

---

# 5. Should These Skills Become Agents?

The general answer is:

> **Most should remain skills, not agents.**

A skill and an agent solve different problems.

## 5.1 When a skill is appropriate

Use a skill when the behavior is:

- invoked on demand;
- scoped to one request;
- mostly stateless;
- procedural;
- repeatable;
- non-autonomous;
- dependent on the host model;
- not responsible for an ongoing outcome.

## 5.2 When an agent is appropriate

Use an agent when the behavior:

- has an enduring role;
- receives objectives rather than isolated prompts;
- operates across multiple steps;
- reacts to changing project conditions;
- maintains working state;
- uses tools independently;
- must report progress and blockers;
- may run repeatedly;
- requires explicit permissions;
- has stop and escalation conditions.

## 5.3 Main warning

Do not convert every reusable procedure into an agent.

That would produce:

- unnecessary complexity;
- duplicated state;
- hidden authority;
- excessive coordination overhead;
- competing planning systems;
- difficult debugging;
- unclear responsibility;
- agent-to-agent drift;
- prompt-defined behavior that should be schema-defined.

---

# 6. Skills That Should Remain Skills

The following are best kept as skills:

- ThinkIO workspace interaction;
- capability proposal preparation;
- export profile selection;
- technical communication;
- migration intake;
- legacy recovery;
- provider-specific tool guidance;
- one-time UI evaluation;
- one-time independent audit.

These are procedural adapters and do not require persistent identities or autonomous loops.

---

# 7. Capabilities That Could Become Agents

A smaller group of behaviors may justify bounded agents.

---

## 7.1 Independent Review Agent

### Objective

Continuously or periodically evaluate repository and governance integrity.

### Possible responsibilities

- run review profiles;
- compare tasks and state;
- inspect graph consistency;
- detect stale generated projections;
- detect documentation mismatch;
- identify unresolved blockers;
- inspect release readiness;
- create findings;
- propose remediation tasks.

### Authority boundary

The review agent may:

- observe;
- run checks;
- create findings;
- propose tasks.

It may not:

- accept its own findings;
- promote project state;
- mark releases accepted;
- mutate authority silently.

### Suitability

Strong agent candidate.

---

## 7.2 Release Readiness Agent

### Objective

Gather and assess evidence required for a release decision.

### Evidence sources

- tests;
- schema validation;
- extension packaging;
- Git state;
- unresolved blockers;
- documentation state;
- generated reports;
- dependency integrity;
- export readiness;
- known limitations.

### Output

- release-readiness report;
- blocking findings;
- recommendation;
- required approvals;
- export request.

### Authority boundary

It should not release automatically unless ThinkIO later defines a narrow, explicit automated release policy.

### Suitability

Strong future agent candidate.

---

## 7.3 Documentation Synchronization Agent

### Objective

Detect and repair drift between accepted system state and documentation.

### Possible responsibilities

- compare README content with implemented capabilities;
- compare command documentation with extension registrations;
- compare architecture docs with dependency graphs;
- detect outdated onboarding instructions;
- propose documentation tasks;
- update documentation within approved task scope.

### Authority boundary

It may update documentation only when:

- a governed task authorizes the change;
- source state is accepted;
- generated documentation rules are respected.

### Suitability

Strong agent candidate, especially given the stale README identified in the audit.

---

## 7.4 Migration Agent

### Objective

Manage a large migration across multiple batches.

### Possible responsibilities

- inventory incoming packages;
- classify authority;
- manage migration batches;
- track unresolved items;
- run validation;
- produce progress reports;
- coordinate review gates;
- submit import proposals.

### Suitability

Use an agent for large migrations.

Use a skill for small or one-time imports.

---

## 7.5 UX Evaluation Agent

### Objective

Repeatedly evaluate implemented interfaces against accepted UI requirements.

### Possible responsibilities

- inspect view screenshots;
- compare implemented states with requirements;
- test command discoverability;
- evaluate blocked and recovery flows;
- review accessibility evidence;
- create UI findings;
- propose tasks.

### Suitability

Potential agent during active productization.

Initially, a skill plus native review runs may be sufficient.

---

## 7.6 Friction Observation Agent

### Objective

Identify recurring workflow friction and propose native improvements.

### Possible signals

- repeated command failures;
- frequently reopened tasks;
- recurring Codex corrections;
- repeated manual workarounds;
- context-loading mistakes;
- abandoned UI paths;
- validation failures;
- recurring Git reconciliation problems.

### Output

- evidence-backed friction records;
- improvement proposals;
- capability candidates;
- UI fixes;
- documentation changes;
- rule-change proposals.

### Risks

This agent requires:

- privacy boundaries;
- provenance;
- evidence thresholds;
- false-positive handling;
- retention rules;
- non-surveillance safeguards.

### Suitability

Late-stage agent candidate.

---

# 8. Recommended ThinkIO Agent Contract

Every agent should have a native contract.

The contract should define:

- role;
- purpose;
- allowed capabilities;
- accepted input types;
- output schema;
- task scope;
- readable state;
- writable state;
- mutation permissions;
- approval requirements;
- evidence requirements;
- stop conditions;
- escalation conditions;
- maximum execution window;
- retry policy;
- failure behavior;
- audit-log requirements;
- allowed external providers;
- prohibited actions;
- self-review restrictions;
- supersession rules.

## 8.1 Suggested filetype distribution

### CUE

Use for:

- permissions;
- invariants;
- constraints;
- allowed transitions;
- input and output validation;
- stop conditions;
- policy rules.

### JSON

Use for:

- assignments;
- runtime state;
- execution records;
- findings;
- review outputs;
- status snapshots.

### TypeScript

Use for:

- deterministic execution;
- adapters;
- validators;
- command orchestration;
- state transitions;
- provider boundaries.

### BAML

Use only for:

- model-facing contracts;
- structured interpretive tasks;
- AI-worker inputs and outputs;
- classification or review prompts that genuinely require model judgment.

### Markdown

Use for:

- rationale;
- operator guidance;
- role explanations;
- examples;
- policy interpretation;
- human-readable reports.

---

# 9. Agent Governance Principles

Agents should follow the principles below.

## 9.1 Replaceability

No agent should contain project knowledge that cannot be reconstructed from native ThinkIO records.

## 9.2 Bounded authority

Agents should receive only the permissions required for their current assignment.

## 9.3 Evidence-first outputs

Claims should be connected to:

- files;
- task records;
- command outputs;
- tests;
- screenshots;
- logs;
- accepted decisions.

## 9.4 No self-acceptance

An agent should not both produce and approve the same authoritative outcome.

## 9.5 Native mutation only

Agents should mutate project state through native commands or validated state transitions, not arbitrary file edits.

## 9.6 Explicit stop conditions

Agents should stop when:

- scope becomes ambiguous;
- required authority is missing;
- validation fails;
- the task crosses an approval boundary;
- a conflicting accepted decision is found;
- the requested action exceeds the agent contract.

## 9.7 Reconstructible memory

Agent memory should be written into governed records or treated as disposable working context.

## 9.8 Observable execution

Agent activity should create:

- logs;
- findings;
- proposals;
- task references;
- evidence links;
- completion or failure records.

---

# 10. Skills and Agents Are Not Equivalent

| Concept | Purpose | Holds authority? | Persistent? | Autonomous? |
|---|---|---:|---:|---:|
| Native function | Executes system behavior | Yes, within rules | Usually | Deterministic |
| Skill | Teaches a model a procedure | No | No | No |
| Agent | Pursues a bounded objective | No, unless narrowly delegated | Sometimes | Yes |
| View | Presents state | No | No | No |
| Projection | Derived representation | No | Regenerable | No |
| Task | Governed unit of intended change | Yes | Yes | No |
| Decision record | Preserves accepted rationale | Yes | Yes | No |
| Review finding | Records evidence and concern | No, until accepted | Yes | No |
| Checkpoint | Preserves accepted project state | Yes | Yes | No |
| Export | Packages accepted material | No new authority | Yes | No |

This distinction should become explicit in ThinkIO’s architecture and terminology.

---

# 11. Recommended End-State Structure

```text
ThinkIO native capabilities
├── session bootstrap
├── session closeout
├── task and state governance
├── next-action resolution
├── context and provenance resolution
├── dependency graph
├── capability registry
├── capability promotion classifier
├── decision records
├── review runs
├── friction improvement loop
├── semantic naming registry
├── scoped decomposition
├── UI requirement traceability
├── checkpoints
├── export profiles
├── project-material registry
├── execution windows
└── external-worker contracts

Remaining skills
├── thinkio-workspace
├── thinkio-project-migration
├── thinkio-independent-audit
├── thinkio-capability-proposal
├── thinkio-ui-review
├── thinkio-export-assistant
├── thinkio-technical-communication
├── thinkio-legacy-recovery
└── provider-specific adapters

Potential agents
├── independent review agent
├── release-readiness agent
├── documentation synchronization agent
├── migration agent
├── UX evaluation agent
└── friction observation agent
```

---

# 12. Recommended Translation Sequence

## Phase 1 — Finish native authority translation

Complete the native implementation of:

- bootstrap;
- closeout;
- next-action resolution;
- worktree reconciliation;
- context and provenance;
- capability classification;
- capability lifecycle;
- decision records;
- UI traceability;
- review runs;
- export profiles.

Do not create agents before these foundations exist.

## Phase 2 — Reduce and redesign the skill layer

Replace the deprecated skill bundle with a smaller set of thin skills.

Each remaining skill should:

- call native functions;
- avoid duplicate authority;
- remain compact;
- expose clear triggers;
- preserve external provider separation;
- produce proposals rather than accepted state.

## Phase 3 — Introduce one agent pilot

The best first pilot is likely:

```text
Documentation Synchronization Agent
```

Reasons:

- bounded scope;
- high current value;
- clear evidence sources;
- low authority risk;
- visible output;
- easy human review;
- directly addresses known documentation drift.

A second candidate would be:

```text
Independent Review Agent
```

## Phase 4 — Add agent contracts and execution records

Before adding more agents, implement:

- agent registry;
- permission profiles;
- input/output schemas;
- assignment records;
- execution logs;
- stop and escalation handling;
- human approval gates;
- evidence linking.

## Phase 5 — Add higher-autonomy agents selectively

Consider:

- release readiness;
- migration;
- UX review;
- friction observation.

Only add these when their native boundaries are stable.

---

# 13. Risks to Avoid

## 13.1 Converting every skill into an agent

This would create unnecessary autonomous complexity.

## 13.2 Keeping skill-era authority

Skills must not continue to own project state, priorities, handoffs, or canonical files.

## 13.3 Prompt-defined governance

Permissions and transitions should not exist only inside agent prompts.

## 13.4 Agent-specific hidden memory

Project continuity should remain in native records.

## 13.5 Duplicate planning systems

Agents should operate on the native task model rather than maintaining independent queues.

## 13.6 Self-validating agents

Review agents must not accept their own findings.

## 13.7 Provider contamination

Provider-specific behavior should remain outside the core runtime.

## 13.8 Premature autonomy

Agents should not be introduced before bootstrap, closeout, context, permissions, and task boundaries are reliable.

---

# 14. Decision Framework

Use the following decision tree for each capability.

## Question 1

Does the capability determine project truth, permissions, state, or accepted transitions?

- **Yes:** Native ThinkIO function.
- **No:** Continue.

## Question 2

Does it teach a model how to perform a repeatable, on-demand procedure?

- **Yes:** Skill.
- **No:** Continue.

## Question 3

Does it pursue an ongoing objective across changing conditions?

- **Yes:** Agent candidate.
- **No:** Continue.

## Question 4

Is it tied to an external provider or tool?

- **Yes:** Provider-specific skill or adapter.
- **No:** Continue.

## Question 5

Is it merely a derived representation of accepted state?

- **Yes:** Projection, report, or view.
- **No:** Reassess the capability boundary.

---

# 15. Final Recommendation

Do not convert the deprecated skills directly into agents.

The correct sequence is:

1. Translate authoritative and deterministic responsibilities into native ThinkIO capabilities.
2. Retire skills that duplicate project state, workflow coordination, validation, or planning.
3. Retain only a compact set of external interaction, migration, audit, communication, UI-review, export-selection, and provider-specific skills.
4. Introduce agents only for ongoing, bounded, evidence-producing roles.
5. Require all agents to operate through native contracts.
6. Keep project truth, permissions, state transitions, approvals, and validation inside ThinkIO.
7. Make agent memory reconstructible and agent behavior replaceable.
8. Prevent agents from accepting their own outputs.
9. Treat skills as manuals and adapters, not as hidden runtime modules.
10. Treat agents as governed workers, not as alternate operating systems.

The mature target state is:

> **ThinkIO owns the system. Skills explain how external models interact with it. Agents perform bounded work through it.**

That separation gives ThinkIO a stable authority model while still allowing specialized intelligence, automation, provider integration, independent review, and future multi-agent workflows.
