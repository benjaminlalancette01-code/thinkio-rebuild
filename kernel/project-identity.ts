export const LOAD_MODES = [
  "canonical",
  "generated",
  "historical",
  "archive-evidence",
  "external-report",
  "working-scratch"
] as const;

export type LoadMode = (typeof LOAD_MODES)[number];

export interface ProjectIdentityRecord {
  id: string;
  name: string;
  workspaceRoot: string;
  extensionRoot: string;
  archiveRoot?: string;
  generatedRoots: string[];
  currentLoadMode: LoadMode;
}

export interface WorkspaceTopologyPolicy {
  workspaceRoot: string;
  canonicalRoots: string[];
  generatedRoots: string[];
  archiveRoots: string[];
  blockedRoots: string[];
}

export interface LoadModeRule {
  mode: LoadMode;
  canReadCanonical: boolean;
  canReadGenerated: boolean;
  canReadHistorical: boolean;
  canWriteCanonical: boolean;
}

export interface ProjectIdentityProjection {
  id: string;
  name: string;
  roots: {
    workspace: string;
    extension: string;
    archive?: string;
    generated: string[];
  };
  loadModes: LoadModeRule[];
  blockers: string[];
}

export const DEFAULT_LOAD_MODE_RULES: LoadModeRule[] = [
  { mode: "canonical", canReadCanonical: true, canReadGenerated: true, canReadHistorical: false, canWriteCanonical: true },
  { mode: "generated", canReadCanonical: true, canReadGenerated: true, canReadHistorical: false, canWriteCanonical: false },
  { mode: "historical", canReadCanonical: true, canReadGenerated: false, canReadHistorical: true, canWriteCanonical: false },
  { mode: "archive-evidence", canReadCanonical: false, canReadGenerated: false, canReadHistorical: true, canWriteCanonical: false },
  { mode: "external-report", canReadCanonical: true, canReadGenerated: true, canReadHistorical: true, canWriteCanonical: false },
  { mode: "working-scratch", canReadCanonical: true, canReadGenerated: true, canReadHistorical: false, canWriteCanonical: false }
];

export function explainProjectIdentityBlockers(
  identity: ProjectIdentityRecord,
  topology: WorkspaceTopologyPolicy,
  loadModes: LoadModeRule[] = DEFAULT_LOAD_MODE_RULES
): string[] {
  const blockers: string[] = [];

  if (!identity.id.trim()) blockers.push("Project identity requires id.");
  if (!identity.name.trim()) blockers.push("Project identity requires name.");
  if (identity.workspaceRoot !== topology.workspaceRoot) {
    blockers.push(`Project identity workspace ${identity.workspaceRoot} does not match topology ${topology.workspaceRoot}.`);
  }
  if (!LOAD_MODES.includes(identity.currentLoadMode)) {
    blockers.push(`Project identity uses unsupported load mode ${identity.currentLoadMode}.`);
  }
  if (!loadModes.some((rule) => rule.mode === identity.currentLoadMode)) {
    blockers.push(`Load mode registry is missing ${identity.currentLoadMode}.`);
  }

  for (const root of topology.archiveRoots) {
    if (topology.canonicalRoots.includes(root)) {
      blockers.push(`Archive root ${root} cannot also be canonical.`);
    }
  }

  return blockers;
}

export function buildProjectIdentityProjection(input: {
  identity: ProjectIdentityRecord;
  topology: WorkspaceTopologyPolicy;
  loadModes?: LoadModeRule[];
}): ProjectIdentityProjection {
  const loadModes = input.loadModes ?? DEFAULT_LOAD_MODE_RULES;

  return {
    id: input.identity.id,
    name: input.identity.name,
    roots: {
      workspace: input.identity.workspaceRoot,
      extension: input.identity.extensionRoot,
      archive: input.identity.archiveRoot,
      generated: input.identity.generatedRoots
    },
    loadModes,
    blockers: explainProjectIdentityBlockers(input.identity, input.topology, loadModes)
  };
}
