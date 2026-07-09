import type { ActionSensitivity, AuthorityLevel, ProviderIdentity } from "./types.ts";

export type RuleTier = "locked" | "default-on" | "opt-in" | "custom" | "provider-overlay";
export type RuleEffect = "allow" | "require-review" | "require-approval" | "block";

export interface UserFacingRulePolicy {
  id: string;
  title: string;
  tier: RuleTier;
  effect: RuleEffect;
  appliesTo: string[];
  editableByUser: boolean;
  explanation: string;
  providerId?: string;
}

export function explainRulePolicyBlockers(policies: UserFacingRulePolicy[]): string[] {
  const blockers: string[] = [];
  const byScope = new Map<string, UserFacingRulePolicy[]>();

  for (const policy of policies) {
    if (!policy.id) blockers.push("Rule policy id is required.");
    if (!policy.explanation.trim()) blockers.push(`Rule policy ${policy.id} requires a user-facing explanation.`);
    if (policy.tier === "locked" && policy.editableByUser) {
      blockers.push(`Locked rule policy ${policy.id} cannot be user editable.`);
    }
    if (policy.tier === "custom" && !policy.editableByUser) {
      blockers.push(`Custom rule policy ${policy.id} must be user editable.`);
    }
    if (policy.tier === "provider-overlay" && !policy.providerId) {
      blockers.push(`Provider overlay rule policy ${policy.id} requires a provider id.`);
    }

    for (const scope of policy.appliesTo) {
      byScope.set(scope, [...(byScope.get(scope) ?? []), policy]);
    }
  }

  for (const [scope, scopedPolicies] of byScope) {
    const hasAllow = scopedPolicies.some((policy) => policy.effect === "allow");
    const hasBlock = scopedPolicies.some((policy) => policy.effect === "block");
    if (hasAllow && hasBlock) {
      blockers.push(`Rule policies conflict for ${scope}: allow and block are both present.`);
    }
  }

  return blockers;
}

export interface ProviderCapabilityProfile {
  id: string;
  identity: ProviderIdentity;
  capabilities: Array<"chat" | "code-edit" | "file-read" | "tool-call" | "vision" | "local-only">;
  contextWindowTokens?: number;
  trust: "local" | "workspace-trusted" | "remote-restricted" | "remote-sensitive";
  secretEnvironmentKeys: string[];
  normalizerId: string;
  ruleOverlayIds: string[];
}

export function explainProviderRegistryBlockers(profiles: ProviderCapabilityProfile[]): string[] {
  const blockers: string[] = [];
  const ids = new Set<string>();

  for (const profile of profiles) {
    if (ids.has(profile.id)) blockers.push(`Provider profile id is duplicated: ${profile.id}.`);
    ids.add(profile.id);
    if (!profile.identity.provider) blockers.push(`Provider profile ${profile.id} requires provider identity.`);
    if (profile.capabilities.length === 0) blockers.push(`Provider profile ${profile.id} requires capabilities.`);
    if (!profile.normalizerId) blockers.push(`Provider profile ${profile.id} requires an output normalizer.`);
    if (profile.trust.startsWith("remote") && profile.secretEnvironmentKeys.length === 0) {
      blockers.push(`Remote provider profile ${profile.id} requires explicit secret environment keys.`);
    }
  }

  return blockers;
}

export function selectProviderProfiles(
  profiles: ProviderCapabilityProfile[],
  requiredCapabilities: ProviderCapabilityProfile["capabilities"],
  maximumTrust: ProviderCapabilityProfile["trust"] = "remote-sensitive"
): ProviderCapabilityProfile[] {
  const trustRank: Record<ProviderCapabilityProfile["trust"], number> = {
    local: 0,
    "workspace-trusted": 1,
    "remote-restricted": 2,
    "remote-sensitive": 3
  };

  return profiles.filter(
    (profile) =>
      trustRank[profile.trust] <= trustRank[maximumTrust] &&
      requiredCapabilities.every((capability) => profile.capabilities.includes(capability))
  );
}

export interface RemoteProviderIntegrationPolicy {
  enabledByDefault: boolean;
  providerRegistryReady: boolean;
  secretsStoredInWorkspace: boolean;
  networkFailureFallback: "defer" | "retry" | "block";
  costLimitRequired: boolean;
}

export function explainRemoteProviderIntegrationBlockers(policy: RemoteProviderIntegrationPolicy): string[] {
  const blockers: string[] = [];

  if (policy.enabledByDefault) blockers.push("Remote provider integration must not be enabled by default.");
  if (!policy.providerRegistryReady) blockers.push("Remote provider integration requires provider registry readiness.");
  if (policy.secretsStoredInWorkspace) blockers.push("Remote provider secrets must not be stored in workspace files.");
  if (!policy.costLimitRequired) blockers.push("Remote provider integration requires a cost limit.");
  if (policy.networkFailureFallback !== "defer") {
    blockers.push("Remote provider network failure must defer rather than silently retry or block local work.");
  }

  return blockers;
}

export type ChatTurnKind = "user" | "thinkio" | "provider" | "tool";

export interface ChatSessionRecord {
  id: string;
  surfaceId: string;
  taskId?: string;
  canonical: false;
  turnIds: string[];
  createdAt: string;
}

export interface ChatTurnRecord {
  id: string;
  sessionId: string;
  kind: ChatTurnKind;
  summary: string;
  rawRef?: string;
  runtimeRecordIds: string[];
  providerCallId?: string;
  createdAt: string;
}

export interface ProviderCallRecord {
  id: string;
  providerProfileId: string;
  inputContractId: string;
  outputRecordId?: string;
  contextSnapshotRefs: string[];
  status: "planned" | "sent" | "received" | "failed" | "ingested";
}

export function explainChatSessionBlockers(
  session: ChatSessionRecord,
  turns: ChatTurnRecord[],
  providerCalls: ProviderCallRecord[] = []
): string[] {
  const blockers: string[] = [];
  const turnsById = new Map(turns.map((turn) => [turn.id, turn]));
  const callsById = new Map(providerCalls.map((call) => [call.id, call]));

  if (session.canonical !== false) blockers.push(`Chat session ${session.id} must be non-canonical.`);
  if (session.turnIds.length === 0) blockers.push(`Chat session ${session.id} requires at least one turn.`);

  for (const turnId of session.turnIds) {
    const turn = turnsById.get(turnId);
    if (!turn) {
      blockers.push(`Chat session ${session.id} references missing turn ${turnId}.`);
      continue;
    }
    if (!turn.summary.trim()) blockers.push(`Chat turn ${turn.id} requires a summary.`);
    if (turn.kind === "provider" && !turn.providerCallId) {
      blockers.push(`Provider chat turn ${turn.id} requires provider call id.`);
    }
    if (turn.providerCallId && !callsById.has(turn.providerCallId)) {
      blockers.push(`Chat turn ${turn.id} references missing provider call ${turn.providerCallId}.`);
    }
  }

  return blockers;
}

export type ArtifactDisposition =
  | "canonical"
  | "provisional"
  | "quarantined"
  | "superseded"
  | "stale"
  | "rejected"
  | "historical-reference"
  | "unsafe-to-promote";

export interface ArtifactDispositionRecord {
  id: string;
  artifactId: string;
  disposition: ArtifactDisposition;
  reason: string;
  supersedesArtifactId?: string;
  requiredEvidence: string[];
}

export function explainArtifactDispositionBlockers(record: ArtifactDispositionRecord): string[] {
  const blockers: string[] = [];
  if (!record.reason.trim()) blockers.push(`Artifact disposition ${record.id} requires a reason.`);
  if (record.disposition === "superseded" && !record.supersedesArtifactId) {
    blockers.push(`Superseded artifact disposition ${record.id} requires the replacement artifact id.`);
  }
  if ((record.disposition === "canonical" || record.disposition === "provisional") && record.requiredEvidence.length > 0) {
    blockers.push(`Artifact disposition ${record.id} cannot be ${record.disposition} while evidence is missing.`);
  }
  return blockers;
}

export interface ProjectDecisionRecord {
  id: string;
  kind: "decision" | "milestone" | "risk" | "requirement" | "release";
  title: string;
  status: "open" | "accepted" | "mitigated" | "released" | "rejected";
  linkedTaskIds: string[];
  rationale: string;
}

export function explainProjectDecisionBlockers(records: ProjectDecisionRecord[]): string[] {
  return records.flatMap((record) => {
    const blockers: string[] = [];
    if (!record.title.trim()) blockers.push(`Project record ${record.id} requires title.`);
    if (!record.rationale.trim()) blockers.push(`Project record ${record.id} requires rationale.`);
    if (record.kind !== "risk" && record.linkedTaskIds.length === 0) {
      blockers.push(`Project record ${record.id} requires linked tasks.`);
    }
    return blockers;
  });
}

export type MaturityStage =
  | "design-only"
  | "schema-defined"
  | "runtime-enforced"
  | "ui-exposed"
  | "tested"
  | "local-usable"
  | "release-ready";

export interface RuntimeMaturityEntry {
  id: string;
  subsystem: string;
  stage: MaturityStage;
  evidenceRefs: string[];
  blockers: string[];
}

export function releaseReadyEntries(entries: RuntimeMaturityEntry[]): RuntimeMaturityEntry[] {
  return entries.filter((entry) => entry.stage === "release-ready" && entry.blockers.length === 0);
}

export function explainMaturityLedgerBlockers(entries: RuntimeMaturityEntry[]): string[] {
  return entries.flatMap((entry) => {
    const blockers: string[] = [];
    if (entry.stage !== "design-only" && entry.evidenceRefs.length === 0) {
      blockers.push(`Maturity entry ${entry.id} requires evidence for stage ${entry.stage}.`);
    }
    if (entry.stage === "release-ready" && entry.blockers.length > 0) {
      blockers.push(`Maturity entry ${entry.id} cannot be release-ready with blockers.`);
    }
    return blockers;
  });
}

export interface ProjectProfile {
  id: string;
  rootPath: string;
  configPath: string;
  authority: AuthorityLevel;
  providerProfileIds: string[];
  rulePolicyIds: string[];
}

export interface MultiProjectRegistry {
  activeProjectId: string;
  profiles: ProjectProfile[];
  crossProjectDependenciesAllowed: boolean;
}

export function explainMultiProjectRegistryBlockers(registry: MultiProjectRegistry): string[] {
  const blockers: string[] = [];
  const ids = new Set(registry.profiles.map((profile) => profile.id));
  if (!ids.has(registry.activeProjectId)) blockers.push(`Active project ${registry.activeProjectId} is missing.`);
  if (registry.crossProjectDependenciesAllowed) {
    blockers.push("Cross-project dependencies require explicit future governance and are not MVP scope.");
  }
  for (const profile of registry.profiles) {
    if (!profile.rootPath || !profile.configPath) {
      blockers.push(`Project profile ${profile.id} requires root and config paths.`);
    }
  }
  return blockers;
}

export interface TranscriptCapturePolicy {
  enabledByDefault: boolean;
  mode: "off" | "summary" | "transcript-grade";
  storageBoundary: "none" | "workspace-local" | "external-secure-store";
  redactionRequired: boolean;
  canonicalStateAllowed: false;
}

export function explainTranscriptCaptureBlockers(policy: TranscriptCapturePolicy): string[] {
  const blockers: string[] = [];
  if (policy.enabledByDefault) blockers.push("Transcript-grade capture must not be enabled by default.");
  if (policy.mode === "transcript-grade" && policy.storageBoundary === "none") {
    blockers.push("Transcript-grade capture requires an explicit storage boundary.");
  }
  if (policy.mode === "transcript-grade" && !policy.redactionRequired) {
    blockers.push("Transcript-grade capture requires redaction.");
  }
  if (policy.canonicalStateAllowed !== false) blockers.push("Transcript capture cannot become canonical state.");
  return blockers;
}

export interface CrossMachineSyncPolicy {
  syncEnabled: boolean;
  syncedScopes: Array<"ui-state" | "selection" | "provider-secrets" | "canonical-runtime-state">;
  conflictResolution: "local-wins" | "remote-wins" | "manual-review";
}

export function explainCrossMachineSyncBlockers(policy: CrossMachineSyncPolicy): string[] {
  const blockers: string[] = [];
  if (policy.syncEnabled && policy.conflictResolution !== "manual-review") {
    blockers.push("Cross-machine sync requires manual-review conflict resolution.");
  }
  if (policy.syncedScopes.includes("provider-secrets")) {
    blockers.push("Provider secrets must not be synchronized by ThinkIO plugin state sync.");
  }
  if (policy.syncedScopes.includes("canonical-runtime-state")) {
    blockers.push("Canonical runtime state must remain workspace/project governed, not plugin UI sync state.");
  }
  return blockers;
}

export interface MarketplaceMetadataPolicy {
  displayName: string;
  publisher: string;
  categories: string[];
  iconPath?: string;
  publicDescriptionApproved: boolean;
  localMvpLabelRequired: boolean;
}

export function explainMarketplaceMetadataBlockers(policy: MarketplaceMetadataPolicy): string[] {
  const blockers: string[] = [];
  if (!policy.displayName.trim()) blockers.push("Marketplace metadata requires display name.");
  if (!policy.publisher.trim()) blockers.push("Marketplace metadata requires publisher.");
  if (policy.categories.length === 0) blockers.push("Marketplace metadata requires at least one category.");
  if (!policy.iconPath) blockers.push("Marketplace metadata requires an icon path before publishing.");
  if (!policy.publicDescriptionApproved) blockers.push("Marketplace public description requires approval.");
  if (!policy.localMvpLabelRequired) blockers.push("Marketplace copy must identify current local MVP scope.");
  return blockers;
}

export interface SignedReleasePolicy {
  vsixPath: string;
  checksumPath?: string;
  signed: boolean;
  smokeValidated: boolean;
  platformNotes: string[];
}

export function explainSignedReleaseBlockers(policy: SignedReleasePolicy): string[] {
  const blockers: string[] = [];
  if (!policy.vsixPath.endsWith(".vsix")) blockers.push("Signed release policy requires a VSIX artifact.");
  if (!policy.checksumPath) blockers.push("Signed release policy requires checksum artifact.");
  if (!policy.signed) blockers.push("Release artifact is not signed.");
  if (!policy.smokeValidated) blockers.push("Release artifact requires smoke validation.");
  if (policy.platformNotes.length === 0) blockers.push("Release artifact requires platform install notes.");
  return blockers;
}

export interface StandaloneChatboxBoundary {
  productSurface: "vscode-plugin" | "standalone-app";
  directModelChatAllowed: boolean;
  routesThroughComposer: boolean;
  producesRuntimeRecords: boolean;
  chatCanonical: false;
}

export function explainStandaloneChatboxBlockers(boundary: StandaloneChatboxBoundary): string[] {
  const blockers: string[] = [];
  if (boundary.productSurface === "vscode-plugin" && boundary.directModelChatAllowed) {
    blockers.push("VS Code plugin must not expose direct ungoverned model chat.");
  }
  if (!boundary.routesThroughComposer) blockers.push("Chatbox must route through the ThinkIO composer.");
  if (!boundary.producesRuntimeRecords) blockers.push("Chatbox must produce governed runtime records.");
  if (boundary.chatCanonical !== false) blockers.push("Chatbox transcript cannot be canonical runtime state.");
  return blockers;
}

export function hasNoBlockers(blockers: string[]): boolean {
  return blockers.length === 0;
}
