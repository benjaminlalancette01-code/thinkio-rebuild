import { validateWorkspaceSchemas } from "./local-dev-runtime.ts";

const results = await validateWorkspaceSchemas();

console.log(JSON.stringify(results, null, 2));

if (results.some((result) => result.status !== "passed")) {
  process.exitCode = 1;
}

