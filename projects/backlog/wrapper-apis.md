# Wrapper APIs

**Created:** 2025-12-12
**Source:** Project 11 design discussion
**Priority:** High
**Dependencies:** None
**Enables:** Session/Context Tools, audit trails, replay/undo

---

## Problem

Operations via external tools (git, file system, search) leave no record in splectrum:
- Git operations via Bash → no record
- File edits via Claude tools → no record in SPL
- Searches → no trace of what was looked for

This means:
- No audit trail
- No session tracking
- No replay/undo capability
- Limited context recovery

## Vision

Wrap existing tools within splectrum context. Same functionality, but operations create records that enable:
- Audit trails (what happened)
- Session tracking (what did we do)
- Context recovery (what were we working on)
- Replay/undo (do it again, or reverse it)

## Key Insight

**Not replacing tools, wrapping them.** Git still does git. File ops still use fs. But the wrapper:
1. Creates a record before/after
2. Captures intent (why this operation)
3. Enables aggregation (session tools can query)

## Proposed APIs

### spl/git

Wraps git operations:

```bash
spl spl/git/status              # git status, creates record
spl spl/git/diff                # git diff, creates record
spl spl/git/commit --message="" # git commit, creates record
spl spl/git/log --limit=10      # git log, creates record
spl spl/git/branch              # branch operations
```

**Records capture:**
- Command executed
- Output/result
- Timestamp
- Context (current method, record ID)

### spl/file

Wraps file operations:

```bash
spl spl/file/read --path=""     # read file, record what was read
spl spl/file/write --path=""    # write file, record before/after
spl spl/file/edit --path=""     # edit file, record diff
spl spl/file/list --path=""     # list directory, record query
```

**Records capture:**
- Operation type
- Path(s) affected
- Before/after state (for writes)
- Timestamp, context

### spl/search

Wraps search operations:

```bash
spl spl/search/grep --pattern="" --path=""   # grep, record what was searched
spl spl/search/glob --pattern=""             # glob, record pattern
spl spl/search/find --name=""                # find, record query
```

**Records capture:**
- Search pattern
- Scope (path)
- Results (or result count)
- Timestamp, context

## Implementation Approach

### Phase 1: spl/git (highest value)

Git operations are frequent and high-signal:
- "What changed" is fundamental context
- Commit history tells story of work
- Diff shows current state

Start here, validate pattern, then expand.

### Phase 2: spl/file

File operations are next most valuable:
- "What files were touched" answers many questions
- Before/after enables undo thinking
- Read tracking shows exploration path

### Phase 3: spl/search

Search tracking completes the picture:
- "What were we looking for" provides intent
- Failed searches as valuable as successful ones
- Pattern of exploration reveals thinking

## Technical Notes

### Record Structure

```json
{
  "headers": {
    "spl": {
      "wrapper": {
        "tool": "git",
        "operation": "diff",
        "timestamp": "2025-12-12T10:30:00Z",
        "context": {
          "method": "spl/container/create",
          "recordId": "abc123"
        }
      }
    }
  },
  "value": {
    "command": "git diff",
    "args": ["--staged"],
    "result": "...",
    "exitCode": 0
  }
}
```

### Storage

Records written to runtime topic (like other SPL records):
- Queryable by session tools
- Follows event sourcing pattern
- Cleanup via TTL or explicit purge

### Non-Intrusive Option

Wrappers should be optional enhancement:
- Direct git/file ops still work
- Wrappers add value, don't gate functionality
- Gradual adoption possible

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

- Session/Context Tools (primary consumer)
- Design doc: `projects/11-app-architecture/notes/session_tool_idea_2025-12-12.md`
- Event sourcing patterns from Project 10
