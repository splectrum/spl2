**Requirements:** projects/08-dev-environment-api/exploration_project_v1.1.0.md

# Project 12: Wrapper APIs

**Type:** Exploration Project
**Created:** 2025-12-12
**Status:** Initiated

---

## Overview

Wrap existing tools (git, file system, search) within splectrum context. Same functionality, but operations create records that enable audit trails, session tracking, context recovery, and replay/undo.

## Problem

Operations via external tools leave no record in splectrum:
- Git operations via Bash → no record
- File edits via Claude tools → no record in SPL
- Searches → no trace of what was looked for

This means:
- No audit trail
- No session tracking
- No replay/undo capability
- Limited context recovery

## Vision

Not replacing tools, wrapping them. Git still does git. File ops still use fs. But the wrapper:
1. Creates a record before/after
2. Captures intent (why this operation)
3. Enables aggregation (session tools can query)

## Proposed APIs

### spl/avro
AVRO schema operations - enabling infrastructure for building other wrapper APIs.
- spl/avro/load, spl/avro/validate, spl/avro/clone, spl/avro/registry, spl/avro/types

### spl/git
Git operations wrapper.
- spl/git/status, spl/git/diff, spl/git/commit, spl/git/log, spl/git/branch

### spl/file
File operations wrapper.
- spl/file/read, spl/file/write, spl/file/edit, spl/file/list

### spl/search
Search operations wrapper.
- spl/search/grep, spl/search/glob, spl/search/find

## Products

*To be defined during initiation phase (collaborative)*

## Quality Criteria

*To be defined during initiation phase (collaborative)*

## Success Criteria

1. Operations create queryable records
2. Session tools can aggregate wrapper records
3. No performance penalty for wrapped operations
4. Works alongside direct tool usage

## Open Questions

- Record retention policy? (TTL, session-based, manual cleanup)
- Should wrappers capture stdout/stderr fully or summarize?
- Integration with Claude Code tools? (or separate path)
- Error handling - record failures too?

## Related

- Backlog item: projects/backlog/wrapper-apis.md
- Enables: Session/Context Tools (backlog/session-context-tools.md)
- Design doc: projects/11-app-architecture/notes/session_tool_idea_2025-12-12.md
