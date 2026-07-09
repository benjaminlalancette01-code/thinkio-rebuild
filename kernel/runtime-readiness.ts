import type {
  MutationTransactionRecord,
  RuntimeReadinessCheck,
  RuntimeReadinessProof,
  Workboard,
  WorkBranch
} from "./types.ts";
import { explainBranchBlockers } from "./branch.ts";
import { explainWorkboardBlockers } from "./workboard.ts";

export interface RuntimeReadinessInput {
  id?: string;
  requiredStateFiles: string[];
  presentStateFiles: string[];
  schemaResults: Array<{ id: string; ok: boolean; blockers?: string[] }>;
  workboard: Workboard;
  branches?: WorkBranch[];
  unfinishedTransactions?: MutationTransactionRecord[];
  createdAt?: string;
}

export function buildRuntimeReadinessProof(input: RuntimeReadinessInput): RuntimeReadinessProof {
  const checks: RuntimeReadinessCheck[] = [
    checkRequiredStateFiles(input.requiredStateFiles, input.presentStateFiles),
    checkSchemaHealth(input.schemaResults),
    {
      id: "workboard-invariants",
      ok: explainWorkboardBlockers(input.workboard).length === 0,
      blockers: explainWorkboardBlockers(input.workboard)
    },
    checkUnfinishedTransactions(input.unfinishedTransactions ?? []),
    checkOpenBranches(input.branches ?? []),
    {
      id: "branch-links",
      ok:
        explainBranchBlockers(input.branches ?? [], [], input.workboard).filter((blocker) =>
          blocker.includes("missing")
        ).length === 0,
      blockers: explainBranchBlockers(input.branches ?? [], [], input.workboard).filter((blocker) =>
        blocker.includes("missing")
      )
    }
  ];
  const blockers = checks.flatMap((check) => check.blockers);

  return {
    id: input.id ?? "READINESS-RUNTIME",
    ok: blockers.length === 0,
    checks,
    blockers,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

function checkRequiredStateFiles(requiredStateFiles: string[], presentStateFiles: string[]): RuntimeReadinessCheck {
  const present = new Set(presentStateFiles);
  const blockers = requiredStateFiles
    .filter((file) => !present.has(file))
    .map((file) => `Missing required state file: ${file}.`);

  return { id: "required-state-files", ok: blockers.length === 0, blockers };
}

function checkSchemaHealth(
  schemaResults: Array<{ id: string; ok: boolean; blockers?: string[] }>
): RuntimeReadinessCheck {
  const blockers = schemaResults.flatMap((result) =>
    result.ok ? [] : result.blockers?.length ? result.blockers : [`Schema validation failed: ${result.id}.`]
  );

  return { id: "schema-health", ok: blockers.length === 0, blockers };
}

function checkUnfinishedTransactions(transactions: MutationTransactionRecord[]): RuntimeReadinessCheck {
  const blockers = transactions.map(
    (transaction) => `Unfinished mutation transaction blocks startup: ${transaction.id}.`
  );

  return { id: "unfinished-transactions", ok: blockers.length === 0, blockers };
}

function checkOpenBranches(branches: WorkBranch[]): RuntimeReadinessCheck {
  const blockers = branches
    .filter((branch) => branch.status === "active")
    .map((branch) => `Open branch requires startup attention: ${branch.id}.`);

  return { id: "open-branches", ok: blockers.length === 0, blockers };
}
