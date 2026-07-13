import test from "node:test";
import assert from "node:assert/strict";
import type { GovernedTask, GovernanceDecisionRecord } from "../kernel/types.ts";
import { validateBamlContractInventory } from "../kernel/baml-contract-inventory.ts";
import { buildCapabilityProjection, promoteCapability, type CapabilityRecord } from "../kernel/capability-registry.ts";
import { validateCrossLayerConsistency } from "../kernel/cross-layer-validation.ts";
import { explainExportReadinessBlockers } from "../kernel/export-readiness.ts";
import {
  classifySkillDisposition,
  explainHistoricalTranslationBlockers,
  type HistoricalTranslationRecord
} from "../kernel/historical-translation.ts";
import { buildProjectIdentityProjection } from "../kernel/project-identity.ts";
import { buildExplainableGateResult, classifyImpact } from "../kernel/provenance.ts";
import { explainReentryTranslationBlockers, type ReentryResponsibilityMapping } from "../kernel/reentry-translation.ts";
import { lintSemanticNames, taskTitleNamingInputs } from "../kernel/semantic-naming.ts";
import { buildSessionGroundingRecord, resolveNextAction } from "../kernel/session-grounding.ts";
import { checkCloseoutReadiness, reconcileWorktreeToTask, type WorktreeSummary } from "../kernel/worktree-reconciliation.ts";
import { validateRuntimeIsolatedVsixInstall } from "../runtime/local-dev-runtime.ts";

const candidateTask: GovernedTask = {
  id: "TASK-120",
  title: "Implement native session grounding and next-action resolver",
  mode: "build",
  status: "candidate",
  authority: "candidate",
  dependencies: [],
  allowedContext: ["kernel/", "runtime/", "tests/"],
  blockedContext: [],
  requiredEvidence: ["resolver-tests-pass"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("TASK-120 session grounding resolves start/resume next action", () => {
  const grounding = buildSessionGroundingRecord({
    id: "GROUNDING-TEST",
    projectId: "thinkio-rebuild",
    mode: "build",
    currentTaskId: "TASK-120",
    viewFreshness: [{ path: "views/kanban.json", stale: true, reason: "task state changed" }],
    worktree: { changedFiles: [], untrackedFiles: [] },
    generatedAt: "2026-07-13T00:00:00.000Z"
  });
  const resolution = resolveNextAction({ grounding, tasks: [candidateTask] });

  assert.equal(resolution.commandId, "thinkio.startResume");
  assert.equal(resolution.kind, "refresh-generated-views");
  assert.match(resolution.blockers[0], /views\/kanban\.json/);

  const clean = resolveNextAction({ grounding: { ...grounding, viewFreshness: [] }, tasks: [candidateTask] });
  assert.equal(clean.kind, "continue-active-task");
});

test("TASK-121 project identity validates topology and load-mode registry", () => {
  const projection = buildProjectIdentityProjection({
    identity: {
      id: "thinkio-rebuild",
      name: "ThinkIO Rebuild",
      workspaceRoot: "C:/Users/benja/Downloads/Thinkio-1/thinkio-rebuild",
      extensionRoot: "extension/",
      archiveRoot: "../Thinkio-fullarchive",
      generatedRoots: ["state/", "views/"],
      currentLoadMode: "canonical"
    },
    topology: {
      workspaceRoot: "C:/Users/benja/Downloads/Thinkio-1/thinkio-rebuild",
      canonicalRoots: ["tasks/", "kernel/", "runtime/", "schemas/", "contracts/baml/"],
      generatedRoots: ["state/", "views/"],
      archiveRoots: ["../Thinkio-fullarchive"],
      blockedRoots: ["node_modules/", "local-vsix/"]
    }
  });

  assert.deepEqual(projection.blockers, []);
  assert.equal(projection.loadModes.some((rule) => rule.mode === "archive-evidence" && !rule.canWriteCanonical), true);
});

test("TASK-122 provenance and impact produce explainable gate results", () => {
  const decision: GovernanceDecisionRecord = {
    id: "GOV-122",
    actionType: "file-action",
    sensitivity: "high",
    outcome: "approval-required",
    blockers: ["approval missing"],
    allowedNextActions: ["create-proposal"],
    createdAt: "2026-07-13T00:00:00.000Z"
  };
  const impact = classifyImpact(["task", "baml"]);
  const gate = buildExplainableGateResult({
    id: "GATE-122",
    decision,
    impact,
    provenance: [
      {
        id: "ORIGIN-1",
        kind: "archive",
        sourceRef: "audit/v1.1.1-reentry-emulation-runtime-gap-audit-2026-07-01.md",
        derivedFrom: ["TASK-131"],
        authority: "historical"
      }
    ]
  });

  assert.equal(impact.requiresApproval, true);
  assert.match(gate.explanation, /archive/);
  assert.match(gate.explanation, /baml/);
});

test("TASK-123 capability registry tracks maturity and promotion blockers", () => {
  const capability: CapabilityRecord = {
    id: "CAP-SESSION-GROUNDING",
    name: "Session Grounding",
    nativeHome: "runtime",
    maturity: "implemented",
    taskIds: ["TASK-120"],
    evidence: ["session-grounding-record-defined", "resolver-tests-pass"],
    blockers: []
  };
  const projection = buildCapabilityProjection([capability]);
  const promotion = promoteCapability(capability, ["session-grounding-record-defined", "resolver-tests-pass"]);

  assert.deepEqual(projection.capabilities[0].blockers, []);
  assert.equal(promotion.ok, true);
  assert.equal(promotion.nextMaturity, "validated");
});

test("TASK-124 cross-layer validation catches contradictions and concept loss", () => {
  const translation: HistoricalTranslationRecord = {
    id: "HIST-REENTRY",
    archiveConcept: "reentry load list",
    sourceRefs: ["ThinkIO-v1.1.1/04-reentry/reentry-prompt-phase-5.md"],
    currentNativeDestination: "session grounding",
    disposition: "valid-gap",
    evidence: [],
    taskIds: [],
    capabilityId: "CAP-MISSING"
  };
  const result = validateCrossLayerConsistency({
    tasks: [candidateTask],
    capabilityRecords: [],
    historicalTranslations: [translation],
    docs: [{ path: "docs/example.md", text: "Depends on TASK-999." }]
  });

  assert.equal(result.ok, false);
  assert.ok(result.contradictions.some((item) => item.includes("TASK-999")));
  assert.ok(result.conceptLoss.some((item) => item.includes("Valid historical gap")));
});

test("TASK-125 worktree reconciliation gates closeout readiness", () => {
  const summary: WorktreeSummary = {
    branch: "main",
    changedFiles: ["kernel/session-grounding.ts"],
    untrackedFiles: ["outside.txt"],
    stagedFiles: []
  };
  const reconciliation = reconcileWorktreeToTask(summary, candidateTask);
  const readiness = checkCloseoutReadiness({
    task: candidateTask,
    reconciliation,
    validationPassed: false,
    requiredEvidence: candidateTask.requiredEvidence,
    presentEvidence: []
  });

  assert.deepEqual(reconciliation.matchedFiles, ["kernel/session-grounding.ts"]);
  assert.ok(readiness.blockers.some((item) => item.includes("outside.txt")));
  assert.ok(readiness.blockers.some((item) => item.includes("Validation must pass")));
});

test("TASK-126 historical translation and skill disposition preserve supersession rules", () => {
  assert.deepEqual(
    explainHistoricalTranslationBlockers({
      id: "HIST-SUPERSEDED",
      archiveConcept: "old reentry prompt",
      sourceRefs: ["ThinkIO-v1.1.1/04-reentry/REENTRY-PROMPT.md"],
      currentNativeDestination: "session grounding",
      disposition: "superseded",
      evidence: ["archive-source-mapping-preserved"],
      taskIds: ["TASK-131"],
      supersededBy: "TASK-131"
    }),
    []
  );
  assert.deepEqual(
    classifySkillDisposition({
      skillName: "execution-handoff",
      disposition: "native-replacement",
      nativeReplacementTaskIds: ["TASK-125", "TASK-129"],
      rationale: "Closeout and export readiness now own the behavior."
    }),
    []
  );
});

test("TASK-127 semantic naming lints deprecated active terms", () => {
  const findings = lintSemanticNames({
    texts: taskTitleNamingInputs([{ ...candidateTask, title: "Implement active reentry prompt" }])
  });
  const allowed = lintSemanticNames({
    texts: [{ location: "TASK-131", text: "Define reentry translation architecture boundary" }]
  });

  assert.equal(findings.length, 1);
  assert.equal(allowed.length, 0);
});

test("TASK-129 export readiness validates storage, version, and ingest profiles", () => {
  assert.deepEqual(
    explainExportReadinessBlockers({
      profile: {
        id: "EXPORT-MODEL-REVIEW",
        purpose: "model-review",
        requiredSources: ["docs/project-state-report.md"],
        excludedSources: ["node_modules/"],
        requiredValidation: ["npm run check"],
        expectedIngestPath: "provider-output -> proposal-review -> validation"
      },
      storage: {
        id: "STORAGE-EXPORT",
        paths: [{ path: "docs/project-state-report.md", exists: true, portable: true, checksum: "fixture" }]
      },
      versions: [{ kind: "export", version: "2026-07-13", sourceRef: "docs/project-state-report.md" }],
      passedValidation: ["npm run check"]
    }),
    []
  );
});

test("TASK-131 reentry translation maps old package behavior to native owners", () => {
  const mappings: ReentryResponsibilityMapping[] = [
    { historicalResponsibility: "required-load-list", nativeOwner: "project-materials", reads: ["docs/"], writes: ["state/project.materials.json"], validationEvidence: ["material-index"], coveredByTaskIds: ["TASK-121"] },
    { historicalResponsibility: "active-reentry-prompt", nativeOwner: "runtime", reads: ["state/"], writes: [], validationEvidence: ["next-action-resolver"], coveredByTaskIds: ["TASK-120"] },
    { historicalResponsibility: "cross-chat-carry-forward", nativeOwner: "kernel", reads: ["state/checkpoints.json"], writes: ["state/checkpoints.json"], validationEvidence: ["closeout"], coveredByTaskIds: ["TASK-125"] },
    { historicalResponsibility: "package-manifest-checksum", nativeOwner: "runtime", reads: ["local-vsix/"], writes: [], validationEvidence: ["export-profile"], coveredByTaskIds: ["TASK-129"] },
    { historicalResponsibility: "model-continuation-rules", nativeOwner: "baml", reads: ["contracts/baml/"], writes: ["proposal"], validationEvidence: ["baml-contract"], coveredByTaskIds: ["TASK-117"] },
    { historicalResponsibility: "accepted-project-mutation", nativeOwner: "cue", reads: ["tasks/"], writes: ["tasks/"], validationEvidence: ["cue-validation"], coveredByTaskIds: ["TASK-122"] }
  ];

  assert.deepEqual(explainReentryTranslationBlockers(mappings), []);
});

test("TASK-117 and TASK-118 validate BAML inventory and generator boundary", () => {
  const blockers = validateBamlContractInventory({
    files: [
      "build-context-packet.baml",
      "classify-task.baml",
      "detect-drift.baml",
      "review-evidence.baml",
      "classify-project-material.baml",
      "route-task-context.baml",
      "verify-proof-package.baml",
      "summarize-human-review.baml",
      "propose-refactor-batch.baml",
      "compose-task-proposal.baml",
      "classify-provider-output.baml",
      "review-governance-decision.baml",
      "translate-reentry-responsibility.baml"
    ],
    rootContractFiles: [],
    cliBoundary: {
      contractsDirectory: "contracts/baml",
      generatedClientAllowed: false,
      providerIntegrationReady: false,
      rationale: "Contracts remain documentation until provider integration is approved."
    }
  });

  assert.deepEqual(blockers, []);
});

test("TASK-108 isolated VSIX install validation covers uninstall reinstall plan", () => {
  const result = validateRuntimeIsolatedVsixInstall({
    extensionId: "thinkio.thinkio-rebuild",
    vsixPath: "local-vsix/thinkio-rebuild-0.2.1.vsix",
    packageExists: true
  });

  assert.equal(result.ok, true);
  assert.equal(result.plan.length, 4);
  assert.match(result.plan.join("\n"), /--install-extension/);
  assert.match(result.plan.join("\n"), /--uninstall-extension/);
});
