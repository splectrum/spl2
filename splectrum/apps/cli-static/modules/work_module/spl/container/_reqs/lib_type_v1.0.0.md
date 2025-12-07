**Type:** plain req
**Version:** 1.0.0

# lib_type

## Spec

The `_lib` folder is an internal container folder holding shared code for a container.

**Structure:**
- Folder name: `_lib` (underscore prefix = internal)
- Task entrypoint: `lib.json`
- No README.md/README.json (internal folder)

**Lib file structure:**
- Shared code files (`.js`)
- Available to sibling containers and children
- Loaded via `module.require('lib/...')` pattern

**Main vs auxiliary libs:**

| Require path | Resolves to | Type |
|--------------|-------------|------|
| `lib/spl/container/selfeval` | `selfeval/_lib/selfeval.js` | Main lib |
| `lib/spl/container/selfeval/runners.js` | `selfeval/_lib/runners.js` | Auxiliary |

- Main lib: no extension, resolves to `name/_lib/name.js`
- Auxiliary lib: with `.js` extension, resolves directly to file
- The `.js` suffix distinguishes auxiliary files, avoids naming conflicts

**Main lib responsibilities:**
- Implement meaningful steps that index.js calls
- Each exported function represents a logical step in the method flow
- Header comment documents exports and flags handled
- Internal helpers stay private (not exported)
- Clean, easily understandable structure

**Auxiliary lib responsibilities:**
- Implementation facets (e.g., runners for different validation types)
- Small helpers shared across main lib functions
- Split from main lib when it grows too large
- Named by purpose (e.g., `runners.js`, `formatters.js`)

**Lib file pattern (create wrapper):**
```js
export function create(module) {
  const input = module.input()

  return {
    methodA() { /* uses module */ },
    methodB(data) { /* uses module */ }
  }
}
```

**Why wrapper for libs:**
- Returns utility object with multiple methods
- Captures module context once
- Avoids repeating args in every method call
- Caller uses `lib.methodA()` not `lib.methodA(module)`

**Contrast with index.js (methods):**
- Methods are plain functions: `async function(module)`
- Called once per invocation, no need for wrapper
- See index_type_v1.0.0 for method pattern

**lib.json entrypoint:**
- Lists available lib files
- Provides entry for lib-related tasks

**Content constraints:** None.

## Self-eval

- [ ] Folder named `_lib` with underscore prefix
- [ ] Contains `lib.json` task entrypoint
- [ ] No README.md or README.json present
- [ ] Main lib file named `<container>.js`
- [ ] Auxiliary libs have `.js` suffix in require path
- [ ] Lib files export `create(module)`
- [ ] Lib files return utility object with methods
- [ ] Main lib has header comment documenting exports
- [ ] Exported functions represent meaningful implementation steps
- [ ] Structure is clean and easily understandable

## Comments

Internal folders use underscore prefix to distinguish from visible (navigable) folders. The task entrypoint (`lib.json`) enables direct execution without spidering through README.

**Platform abstraction:**
- Libs use `module.require('fs')` etc. for platform modules
- Methods use `module.require('lib/...')` to load libs
- Import maps in package.json handle Node/Bare switching

**Future:**
- AI agent support will enable deeper code quality checks
- Automated validation of structure, naming, documentation
- For now, human review ensures quality
