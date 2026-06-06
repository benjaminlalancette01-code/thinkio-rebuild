import { canExecuteTask, explainBlockedExecution } from "./gate.ts";
import type { ExecutionWindow, GovernedTask } from "./types.ts";

export function createExecutionWindow(input: ExecutionWindow): ExecutionWindow {
  return { ...input };
}

export function isExecutionWindowOpen(window: ExecutionWindow, at = new Date()): boolean {
  const time = at.getTime();
  return Date.parse(window.opensAt) <= time && time <= Date.parse(window.closesAt);
}

export function explainExecutionWindowBlockers(
  task: GovernedTask,
  window: ExecutionWindow,
  at = new Date()
): string[] {
  const reasons = explainBlockedExecution(task);

  if (window.taskId !== task.id) {
    reasons.push(`Execution window belongs to ${window.taskId}, not ${task.id}.`);
  }

  if (!isExecutionWindowOpen(window, at)) {
    reasons.push(`Execution window is closed at ${at.toISOString()}.`);
  }

  if (window.requiredAuthority !== "executable") {
    reasons.push("Execution window requires executable authority.");
  }

  return reasons;
}

export function canExecuteWithinWindow(task: GovernedTask, window: ExecutionWindow, at = new Date()): boolean {
  return canExecuteTask(task) && window.taskId === task.id && isExecutionWindowOpen(window, at);
}
