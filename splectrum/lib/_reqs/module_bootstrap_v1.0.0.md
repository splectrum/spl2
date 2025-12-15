**Type:** plain req
**Version:** 1.0.0

# module_bootstrap

## Spec

Bootstrap loader for module.js. Creates a minimal bootstrap module that module.js receives via standard `create(module)` signature.

**Location:** `splectrum/lib/moduleBootstrap.js` (splectrum node level only)

**Purpose:** Bridge between entrypoints and module system. Provides just enough for module.js to initialize.

**Exports:**

- `loadModule(appName)` - Load and instantiate module.js

**Bootstrap Module Interface:**

The bootstrap module passed to `module.js.create()` provides:

| Method | Returns | Purpose |
|--------|---------|---------|
| `getNodeRoot()` | string | Splectrum node root path |
| `getModulesDir()` | string | Active modules directory |
| `getAppAPI()` | null | No app context at bootstrap |
| `getAppName()` | null | No app name at bootstrap |
| `getEnableAppOverlay()` | false | No overlay at bootstrap |
| `require(uri)` | Promise | Platform modules only (fs, path, etc.) |

**Resolution Order:**

1. `apps/{appName}/modules/{layer}/_lib/module.js` (if appName provided)
2. `splectrum/modules/{layer}/_lib/module.js` (fallback)

Layer order determined by `hierarchy.json` in respective modules folder.

**Platform Compatibility:**

Uses import maps in package.json for Node/Bare switching.

## Self-eval

- [ ] Exports loadModule function
- [ ] Creates bootstrap module with required interface
- [ ] Resolves app modules before splectrum modules
- [ ] Reads hierarchy.json for layer order
- [ ] Throws if no module.js found

## Comments

This is the only file in splectrum/lib/. It exists at node level because it bootstraps the entire module system before any module code runs.

Module.js in the active layer then takes over and provides the full module interface.
