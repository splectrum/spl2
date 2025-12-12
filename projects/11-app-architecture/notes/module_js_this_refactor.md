# module.js Bootstrap Refactor

**Status:** Completed
**Created:** 2025-12-11
**Completed:** 2025-12-12

## Summary

Refactored module.js to use the same `create(module)` signature as all other libs, eliminating the special-case `create(record)` pattern.

## Changes Made

### 1. moduleBootstrap.js

Now creates a **bootstrap module** with minimal interface:
- `getNodeRoot()` - derived from file location
- `getModulesDir()` - splectrum modules directory
- `getAppAPI()` / `getAppName()` / `getEnableAppOverlay()` - null/false at bootstrap
- `require(uri)` - platform modules only via `import()`

The bootstrap module is passed to `module.js create()` using the standard lib signature.

### 2. module.js

Changed from `create(record)` to `create(bootstrapModule)`:

```javascript
export function create(bootstrapModule) {
  // Platform modules loaded via bootstrap.require
  let _fs = null, _path = null

  const getFs = async () => {
    if (!_fs) _fs = await bootstrapModule.require('fs')
    return _fs
  }

  // ... record binding via bindRecord() ...

  return {
    async init() { /* load fs, path */ },
    bindRecord(record) { /* bind request record */ },
    async createForRecord(record) { /* factory for new instances */ },
    // ... all other methods using `this` for self-reference
  }
}
```

Key additions:
- `init()` - loads platform modules (fs, path), must be called before other methods
- `bindRecord(record)` - binds a request record after initialization
- `createForRecord(record)` - factory method for creating new module instances with different records

### 3. spl.mjs

Updated to use new pattern:
```javascript
const module = await loadModule('cli-static')
await module.init()
module.bindRecord(record)
```

### 4. cli-static-session/start

Updated to use `module.createForRecord(record)` instead of `moduleLib.create(record)` for processing incoming requests.

### 5. Require simplification

Platform modules now use direct `import()`:
```javascript
if (!uri.includes('/')) {
  return import(uri).then(m => m.default ?? m)
}
```

package.json `imports` field handles Node/Bare mapping automatically.

## Architecture

```
moduleBootstrap.js
  └── creates bootstrap module (minimal: nodeRoot, modulesDir, platform require)
  └── calls module.js create(bootstrapModule)

module.js create(bootstrapModule)
  └── returns module with init(), bindRecord(), createForRecord()

spl.mjs
  └── loadModule() → module.init() → module.bindRecord(record)
```

## Benefits

1. **Single pattern** - all libs use `create(module)` signature
2. **Clean bootstrap** - bootstrap module provides just enough for initialization
3. **Flexible binding** - record can be bound after initialization
4. **Factory support** - createForRecord() enables multiple independent instances
5. **Simplified require** - platform modules via direct import, SPL patterns via custom logic

## Testing

All selfevals pass:
- `spl spl/selfeval --levels=all` ✓
- `spl spl/container/selfeval --levels=all` ✓
- `spl spl/api/selfeval --levels=all` ✓
- `spl spl/method/selfeval --levels=all` ✓
- `spl spl/package/selfeval --levels=all` ✓
- `spl spl/module/selfeval --levels=all` ✓
- `spl spl/modules/selfeval --levels=all` ✓
- `spl spl/container/whoami/selfeval --levels=all` ✓
