**Type:** plain req
**Version:** 1.1.0

# module_lib

## Spec

Module runtime lib - provides the module API for methods, libs, and scripts.

**File:** `_lib/module.js`

**Purpose:** Core runtime for module execution. Provides input/output handling, SPL dependency resolution, record access, and fire-and-forget messaging.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `create` | `(initialRecord)` | Create module instance from initial record |

### Initialization Pattern

```javascript
// Bootstrap creates initial record with runtime config
const initialRecord = {
  headers: {
    spl: {
      runtime: {
        nodeRoot: '/path/to/node',
        modulesDir: '/path/to/node/modules'
      }
    }
  }
}

const module = create(initialRecord)
await module.init()           // No-op (API compatibility)
module.bindRecord(record)     // Bind request record
```

The initial record provides runtime config via standard record structure. Context getters fall back to initial record when request record not bound.

### Platform Modules

module.js uses native imports for platform modules:
```javascript
import fs from 'fs'
import path from 'path'
```

Package.json import maps handle Node/Bare switching. Scripts use `await import()`.

### Module Instance Methods

**Lifecycle:**

| Method | Description |
|--------|-------------|
| `init()` | No-op (API compatibility). Previously loaded platform modules |
| `bindRecord(record)` | Bind a request record after initialization |
| `createForRecord(record)` | Factory: create new module instance with different record |

**Input/Output:**

| Method | Description |
|--------|-------------|
| `input()` | Get parsed input flags |
| `setInputFlag(key, value)` | Set input flag |
| `output(freetext, structured)` | Set method output |
| `getMetaLevel()` | Get --meta flag value |
| `getReportLevel()` | Get --report flag value |
| `getDetailLevel()` | Get detail level from meta |
| `extractOutput(sourceRecord)` | Extract output from a record |
| `getData()` | Get record data (value) |
| `setData(value)` | Set record data (value) |
| `getMetaData()` | Get record metadata (headers) |

**Record Management:**

| Method | Description |
|--------|-------------|
| `snapshotRecord()` | Create record snapshot |
| `restoreRecord(snapshot)` | Restore from snapshot |
| `getRecordId()` | Get current record ID |
| `getMethod()` | Get current method path |

**Context Getters:**

| Method | Description |
|--------|-------------|
| `getNodeRoot()` | Get node root path (from record or initial record) |
| `getModulesDir()` | Get modules directory path |
| `getAppAPI()` | Get current app API |
| `getAppName()` | Get current app name |

**SPL Dependencies:**

| Method | Description |
|--------|-------------|
| `require(uri)` | Load SPL resource (scripts, libs, commands). SPL-only |
| `resolve(nodePath, filename)` | Resolve path through overlay |
| `resolveScript(scriptName)` | Resolve script with app overlay support |
| `buildTypeStack(containerPath, stackType)` | Build type stack for container |

**require(uri) URI patterns:**

| Pattern | Type | Example |
|---------|------|---------|
| No slashes | Script | `'selfeval-all'` |
| `lib/...` | Splectrum lib | `'lib/spl/container/selfeval'` |
| `spl/script/inline` | Inline script | From record |
| `/absolute/path` | Script file | `/path/to/script.js` |
| `pkg/api/method` | Command | `'spl/container/whoami'` |

**Important:** `require()` is SPL-only. For npm modules (fs, path, child_process), use native `import` in libs/methods or `await import()` in scripts.

**Messaging:**

| Method | Description |
|--------|-------------|
| `faf(destination, options)` | Fire and forget to destination |
| `consumeLatest(topic)` | Consume latest message from topic |

**Errors:**

| Method | Description |
|--------|-------------|
| `raiseError(message)` | Raise synchronous error |
| `raiseAsyncError(error, context)` | Raise async error |
| `completeRequest()` | Mark request complete |

**Overlay resolution:**
- Follows instantiates chain first, then extends chain
- Searches module layers via hierarchy.json
- Enables type inheritance for libs and methods
- App overlay for scripts: app scripts first, then node scripts

## Self-eval

- [ ] File exists at `_lib/module.js`
- [ ] Exports `create(initialRecord)` function
- [ ] Uses native imports for fs, path (not bootstrap delegation)
- [ ] Created instance has `init()`, `bindRecord()`, `createForRecord()`
- [ ] `require()` throws for non-SPL URIs without slashes that aren't scripts
- [ ] `resolveScript()` checks app scripts before node scripts
- [ ] Context getters fall back to initial record when request record not bound

## Comments

This is the core runtime lib. Every module instance inherits it through the type chain (instantiates: spl/module).

v1.1.0 changes from v1.0.0:
- `create(initialRecord)` instead of `create(bootstrapModule)`
- Initial record uses standard structure: `headers.spl.runtime.{nodeRoot, modulesDir}`
- Native imports for platform modules (fs, path)
- `require()` is SPL-only (scripts, libs, commands)
- No runtime bootstrap delegation
- Added `resolveScript()` with app overlay support
- Added `buildTypeStack()` method
- Added `getData()`, `setData()`, `getMetaData()` methods
