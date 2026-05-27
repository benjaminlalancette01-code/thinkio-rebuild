export const allowedLocalDevActions = [
  "validate-json-task-files",
  "validate-transitions",
  "update-views",
  "build-context-packet",
  "run-tests",
  "write-checkpoint"
] as const;

export const blockedRuntimeActions = [
  "destructive-shell-commands",
  "external-api-calls",
  "plugin-marketplace-release",
  "autonomous-file-promotion-from-archive",
  "activation-of-old-runtime-files"
] as const;

export type AllowedLocalDevAction = (typeof allowedLocalDevActions)[number];

export function isAllowedLocalDevAction(action: string): action is AllowedLocalDevAction {
  return allowedLocalDevActions.includes(action as AllowedLocalDevAction);
}

