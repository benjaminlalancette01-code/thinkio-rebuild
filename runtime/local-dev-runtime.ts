import type { GovernedTask } from "../kernel/types.ts";
import { createCheckpoint } from "../kernel/checkpoint.ts";
import { buildContextPacket } from "../kernel/context-router.ts";
import { isAllowedLocalDevAction } from "./command-registry.ts";

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

