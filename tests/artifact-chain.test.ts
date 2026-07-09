import test from "node:test";
import assert from "node:assert/strict";
import type { ArtifactRecord } from "../kernel/types.ts";
import {
  createArtifactChainManifest,
  findStaleArtifactIds,
  validateArtifactChain
} from "../kernel/artifact-chain.ts";

const records: ArtifactRecord[] = [
  {
    id: "ART-TASK-005-SCHEMA",
    taskId: "TASK-005",
    path: "schemas/artifact.schema.cue",
    kind: "schema",
    evidence: ["artifact-chain-schema-added"],
    createdAt: "2026-06-06T00:00:00.000Z",
    hash: "hash-a"
  },
  {
    id: "ART-TASK-005-TEST",
    taskId: "TASK-005",
    path: "tests/artifact-chain.test.ts",
    kind: "test",
    evidence: ["artifact-chain-test-pass"],
    createdAt: "2026-06-06T00:00:00.000Z",
    hash: "hash-b",
    dependsOn: ["ART-TASK-005-SCHEMA"]
  }
];

test("artifact chain manifests surface stale artifacts and dependency breaks", () => {
  assert.deepEqual(findStaleArtifactIds(records, { "tests/artifact-chain.test.ts": "new-hash" }), [
    "ART-TASK-005-TEST"
  ]);

  const manifest = createArtifactChainManifest("TASK-005", records, {
    "tests/artifact-chain.test.ts": "new-hash"
  }, {
    id: "CHAIN-TASK-005",
    createdAt: "2026-06-06T00:00:00.000Z"
  });

  assert.equal(validateArtifactChain(records, manifest), true);
  assert.equal(validateArtifactChain(records.slice(1), manifest), false);
});

test("artifact chain validation enforces task scope and manifest membership", () => {
  const manifest = createArtifactChainManifest("TASK-005", records, {}, {
    id: "CHAIN-TASK-005",
    createdAt: "2026-06-06T00:00:00.000Z"
  });
  const crossTaskRecord: ArtifactRecord = {
    id: "ART-TASK-999-FOREIGN",
    taskId: "TASK-999",
    path: "kernel/foreign.ts",
    kind: "kernel",
    evidence: ["foreign-artifact"],
    createdAt: "2026-06-30T00:00:00.000Z"
  };

  assert.equal(
    validateArtifactChain([...records, crossTaskRecord], {
      ...manifest,
      artifactIds: [...manifest.artifactIds, crossTaskRecord.id]
    }),
    false
  );

  assert.equal(
    validateArtifactChain(records, {
      ...manifest,
      rootArtifactId: "ART-TASK-005-SCHEMA",
      artifactIds: ["ART-TASK-005-TEST"]
    }),
    false
  );
});

test("artifact chain dependencies must stay inside the manifest scope", () => {
  const scopedRecords: ArtifactRecord[] = [
    ...records,
    {
      id: "ART-TASK-005-EXTRA",
      taskId: "TASK-005",
      path: "docs/extra.md",
      kind: "document",
      evidence: ["extra"],
      createdAt: "2026-06-30T00:00:00.000Z"
    }
  ];
  const manifest = {
    id: "CHAIN-TASK-005",
    taskId: "TASK-005",
    rootArtifactId: "ART-TASK-005-TEST",
    artifactIds: ["ART-TASK-005-TEST"],
    staleArtifactIds: [],
    createdAt: "2026-06-30T00:00:00.000Z"
  };

  assert.equal(validateArtifactChain(scopedRecords, manifest), false);
});
