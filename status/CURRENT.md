# Current Status

**Last Updated:** 2025-12-17

---

## Project 13: spl Tooling and Release Documentation

**Target:** v0.2.0

### Current Focus

**Next:**
- Fix tools/git and tools/7zip selfeval failures (instantiates mismatch)
- Distribute tests to specific containers (spl/api, spl/wrapper, etc.)
- Create tools/gh wrapper
- Design spl/source native API (submit, pr, release workflows)

**Done This Session:**
- Command runner container-relative paths: `module.getMethod().replace('/selfeval', command)`
- selfeval-all.js script: tree selfeval for container + descendants
  - `--detail` shows breakdown for all
  - `--failFast` stops at first failure, shows detail for that container
- Reqs for selfeval_tests_lib, selfeval_command_test_runner
- Fixed report.js manifest (buildApi → buildChildren)
- get-started refactored to AI-first JSON:
  - `docs/get-started/*.json` - structured source files
  - `spl get-started [topic]` - human-readable rendering
  - `spl get-started [topic] --raw` - pure JSON output
  - Topics: intro, introspection, validation, crud, scripts

### Known Failures

```
spl selfeval-all tools --failFast
  tools/7zip | FAIL - container: expected spl/api, got spl/wrapper
  tools/git | FAIL - container: expected spl/api, got spl/wrapper
```

---

## Session Entry

1. Read this file
2. Run `spl get-started` for command reference
3. Run `spl selfeval-all spl --failFast` to verify system health

---

## Quick Reference

```
spl selfeval-all spl              # Validate entire tree
spl selfeval-all spl --failFast   # Stop at first failure
spl get-started                   # Command reference (topics: validation, crud, etc.)
spl get-started validation        # Topic-specific help
```

---

## Session Tips

### AI-First Principle

Optimize for AI consumption. Use JSON for structured data, not markdown. Humans get rendered output, AI gets structured data.

### Collab Mode

Discuss before implementing. Splectrum has an organic approach - build, use, discover gaps, fix. Don't assume external conventions apply. If in doubt, ask.

### Wrapper vs Method

- `tools/git status` → Wrapper passthrough (args go to git)
- `tools/git/whoami` → Standard splectrum method call

### Fixing Schema Inheritance Drift

```bash
spl <container>/update --dryRun   # Preview changes
spl <container>/update            # Apply fixes
```
