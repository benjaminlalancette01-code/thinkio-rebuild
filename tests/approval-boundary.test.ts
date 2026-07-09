import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ApprovalRecord, GovernedTask } from "../kernel/types.ts";
import {
  approvalScopeForLocalDevAction,
  assertApprovalBoundarySatisfied,
  buildTaskRuntimePreviewFromState,
  buildTaskRuntimePreview,
  explainApprovalBoundaryBlockers,
  explainApprovalBoundaryBlockersFromState,
  findApprovalForLocalDevAction,
  isApprovalRequiredForLocalDevAction,
  readApprovalState,
  validateApprovalRecord
} from "../runtime/local-dev-runtime.ts";

const task: GovernedTask = {
  id: "TASK-013",
  title: "Import approval-boundary runtime",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-012"],
  allowedContext: ["runtime/local-dev-runtime.ts", "state/approvals.json"],
  blockedContext: ["archive/"],
  requiredEvidence: ["approval-boundary-rule-added"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const approval: ApprovalRecord = {
  id: "APR-TASK-013-WRITE-CHECKPOINT",
  taskId: "TASK-013",
  approvedBy: "human",
  scope: approvalScopeForLocalDevAction("write-checkpoint"),
  approvedAt: "2026-06-28T00:00:00.000Z"
};

const mutationApproval: ApprovalRecord = {
  id: "APR-TASK-013-PLAN-MUTATION",
  taskId: "TASK-013",
  approvedBy: "human",
  scope: approvalScopeForLocalDevAction("plan-mutation-transaction"),
  approvedAt: "2026-06-28T00:00:00.000Z"
};

test("approval helpers locate valid approval records for boundary actions", () => {
  assert.equal(isApprovalRequiredForLocalDevAction("write-checkpoint"), true);
  assert.equal(isApprovalRequiredForLocalDevAction("validate-cue-schemas"), false);
  assert.equal(validateApprovalRecord(approval, task.id, approval.scope), true);
  assert.deepEqual(findApprovalForLocalDevAction([approval], task, "write-checkpoint"), approval);
  assert.deepEqual(findApprovalForLocalDevAction([mutationApproval], task, "plan-mutation-transaction"), mutationApproval);
});

test("approval boundary blocks authority-affecting runtime actions without approval", () => {
  assert.deepEqual(explainApprovalBoundaryBlockers(task, "write-checkpoint", []), [
    "Missing approval for TASK-013 scope local-dev:write-checkpoint."
  ]);
  assert.throws(
    () => assertApprovalBoundarySatisfied(task, "write-checkpoint", []),
    /Approval boundary blocked/
  );
});

test("approval boundary allows checkpoint preview when approval is present", () => {
  const preview = buildTaskRuntimePreview(task, ["approval-boundary-rule-added"], [approval]);

  assert.equal(preview.contextPacket.taskId, "TASK-013");
  assert.equal(preview.checkpoint.taskId, "TASK-013");
  assert.deepEqual(explainApprovalBoundaryBlockers(task, "write-checkpoint", [approval]), []);
});

test("approval boundary can load approval records from runtime state", async () => {
  const dir = await mkdtemp(join(tmpdir(), "thinkio-approval-"));
  const approvalPath = join(dir, "approvals.json");

  try {
    await writeFile(
      approvalPath,
      `${JSON.stringify({ approvals: [approval] }, null, 2)}\n`,
      "utf8"
    );

    assert.deepEqual(await readApprovalState(approvalPath), [approval]);
    assert.deepEqual(
      await explainApprovalBoundaryBlockersFromState(task, "write-checkpoint", approvalPath),
      []
    );

    const preview = await buildTaskRuntimePreviewFromState(
      task,
      ["approval-boundary-rule-added"],
      approvalPath
    );
    assert.equal(preview.checkpoint.taskId, "TASK-013");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("missing approval state is treated as an empty approval set", async () => {
  const dir = await mkdtemp(join(tmpdir(), "thinkio-approval-missing-"));

  try {
    const missingPath = join(dir, "missing-approvals.json");
    assert.deepEqual(await readApprovalState(missingPath), []);
    assert.deepEqual(
      await explainApprovalBoundaryBlockersFromState(task, "write-checkpoint", missingPath),
      ["Missing approval for TASK-013 scope local-dev:write-checkpoint."]
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
