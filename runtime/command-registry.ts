export const allowedLocalDevActions = [
  "validate-json-task-files",
  "validate-cue-schemas",
  "validate-transitions",
  "apply-mutation-transaction",
  "plan-mutation-transaction",
  "update-views",
  "build-context-packet",
  "build-runtime-readiness-proof",
  "resolve-next-action",
  "validate-project-identity",
  "evaluate-governance-decision",
  "evaluate-explainable-gate-result",
  "validate-capability-registry",
  "validate-cross-layer-consistency",
  "reconcile-worktree-to-task",
  "validate-historical-translation",
  "lint-semantic-names",
  "validate-export-readiness",
  "validate-baml-contract-inventory",
  "validate-isolated-vsix-install",
  "collect-validation-blockers",
  "evaluate-file-action-proposal",
  "build-native-board-projection",
  "build-runtime-mindmap-projection",
  "validate-work-package",
  "validate-provider-output-ingest",
  "validate-interaction-surface",
  "run-tests",
  "write-checkpoint"
] as const;

export const implementedLocalDevActions = [
  "validate-json-task-files",
  "validate-cue-schemas",
  "validate-transitions",
  "apply-mutation-transaction",
  "plan-mutation-transaction",
  "update-views",
  "build-context-packet",
  "build-runtime-readiness-proof",
  "resolve-next-action",
  "validate-project-identity",
  "evaluate-governance-decision",
  "evaluate-explainable-gate-result",
  "validate-capability-registry",
  "validate-cross-layer-consistency",
  "reconcile-worktree-to-task",
  "validate-historical-translation",
  "lint-semantic-names",
  "validate-export-readiness",
  "validate-baml-contract-inventory",
  "validate-isolated-vsix-install",
  "collect-validation-blockers",
  "evaluate-file-action-proposal",
  "build-native-board-projection",
  "build-runtime-mindmap-projection",
  "validate-work-package",
  "validate-provider-output-ingest",
  "validate-interaction-surface",
  "run-tests",
  "write-checkpoint"
] as const satisfies readonly AllowedLocalDevAction[];

export const reservedLocalDevActions = [] as const satisfies readonly AllowedLocalDevAction[];

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

export function isImplementedLocalDevAction(action: string): action is (typeof implementedLocalDevActions)[number] {
  return implementedLocalDevActions.includes(action as (typeof implementedLocalDevActions)[number]);
}

export function isReservedLocalDevAction(action: string): action is (typeof reservedLocalDevActions)[number] {
  return reservedLocalDevActions.includes(action as (typeof reservedLocalDevActions)[number]);
}
