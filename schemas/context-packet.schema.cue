package schemas

#TaskMode: "brainstorm" | "plan" | "build" | "review" | "freeze" | "execute"

#ContextPacket: {
	taskId: string
	mode: #TaskMode
	allowedContext: [...string]
	blockedContext: [...string]
	includedFiles: [...string]
	excludedFiles: [...string]
}

