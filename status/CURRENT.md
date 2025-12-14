# Current Status

**Last Updated:** 2025-12-14

---

## Status: Project 12 Active

**Project 12: Wrapper APIs** - Exploration Project

### Objective

Wrap existing tools (git, file, search) within splectrum context. Platform-agnostic (Node/Bare).

### Current Phase

**Execution phase.** Container infrastructure improvements complete. Ready to resume wrapper APIs.

### Completed This Session

**--usage fix (input.avsc resolution):**
- Fixed whoami --usage to find input.avsc through type stack, not via manifest
- Manifests (`_schemas/index.json`) are layer-local; files resolve through full stack
- whoami builds all levels, finds first with input.avsc, displays that level
- `spl spl/container/selfeval --help` now works even with empty local manifest

**spl/container/selfeval cleanup:**
- Added `_schemas/index.json` (empty files map)
- Removed legacy `schemas.json` file

**spl get-started script:**
- Created `scripts/get-started.js` - quick reference for common commands
- Run with `spl get-started`

**CLAUDE.md trimmed:**
- Removed verbose sections (How Documentation Works, Key Patterns, examples)
- Replaced SPL Commands section with reference to `spl get-started`
- Down from 192 to 79 lines

### Key Commands

```bash
spl get-started                    # Quick reference
spl spl/container/selfeval         # Validate container
spl spl/container/selfeval --help  # Show inherited flags
```

### Pending

**Future:**
- Refactor spl/container hierarchy (spl/introspection ← spl/crud ← spl/container)

### Parked: spl/http API

Reqs written, resume after container infrastructure complete.

---

## Session Entry

1. Read this file
2. Run: `spl spl/container/selfeval` (should pass)
3. Run: `spl get-started` (quick reference)
