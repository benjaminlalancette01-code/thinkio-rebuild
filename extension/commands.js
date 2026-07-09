import { commandIdMap } from "./contracts.js";

export function registerThinkIOCommands(context, vscode, runtimeBridge) {
  const disposables = Object.entries(commandIdMap).map(([internalCommandId, vscodeCommandId]) =>
    vscode.commands.registerCommand(vscodeCommandId, async (payload = {}) => {
      const result = await runtimeBridge.execute(internalCommandId, payload);
      surfaceCommandResult(vscode, result);
      return result;
    })
  );

  context.subscriptions.push(...disposables);
  return disposables;
}

export function surfaceCommandResult(vscode, result) {
  if (!vscode?.window) return;

  if (result.ok) {
    if (result.status === "proposal-created") {
      vscode.window.showInformationMessage(`ThinkIO proposal created for ${result.commandId}.`);
    }
    return;
  }

  const message = result.blockers?.join(" ") || `ThinkIO command blocked: ${result.commandId}.`;
  if (result.status === "approval-required") {
    vscode.window.showWarningMessage(message);
  } else {
    vscode.window.showErrorMessage(message);
  }
}
