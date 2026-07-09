package schemas

#TaskStatus: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "done" | "rejected" | "archived"
#AuthorityLevel: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "final" | "rejected" | "archived"

#MutationTransactionRecord: {
	id: string
	taskId: string
	fromStatus: #TaskStatus
	toStatus: #TaskStatus
	fromAuthority: #AuthorityLevel
	toAuthority: #AuthorityLevel
	evidence: [...string]
	ledgerArtifactIds: [...string]
	checkpointId: string
	rollbackStatus: #TaskStatus
	rollbackAuthority: #AuthorityLevel
	createdAt: string
}
