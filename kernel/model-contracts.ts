import {
  MODEL_OUTPUT_CLASSES,
  type ModelInputContract,
  type ModelOutputClass,
  type ModelOutputContract,
  type ProviderIdentity
} from "./types.ts";

export function isModelOutputClass(value: string): value is ModelOutputClass {
  return MODEL_OUTPUT_CLASSES.includes(value as ModelOutputClass);
}

export function validateModelInputContract(contract: ModelInputContract): boolean {
  return explainModelInputContractBlockers(contract).length === 0;
}

export function explainModelInputContractBlockers(contract: ModelInputContract): string[] {
  const blockers: string[] = [];

  if (!contract.id) {
    blockers.push("Model input contract id is required.");
  }

  if (!contract.intent.trim()) {
    blockers.push(`Model input contract ${contract.id} requires intent.`);
  }

  if (!contract.activeTarget.id) {
    blockers.push(`Model input contract ${contract.id} requires an active target.`);
  }

  if (contract.contextBundle.length === 0) {
    blockers.push(`Model input contract ${contract.id} requires a context bundle.`);
  }

  if (contract.expectedOutputClasses.length === 0) {
    blockers.push(`Model input contract ${contract.id} requires expected output classes.`);
  }

  for (const outputClass of contract.expectedOutputClasses) {
    if (!isModelOutputClass(outputClass)) {
      blockers.push(`Model input contract ${contract.id} has unknown output class ${outputClass}.`);
    }
  }

  return blockers;
}

export function validateModelOutputContract(
  contract: ModelOutputContract,
  expectedInput?: ModelInputContract
): boolean {
  return explainModelOutputContractBlockers(contract, expectedInput).length === 0;
}

export function explainModelOutputContractBlockers(
  contract: ModelOutputContract,
  expectedInput?: ModelInputContract
): string[] {
  const blockers: string[] = [];

  if (!contract.id) {
    blockers.push("Model output contract id is required.");
  }

  if (!contract.inputId) {
    blockers.push(`Model output contract ${contract.id} requires input id.`);
  }

  if (expectedInput && contract.inputId !== expectedInput.id) {
    blockers.push(`Model output contract ${contract.id} does not match input ${expectedInput.id}.`);
  }

  if (!contract.rawOutput.trim()) {
    blockers.push(`Model output contract ${contract.id} requires raw output.`);
  }

  if (!contract.normalizedOutput.trim()) {
    blockers.push(`Model output contract ${contract.id} requires normalized output.`);
  }

  if (!isProviderIdentityComplete(contract.provider)) {
    blockers.push(`Model output contract ${contract.id} requires provider identity.`);
  }

  if (!isModelOutputClass(contract.outputClass)) {
    blockers.push(`Model output contract ${contract.id} has unknown output class ${contract.outputClass}.`);
  }

  if (expectedInput && !expectedInput.expectedOutputClasses.includes(contract.outputClass)) {
    blockers.push(
      `Model output contract ${contract.id} class ${contract.outputClass} was not expected by input ${expectedInput.id}.`
    );
  }

  return blockers;
}

function isProviderIdentityComplete(provider: ProviderIdentity): boolean {
  return Boolean(provider.provider) && Boolean(provider.model || provider.app);
}
