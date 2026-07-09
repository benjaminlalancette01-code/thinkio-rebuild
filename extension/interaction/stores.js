export function createInteractionStores(workspaceState) {
  return {
    interactionLog: createAppendOnlyStore(workspaceState, "thinkio.interactionLogs"),
    taskProposal: createAppendOnlyStore(workspaceState, "thinkio.taskProposals")
  };
}

export function createAppendOnlyStore(workspaceState, key) {
  return {
    getAll() {
      return workspaceState.get(key, []);
    },
    async append(record) {
      const records = this.getAll();
      const next = [
        ...records,
        {
          ...record,
          id: record.id ?? `${key}.${Date.now()}`,
          canonicalStateMutation: false,
          createdAt: record.createdAt ?? new Date().toISOString()
        }
      ];
      await workspaceState.update(key, next);
      return next.at(-1);
    }
  };
}
