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

