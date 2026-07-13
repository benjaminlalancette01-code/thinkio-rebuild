import type { CheckpointRecord, GovernedTask, TaskMode } from "./types.ts";

export type NextActionKind =
  | "resolve-blockers"
  | "refresh-generated-views"
  | "reconcile-worktree"
  | "continue-active-task"
  | "select-next-candidate"
  | "no-open-work";

export interface ViewFreshnessRecord {
  path: string;
  stale: boolean;
  reason?: string;
}

export interface WorktreeSummaryRecord {
  branch?: string;
  changedFiles: string[];
  untrackedFiles: string[];
}

export interface SessionGroundingRecord {
  id: string;
  projectId: string;
  mode: TaskMode;
  currentTaskId?: string;
  checkpointIds: string[];
  approvalIds: string[];
  blockers: string[];
  viewFreshness: ViewFreshnessRecord[];
  worktree: WorktreeSummaryRecord;
  generatedAt: string;
}

export interface NextActionResolution {
  kind: NextActionKind;
  commandId: "thinkio.startResume";
  taskId?: string;
  blockers: string[];
  rationale: string;
}

export function buildSessionGroundingRecord(input: {
  id?: string;
  projectId: string;
  mode: TaskMode;
  currentTaskId?: string;
  checkpoints?: CheckpointRecord[];
  approvalIds?: string[];
  blockers?: string[];
  viewFreshness?: ViewFreshnessRecord[];
  worktree?: WorktreeSummaryRecord;
  generatedAt?: string;
}): SessionGroundingRecord {
  return {
    id: input.id ?? "SESSION-GROUNDING",
    projectId: input.projectId,
    mode: input.mode,
    currentTaskId: input.currentTaskId,
    checkpointIds: (input.checkpoints ?? []).map((checkpoint) => checkpoint.id),
    approvalIds: input.approvalIds ?? [],
    blockers: input.blockers ?? [],
    viewFreshness: input.viewFreshness ?? [],
    worktree: input.worktree ?? { changedFiles: [], untrackedFiles: [] },
    generatedAt: input.generatedAt ?? new Date().toISOString()
  };
}

export function resolveNextAction(input: {
  grounding: SessionGroundingRecord;
  tasks: GovernedTask[];
}): NextActionResolution {
  const staleViews = input.grounding.viewFreshness.filter((view) => view.stale);
  const dirtyFiles = [...input.grounding.worktree.changedFiles, ...input.grounding.worktree.untrackedFiles];

  if (input.grounding.blockers.length > 0) {
    return resolution("resolve-blockers", undefined, input.grounding.blockers, "Session grounding has active blockers.");
  }

  if (staleViews.length > 0) {
    return resolution(
      "refresh-generated-views",
      input.grounding.currentTaskId,
      staleViews.map((view) => `${view.path} is stale${view.reason ? `: ${view.reason}` : ""}.`),
      "Generated projections must be refreshed before continuing."
    );
  }

  if (dirtyFiles.length > 0) {
    return resolution(
      "reconcile-worktree",
      input.grounding.currentTaskId,
      dirtyFiles.map((file) => `Unreconciled worktree file: ${file}.`),
      "Worktree changes need task reconciliation before closeout."
    );
  }

  const active = input.tasks.find((task) => task.id === input.grounding.currentTaskId && task.status === "candidate");
  if (active) {
    return resolution("continue-active-task", active.id, [], `Continue active governed task ${active.id}.`);
  }

  const next = input.tasks.find((task) => task.status === "candidate");
  if (next) {
    return resolution("select-next-candidate", next.id, [], `Select next candidate task ${next.id}.`);
  }

  return resolution("no-open-work", undefined, [], "No candidate work remains.");
}

function resolution(
  kind: NextActionKind,
  taskId: string | undefined,
  blockers: string[],
  rationale: string
): NextActionResolution {
  return { kind, commandId: "thinkio.startResume", taskId, blockers, rationale };
}
