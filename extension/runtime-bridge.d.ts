export function createRuntimeBridge(workspaceRoot?: string): {
  execute(internalCommandId: string, payload?: Record<string, unknown>): Promise<Record<string, unknown>>;
  readProjection(viewKind: string): Promise<Record<string, unknown>>;
};

export function executePluginCommand(
  internalCommandId: string,
  payload?: Record<string, unknown>,
  workspaceRoot?: string
): Promise<Record<string, unknown>>;

export function readProjection(workspaceRoot: string, viewKind: string): Promise<Record<string, unknown>>;
