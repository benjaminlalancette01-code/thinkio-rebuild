package schemas

#ArtifactRecord: {
	id: string
	taskId: string
	path: string
	kind: "document" | "schema" | "kernel" | "state" | "view" | "runtime" | "test" | "contract"
	evidence: [...string]
	createdAt: string
}

