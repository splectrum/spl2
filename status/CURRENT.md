# Current Status

**Last Updated:** 2025-12-18

---

## Project 13: spl Tooling and Release Documentation

**Target:** v0.2.0

### Current Focus

**COMPLETED: Require Refactor (Phase 1 & 2)**

Separated SPL requires from npm requires. See `status/require_refactor_plan.md` for details.

Phase 1 (DONE): All 33 files switched from `module.require('fs')` to native imports
Phase 2 (DONE): module.js cleaned up, bootstrap passes initial record

Key changes:
- `module.require()` is now SPL-only (scripts, libs, commands)
- Native `import` for npm modules (fs, path, child_process, avsc)
- `await import()` for scripts (dynamically evaluated)
- Bootstrap passes initial record with `headers.spl.runtime.{nodeRoot, modulesDir}`
- No runtime bootstrap dependency

**Next: Phase 3 or other tasks**
- Phase 3: Move npm requires from methods to libs, add selfeval validator
- Create promote-script to publish scripts to splectrum node scripts folder
- Create container map script
- Link map script from get-started
- Create tools/gh wrapper

### Files Changed (uncommitted)

See `git status` for full list. Key changes:

**Bootstrap/Module refactor:**
- `lib/moduleBootstrap.js` - passes initial record instead of bootstrapModule
- `_lib/module.js` - uses native imports, receives initial record

**Libs (native import at top):**
- 19 lib files switched from `module.require('fs')` to `import fs from 'fs'`

**Methods (native import, will move to libs in Phase 3):**
- 12 method files switched to native imports

**Scripts (await import):**
- `scripts/selfeval-all.js`, `get-started.js`, `status.js` use `await import()`

### Known Failures

```
spl selfeval-all spl --failFast
  PASS | 21/21
```

---

## Session Entry

1. `spl get-started` - operational reference
2. Read this file for current project status
3. `spl selfeval-all spl --failFast` - verify system health
