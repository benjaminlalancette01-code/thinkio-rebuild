package schemas

#ReentryNativeOwner: "project-materials" | "kernel" | "runtime" | "cue" | "baml" | "extension-command" | "report" | "external-skill"

#ReentryResponsibilityMapping: {
	historicalResponsibility: string
	nativeOwner: #ReentryNativeOwner
	reads: [...string]
	writes: [...string]
	validationEvidence: [...string]
	coveredByTaskIds: [...string]
}
