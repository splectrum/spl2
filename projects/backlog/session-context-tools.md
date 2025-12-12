# Session/Context Tools

**Created:** 2025-12-12
**Source:** Project 11 design discussion (session_tool_idea_2025-12-12.md)
**Priority:** Medium
**Dependencies:** Wrapper APIs (for rich context)

---

## Problem

Context recovery at session start is a friction point:
- Re-reading files to understand where we left off
- Reconstructing what decisions were made
- Figuring out what changed and why
- AI context limits mean losing nuance between sessions

## Vision

A session tool that captures and summarizes working state, reducing re-reading and enabling efficient context recovery.

## Key Components

### 1. Snippet Extraction (RAG/Vibe Engineering)

Not just "what files changed" but "what's relevant now":
- Extract meaningful snippets from changed files
- Prioritize recent decisions, open questions, current state
- Vibe engineering approach - context that helps AI pick up where it left off
- Avoid overwhelming with full file contents

### 2. File State Tracking with Post-Action Diffs

Track what changed without interfering with work:
- Capture baseline state at session start (or checkpoint)
- After work, diff against baseline
- Use **git diff** as the mechanism - already tracks changes, no new tooling needed
- Non-intrusive: doesn't require wrapper APIs for basic operation

### 3. Session Summary Generation

Produce actionable context:
- "We were working on X"
- "These files changed" (with relevant snippets)
- "Open questions were Y, Z"
- "Last actions were..."
- Structured enough for AI consumption, readable for human review

## Implementation Approach

### Phase 1: MVP (git-based)

```bash
spl spl/session/summary
```

Uses existing data:
- `git status` - uncommitted changes
- `git diff` - what changed (with intelligent snippet extraction)
- `CURRENT.md` - explicit status
- Recent commit messages - what was completed

Output: Narrative summary suitable for session start.

### Phase 2: Checkpoints

```bash
spl spl/session/checkpoint --name="before-refactor"
spl spl/session/diff --from="before-refactor"
```

- Named checkpoints (beyond just git commits)
- Diff between checkpoints
- Useful for "what changed since I started this task"

### Phase 3: Rich Context (requires Wrapper APIs)

With spl/git, spl/file wrappers creating records:
- Full audit trail of operations
- "What methods were called"
- "What searches were performed"
- Richer context than file diffs alone

## Technical Notes

### Git Diff as Foundation

Git diff provides:
- Changed files list
- Line-level changes
- Staged vs unstaged distinction
- Comparison against any commit/branch

This is sufficient for MVP without new infrastructure.

### Snippet Extraction Strategy

Not all changes are equally relevant:
- Prioritize: _reqs, CURRENT.md, design docs, index.json
- De-prioritize: generated files, large diffs
- Extract: headlines, decisions, open questions
- Truncate: large changes with "and N more lines"

### Non-Intrusive Design

Critical: tool must not interfere with normal workflow
- No mandatory "start session" command
- Works with whatever git state exists
- Checkpoints are optional enhancement
- Can run anytime, not just session boundaries

## Success Criteria

1. Session start time reduced - less re-reading needed
2. Context quality improved - AI picks up effectively
3. Non-intrusive - doesn't add ceremony to workflow
4. Works with existing tools - git, CURRENT.md patterns

## Open Questions

- How much context is useful vs overwhelming?
- Should snippets be AI-generated summaries or raw extracts?
- Integration with CURRENT.md - auto-update or separate?
- Storage/cleanup of checkpoint data?

## Related

- Design doc: `projects/11-app-architecture/notes/session_tool_idea_2025-12-12.md`
- Wrapper APIs backlog item (enables Phase 3)
- CURRENT.md patterns (complements this tool)
