package schemas

#TaskStatus: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "done" | "rejected" | "archived"

#CheckpointRecord: {
	id: string
	taskId: string
	status: #TaskStatus
	evidence: [...string]
	notes: string
	createdAt: string
}

#HandoffRecord: {
	id: string
	taskId: string
	checkpointId: string
	acceptedDecisions: [...string]
	nextValidStep: string
	resumeContext: [...string]
	createdAt: string
}

#CheckpointFile: {
	checkpoints: [...#CheckpointRecord]
}

#HandoffFile: {
	handoffs: [...#HandoffRecord]
}
