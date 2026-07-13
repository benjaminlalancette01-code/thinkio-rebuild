package schemas

#LoadMode: "canonical" | "generated" | "historical" | "archive-evidence" | "external-report" | "working-scratch"

#ProjectIdentity: {
	id: string
	name: string
	workspaceRoot: string
	extensionRoot: string
	archiveRoot?: string
	generatedRoots: [...string]
	currentLoadMode: #LoadMode
}
