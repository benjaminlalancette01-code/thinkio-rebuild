import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import {
  buildCueVetArgs,
  defaultStateCueValidationTargets,
  discoverTaskCueValidationTargets,
  discoverWorkspaceCueValidationTargets,
  resolveCueCommand,
  summarizeCueValidationResults,
  validateCueTargets,
  type CueCommandRunner,
  type CueValidationTarget
} from "../runtime/cue-validator.ts";
import { validateWorkspaceSchemas } from "../runtime/local-dev-runtime.ts";

const target: CueValidationTarget = {
  id: "TASK-001",
  schemaPath: "schemas/task.schema.cue",
  dataPath: "tasks/TASK-001.bootstrap-kernel.json",
  definition: "#GovernedTask"
};

async function expectedTaskIds(): Promise<string[]> {
  const entries = await readdir("tasks", { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name.split(".")[0])
    .sort((a, b) => a.localeCompare(b));
}

test("builds cue vet arguments for a governed task target", () => {
  assert.deepEqual(buildCueVetArgs(target), [
    "vet",
    "tasks/TASK-001.bootstrap-kernel.json",
    "schemas/task.schema.cue",
    "-d",
    "#GovernedTask"
  ]);
});

test("uses CUE_BIN when it is explicitly provided", () => {
  const previous = process.env.CUE_BIN;
  process.env.CUE_BIN = "custom-cue";

  try {
    assert.equal(resolveCueCommand(), "custom-cue");
  } finally {
    if (previous === undefined) {
      delete process.env.CUE_BIN;
    } else {
      process.env.CUE_BIN = previous;
    }
  }
});

test("discovers all governed task JSON files as CUE validation targets", async () => {
  const targets = await discoverTaskCueValidationTargets();

  assert.deepEqual(targets.map((item) => item.id), await expectedTaskIds());
  assert.equal(targets.every((item) => item.schemaPath === "schemas/task.schema.cue"), true);
  assert.equal(targets.every((item) => item.definition === "#GovernedTask"), true);
});

test("discovers workspace CUE validation targets for tasks and state files", async () => {
  const targets = await discoverWorkspaceCueValidationTargets();
  const taskIds = await expectedTaskIds();

  assert.deepEqual(targets.map((item) => item.id), [
    ...taskIds,
    ...defaultStateCueValidationTargets.map((item) => item.id)
  ]);
  assert.equal(targets.some((item) => item.definition === "#ProjectGraph"), true);
  assert.equal(targets.some((item) => item.definition === "#ArtifactLedgerFile"), true);
});

test("validates discovered workspace schemas with the real CUE command", async (t) => {
  const results = await validateWorkspaceSchemas();

  if (results.some((result) => result.status === "skipped")) {
    t.skip("cue executable not available");
    return;
  }

  assert.equal(results.length, (await expectedTaskIds()).length + defaultStateCueValidationTargets.length);
  assert.deepEqual([...new Set(results.map((result) => result.status))], ["passed"]);
});

test("reports passing CUE validation from an injected runner", async () => {
  const runner: CueCommandRunner = async () => ({ exitCode: 0, stdout: "", stderr: "" });
  const [result] = await validateCueTargets([target], runner);

  assert.equal(result.status, "passed");
  assert.equal(result.command, "cue vet tasks/TASK-001.bootstrap-kernel.json schemas/task.schema.cue -d #GovernedTask");
});

test("reports failed CUE validation from an injected runner", async () => {
  const runner: CueCommandRunner = async () => ({
    exitCode: 1,
    stdout: "",
    stderr: "missing field"
  });
  const [result] = await validateCueTargets([target], runner);

  assert.equal(result.status, "failed");
  assert.equal(result.reason, "cue exited with code 1");
});

test("reports skipped CUE validation when the executable is missing", async () => {
  const runner: CueCommandRunner = async () => ({
    exitCode: null,
    stdout: "",
    stderr: "not found",
    missingExecutable: true
  });
  const [result] = await validateWorkspaceSchemas([target], runner);

  assert.equal(result.status, "skipped");
  assert.equal(result.reason, "cue executable not found");
});

test("strict validation mode fails when cue is missing", () => {
  const summary = summarizeCueValidationResults(
    [
      {
        id: "TASK-001",
        command: "cue vet tasks/TASK-001.bootstrap-kernel.json schemas/task.schema.cue -d #GovernedTask",
        status: "skipped",
        stdout: "",
        stderr: "not found",
        reason: "cue executable not found"
      }
    ],
    "strict"
  );

  assert.equal(summary.ok, false);
  assert.equal(summary.exitCode, 1);
  assert.deepEqual(summary.warnings, []);
  assert.deepEqual(summary.failures, ["TASK-001: cue executable not found"]);
});

test("soft validation mode allows missing cue but not failed validation", () => {
  const skippedSummary = summarizeCueValidationResults(
    [
      {
        id: "TASK-001",
        command: "cue vet tasks/TASK-001.bootstrap-kernel.json schemas/task.schema.cue -d #GovernedTask",
        status: "skipped",
        stdout: "",
        stderr: "not found",
        reason: "cue executable not found"
      }
    ],
    "soft"
  );

  assert.equal(skippedSummary.ok, true);
  assert.equal(skippedSummary.exitCode, 0);
  assert.deepEqual(skippedSummary.warnings, ["TASK-001: cue executable not found"]);

  const failedSummary = summarizeCueValidationResults(
    [
      {
        id: "TASK-001",
        command: "cue vet tasks/TASK-001.bootstrap-kernel.json schemas/task.schema.cue -d #GovernedTask",
        status: "failed",
        stdout: "",
        stderr: "missing field",
        reason: "cue exited with code 1"
      }
    ],
    "soft"
  );

  assert.equal(failedSummary.ok, false);
  assert.equal(failedSummary.exitCode, 1);
});

test("package scripts use Node 22 TypeScript stripping and deterministic validation", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8")) as {
    scripts: Record<string, string>;
    engines: { node: string };
  };

  assert.equal(pkg.scripts.test, "node --experimental-strip-types --test tests/*.test.ts");
  assert.equal(pkg.scripts["check:node"], "node scripts/check-node-version.mjs");
  assert.equal(pkg.scripts.typecheck, "tsc --noEmit");
  assert.equal(pkg.scripts["validate:cue"], "node --experimental-strip-types runtime/validate-schemas.ts");
  assert.equal(pkg.scripts["validate:cue:soft"], "node --experimental-strip-types runtime/validate-schemas.ts --soft");
  assert.equal(pkg.scripts["validate:task-order"], "node --experimental-strip-types scripts/validate-task-intake-order.ts");
  assert.equal(pkg.scripts["validate:docs"], "node --experimental-strip-types scripts/validate-docs.ts");
  assert.equal(pkg.scripts["update:project-materials"], "node --experimental-strip-types runtime/update-project-materials.ts");
  assert.equal(pkg.scripts["validate:extension"], "node scripts/validate-vscode-extension-package.mjs");
  assert.equal(pkg.scripts["validate:vsix"], "node scripts/validate-local-vsix-package.mjs");
  assert.equal(pkg.scripts["package:extension"], "npm run validate:extension && npm run validate:vsix && node scripts/package-local-vsix.mjs");
  assert.equal(pkg.scripts.check, "npm run check:node && npm run typecheck && npm run validate:cue && npm run validate:task-order && npm run validate:docs && npm run validate:extension && npm test");
  assert.equal(pkg.engines.node, ">=22.0.0");
});
