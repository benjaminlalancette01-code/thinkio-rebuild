import test from "node:test";
import assert from "node:assert/strict";
import type {
  ApprovalRecord,
  CloseoutRecord,
  DerivationRecord,
  FileActionProposal,
  FrictionSignal,
  GovernedTask,
  InteractionSurfaceContract,
  PackageHistoryManifest,
  ProviderOutputRecord,
  WorkPackage
} from "../kernel/types.ts";
import { classifyFileActionRisk, evaluateWriterBoundary, explainFileActionProposalBlockers } from "../kernel/file-action.ts";
import { createCloseoutRecord, explainCloseoutBlockers, validateCloseoutRecord } from "../kernel/closeout-history.ts";
import { explainPackageHistoryManifestBlockers, validatePackageHistoryManifest } from "../kernel/package-history.ts";
import { buildNativeBoardProjection, buildRuntimeMindmapProjection } from "../kernel/runtime-projections.ts";
import { routeDerivationDecision, validateDerivationRecord, explainDerivationBlockers } from "../kernel/derivation.ts";
import { canTransitionFrictionSignal, validateFrictionSignal } from "../kernel/friction-signal.ts";
import { chooseIntakePromotionDecision, classifyExternalOutput, explainIntakeBlockers } from "../kernel/intake-pipeline.ts";
import { createWorkPackage, explainWorkPackageBlockers, validateWorkPackage } from "../kernel/work-package.ts";
import { chooseProviderOutputDisposition, explainProviderOutputIngestBlockers, validateProviderOutputIngest } from "../kernel/provider-output-ingest.ts";
import { explainInteractionSurfaceBlockers, validateInteractionSurfaceContract, visibleStateForGovernanceDecision } from "../kernel/interaction-surface.ts";
import { evaluateGovernanceDecision } from "../kernel/governance-decision.ts";

const task: GovernedTask = {
  id: "TASK-040",
  title: "Add file action proposal model",
  mode: "build",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-038", "TASK-039"],
  allowedContext: [],
  blockedContext: [],
  requiredEvidence: [],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const approval: ApprovalRecord = {
  id: "APR-TASK-040",
  taskId: "TASK-040",
  approvedBy: "human",
  scope: "local-dev:file-action",
  approvedAt: "2026-07-02T00:00:00.000Z"
};

test("file action proposals route write risk through the writer boundary", () => {
  const proposal: FileActionProposal = {
    id: "FILE-ACTION-001",
    taskId: "TASK-040",
    action: "update",
    path: "kernel/types.ts",
    rationale: "Add runtime boundary type.",
    risk: classifyFileActionRisk("update", "kernel/types.ts"),
    requiredApproval: true,
    checkpointId: "CHK-TASK-040",
    rollbackAnchorId: "ROLLBACK-TASK-040"
  };

  assert.equal(proposal.risk, "high");
  assert.deepEqual(explainFileActionProposalBlockers(proposal), [
    "File action proposal FILE-ACTION-001 requires approval for task TASK-040."
  ]);
  assert.equal(evaluateWriterBoundary(proposal, [approval]).outcome, "approval-required");
});

test("closeout records link checkpoint, validation, changed artifacts, and rollback anchors", () => {
  const closeout = createCloseoutRecord({
    id: "CLOSEOUT-001",
    scope: "task",
    reason: "End of medium runtime pass.",
    taskId: "TASK-041",
    activeStepId: "STEP-041",
    validationRunIds: ["VAL-POST-INGEST"],
    changedArtifactIds: ["ART-TASK-041"],
    rollbackAnchorIds: ["ROLLBACK-TASK-041"],
    checkpointId: "CHK-TASK-041",
    mutationRollbackIds: ["MUT-ROLLBACK-041"],
    nextValidAction: "review-output",
    createdAt: "2026-07-02T00:00:00.000Z"
  });

  assert.equal(validateCloseoutRecord(closeout), true);
  assert.deepEqual(explainCloseoutBlockers({ ...closeout, changedArtifactIds: ["ART"], rollbackAnchorIds: [] }), [
    "Closeout CLOSEOUT-001 changed artifacts but has no rollback anchor."
  ]);
});

test("package/history manifest validation catches stale, missing, and mismatched entries", () => {
  const manifest: PackageHistoryManifest = {
    id: "PKG-HISTORY-001",
    version: "0.3.0",
    entries: [
      { path: "kernel/types.ts", hash: "hash-a", required: true },
      { path: "state/missing.json", hash: "hash-b", required: true }
    ],
    closeoutId: "CLOSEOUT-001",
    readinessProofId: "READINESS-RUNTIME",
    createdAt: "2026-07-02T00:00:00.000Z"
  };

  assert.equal(validatePackageHistoryManifest(manifest, { "kernel/types.ts": "hash-a" }), false);
  assert.deepEqual(explainPackageHistoryManifestBlockers(manifest, { "kernel/types.ts": "stale" }), [
    "Manifest hash mismatch for kernel/types.ts.",
    "Missing required manifest entry: state/missing.json."
  ]);
});

test("native board projection preserves mirror boundary while exposing runtime lanes and actions", () => {
  const board = buildNativeBoardProjection({
    id: "BOARD-PROJECTION",
    tasks: [task],
    workboard: {
      id: "WORKBOARD",
      taskIds: ["TASK-040"],
      updatedAt: "2026-07-02T00:00:00.000Z",
      steps: [
        {
          id: "STEP-040",
          taskId: "TASK-040",
          title: "Writer boundary",
          workflowPosition: "current",
          status: "open",
          order: 0,
          artifactLinks: []
        }
      ]
    },
    frictionSignals: [
      {
        id: "FRICTION-001",
        observedLocation: "board",
        links: [],
        pattern: "Mirror confusion",
        cause: "External card movement",
        missingSurface: "Native board projection",
        risk: "medium",
        recommendation: "Project runtime state.",
        approvalNeeded: false,
        status: "active",
        taskId: "TASK-040"
      }
    ]
  });

  assert.deepEqual(board.lanes.current[0].frictionSignalIds, ["FRICTION-001"]);
  assert.equal(board.actions.find((action) => action.action === "move-card")?.runtimeCommand, "evaluate-governance-decision");
});

test("derivation and friction models validate traceability and lifecycle", () => {
  const derivation: DerivationRecord = {
    id: "DER-001",
    trigger: "Provider output recommended a boundary extension.",
    sourceRefs: ["MOUT-001"],
    targetRefs: ["TASK-044"],
    classification: "extension",
    affectedLayers: ["runtime", "task"],
    validationIds: ["VAL-001"],
    confirmedBy: "human",
    decision: routeDerivationDecision({ classification: "extension" })
  };
  const friction: FrictionSignal = {
    id: "FRICTION-001",
    observedLocation: "handoff",
    links: ["TASK-045"],
    pattern: "Repeated handoff ambiguity",
    cause: "Missing interaction surface",
    missingSurface: "Visible model output state",
    risk: "medium",
    recommendation: "Add surfaced visible state.",
    approvalNeeded: false,
    status: "active",
    taskId: "TASK-045"
  };

  assert.equal(validateDerivationRecord(derivation), true);
  assert.equal(validateFrictionSignal(friction), true);
  assert.equal(canTransitionFrictionSignal("active", "reviewing"), true);
  assert.deepEqual(explainDerivationBlockers({ ...derivation, sourceRefs: [], confirmedBy: undefined }), [
    "Derivation DER-001 requires source refs.",
    "Accepted derivation DER-001 requires confirmation."
  ]);
});

test("external intake classification and promotion routing stay non-authoritative until reviewed", () => {
  const outputClass = classifyExternalOutput("Upgrade recommendation from imported report.");

  assert.equal(outputClass, "upgrade-candidate");
  assert.equal(chooseIntakePromotionDecision(outputClass, false), "promote-after-validation");
  assert.deepEqual(
    explainIntakeBlockers({
      id: "INTAKE-001",
      sourceType: "imported-report",
      sourceRef: "audit/report.md",
      outputClass,
      decision: "create-derivation",
      reviewed: true
    }),
    ["Intake record INTAKE-001 requires a derivation link."]
  );
});

test("work packages bound export context and provider output validates against expected classes", () => {
  const workPackage = createWorkPackage({
    id: "WP-001",
    target: "model",
    mode: "build",
    intent: "Review provider ingest boundary.",
    expectedOutputClasses: ["recommendation", "file-action-proposal"],
    sources: ["kernel/provider-output-ingest.ts"],
    excludedSources: ["archive/"],
    artifacts: ["ART-WP-001"],
    rules: ["no-direct-write"],
    contextCardIds: ["CTX-001"],
    validationProfile: "strict",
    providerTarget: { provider: "test-provider", model: "fixture-model" },
    taskId: "TASK-047",
    stepId: "STEP-047",
    createdAt: "2026-07-02T00:00:00.000Z"
  });
  const providerOutput: ProviderOutputRecord = {
    id: "POUT-001",
    workPackageId: "WP-001",
    rawOutputRef: "outputs/pout-001.txt",
    normalizedOutput: "Recommend a file action proposal.",
    outputClass: "file-action-proposal",
    warnings: [],
    proposedActionIds: ["FILE-ACTION-001"],
    derivationId: "DER-001",
    validationRunIds: ["VAL-001"],
    finalDisposition: "file-action-proposal"
  };

  assert.equal(validateWorkPackage(workPackage), true);
  assert.equal(validateProviderOutputIngest(providerOutput, workPackage), true);
  assert.equal(chooseProviderOutputDisposition(providerOutput), "file-action-proposal");
  assert.deepEqual(explainWorkPackageBlockers({ ...workPackage, sources: ["archive/source.md"] }), [
    "Work package WP-001 includes blocked archive source."
  ]);
  assert.deepEqual(
    explainProviderOutputIngestBlockers({ ...providerOutput, outputClass: "unknown" }, workPackage),
    [
      "Provider output POUT-001 class unknown was not expected by WP-001.",
      "Provider output POUT-001 final disposition does not match governance route."
    ]
  );
});

test("runtime mind-map projection is deterministic across task and runtime records", () => {
  const projection = buildRuntimeMindmapProjection({
    tasks: [task],
    derivations: [
      {
        id: "DER-001",
        trigger: "Provider output",
        sourceRefs: ["POUT-001"],
        targetRefs: ["TASK-040"],
        classification: "refinement",
        affectedLayers: ["runtime"],
        validationIds: ["VAL-001"],
        confirmedBy: "human",
        decision: "accepted"
      }
    ],
    providerOutputs: [
      {
        id: "POUT-001",
        workPackageId: "WP-001",
        rawOutputRef: "outputs/pout-001.txt",
        normalizedOutput: "Recommendation",
        outputClass: "recommendation",
        warnings: [],
        proposedActionIds: [],
        validationRunIds: ["VAL-001"],
        finalDisposition: "context-card"
      }
    ]
  });

  assert.deepEqual(
    projection.nodes.map((node) => `${node.kind}:${node.id}`),
    ["derivation:DER-001", "provider-output:POUT-001", "task:TASK-040"]
  );
  assert.deepEqual(projection.edges, [
    { from: "DER-001", to: "POUT-001", kind: "derived-from" },
    { from: "DER-001", to: "TASK-040", kind: "promotes-to" },
    { from: "POUT-001", to: "WP-001", kind: "ingests-from" },
    { from: "TASK-040", to: "TASK-038", kind: "depends-on" },
    { from: "TASK-040", to: "TASK-039", kind: "depends-on" }
  ]);
});

test("interaction surface keeps chat attached but non-canonical", () => {
  const decision = evaluateGovernanceDecision({
    id: "GOV-INTERACTION",
    actionType: "file-action",
    action: "write-file",
    sensitivity: "high",
    mode: "build",
    status: "candidate",
    authority: "candidate",
    outputClass: "file-action-proposal",
    createdAt: "2026-07-02T00:00:00.000Z"
  });
  const contract: InteractionSurfaceContract = {
    id: "INTERACTION-001",
    allowedRequests: ["ask-question", "create-work-package", "review-output", "approve-action"],
    selectedContext: { taskId: "TASK-050", stepId: "STEP-050" },
    visibleStates: ["draft", "proposal", "blocked", "approval-required", "validated", "ingested", "rejected"],
    chatSessionId: "CHAT-001",
    attachedRuntimeRecordIds: ["WP-001", "POUT-001"],
    chatIsCanonical: false
  };

  assert.equal(visibleStateForGovernanceDecision(decision), "approval-required");
  assert.equal(validateInteractionSurfaceContract(contract), true);
  assert.deepEqual(explainInteractionSurfaceBlockers({ ...contract, attachedRuntimeRecordIds: [] }), [
    "Interaction surface INTERACTION-001 chat session must attach to runtime records."
  ]);
});
