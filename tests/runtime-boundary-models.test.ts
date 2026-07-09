import test from "node:test";
import assert from "node:assert/strict";
import type { ContextCard, ContextDependency, Workboard, WorkBranch } from "../kernel/types.ts";
import { explainModePolicyBlockers, routeExploratoryOutput } from "../kernel/mode-policy.ts";
import { buildRuntimeReadinessProof } from "../kernel/runtime-readiness.ts";
import { appendProcessLedgerEntry, createActiveWorkSlice, createProcessLedgerEntry, explainActiveWorkSliceBlockers } from "../kernel/process-ledger.ts";
import {
  canPromoteContextCard,
  explainContextCardPromotionBlockers,
  validateContextDependencies
} from "../kernel/context-card.ts";

const workboard: Workboard = {
  id: "BOARD-RUNTIME",
  taskIds: ["TASK-034"],
  updatedAt: "2026-07-01T00:00:00.000Z",
  steps: [
    {
      id: "STEP-CURRENT",
      taskId: "TASK-034",
      title: "Build active slice",
      workflowPosition: "current",
      status: "open",
      order: 0,
      artifactLinks: ["kernel/process-ledger.ts"]
    }
  ]
};

test("mode policy blocks lock promotion without review evidence", () => {
  assert.deepEqual(
    explainModePolicyBlockers({ mode: "plan", action: "freeze-task", targetStatus: "frozen" }),
    [
      "Mode plan does not allow action freeze-task.",
      "Mode plan requires review-before-lock evidence before frozen."
    ]
  );

  assert.equal(routeExploratoryOutput("brainstorm", "recommendation"), "idea");
  assert.equal(routeExploratoryOutput("build", "conflict-signal"), "deferred");
});

test("readiness proof reports missing state, schema, open branches, and unfinished transactions", () => {
  const branch: WorkBranch = {
    id: "BRANCH-ACTIVE",
    purpose: "Parallel validation",
    status: "active",
    parentStepId: "STEP-CURRENT",
    activeStepId: "STEP-CURRENT",
    successCondition: "Validation passes",
    history: [{ status: "active", at: "2026-07-01T00:00:00.000Z", note: "Started." }]
  };

  const proof = buildRuntimeReadinessProof({
    requiredStateFiles: ["state/project.graph.json", "state/workboard.json"],
    presentStateFiles: ["state/project.graph.json"],
    schemaResults: [{ id: "state/workboard", ok: false }],
    workboard,
    branches: [branch],
    unfinishedTransactions: [
      {
        id: "MUT-OPEN",
        taskId: "TASK-034",
        fromStatus: "candidate",
        toStatus: "accepted",
        fromAuthority: "candidate",
        toAuthority: "accepted",
        evidence: [],
        ledgerArtifactIds: [],
        checkpointId: "CHK",
        rollbackStatus: "candidate",
        rollbackAuthority: "candidate",
        createdAt: "2026-07-01T00:00:00.000Z"
      }
    ],
    createdAt: "2026-07-01T00:00:00.000Z"
  });

  assert.equal(proof.ok, false);
  assert.deepEqual(proof.blockers, [
    "Missing required state file: state/workboard.json.",
    "Schema validation failed: state/workboard.",
    "Unfinished mutation transaction blocks startup: MUT-OPEN.",
    "Open branch requires startup attention: BRANCH-ACTIVE."
  ]);
});

test("process ledger appends entries and active slices detect conflicts", () => {
  const entry = createProcessLedgerEntry({
    id: "PROC-001",
    type: "decision",
    taskId: "TASK-034",
    stepId: "STEP-CURRENT",
    artifactIds: ["ART-001"],
    validationIds: [],
    message: "Decision captured.",
    createdAt: "2026-07-01T00:00:00.000Z"
  });

  assert.deepEqual(appendProcessLedgerEntry([], entry), [entry]);

  const slice = createActiveWorkSlice({
    id: "SLICE-001",
    workboard,
    contextCardIds: ["CTX-001"],
    createdAt: "2026-07-01T00:00:00.000Z",
    expiresAt: "2026-07-02T00:00:00.000Z"
  });
  const conflicting = { ...slice, id: "SLICE-002", stepId: "STEP-OTHER" };

  assert.deepEqual(explainActiveWorkSliceBlockers(slice, [conflicting], new Date("2026-07-03T00:00:00.000Z")), [
    "Active work slice SLICE-001 is stale.",
    "Active work slice SLICE-001 conflicts with SLICE-002 for task TASK-034."
  ]);
});

test("context cards attach non-canonical context and require review evidence for promotion", () => {
  const dependency: ContextDependency = {
    id: "CTXDEP-001",
    fromKind: "source",
    fromId: "audit/local-runtime-adjusted-v1.1.1-gap-report-2026-07-01.md",
    toKind: "step",
    toId: "STEP-CURRENT",
    relationship: "supports"
  };
  const card: ContextCard = {
    id: "CTX-001",
    type: "warning",
    authority: "candidate",
    relevance: "high",
    attachment: { kind: "step", id: "STEP-CURRENT" },
    relationship: "supports",
    body: "Provider output cannot become canonical before review.",
    status: "reviewed",
    promotionTargets: ["review-item"]
  };

  assert.equal(validateContextDependencies([dependency]), true);
  assert.equal(canPromoteContextCard(card, "review-item", ["context-card-reviewed"]), true);
  assert.deepEqual(explainContextCardPromotionBlockers({ ...card, status: "attached" }, "task", []), [
    "Context card CTX-001 must be reviewed before promotion.",
    "Context card CTX-001 cannot promote to task.",
    "Context card CTX-001 is missing review evidence."
  ]);
});
