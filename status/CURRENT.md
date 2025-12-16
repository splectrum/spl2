# Current Status

**Last Updated:** 2025-12-17

---

## Project 13: spl Tooling and Release Documentation

**Target:** v0.2.0

### Current Focus

**In Progress - Data Test Runner:**
- Update command runner to support container-relative paths (`/whoami` → `spl/container/whoami`)
- Need to add `containerPath` to module settings (currently reading from index.json)
- Update test files to use `/` prefix pattern for self-referential tests
- Distribute tests to specific containers (spl/api, spl/wrapper, etc.)

**Then:**
- Create tools/gh wrapper
- Design spl/source native API (submit, pr, release workflows)

**Done This Session:**
- Fixed whoami per-level facets (direct reads, not overlay)
- Fixed whoami inherited method resolution (`spl/api/set` → `spl/crud/set`)
- Fixed `resolveOverlay` method resolution for any subPath (not just index.js)
- Created data test framework:
  - `spl/introspection/_lib/selfeval_tests.js` - test runner
  - `spl/introspection/selfeval/_selfevals/test_runners/command.js` - command runner
  - `spl/container/_tests/method_resolution.json` - 3 passing tests
  - Tests runner registered in `spl/container/_selfevals/`
- Fixed spl/wrapper `_reqs/index.json` schema
- Fixed spl/wrapper schemas inheritance drift

### Recent

- Created `design/INTEGRATION_DESIGN.md` (MCP, Pear/P2P, AVRO RPC)
- Created `design/SYNTHESIS_DESIGN.md` (doc synthesis, AI context)
- Updated `TOOLS_PRODUCT_SET.md` (tiered priorities, script helpers)
- Fixed `isWrapper()` in cli.js (--help/--meta now work on inherited methods)

---

## Session Entry

1. Read this file
2. Run `spl get-started` for command reference
3. Run `spl spl/wrapper/selfeval --meta=detail` to verify system health

---

## Quick Reference

```
spl spl/container/selfeval              # Verify system
spl spl/wrapper/selfeval --meta=detail  # Check wrapper issues
spl spl/container/whoami --levels=all   # Full type chain
spl get-started                         # Command reference
```

---

## Session Tips

### Debugging with Inline Scripts

```bash
spl '/* test */
const cli = await module.require("lib/spl/cli")
module.output(cli.isWrapper("tools/git"))
'
```

### Selfeval Flags

- `--meta=detail` - Shows individual runner results
- `--meta=report` - Raw JSON structure
- `--runner=reqs` - Run specific runner only
- `--levels=spl/container` - Run specific level only

### Collab Mode

Discuss before implementing. Splectrum has an organic approach - build, use, discover gaps, fix. Don't assume external conventions apply. If in doubt, ask.

### Wrapper vs Method

- `tools/git status` → Wrapper passthrough (args go to git)
- `tools/git/whoami` → Standard splectrum method call

Passthrough only applies to API handler invocation, not child methods.

### Fixing Schema Inheritance Drift

When selfeval reports "schemas inheritance | FAIL - drift detected", run update:

```bash
spl <container>/update --dryRun   # Preview changes
spl <container>/update            # Apply fixes
```

Update auto-syncs inherited fields (adds missing, fixes docs/defaults) while preserving extension fields.
