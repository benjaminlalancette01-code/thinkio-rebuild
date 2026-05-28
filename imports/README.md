# Imports

This workspace tracks concept-level imports only.

Old source files stay outside the rebuild or are referenced through `archive-index/`. Do not copy legacy folders here.

Import path:

```text
old version file -> candidate concept -> mapped kernel capability -> rewritten new task -> schema/runtime/test -> accepted into rebuild
```

Folders:

- `candidates/`: concept notes before implementation.
- `accepted/`: concept summaries accepted after tests pass.
- `rejected/`: concepts rejected with a short reason.

