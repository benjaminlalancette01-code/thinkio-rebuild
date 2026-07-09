# Runtime and Kernel Dependency Audit

Date: 2026-06-28

Scope: `kernel/**/*.ts`, `runtime/**/*.ts`, related schemas, state files, tests, and current visual runtime-flow support. Archive and legacy areas were not read.

## Verification Run

- `npm run check`: passed.
- `npm test`: passed through `npm run check`, 36 tests.
- `npm run validate:cue`: passed for all governed task JSON files.
- `npx tsc --noEmit`: failed because `typescript` is not installed; `npx` attempted to run the unrelated deprecated `tsc@2.0.4` package.
- `npm ls --depth=0`: only `@types/node` is installed.

## Findings

### High: Strict TypeScript Validation Is Configured But Missing Its Compiler Dependency

`tsconfig.json` configures strict NodeNext TypeScript validation over `kernel`, `runtime`, and `tests`, but `package.json` does not include `typescript` and has no typecheck script.

Evidence:

- `tsconfig.json:2` through `tsconfig.json:16` defines strict compiler options and includes the audited source trees.
- `package.json:7` through `package.json:13` defines check/test scripts, but no typecheck script.
- `package.json:18` through `package.json:20` lists only `@types/node` in `devDependencies`.
- `npx tsc --noEmit` failed by resolving deprecated `tsc@2.0.4`, not the TypeScript compiler.

Impact:

The runtime currently depends on Node's `--experimental-strip-types` path and tests for validation. That catches executed behavior, but it does not provide a stable strict typecheck gate. Missing type-only dependency regressions can land unnoticed.

Recommended fix:

Add `typescript` as a dev dependency and add a script such as `typecheck: "tsc --noEmit"`, then include it in `npm run check`.

### High: Command Registry Contains Allowed Actions With No Runtime Implementation

`runtime/command-registry.ts` allow-lists local actions that are not exposed by `runtime/local-dev-runtime.ts` or any other runtime module.

Evidence:

- `runtime/command-registry.ts:1` through `runtime/command-registry.ts:9` allow-lists `validate-json-task-files`, `validate-transitions`, `run-tests`, and `write-checkpoint`.
- `runtime/local-dev-runtime.ts:103` through `runtime/local-dev-runtime.ts:119` exposes schema validation and view updates.
- `runtime/local-dev-runtime.ts:88` through `runtime/local-dev-runtime.ts:101` builds a preview and checkpoint, but does not expose a general `write-checkpoint` runtime operation.

Impact:

The allow-list can imply a governed runtime action exists when there is no callable operation behind it. That makes dependency status ambiguous: callers can check that an action is allowed, but cannot execute the corresponding governed behavior through the runtime.

Recommended fix:

Either add explicit local runtime entrypoints for every allow-listed action or split the registry into `reservedActions` and `implementedActions`.

### High: Approval Boundary Lists Mutation Planning But Mutation Planning Is Not Runtime-Wired

The approval boundary marks `plan-mutation-transaction` as approval-required, but that action is not in the command registry and no runtime function plans a mutation transaction.

Evidence:

- `runtime/local-dev-runtime.ts:8` through `runtime/local-dev-runtime.ts:11` lists `plan-mutation-transaction` as approval-required.
- `runtime/command-registry.ts:1` through `runtime/command-registry.ts:9` does not allow-list `plan-mutation-transaction`.
- `kernel/mutation-transaction.ts:25` through `kernel/mutation-transaction.ts:49` implements transaction record creation and validation only in the kernel.
- `runtime/local-dev-runtime.ts:103` through `runtime/local-dev-runtime.ts:119` does not call the mutation transaction kernel.

Impact:

TASK-012 and TASK-013 are not fully dependent on each other at runtime. The kernel can model a mutation transaction, and the runtime can describe an approval boundary for that action, but there is no approved local runtime path that combines both.

Recommended fix:

Add an explicit `planMutationTransaction(...)` runtime function that checks `assertLocalDevActionAllowed("plan-mutation-transaction")`, checks approval, creates the transaction record, and validates it. Add `plan-mutation-transaction` to the command registry once implemented.

### High: Non-Task CUE Schemas Are Not Part Of Continuous Runtime Validation

The validation runtime discovers only `tasks/*.json` and vets each one against `schemas/task.schema.cue`. Kernel/runtime state schemas for approvals, checkpoints, deferred items, execution windows, artifacts, decomposition, replay validation, mutation transactions, and context packets are not discovered by `npm run validate:cue`.

Evidence:

- `runtime/cue-validator.ts:49` through `runtime/cue-validator.ts:64` discovers only JSON files under the task directory.
- `runtime/cue-validator.ts:57` through `runtime/cue-validator.ts:61` hard-codes `schemas/task.schema.cue` and `#GovernedTask`.
- `runtime/validate-schemas.ts:1` through `runtime/validate-schemas.ts:13` delegates to workspace task schema validation only.

Impact:

New schemas can pass one-off tests but drift later without being caught by the standard `npm run check` path. This is especially relevant for recent schemas: `schemas/decomposition.schema.cue`, `schemas/replay-validation.schema.cue`, and `schemas/mutation-transaction.schema.cue`.

Recommended fix:

Add a registry of non-task validation targets, or extend discovery to validate state files and fixture files against their matching schema definitions. Include those targets in `npm run validate:cue`.

### Medium: Approval Runtime Does Not Read `state/approvals.json`

Approval helpers accept approval records as an in-memory parameter, but no runtime function loads `state/approvals.json`.

Evidence:

- `state/approvals.json` exists and is empty.
- `runtime/local-dev-runtime.ts:51` through `runtime/local-dev-runtime.ts:58` searches an approval array provided by the caller.
- `runtime/local-dev-runtime.ts:88` through `runtime/local-dev-runtime.ts:101` defaults approvals to an empty array for checkpoint preview.

Impact:

The approval boundary is testable, but it is not yet connected to the canonical local approval state file. A caller has to know to read and pass approvals manually.

Recommended fix:

Add a small approval-state reader and a runtime helper that applies approval checks from `state/approvals.json` by default, while preserving injectable records for tests.

### Medium: Ledger Artifact Creation Drops Optional Dependency Metadata

`ArtifactRecord` supports `hash` and `dependsOn`, but `createArtifactRecord` omits both fields from the returned record.

Evidence:

- `kernel/types.ts:55` through `kernel/types.ts:60` defines optional `hash` and `dependsOn`.
- `kernel/ledger.ts:12` through `kernel/ledger.ts:20` returns only id, taskId, path, kind, evidence, and createdAt.

Impact:

Callers using `createArtifactRecord` cannot create complete artifact-chain-ready records with dependency references or hashes. This weakens stale-artifact and chain validation unless callers bypass the helper and construct records manually.

Recommended fix:

Preserve `hash` and `dependsOn` in `createArtifactRecord`, including defensive array copying for `dependsOn`.

### Medium: Artifact Chain Validation Does Not Enforce Manifest Task Scope

`validateArtifactChain` checks that referenced artifact IDs exist and dependency IDs exist, but it does not verify that manifest artifacts belong to `manifest.taskId` or that the root artifact is included in `manifest.artifactIds`.

Evidence:

- `kernel/artifact-chain.ts:32` through `kernel/artifact-chain.ts:51` validates ID existence, dependency existence, and stale IDs.
- No check compares artifact `taskId` to `manifest.taskId`.
- No check requires `manifest.rootArtifactId` to appear in `manifest.artifactIds`.

Impact:

A manifest can validate while silently crossing task boundaries, which undermines reconstruction/replay confidence and ledger provenance.

Recommended fix:

Validate root membership, artifact membership by task, and optionally require all dependency links to stay within the manifest unless cross-task dependencies are explicitly modeled.

### Medium: Task Runner Bypasses Execution Windows And Approval Boundaries

`prepareTaskRun` checks executable status/authority and builds a context packet, but it does not consult execution windows or approvals.

Evidence:

- `runtime/task-runner.ts:5` through `runtime/task-runner.ts:12` uses `canExecuteTask`, `explainBlockedExecution`, and `buildContextPacket`.
- `kernel/execution-window.ts` provides `canExecuteWithinWindow` and `explainExecutionWindowBlockers`, but `runtime/task-runner.ts` does not import it.
- `runtime/local-dev-runtime.ts` contains approval boundary helpers, but `runtime/task-runner.ts` does not import or use them.

Impact:

The execution-preparation path can report `canExecute: true` for an executable task even when a required execution window is closed or no approval context has been considered.

Recommended fix:

Extend `prepareTaskRun` to accept optional execution window and approval inputs, or rename it to make clear that it is a shallow gate-only preview.

### Low: Runtime-Flow Visual Support Is Stale After TASK-010 Through TASK-013

The JSON Flow support file still describes several runtime/kernel pieces as missing or basic even after later tasks added decomposition, replay validation, mutation transactions, and approval boundary helpers.

Evidence:

- `views/thinkio-runtime-flow.json` task coverage stops at TASK-008.
- It still flags approval flow as not wired even though `runtime/local-dev-runtime.ts` now has approval helpers.
- It does not include the new kernel modules added after TASK-009.

Impact:

This does not affect runtime execution, but it can mislead future audits or visual inspection.

Recommended fix:

Refresh `views/thinkio-runtime-flow.json` after TASK-014 or as a small maintenance task so visual support matches current kernel/runtime state.

## No Missing Import Modules Found In Executed Paths

The standard runtime/test path did not reveal missing local module imports. `npm run check` completed successfully, and tests exercised current kernel/runtime imports through Node's TypeScript stripping mode.

This finding is deliberately narrower than strict type validation because the TypeScript compiler dependency is currently absent.

## Suggested Priority Order

1. Add `typescript` and a real `typecheck` script.
2. Reconcile command registry actions with implemented runtime entrypoints.
3. Wire mutation transaction planning through local runtime and approval boundaries.
4. Extend CUE validation beyond governed task JSON.
5. Fix ledger artifact metadata preservation.
6. Tighten artifact chain task-scope validation.
7. Decide whether task-runner should consume execution windows and approvals.
8. Refresh runtime-flow visual support.
