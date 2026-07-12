# Project Material Search And Retrieval

Date: 2026-07-10

## Purpose

ThinkIO can search project material after that material has been classified.

Search is not authority. Search results carry retrieval boundaries so a user can see whether a result is canonical, generated, historical, imported, review-needed, or rejected reference.

## Search Sources

Search reads classified material records from:

- `state/project.materials.json`

The generated knowledge index is:

- `state/project.knowledge-index.json`

## Retrieval Boundary

Search results must preserve authority labels:

- canonical source is safe to retrieve as governed project state;
- generated projection is derived state only;
- historical evidence is context, not current authority;
- review-needed import is unaccepted evidence;
- rejected reference is audit context only.

## Plugin Surface

The VS Code extension now includes:

- `thinkio.projectNavigation`;
- `thinkio.searchProjectMaterials`;
- `plugin.search-project-materials`.

## Current Limit

The current search is local and metadata-based. It searches classified material records, not full document bodies.

Full-text search and retrieval ranking should only be promoted after plugin stress testing proves the need.

