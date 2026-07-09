package schemas

#DecompositionRecord: {
	id: string
	parentTaskId: string
	childTaskIds: [...string]
	reason: string
	preservedDependencies: [...string]
	preservedEvidence: [...string]
	checkpointIds: [...string]
	reconstructionPath: [...string]
	createdAt: string
}
