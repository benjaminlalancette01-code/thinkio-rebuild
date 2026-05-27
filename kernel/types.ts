export const TASK_STATUSES = [
  "idea",
  "candidate",
  "accepted",
  "frozen",
  "executable",
  "done",
  "rejected",
  "archived"
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_MODES = [
  "brainstorm",
  "plan",
  "build",
  "review",
  "freeze",
  "execute"
] as const;

export type TaskMode = (typeof TASK_MODES)[number];

export const AUTHORITY_LEVELS = [
  "idea",
  "candidate",
  "accepted",
  "frozen",
  "executable",
  "final",
  "rejected",
  "archived"
] as const;

export type AuthorityLevel = (typeof AUTHORITY_LEVELS)[number];

export interface GovernedTask {
  id: string;
  title: string;
  mode: TaskMode;
  status: TaskStatus;
  authority: AuthorityLevel;
  dependencies: string[];
  allowedContext: string[];
  blockedContext: string[];
  requiredEvidence: string[];
  promotionRule: "all-required-evidence-present";
  checkpointRequired: boolean;
}

export interface ArtifactRecord {
  id: string;
  taskId: string;
  path: string;
  kind: "document" | "schema" | "kernel" | "state" | "view" | "runtime" | "test" | "contract";
  evidence: string[];
  createdAt: string;
}

export interface ApprovalRecord {
  id: string;
  taskId: string;
  approvedBy: string;
  scope: string;
  approvedAt: string;
}

export interface CheckpointRecord {
  id: string;
  taskId: string;
  status: TaskStatus;
  evidence: string[];
  notes: string;
  createdAt: string;
}

export interface ContextPacket {
  taskId: string;
  mode: TaskMode;
  allowedContext: string[];
  blockedContext: string[];
  includedFiles: string[];
  excludedFiles: string[];
}

