# Require Refactor Plan v1.0.0

## Goal

Separate SPL requires from non-SPL (npm) requires:
- `module.require()` - SPL only (scripts, libs, commands)
- Native `import` - non-SPL / npm modules (fs, path, child_process, avsc)

## Architecture Principle

- **Methods** (index.js): top-level flow, orchestration only
- **Libs** (_lib/*.js): implementation logic, npm dependencies
- **Scripts**: may use npm dependencies directly

## Phase 1: Switch non-SPL to native import [COMPLETE]

Change all `module.require('fs')` etc. to native `import` at top of file.

### Files to change (33 files):

**Libs (_lib/*.js):**
- spl/module/_lib/selfeval_module.js (fs, path)
- spl/container/_lib/selfeval_schemas_inheritance.js (fs, path)
- spl/container/_lib/selfeval_schemas.js (fs, path)
- spl/container/_lib/selfeval_container.js (fs, path)
- spl/container/_lib/selfeval_reqs.js (fs, path)
- spl/container/_lib/selfeval_handler.js (fs, path)
- spl/container/_lib/selfeval_schemas_data.js (fs, path)
- spl/container/_lib/selfeval_lib.js (fs, path)
- spl/container/_lib/selfeval_api.js (fs, path)
- spl/crud/_lib/crud.js (fs, path)
- spl/modules/_lib/selfeval_hierarchy.js (fs, path)
- spl/cli/_lib/cli.js (fs, path)
- spl/script/_lib/ai.js (fs, path)
- spl/introspection/_lib/avsc.js (avsc, fs)
- spl/introspection/_lib/selfeval_tests.js (fs, path)
- spl/introspection/_lib/selfeval_final.js (fs, path)
- spl/introspection/_lib/selfeval.js (fs, path)
- spl/introspection/whoami/_lib/whoami.js (fs, path)
- spl/crud/lift/_lib/lift.js (none - already clean)

**Methods (index.js) - temporary, cleaned in Phase 3:**
- tools/git/index.js (child_process)
- tools/7zip/index.js (child_process)
- spl/cli-static-session/start/index.js (fs, path)
- spl/crud/update/index.js (fs, path)
- spl/crud/delete/index.js (fs, path)
- spl/cli-static/execute/index.js (fs, path)
- spl/crud/create/index.js (fs, path)
- spl/introspection/info/index.js (fs)
- spl/crud/lift/index.js (fs, path)
- spl/crud/set/index.js (fs, path)
- spl/introspection/selfeval/index.js (path)
- spl/introspection/selfeval/_selfevals/test_runners/command.js (child_process)

**Scripts (splectrum/scripts/) - use `await import()`:**
Scripts are dynamically evaluated so use `await import()` instead of static `import`.
- selfeval-all.js (child_process, fs, path)
- get-started.js (fs, path)
- status.js (fs, path)

## Phase 2: Clean up module.js [COMPLETE]

1. Remove non-SPL fallback from `module.require()`
2. No-slash URIs = scripts only (throw error if not found)
3. Update JSDoc to reflect SPL-only
4. Remove bootstrap runtime dependency - module.js uses native imports
5. Bootstrap passes initial record, not bootstrapModule object

### Changes to _lib/module.js:

```javascript
// Before:
export function create(bootstrapModule) {
  const getFs = async () => bootstrapModule.require('fs')
  // ... delegated to bootstrap
}

// After:
import fs from 'fs'
import path from 'path'

export function create(initialRecord) {
  // Uses initialRecord.headers.spl.runtime.{nodeRoot, modulesDir}
  // Uses native fs/path imports directly
}
```

### Changes to lib/moduleBootstrap.js:

```javascript
// Before:
function createBootstrapModule(modulesDir) {
  return { getNodeRoot, require, ... }
}
moduleLib.create(bootstrapModule)

// After:
function createInitialRecord(modulesDir) {
  return { headers: { spl: { runtime: { nodeRoot, modulesDir } } } }
}
moduleLib.create(initialRecord)
```

## Phase 3: Move non-SPL to libs/scripts only

Move implementation logic from methods to libs. Methods become thin orchestrators.

### Methods needing refactor:

| Method | Create/Update Lib | Move |
|--------|------------------|------|
| tools/git/index.js | tools/git/_lib/git.js | child_process logic |
| tools/7zip/index.js | tools/7zip/_lib/7zip.js | child_process logic |
| spl/cli-static-session/start/index.js | existing or new lib | fs/path logic |
| spl/crud/*/index.js | spl/crud/_lib/crud.js | extend existing lib |
| spl/cli-static/execute/index.js | new lib | fs/path logic |
| spl/introspection/info/index.js | new lib | fs logic |
| spl/introspection/selfeval/index.js | existing lib | path logic |

### Add selfeval validator:

Create `spl/method/_lib/selfeval_method.js`:
- Scan method index.js for native imports
- FAIL if fs, path, child_process, etc. found
- Methods should only use `module.require()` for SPL

## Docs to update

- spl/script/_reqs/inline_scripts.md
- spl/wrapper/_reqs/spl_wrapper_type_v1.0.0.md
- spl/introspection/_reqs/avsc_lib_v1.1.0.md
- spl/container/_reqs/handler_type_v1.0.0.md

## Verification

After each phase:
```bash
spl selfeval-all spl --failFast
```
