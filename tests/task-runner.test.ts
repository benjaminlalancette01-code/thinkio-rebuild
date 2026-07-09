import test from "node:test";
import assert from "node:assert/strict";
import type { ApprovalRecord, ExecutionWindow, GovernedTask } from "../kernel/types.ts";
import { approvalScopeForLocalDevAction } from "../runtime/local-dev-runtime.ts";
import { prepareTaskRun } from "../runtime/task-runner.ts";

const task: GovernedTask = {
  id: "TASK-023",
  title: "Gate task runner with windows and approvals",
  mode: "execute",
  status: "executable",
  authority: "executable",
  dependencies: ["TASK-022"],
  allowedContext: ["runtime/task-runner.ts", "kernel/execution-window.ts"],
  blockedContext: [],
  requiredEvidence: [
    "candidate-note-created",
    "task-runner-boundary-gates-added",
    "task-runner-boundary-test-pass"
  ],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const executionWindow: ExecutionWindow = {
  id: "WIN-TASK-023",
  taskId: "TASK-023",
  opensAt: "2026-06-30T00:00:00.000Z",
  closesAt: "2026-06-30T23:59:59.000Z",
  timezone: "America/Toronto",
  requiredAuthority: "executable"
};

const approval: ApprovalRecord = {
  id: "APR-TASK-023-WRITE-CHECKPOINT",
  taskId: "TASK-023",
  approvedBy: "human",
  scope: approvalScopeForLocalDevAction("write-checkpoint"),
  approvedAt: "2026-06-30T00:00:00.000Z"
};

test("task runner preserves basic executable preparation", () => {
  const prepared = prepareTaskRun(task);

  assert.equal(prepared.taskId, "TASK-023");
  assert.equal(prepared.canExecute, true);
  assert.deepEqual(prepared.blockedReasons, []);
  assert.equal(prepared.contextPacket.taskId, "TASK-023");
});

test("task runner blocks execution outside the execution window", () => {
  const prepared = prepareTaskRun(task, {
    executionWindow,
    at: new Date("2026-07-01T00:00:00.000Z")
  });

  assert.equal(prepared.canExecute, false);
  assert.match(prepared.blockedReasons.join("\n"), /Execution window is closed/);
});

test("task runner can require runtime approval before preparation is executable", () => {
  const blocked = prepareTaskRun(task, {
    approvalAction: "write-checkpoint",
    executionWindow,
    at: new Date("2026-06-30T12:00:00.000Z")
  });

  assert.equal(blocked.canExecute, false);
  assert.deepEqual(blocked.blockedReasons, [
    "Missing approval for TASK-023 scope local-dev:write-checkpoint."
  ]);

  const allowed = prepareTaskRun(task, {
    approvalAction: "write-checkpoint",
    approvals: [approval],
    executionWindow,
    at: new Date("2026-06-30T12:00:00.000Z")
  });

  assert.equal(allowed.canExecute, true);
  assert.deepEqual(allowed.blockedReasons, []);
});
