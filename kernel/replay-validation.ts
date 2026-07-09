import { validateArtifactChain } from "./artifact-chain.ts";
import type {
  ArtifactChainManifest,
  ArtifactRecord,
  CheckpointRecord,
  ReplayValidationManifest
} from "./types.ts";

interface ProjectGraphLike {
  nodes: Array<{ id: string }>;
}

interface ReplayValidationInput {
  availableStateFiles: string[];
  checkpoints: CheckpointRecord[];
  ledgerEntries: ArtifactRecord[];
  artifactChains: ArtifactChainManifest[];
  projectGraph: ProjectGraphLike;
}

interface ReplayManifestInput {
  taskIds: string[];
  requiredStateFiles: string[];
  checkpointIds: string[];
  acceptedArtifactIds: string[];
  artifactChainIds: string[];
  projectGraphNodeIds?: string[];
  id?: string;
  createdAt?: string;
}

export function createReplayValidationManifest(input: ReplayManifestInput): ReplayValidationManifest {
  return {
    id: input.id ?? `REPLAY-${input.taskIds.join("-")}`,
    taskIds: [...input.taskIds],
    requiredStateFiles: [...input.requiredStateFiles],
    checkpointIds: [...input.checkpointIds],
    acceptedArtifactIds: [...input.acceptedArtifactIds],
    artifactChainIds: [...input.artifactChainIds],
    projectGraphNodeIds: [...(input.projectGraphNodeIds ?? input.taskIds)],
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export function validateReplayReadiness(
  manifest: ReplayValidationManifest,
  input: ReplayValidationInput
): boolean {
  return explainReplayReadinessBlockers(manifest, input).length === 0;
}

export function explainReplayReadinessBlockers(
  manifest: ReplayValidationManifest,
  input: ReplayValidationInput
): string[] {
  const reasons: string[] = [];
  const availableStateFiles = new Set(input.availableStateFiles);
  const checkpointsById = new Map(input.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
  const artifactsById = new Map(input.ledgerEntries.map((artifact) => [artifact.id, artifact]));
  const artifactChainsById = new Map(input.artifactChains.map((chain) => [chain.id, chain]));
  const graphNodeIds = new Set(input.projectGraph.nodes.map((node) => node.id));

  if (!manifest.id || !manifest.id.startsWith("REPLAY-")) {
    reasons.push("Replay validation manifest id must start with REPLAY-.");
  }

  if (manifest.taskIds.length === 0) {
    reasons.push("Replay validation manifest must name at least one task.");
  }

  if (!Date.parse(manifest.createdAt)) {
    reasons.push("Replay validation manifest createdAt must be a valid date.");
  }

  for (const stateFile of manifest.requiredStateFiles) {
    if (!availableStateFiles.has(stateFile)) {
      reasons.push(`Missing required state file: ${stateFile}.`);
    }
  }

  for (const checkpointId of manifest.checkpointIds) {
    const checkpoint = checkpointsById.get(checkpointId);

    if (!checkpoint) {
      reasons.push(`Missing checkpoint: ${checkpointId}.`);
      continue;
    }

    if (checkpoint.status !== "done") {
      reasons.push(`Checkpoint ${checkpointId} is not done.`);
    }

    if (!manifest.taskIds.includes(checkpoint.taskId)) {
      reasons.push(`Checkpoint ${checkpointId} belongs to unlisted task ${checkpoint.taskId}.`);
    }
  }

  for (const artifactId of manifest.acceptedArtifactIds) {
    if (!artifactsById.has(artifactId)) {
      reasons.push(`Missing accepted artifact: ${artifactId}.`);
    }
  }

  for (const chainId of manifest.artifactChainIds) {
    const chain = artifactChainsById.get(chainId);

    if (!chain) {
      reasons.push(`Missing artifact chain: ${chainId}.`);
      continue;
    }

    if (!manifest.taskIds.includes(chain.taskId)) {
      reasons.push(`Artifact chain ${chainId} belongs to unlisted task ${chain.taskId}.`);
    }

    if (!validateArtifactChain(input.ledgerEntries, chain)) {
      reasons.push(`Artifact chain ${chainId} does not match the ledger.`);
    }

    if (chain.staleArtifactIds.length > 0) {
      reasons.push(`Artifact chain ${chainId} has stale artifacts: ${chain.staleArtifactIds.join(", ")}.`);
    }
  }

  for (const nodeId of manifest.projectGraphNodeIds) {
    if (!graphNodeIds.has(nodeId)) {
      reasons.push(`Missing project graph node: ${nodeId}.`);
    }
  }

  return reasons;
}
