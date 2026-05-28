import { validateWorkspaceSchemas } from "./local-dev-runtime.ts";
import { summarizeCueValidationResults, type CueValidationMode } from "./cue-validator.ts";

const results = await validateWorkspaceSchemas();
const mode: CueValidationMode = process.argv.includes("--soft") ? "soft" : "strict";
const summary = summarizeCueValidationResults(results, mode);

console.log(JSON.stringify(results, null, 2));

for (const warning of summary.warnings) {
  console.warn(`WARNING: ${warning}`);
}

for (const failure of summary.failures) {
  console.error(`ERROR: ${failure}`);
}

process.exitCode = summary.exitCode;
