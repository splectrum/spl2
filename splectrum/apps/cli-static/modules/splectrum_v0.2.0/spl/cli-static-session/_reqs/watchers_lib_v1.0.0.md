**Type:** plain req
**Version:** 1.0.0

# watchers_lib

## Spec

Session watcher factory for CLI Static sessions. Creates inbox and outbox watchers for request processing.

**File:** `_lib/watchers.js`

**Pattern:** `create(module)` returns object with factory methods.

### Exports

| Function | Signature | Description |
|----------|-----------|-------------|
| `ensureDirs` | `(nodeRoot, config)` | Create session directories if needed |
| `createInboxWatcher` | `(inboxDir, processingDir)` | Create one-shot inbox watcher |
| `createOutboxWatcher` | `(processingDir, outboxDir, parentModule)` | Create one-shot processing watcher |

### ensureDirs(nodeRoot, config)

Ensures session directories exist.

**Input:**
- `nodeRoot` - Filesystem root path
- `config` - Object with `inboxRoot`, `processingRoot`, `outboxRoot`

**Returns:**
```javascript
{
  inboxDir: string,
  processingDir: string,
  outboxDir: string
}
```

Creates directories with `recursive: true` if they don't exist.

### createInboxWatcher(inboxDir, processingDir)

Creates a one-shot file watcher for the inbox directory.

**Behavior:**
1. Watch for 'rename' events on .json files
2. Move file from inbox to processing directory
3. Close watcher (one-shot self-destruct)

**Returns:** `fs.FSWatcher` instance

### createOutboxWatcher(processingDir, outboxDir, parentModule)

Creates a one-shot file watcher for the processing directory.

**Behavior:**
1. Watch for 'rename' events on .json files
2. Read and parse request record
3. Create module instance via `parentModule.createForRecord()`
4. Execute the requested method
5. Handle errors (set in metaoutput)
6. Remove file from processing
7. FAF result to outbox (sync mode)
8. Close watcher (one-shot self-destruct)

**Returns:** `fs.FSWatcher` instance

## Session Flow

```
inbox/ ──[inbox watcher]──> processing/ ──[outbox watcher]──> outbox/
```

1. Client FAFs request to inbox
2. Inbox watcher moves to processing
3. Outbox watcher executes and FAFs result to outbox
4. Client reads from outbox

Both watchers are one-shot - they process exactly one file then self-destruct. The session start handler creates fresh watchers for each request cycle.

## Self-eval

- [ ] File exists at `_lib/watchers.js`
- [ ] Exports `create(module)` function
- [ ] ensureDirs creates all three directories
- [ ] createInboxWatcher moves files from inbox to processing
- [ ] createOutboxWatcher executes method and FAFs to outbox
- [ ] Both watchers self-destruct after one file
- [ ] Error handling sets metaoutput, doesn't throw

## Comments

One-shot watchers simplify state management - no need to track which files have been processed. Each session cycle creates fresh watchers.

The parent module is passed to createOutboxWatcher to enable `createForRecord()` - creating a properly bound module instance for the incoming request.
