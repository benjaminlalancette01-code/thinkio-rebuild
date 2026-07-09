const defaultViewState = {
  selectedRecord: undefined,
  collapsedGroupIds: [],
  layoutHints: {},
  zoom: 1,
  pan: { x: 0, y: 0 },
  traceMode: "execution",
  refreshedAt: undefined
};

export function createWorkspaceStateStore(workspaceState) {
  return {
    getViewState(viewId) {
      return workspaceState.get(key(viewId), { ...defaultViewState });
    },
    async updateViewState(viewId, patch) {
      const current = this.getViewState(viewId);
      const next = sanitizeViewState({ ...current, ...patch });
      await workspaceState.update(key(viewId), next);
      return next;
    },
    async clearViewState(viewId) {
      await workspaceState.update(key(viewId), undefined);
    }
  };
}

export function sanitizeViewState(state) {
  return {
    selectedRecord: state.selectedRecord,
    collapsedGroupIds: Array.isArray(state.collapsedGroupIds) ? state.collapsedGroupIds : [],
    layoutHints: state.layoutHints && typeof state.layoutHints === "object" ? state.layoutHints : {},
    zoom: Number.isFinite(state.zoom) && state.zoom > 0 ? state.zoom : 1,
    pan: {
      x: Number.isFinite(state.pan?.x) ? state.pan.x : 0,
      y: Number.isFinite(state.pan?.y) ? state.pan.y : 0
    },
    traceMode: state.traceMode === "trace" ? "trace" : "execution",
    refreshedAt: state.refreshedAt
  };
}

function key(viewId) {
  return `thinkio.viewState.${viewId}`;
}
