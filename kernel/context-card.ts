import type {
  ContextCard,
  ContextCardPromotionTarget,
  ContextDependency,
  ContextDependencyTargetKind
} from "./types.ts";

export function validateContextDependencies(dependencies: ContextDependency[]): boolean {
  return explainContextDependencyBlockers(dependencies).length === 0;
}

export function explainContextDependencyBlockers(dependencies: ContextDependency[]): string[] {
  const blockers: string[] = [];
  const ids = new Set<string>();

  for (const dependency of dependencies) {
    if (!dependency.id) {
      blockers.push("Context dependency id is required.");
      continue;
    }

    if (ids.has(dependency.id)) {
      blockers.push(`Duplicate context dependency id: ${dependency.id}.`);
    }
    ids.add(dependency.id);

    if (!dependency.fromId || !dependency.toId) {
      blockers.push(`Context dependency ${dependency.id} requires both endpoints.`);
    }

    if (dependency.fromKind === dependency.toKind && dependency.fromId === dependency.toId) {
      blockers.push(`Context dependency ${dependency.id} cannot point to itself.`);
    }
  }

  return blockers;
}

export function validateContextCard(card: ContextCard): boolean {
  return explainContextCardBlockers(card).length === 0;
}

export function explainContextCardBlockers(card: ContextCard): string[] {
  const blockers: string[] = [];

  if (!card.id) {
    blockers.push("Context card id is required.");
  }

  if (!card.attachment.id) {
    blockers.push(`Context card ${card.id} requires an attachment id.`);
  }

  if (!card.body.trim()) {
    blockers.push(`Context card ${card.id} requires body text.`);
  }

  if (card.status === "promoted" && card.promotionTargets.length === 0) {
    blockers.push(`Context card ${card.id} cannot be promoted without a promotion target.`);
  }

  if (["frozen", "executable", "final"].includes(card.authority) && card.status !== "promoted") {
    blockers.push(`Context card ${card.id} cannot carry ${card.authority} authority before promotion.`);
  }

  return blockers;
}

export function canPromoteContextCard(
  card: ContextCard,
  target: ContextCardPromotionTarget,
  evidence: string[]
): boolean {
  return explainContextCardPromotionBlockers(card, target, evidence).length === 0;
}

export function explainContextCardPromotionBlockers(
  card: ContextCard,
  target: ContextCardPromotionTarget,
  evidence: string[]
): string[] {
  const blockers = explainContextCardBlockers(card);

  if (card.status !== "reviewed") {
    blockers.push(`Context card ${card.id} must be reviewed before promotion.`);
  }

  if (!card.promotionTargets.includes(target)) {
    blockers.push(`Context card ${card.id} cannot promote to ${target}.`);
  }

  if (!evidence.includes("context-card-reviewed")) {
    blockers.push(`Context card ${card.id} is missing review evidence.`);
  }

  return blockers;
}

export function createContextDependency(
  id: string,
  fromKind: ContextDependencyTargetKind,
  fromId: string,
  toKind: ContextDependencyTargetKind,
  toId: string,
  relationship: ContextDependency["relationship"]
): ContextDependency {
  return { id, fromKind, fromId, toKind, toId, relationship };
}
