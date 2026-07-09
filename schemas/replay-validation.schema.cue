package schemas

#ReplayValidationManifest: {
	id: string
	taskIds: [...string]
	requiredStateFiles: [...string]
	checkpointIds: [...string]
	acceptedArtifactIds: [...string]
	artifactChainIds: [...string]
	projectGraphNodeIds: [...string]
	createdAt: string
}
