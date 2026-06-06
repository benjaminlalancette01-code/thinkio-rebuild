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

  if (!manifest.rootArtifactId || !byId.has(manifest.rootArtifactId)) {
    return false;
  }

  if (manifest.artifactIds.some((id) => !byId.has(id))) {
    return false;
  }

  for (const record of records) {
    for (const dependencyId of record.dependsOn ?? []) {
      if (!byId.has(dependencyId)) {
        return false;
      }
    }
  }

  return manifest.staleArtifactIds.every((id) => manifest.artifactIds.includes(id));
}
