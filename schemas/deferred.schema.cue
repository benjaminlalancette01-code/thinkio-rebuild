package schemas

#DeferredStatus: "deferred" | "ready" | "resumed"

#DeferredItem: {
	id: string
	taskId: string
	reason: string
	deferredBy: string
	deferredAt: string
	resumeAfter?: string
	requiredEvidence: [...string]
	status: #DeferredStatus
}
