import test from "node:test";
import assert from "node:assert/strict";
import type { ApprovalRecord, ArtifactRecord, CheckpointRecord, GovernedTask } from "../kernel/types.ts";
import { approvalScopeForLocalDevAction, planMutationTransaction } from "../runtime/local-dev-runtime.ts";

const task: GovernedTask = {
  id: "TASK-018",
  title: "Wire approved mutation transaction planning",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-017"],
  allowedContext: ["runtime/local-dev-runtime.ts", "kernel/mutation-transaction.ts"],
  blockedContext: ["archive/"],
  requiredEvidence: [
    "candidate-note-created",
    "approved-mutation-planner-wired",
    "approved-mutation-planner-test-pass"
  ],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const approval: ApprovalRecord = {
  id: "APR-TASK-018-PLAN-MUTATION",
  taskId: "TASK-018",
  approvedBy: "human",
  scope: approvalScopeForLocalDevAction("plan-mutation-transaction"),
  approvedAt: "2026-06-28T00:00:00.000Z"
};

const artifact: ArtifactRecord = {
  id: "ART-TASK-018-RUNTIME",
  taskId: "TASK-018",
  path: "runtime/local-dev-runtime.ts",
  kind: "runtime",
  evidence: ["approved-mutation-planner-wired"],
  createdAt: "2026-06-28T00:00:00.000Z"
};

const checkpoint: CheckpointRecord = {
  id: "CHK-TASK-018-ACCEPTED",
  taskId: "TASK-018",
  status: "accepted",
  evidence: task.requiredEvidence,
  notes: "Approved mutation planner wired.",
  createdAt: "2026-06-28T00:00:00.000Z"
};

test("local dev runtime plans approved mutation transactions", () => {
  const plan = planMutationTransaction({
    task,
    toStatus: "accepted",
    toAuthority: "accepted",
    evidence: task.requiredEvidence,
    ledgerArtifactIds: [artifact.id],
    checkpointId: checkpoint.id,
    ledgerEntries: [artifact],
    checkpoints: [checkpoint],
    approvals: [approval],
    createdAt: "2026-06-28T00:00:00.000Z"
  });

  assert.equal(plan.ok, true);
  assert.deepEqual(plan.blockers, []);
  assert.equal(plan.transaction.taskId, "TASK-018");
});

test("local dev runtime blocks mutation planning without approval", () => {
  assert.throws(
    () => planMutationTransaction({
      task,
      toStatus: "accepted",
      toAuthority: "accepted",
      evidence: task.requiredEvidence,
      ledgerArtifactIds: [artifact.id],
      checkpointId: checkpoint.id,
      ledgerEntries: [artifact],
      checkpoints: [checkpoint],
      approvals: []
    }),
    /Approval boundary blocked/
  );
});
