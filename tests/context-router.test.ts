import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import type { GovernedTask } from "../kernel/types.ts";
import { createCheckpoint, validateCheckpoint } from "../kernel/checkpoint.ts";
import {
  buildContextPacket,
  buildModeAwareContextPacket,
  defaultSourceRulesForTask,
  inferAuthorityForPath
} from "../kernel/context-router.ts";

const task: GovernedTask = {
  id: "TASK-001",
  title: "Bootstrap the ThinkIO governed task kernel",
  mode: "build",
  status: "candidate",
  authority: "candidate",
  dependencies: [],
  allowedContext: [
    "docs/vision.md",
    "kernel/state-machine.ts",
    "thinkio-archive/old-runtime.ts"
  ],
  blockedContext: ["thinkio-archive/", "archive/"],
  requiredEvidence: ["schema-valid"],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

test("builds context packets without including archive material by default", () => {
  const packet = buildContextPacket(task);

  assert.deepEqual(packet.includedFiles, ["docs/vision.md", "kernel/state-machine.ts"]);
  assert.equal(packet.excludedFiles.includes("thinkio-archive/old-runtime.ts"), true);
});

test("builds mode-aware context packets with source authorities", () => {
  const planTask: GovernedTask = {
    ...task,
    id: "TASK-006",
    mode: "plan",
    allowedContext: ["contracts/build-context-packet.baml", "tests/context-router.test.ts", "kernel/context-router.ts"]
  };

  const packet = buildModeAwareContextPacket(planTask, defaultSourceRulesForTask(planTask));

  assert.deepEqual(packet.includedFiles, ["contracts/build-context-packet.baml", "kernel/context-router.ts"]);
  assert.equal(packet.sourceAuthorities?.["kernel/context-router.ts"], "accepted");
  assert.equal(inferAuthorityForPath("contracts/build-context-packet.baml"), "candidate");
});

test("TASK-001 JSON matches the minimal governed task shape", async () => {
  const raw = await readFile("tasks/TASK-001.bootstrap-kernel.json", "utf8");
  const parsed = JSON.parse(raw) as GovernedTask;

  assert.equal(parsed.id, "TASK-001");
  assert.equal(parsed.status, "done");
  assert.equal(parsed.mode, "build");
  assert.equal(parsed.promotionRule, "all-required-evidence-present");
  assert.deepEqual(parsed.requiredEvidence, [
    "schema-valid",
    "transition-test-pass",
    "ledger-entry-created"
  ]);
  assert.equal(parsed.allowedContext.includes("schemas/task.schema.cue"), true);
  assert.equal(parsed.blockedContext.includes("thinkio-archive/"), true);
});

test("creates and validates checkpoint records", () => {
  const checkpoint = createCheckpoint({
    task,
    evidence: ["schema-valid"],
    notes: "TASK-001 checkpoint created.",
    id: "CHK-TASK-001",
    createdAt: "2026-05-27T00:00:00.000Z"
  });

  assert.equal(validateCheckpoint(checkpoint, "TASK-001", "candidate"), true);
});
