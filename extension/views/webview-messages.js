import { internalCommandIds } from "../contracts.js";
import { buildGovernanceResultViewModel } from "./governance-ui.js";

const allowedCommands = new Set(internalCommandIds);

export function validateWebviewMessage(message) {
  const blockers = [];

  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return { ok: false, blockers: ["Webview message must be an object."] };
  }

  if (typeof message.command !== "string") {
    blockers.push("Webview message requires a string command.");
  } else if (!allowedCommands.has(message.command)) {
    blockers.push(`Webview command is not allowed: ${message.command}.`);
  }

  if (message.requestId !== undefined && typeof message.requestId !== "string") {
    blockers.push("Webview message requestId must be a string when present.");
  }

  if (message.payload !== undefined && (!message.payload || typeof message.payload !== "object" || Array.isArray(message.payload))) {
    blockers.push("Webview message payload must be an object when present.");
  }

  return {
    ok: blockers.length === 0,
    command: message.command,
    requestId: message.requestId,
    payload: message.payload ?? {},
    blockers
  };
}

export async function handleWebviewMessage({ message, runtimeBridge, webview, beforeExecute }) {
  const parsed = validateWebviewMessage(message);

  if (!parsed.ok) {
    const acknowledgement = createWebviewAcknowledgement(parsed, {
      ok: false,
      status: "blocked",
      blockers: parsed.blockers
    });
    await webview.postMessage?.(acknowledgement);
    return acknowledgement;
  }

  await beforeExecute?.(parsed);
  const result = await runtimeBridge.execute(parsed.command, parsed.payload);
  const acknowledgement = createWebviewAcknowledgement(parsed, result);
  await webview.postMessage?.(acknowledgement);
  return acknowledgement;
}

export function createWebviewAcknowledgement(message, result) {
  return {
    type: "thinkio.commandResult",
    requestId: message.requestId,
    command: message.command,
    ok: Boolean(result.ok),
    status: result.status ?? (result.ok ? "ok" : "blocked"),
    blockers: result.blockers ?? [],
    governance: buildGovernanceResultViewModel(result),
    result
  };
}
