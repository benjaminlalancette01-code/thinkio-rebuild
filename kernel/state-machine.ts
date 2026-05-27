import type { TaskStatus } from "./types.ts";

const transitions: Record<TaskStatus, TaskStatus[]> = {
  idea: ["candidate"],
  candidate: ["accepted", "rejected"],
  accepted: ["frozen"],
  frozen: ["executable"],
  executable: ["done"],
  done: ["archived"],
  rejected: ["archived"],
  archived: []
};

export function isTransitionAllowed(from: TaskStatus, to: TaskStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function assertTransitionAllowed(from: TaskStatus, to: TaskStatus): void {
  if (!isTransitionAllowed(from, to)) {
    throw new Error(`Task transition blocked: ${from} -> ${to}`);
  }
}

export function allowedNextStatuses(status: TaskStatus): TaskStatus[] {
  return [...(transitions[status] ?? [])];
}

