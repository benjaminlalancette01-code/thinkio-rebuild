import type { GovernedTask } from "../kernel/types.ts";
import { createCheckpoint } from "../kernel/checkpoint.ts";
import { buildContextPacket } from "../kernel/context-router.ts";
import { validateCueTargets, validateDiscoveredTaskSchemas, type CueCommandRunner, type CueValidationTarget } from "./cue-validator.ts";
import { isAllowedLocalDevAction } from "./command-registry.ts";
import { updateViewFiles } from "./update-views.ts";

export function assertLocalDevActionAllowed(action: string): void {
  if (!isAllowedLocalDevAction(action)) {
    throw new Error(`Local dev runtime action blocked: ${action}`);
  }
}

export function buildTaskRuntimePreview(task: GovernedTask, evidence: string[]) {
  assertLocalDevActionAllowed("build-context-packet");
  assertLocalDevActionAllowed("write-checkpoint");

  return {
    contextPacket: buildContextPacket(task),
    checkpoint: createCheckpoint({ task, evidence })
  };
}

export async function validateWorkspaceSchemas(
  targets?: CueValidationTarget[],
  runner?: CueCommandRunner
) {
  assertLocalDevActionAllowed("validate-cue-schemas");

  if (!targets) {
    return validateDiscoveredTaskSchemas("tasks", runner);
  }

  return validateCueTargets(targets, runner);
}

export async function updateWorkspaceViews(): Promise<void> {
  assertLocalDevActionAllowed("update-views");
  await updateViewFiles();
}
