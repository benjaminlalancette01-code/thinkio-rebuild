package schemas

#ExportReadinessPurpose: "model-review" | "archive-research" | "release" | "vsix-install" | "handoff"

#ExportReadinessProfile: {
	id: string
	purpose: #ExportReadinessPurpose
	requiredSources: [...string]
	excludedSources: [...string]
	requiredValidation: [...string]
	expectedIngestPath: string
}
