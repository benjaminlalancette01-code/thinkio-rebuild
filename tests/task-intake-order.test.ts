import test from "node:test";
import assert from "node:assert/strict";
import { validateTaskIntakeOrder } from "../scripts/validate-task-intake-order.ts";

const taskBase = {
  mode: "build",
  dependencies: [],
  allowedContext: [],
  blockedContext: [],
  requiredEvidence: [],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: false
} as const;

test("validates contiguous candidate and idea feature card order", () => {
  const blockers = validateTaskIntakeOrder(
    [
      { ...taskBase, id: "TASK-100", title: "Candidate", status: "candidate", authority: "candidate" },
      { ...taskBase, id: "TASK-101", title: "Idea", status: "idea", authority: "idea" }
    ],
    [
      { id: "TASK-100", status: "candidate", priority: "high", order: "c001", file: "TASK-100.md" },
      { id: "TASK-101", status: "idea", priority: "medium", order: "i001", file: "TASK-101.md" }
    ]
  );

  assert.deepEqual(blockers, []);
});

test("blocks missing cards, status drift, and non-contiguous order", () => {
  const blockers = validateTaskIntakeOrder(
    [
      { ...taskBase, id: "TASK-100", title: "Candidate", status: "candidate", authority: "candidate" },
      { ...taskBase, id: "TASK-101", title: "Idea", status: "idea", authority: "idea" }
    ],
    [
      { id: "TASK-100", status: "idea", priority: "urgent", order: "i002", file: "TASK-100.md" }
    ]
  );

  assert.ok(blockers.some((blocker) => blocker.includes("TASK-100 status idea does not match")));
  assert.ok(blockers.some((blocker) => blocker.includes("TASK-101 is missing a visual feature card")));
  assert.ok(blockers.some((blocker) => blocker.includes("unsupported priority urgent")));
  assert.ok(blockers.some((blocker) => blocker.includes("expected i001")));
});

test("ignores stale feature mirrors for completed tasks", () => {
  const blockers = validateTaskIntakeOrder(
    [
      { ...taskBase, id: "TASK-100", title: "Done", status: "done", authority: "accepted" },
      { ...taskBase, id: "TASK-101", title: "Candidate", status: "candidate", authority: "candidate" }
    ],
    [
      { id: "TASK-100", status: "candidate", priority: "high", order: "c001", file: "TASK-100.md" },
      { id: "TASK-101", status: "candidate", priority: "high", order: "c001", file: "TASK-101.md" }
    ]
  );

  assert.deepEqual(blockers, []);
});
