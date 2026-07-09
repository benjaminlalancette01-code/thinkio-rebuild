import type { ApprovalRecord, ExecutionWindow, GovernedTask } from "../kernel/types.ts";
import { buildContextPacket } from "../kernel/context-router.ts";
import { canExecuteTask, explainBlockedExecution } from "../kernel/gate.ts";
import {
  canExecuteWithinWindow,
  explainExecutionWindowBlockers
} from "../kernel/execution-window.ts";
import {
  type ApprovalRequiredLocalDevAction,
  explainApprovalBoundaryBlockers
} from "./local-dev-runtime.ts";

export interface TaskRunPreparationOptions {
  approvals?: ApprovalRecord[];
  approvalAction?: ApprovalRequiredLocalDevAction;
  executionWindow?: ExecutionWindow;
  at?: Date;
}

export function prepareTaskRun(task: GovernedTask, options: TaskRunPreparationOptions = {}) {
  const executionBlockers = options.executionWindow
    ? explainExecutionWindowBlockers(task, options.executionWindow, options.at)
    : explainBlockedExecution(task);
  const approvalBlockers = options.approvalAction
    ? explainApprovalBoundaryBlockers(task, options.approvalAction, options.approvals ?? [])
    : [];
  const blockedReasons = [...executionBlockers, ...approvalBlockers];

  return {
    taskId: task.id,
    canExecute: options.executionWindow
      ? canExecuteWithinWindow(task, options.executionWindow, options.at) && approvalBlockers.length === 0
      : canExecuteTask(task) && approvalBlockers.length === 0,
    blockedReasons,
    contextPacket: buildContextPacket(task)
  };
}
