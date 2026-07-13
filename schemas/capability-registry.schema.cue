package schemas

#CapabilityMaturity: "idea" | "candidate" | "implemented" | "validated" | "stable"
#CapabilityNativeHome: "schema" | "kernel" | "runtime" | "baml" | "command" | "view" | "test" | "docs" | "external-skill"

#CapabilityRecord: {
	id: string
	name: string
	nativeHome: #CapabilityNativeHome
	maturity: #CapabilityMaturity
	taskIds: [...string]
	evidence: [...string]
	blockers: [...string]
	externalSkill?: string
}
