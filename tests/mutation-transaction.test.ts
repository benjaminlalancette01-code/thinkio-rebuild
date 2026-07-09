import test from "node:test";
import assert from "node:assert/strict";
import type { ArtifactRecord, CheckpointRecord, GovernedTask } from "../kernel/types.ts";
import {
  createMutationTransactionRecord,
  explainMutationTransactionBlockers,
  validateMutationTransaction
} from "../kernel/mutation-transaction.ts";

const task: GovernedTask = {
  id: "TASK-012",
  title: "Import governed mutation transaction model",
  mode: "plan",
  status: "candidate",
  authority: "candidate",
  dependencies: ["TASK-011"],
  allowedContext: ["kernel/gate.ts", "kernel/state-machine.ts"],
  blockedContext: ["archive/"],
  requiredEvidence: [
    "candidate-note-created",
    "mutation-transaction-schema-added",
    "mutation-transaction-test-pass"
  ],
  promotionRule: "all-required-evidence-present",
  checkpointRequired: true
};

const ledgerArtifact: ArtifactRecord = {
  id: "ART-TASK-012-KERNEL",
  taskId: "TASK-012",
  path: "kernel/mutation-transaction.ts",
  kind: "kernel",
  evidence: ["mutation-transaction-test-pass"],
  createdAt: "2026-06-28T00:00:00.000Z"
};

const checkpoint: CheckpointRecord = {
  id: "CHK-TASK-012-ACCEPTED",
  taskId: "TASK-012",
  status: "accepted",
  evidence: [
    "candidate-note-created",
    "mutation-transaction-schema-added",
    "mutation-transaction-test-pass"
  ],
  notes: "Mutation transaction planned.",
  createdAt: "2026-06-28T00:00:00.000Z"
};

test("mutation transactions plan gated status and authority changes with ledger and checkpoint effects", () => {
  const record = createMutationTransactionRecord({
    task,
    toStatus: "accepted",
    toAuthority: "accepted",
    evidence: checkpoint.evidence,
    ledgerArtifactIds: [ledgerArtifact.id],
    checkpointId: checkpoint.id,
    createdAt: "2026-06-28T00:00:00.000Z"
  });

  assert.equal(validateMutationTransaction(record, task, [ledgerArtifact], [checkpoint]), true);
  assert.deepEqual(record.rollbackStatus, "candidate");
  assert.deepEqual(record.rollbackAuthority, "candidate");
});

test("mutation transaction validation explains missing evidence and effects", () => {
  const record = createMutationTransactionRecord({
    task,
    toStatus: "frozen",
    toAuthority: "executable",
    evidence: ["candidate-note-created"],
    ledgerArtifactIds: ["ART-MISSING"],
    checkpointId: "CHK-MISSING",
    rollbackStatus: "idea",
    rollbackAuthority: "accepted",
    createdAt: "not-a-date"
  });

  assert.deepEqual(explainMutationTransactionBlockers(record, task, [], []), [
    "Task transition blocked: candidate -> frozen.",
    "Authority transition blocked: candidate -> executable.",
    "Target authority executable is not compatible with status frozen.",
    "Missing mutation evidence: mutation-transaction-schema-added.",
    "Missing mutation evidence: mutation-transaction-test-pass.",
    "Missing ledger artifact: ART-MISSING.",
    "Missing checkpoint: CHK-MISSING.",
    "Rollback status idea cannot reconstruct target status frozen.",
    "Rollback authority accepted cannot reconstruct target authority executable.",
    "Rollback authority accepted is not compatible with status idea.",
    "Mutation transaction createdAt must be a valid date."
  ]);
});
