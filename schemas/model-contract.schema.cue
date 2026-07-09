package schemas

#TaskStatus: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "done" | "rejected" | "archived"
#TaskMode: "brainstorm" | "plan" | "build" | "review" | "freeze" | "execute"
#AuthorityLevel: "idea" | "candidate" | "accepted" | "frozen" | "executable" | "final" | "rejected" | "archived"
#ContextDependencyTargetKind: "source" | "artifact" | "rule" | "task" | "step" | "branch"
#ModelOutputClass: "informational" | "hypothesis" | "recommendation" | "conflict-signal" | "correction-candidate" | "upgrade-candidate" | "file-action-proposal" | "rejected" | "unknown"

#ProviderIdentity: {
	provider: string
	model?: string
	app?: string
}

#ModelInputContract: {
	id: string
	intent: string
	activeTarget: {
		kind: #ContextDependencyTargetKind
		id: string
	}
	contextBundle: [...string]
	governanceContext: {
		mode: #TaskMode
		authority: #AuthorityLevel
		taskStatus: #TaskStatus
	}
	expectedOutputClasses: [...#ModelOutputClass]
}

#ModelOutputContract: {
	id: string
	inputId: string
	rawOutput: string
	normalizedOutput: string
	outputClass: #ModelOutputClass
	provider: #ProviderIdentity
	warnings: [...string]
	proposedActions: [...string]
}
