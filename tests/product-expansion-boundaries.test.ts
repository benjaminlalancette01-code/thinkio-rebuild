import test from "node:test";
import assert from "node:assert/strict";
import {
  explainArtifactDispositionBlockers,
  explainChatSessionBlockers,
  explainCrossMachineSyncBlockers,
  explainMarketplaceMetadataBlockers,
  explainMaturityLedgerBlockers,
  explainMultiProjectRegistryBlockers,
  explainProjectDecisionBlockers,
  explainProviderRegistryBlockers,
  explainRemoteProviderIntegrationBlockers,
  explainRulePolicyBlockers,
  explainSignedReleaseBlockers,
  explainStandaloneChatboxBlockers,
  explainTranscriptCaptureBlockers,
  hasNoBlockers,
  releaseReadyEntries,
  selectProviderProfiles,
  type ChatSessionRecord,
  type ChatTurnRecord,
  type ProviderCallRecord,
  type ProviderCapabilityProfile
} from "../kernel/product-expansion-boundaries.ts";

test("TASK-084 rule policies support tiers and detect user-visible conflicts", () => {
  assert.deepEqual(
    explainRulePolicyBlockers([
      {
        id: "RULE-LOCKED",
        title: "No direct writes",
        tier: "locked",
        effect: "require-approval",
        appliesTo: ["file-action.write"],
        editableByUser: false,
        explanation: "Writes require proposal and approval."
      },
      {
        id: "RULE-CUSTOM",
        title: "Prefer review mode",
        tier: "custom",
        effect: "require-review",
        appliesTo: ["provider.output"],
        editableByUser: true,
        explanation: "Provider output should be reviewed before ingest."
      }
    ]),
    []
  );

  assert.deepEqual(
    explainRulePolicyBlockers([
      {
        id: "ALLOW",
        title: "Allow writes",
        tier: "default-on",
        effect: "allow",
        appliesTo: ["file-action.write"],
        editableByUser: false,
        explanation: "Fixture."
      },
      {
        id: "BLOCK",
        title: "Block writes",
        tier: "provider-overlay",
        effect: "block",
        appliesTo: ["file-action.write"],
        editableByUser: false,
        explanation: "Fixture.",
        providerId: "remote"
      }
    ]),
    ["Rule policies conflict for file-action.write: allow and block are both present."]
  );
});

test("TASK-086 provider registry selects by capability and requires remote secret boundaries", () => {
  const profiles: ProviderCapabilityProfile[] = [
    {
      id: "local-codex",
      identity: { provider: "local", model: "codex" },
      capabilities: ["chat", "code-edit", "file-read", "local-only"],
      trust: "local",
      secretEnvironmentKeys: [],
      normalizerId: "default-model-output",
      ruleOverlayIds: ["RULE-LOCKED"]
    },
    {
      id: "remote-chat",
      identity: { provider: "remote", model: "chat" },
      capabilities: ["chat", "tool-call"],
      trust: "remote-restricted",
      secretEnvironmentKeys: ["THINKIO_REMOTE_API_KEY"],
      normalizerId: "default-model-output",
      ruleOverlayIds: ["RULE-REMOTE"]
    }
  ];

  assert.equal(hasNoBlockers(explainProviderRegistryBlockers(profiles)), true);
  assert.deepEqual(
    selectProviderProfiles(profiles, ["chat"], "workspace-trusted").map((profile) => profile.id),
    ["local-codex"]
  );
  assert.deepEqual(
    explainProviderRegistryBlockers([{ ...profiles[1], secretEnvironmentKeys: [] }]),
    ["Remote provider profile remote-chat requires explicit secret environment keys."]
  );
});

test("TASK-088 chat sessions and provider turns stay attached but non-canonical", () => {
  const session: ChatSessionRecord = {
    id: "CHAT-001",
    surfaceId: "runtime-composer",
    taskId: "TASK-088",
    canonical: false,
    turnIds: ["TURN-001", "TURN-002"],
    createdAt: "2026-07-09T00:00:00.000Z"
  };
  const calls: ProviderCallRecord[] = [
    {
      id: "PCALL-001",
      providerProfileId: "local-codex",
      inputContractId: "MIN-001",
      outputRecordId: "POUT-001",
      contextSnapshotRefs: ["WP-001"],
      status: "ingested"
    }
  ];
  const turns: ChatTurnRecord[] = [
    {
      id: "TURN-001",
      sessionId: "CHAT-001",
      kind: "user",
      summary: "Ask ThinkIO to plan provider ingest.",
      runtimeRecordIds: ["WP-001"],
      createdAt: "2026-07-09T00:01:00.000Z"
    },
    {
      id: "TURN-002",
      sessionId: "CHAT-001",
      kind: "provider",
      summary: "Provider returned a governed recommendation.",
      runtimeRecordIds: ["POUT-001"],
      providerCallId: "PCALL-001",
      createdAt: "2026-07-09T00:02:00.000Z"
    }
  ];

  assert.deepEqual(explainChatSessionBlockers(session, turns, calls), []);
  assert.deepEqual(explainChatSessionBlockers(session, [{ ...turns[1], providerCallId: undefined }], calls), [
    "Chat session CHAT-001 references missing turn TURN-001.",
    "Provider chat turn TURN-002 requires provider call id."
  ]);
});

test("TASK-072 remote provider integration remains disabled until registry, secret, and cost policy are ready", () => {
  assert.deepEqual(
    explainRemoteProviderIntegrationBlockers({
      enabledByDefault: false,
      providerRegistryReady: true,
      secretsStoredInWorkspace: false,
      networkFailureFallback: "defer",
      costLimitRequired: true
    }),
    []
  );

  assert.deepEqual(
    explainRemoteProviderIntegrationBlockers({
      enabledByDefault: true,
      providerRegistryReady: false,
      secretsStoredInWorkspace: true,
      networkFailureFallback: "retry",
      costLimitRequired: false
    }),
    [
      "Remote provider integration must not be enabled by default.",
      "Remote provider integration requires provider registry readiness.",
      "Remote provider secrets must not be stored in workspace files.",
      "Remote provider integration requires a cost limit.",
      "Remote provider network failure must defer rather than silently retry or block local work."
    ]
  );
});

test("TASK-085 artifact disposition separates quarantine, supersession, stale, and canonical states", () => {
  assert.deepEqual(
    explainArtifactDispositionBlockers({
      id: "DISP-001",
      artifactId: "ART-001",
      disposition: "quarantined",
      reason: "Imported report needs review.",
      requiredEvidence: ["artifact-reviewed"]
    }),
    []
  );
  assert.deepEqual(
    explainArtifactDispositionBlockers({
      id: "DISP-002",
      artifactId: "ART-002",
      disposition: "superseded",
      reason: "",
      requiredEvidence: []
    }),
    [
      "Artifact disposition DISP-002 requires a reason.",
      "Superseded artifact disposition DISP-002 requires the replacement artifact id."
    ]
  );
});

test("TASK-089 project management layer validates records without replacing task governance", () => {
  assert.deepEqual(
    explainProjectDecisionBlockers([
      {
        id: "DEC-001",
        kind: "decision",
        title: "Keep plugin workspace-first",
        status: "accepted",
        linkedTaskIds: ["TASK-087"],
        rationale: "Multi-project switching is future scope."
      }
    ]),
    []
  );
  assert.deepEqual(
    explainProjectDecisionBlockers([
      { id: "REQ-001", kind: "requirement", title: "", status: "open", linkedTaskIds: [], rationale: "" }
    ]),
    [
      "Project record REQ-001 requires title.",
      "Project record REQ-001 requires rationale.",
      "Project record REQ-001 requires linked tasks."
    ]
  );
});

test("TASK-090 maturity ledger distinguishes local usable from release ready", () => {
  const entries = [
    {
      id: "MAT-PLUGIN",
      subsystem: "VS Code plugin shell",
      stage: "local-usable" as const,
      evidenceRefs: ["npm run smoke:extension-host"],
      blockers: []
    },
    {
      id: "MAT-MARKETPLACE",
      subsystem: "Marketplace release",
      stage: "release-ready" as const,
      evidenceRefs: ["TASK-070"],
      blockers: ["Publisher identity not approved."]
    }
  ];

  assert.deepEqual(explainMaturityLedgerBlockers(entries), [
    "Maturity entry MAT-MARKETPLACE cannot be release-ready with blockers."
  ]);
  assert.deepEqual(releaseReadyEntries(entries), []);
});

test("TASK-087 multi-project registry keeps workspace-first behavior explicit", () => {
  assert.deepEqual(
    explainMultiProjectRegistryBlockers({
      activeProjectId: "thinkio-rebuild",
      profiles: [
        {
          id: "thinkio-rebuild",
          rootPath: ".",
          configPath: "thinkio.config.json",
          authority: "accepted",
          providerProfileIds: ["local-codex"],
          rulePolicyIds: ["RULE-LOCKED"]
        }
      ],
      crossProjectDependenciesAllowed: false
    }),
    []
  );
});

test("TASK-074 transcript-grade capture is explicit, redacted, and non-canonical", () => {
  assert.deepEqual(
    explainTranscriptCaptureBlockers({
      enabledByDefault: false,
      mode: "transcript-grade",
      storageBoundary: "workspace-local",
      redactionRequired: true,
      canonicalStateAllowed: false
    }),
    []
  );
});

test("TASK-075 cross-machine sync cannot carry secrets or canonical runtime state", () => {
  assert.deepEqual(
    explainCrossMachineSyncBlockers({
      syncEnabled: true,
      syncedScopes: ["ui-state", "provider-secrets", "canonical-runtime-state"],
      conflictResolution: "local-wins"
    }),
    [
      "Cross-machine sync requires manual-review conflict resolution.",
      "Provider secrets must not be synchronized by ThinkIO plugin state sync.",
      "Canonical runtime state must remain workspace/project governed, not plugin UI sync state."
    ]
  );
});

test("TASK-070 marketplace publishing requires approved public metadata", () => {
  assert.deepEqual(
    explainMarketplaceMetadataBlockers({
      displayName: "ThinkIO",
      publisher: "thinkio",
      categories: ["Other"],
      iconPath: "media/thinkio.svg",
      publicDescriptionApproved: true,
      localMvpLabelRequired: true
    }),
    []
  );
});

test("TASK-071 signed releases require checksum, signature, smoke, and platform notes", () => {
  assert.deepEqual(
    explainSignedReleaseBlockers({
      vsixPath: "local-vsix/thinkio-rebuild-0.2.1.vsix",
      checksumPath: "local-vsix/thinkio-rebuild-0.2.1.sha256",
      signed: true,
      smokeValidated: true,
      platformNotes: ["Windows local VS Code install tested."]
    }),
    []
  );
});

test("TASK-073 standalone chatbox preserves ThinkIO composer authority", () => {
  assert.deepEqual(
    explainStandaloneChatboxBlockers({
      productSurface: "vscode-plugin",
      directModelChatAllowed: true,
      routesThroughComposer: false,
      producesRuntimeRecords: false,
      chatCanonical: false
    }),
    [
      "VS Code plugin must not expose direct ungoverned model chat.",
      "Chatbox must route through the ThinkIO composer.",
      "Chatbox must produce governed runtime records."
    ]
  );
});
