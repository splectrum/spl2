# Consumer Design

## Overview

File-based consumer pattern for watching folders and processing arriving records. Decoupled control via shared state file.

## Core Concept

A consumer watches a source folder for new files (records). When a file arrives, the consumer invokes a handler. The handler owns all processing logic including destination and cleanup.

Consumer state is persisted in a state file. The consumer watches this file too - state changes trigger behavior changes (stop, pause). API methods and the watcher both read/write the state file (bidirectional).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      spl/consumer API                        │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│  watch   │  status  │   stop   │  pause   │     resume      │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴────────┬────────┘
     │          │          │          │              │
     │          └──────────┴──────────┴──────────────┤
     │                        │                      │
     │                   read/write                  │
     │                        │                      │
     │                        ▼                      │
     │          ┌─────────────────────────┐          │
     │          │      state.json         │          │
     │          │  (control + status)     │◄─────────┘
     │          └─────────────────────────┘    watcher writes
     │                        ▲                stats, heartbeat
     │                        │
     │                   watches (secondary)
     │                        │
     ▼                        │
┌─────────────────────────────┴───────────────────────────────┐
│                         WATCHER                              │
│                                                              │
│   watches sourceDir (primary)    watches statePath (secondary)│
│            │                              │                   │
│            ▼                              ▼                   │
│   new file arrives              state change detected         │
│            │                              │                   │
│            ▼                              ▼                   │
│   invoke handler(record)         apply state (stop/pause)     │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
runtime/consumers/{consumerId}/
├── state.json       # shared state (control + status)
└── ... (handler may use additional folders)
```

**State file structure:**
```json
{
  "version": 1,
  "control": {
    "running": true,
    "paused": false
  },
  "status": {
    "state": "idle",
    "startedAt": 1234567890,
    "lastActivity": 1234567890,
    "heartbeat": 1234567890
  },
  "stats": {
    "processed": 42,
    "errors": 0
  },
  "config": {
    "consumerId": "session/inbox",
    "sourceDir": "/path/to/inbox"
  }
}
```

## API Methods

### spl/consumer/watch

Starts a watcher on sourceDir. Creates state file, begins watching.

**Input:**
```json
{
  "sourceDir": "/path/to/inbox",
  "consumerId": "session/inbox",
  "handler": "function or method reference"
}
```

**Behavior:**
1. Create state file with initial state
2. Start primary watcher on sourceDir
3. Start secondary watcher on state file
4. On new file in sourceDir:
   - Check state (running? paused?)
   - Read file as record
   - Add `sourcePath` to record
   - Stamp consumer trail in headers
   - Invoke handler(record)
5. On state file change:
   - Read new state
   - Apply changes (stop → shutdown, pause → stop processing)
6. Periodically update heartbeat in state file

**Returns:** Nothing (fire and forget). Control via state file.

### spl/consumer/status

Read current state of a consumer.

**Input:**
```json
{
  "consumerId": "session/inbox"
}
```

**Returns:** Current state.json contents

### spl/consumer/stop

Stop a running consumer.

**Input:**
```json
{
  "consumerId": "session/inbox"
}
```

**Behavior:** Write `control.running = false` to state file.

### spl/consumer/pause / resume

Pause/resume processing (watcher stays alive, just doesn't process).

## Handler Contract

Handler receives a record with `sourcePath` attached. Handler owns:
- Processing logic
- Destination (FAF to wherever)
- Cleanup (delete source file after successful FAF)

```javascript
async function handler(record) {
  // record.sourcePath = where file came from
  // record.headers.spl.consumers = trail of consumers

  // Do processing...
  const result = transform(record)

  // FAF to destination
  await faf(destDir, result)

  // Cleanup source (after FAF success)
  await fs.unlink(record.sourcePath)
}
```

## Watcher Implementation

Uses `fs.watch` for both sourceDir and state file.

**sourceDir watcher:**
- Listen for `rename` events (file dropped in via atomic rename)
- Filter for `.json` files
- Check file exists (rename fires for add and remove)
- Track in-flight to avoid double-processing

**state file watcher:**
- Listen for `change` events
- Read file, compare to current state
- Apply changes

```javascript
import { watch, readFileSync, existsSync, unlinkSync, writeFileSync, renameSync } from 'fs'
import path from 'path'

export function startWatcher({ sourceDir, statePath, handler, consumerId }) {
  let state = readState(statePath)
  const inFlight = new Set()

  // Primary watcher - source folder
  const sourceWatcher = watch(sourceDir, async (event, filename) => {
    if (event !== 'rename') return
    if (!filename?.endsWith('.json')) return
    if (!state.control.running || state.control.paused) return
    if (inFlight.has(filename)) return

    const sourcePath = path.join(sourceDir, filename)
    if (!existsSync(sourcePath)) return

    inFlight.add(filename)
    updateState(statePath, s => { s.status.state = 'processing' })

    try {
      const content = readFileSync(sourcePath, 'utf-8')
      const record = JSON.parse(content)

      record.sourcePath = sourcePath
      record.headers.spl.consumers ??= []
      record.headers.spl.consumers.push({
        id: consumerId,
        timestamp: Date.now()
      })

      await handler(record)

      updateState(statePath, s => {
        s.stats.processed++
        s.status.lastActivity = Date.now()
      })
    } catch (err) {
      updateState(statePath, s => { s.stats.errors++ })
    } finally {
      inFlight.delete(filename)
      updateState(statePath, s => { s.status.state = 'idle' })
    }
  })

  // Secondary watcher - state file
  const stateWatcher = watch(statePath, (event) => {
    if (event !== 'change') return
    const newState = readState(statePath)

    if (!newState.control.running) {
      sourceWatcher.close()
      stateWatcher.close()
      updateState(statePath, s => { s.status.state = 'stopped' })
    }

    state = newState
  })

  // Heartbeat
  const heartbeatInterval = setInterval(() => {
    if (!state.control.running) {
      clearInterval(heartbeatInterval)
      return
    }
    updateState(statePath, s => { s.status.heartbeat = Date.now() })
  }, 5000)
}

function readState(statePath) {
  return JSON.parse(readFileSync(statePath, 'utf-8'))
}

function updateState(statePath, mutator) {
  const state = readState(statePath)
  mutator(state)
  state.version++
  writeFileSync(statePath + '.tmp', JSON.stringify(state, null, 2))
  renameSync(statePath + '.tmp', statePath)
}
```

## Lock Protocol

Both API methods and watcher write to state file. Use atomic rename:

```javascript
// Safe write
writeFileSync(path + '.tmp', content)
renameSync(path + '.tmp', path)
```

Rename is atomic on POSIX. Sufficient for single watcher + occasional API writes.

Future: Add proper file locking if contention becomes an issue.

## Consumer Trail

Each consumer stamps the record headers on boundary crossing:

```json
{
  "headers": {
    "spl": {
      "consumers": [
        { "id": "apps/cli-static", "timestamp": 1234567890 },
        { "id": "session/inbox", "timestamp": 1234567891 },
        { "id": "session/processor", "timestamp": 1234567892 }
      ]
    }
  }
}
```

Provides full audit trail of which consumers handled the record.

## Usage Example

**Start inbox consumer:**
```javascript
await spl.consumer.watch({
  sourceDir: 'runtime/cli-static/requests/inbox',
  consumerId: 'session/inbox',
  handler: inboxHandler
})
```

**Simple push-through handler:**
```javascript
async function inboxHandler(record) {
  // FAF to processing folder
  await faf('runtime/cli-static/requests/processing', record)

  // Delete source
  await fs.unlink(record.sourcePath)
}
```

**Check status:**
```javascript
const status = await spl.consumer.status({ consumerId: 'session/inbox' })
console.log(status.stats.processed)
```

**Stop consumer:**
```javascript
await spl.consumer.stop({ consumerId: 'session/inbox' })
```

## Transient Consumer

Short-lived consumer for request/response patterns. Starts, processes limited work, auto-stops.

**Double-barrel TTL:**
- `maxTime` - auto-stop after N milliseconds
- `maxTriggers` - auto-stop after N files processed

Whichever limit hits first triggers shutdown.

**Use case: App outbox watcher**
```javascript
const watcher = createTransientWatcher({
  sourceDir: outboxDir,
  handler: outputToConsole,
  consumerId: 'apps/cli-static/outbox',
  maxTime: 30000,      // 30 second timeout
  maxTriggers: 1       // expect single response
})
```

App sends request, waits for single response in outbox. Watcher auto-stops after receiving one file or timing out.

**Transient vs Persistent:**

| | Transient | Persistent |
|---|---|---|
| Lifetime | Limited (TTL) | Indefinite |
| Control | Auto-stop on limits | State file control |
| Use case | Request/response | Long-running service |
| State file | Optional | Required |
| Recovery | None (ephemeral) | Resume on restart |

**Implementation sketch:**
```javascript
export function createTransientWatcher({
  sourceDir,
  handler,
  consumerId,
  maxTime = null,
  maxTriggers = null
}) {
  let triggerCount = 0
  let timeoutHandle = null

  const stop = () => {
    if (timeoutHandle) clearTimeout(timeoutHandle)
    fsWatcher.close()
  }

  // Time limit
  if (maxTime) {
    timeoutHandle = setTimeout(stop, maxTime)
  }

  const fsWatcher = watch(sourceDir, async (event, filename) => {
    // ... normal watcher logic ...

    await handler(record)
    triggerCount++

    // Trigger limit
    if (maxTriggers && triggerCount >= maxTriggers) {
      stop()
    }
  })

  return { stop }
}
```

**Timeout behavior options:**
1. Silent stop (current)
2. Call timeout handler: `onTimeout: () => { ... }`
3. Reject a promise (for await pattern)

For cli-static app, timeout likely means error - request lost or processing failed.

## Open Questions

1. **Handler reference:** How to pass handler function? Inline, method path, or script path?

2. **Multiple watchers:** Same API instance managing multiple consumers? State per consumer.

3. **Error handling:** What happens if handler throws? Retry? Dead letter?

4. **Backpressure:** If handler is slow and files pile up, how to handle?

5. **Startup recovery:** On restart, process files already in sourceDir?

6. **Transient timeout:** What to do on timeout? Silent, callback, reject promise?

## spl/request Record Structure

**Design insight:** Input and output are operational metadata, not API state.

```json
{
  "headers": {
    "spl": {
      "request": {
        "timeReceived": 1234567890,  // fixed - when request arrived
        "type": "command",            // fixed - invocation type
        "method": "spl/dev/cycle",    // updated - current method
        "input": { ... },             // updated - method arguments
        "output": { ... }             // updated - method result
      },
      "runtime": { ... },             // fixed - environment context
      "consumers": [ ... ],           // appended - consumer trail
      "error": { ... }                // set on error
    }
  },
  "value": { ... }                    // API state (internal, method-managed)
}
```

**Fixed vs Updated properties:**

| Property | Lifecycle |
|----------|-----------|
| request.timeReceived | Fixed at creation |
| request.type | Fixed at creation |
| request.method | Updated (pipeline may chain methods) |
| request.input | Updated (each method receives input) |
| request.output | Updated (each method produces output) |
| runtime.* | Fixed at creation |
| consumers | Appended (each consumer stamps) |
| error | Set when error occurs |
| value (API state) | Updated by method execution |

**spl/cli → spl/request transformation:**

Reorganization, not creation:
- `value.mode` → `headers.spl.request.type`
- `value.method` → `headers.spl.request.method`
- `value.input` → `headers.spl.request.input`
- `headers.spl.*` → kept as-is
- `value` → null (API state, populated by execution)

## Related

- FAF (Fire and Forget) - `lib/spl` faf() method
- Consumer trail - headers.spl.consumers
- cli-static inbox/outbox flow
- API_DESIGN.md - canonical record structure
