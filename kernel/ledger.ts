import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { ArtifactRecord } from "./types.ts";

interface LedgerFile {
  entries: ArtifactRecord[];
}

type ArtifactInput = Omit<ArtifactRecord, "id" | "createdAt"> & Partial<Pick<ArtifactRecord, "id" | "createdAt">>;

export function createArtifactRecord(input: ArtifactInput): ArtifactRecord {
  return {
    id: input.id ?? `ART-${randomUUID()}`,
    taskId: input.taskId,
    path: input.path,
    kind: input.kind,
    evidence: [...input.evidence],
    ...(input.hash ? { hash: input.hash } : {}),
    ...(input.dependsOn ? { dependsOn: [...input.dependsOn] } : {}),
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

export async function addLedgerEntry(
  entry: ArtifactRecord,
  ledgerPath = "state/ledger.json"
): Promise<ArtifactRecord> {
  const ledger = await readLedger(ledgerPath);
  ledger.entries.push(entry);
  await writeLedger(ledgerPath, ledger);
  return entry;
}

export async function findArtifactById(
  id: string,
  ledgerPath = "state/ledger.json"
): Promise<ArtifactRecord | undefined> {
  const ledger = await readLedger(ledgerPath);
  return ledger.entries.find((entry) => entry.id === id);
}

async function readLedger(ledgerPath: string): Promise<LedgerFile> {
  try {
    const raw = await readFile(ledgerPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<LedgerFile>;
    return { entries: parsed.entries ?? [] };
  } catch (error) {
    if (isMissingFileError(error)) {
      return { entries: [] };
    }
    throw error;
  }
}

async function writeLedger(ledgerPath: string, ledger: LedgerFile): Promise<void> {
  await mkdir(dirname(ledgerPath), { recursive: true });
  await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
}

function isMissingFileError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
