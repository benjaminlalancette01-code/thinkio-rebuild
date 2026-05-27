import type { GovernedTask } from "../kernel/types.ts";
import { buildContextPacket } from "../kernel/context-router.ts";
import { canExecuteTask, explainBlockedExecution } from "../kernel/gate.ts";

export function prepareTaskRun(task: GovernedTask) {
  return {
    taskId: task.id,
    canExecute: canExecuteTask(task),
    blockedReasons: explainBlockedExecution(task),
    contextPacket: buildContextPacket(task)
  };
}

