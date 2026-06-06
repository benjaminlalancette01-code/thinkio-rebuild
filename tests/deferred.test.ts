import test from "node:test";
import assert from "node:assert/strict";
import type { GovernedTask } from "../kernel/types.ts";
import {
  canResumeDeferredItem,
  createDeferredItemForTask,
  explainDeferredBlockers
} from "../kernel/deferred.ts";

const task: GovernedTask = {
  id: "TASK-003",
  title: "Import deferred-item model",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-002"],
  allowedContext: ["state/deferred.json"],
  blockedContext: ["archive/"],
  requiredEvidence: ["candidate-note-created", "deferred-model-rewritten", "deferred-model-test-pass"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("deferred items resume only after required evidence and resume time", () => {
  const item = createDeferredItemForTask(task, "Waiting for model rewrite.", "codex", {
    id: "DEF-TASK-003",
    deferredAt: "2026-06-01T00:00:00.000Z",
    resumeAfter: "2026-06-05T00:00:00.000Z",
    requiredEvidence: ["deferred-model-rewritten"]
  });

  assert.equal(canResumeDeferredItem(item, [], new Date("2026-06-06T00:00:00.000Z")), false);
  assert.deepEqual(explainDeferredBlockers(item, [], new Date("2026-06-06T00:00:00.000Z")), [
    "Missing resume evidence: deferred-model-rewritten."
  ]);
  assert.equal(
    canResumeDeferredItem(item, ["deferred-model-rewritten"], new Date("2026-06-06T00:00:00.000Z")),
    true
  );
});
