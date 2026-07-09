import test from "node:test";
import assert from "node:assert/strict";
import type { ModelInputContract } from "../kernel/types.ts";
import {
  explainModelInputContractBlockers,
  explainModelOutputContractBlockers,
  validateModelInputContract,
  validateModelOutputContract
} from "../kernel/model-contracts.ts";
import { createModelOutputFromProvider, normalizeProviderResponse } from "../kernel/provider-boundary.ts";
import { evaluateGovernanceDecision } from "../kernel/governance-decision.ts";
import {
  collectValidationBlockers,
  connectValidationToGovernance,
  createValidationStageResult,
  explainValidationStageOrderBlockers,
  shouldRefreshViewsAfterValidation
} from "../kernel/validation-loop.ts";

const inputContract: ModelInputContract = {
  id: "MIN-001",
  intent: "Classify proposed runtime output",
  activeTarget: { kind: "step", id: "STEP-CURRENT" },
  contextBundle: ["kernel/model-contracts.ts"],
  governanceContext: {
    mode: "build",
    authority: "candidate",
    taskStatus: "candidate"
  },
  expectedOutputClasses: ["recommendation", "file-action-proposal"]
};

test("model input and output contracts validate bounded provider exchange", () => {
  assert.equal(validateModelInputContract(inputContract), true);

  const providerOutput = normalizeProviderResponse({
    raw: "Recommend a file action proposal for the runtime boundary.",
    provider: { provider: "test-provider", model: "fixture-model" }
  });
  const outputContract = createModelOutputFromProvider("MOUT-001", "MIN-001", providerOutput, [
    "review proposed patch"
  ]);

  assert.equal(validateModelOutputContract(outputContract, inputContract), true);
  assert.deepEqual(explainModelInputContractBlockers({ ...inputContract, intent: "", contextBundle: [] }), [
    "Model input contract MIN-001 requires intent.",
    "Model input contract MIN-001 requires a context bundle."
  ]);
  assert.deepEqual(
    explainModelOutputContractBlockers({ ...outputContract, outputClass: "unknown" }, inputContract),
    ["Model output contract MOUT-001 class unknown was not expected by input MIN-001."]
  );
});

test("provider boundary normalizes and classifies warnings without granting authority", () => {
  const normalized = normalizeProviderResponse({
    raw: "Conflict: this contradicts the current task scope.",
    provider: { provider: "test-provider", app: "fixture-app" },
    warnings: ["scope mismatch"]
  });

  assert.equal(normalized.outputClass, "conflict-signal");
  assert.deepEqual(normalized.warnings, ["scope mismatch"]);
});

test("governance decisions integrate mode authority validation and output class", () => {
  const allowed = evaluateGovernanceDecision({
    id: "GOV-LOW",
    actionType: "model-output",
    action: "review-output",
    sensitivity: "low",
    mode: "review",
    status: "candidate",
    authority: "candidate",
    outputClass: "recommendation",
    createdAt: "2026-07-01T00:00:00.000Z"
  });
  assert.equal(allowed.outcome, "allow");

  const blocked = evaluateGovernanceDecision({
    id: "GOV-BLOCKED",
    actionType: "file-action",
    action: "write-file",
    sensitivity: "critical",
    mode: "plan",
    status: "candidate",
    authority: "accepted",
    validationBlockers: ["pre-ingest failed"],
    outputClass: "file-action-proposal",
    taskId: "TASK-038",
    scopeTaskId: "TASK-OTHER",
    createdAt: "2026-07-01T00:00:00.000Z"
  });

  assert.equal(blocked.outcome, "block");
  assert.deepEqual(blocked.blockers, [
    "Mode plan does not allow action write-file.",
    "pre-ingest failed",
    "Authority accepted is not compatible with status candidate.",
    "Action scope TASK-OTHER does not match task TASK-038."
  ]);

  const approvalRequired = evaluateGovernanceDecision({
    id: "GOV-APPROVAL",
    actionType: "file-action",
    action: "write-file",
    sensitivity: "high",
    mode: "build",
    status: "candidate",
    authority: "candidate",
    outputClass: "file-action-proposal",
    createdAt: "2026-07-01T00:00:00.000Z"
  });

  assert.equal(approvalRequired.outcome, "approval-required");
});

test("validation loop enforces stage order and triggers view refresh only after clean post-ingest", () => {
  const preExport = createValidationStageResult({
    id: "VAL-PRE",
    stage: "pre-export",
    ok: true,
    blockers: [],
    createdAt: "2026-07-01T00:00:00.000Z"
  });
  const postProvider = createValidationStageResult({
    id: "VAL-PROVIDER",
    stage: "post-provider",
    ok: false,
    blockers: ["Provider warning requires review."],
    createdAt: "2026-07-01T00:01:00.000Z"
  });
  const decision = evaluateGovernanceDecision({
    id: "GOV-VAL",
    actionType: "model-output",
    action: "review-output",
    sensitivity: "low",
    mode: "review",
    status: "candidate",
    authority: "candidate",
    validationBlockers: collectValidationBlockers([preExport, postProvider]),
    createdAt: "2026-07-01T00:02:00.000Z"
  });

  assert.equal(connectValidationToGovernance(postProvider, decision).governanceDecisionId, "GOV-VAL");
  assert.deepEqual(collectValidationBlockers([preExport, postProvider]), [
    "Provider warning requires review."
  ]);
  assert.deepEqual(explainValidationStageOrderBlockers([postProvider, preExport]), [
    "Validation stage pre-export appears after a later stage."
  ]);
  assert.equal(shouldRefreshViewsAfterValidation([preExport, postProvider]), false);

  const postIngest = createValidationStageResult({
    id: "VAL-POST-INGEST",
    stage: "post-ingest",
    ok: true,
    blockers: [],
    createdAt: "2026-07-01T00:03:00.000Z"
  });

  assert.equal(shouldRefreshViewsAfterValidation([preExport, postIngest]), true);
});
