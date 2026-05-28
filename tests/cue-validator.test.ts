import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  buildCueVetArgs,
  discoverTaskCueValidationTargets,
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

  assert.deepEqual(
    targets.map((item) => item.id),
    ["TASK-001", "TASK-002", "TASK-003", "TASK-004", "TASK-005", "TASK-006", "TASK-007", "TASK-008"]
  );
  assert.equal(targets.every((item) => item.schemaPath === "schemas/task.schema.cue"), true);
  assert.equal(targets.every((item) => item.definition === "#GovernedTask"), true);
});

test("validates discovered task schemas with the real CUE command", async (t) => {
  const results = await validateWorkspaceSchemas();

  if (results.some((result) => result.status === "skipped")) {
    t.skip("cue executable not available");
    return;
  }

  assert.equal(results.length, 8);
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
  assert.equal(pkg.scripts["validate:cue"], "node --experimental-strip-types runtime/validate-schemas.ts");
  assert.equal(pkg.scripts["validate:cue:soft"], "node --experimental-strip-types runtime/validate-schemas.ts --soft");
  assert.equal(pkg.scripts.check, "npm run validate:cue && npm test");
  assert.equal(pkg.engines.node, ">=22.0.0");
});
