import type { AuthorityLevel, TaskStatus } from "./types.ts";

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

const authorityTransitions: Record<AuthorityLevel, AuthorityLevel[]> = {
  idea: ["candidate"],
  candidate: ["accepted", "rejected"],
  accepted: ["frozen"],
  frozen: ["executable"],
  executable: ["final"],
  final: ["archived"],
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

export function isAuthorityTransitionAllowed(from: AuthorityLevel, to: AuthorityLevel): boolean {
  return authorityTransitions[from]?.includes(to) ?? false;
}

export function assertAuthorityTransitionAllowed(from: AuthorityLevel, to: AuthorityLevel): void {
  if (!isAuthorityTransitionAllowed(from, to)) {
    throw new Error(`Authority transition blocked: ${from} -> ${to}`);
  }
}

export function allowedNextAuthorities(authority: AuthorityLevel): AuthorityLevel[] {
  return [...(authorityTransitions[authority] ?? [])];
}

export function isAuthorityCompatibleWithStatus(authority: AuthorityLevel, status: TaskStatus): boolean {
  if (status === "done") {
    return authority === "accepted" || authority === "final";
  }

  return authority === status;
}
