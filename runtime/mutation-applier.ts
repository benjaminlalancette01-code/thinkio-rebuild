import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  explainMutationTransactionBlockers
} from "../kernel/mutation-transaction.ts";
import type {
  ArtifactRecord,
  CheckpointRecord,
  GovernedTask,
  MutationRollbackRecord,
  MutationTransactionRecord
} from "../kernel/types.ts";

interface LedgerFile {
  entries: ArtifactRecord[];
}

interface CheckpointFile {
  checkpoints: CheckpointRecord[];
}

interface MutationRollbackFile {
  rollbacks: MutationRollbackRecord[];
}

export interface MutationTransactionApplyInput {
  transaction: MutationTransactionRecord;
  ledgerArtifacts: ArtifactRecord[];
  checkpoint: CheckpointRecord;
  taskPath: string;
  ledgerPath?: string;
  checkpointPath?: string;
  rollbackPath?: string;
  appliedAt?: string;
}

export interface MutationTransactionApplyResult {
  task: GovernedTask;
  ledger: LedgerFile;
  checkpoints: CheckpointFile;
  rollback: MutationRollbackRecord;
}

export async function applyMutationTransactionToWorkspace(
  input: MutationTransactionApplyInput
): Promise<MutationTransactionApplyResult> {
  const ledgerPath = input.ledgerPath ?? "state/ledger.json";
  const checkpointPath = input.checkpointPath ?? "state/checkpoints.json";
  const rollbackPath = input.rollbackPath ?? "state/mutation-rollbacks.json";
  const [task, ledger, checkpoints, rollbackFile] = await Promise.all([
    readJsonFile<GovernedTask>(input.taskPath),
    readJsonFile<LedgerFile>(ledgerPath, { entries: [] }),
    readJsonFile<CheckpointFile>(checkpointPath, { checkpoints: [] }),
    readJsonFile<MutationRollbackFile>(rollbackPath, { rollbacks: [] })
  ]);

  const blockers = explainMutationApplyBlockers(input, task, ledger, checkpoints);
  if (blockers.length > 0) {
    throw new Error(`Mutation application blocked: ${blockers.join(" ")}`);
  }

  const updatedTask: GovernedTask = {
    ...task,
    status: input.transaction.toStatus,
    authority: input.transaction.toAuthority
  };
  const updatedLedger = {
    entries: [...ledger.entries, ...input.ledgerArtifacts]
  };
  const updatedCheckpoints = {
    checkpoints: [...checkpoints.checkpoints, input.checkpoint]
  };
  const rollback: MutationRollbackRecord = {
    id: `RBK-${input.transaction.id}`,
    mutationId: input.transaction.id,
    taskId: input.transaction.taskId,
    taskPath: input.taskPath,
    rollbackStatus: input.transaction.rollbackStatus,
    rollbackAuthority: input.transaction.rollbackAuthority,
    previousTask: task,
    ledgerArtifactIds: [...input.transaction.ledgerArtifactIds],
    checkpointId: input.transaction.checkpointId,
    appliedAt: input.appliedAt ?? new Date().toISOString()
  };
  const updatedRollbackFile = {
    rollbacks: [...rollbackFile.rollbacks, rollback]
  };

  await writeJsonFilesAtomically([
    { path: input.taskPath, value: updatedTask },
    { path: ledgerPath, value: updatedLedger },
    { path: checkpointPath, value: updatedCheckpoints },
    { path: rollbackPath, value: updatedRollbackFile }
  ]);

  return {
    task: updatedTask,
    ledger: updatedLedger,
    checkpoints: updatedCheckpoints,
    rollback
  };
}

function explainMutationApplyBlockers(
  input: MutationTransactionApplyInput,
  task: GovernedTask,
  ledger: LedgerFile,
  checkpoints: CheckpointFile
): string[] {
  const reasons: string[] = [];
  const ledgerArtifactIds = new Set(input.ledgerArtifacts.map((artifact) => artifact.id));

  for (const artifactId of input.transaction.ledgerArtifactIds) {
    if (!ledgerArtifactIds.has(artifactId)) {
      reasons.push(`Missing supplied ledger artifact effect: ${artifactId}.`);
    }
  }

  for (const artifact of input.ledgerArtifacts) {
    if (!input.transaction.ledgerArtifactIds.includes(artifact.id)) {
      reasons.push(`Supplied ledger artifact ${artifact.id} is not declared by the mutation transaction.`);
    }

    if (ledger.entries.some((entry) => entry.id === artifact.id)) {
      reasons.push(`Ledger artifact ${artifact.id} already exists.`);
    }
  }

  if (input.checkpoint.id !== input.transaction.checkpointId) {
    reasons.push(`Supplied checkpoint ${input.checkpoint.id} does not match transaction checkpoint ${input.transaction.checkpointId}.`);
  }

  if (checkpoints.checkpoints.some((checkpoint) => checkpoint.id === input.checkpoint.id)) {
    reasons.push(`Checkpoint ${input.checkpoint.id} already exists.`);
  }

  return [
    ...reasons,
    ...explainMutationTransactionBlockers(
      input.transaction,
      task,
      [...ledger.entries, ...input.ledgerArtifacts],
      [...checkpoints.checkpoints, input.checkpoint]
    )
  ];
}

async function readJsonFile<T>(path: string, fallback?: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    if (fallback !== undefined && isMissingFileError(error)) {
      return fallback;
    }
    throw error;
  }
}

async function writeJsonFilesAtomically(
  files: Array<{ path: string; value: unknown }>
): Promise<void> {
  const tempPaths: string[] = [];

  try {
    for (const file of files) {
      const tempPath = `${file.path}.tmp-${process.pid}-${Date.now()}-${tempPaths.length}`;
      await mkdir(dirname(file.path), { recursive: true });
      await writeFile(tempPath, `${JSON.stringify(file.value, null, 2)}\n`, "utf8");
      tempPaths.push(tempPath);
    }

    await Promise.all(files.map((file, index) => rename(tempPaths[index], file.path)));
  } catch (error) {
    await Promise.all(tempPaths.map((path) => unlink(path).catch(() => undefined)));
    throw error;
  }
}

function isMissingFileError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
