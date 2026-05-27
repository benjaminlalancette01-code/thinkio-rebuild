import type { GovernedTask } from "./types.ts";

export function canPromoteTask(task: GovernedTask, evidence: string[]): boolean {
  if (task.promotionRule !== "all-required-evidence-present") {
    return false;
  }

  return task.requiredEvidence.every((required) => evidence.includes(required));
}

export function canExecuteTask(task: GovernedTask): boolean {
  return task.status === "executable" && task.authority === "executable";
}

export function explainBlockedExecution(task: GovernedTask): string[] {
  const reasons: string[] = [];

  if (task.status !== "executable") {
    reasons.push(`Task status is ${task.status}, not executable.`);
  }

  if (task.authority !== "executable") {
    reasons.push(`Task authority is ${task.authority}, not executable.`);
  }

  if (task.blockedContext.some((path) => path.includes("archive"))) {
    reasons.push("Archive context is blocked by default.");
  }

  return reasons;
}

