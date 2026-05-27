package schemas

#TaskStatus: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "done" | "rejected" | "archived"
#TaskMode: "brainstorm" | "plan" | "build" | "review" | "freeze" | "execute"
#AuthorityLevel: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "final" | "rejected" | "archived"

#GovernedTask: {
	id: string
	title: string
	mode: #TaskMode
	status: #TaskStatus
	authority: #AuthorityLevel
	dependencies: [...string]
	allowedContext: [...string]
	blockedContext: [...string]
	requiredEvidence: [...string]
	promotionRule: "all-required-evidence-present"
	checkpointRequired: bool
}

