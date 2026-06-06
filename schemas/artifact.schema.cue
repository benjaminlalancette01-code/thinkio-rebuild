package schemas

#ArtifactRecord: {
	id: string
	taskId: string
	path: string
	kind: "document" | "schema" | "kernel" | "state" | "view" | "runtime" | "test" | "contract"
	evidence: [...string]
	createdAt: string
	hash?: string
	dependsOn?: [...string]
}

#ArtifactChainManifest: {
	id: string
	taskId: string
	rootArtifactId: string
	artifactIds: [...string]
	staleArtifactIds: [...string]
	createdAt: string
}
