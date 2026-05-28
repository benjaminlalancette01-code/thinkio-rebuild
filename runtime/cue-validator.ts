import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export interface CueValidationTarget {
  id: string;
  schemaPath: string;
  dataPath: string;
  definition: string;
}

export interface CueCommandResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  missingExecutable?: boolean;
}

export interface CueValidationResult {
  id: string;
  command: string;
  status: "passed" | "failed" | "skipped";
  stdout: string;
  stderr: string;
  reason?: string;
}

export type CueCommandRunner = (args: string[]) => Promise<CueCommandResult>;
export type CueValidationMode = "strict" | "soft";

export interface CueValidationSummary {
  mode: CueValidationMode;
  ok: boolean;
  exitCode: 0 | 1;
  warnings: string[];
  failures: string[];
}

export const defaultCueValidationTargets: CueValidationTarget[] = [
  {
    id: "TASK-001",
    schemaPath: "schemas/task.schema.cue",
    dataPath: "tasks/TASK-001.bootstrap-kernel.json",
    definition: "#GovernedTask"
  }
];

export async function discoverTaskCueValidationTargets(tasksDir = "tasks"): Promise<CueValidationTarget[]> {
  const entries = await readdir(tasksDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => {
      const id = entry.name.split(".")[0];

      return {
        id,
        schemaPath: "schemas/task.schema.cue",
        dataPath: join(tasksDir, entry.name).replaceAll("\\", "/"),
        definition: "#GovernedTask"
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function buildCueVetArgs(target: CueValidationTarget): string[] {
  return ["vet", target.dataPath, target.schemaPath, "-d", target.definition];
}

export async function validateCueTargets(
  targets = defaultCueValidationTargets,
  runner: CueCommandRunner = runCueCommand
): Promise<CueValidationResult[]> {
  const results: CueValidationResult[] = [];

  for (const target of targets) {
    const args = buildCueVetArgs(target);
    const command = `cue ${args.join(" ")}`;
    const result = await runner(args);

    if (result.missingExecutable) {
      results.push({
        id: target.id,
        command,
        status: "skipped",
        stdout: result.stdout,
        stderr: result.stderr,
        reason: "cue executable not found"
      });
      continue;
    }

    results.push({
      id: target.id,
      command,
      status: result.exitCode === 0 ? "passed" : "failed",
      stdout: result.stdout,
      stderr: result.stderr,
      reason: result.exitCode === 0 ? undefined : `cue exited with code ${result.exitCode}`
    });
  }

  return results;
}

export async function validateDiscoveredTaskSchemas(
  tasksDir = "tasks",
  runner: CueCommandRunner = runCueCommand
): Promise<CueValidationResult[]> {
  const targets = await discoverTaskCueValidationTargets(tasksDir);
  return validateCueTargets(targets, runner);
}

export function summarizeCueValidationResults(
  results: CueValidationResult[],
  mode: CueValidationMode
): CueValidationSummary {
  const warnings: string[] = [];
  const failures: string[] = [];

  for (const result of results) {
    if (result.status === "failed") {
      failures.push(`${result.id}: ${result.reason ?? "cue validation failed"}`);
      continue;
    }

    if (result.status === "skipped") {
      const message = `${result.id}: ${result.reason ?? "cue validation skipped"}`;

      if (mode === "soft") {
        warnings.push(message);
      } else {
        failures.push(message);
      }
    }
  }

  return {
    mode,
    ok: failures.length === 0,
    exitCode: failures.length === 0 ? 0 : 1,
    warnings,
    failures
  };
}

export async function runCueCommand(args: string[]): Promise<CueCommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(resolveCueCommand(), args, { shell: false });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        resolve({
          exitCode: null,
          stdout,
          stderr: error.message,
          missingExecutable: true
        });
        return;
      }

      reject(error);
    });

    child.on("close", (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
  });
}

export function resolveCueCommand(): string {
  if (process.env.CUE_BIN) {
    return process.env.CUE_BIN;
  }

  const localCuePath = process.platform === "win32" ? ".tools/cue/cue.exe" : ".tools/cue/cue";
  if (existsSync(localCuePath)) {
    return localCuePath;
  }

  return "cue";
}
