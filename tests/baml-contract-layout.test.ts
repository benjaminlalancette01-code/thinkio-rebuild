import test from "node:test";
import assert from "node:assert/strict";
import { access, readdir } from "node:fs/promises";

const requiredBamlContracts = [
  "contracts/baml/build-context-packet.baml",
  "contracts/baml/classify-task.baml",
  "contracts/baml/classify-project-material.baml",
  "contracts/baml/classify-provider-output.baml",
  "contracts/baml/compose-task-proposal.baml",
  "contracts/baml/detect-drift.baml",
  "contracts/baml/propose-refactor-batch.baml",
  "contracts/baml/review-governance-decision.baml",
  "contracts/baml/review-evidence.baml",
  "contracts/baml/route-task-context.baml",
  "contracts/baml/summarize-human-review.baml",
  "contracts/baml/translate-reentry-responsibility.baml",
  "contracts/baml/verify-proof-package.baml"
];

test("BAML model contracts live under the nested contracts/baml boundary", async () => {
  for (const contract of requiredBamlContracts) {
    await access(contract);
  }

  const rootContracts = await readdir("contracts", { withFileTypes: true });
  const rootBamlFiles = rootContracts
    .filter((entry) => entry.isFile() && entry.name.endsWith(".baml"))
    .map((entry) => entry.name);

  assert.deepEqual(rootBamlFiles, []);
});
