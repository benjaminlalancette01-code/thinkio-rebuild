import test from "node:test";
import assert from "node:assert/strict";
import type { CheckpointRecord, GovernedTask } from "../kernel/types.ts";
import {
  createDecompositionRecord,
  explainDecompositionBlockers,
  validateDecomposition
} from "../kernel/decomposition.ts";

const parentTask: GovernedTask = {
  id: "TASK-010-PARENT",
  title: "Saturated governed unit",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-008"],
  allowedContext: ["tasks/", "kernel/context-router.ts"],
  blockedContext: ["archive/"],
  requiredEvidence: ["dependency-map-preserved", "checkpoint-lineage-preserved"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const childTasks: GovernedTask[] = [
  {
    ...parentTask,
    id: "TASK-010-A",
    title: "Map child task dependencies",
    dependencies: ["TASK-008"],
    requiredEvidence: ["dependency-map-preserved"]
  },
  {
    ...parentTask,
    id: "TASK-010-B",
    title: "Map child checkpoint lineage",
    dependencies: ["TASK-008"],
    requiredEvidence: ["checkpoint-lineage-preserved"]
  }
];

const checkpoint: CheckpointRecord = {
  id: "CHK-TASK-010-PARENT",
  taskId: "TASK-010-PARENT",
  status: "candidate",
  evidence: ["candidate-note-created"],
  notes: "Parent state before decomposition.",
  createdAt: "2026-06-28T00:00:00.000Z"
};

test("decomposition records preserve dependencies, evidence, checkpoints, and reconstruction path", () => {
  const record = createDecompositionRecord({
    parentTask,
    childTasks,
    reason: "Parent context saturated.",
    checkpointIds: [checkpoint.id],
    createdAt: "2026-06-28T00:00:00.000Z"
  });

  assert.deepEqual(record.preservedDependencies, ["TASK-008"]);
  assert.deepEqual(record.preservedEvidence, [
    "dependency-map-preserved",
    "checkpoint-lineage-preserved"
  ]);
  assert.deepEqual(record.reconstructionPath, ["TASK-010-PARENT", "TASK-010-A", "TASK-010-B"]);
  assert.equal(validateDecomposition(record, [parentTask, ...childTasks], [checkpoint]), true);
});

test("decomposition validation explains broken child preservation rules", () => {
  const record = createDecompositionRecord({
    parentTask,
    childTasks: [childTasks[0]],
    reason: "Parent context saturated.",
    checkpointIds: [],
    createdAt: "2026-06-28T00:00:00.000Z"
  });

  assert.deepEqual(explainDecompositionBlockers(record, [parentTask, childTasks[0]], [checkpoint]), [
    "No child task preserves evidence requirement checkpoint-lineage-preserved.",
    "Checkpoint-required parent task must keep checkpoint lineage."
  ]);
});
