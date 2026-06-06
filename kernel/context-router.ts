import type { AuthorityLevel, ContextPacket, ContextSourceRule, GovernedTask, TaskMode } from "./types.ts";

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

export function buildModeAwareContextPacket(
  task: GovernedTask,
  sourceRules: ContextSourceRule[] = []
): ContextPacket {
  const packet = buildContextPacket(task);
  const sourceAuthorities: Record<string, AuthorityLevel> = {};
  const modeFilteredFiles: string[] = [];

  for (const path of packet.includedFiles) {
    const rule = sourceRules.find((sourceRule) => sourceRule.path === path);

    if (!rule) {
      modeFilteredFiles.push(path);
      continue;
    }

    sourceAuthorities[path] = rule.authority;
    if (rule.modes.includes(task.mode)) {
      modeFilteredFiles.push(path);
    }
  }

  return {
    ...packet,
    includedFiles: modeFilteredFiles,
    sourceAuthorities,
    modeFilteredFiles
  };
}

export function defaultSourceRulesForTask(task: GovernedTask): ContextSourceRule[] {
  return task.allowedContext.map((path) => ({
    path,
    authority: inferAuthorityForPath(path),
    modes: inferModesForPath(path)
  }));
}

export function inferAuthorityForPath(path: string): AuthorityLevel {
  if (path.startsWith("tasks/") || path.startsWith("schemas/") || path.startsWith("kernel/")) {
    return "accepted";
  }

  if (path.startsWith("runtime/") || path.startsWith("tests/") || path.startsWith("contracts/")) {
    return "candidate";
  }

  return "idea";
}

function inferModesForPath(path: string): TaskMode[] {
  if (path.startsWith("contracts/")) {
    return ["plan", "build", "review"];
  }

  if (path.startsWith("tests/")) {
    return ["build", "review"];
  }

  if (path.startsWith("kernel/") || path.startsWith("runtime/") || path.startsWith("schemas/")) {
    return ["plan", "build", "review", "freeze", "execute"];
  }

  return ["brainstorm", "plan", "build", "review", "freeze", "execute"];
}

function isArchivePath(path: string): boolean {
  return archivePathFragments.some((fragment) => path.includes(fragment));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
