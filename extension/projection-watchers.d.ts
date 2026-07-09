export function registerProjectionRefreshWatchers(
  context: { subscriptions: unknown[] },
  vscode: Record<string, unknown>,
  runtimeBridge: { execute(command: string, payload?: Record<string, unknown>): Promise<Record<string, unknown>> },
  providers: Array<{ refresh?(source?: string): Promise<unknown> | unknown }>,
  options?: { debounceMs?: number; workspaceRoot?: unknown }
): unknown[];

export function watchedProjectionPatterns(): string[];
