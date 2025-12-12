# Session/Context Tool Idea

**Date:** 2025-12-12
**Status:** Idea for future project

## The Problem

Context recovery at session start is a friction point. We spend time:
- Re-reading files to understand where we left off
- Reconstructing what decisions were made
- Figuring out what changed and why

## The Solution

A session tool that captures and summarizes working state.

### Simple MVP

`spl spl/session/summary` - derives state from what exists:
1. Recent git changes (uncommitted)
2. CURRENT.md contents
3. Recent records from runtime/
4. Outputs a "here's where you are" narrative

No explicit save needed - reads existing data.

### Full Version

**Capture (end of session):**
```bash
spl spl/session/save --name="container-lifecycle"
```
- Snapshots: what files were touched, what methods were called
- Captures: current CURRENT.md, todo state, recent decisions
- Stores: in `runtime/sessions/`

**Resume (start of session):**
```bash
spl spl/session/resume --name="container-lifecycle"
```
- Outputs: structured summary of where we left off
- Lists: files changed, decisions made, open questions
- Shows: last N actions/outputs

### What It Provides

- "We were working on X"
- "We changed these files"
- "Open questions were Y, Z"
- "Last thing we did was..."
- Tailored audit trail of the session

## Key Insight: Wrapper APIs Enable This

**The prerequisite:** Operations must go through SPL APIs that keep records.

Currently:
- Git operations via Bash → no record
- File edits via Claude tools → no record in SPL

With wrapper APIs:
- `spl/git/commit` → record created
- `spl/file/edit` → record created
- Session tool aggregates all records → full picture

**This is why wrapper APIs matter.** They're not just convenience - they enable:
- Audit trails
- Session tracking
- Replay/undo capabilities
- AI context recovery

## Wrapper APIs Needed

Priority order for session tracking:

1. **spl/git** - status, commit, diff, log, branch
   - Most impactful - git operations are frequent
   - Enables "what changed" queries

2. **spl/file** - read, write, edit, search
   - Track file operations
   - Enables "what files were touched" queries

3. **spl/search** - find files, grep content
   - Track what was searched for
   - Enables "what were we looking for" context

## Implementation Path

1. Start with `spl/session/summary` (MVP) - uses git directly
2. Add `spl/git` wrapper API
3. Enhance session tool to use git records
4. Add more wrapper APIs as needed
5. Build toward full save/resume model

## Open Questions

- How much context is useful vs overwhelming?
- Storage/cleanup of old sessions?
- How to handle long-running work across many sessions?
- Integration with project/backlog tracking?
