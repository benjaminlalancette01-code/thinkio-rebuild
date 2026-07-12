import { access, readFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";

interface DocumentationManifest {
  currentEntrypoints: string[];
  generatedReports: string[];
  historicalEvidence: string[];
  requiredLocalLinks: Array<{ from: string; to: string }>;
}

const manifest = JSON.parse(await readFile("docs/documentation-manifest.json", "utf8")) as DocumentationManifest;
const blockers: string[] = [];

for (const path of [
  ...manifest.currentEntrypoints,
  ...manifest.generatedReports,
  ...manifest.historicalEvidence
]) {
  await requirePath(path, `Manifest path is missing: ${path}`);
}

for (const link of manifest.requiredLocalLinks) {
  await requirePath(link.from, `Manifest link source is missing: ${link.from}`);
  await requirePath(link.to, `Manifest link target is missing: ${link.to}`);
}

for (const path of [...manifest.currentEntrypoints, ...manifest.generatedReports]) {
  await validateMarkdownLinks(path);
}

if (blockers.length > 0) {
  console.error("Documentation validation failed:");
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exit(1);
}

console.log("Documentation manifest and local links validation passed.");

async function validateMarkdownLinks(path: string): Promise<void> {
  const raw = await readFile(path, "utf8");
  const matches = raw.matchAll(/\[[^\]]+\]\(([^)]+)\)/g);

  for (const match of matches) {
    const target = match[1].split("#")[0];
    if (!target || /^(https?:|mailto:|#)/.test(target)) continue;
    const resolved = normalize(join(dirname(path), target));
    await requirePath(resolved, `Markdown link target missing from ${path}: ${target}`);
  }
}

async function requirePath(path: string, blocker: string): Promise<void> {
  try {
    await access(path);
  } catch {
    blockers.push(blocker);
  }
}
