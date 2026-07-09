import { registerThinkIOCommands } from "./commands.js";
import { createRuntimeBridge } from "./runtime-bridge.js";
import { registerCoreViewProviders } from "./views/core-view-providers.js";
import { registerComposerAndProposalProviders } from "./views/composer-proposal-providers.js";
import { registerProjectionRefreshWatchers } from "./projection-watchers.js";
import { createWorkspaceStateStore } from "./state/workspace-state.js";
import { createInteractionStores } from "./interaction/stores.js";

export async function activate(context) {
  const vscode = await import("vscode");
  return activateThinkIO(context, vscode);
}

export function activateThinkIO(context, vscode, options = {}) {
  const workspaceRoot = options.workspaceRoot ?? vscode.workspace?.workspaceFolders?.[0]?.uri?.fsPath ?? process.cwd();
  const runtimeBridge = options.runtimeBridge ?? createRuntimeBridge(workspaceRoot);
  const workspaceState = createWorkspaceStateStore(context.workspaceState);
  const stores = createInteractionStores(context.workspaceState);

  const commands = registerThinkIOCommands(context, vscode, runtimeBridge);
  const coreViews = registerCoreViewProviders(context, vscode, runtimeBridge);
  const panels = registerComposerAndProposalProviders(context, vscode, runtimeBridge, stores);
  const watchers = registerProjectionRefreshWatchers(context, vscode, runtimeBridge, [...coreViews, ...panels], {
    workspaceRoot: vscode.workspace?.workspaceFolders?.[0]?.uri
  });

  return {
    runtimeBridge,
    workspaceState,
    stores,
    commands,
    coreViews,
    panels,
    watchers
  };
}

export function deactivate() {
  return undefined;
}
