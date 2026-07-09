import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { ApprovalRecord, ArtifactRecord, CheckpointRecord, GovernedTask } from "../kernel/types.ts";
import {
  applyMutationTransaction,
  approvalScopeForLocalDevAction,
  planMutationTransaction
} from "../runtime/local-dev-runtime.ts";

const task: GovernedTask = {
  id: "TASK-026",
  title: "Add atomic mutation transaction applier",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-025"],
  allowedContext: ["runtime/local-dev-runtime.ts", "runtime/mutation-applier.ts"],
  blockedContext: [],
  requiredEvidence: [
    "missing-work-task-created",
    "atomic-mutation-applier-added",
    "mutation-applier-rollback-test-pass"
  ],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const planApproval: ApprovalRecord = {
  id: "APR-TASK-026-PLAN",
  taskId: "TASK-026",
  approvedBy: "human",
  scope: approvalScopeForLocalDevAction("plan-mutation-transaction"),
  approvedAt: "2026-06-30T00:00:00.000Z"
};

const applyApproval: ApprovalRecord = {
  id: "APR-TASK-026-APPLY",
  taskId: "TASK-026",
  approvedBy: "human",
  scope: approvalScopeForLocalDevAction("apply-mutation-transaction"),
  approvedAt: "2026-06-30T00:00:00.000Z"
};

const artifact: ArtifactRecord = {
  id: "ART-TASK-026-RUNTIME",
  taskId: "TASK-026",
  path: "runtime/mutation-applier.ts",
  kind: "runtime",
  evidence: ["atomic-mutation-applier-added"],
  createdAt: "2026-06-30T00:00:00.000Z"
};

const checkpoint: CheckpointRecord = {
  id: "CHK-TASK-026-ACCEPTED",
  taskId: "TASK-026",
  status: "accepted",
  evidence: task.requiredEvidence,
  notes: "Atomic mutation applier added.",
  createdAt: "2026-06-30T00:00:00.000Z"
};

test("local runtime applies approved mutation transactions with rollback metadata", async () => {
  const dir = await mkdtemp(join(tmpdir(), "thinkio-mutation-apply-"));
  const taskPath = join(dir, "TASK-026.json");
  const ledgerPath = join(dir, "ledger.json");
  const checkpointPath = join(dir, "checkpoints.json");
  const rollbackPath = join(dir, "mutation-rollbacks.json");

  try {
    await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, "utf8");
    await writeFile(ledgerPath, `${JSON.stringify({ entries: [] }, null, 2)}\n`, "utf8");
    await writeFile(checkpointPath, `${JSON.stringify({ checkpoints: [] }, null, 2)}\n`, "utf8");

    const plan = planMutationTransaction({
      task,
      toStatus: "accepted",
      toAuthority: "accepted",
      evidence: task.requiredEvidence,
      ledgerArtifactIds: [artifact.id],
      checkpointId: checkpoint.id,
      ledgerEntries: [artifact],
      checkpoints: [checkpoint],
      approvals: [planApproval],
      createdAt: "2026-06-30T00:00:00.000Z"
    });
    const result = await applyMutationTransaction({
      transaction: plan.transaction,
      ledgerArtifacts: [artifact],
      checkpoint,
      taskPath,
      ledgerPath,
      checkpointPath,
      rollbackPath,
      approvals: [applyApproval],
      appliedAt: "2026-06-30T00:00:00.000Z"
    });

    const updatedTask = JSON.parse(await readFile(taskPath, "utf8")) as GovernedTask;
    const ledger = JSON.parse(await readFile(ledgerPath, "utf8")) as { entries: ArtifactRecord[] };
    const checkpoints = JSON.parse(await readFile(checkpointPath, "utf8")) as { checkpoints: CheckpointRecord[] };
    const rollback = JSON.parse(await readFile(rollbackPath, "utf8")) as { rollbacks: typeof result.rollback[] };

    assert.equal(updatedTask.status, "accepted");
    assert.equal(updatedTask.authority, "accepted");
    assert.deepEqual(ledger.entries, [artifact]);
    assert.deepEqual(checkpoints.checkpoints, [checkpoint]);
    assert.equal(rollback.rollbacks[0].rollbackStatus, "candidate");
    assert.equal(rollback.rollbacks[0].previousTask.status, "candidate");
    assert.equal(result.task.status, "accepted");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("local runtime blocks mutation application without approval", async () => {
  await assert.rejects(
    () => applyMutationTransaction({
      transaction: {
        id: "MUT-TASK-026",
        taskId: "TASK-026",
        fromStatus: "candidate",
        toStatus: "accepted",
        fromAuthority: "candidate",
        toAuthority: "accepted",
        evidence: task.requiredEvidence,
        ledgerArtifactIds: [artifact.id],
        checkpointId: checkpoint.id,
        rollbackStatus: "candidate",
        rollbackAuthority: "candidate",
        createdAt: "2026-06-30T00:00:00.000Z"
      },
      ledgerArtifacts: [artifact],
      checkpoint,
      taskPath: "missing-task.json",
      approvals: []
    }),
    /Approval boundary blocked/
  );
});
