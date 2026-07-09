import type { ModelOutputClass, ModelOutputContract, NormalizedProviderOutput, ProviderIdentity } from "./types.ts";

export interface ProviderRequest {
  inputId: string;
  prompt: string;
  expectedOutputClasses: ModelOutputClass[];
}

export interface ProviderResponse {
  raw: string;
  provider: ProviderIdentity;
  warnings?: string[];
  metadata?: Record<string, string>;
}

export interface ProviderAdapter {
  id: string;
  normalizeRequest(request: ProviderRequest): ProviderRequest;
  normalizeResponse(response: ProviderResponse): NormalizedProviderOutput;
}

export function normalizeProviderRequest(request: ProviderRequest): ProviderRequest {
  return {
    ...request,
    prompt: request.prompt.trim(),
    expectedOutputClasses: [...request.expectedOutputClasses]
  };
}

export function normalizeProviderResponse(response: ProviderResponse): NormalizedProviderOutput {
  const normalizedOutput = response.raw.trim();

  return {
    rawOutput: response.raw,
    normalizedOutput,
    outputClass: classifyProviderOutput(normalizedOutput),
    provider: { ...response.provider },
    warnings: [...(response.warnings ?? [])]
  };
}

export function classifyProviderOutput(output: string): ModelOutputClass {
  const lower = output.toLowerCase();

  if (!output.trim()) {
    return "unknown";
  }

  if (lower.includes("reject") || lower.includes("cannot comply")) {
    return "rejected";
  }

  if (lower.includes("conflict") || lower.includes("contradiction")) {
    return "conflict-signal";
  }

  if (lower.includes("file action") || lower.includes("patch") || lower.includes("write")) {
    return "file-action-proposal";
  }

  if (lower.includes("recommend") || lower.includes("should")) {
    return "recommendation";
  }

  if (lower.includes("hypothesis") || lower.includes("might")) {
    return "hypothesis";
  }

  return "informational";
}

export function createModelOutputFromProvider(
  id: string,
  inputId: string,
  output: NormalizedProviderOutput,
  proposedActions: string[] = []
): ModelOutputContract {
  return {
    id,
    inputId,
    rawOutput: output.rawOutput,
    normalizedOutput: output.normalizedOutput,
    outputClass: output.outputClass,
    provider: output.provider,
    warnings: [...output.warnings],
    proposedActions: [...proposedActions]
  };
}
