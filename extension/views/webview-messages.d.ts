export interface WebviewMessageValidation {
  ok: boolean;
  command?: string;
  requestId?: string;
  payload?: Record<string, unknown>;
  blockers: string[];
}

export function validateWebviewMessage(message: unknown): WebviewMessageValidation;
export function createWebviewAcknowledgement(message: WebviewMessageValidation, result: Record<string, unknown>): {
  type: string;
  requestId?: string;
  command?: string;
  ok: boolean;
  status: unknown;
  blockers: unknown[];
  governance: Record<string, unknown>;
  result: Record<string, unknown>;
};
export function handleWebviewMessage(input: {
  message: unknown;
  runtimeBridge: { execute(command: string, payload?: Record<string, unknown>): Promise<Record<string, unknown>> };
  webview: { postMessage?(message: Record<string, unknown>): Promise<boolean> | boolean };
  beforeExecute?(message: WebviewMessageValidation): Promise<void> | void;
}): Promise<Record<string, unknown>>;
