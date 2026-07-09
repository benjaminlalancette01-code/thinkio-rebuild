import type { FrictionSignal, FrictionStatus } from "./types.ts";

const frictionTransitions: Record<FrictionStatus, FrictionStatus[]> = {
  active: ["reviewing", "deferred", "rejected"],
  reviewing: ["resolved", "deferred", "rejected"],
  resolved: [],
  deferred: ["active", "rejected"],
  rejected: []
};

export function canTransitionFrictionSignal(from: FrictionStatus, to: FrictionStatus): boolean {
  return frictionTransitions[from]?.includes(to) ?? false;
}

export function explainFrictionSignalBlockers(signal: FrictionSignal): string[] {
  const blockers: string[] = [];

  if (!signal.observedLocation) {
    blockers.push(`Friction signal ${signal.id} requires an observed location.`);
  }

  if (!signal.pattern.trim()) {
    blockers.push(`Friction signal ${signal.id} requires a pattern.`);
  }

  if (!signal.cause.trim()) {
    blockers.push(`Friction signal ${signal.id} requires a cause.`);
  }

  if (!signal.missingSurface.trim()) {
    blockers.push(`Friction signal ${signal.id} requires a missing surface.`);
  }

  if (!signal.recommendation.trim()) {
    blockers.push(`Friction signal ${signal.id} requires a recommendation.`);
  }

  return blockers;
}

export function validateFrictionSignal(signal: FrictionSignal): boolean {
  return explainFrictionSignalBlockers(signal).length === 0;
}
