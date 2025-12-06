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
- Shared code files (typically `.js`)
- Available to sibling containers and children
- Loaded via `requireSpl('lib/...')` pattern

**Lib file pattern (create wrapper):**
```js
export function create(record, { requireNonSpl }) {
  const fs = requireNonSpl('fs')
  const path = requireNonSpl('path')

  return {
    methodA() { /* uses record, fs, path */ },
    methodB(data) { /* uses record, fs, path */ }
  }
}
```

**Why wrapper for libs:**
- Returns utility object with multiple methods
- Captures dependencies once (record, platform modules)
- Avoids repeating args in every method call
- Caller uses `spl.methodA()` not `spl.methodA(record, fs, path)`

**Contrast with index.js (methods):**
- Methods are plain functions: `async function(record, requireSpl)`
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
- [ ] Lib files export `create(record, { requireNonSpl })`
- [ ] Lib files return utility object with methods

## Comments

Internal folders use underscore prefix to distinguish from visible (navigable) folders. The task entrypoint (`lib.json`) enables direct execution without spidering through README.

**Platform abstraction:**
- Only libs use `requireNonSpl` (direct platform access)
- Methods use `requireSpl` which loads libs
- When platform changes (Node → Bare), only libs need updating
