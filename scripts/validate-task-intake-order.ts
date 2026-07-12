import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

export interface TaskIntakeTask {
  id: string;
  title: string;
  status: string;
  authority: string;
}

export interface TaskIntakeCard {
  file: string;
  id: string;
  status: string;
  priority: string;
  order: string;
}

const openStatuses = new Set(["candidate", "idea"]);
const allowedPriorities = new Set(["high", "medium", "low"]);

export function validateTaskIntakeOrder(tasks: TaskIntakeTask[], cards: TaskIntakeCard[]): string[] {
  const blockers: string[] = [];
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const cardById = new Map(cards.map((card) => [card.id, card]));
  const openTaskIds = new Set(tasks.filter((task) => openStatuses.has(task.status)).map((task) => task.id));
  const openCards = cards.filter((card) => openTaskIds.has(card.id));

  for (const task of tasks.filter((candidate) => openTaskIds.has(candidate.id))) {
    const card = cardById.get(task.id);
    if (!card) {
      blockers.push(`Open task ${task.id} is missing a visual feature card.`);
      continue;
    }
    if (card.status !== task.status) {
      blockers.push(`Feature card ${task.id} status ${card.status} does not match task status ${task.status}.`);
    }
  }

  for (const card of openCards) {
    const task = taskById.get(card.id);
    if (!task) {
      blockers.push(`Feature card ${card.id} has no canonical task JSON.`);
      continue;
    }
    if (!openStatuses.has(task.status)) {
      blockers.push(`Feature card ${card.id} mirrors non-open task status ${task.status}; move it to done or archive.`);
    }
    if (!allowedPriorities.has(card.priority)) {
      blockers.push(`Feature card ${card.id} has unsupported priority ${card.priority}.`);
    }
  }

  blockers.push(...validateOrderedGroup("candidate", "c", openCards.filter((card) => card.status === "candidate")));
  blockers.push(...validateOrderedGroup("idea", "i", openCards.filter((card) => card.status === "idea")));

  return blockers;
}

async function main(): Promise<void> {
  const tasks = await readTasks("tasks");
  const cards = await readFeatureCards(".devtool/features");
  const blockers = validateTaskIntakeOrder(tasks, cards);

  if (blockers.length > 0) {
    console.error("Task intake order validation failed:");
    for (const blocker of blockers) console.error(`- ${blocker}`);
    process.exit(1);
  }
}

async function readTasks(tasksDir: string): Promise<TaskIntakeTask[]> {
  const entries = await readdir(tasksDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /^TASK-\d+.*\.json$/.test(entry.name))
    .map((entry) => join(tasksDir, entry.name));

  const tasks = await Promise.all(files.map(async (file) => JSON.parse(await readFile(file, "utf8")) as TaskIntakeTask));
  return tasks.sort((a, b) => a.id.localeCompare(b.id));
}

async function readFeatureCards(featuresDir: string): Promise<TaskIntakeCard[]> {
  const entries = await readdir(featuresDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /^TASK-\d+.*\.md$/.test(entry.name))
    .map((entry) => join(featuresDir, entry.name));

  const cards = await Promise.all(files.map(readFeatureCard));
  return cards.sort((a, b) => a.id.localeCompare(b.id));
}

async function readFeatureCard(file: string): Promise<TaskIntakeCard> {
  const raw = await readFile(file, "utf8");
  const frontmatter = raw.split("---")[1] ?? "";
  const fields = Object.fromEntries(
    frontmatter
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => [match[1], stripQuotes(match[2])])
  );

  return {
    file,
    id: fields.id,
    status: fields.status,
    priority: fields.priority,
    order: fields.order
  };
}

function validateOrderedGroup(name: string, prefix: string, cards: TaskIntakeCard[]): string[] {
  const blockers: string[] = [];
  const orders = new Set<string>();
  const sorted = [...cards].sort((a, b) => a.order.localeCompare(b.order));

  sorted.forEach((card, index) => {
    const expected = `${prefix}${String(index + 1).padStart(3, "0")}`;

    if (!card.order?.startsWith(prefix)) {
      blockers.push(`${name} card ${card.id} order must start with ${prefix}.`);
    }
    if (orders.has(card.order)) {
      blockers.push(`${name} card order ${card.order} is duplicated.`);
    }
    orders.add(card.order);
    if (card.order !== expected) {
      blockers.push(`${name} card ${card.id} has order ${card.order}; expected ${expected}.`);
    }
  });

  return blockers;
}

function stripQuotes(value: string): string {
  return value.trim().replace(/^"|"$/g, "");
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll("\\", "/")}`) {
  await main();
}
