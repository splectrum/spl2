# Current Status

**Last Updated:** 2025-12-18

---

## Project 13: spl Tooling and Release Documentation

**Target:** v0.2.0

### Current Focus

**Next:**
- Distribute tests to specific containers (spl/api, spl/wrapper, etc.)
- Create tools/gh wrapper

**Done This Session:**
- All selfeval passes (21/21)
- Registered spl/_lib/spl.js and spl/_schemas/input.avsc, output.avsc
- Fixed spl/crud/set/_schemas/input.avsc registration
- Improved selfeval freetext output (file/check level details)
- Improved schema error messages (shows schema filename)
- Removed old req version selfeval_method_v1.0.0.md
- Cleaned up invalid fields from spl/method, spl/modules
- Updated CLAUDE.md: mandatory session entry, never guess commands

### Known Failures

```
spl selfeval-all spl --failFast
  PASS | 21/21
```

### Observations / Corrections

**Runner location** - _selfevals/index.json references files by name but they're in _lib/. Should be relative to container. (Correction needed)

**Status semantics** - Use SKIP for "no data to run with" (can't run when nothing to run). Clearer than NONE.

**instanceRunners** - For containers that have the type in their instantiates stack. Clarifies: runners = all descendants, instanceRunners = direct instances only.

**Tests scope** - Add tests to the right type level. Tests at spl/container run for ALL containers - scope by placing at appropriate type.

---

## Session Entry

1. `spl get-started` - operational reference
2. Read this file for current project status
3. `spl selfeval-all spl --failFast` - verify system health
