import test from "node:test";
import assert from "node:assert/strict";
import type { ReturnAnchor, Workboard, WorkBranch } from "../kernel/types.ts";
import { explainWorkboardBlockers, findCurrentStep, validateWorkboard } from "../kernel/workboard.ts";
import { canTransitionBranch, explainBranchBlockers, validateBranchState } from "../kernel/branch.ts";

const validWorkboard: Workboard = {
  id: "BOARD-RUNTIME",
  taskIds: ["TASK-030"],
  updatedAt: "2026-07-01T00:00:00.000Z",
  steps: [
    {
      id: "STEP-001",
      taskId: "TASK-030",
      title: "Define workboard",
      workflowPosition: "current",
      status: "open",
      order: 0,
      artifactLinks: ["kernel/workboard.ts"]
    },
    {
      id: "STEP-002",
      taskId: "TASK-030",
      title: "Validate branch",
      workflowPosition: "queued-next",
      status: "open",
      order: 1,
      parentStepId: "STEP-001",
      artifactLinks: []
    }
  ]
};

test("workboard validates one current step separately from task status", () => {
  assert.equal(validateWorkboard(validWorkboard), true);
  assert.equal(findCurrentStep(validWorkboard)?.id, "STEP-001");

  const invalid: Workboard = {
    ...validWorkboard,
    steps: validWorkboard.steps.map((step) => ({ ...step, workflowPosition: "current" }))
  };

  assert.deepEqual(explainWorkboardBlockers(invalid), [
    "Workboard must have exactly one current step; found 2."
  ]);
});

test("workboard validation rejects missing parents and bad artifact links", () => {
  const invalid: Workboard = {
    ...validWorkboard,
    steps: [
      validWorkboard.steps[0],
      {
        ...validWorkboard.steps[1],
        parentStepId: "STEP-MISSING",
        artifactLinks: [""]
      }
    ]
  };

  assert.deepEqual(explainWorkboardBlockers(invalid), [
    "Work step STEP-002 has an empty artifact link.",
    "Work step STEP-002 references missing parent STEP-MISSING."
  ]);
});

test("parallel branches and return anchors validate against workboard steps", () => {
  const branch: WorkBranch = {
    id: "BRANCH-001",
    purpose: "Investigate provider output boundary",
    status: "paused",
    parentStepId: "STEP-001",
    activeStepId: "STEP-002",
    successCondition: "Classifier vocabulary accepted",
    history: [
      { status: "active", at: "2026-07-01T00:00:00.000Z", note: "Started." },
      { status: "paused", at: "2026-07-01T01:00:00.000Z", note: "Paused with anchor." }
    ]
  };
  const anchor: ReturnAnchor = {
    id: "ANCHOR-001",
    branchId: "BRANCH-001",
    targetStepId: "STEP-001",
    resumeCondition: "Return after classifier review",
    status: "pending"
  };

  assert.equal(validateBranchState([branch], [anchor], validWorkboard), true);
  assert.equal(canTransitionBranch("paused", "active"), true);
  assert.equal(canTransitionBranch("completed", "active"), false);
});

test("branch validation preserves lifecycle and anchor integrity", () => {
  const branch: WorkBranch = {
    id: "BRANCH-002",
    purpose: "",
    status: "completed",
    parentStepId: "STEP-MISSING",
    activeStepId: "STEP-MISSING",
    successCondition: "",
    history: [{ status: "active", at: "not-a-date", note: "Bad." }]
  };
  const anchor: ReturnAnchor = {
    id: "ANCHOR-002",
    branchId: "BRANCH-MISSING",
    targetStepId: "STEP-MISSING",
    resumeCondition: "",
    status: "pending"
  };

  assert.deepEqual(explainBranchBlockers([branch], [anchor], validWorkboard), [
    "Branch BRANCH-002 purpose is required.",
    "Branch BRANCH-002 success condition is required.",
    "Branch BRANCH-002 references missing parent step STEP-MISSING.",
    "Branch BRANCH-002 references missing active step STEP-MISSING.",
    "Branch BRANCH-002 has invalid history date.",
    "Branch BRANCH-002 history ends at active, not completed.",
    "Return anchor ANCHOR-002 references missing branch BRANCH-MISSING.",
    "Return anchor ANCHOR-002 references missing target step STEP-MISSING.",
    "Return anchor ANCHOR-002 resume condition is required."
  ]);
});
