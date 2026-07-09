import type { BranchStatus, ReturnAnchor, Workboard, WorkBranch } from "./types.ts";

const branchTransitions: Record<BranchStatus, BranchStatus[]> = {
  active: ["paused", "completed", "rejected"],
  paused: ["active", "completed", "rejected"],
  completed: [],
  rejected: []
};

export function canTransitionBranch(from: BranchStatus, to: BranchStatus): boolean {
  return branchTransitions[from]?.includes(to) ?? false;
}

export function validateBranchState(
  branches: WorkBranch[],
  returnAnchors: ReturnAnchor[],
  workboard: Workboard
): boolean {
  return explainBranchBlockers(branches, returnAnchors, workboard).length === 0;
}

export function explainBranchBlockers(
  branches: WorkBranch[],
  returnAnchors: ReturnAnchor[],
  workboard: Workboard
): string[] {
  const blockers: string[] = [];
  const branchIds = new Set<string>();
  const stepIds = new Set(workboard.steps.map((step) => step.id));

  for (const branch of branches) {
    if (!branch.id) {
      blockers.push("Branch id is required.");
      continue;
    }

    if (branchIds.has(branch.id)) {
      blockers.push(`Duplicate branch id: ${branch.id}.`);
    }
    branchIds.add(branch.id);

    if (!branch.purpose) {
      blockers.push(`Branch ${branch.id} purpose is required.`);
    }

    if (!branch.successCondition) {
      blockers.push(`Branch ${branch.id} success condition is required.`);
    }

    if (!stepIds.has(branch.parentStepId)) {
      blockers.push(`Branch ${branch.id} references missing parent step ${branch.parentStepId}.`);
    }

    if (["active", "paused"].includes(branch.status) && !branch.activeStepId) {
      blockers.push(`Branch ${branch.id} requires an active step while ${branch.status}.`);
    }

    if (branch.activeStepId && !stepIds.has(branch.activeStepId)) {
      blockers.push(`Branch ${branch.id} references missing active step ${branch.activeStepId}.`);
    }

    if (branch.history.length === 0) {
      blockers.push(`Branch ${branch.id} requires lifecycle history.`);
    }

    for (const entry of branch.history) {
      if (!Boolean(Date.parse(entry.at))) {
        blockers.push(`Branch ${branch.id} has invalid history date.`);
      }
    }

    const lastStatus = branch.history.at(-1)?.status;
    if (lastStatus && lastStatus !== branch.status) {
      blockers.push(`Branch ${branch.id} history ends at ${lastStatus}, not ${branch.status}.`);
    }
  }

  for (const anchor of returnAnchors) {
    if (!anchor.id) {
      blockers.push("Return anchor id is required.");
      continue;
    }

    if (!branchIds.has(anchor.branchId)) {
      blockers.push(`Return anchor ${anchor.id} references missing branch ${anchor.branchId}.`);
    }

    if (!stepIds.has(anchor.targetStepId)) {
      blockers.push(`Return anchor ${anchor.id} references missing target step ${anchor.targetStepId}.`);
    }

    if (!anchor.resumeCondition) {
      blockers.push(`Return anchor ${anchor.id} resume condition is required.`);
    }
  }

  return blockers;
}

export function createReturnAnchor(input: ReturnAnchor): ReturnAnchor {
  return { ...input };
}
