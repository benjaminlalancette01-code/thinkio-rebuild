export function activateThinkIO(context: Record<string, unknown>, vscode: Record<string, unknown>, options?: Record<string, unknown>): {
  runtimeBridge: unknown;
  workspaceState: unknown;
  stores: unknown;
  commands: unknown[];
  coreViews: unknown[];
  panels: unknown[];
  watchers: unknown[];
};

export function deactivate(): undefined;
