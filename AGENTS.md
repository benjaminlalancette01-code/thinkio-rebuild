# Agent Rules

- Work only inside `thinkio-rebuild` unless explicitly instructed otherwise.
- Do not read the full archive unless a governed task names a specific file or concept.
- Do not promote archive files directly. Extract concepts only, then rewrite them into the clean structure.
- Preserve filetype roles: Markdown explains, JSON stores operational truth, CUE validates, TypeScript enforces behavior, BAML under `contracts/baml/` structures model contracts.
- Keep the kernel small and readable.
- Every new runtime behavior must pass through the gate.
- Do not activate a full runtime without explicit human approval.
- Integrate legacy material by missing kernel capability, not by version.
- Use the import path: old source file, candidate concept, mapped kernel capability, rewritten task, schema/runtime/test, accepted into rebuild.
- Use one old concept per task. No broad migration, version integration, archive cleanup, or autonomous archive promotion.
- Every imported concept must become a type, schema, runtime rule, task, test, view projection, BAML contract, or glossary entry. Otherwise reject it with a reason.
