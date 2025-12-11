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
| `create` | `(record)` | Create module instance bound to a record |

**Module instance methods:**

| Method | Description |
|--------|-------------|
| `input()` | Get parsed input flags |
| `setInputFlag(key, value)` | Set input flag |
| `output(freetext, structured)` | Set method output |
| `getMetaLevel()` | Get --meta flag value |
| `getReportLevel()` | Get --report flag value |
| `getDetailLevel()` | Get detail level from meta |
| `extractOutput(sourceRecord)` | Extract output from a record |
| `snapshotRecord()` | Create record snapshot |
| `restoreRecord(snapshot)` | Restore from snapshot |
| `require(uri)` | Load platform module, lib, or method |
| `resolve(nodePath, filename)` | Resolve path through overlay |
| `faf(destination, options)` | Fire and forget to destination |
| `consumeLatest(topic)` | Consume latest message from topic |
| `getRecordId()` | Get current record ID |
| `getMethod()` | Get current method path |
| `raiseError(message)` | Raise synchronous error |
| `raiseAsyncError(error, context)` | Raise async error |
| `completeRequest()` | Mark request complete |

**Overlay resolution:**
- Follows instantiates chain first, then extends chain
- Searches module layers via hierarchy.json
- Enables type inheritance for libs and methods

## Self-eval

- [ ] File exists at `_lib/module.js`
- [ ] Exports `create(record)` function
- [ ] Created instance has all documented methods

## Comments

This is the core runtime lib. Every module instance inherits it through the type chain (instantiates: spl/module).
