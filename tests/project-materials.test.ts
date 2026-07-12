import test from "node:test";
import assert from "node:assert/strict";
import type { GovernedTask } from "../kernel/types.ts";
import {
  buildProjectKnowledgeIndex,
  buildProjectMaterialInventory,
  buildProjectStateReportModel,
  classifyProjectMaterial,
  classifyProjectMaterialActionSensitivity,
  createProjectMaterialReorganizationPlan,
  explainProjectMaterialBlockers,
  explainProjectMaterialActionBlockers,
  renderProjectStateReportMarkdown,
  retrievalBoundaryForProjectMaterial,
  searchProjectMaterials,
  summarizeProjectMaterials
} from "../kernel/project-materials.ts";

const task: GovernedTask = {
  id: "TASK-092",
  title: "Define project information architecture and source map",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-091"],
  allowedContext: [],
  blockedContext: [],
  requiredEvidence: [],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("project material classifier separates canonical, generated, historical, and import authority", () => {
  assert.equal(classifyProjectMaterial("tasks/TASK-092.define-project-information-architecture-source-map.json").disposition, "canonical-source");
  assert.equal(classifyProjectMaterial("views/kanban.json").authority, "generated");
  assert.equal(classifyProjectMaterial("audit/vscode-plugin-maturity-audit-2026-07-04.md").disposition, "historical-evidence");
  assert.equal(classifyProjectMaterial("imports/candidates/TASK-010.governed-decomposition-model.md").disposition, "review-needed");
  assert.equal(classifyProjectMaterial("docs/current-project-state-report-2026-07-04.md").disposition, "stale-superseded");
});

test("project material inventory summarizes report inputs and validates required entrypoints", () => {
  const records = buildProjectMaterialInventory([
    "docs/current-project-hub.md",
    "docs/project-state-report.md",
    "docs/project-information-architecture.md",
    "docs/current-project-state-report-2026-07-04.md",
    "audit/runtime-kernel-dependency-audit-2026-06-28.md",
    "imports/accepted/TASK-002.wire-cue-validation.md",
    "state/project.graph.json",
    "tasks/TASK-092.define-project-information-architecture-source-map.json"
  ]);
  const summary = summarizeProjectMaterials(records);

  assert.equal(summary.canonicalSourceCount, 1);
  assert.equal(summary.generatedStateCount, 1);
  assert.equal(summary.historicalEvidenceCount, 2);
  assert.deepEqual(explainProjectMaterialBlockers(records), []);
});

test("project-state report explains origin, now, next, and worked material", () => {
  const records = buildProjectMaterialInventory([
    "docs/current-project-hub.md",
    "docs/project-state-report.md",
    "docs/project-information-architecture.md",
    "audit/runtime-kernel-dependency-audit-2026-06-28.md",
    "tasks/TASK-092.define-project-information-architecture-source-map.json"
  ]);
  const model = buildProjectStateReportModel({
    records,
    tasks: [task],
    generatedAt: "2026-07-09T00:00:00.000Z"
  });
  const markdown = renderProjectStateReportMarkdown(model);

  assert.match(markdown, /Where The Project Started/);
  assert.match(markdown, /What Is Happening Now/);
  assert.match(markdown, /TASK-092/);
  assert.match(markdown, /Data Already Included Or Worked On/);
});

test("project knowledge index groups classified material by disposition", () => {
  const index = buildProjectKnowledgeIndex(
    buildProjectMaterialInventory([
      "docs/current-project-hub.md",
      "views/kanban.json",
      "imports/rejected/example.md"
    ]),
    "2026-07-09T00:00:00.000Z"
  );

  assert.deepEqual(index.groups.map((group) => group.disposition), [
    "current-guidance",
    "generated-state",
    "rejected-reference"
  ]);
});

test("project material reorganization plans are dry-run and approval-gated", () => {
  const records = buildProjectMaterialInventory([
    "tasks/TASK-092.define-project-information-architecture-source-map.json",
    "imports/candidates/TASK-010.governed-decomposition-model.md"
  ]);
  const deleteCanonical = {
    id: "PM-ACTION-001",
    taskId: "TASK-101",
    action: "delete" as const,
    sourcePath: "tasks/TASK-092.define-project-information-architecture-source-map.json",
    rationale: "Fixture destructive action.",
    sensitivity: classifyProjectMaterialActionSensitivity("delete", records[1])
  };
  const promoteImport = {
    id: "PM-ACTION-002",
    taskId: "TASK-101",
    action: "promote-import" as const,
    sourcePath: "imports/candidates/TASK-010.governed-decomposition-model.md",
    targetPath: "imports/accepted/TASK-010.governed-decomposition-model.md",
    rationale: "Promote reviewed import.",
    sensitivity: "high" as const
  };

  assert.deepEqual(explainProjectMaterialActionBlockers(deleteCanonical, records), [
    "Project material action PM-ACTION-001 cannot delete canonical source tasks/TASK-092.define-project-information-architecture-source-map.json.",
    "Project material action PM-ACTION-001 requires approval before delete."
  ]);

  const blockedPlan = createProjectMaterialReorganizationPlan({
    id: "PM-PLAN-001",
    records,
    proposals: [promoteImport],
    createdAt: "2026-07-10T00:00:00.000Z"
  });
  assert.equal(blockedPlan.dryRun, true);
  assert.deepEqual(blockedPlan.blockers, [
    "Project material action PM-ACTION-002 requires approval before promote-import."
  ]);

  const approvedPlan = createProjectMaterialReorganizationPlan({
    records,
    proposals: [{ ...promoteImport, approvalId: "APR-PM-ACTION-002" }],
    approvals: [
      {
        id: "APR-PM-ACTION-002",
        taskId: "TASK-101",
        approvedBy: "human",
        scope: "project-material:promote-import",
        approvedAt: "2026-07-10T00:00:00.000Z"
      }
    ]
  });
  assert.deepEqual(approvedPlan.blockers, []);
});

test("project material search returns authority-aware retrieval boundaries", () => {
  const records = buildProjectMaterialInventory([
    "docs/current-project-hub.md",
    "docs/current-project-state-report-2026-07-04.md",
    "tasks/TASK-101.add-approved-project-material-reorganization-actions.json",
    "imports/candidates/TASK-010.governed-decomposition-model.md"
  ]);
  const results = searchProjectMaterials(records, {
    query: "project",
    includeHistorical: true
  });

  assert.ok(results.some((result) => result.path === "docs/current-project-hub.md"));
  assert.ok(results.every((result) => result.retrievalBoundary.length > 0));
  assert.match(
    retrievalBoundaryForProjectMaterial(classifyProjectMaterial("docs/current-project-state-report-2026-07-04.md")),
    /Historical evidence/
  );
});
