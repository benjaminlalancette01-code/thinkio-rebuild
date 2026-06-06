package schemas

#TaskMode: "brainstorm" | "plan" | "build" | "review" | "freeze" | "execute"

#ContextPacket: {
	taskId: string
	mode: #TaskMode
	allowedContext: [...string]
	blockedContext: [...string]
	includedFiles: [...string]
	excludedFiles: [...string]
	sourceAuthorities?: [string]: string
	modeFilteredFiles?: [...string]
}

#ContextSourceRule: {
	path: string
	authority: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "final" | "rejected" | "archived"
	modes: [...#TaskMode]
}
