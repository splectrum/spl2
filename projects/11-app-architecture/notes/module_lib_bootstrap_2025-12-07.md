# Module Lib Bootstrap Design

**Date:** 2025-12-07
**Status:** Design proposal for implementation

## Problem

Current state has inconsistent interfaces across execution contexts:

```js
// Scripts get:
await fn(record, spl, requireSpl, requireNonSpl)

// Methods get:
await mod.default(record, requireSpl, resolveSpl)

// Libs get:
mod.create(record, { requireNonSpl })
```

Additionally:
- Core utilities (faf, consumeLatest, input, output) are in lib/spl but needed everywhere
- Bootstrap has chicken-and-egg complexity
- Lib resolution doesn't use overlay (hardcoded to bm_spl)

## Solution: Universal `module` Interface

Single universal lib that all execution contexts receive:

```js
// Method
export default async function(module) {
  const input = module.input()
  module.output('Result text', null)
  const path = module.resolve('spl/container', 'README.json')
  module.faf('some/topic', { sync: true })
}

// Lib
export function create(module) {
  return {
    myMethod() {
      const nodeRoot = module.getNodeRoot()
      // ...
    }
  }
}

// Script - module available directly
const input = module.input()
module.output('Done', null)
```

## Module Interface

Everything needed for basic operation:

```js
module.input()                           // Get request input
module.output(meta, data)                // Set output pair
module.extractOutput(sourceRecord)       // Lift output from another record

module.require('lib/something')          // Load and instantiate a lib
module.resolve('spl/container', 'file')  // Resolve path via overlay

module.faf(destination, options)         // Fire and forget
module.consumeLatest(topic)              // Read latest from topic

module.getNodeRoot()                     // Runtime: node root path
module.getRecordId()                     // Runtime: record identifier
module.getAppAPI()                       // Runtime: current app API
```

Additional libs only for specialized domain concerns (validation, formatting, external integrations) - not core infrastructure.

## Bootstrap Sequence

### 1. Raw Bootstrap (moduleBootstrap.js)

Platform-independent loading of overlay logic. Pure JS, no spl concepts.

```js
// Load overlay resolution functions
// Load platform modules registry (fs, path)
// Export raw require/resolve functions
```

### 2. Load module.js

**Critical: Check app modules first, then splectrum modules.**

This allows a 'boot' or 'system' app to run completely on its own version of code.

```
Resolution order for module.js:
1. apps/{appName}/modules/{layer}/_lib/module.js  (if app context exists)
2. splectrum/modules/{layer}/_lib/module.js       (fallback)
```

Only first instance used - no overlay stacking for module.js itself.

Location: `_lib/module.js` in module root (e.g., `modules/bm_spl/_lib/module.js`)

### 3. Instantiate Module

Bind record to module, creating the universal interface:

```js
const module = await loadModule(record)
// module.input(), module.output(), etc. all bound to this record
```

### 4. Execute

All execution contexts receive `module`:

```js
// Methods
await methodFn(module)

// Libs
const lib = libFactory.create(module)

// Scripts
// module injected as global
await scriptFn()
```

## Key Design Points

1. **App isolation**: App can have its own module.js, running independently of splectrum version
2. **Single interface**: All contexts get same `module` object
3. **No raw record access needed**: Everything goes through module methods
4. **Selfevals enforce constraints**: If methods shouldn't use certain module methods, selfevals check that
5. **Libs can still exist**: For specialized domain concerns, loaded via `module.require()`

## Migration Path

1. Create `_lib/module.js` with full interface
2. Update moduleBootstrap.js to load module.js via overlay (app-first)
3. Update method invocation to pass `module` instead of `(record, requireSpl, resolveSpl)`
4. Update lib pattern to receive `module` instead of `(record, { requireNonSpl })`
5. Update script execution to inject `module`
6. Move utilities from lib/spl to module.js
7. Deprecate/remove lib/spl (or keep as empty re-export for compatibility)

## File Locations

```
splectrum/
  lib/
    moduleBootstrap.js      # Raw bootstrap, loads overlay + module.js
  modules/
    bm_spl/
      _lib/
        module.js           # Universal module lib (splectrum version)
      spl/
        _lib/
          spl.js            # Deprecated or specialized utilities only

apps/
  cli-static/
    modules/
      work_module/
        _lib/
          module.js         # Optional: app-specific override
```

## Implementation Priority

High - this simplifies everything downstream:
- Cleaner method signatures
- Consistent interface everywhere
- Proper app isolation for boot/system apps
- Foundation for selfeval implementation
