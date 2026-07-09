import type { Workboard, WorkStep } from "./types.ts";

type WorkboardInput = Omit<Workboard, "updatedAt"> & Partial<Pick<Workboard, "updatedAt">>;

export function createWorkboard(input: WorkboardInput): Workboard {
  return {
    id: input.id,
    taskIds: [...input.taskIds],
    steps: input.steps.map((step) => ({
      ...step,
      artifactLinks: [...step.artifactLinks]
    })),
    updatedAt: input.updatedAt ?? new Date().toISOString()
  };
}

export function findCurrentStep(workboard: Workboard): WorkStep | undefined {
  return workboard.steps.find((step) => step.workflowPosition === "current");
}

export function validateWorkboard(workboard: Workboard): boolean {
  return explainWorkboardBlockers(workboard).length === 0;
}

export function explainWorkboardBlockers(workboard: Workboard): string[] {
  const blockers: string[] = [];
  const stepIds = new Set<string>();
  const taskIds = new Set(workboard.taskIds);
  const currentSteps = workboard.steps.filter((step) => step.workflowPosition === "current");

  if (!workboard.id) {
    blockers.push("Workboard id is required.");
  }

  if (!Boolean(Date.parse(workboard.updatedAt))) {
    blockers.push("Workboard updatedAt must be a valid date.");
  }

  if (currentSteps.length !== 1) {
    blockers.push(`Workboard must have exactly one current step; found ${currentSteps.length}.`);
  }

  for (const step of workboard.steps) {
    if (!step.id) {
      blockers.push("Work step id is required.");
      continue;
    }

    if (stepIds.has(step.id)) {
      blockers.push(`Duplicate work step id: ${step.id}.`);
    }
    stepIds.add(step.id);

    if (!taskIds.has(step.taskId)) {
      blockers.push(`Work step ${step.id} references unknown task ${step.taskId}.`);
    }

    if (!Number.isInteger(step.order) || step.order < 0) {
      blockers.push(`Work step ${step.id} order must be a non-negative integer.`);
    }

    if (step.parentStepId && step.parentStepId === step.id) {
      blockers.push(`Work step ${step.id} cannot be its own parent.`);
    }

    if (step.workflowPosition === "current" && ["done", "rejected"].includes(step.status)) {
      blockers.push(`Current work step ${step.id} cannot have terminal status ${step.status}.`);
    }

    for (const artifactLink of step.artifactLinks) {
      if (!artifactLink) {
        blockers.push(`Work step ${step.id} has an empty artifact link.`);
      }
    }
  }

  for (const step of workboard.steps) {
    if (step.parentStepId && !stepIds.has(step.parentStepId)) {
      blockers.push(`Work step ${step.id} references missing parent ${step.parentStepId}.`);
    }
  }

  return blockers;
}
