export interface GovernanceResultViewModel {
  state: string;
  title: string;
  commandId?: string;
  runtimeAction?: string;
  blockers: string[];
  proposalId?: string;
  approvalRequired: boolean;
  reviewable: boolean;
}

export function buildGovernanceResultViewModel(result?: Record<string, unknown>): GovernanceResultViewModel;
