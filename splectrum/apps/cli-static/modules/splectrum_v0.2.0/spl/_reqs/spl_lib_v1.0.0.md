**Type:** plain req
**Version:** 1.0.0

# spl_lib

## Spec

Core splectrum utilities library. Foundation lib imported by handlers and other libs.

**File:** `_lib/spl.js`

**Pattern:** `create(record, { requireNonSpl })` returns bound object with methods.

### Exports

| Function | Signature | Description |
|----------|-----------|-------------|
| `faf` | `(destination, options?)` | Fire and Forget - write record to destination folder |
| `raiseAsyncError` | `(error, context?)` | Handle errors in async callbacks |
| `getRecordId` | `()` | Get record's unique identifier (timestamp-based) |
| `getNodeRoot` | `()` | Get node root from record |
| `input` | `()` | Get input from record (shortcut) |
| `output` | `(meta, data)` | Set output pair on record |
| `extractOutput` | `(sourceRecord)` | Copy output from another record |
| `completeRequest` | `()` | Mark request as completed |
| `raiseError` | `(message)` | Raise sync error, mark completed |
| `consumeLatest` | `(topic)` | Read most recent record from topic folder |

### faf(destination, options?)

Fire and Forget - writes cloned record to destination folder with unique filename.

**Options:**
- `filename` - Base filename (default: timestamp.json)
- `dedupe` - Mode: `'numeric-digit'` always appends digit, default tries original first
- `sync` - Use sync write (for pre-exit writes)

**Behavior:**
- Clones record immediately (source may mutate before async write)
- Never overwrites - always dedupes
- Creates destination folder if needed
- Returns file path where written

### consumeLatest(topic)

Read most recent record from topic folder. Pairs with `faf()` for state save/load pattern.

- Reads JSON files from topic folder
- Sorts by filename descending (latest first based on timestamp naming)
- Returns parsed record or null if empty/missing

### Error Handling

**Sync errors:** `raiseError(message)` - sets error on record, marks completed
**Async errors:** `raiseAsyncError(error, context)` - clones record, FAFs to runtime/error

## Self-eval

- [ ] File exists at `_lib/spl.js`
- [ ] Exports `create(record, { requireNonSpl })` function
- [ ] faf writes record to destination
- [ ] faf never overwrites (dedupes)
- [ ] consumeLatest returns latest record by filename sort
- [ ] raiseAsyncError FAFs error record to runtime/error
- [ ] All methods bound to record context

## Comments

This is the foundation lib - provides record I/O and state management. The `faf`/`consumeLatest` pair enables topic-based messaging without external dependencies.

Uses `requireNonSpl` for platform dependencies (fs, path) since this lib predates the module.require pattern.
