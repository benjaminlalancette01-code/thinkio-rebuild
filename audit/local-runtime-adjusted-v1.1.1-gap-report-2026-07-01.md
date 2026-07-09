# Local Runtime Adjusted v1.1.1 Gap Report

Date: 2026-07-01

## Purpose

This report extends `audit/v1.1.1-reentry-emulation-runtime-gap-audit-2026-07-01.md`.

The earlier audit correctly identified major missing Phase 5 runtime pieces, but it still framed several concepts in their v1.1.1 GPT-reentry form. This report adjusts those concepts for the current rebuild direction: ThinkIO is no longer only a ChatGPT-session compatibility layer. It is becoming a local runtime/kernel that manages files, state, tasks, model handoff, validation, and history directly on the machine.

The key shift:

```text
v1.1.1 reentry discipline -> local runtime state validation, versioning, context assembly, model proposal ingestion, and native task orchestration
```

## Sources Revisited

The deeper pass used the previous report plus targeted v1.1.1 artifacts:

- `04-reentry/reentry-prompt-phase-5.md`
- `09-mappings/phase-5-context-dependency-map.md`
- `09-mappings/thinkio-execution-model-process-stack.md`
- `13-deferred/phase-5/deferred-work-unification-map.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/step-object-spec.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/step-lifecycle-transition-map.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/step-system-behavior.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/kanban-cards.md`
- `20-reconstruction/src/pass3/project-artifacts/07-review/kanban-project-overview-exploration-note.md`
- `20-reconstruction/src/pass3/project-artifacts/07-review/review-9-review-before-lock-mode-aware.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/model-interaction-contract.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/model-input-contract.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/model-output-contract.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/context-assembler-contract.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/provider-adapter-contract.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/file-action-contract.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/runtime-flow-spec.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/validation-engine-spec.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/validation-runtime-triggers.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/workspace-write-boundaries.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/runtime-orchestrator-contract.md`
- `20-reconstruction/src/pass3/project-artifacts/07-review/callback-status-model.md`
- `20-reconstruction/behavior-enforcement/behavior-derivation-report-template.md`
- `20-reconstruction/approved-rules/friction-signal-report.md`
- `20-reconstruction/unfinished-work/friction-signal-report-candidate.md`
- `20-reconstruction/external-reports/external-report-integration-rule.md`
- `20-reconstruction/external-reports/external-report-review-framework.md`
- `20-reconstruction/external-reports/external-report-review-template.md`
- `07-validation/session-audits/derivation-report-rule-synchronization-2026-04-30.md`
- `07-validation/session-audits/derivation-report-v1.0.29-acceptance-operation-2026-04-30.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/context-card-model.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/context-card-promotion-rules.md`
- `20-reconstruction/src/pass3/project-artifacts/06-execution/contract-usage-alignment.md`
- `10-reference-reports/external-reports/thinkio-app-type-and-runtime-architecture.md`

## Main Adjustment

v1.1.1 used reentry to make a model behave safely across chat sessions. In the local rebuild, the same ideas should become runtime/kernel capabilities:

- Reentry grounding becomes startup/state validation.
- Closeout becomes version/history/checkpoint validation.
- Return points become branch/work-item anchors.
- Ledger slices become active work-state records.
- Chat context loading becomes deterministic context assembly.
- Model reply handling becomes proposal classification and ingestion.
- Kanban Markdown becomes a temporary mirror until ThinkIO owns its own board.

The concept is good. The application must change.

## Deeper Finding 1: Task Handling Is Not Just Task Status

The rebuild currently has governed tasks with statuses like `idea`, `candidate`, `accepted`, `frozen`, `executable`, `done`, and `archived`.

That is useful for governance, but v1.1.1 expected another layer: a step/workflow board.

The old Step Object Specification defines:

- one active step
- multiple queued next steps
- multiple deferred steps
- multiple resolved steps
- parent/child steps
- ordered sequence position
- artifact links
- issue links
- bulk move/resolve/reorganize actions

The old Step Lifecycle map defines:

- `queued_next -> active -> resolved`
- `queued_next <-> deferred`
- `active -> deferred`
- `resolved -> active`
- `resolved -> queued_next`

That means ThinkIO needs two related but distinct models:

1. Governed task authority model.
2. Operational step/workflow model.

In the rebuild these are currently collapsed into one task status axis. That is too coarse for the intended ThinkIO runtime.

## Local Runtime Interpretation

The local runtime should own a native workboard, not depend on external Kanban Markdown cards.

The board should be generated from canonical ThinkIO state and should support:

- Current Step
- Next Steps
- Deferred Steps
- Resolved / History
- Ideas / Intake
- possibly Execution / Review lanes later

Important distinction:

- `candidate`, `accepted`, `executable`, `done` describe governance authority.
- `current`, `queued_next`, `deferred`, `resolved` describe workflow position.
- `brainstorm`, `plan`, `build`, `review`, `execute` describe operating mode.

These should not be forced into one column system.

## Missing Capability: Native ThinkIO Kanban

The rebuild has:

- `views/kanban.json`
- `.devtool/features/*.md`

But these are projections or mirrors. The old system expected ThinkIO to have its own board and interaction model.

Missing pieces:

- native board state
- ordered next-step queue
- one-current-step invariant
- substep expansion/collapse
- dependency-aware drag/move rules
- deferred resurfacing
- history/resolved reopen behavior
- board actions that call kernel/runtime transitions
- project overview summary above or beside the board

Adjusted task recommendation:

```text
Add native workboard/step-board model before UI implementation.
```

## Deeper Finding 2: Parallel Work Was Intended

The old system was meant to handle multiple needed tasks at once:

- multiple queued next steps
- multiple deferred steps
- multiple resolved steps
- branches A / B / C when relevant
- child steps under a current step
- deferred branches that remain tracked but inactive

Only one step should be the execution anchor, but many steps can be tracked in parallel.

The rebuild can store multiple task records, but it does not yet express:

- active execution anchor
- ordered parallel next queue
- branch set
- branch purpose
- branch success condition
- return point
- branch completion
- relevance-based deferred resurfacing

## Local Runtime Interpretation

Because this is now local, parallel work should be persisted as state, not reconstructed from chat.

Suggested state files:

- `state/workboard.json`
- `state/branches.json`
- `state/process-ledger.json`
- `state/context-slices.json`

The model should not be trusted to remember parallel work. The runtime should hand the model a bounded active slice and then ingest the model's output back into these local state files after validation.

## Deeper Finding 3: Modes Are Governance Strictness, Not Just Context Filters

The rebuild already has task modes:

- `brainstorm`
- `plan`
- `build`
- `review`
- `freeze`
- `execute`

The current context router can filter context by mode.

But v1.1.1's mode-aware review rule implies something deeper:

- Exploratory mode tolerates ambiguity but strongly prevents premature lock-in.
- Planning/refinement mode requires options and explicit choice before lock.
- Lock/sync mode has the strictest packaging and promotion controls.
- Execution mode allows faster iteration for small changes but still blocks structural corruption.

So mode affects:

- allowed actions
- review strictness
- validation severity
- required evidence
- whether model output can be ingested as idea, candidate, proposal, or applied state
- whether user approval is required
- whether history/versioning must be updated

## Local Runtime Interpretation

Mode switching should be a first-class kernel operation.

Missing pieces:

- mode transition rules
- mode-specific action policy
- mode-specific validation profile
- mode-specific model-output ingestion policy
- review-before-lock gate
- brainstorm/exploration output capture into `idea` or `deferred`, not canonical state

Adjusted task recommendation:

```text
Add mode policy engine and review-before-lock gate.
```

## Deeper Finding 4: Reentry Becomes Startup And State Readiness

In v1.1.1, reentry was a GPT compatibility layer. It protected the next chat from acting without reading the correct files.

In the local rebuild, this should not remain a chat ritual. It should become runtime startup/readiness validation.

The runtime should answer:

- What project is active?
- What state files exist?
- Is the board valid?
- Is exactly one current step active?
- Are queued/deferred/resolved steps valid?
- Are manifests/checksums valid?
- Is there an unfinished transaction?
- Is there an open branch?
- Is the model context slice stale?
- Is the next action blocked?

This is the local equivalent of reentry grounding.

## Adjusted Name

Instead of `ReentryGroundingProof`, use something like:

- `RuntimeReadinessProof`
- `WorkspaceGroundingProof`
- `StartupValidationReport`

The old reentry concept is still useful, but the local form should validate files and state, not ask a model to swear it read a prompt.

## Deeper Finding 5: Closeout Becomes History, Versioning, And Validation

v1.1.1 used closeout before new chats or risky transitions.

In a local runtime, closeout should become:

- version snapshot
- history record
- validation run
- rollback anchor
- branch return marker
- board state checkpoint
- package/build readiness report when relevant

It is less about chat continuity now and more about local trust.

Suggested local closeout object:

```text
CloseoutRecord:
  id
  scope
  reason
  activeStepId
  branchId
  validationRunIds
  changedArtifacts
  rollbackIds
  boardSnapshotId
  nextValidAction
  createdAt
```

This should connect to checkpoints, mutation rollbacks, and package/history validation.

## Deeper Finding 6: Model Handoff Requires Contracts

v1.1.1 is explicit: the model does not own project truth. The model is a bounded proposal engine inside ThinkIO.

The old model input contract requires:

- runtime intent
- user request
- active artifact or project-level target
- context bundle state
- primary context
- governance context
- runtime context

The old model output contract requires:

- raw response
- output class
- provider/model identity
- warnings

Output classes include:

- explanation
- summary
- draft
- structured proposal
- file action request
- promotion suggestion
- lock-in suggestion
- validation note
- missing artifact warning
- unknown

The rebuild has context packets and local runtime gates, but it does not yet have a model handoff/ingestion loop.

## Local Runtime Interpretation

ThinkIO needs a provider-independent local model interface:

```text
Context Assembler -> Provider Adapter -> Model Output Classifier -> Governance Enforcer -> Proposal Store -> State Writer -> Validation Refresh
```

The model should never write files directly. It should emit typed outputs. The runtime should classify, validate, and either:

- store as idea
- store as deferred
- create candidate task
- create file action proposal
- require approval
- block
- apply through governed mutation

## Missing Capability: Model Ingestion Pipeline

Missing pieces:

- model input contract schema
- model output contract schema
- provider adapter abstraction
- model output classifier
- proposal store
- file action proposal model
- post-provider validation
- ingestion policy by mode
- proposal-to-task conversion

This is one of the largest gaps between the rebuild and the intended ThinkIO runtime.

## Deeper Finding 7: Validation Loop Has Three Runtime Positions

v1.1.1 names validation runtime triggers:

- pre-runtime
- post-provider
- post-write

The rebuild currently validates schemas and tests mostly as explicit commands. It does not yet wrap model execution and file writes in a validation loop.

Local runtime should support:

- pre-runtime validation before context/model call
- post-provider validation before governance/action
- pre-write validation before state mutation
- post-write validation after state mutation
- board/view refresh after successful writes
- visible validation output with severity

This matters because the model can produce plausible but invalid proposals.

## Deeper Finding 8: File Handling Is Still Central, But Different

In GPT reentry mode, file handling meant "read the right files and do not hallucinate state."

In local runtime mode, file handling means:

- read selected source files
- assemble deterministic context bundles
- track included/excluded sources
- hash or version artifacts
- propose file actions
- validate file actions against workspace boundaries
- apply accepted writes atomically
- record history/rollback
- refresh validation and views

The rebuild has a guarded mutation applier, which is a strong start. But it is still task-state focused. It does not yet cover general file action classes:

- read
- create
- update
- delete
- rename
- move
- export checkpoint
- import checkpoint

The old file-action contract expected those to be mediated by ThinkIO.

## Deeper Finding 9: Governance Enforcer Should Become A Runtime Service

The old governance enforcer contract takes:

- context bundle
- output class
- action type

and returns:

- allow
- require approval
- block
- reason
- allowed actions

The rebuild has approval helpers and command allow-lists, but no general governance decision engine for model outputs, file actions, mode policy, and board movement.

Missing pieces:

- governance decision record
- action type vocabulary
- action sensitivity classifier
- allowed action derivation from mode + authority + context + validation state
- decision explanations
- UI/runtime visibility of blocked/approval-required/proposal states

## Deeper Finding 10: Callback / Context Cards Are A Real Continuity Layer

The old callback status model includes:

- active
- active-reference
- superseded
- archived-reference
- canonical-current

This connects to the user's note about sorting, categorizing, and setting new tasks as idea or deferred. ThinkIO needs a way to keep useful context near the project without making it canonical.

Local interpretation:

- Context cards should become state records.
- They should be attached to project, step, artifact, task, branch, or deferred item.
- They should have authority/status.
- They should be visible in the native board/project home.
- They can be promoted into ideas, deferred tasks, candidate tasks, or rejected context through a validation loop.

This is missing in the rebuild.

## Deeper Finding 11: Derivation Reports Are Translation Receipts

v1.1.1 did not use derivation reports as generic summaries. They existed to explain why a behavior, rule, runtime change, or acceptance operation should alter the system.

The Behavior Derivation Report template asks for:

- triggering behavior
- why it matters
- classification as refinement, extension, contradiction, or uncertainty
- affected layer
- proposed system impact
- validation required
- user confirmation
- final decision

The session-audit derivation reports show the same pattern in practice. For example:

- the rule-synchronization report explained why a phrase had to be synchronized across enforcement surfaces
- the acceptance-operation report explained why chat acceptance was not enough until status surfaces were mutated, logged, and validated

This matters for the rebuild because ThinkIO will regularly translate model or third-party app output back into local runtime state. That translation needs a receipt.

## Local Runtime Interpretation

Derivation should become a first-class runtime record attached to imports, model outputs, third-party app results, task transitions, rule promotions, and file-action proposals.

Suggested local object:

```text
DerivationRecord:
  id
  triggerType
  triggerSource
  sourceRefs
  targetRefs
  classification
  affectedLayers
  proposedImpact
  validationRequired
  validationRunIds
  userConfirmation
  decision
  createdAt
```

For local ThinkIO, a derivation record answers:

- Where did this proposed change come from?
- What task, artifact, rule, source, or UI state does it affect?
- Is it a refinement, extension, contradiction, or uncertainty?
- What validation is needed before it can become stronger state?
- Was it accepted, rejected, deferred, or converted into another task?

This is especially important when exporting bounded work to a model or app and then ingesting the response. The runtime should not simply say "the model returned this." It should know how the returned material was derived from the sent package and whether the derivation is valid.

## Deeper Finding 12: Friction Reports Are Runtime Signals, Not Conversation Noise

v1.1.1 promoted the Friction Signal Report to canonical status.

Its core rule was simple:

```text
Repeated confusion, correction, or workflow resistance is treated as a system signal.
```

The candidate version listed examples that map directly to the current rebuild:

- the user repeatedly asks if something is integrated
- the user asks whether work is saved
- the assistant compresses rules too much
- hidden status causes confusion
- the same behavior is corrected multiple times

The approved report fields are also directly reusable:

- friction observed
- where it occurred
- pattern
- likely cause
- missing rule, artifact, or surface
- risk if ignored
- recommended fix
- approval needed

## Local Runtime Interpretation

Friction should become a persisted diagnostic object, not just an audit paragraph.

Suggested local object:

```text
FrictionSignalRecord:
  id
  observedIn
  linkedTaskId
  linkedStepId
  linkedArtifactIds
  linkedModelPackageId
  linkedProviderOutputId
  pattern
  likelyCause
  missingSurface
  risk
  recommendedFix
  approvalNeeded
  status
  createdAt
```

For local ThinkIO, friction can come from:

- model context overload
- missing source selection
- invalid or ambiguous model output
- third-party app export mismatch
- blocked write proposal
- mode mismatch
- unresolved dependency
- board move blocked by governance
- repeated user correction
- UI status ambiguity
- validation loop failure

The runtime should be able to create a friction signal from a failed validation loop, an ambiguous ingestion attempt, or repeated manual correction. The UI should then expose that friction on the Kanban card, workboard step, artifact, or mind-map node where it belongs.

## Deeper Finding 13: External Reports Define The Third-Party Intake Pattern

The old external report rules are the right model for future third-party app and model outputs.

The locked rule says external reports are high-value deferred step artifacts. They are preserved, traceable, unreviewed, non-authoritative, and deferred until reviewed.

The review framework classifies outside material as:

- informational
- hypothesis
- recommendation
- conflict signal
- correction candidate
- upgrade candidate
- rejected / irrelevant

Allowed decisions include:

- no action
- preserve as reference
- create deferred item
- create Behavior Derivation Report
- create Runtime Derivation Report
- create change proposal
- reject
- promote after validation

This is exactly the local pattern needed for model and third-party app ingestion.

## Local Runtime Interpretation

Any output from a model or external app should enter ThinkIO through an intake record, not directly through state mutation.

Suggested local flow:

```text
ExternalOutput
  -> IntakeRecord
  -> Classification
  -> ScopedValidation
  -> DerivationRecord when system behavior/state would change
  -> PromotionDecision
  -> Task / DeferredItem / ContextCard / FileActionProposal / RejectedRecord
```

The model or app can produce useful work. It cannot become authority simply because it is detailed, persuasive, or generated by a selected tool.

## Deeper Finding 14: Export, Ingest, And Validate Need A Local Contract

The old runtime flow and contract alignment artifacts already point to the correct chain:

```text
Context Assembler -> Provider Adapter -> Governance Enforcer -> Artifact State Writer -> validation/UI refresh
```

The contract alignment file adds the missing discipline:

- model outputs are proposals, not direct truth
- file mutation never happens directly from model output
- mutation-sensitive flows pass through governance
- runtime modules preserve proposal-mode behavior
- UI makes contract-shaped states visible

The local rebuild needs to make this concrete for every export and ingestion action.

## Local Runtime Interpretation

ThinkIO should create a bounded work package before sending work to a model or third-party app.

Suggested export object:

```text
WorkPackage:
  id
  targetType
  targetId
  mode
  intent
  expectedOutputClasses
  sourceRefs
  artifactRefs
  ruleRefs
  contextCardRefs
  validationProfile
  providerOrAppTarget
  createdAt
```

Suggested ingest object:

```text
ProviderOutputRecord:
  id
  workPackageId
  providerOrApp
  rawOutputRef
  normalizedOutput
  outputClass
  warnings
  proposedActions
  derivationRecordId
  validationRunIds
  governanceDecisionId
  finalDisposition
```

Validation should occur at five points:

1. pre-export: the package has valid sources, task scope, mode, and expected output classes
2. post-export: the package is recorded, traceable, and not over-broad
3. post-provider: returned output is classified and checked against the expected contract
4. pre-ingest: governance decides whether to store, defer, ask approval, block, or create a proposal
5. post-ingest: state, board views, history, and validation surfaces are refreshed

This is how ThinkIO can use the model without overloading it and without letting the model become the runtime.

## Deeper Finding 15: Kanban, Workboard, And Mind Map Are State Controllers

The user interface is not just a display layer. The old context-card, deferred-work, external-report, runtime-flow, and step-board material all point toward a native ThinkIO control surface.

In the local rebuild:

- Kanban should show authority, status, lane, mode, and blocked/friction states.
- Workboard should manage current, next, deferred, resolved, branch, and return-anchor state.
- Mind map should expose dependencies between sources, artifacts, rules, context cards, work packages, derivation records, friction signals, and validation runs.
- Chat/model interaction should be a controlled surface bound to the selected step, artifact, or context slice.

That means UI state must be built on kernel/runtime records, not on external Markdown alone.

## Local Runtime Interpretation

The UI foundation needs canonical state projections for:

- board lanes and ordered cards
- workboard current/next/deferred/resolved state
- mind-map nodes and edges
- selected context slice for model interaction
- validation and governance status
- friction and derivation markers
- source/artifact/rule relationships
- export/ingest history

The key product behavior is:

```text
User -> ThinkIO UI/state/runtime -> bounded model/app interaction -> validated ingestion -> refreshed board/workspace
```

The user should feel that the model works through ThinkIO, not beside it.

## Updated Gap List

The previous report's TASK-030 through TASK-043 remain useful, but they should be expanded.

The new local-runtime-oriented gap list is:

1. Native step/workboard model.
2. Parallel work and branch anchors.
3. Mode policy engine.
4. Runtime readiness/startup validation.
5. Process ledger / active work slices.
6. Typed context dependency and context-card system.
7. Model handoff and ingestion pipeline.
8. Governance decision engine.
9. Runtime validation loop.
10. General file action proposal and writer boundary.
11. Closeout as history/version/validation.
12. Package/history manifest validation.
13. Native ThinkIO Kanban UI/data model.
14. Derivation report/runtime translation receipt model.
15. Friction signal model and UI/runtime surfacing.
16. External/model/third-party intake review pipeline.
17. Work package export model.
18. Provider/app output ingest record and validation pipeline.
19. Native mind-map dependency projection.
20. User-to-ThinkIO-to-model interaction surface contract.

## Proposed Adjusted Task Chain

Recommended next task chain:

- TASK-030: Add native step/workboard model.
- TASK-031: Add parallel branch and return-anchor model.
- TASK-032: Add mode policy engine and review-before-lock gate.
- TASK-033: Add runtime readiness/startup validation proof.
- TASK-034: Add process ledger and active work slices.
- TASK-035: Add typed context dependency and context card model.
- TASK-036: Add model input/output contract schemas.
- TASK-037: Add provider adapter and model output classifier boundary.
- TASK-038: Add governance decision engine.
- TASK-039: Add runtime validation loop stages.
- TASK-040: Add general file action proposal model and writer boundary.
- TASK-041: Add closeout history/version validation model.
- TASK-042: Add package/history manifest and checksum validation.
- TASK-043: Replace external Kanban dependency with native ThinkIO board projection.
- TASK-044: Add derivation report model for runtime translation receipts.
- TASK-045: Add friction signal model and surface it on tasks, steps, artifacts, and validation results.
- TASK-046: Add external/model/third-party intake review pipeline.
- TASK-047: Add work package export model for bounded model/app handoff.
- TASK-048: Add provider/app output ingest record and validation pipeline.
- TASK-049: Add native mind-map dependency projection.
- TASK-050: Add user-to-ThinkIO-to-model interaction surface contract.

## Priority Recommendation

Start with the board/workflow foundation before model ingestion.

Reason:

The model handoff needs to know where output should land. Without a native workboard and mode policy, model output cannot be reliably classified as:

- idea
- deferred
- next step
- current step work
- candidate task
- file action proposal
- validation note
- blocked output

Recommended first four:

1. TASK-030 native step/workboard model.
2. TASK-031 branch/parallel work anchors.
3. TASK-032 mode policy engine.
4. TASK-033 runtime readiness validation.

Then build model ingestion:

5. TASK-034 process ledger.
6. TASK-035 context dependency/context cards.
7. TASK-036 model contracts.
8. TASK-037 provider adapter/output classifier.
9. TASK-038 governance decision engine.
10. TASK-039 validation loop.

Then harden files/history/UI:

11. TASK-040 file action proposal/writer boundary.
12. TASK-041 closeout history/version validation.
13. TASK-042 package/history manifest validation.
14. TASK-043 native board projection/UI data model.

Then add the derivation/friction/export layer:

15. TASK-044 derivation report model.
16. TASK-045 friction signal model.
17. TASK-046 external/model/third-party intake review.
18. TASK-047 bounded work package export model.
19. TASK-048 provider/app output ingest and validation.
20. TASK-049 native mind-map dependency projection.
21. TASK-050 user-to-ThinkIO-to-model interaction surface contract.

## Current Rebuild State Reinterpreted

The rebuild is no longer just missing "reentry" in the old sense. It has moved beyond that shape.

What it has:

- governed task records
- schema validation
- approval-gated mutation planning/application
- artifact and checkpoint models
- simple deferred model
- context packets
- generated status Kanban

What it lacks:

- operational step board
- local process memory
- local mode policy
- branch/parallel work tracking
- model proposal ingestion
- native validation stages around provider calls
- general governed file actions
- history/version closeout
- ThinkIO-owned Kanban behavior
- derivation records for model/app/task translation
- friction signals as first-class runtime/UI records
- external/model/third-party intake review pipeline
- bounded work package export records
- provider/app output ingestion records
- native mind-map dependency projection
- controlled user-to-ThinkIO-to-model interaction surface

## Bottom Line

The v1.1.1 reentry package was a compatibility bridge. Its concepts should not be copied as chat rituals.

For the local rebuild, those concepts should become runtime services:

- startup validation instead of reentry prompt proof
- workboard state instead of chat "current step"
- mode policy instead of informal mode behavior
- context assembler instead of manual file loading
- model output classifier instead of trusting responses
- governance decision engine instead of assistant judgment
- validation loop instead of after-the-fact checking
- closeout history instead of chat handoff
- native ThinkIO Kanban instead of external Markdown board dependence
- derivation records instead of invisible interpretation
- friction signals instead of repeated confusion
- bounded export/ingest contracts instead of raw model or app handoff
- native board/workboard/mind-map projections instead of UI state guessed from files

That is the next shape of a true ThinkIO runtime/kernel.
