package schemas

#ApprovalRecord: {
	id: string
	taskId: string
	approvedBy: string
	scope: string
	approvedAt: string
}

#ApprovalFile: {
	approvals: [...#ApprovalRecord]
}
