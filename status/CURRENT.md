# Current Status

**Last Updated:** 2025-12-16

---

## Status: Project 13 In Progress

**Project 13: spl Tooling and Release Documentation** - In Progress

**Target:** v0.2.0

### Twin Pairs

1. **Tool Coverage** - Replace non-spl tools with spl equivalents live, test/improve existing
2. **Request/Response Capture** - Formalize faf/event gathering
3. **Release Doc Generator** - Tool to generate docs from releases

### Current

Twin Pair 1 - wrapper and CRUD fixes complete, ready for next tool coverage work

### Done This Session

**Schema-driven wrapper parsing (v0.2.0):**
- Updated `spl/wrapper/_schemas/input.avsc` to record type with args, dryRun, silent
- Updated `cli.js parseArgs()` to extract splectrum flags from schema, quote remaining args
- Updated `cli.js rewriteHelp()` to skip wrappers (--help passes through to tool)
- Simplified tools/git and tools/7zip handlers (just use `input.args` directly)
- Removed `lib/spl/wrapper` (no longer needed - cli.js handles all parsing)
- Updated `spl_wrapper_type_v1.0.0.md` with new design and help behavior

**Help behavior for wrappers:**
- `spl tools/git --help` → shows git's help (passthrough)
- `spl tools/git/whoami` → shows splectrum wrapper info

**Work module path fix (v0.2.0):**
- Created `lib/spl/crud` library with `getWorkModulePath()` for dynamic resolution
- Updated hierarchy.json req: only one work_module allowed at any time
- Updated CRUD methods (create, delete, set, lift) to use dynamic path from hierarchy.json
- Fixed lift/_lib/lift.js to check `layer.type === 'work_module'` not name

**Previous commit:** bf5c486

---

## Previous: Project 12 Complete

**Project 12: Wrapper APIs** - Closed

### Release: splectrum_v0.1.0

First versioned release achieved:
- Module at `splectrum/modules/splectrum_v0.1.0`
- Registered in `splectrum/modules/hierarchy.json`
- Archive at `releases/archive/splectrum_v0.1.0`
- work_module deregistered from app hierarchy

---

## Session Entry

1. Read this file
2. Run `spl get-started` for command reference
3. Check `projects/BACKLOG.md` for next priority
4. Run `spl spl/container/selfeval` to verify system health

---

## Quick Reference

```
spl spl/container/selfeval          # Verify system
spl spl/container/whoami --levels=all   # Full type chain
spl get-started                     # Command reference
```
