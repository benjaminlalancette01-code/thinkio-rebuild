import test from "node:test";
import assert from "node:assert/strict";
import type { GovernedTask } from "../kernel/types.ts";
import {
  createCheckpoint,
  createHandoff,
  validateHandoff
} from "../kernel/checkpoint.ts";

const task: GovernedTask = {
  id: "TASK-007",
  title: "Import checkpoint/handoff model",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-006"],
  allowedContext: ["kernel/checkpoint.ts", "state/checkpoints.json"],
  blockedContext: ["archive/"],
  requiredEvidence: ["checkpoint-handoff-rule-added"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("handoffs bind accepted decisions and resume context to a checkpoint", () => {
  const checkpoint = createCheckpoint({
    task,
    evidence: ["checkpoint-handoff-rule-added"],
    id: "CHK-TASK-007",
    createdAt: "2026-06-06T00:00:00.000Z"
  });
  const handoff = createHandoff({
    task,
    checkpoint,
    acceptedDecisions: ["Checkpoint is the resume anchor."],
    nextValidStep: "Validate handoff record before continuing.",
    resumeContext: ["kernel/checkpoint.ts", "tests/checkpoint-handoff.test.ts"],
    id: "HANDOFF-TASK-007",
    createdAt: "2026-06-06T00:00:00.000Z"
  });

  assert.equal(validateHandoff(handoff, checkpoint), true);
  assert.equal(validateHandoff({ ...handoff, checkpointId: "CHK-OTHER" }, checkpoint), false);
});
