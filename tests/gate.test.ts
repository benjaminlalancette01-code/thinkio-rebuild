import test from "node:test";
import assert from "node:assert/strict";
import type { GovernedTask } from "../kernel/types.ts";
import { canExecuteTask, canPromoteTask, explainBlockedExecution } from "../kernel/gate.ts";

const baseTask: GovernedTask = {
  id: "TASK-001",
  title: "Bootstrap the ThinkIO governed task kernel",
  mode: "build",
  status: "candidate",
  authority: "candidate",
  dependencies: [],
  allowedContext: ["kernel/state-machine.ts"],
  blockedContext: ["thinkio-archive/", "archive/"],
  requiredEvidence: ["schema-valid", "transition-test-pass", "ledger-entry-created"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("requires all evidence before promotion", () => {
  assert.equal(canPromoteTask(baseTask, ["schema-valid"]), false);
  assert.equal(
    canPromoteTask(baseTask, ["schema-valid", "transition-test-pass", "ledger-entry-created"]),
    true
  );
});

test("only executable authority can execute", () => {
  assert.equal(canExecuteTask(baseTask), false);
  assert.deepEqual(explainBlockedExecution(baseTask), [
    "Task status is candidate, not executable.",
    "Task authority is candidate, not executable.",
    "Archive context is blocked by default."
  ]);

  assert.equal(canExecuteTask({ ...baseTask, status: "executable", authority: "executable" }), true);
});

