import type { ApprovalRecord, GovernedTask } from "./types.ts";

export const PROJECT_MATERIAL_DISPOSITIONS = [
  "canonical-source",
  "current-guidance",
  "generated-state",
  "historical-evidence",
  "imported-evidence",
  "visual-mirror",
  "runtime-support",
  "stale-superseded",
  "review-needed",
  "rejected-reference"
] as const;

export type ProjectMaterialDisposition = (typeof PROJECT_MATERIAL_DISPOSITIONS)[number];
export type ProjectMaterialAuthority = "canonical" | "current" | "generated" | "historical" | "imported" | "mirror" | "support";

export interface ProjectMaterialRecord {
  path: string;
  folder: string;
  disposition: ProjectMaterialDisposition;
  authority: ProjectMaterialAuthority;
  current: boolean;
  reportInput: boolean;
  rationale: string;
}

export interface ProjectMaterialSummary {
  total: number;
  byDisposition: Record<ProjectMaterialDisposition, number>;
  byAuthority: Record<ProjectMaterialAuthority, number>;
  canonicalSourceCount: number;
  generatedStateCount: number;
  historicalEvidenceCount: number;
  reportInputCount: number;
}

export interface ProjectStateReportModel {
  generatedAt: string;
  currentReportPath: string;
  projectStartedFrom: string[];
  happeningNow: string[];
  nextWork: string[];
  workedData: string[];
  materialSummary: ProjectMaterialSummary;
  currentEntrypoints: string[];
}

export interface ProjectKnowledgeIndex {
  generatedAt: string;
  groups: Array<{
    disposition: ProjectMaterialDisposition;
    paths: string[];
  }>;
}

export const PROJECT_MATERIAL_ACTION_TYPES = [
  "label",
  "move",
  "archive",
  "promote-import",
  "reject-import",
  "delete"
] as const;

export type ProjectMaterialActionType = (typeof PROJECT_MATERIAL_ACTION_TYPES)[number];
export type ProjectMaterialActionSensitivity = "low" | "medium" | "high" | "critical";

export interface ProjectMaterialActionProposal {
  id: string;
  taskId: string;
  action: ProjectMaterialActionType;
  sourcePath: string;
  targetPath?: string;
  rationale: string;
  sensitivity: ProjectMaterialActionSensitivity;
  approvalId?: string;
}

export interface ProjectMaterialReorganizationPlan {
  id: string;
  dryRun: true;
  proposals: ProjectMaterialActionProposal[];
  blockers: string[];
  createdAt: string;
}

export interface ProjectMaterialSearchQuery {
  query: string;
  dispositions?: ProjectMaterialDisposition[];
  includeHistorical?: boolean;
  maxResults?: number;
}

export interface ProjectMaterialSearchResult {
  path: string;
  disposition: ProjectMaterialDisposition;
  authority: ProjectMaterialAuthority;
  current: boolean;
  score: number;
  retrievalBoundary: string;
}

export function classifyProjectMaterial(path: string): ProjectMaterialRecord {
  const normalized = normalizePath(path);
  const folder = normalized.split("/")[0] ?? "";

  if (/^tasks\/TASK-\d+.*\.json$/.test(normalized)) {
    return material(normalized, folder, "canonical-source", "canonical", true, true, "Governed task JSON is canonical task state.");
  }

  if (/^tasks\/TASK-\d+.*\.md$/.test(normalized)) {
    return material(normalized, folder, "canonical-source", "canonical", true, true, "Task notes explain canonical task state.");
  }

  if (normalized.startsWith(".devtool/features/done/") || normalized.startsWith(".devtool/features/")) {
    return material(normalized, ".devtool", "visual-mirror", "mirror", true, false, "Feature cards mirror task state for visual workflow only.");
  }

  if (normalized.startsWith("state/") || normalized.startsWith("views/")) {
    return material(normalized, folder, "generated-state", "generated", true, true, "Generated state/view projection derived from canonical files.");
  }

  if (normalized === "docs/current-project-hub.md" || normalized === "docs/project-state-report.md") {
    return material(normalized, folder, "current-guidance", "current", true, true, "Current project orientation entrypoint.");
  }

  if (normalized === "docs/current-project-state-report-2026-07-09.md") {
    return material(normalized, folder, "current-guidance", "current", true, true, "Latest accepted current-state report before generated project material evaluation.");
  }

  if (/^docs\/current-project-state-report-\d{4}-\d{2}-\d{2}\.md$/.test(normalized)) {
    return material(normalized, folder, "stale-superseded", "historical", false, true, "Older current-state report retained as historical evidence.");
  }

  if (normalized.startsWith("audit/")) {
    return material(normalized, folder, "historical-evidence", "historical", false, true, "Audit report is historical evidence, not current instructions.");
  }

  if (normalized.startsWith("imports/accepted/")) {
    return material(normalized, "imports", "imported-evidence", "imported", true, true, "Accepted import material already worked into the rebuild.");
  }

  if (normalized.startsWith("imports/candidates/")) {
    return material(normalized, "imports", "review-needed", "imported", false, true, "Candidate import material needs explicit review before authority.");
  }

  if (normalized.startsWith("imports/rejected/")) {
    return material(normalized, "imports", "rejected-reference", "imported", false, false, "Rejected import material is retained only as reference.");
  }

  if (normalized.startsWith("docs/")) {
    return material(normalized, folder, "current-guidance", "current", true, true, "Documentation guides current ThinkIO work unless superseded.");
  }

  return material(normalized, folder, "runtime-support", "support", true, false, "Runtime support material outside the project knowledge folders.");
}

export function buildProjectMaterialInventory(paths: string[]): ProjectMaterialRecord[] {
  return paths.map(classifyProjectMaterial).sort((a, b) => a.path.localeCompare(b.path));
}

export function summarizeProjectMaterials(records: ProjectMaterialRecord[]): ProjectMaterialSummary {
  const byDisposition = Object.fromEntries(PROJECT_MATERIAL_DISPOSITIONS.map((item) => [item, 0])) as Record<ProjectMaterialDisposition, number>;
  const byAuthority = {
    canonical: 0,
    current: 0,
    generated: 0,
    historical: 0,
    imported: 0,
    mirror: 0,
    support: 0
  };

  for (const record of records) {
    byDisposition[record.disposition] += 1;
    byAuthority[record.authority] += 1;
  }

  return {
    total: records.length,
    byDisposition,
    byAuthority,
    canonicalSourceCount: byDisposition["canonical-source"],
    generatedStateCount: byDisposition["generated-state"],
    historicalEvidenceCount: byDisposition["historical-evidence"] + byDisposition["stale-superseded"],
    reportInputCount: records.filter((record) => record.reportInput).length
  };
}

export function buildProjectStateReportModel(input: {
  records: ProjectMaterialRecord[];
  tasks: GovernedTask[];
  generatedAt?: string;
  currentReportPath?: string;
}): ProjectStateReportModel {
  const doneTasks = input.tasks.filter((task) => task.status === "done").length;
  const candidateTasks = input.tasks.filter((task) => task.status === "candidate");
  const ideaTasks = input.tasks.filter((task) => task.status === "idea");
  const summary = summarizeProjectMaterials(input.records);

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    currentReportPath: input.currentReportPath ?? "docs/project-state-report.md",
    projectStartedFrom: [
      "ThinkIO rebuild began as a governed task/runtime reconstruction from earlier reports, imports, and accepted task material.",
      "Accepted imports and audits remain evidence, while canonical task state now lives in tasks/*.json."
    ],
    happeningNow: [
      `${input.tasks.length} governed ${plural(input.tasks.length, "task file")} present.`,
      `${doneTasks} ${plural(doneTasks, "task")} done/accepted.`,
      `${candidateTasks.length} active ${plural(candidateTasks.length, "candidate task")}.`,
      `${ideaTasks.length} active ${plural(ideaTasks.length, "idea task")}.`,
      "The current active work follows the active candidate task queue."
    ],
    nextWork: candidateTasks.map((task) => `${task.id}: ${task.title}`),
    workedData: [
      `${summary.canonicalSourceCount} canonical task/note files are included.`,
      `${summary.generatedStateCount} generated state/view files are included.`,
      `${summary.historicalEvidenceCount} historical or superseded report files are included as evidence.`,
      `${summary.byDisposition["imported-evidence"]} accepted import files are included.`,
      `${summary.byDisposition["review-needed"]} import files remain review-needed.`
    ],
    materialSummary: summary,
    currentEntrypoints: [
      "docs/current-project-hub.md",
      "docs/project-state-report.md",
      "docs/project-information-architecture.md",
      "docs/historical-material-disposition.md"
    ]
  };
}

export function renderProjectStateReportMarkdown(model: ProjectStateReportModel): string {
  return `# Project State Report

Generated: ${model.generatedAt}

## Where The Project Started

${bulletList(model.projectStartedFrom)}

## What Is Happening Now

${bulletList(model.happeningNow)}

## What Is Next

${model.nextWork.length > 0 ? bulletList(model.nextWork) : "- No active candidate task is present."}

## Data Already Included Or Worked On

${bulletList(model.workedData)}

## Material Summary

- Total classified files: ${model.materialSummary.total}
- Report input files: ${model.materialSummary.reportInputCount}
- Canonical source files: ${model.materialSummary.canonicalSourceCount}
- Generated state/view files: ${model.materialSummary.generatedStateCount}
- Historical evidence files: ${model.materialSummary.historicalEvidenceCount}

## Current Entrypoints

${bulletList(model.currentEntrypoints)}
`;
}

export function buildProjectKnowledgeIndex(records: ProjectMaterialRecord[], generatedAt = new Date().toISOString()): ProjectKnowledgeIndex {
  return {
    generatedAt,
    groups: PROJECT_MATERIAL_DISPOSITIONS.map((disposition) => ({
      disposition,
      paths: records
        .filter((record) => record.disposition === disposition)
        .map((record) => record.path)
        .sort((a, b) => a.localeCompare(b))
    })).filter((group) => group.paths.length > 0)
  };
}

export function explainProjectMaterialBlockers(records: ProjectMaterialRecord[]): string[] {
  const blockers: string[] = [];
  const paths = new Set(records.map((record) => record.path));

  for (const required of ["docs/current-project-hub.md", "docs/project-state-report.md", "docs/project-information-architecture.md"]) {
    if (!paths.has(required)) blockers.push(`Project material inventory is missing required entrypoint ${required}.`);
  }

  if (!records.some((record) => record.disposition === "canonical-source")) {
    blockers.push("Project material inventory requires canonical source records.");
  }

  if (!records.some((record) => record.disposition === "historical-evidence" || record.disposition === "stale-superseded")) {
    blockers.push("Project material inventory requires historical evidence records.");
  }

  return blockers;
}

export function classifyProjectMaterialActionSensitivity(
  action: ProjectMaterialActionType,
  record?: ProjectMaterialRecord
): ProjectMaterialActionSensitivity {
  if (action === "delete") return record?.authority === "canonical" ? "critical" : "high";
  if (action === "move" || action === "archive" || action === "promote-import") return "high";
  if (action === "reject-import") return "medium";
  return "low";
}

export function projectMaterialActionRequiresApproval(proposal: ProjectMaterialActionProposal): boolean {
  return proposal.sensitivity === "high" || proposal.sensitivity === "critical";
}

export function explainProjectMaterialActionBlockers(
  proposal: ProjectMaterialActionProposal,
  records: ProjectMaterialRecord[],
  approvals: ApprovalRecord[] = []
): string[] {
  const blockers: string[] = [];
  const source = records.find((record) => record.path === proposal.sourcePath);

  if (!source) blockers.push(`Project material action ${proposal.id} references missing source ${proposal.sourcePath}.`);
  if (!proposal.rationale.trim()) blockers.push(`Project material action ${proposal.id} requires rationale.`);
  if ((proposal.action === "move" || proposal.action === "archive") && !proposal.targetPath) {
    blockers.push(`Project material action ${proposal.id} requires a target path for ${proposal.action}.`);
  }
  if (proposal.action === "delete" && source?.authority === "canonical") {
    blockers.push(`Project material action ${proposal.id} cannot delete canonical source ${proposal.sourcePath}.`);
  }
  if (proposal.action === "promote-import" && source?.disposition !== "review-needed") {
    blockers.push(`Project material action ${proposal.id} can only promote review-needed import material.`);
  }
  if (proposal.action === "reject-import" && source?.authority !== "imported") {
    blockers.push(`Project material action ${proposal.id} can only reject imported material.`);
  }

  if (projectMaterialActionRequiresApproval(proposal)) {
    const approval = approvals.find(
      (candidate) => candidate.id === proposal.approvalId && candidate.taskId === proposal.taskId
    );
    if (!approval) {
      blockers.push(`Project material action ${proposal.id} requires approval before ${proposal.action}.`);
    }
  }

  return blockers;
}

export function createProjectMaterialReorganizationPlan(input: {
  id?: string;
  records: ProjectMaterialRecord[];
  proposals: ProjectMaterialActionProposal[];
  approvals?: ApprovalRecord[];
  createdAt?: string;
}): ProjectMaterialReorganizationPlan {
  const blockers = input.proposals.flatMap((proposal) =>
    explainProjectMaterialActionBlockers(proposal, input.records, input.approvals ?? [])
  );

  return {
    id: input.id ?? "PROJECT-MATERIAL-REORG-PLAN",
    dryRun: true,
    proposals: input.proposals.map((proposal) => ({ ...proposal })),
    blockers,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function searchProjectMaterials(
  records: ProjectMaterialRecord[],
  query: ProjectMaterialSearchQuery
): ProjectMaterialSearchResult[] {
  const terms = query.query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
  const dispositions = query.dispositions ? new Set(query.dispositions) : undefined;
  const maxResults = query.maxResults ?? 20;

  if (terms.length === 0) return [];

  return records
    .filter((record) => !dispositions || dispositions.has(record.disposition))
    .filter((record) => query.includeHistorical || record.current || record.authority !== "historical")
    .map((record) => ({
      record,
      score: scoreProjectMaterial(record, terms)
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.record.path.localeCompare(b.record.path))
    .slice(0, maxResults)
    .map((result) => ({
      path: result.record.path,
      disposition: result.record.disposition,
      authority: result.record.authority,
      current: result.record.current,
      score: result.score,
      retrievalBoundary: retrievalBoundaryForProjectMaterial(result.record)
    }));
}

export function retrievalBoundaryForProjectMaterial(record: ProjectMaterialRecord): string {
  if (record.authority === "canonical") return "Canonical source. Safe to retrieve as governed project state.";
  if (record.authority === "generated") return "Generated projection. Retrieve as derived state only.";
  if (record.authority === "historical") return "Historical evidence. Retrieve for context, not current authority.";
  if (record.disposition === "review-needed") return "Review-needed import. Retrieve as unaccepted evidence.";
  if (record.disposition === "rejected-reference") return "Rejected reference. Retrieve only for audit context.";
  return "Current project material. Retrieve with its disposition label.";
}

function material(
  path: string,
  folder: string,
  disposition: ProjectMaterialDisposition,
  authority: ProjectMaterialAuthority,
  current: boolean,
  reportInput: boolean,
  rationale: string
): ProjectMaterialRecord {
  return { path, folder, disposition, authority, current, reportInput, rationale };
}

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function bulletList(values: string[]): string {
  return values.map((value) => `- ${value}`).join("\n");
}

function plural(count: number, label: string): string {
  return count === 1 ? label : `${label}s`;
}

function scoreProjectMaterial(record: ProjectMaterialRecord, terms: string[]): number {
  const haystack = `${record.path} ${record.disposition} ${record.authority} ${record.rationale}`.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (record.path.toLowerCase().includes(term)) score += 3;
    if (haystack.includes(term)) score += 1;
  }

  if (record.current) score += 1;
  if (record.authority === "canonical") score += 1;
  return score;
}
