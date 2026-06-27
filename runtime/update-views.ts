import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { GovernedTask } from "../kernel/types.ts";
import {
  buildDashboardView,
  buildKanbanView,
  buildMindmapView,
  type DeferredSummaryItem,
  type ProjectGraph
} from "../kernel/view-projections.ts";

interface DeferredFile {
  items: DeferredSummaryItem[];
}

export async function updateViewFiles(): Promise<void> {
  const [tasks, graph, deferred] = await Promise.all([
    readTaskFiles(),
    readJsonFile<ProjectGraph>("state/project.graph.json"),
    readJsonFile<DeferredFile>("state/deferred.json")
  ]);

  await Promise.all([
    writeJsonFile("views/kanban.json", buildKanbanView(tasks)),
    writeJsonFile("views/mindmap.json", buildMindmapView(tasks, graph)),
    writeJsonFile("views/dashboard.json", buildDashboardView(tasks, deferred.items))
  ]);
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
  await updateViewFiles();
}

