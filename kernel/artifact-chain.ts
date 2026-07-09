import type { ArtifactChainManifest, ArtifactRecord } from "./types.ts";

export function createArtifactChainManifest(
  taskId: string,
  records: ArtifactRecord[],
  currentHashes: Record<string, string> = {},
  options: {
    id?: string;
    rootArtifactId?: string;
    createdAt?: string;
  } = {}
): ArtifactChainManifest {
  const taskRecords = records.filter((record) => record.taskId === taskId);
  const artifactIds = taskRecords.map((record) => record.id);

  return {
    id: options.id ?? `CHAIN-${taskId}`,
    taskId,
    rootArtifactId: options.rootArtifactId ?? artifactIds[0] ?? "",
    artifactIds,
    staleArtifactIds: findStaleArtifactIds(taskRecords, currentHashes),
    createdAt: options.createdAt ?? new Date().toISOString()
  };
}

export function findStaleArtifactIds(records: ArtifactRecord[], currentHashes: Record<string, string>): string[] {
  return records
    .filter((record) => record.hash && currentHashes[record.path] && record.hash !== currentHashes[record.path])
    .map((record) => record.id);
}

export function validateArtifactChain(records: ArtifactRecord[], manifest: ArtifactChainManifest): boolean {
  const byId = new Map(records.map((record) => [record.id, record]));
  const manifestIds = new Set(manifest.artifactIds);
  const manifestRecords = manifest.artifactIds.map((id) => byId.get(id));

  if (!manifest.rootArtifactId || !byId.has(manifest.rootArtifactId)) {
    return false;
  }

  if (!manifestIds.has(manifest.rootArtifactId)) {
    return false;
  }

  if (byId.get(manifest.rootArtifactId)?.taskId !== manifest.taskId) {
    return false;
  }

  if (manifest.artifactIds.some((id) => !byId.has(id))) {
    return false;
  }

  if (manifestRecords.some((record) => record?.taskId !== manifest.taskId)) {
    return false;
  }

  for (const record of manifestRecords) {
    if (!record) {
      return false;
    }

    for (const dependencyId of record.dependsOn ?? []) {
      if (!manifestIds.has(dependencyId) || !byId.has(dependencyId)) {
        return false;
      }
    }
  }

  return manifest.staleArtifactIds.every((id) => manifest.artifactIds.includes(id));
}
