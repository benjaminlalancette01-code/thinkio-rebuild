const watchedPatterns = ["views/*.json", "tasks/*.json", "state/*.json"];

export function registerProjectionRefreshWatchers(context, vscode, runtimeBridge, providers, options = {}) {
  const debounceMs = options.debounceMs ?? 150;
  const workspaceRoot = options.workspaceRoot ?? vscode.workspace?.workspaceFolders?.[0]?.uri;
  const refreshTargets = providers.filter((provider) => typeof provider.refresh === "function");
  let timer;

  if (!workspaceRoot || !vscode.workspace?.createFileSystemWatcher) {
    return [];
  }

  const refresh = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await runtimeBridge.execute("plugin.refresh-view", { source: "file-watcher" });
      await Promise.all(refreshTargets.map((provider) => provider.refresh("file-watcher")));
    }, debounceMs);
  };

  const watchers = watchedPatterns.map((pattern) => {
    const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceRoot, pattern));
    watcher.onDidChange?.(refresh);
    watcher.onDidCreate?.(refresh);
    watcher.onDidDelete?.(refresh);
    context.subscriptions.push(watcher);
    return watcher;
  });

  return watchers;
}

export function watchedProjectionPatterns() {
  return [...watchedPatterns];
}
