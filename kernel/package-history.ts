import type { PackageHistoryManifest } from "./types.ts";

export function explainPackageHistoryManifestBlockers(
  manifest: PackageHistoryManifest,
  currentHashes: Record<string, string>
): string[] {
  const blockers: string[] = [];
  const paths = new Set<string>();

  if (!manifest.id) {
    blockers.push("Package/history manifest id is required.");
  }

  if (!manifest.version) {
    blockers.push(`Package/history manifest ${manifest.id} requires a version.`);
  }

  if (!Boolean(Date.parse(manifest.createdAt))) {
    blockers.push(`Package/history manifest ${manifest.id} createdAt must be a valid date.`);
  }

  for (const entry of manifest.entries) {
    if (paths.has(entry.path)) {
      blockers.push(`Duplicate manifest entry: ${entry.path}.`);
    }
    paths.add(entry.path);

    if (entry.required && !(entry.path in currentHashes)) {
      blockers.push(`Missing required manifest entry: ${entry.path}.`);
      continue;
    }

    if (entry.path in currentHashes && currentHashes[entry.path] !== entry.hash) {
      blockers.push(`Manifest hash mismatch for ${entry.path}.`);
    }

    if (!entry.hash) {
      blockers.push(`Manifest entry ${entry.path} requires a hash.`);
    }
  }

  return blockers;
}

export function validatePackageHistoryManifest(
  manifest: PackageHistoryManifest,
  currentHashes: Record<string, string>
): boolean {
  return explainPackageHistoryManifestBlockers(manifest, currentHashes).length === 0;
}
