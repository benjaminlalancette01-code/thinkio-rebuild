package schemas

#HistoricalTranslationDisposition: "already-native" | "valid-gap" | "partial-native" | "superseded" | "external-skill-only" | "rejected"

#HistoricalTranslationRecord: {
	id: string
	archiveConcept: string
	sourceRefs: [...string]
	currentNativeDestination: string
	disposition: #HistoricalTranslationDisposition
	evidence: [...string]
	taskIds: [...string]
	capabilityId?: string
	supersededBy?: string
}
