import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import type { GovernedTask } from "../kernel/types.ts";
import {
  buildProjectKnowledgeIndex,
  buildProjectMaterialInventory,
  buildProjectStateReportModel,
  renderProjectStateReportMarkdown
} from "../kernel/project-materials.ts";

const materialRoots = [".devtool/features", "audit", "docs", "imports", "state", "tasks", "views"];
const ignoredDirectories = new Set(["done"]);

export async function updateProjectMaterials(options: { generatedAt?: string } = {}): Promise<void> {
  const [paths, tasks] = await Promise.all([readMaterialPaths(), readTaskFiles()]);
  const records = buildProjectMaterialInventory(paths);
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const reportModel = buildProjectStateReportModel({
    records,
    tasks,
    generatedAt,
    currentReportPath: "docs/project-state-report.md"
  });
  const knowledgeIndex = buildProjectKnowledgeIndex(records, generatedAt);

  await Promise.all([
    writeJsonFile("state/project.materials.json", {
      generatedAt,
      records,
      summary: reportModel.materialSummary
    }),
    writeJsonFile("state/project.knowledge-index.json", knowledgeIndex),
    writeFile("docs/project-state-report.md", renderProjectStateReportMarkdown(reportModel), "utf8")
  ]);
}

async function readMaterialPaths(): Promise<string[]> {
  const paths: string[] = [];
  for (const root of materialRoots) {
    paths.push(...(await walk(root)));
  }
  return paths.sort((a, b) => a.localeCompare(b));
}

async function walk(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const paths: string[] = [];

  for (const entry of entries) {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name) && root === ".devtool/features") continue;
      paths.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && /\.(json|md)$/.test(entry.name)) {
      paths.push(relative(process.cwd(), fullPath).replaceAll("\\", "/"));
    }
  }

  return paths;
}

async function readTaskFiles(tasksDir = "tasks"): Promise<GovernedTask[]> {
  const entries = await readdir(tasksDir, { withFileTypes: true });
  const taskFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(tasksDir, entry.name));

  const tasks = await Promise.all(taskFiles.map((file) => readJsonFile<GovernedTask>(file)));
  return tasks.sort((a, b) => a.id.localeCompare(b.id));
}

async function readJsonFile<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function writeJsonFile(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll("\\", "/")}`) {
  await updateProjectMaterials();
}
