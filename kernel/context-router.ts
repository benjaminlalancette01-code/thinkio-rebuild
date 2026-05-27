import type { ContextPacket, GovernedTask } from "./types.ts";

const archivePathFragments = [
  "thinkio-archive/",
  "archive/",
  "old-versions/",
  "candidate-extraction-piles/"
];

export function buildContextPacket(task: GovernedTask): ContextPacket {
  const includedFiles = task.allowedContext.filter((path) => !isArchivePath(path));
  const excludedFiles = unique([
    ...task.blockedContext,
    ...task.allowedContext.filter(isArchivePath)
  ]);

  return {
    taskId: task.id,
    mode: task.mode,
    allowedContext: [...task.allowedContext],
    blockedContext: [...task.blockedContext],
    includedFiles,
    excludedFiles
  };
}

function isArchivePath(path: string): boolean {
  return archivePathFragments.some((fragment) => path.includes(fragment));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

