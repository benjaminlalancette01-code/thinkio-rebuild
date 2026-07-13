import { readdir } from "node:fs/promises";
import { validateBamlContractInventory } from "../kernel/baml-contract-inventory.ts";

const contractFiles = (await readdir("contracts/baml")).filter((file) => file.endsWith(".baml")).sort();
const rootContractFiles = (await readdir("contracts")).filter((file) => file.endsWith(".baml")).sort();
const blockers = validateBamlContractInventory({
  files: contractFiles,
  rootContractFiles,
  cliBoundary: {
    contractsDirectory: "contracts/baml",
    generatedClientAllowed: false,
    providerIntegrationReady: false,
    rationale: "ThinkIO keeps BAML as model-facing contract documentation until provider integration promotes generated clients."
  }
});

if (blockers.length > 0) {
  console.error(blockers.join("\n"));
  process.exit(1);
}

console.log("BAML contract inventory validation passed.");
