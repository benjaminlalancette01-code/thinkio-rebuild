import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { addLedgerEntry, createArtifactRecord, findArtifactById } from "../kernel/ledger.ts";

test("creates and finds artifact ledger entries", async () => {
  const dir = await mkdtemp(join(tmpdir(), "thinkio-ledger-"));
  const ledgerPath = join(dir, "ledger.json");

  try {
    const record = createArtifactRecord({
      id: "ART-TASK-001",
      taskId: "TASK-001",
      path: "kernel/state-machine.ts",
      kind: "kernel",
      evidence: ["ledger-entry-created"],
      createdAt: "2026-05-27T00:00:00.000Z"
    });

    await addLedgerEntry(record, ledgerPath);
    const found = await findArtifactById("ART-TASK-001", ledgerPath);

    assert.deepEqual(found, record);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

