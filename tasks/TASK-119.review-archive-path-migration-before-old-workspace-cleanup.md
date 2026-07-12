# TASK-119: Review Archive Path Migration Before Old Workspace Cleanup

Approve how `thinkio-rebuild` should handle references to the old `thinkio_new_session_workspace` path before that workspace is deleted, moved, or replaced.

## Required Work

- List every rebuild file that references `thinkio_new_session_workspace` or old archive paths.
- Decide whether those references should be rewritten to `Thinkio-fullarchive`, preserved as historical absolute paths, or supported by a compatibility pointer.
- Confirm whether the old workspace can be deleted, moved under the canonical archive, or retained as a deprecated compatibility folder.
- Record the decision before applying any rebuild documentation path edits.

## Current Trigger

The full archive cleanup on 2026-07-12 found that `thinkio_new_session_workspace` is mostly duplicated by `Thinkio-fullarchive`, but `audit/v1.1.1-reentry-emulation-runtime-gap-audit-2026-07-01.md` still references the old path directly.
