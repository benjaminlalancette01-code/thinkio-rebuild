import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { GovernedTask } from "../kernel/types.ts";
import {
  runLocalTests,
  validateJsonTaskFiles,
  validateTaskTransitionStates
} from "../runtime/local-dev-runtime.ts";

const task: GovernedTask = {
  id: "TASK-RUNTIME",
  title: "Runtime entrypoint test",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: [],
  allowedContext: [],
  blockedContext: [],
  requiredEvidence: ["entrypoint-pass"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("local runtime validates JSON task files before CUE validation", async () => {
  const dir = await mkdtemp(join(tmpdir(), "thinkio-json-task-"));

  try {
    await writeFile(join(dir, "TASK-RUNTIME.json"), `${JSON.stringify(task, null, 2)}\n`, "utf8");
    await writeFile(join(dir, "TASK-BROKEN.json"), "{\"id\":", "utf8");

    const results = await validateJsonTaskFiles(dir);

    assert.deepEqual(results.map((result) => result.ok), [false, true]);
    assert.equal(results.find((result) => result.taskId === "TASK-RUNTIME")?.ok, true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("local runtime validates task status and authority compatibility", () => {
  assert.deepEqual(validateTaskTransitionStates([task]), [
    { taskId: "TASK-RUNTIME", ok: true, blockers: [] }
  ]);
  assert.deepEqual(validateTaskTransitionStates([{ ...task, authority: "executable" }]), [
    {
      taskId: "TASK-RUNTIME",
      ok: false,
      blockers: ["Task authority executable is not compatible with status candidate."]
    }
  ]);
});

test("local runtime exposes an injectable run-tests entrypoint", async () => {
  const result = await runLocalTests(async (command, args) => ({
    exitCode: 0,
    stdout: `${command} ${args.join(" ")}`,
    stderr: ""
  }));

  assert.deepEqual(result, {
    exitCode: 0,
    stdout: "npm test",
    stderr: ""
  });
});
