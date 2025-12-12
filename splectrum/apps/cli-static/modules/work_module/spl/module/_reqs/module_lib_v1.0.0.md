**Type:** plain req
**Version:** 1.0.0

# module_lib

## Spec

Module runtime lib - provides the module API for methods and libs.

**File:** `_lib/module.js`

**Purpose:** Core runtime for module execution. Provides input/output handling, dependency resolution, record access, and fire-and-forget messaging.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `create` | `(bootstrapModule)` | Create module instance from bootstrap module |

### Initialization Pattern

```javascript
const module = create(bootstrapModule)
await module.init()           // Load platform modules (fs, path)
module.bindRecord(record)     // Bind request record
```

The bootstrap module provides minimal interface: `getNodeRoot()`, `getModulesDir()`, `require(uri)` for platform modules.

### Module Instance Methods

**Lifecycle:**

| Method | Description |
|--------|-------------|
| `init()` | Load platform modules (fs, path). Must be called before other methods |
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

**Record Management:**

| Method | Description |
|--------|-------------|
| `snapshotRecord()` | Create record snapshot |
| `restoreRecord(snapshot)` | Restore from snapshot |
| `getRecordId()` | Get current record ID |
| `getMethod()` | Get current method path |

**Dependencies:**

| Method | Description |
|--------|-------------|
| `require(uri)` | Load platform module, lib, or method |
| `resolve(nodePath, filename)` | Resolve path through overlay |

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

## Self-eval

- [ ] File exists at `_lib/module.js`
- [ ] Exports `create(bootstrapModule)` function
- [ ] Created instance has `init()`, `bindRecord()`, `createForRecord()`
- [ ] Created instance has all documented methods

## Comments

This is the core runtime lib. Every module instance inherits it through the type chain (instantiates: spl/module). Uses standard `create(module)` signature like all other libs.
