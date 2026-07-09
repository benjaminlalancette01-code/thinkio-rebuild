import test from "node:test";
import assert from "node:assert/strict";
import type { ArtifactChainManifest, ArtifactRecord, CheckpointRecord } from "../kernel/types.ts";
import {
  createReplayValidationManifest,
  explainReplayReadinessBlockers,
  validateReplayReadiness
} from "../kernel/replay-validation.ts";

const ledgerEntries: ArtifactRecord[] = [
  {
    id: "ART-TASK-005-KERNEL",
    taskId: "TASK-005",
    path: "kernel/artifact-chain.ts",
    kind: "kernel",
    evidence: ["artifact-chain-schema-added"],
    createdAt: "2026-06-06T00:00:00.000Z"
  },
  {
    id: "ART-TASK-005-SCHEMA",
    taskId: "TASK-005",
    path: "schemas/artifact.schema.cue",
    kind: "schema",
    evidence: ["artifact-chain-schema-added"],
    createdAt: "2026-06-06T00:00:00.000Z",
    dependsOn: ["ART-TASK-005-KERNEL"]
  },
  {
    id: "ART-TASK-005-TEST",
    taskId: "TASK-005",
    path: "tests/artifact-chain.test.ts",
    kind: "test",
    evidence: ["artifact-chain-test-pass"],
    createdAt: "2026-06-06T00:00:00.000Z",
    dependsOn: ["ART-TASK-005-SCHEMA"]
  }
];

const checkpoint: CheckpointRecord = {
  id: "CHK-TASK-005",
  taskId: "TASK-005",
  status: "done",
  evidence: ["artifact-chain-test-pass"],
  notes: "Artifact chain checkpoint.",
  createdAt: "2026-06-06T00:00:00.000Z"
};

const artifactChain: ArtifactChainManifest = {
  id: "CHAIN-TASK-005",
  taskId: "TASK-005",
  rootArtifactId: "ART-TASK-005-KERNEL",
  artifactIds: ["ART-TASK-005-KERNEL", "ART-TASK-005-SCHEMA", "ART-TASK-005-TEST"],
  staleArtifactIds: [],
  createdAt: "2026-06-06T00:00:00.000Z"
};

const manifest = createReplayValidationManifest({
  id: "REPLAY-TASK-005",
  taskIds: ["TASK-005"],
  requiredStateFiles: [
    "state/checkpoints.json",
    "state/ledger.json",
    "state/artifact-chains.json",
    "state/project.graph.json"
  ],
  checkpointIds: ["CHK-TASK-005"],
  acceptedArtifactIds: ["ART-TASK-005-KERNEL", "ART-TASK-005-SCHEMA", "ART-TASK-005-TEST"],
  artifactChainIds: ["CHAIN-TASK-005"],
  createdAt: "2026-06-28T00:00:00.000Z"
});

test("replay validation confirms accepted state can be reconstructed from records", () => {
  assert.equal(
    validateReplayReadiness(manifest, {
      availableStateFiles: manifest.requiredStateFiles,
      checkpoints: [checkpoint],
      ledgerEntries,
      artifactChains: [artifactChain],
      projectGraph: { nodes: [{ id: "TASK-005" }] }
    }),
    true
  );
});

test("replay validation explains missing state, artifacts, chains, and graph nodes", () => {
  assert.deepEqual(
    explainReplayReadinessBlockers(manifest, {
      availableStateFiles: ["state/checkpoints.json"],
      checkpoints: [{ ...checkpoint, status: "candidate" }],
      ledgerEntries: ledgerEntries.slice(0, 2),
      artifactChains: [{ ...artifactChain, staleArtifactIds: ["ART-TASK-005-TEST"] }],
      projectGraph: { nodes: [] }
    }),
    [
      "Missing required state file: state/ledger.json.",
      "Missing required state file: state/artifact-chains.json.",
      "Missing required state file: state/project.graph.json.",
      "Checkpoint CHK-TASK-005 is not done.",
      "Missing accepted artifact: ART-TASK-005-TEST.",
      "Artifact chain CHAIN-TASK-005 does not match the ledger.",
      "Artifact chain CHAIN-TASK-005 has stale artifacts: ART-TASK-005-TEST.",
      "Missing project graph node: TASK-005."
    ]
  );
});
