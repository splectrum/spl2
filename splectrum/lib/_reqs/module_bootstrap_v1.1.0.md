**Type:** plain req
**Version:** 1.1.0

# module_bootstrap

## Spec

Bootstrap loader for module.js. Creates an initial record with runtime config that module.js receives via `create(initialRecord)`.

**Location:** `splectrum/lib/moduleBootstrap.js` (splectrum node level only)

**Purpose:** Bridge between entrypoints and module system. Provides runtime config for module.js initialization.

**Exports:**

- `loadModule(appName)` - Load and instantiate module.js

**Initial Record Structure:**

The bootstrap creates an initial record with standard structure:

```javascript
{
  headers: {
    spl: {
      runtime: {
        nodeRoot: '/path/to/splectrum',
        modulesDir: '/path/to/modules'
      }
    }
  }
}
```

This is passed to `module.js.create(initialRecord)`. Module.js context getters fall back to this record when no request record is bound.

**Resolution Order:**

1. `apps/{appName}/modules/{layer}/_lib/module.js` (if appName provided)
2. `splectrum/modules/{layer}/_lib/module.js` (fallback)

Layer order determined by `hierarchy.json` in respective modules folder.

**Platform Compatibility:**

Uses import maps in package.json for Node/Bare switching. Bootstrap uses `await import()` for platform modules (fs, path, url).

## Self-eval

- [ ] Exports loadModule function
- [ ] Creates initial record with `headers.spl.runtime.{nodeRoot, modulesDir}`
- [ ] Resolves app modules before splectrum modules
- [ ] Reads hierarchy.json for layer order
- [ ] Throws if no module.js found

## Comments

This is the only file in splectrum/lib/. It exists at node level because it bootstraps the entire module system before any module code runs.

Module.js in the active layer then takes over and provides the full module interface.

v1.1.0 changes from v1.0.0:
- Passes initial record instead of bootstrap module object
- Initial record uses standard structure: `headers.spl.runtime.*`
- No longer provides `require()` method - module.js uses native imports
- Simpler interface: just creates record with runtime config
