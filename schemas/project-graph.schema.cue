package schemas

#ProjectGraphNode: {
	id: string
	type: string
	label: string
}

#ProjectGraphEdge: {
	from: string
	to: string
	label: string
}

#ProjectGraph: {
	nodes: [...#ProjectGraphNode]
	edges: [...#ProjectGraphEdge]
}
