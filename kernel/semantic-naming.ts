import type { GovernedTask } from "./types.ts";

export interface SemanticNameEntry {
  canonical: string;
  aliases: string[];
  scope: "task" | "schema" | "baml" | "runtime" | "doc" | "skill";
}

export interface DeprecatedTermRule {
  term: string;
  replacement: string;
  allowedWhen: string[];
}

export interface NamingLintFinding {
  location: string;
  term: string;
  message: string;
}

export const DEFAULT_DEPRECATED_TERMS: DeprecatedTermRule[] = [
  {
    term: "reentry",
    replacement: "reentry translation, session grounding, export/ingest, or closeout depending on context",
    allowedWhen: ["historical", "translation", "archive", "v1.1.1"]
  },
  {
    term: "handoff package",
    replacement: "bounded export",
    allowedWhen: ["historical", "translation", "archive"]
  }
];

export function lintSemanticNames(input: {
  texts: Array<{ location: string; text: string }>;
  deprecatedTerms?: DeprecatedTermRule[];
}): NamingLintFinding[] {
  const rules = input.deprecatedTerms ?? DEFAULT_DEPRECATED_TERMS;
  const findings: NamingLintFinding[] = [];

  for (const item of input.texts) {
    const lower = item.text.toLowerCase();
    for (const rule of rules) {
      if (!lower.includes(rule.term.toLowerCase())) continue;
      const allowed = rule.allowedWhen.some((word) => lower.includes(word.toLowerCase()));
      if (!allowed) {
        findings.push({
          location: item.location,
          term: rule.term,
          message: `${rule.term} should be named as ${rule.replacement}.`
        });
      }
    }
  }

  return findings;
}

export function taskTitleNamingInputs(tasks: GovernedTask[]): Array<{ location: string; text: string }> {
  return tasks.map((task) => ({ location: task.id, text: task.title }));
}
