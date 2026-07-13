import type { GovernedTask } from "./types.ts";

export interface WorktreeSummary {
  branch: string;
  changedFiles: string[];
  untrackedFiles: string[];
  stagedFiles: string[];
}

export interface TaskScopeReconciliation {
  taskId: string;
  matchedFiles: string[];
  unmatchedFiles: string[];
  blockers: string[];
}

export interface CloseoutReadinessCheck {
  ok: boolean;
  blockers: string[];
}

export function reconcileWorktreeToTask(summary: WorktreeSummary, task: GovernedTask): TaskScopeReconciliation {
  const files = [...summary.changedFiles, ...summary.untrackedFiles, ...summary.stagedFiles];
  const allowedPrefixes = task.allowedContext.map((context) => context.replaceAll("\\", "/"));
  const matchedFiles = files.filter((file) => allowedPrefixes.some((prefix) => file.replaceAll("\\", "/").startsWith(prefix)));
  const unmatchedFiles = files.filter((file) => !matchedFiles.includes(file));
  const blockers = unmatchedFiles.map((file) => `Worktree file ${file} is outside allowed context for ${task.id}.`);

  return { taskId: task.id, matchedFiles, unmatchedFiles, blockers };
}

export function checkCloseoutReadiness(input: {
  task: GovernedTask;
  reconciliation: TaskScopeReconciliation;
  validationPassed: boolean;
  requiredEvidence: string[];
  presentEvidence: string[];
}): CloseoutReadinessCheck {
  const missingEvidence = input.requiredEvidence.filter((item) => !input.presentEvidence.includes(item));
  const blockers = [
    ...input.reconciliation.blockers,
    ...missingEvidence.map((item) => `Missing closeout evidence: ${item}.`)
  ];

  if (!input.validationPassed) blockers.push(`Validation must pass before closeout for ${input.task.id}.`);

  return { ok: blockers.length === 0, blockers };
}
