import test from "node:test";
import assert from "node:assert/strict";
import type { GovernedTask } from "../kernel/types.ts";
import {
  canExecuteWithinWindow,
  createExecutionWindow,
  explainExecutionWindowBlockers,
  isExecutionWindowOpen
} from "../kernel/execution-window.ts";

const executableTask: GovernedTask = {
  id: "TASK-004",
  title: "Import execution-window model",
  mode: "execute",
  status: "executable",
  authority: "executable",
  dependencies: ["TASK-003"],
  allowedContext: ["kernel/gate.ts"],
  blockedContext: [],
  requiredEvidence: ["execution-window-rule-added"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("execution windows gate executable tasks by time and task id", () => {
  const window = createExecutionWindow({
    id: "WIN-TASK-004",
    taskId: "TASK-004",
    opensAt: "2026-06-06T10:00:00.000Z",
    closesAt: "2026-06-06T12:00:00.000Z",
    timezone: "America/Toronto",
    requiredAuthority: "executable"
  });

  assert.equal(isExecutionWindowOpen(window, new Date("2026-06-06T11:00:00.000Z")), true);
  assert.equal(canExecuteWithinWindow(executableTask, window, new Date("2026-06-06T11:00:00.000Z")), true);
  assert.deepEqual(explainExecutionWindowBlockers(executableTask, window, new Date("2026-06-06T13:00:00.000Z")), [
    "Execution window is closed at 2026-06-06T13:00:00.000Z."
  ]);
});
