# V2 Architecture - Clean Separation of Concerns

## Overview

Version 2 achieves complete separation between queue watcher, handler, and invoker/consumer.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Application                      │
└─────────────────────────────────────────────────────────────┘
                    │                      ▲
                    │ invoke-v2.js         │ invoke-v2.js
                    │ createRequest()      │ waitForCompletion()
                    ▼                      │
┌─────────────────────────────────────────────────────────────┐
│                     Event Queue (data.js)                    │
│                  request/req-xxx/*.json                      │
└─────────────────────────────────────────────────────────────┘
                    ▲                      │
                    │ daemon publishes     │ daemon reads
                    │                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Daemon (daemon-core-v2.js)                 │
│  • Polls queue for new events                                │
│  • Tracks last processed step                                │
│  • Calls handler                                             │
│  • Publishes events returned by handler                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ processEvent(requestId, event)
                              ▼                      returns event
┌─────────────────────────────────────────────────────────────┐
│              Handler (iteration-1-handler-v2.js)             │
│  • Pure function: receives event, returns next event         │
│  • Business logic only                                       │
│  • No queue knowledge                                        │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. **data.js** (unchanged)
Event persistence layer - atomic reads/writes

### 2. **daemon-core-v2.js** - Queue Watcher
**Responsibilities:**
- Poll queue for new events
- Track processing state (last step per request)
- Call handler with events
- Publish events returned by handler

**Key change from v1:** Daemon publishes, not handler

### 3. **iteration-1-handler-v2.js** - Pure Handler
**Responsibilities:**
- Process one event
- Return next event (or null)
- Zero queue knowledge

**Key change from v1:** Returns events, doesn't publish

### 4. **invoke-v2.js** - Client Interface
**Functions:**
- `createRequest(input)` - Submit request, return requestId (fire-and-forget)
- `waitForCompletion(requestId, options)` - Poll for result
- `invoke(input, options)` - Convenience: submit + wait

**Key feature:** Client can wait for results!

### 5. **install-handler.js** - Daemon Installer
**Responsibilities:**
- Start daemon process
- Save PID to file
- Handle graceful shutdown

### 6. **uninstall-handler.js** - Daemon Uninstaller
**Responsibilities:**
- Read PID file
- Send SIGTERM for graceful shutdown
- Clean up PID file

### 7. **test-workflow.js** - Integration Test
Complete workflow: uses `invoke()` to submit + wait for results

## Clean Separation Achieved

| Component | Reads Queue | Writes Queue | Calls Handler | Returns Result |
|-----------|-------------|--------------|---------------|----------------|
| **data.js** | ✅ | ✅ | - | - |
| **daemon-core-v2** | ✅ | ✅ | ✅ | - |
| **handler-v2** | ❌ | ❌ | - | ✅ |
| **invoke-v2** | ✅ | ✅ | - | ✅ |

## Usage

### Install Handler Daemon

```bash
node install-handler.js
```

### Submit Request (Fire-and-Forget)

```javascript
const { createRequest } = require('./invoke-v2.js')
const requestId = createRequest("3 + 5 - 2")
console.log(`Submitted: ${requestId}`)
```

### Submit and Wait for Result

```javascript
const { invoke } = require('./invoke-v2.js')

const result = await invoke("3 + 5 - 2")
console.log(`Result: ${result.value}`) // 6
```

### Uninstall Handler Daemon

```bash
node uninstall-handler.js
```

### Complete Test

```bash
# Terminal 1: Install daemon
node install-handler.js

# Terminal 2: Run tests
node test-workflow.js

# Terminal 1: Uninstall daemon
node uninstall-handler.js
```

## Benefits Over V1

✅ **Handler is pure function** - No side effects, testable
✅ **Client gets results** - Not just fire-and-forget
✅ **Daemon lifecycle management** - Install/uninstall
✅ **Clear contracts** - Handler returns events, daemon publishes
✅ **Reusable for iterations 2-4** - Just swap handler

## For Future Iterations

### Iteration 2 (Operator Precedence):
1. Write `iteration-2-handler-v2.js`
2. Update `install-handler.js` to use iteration-2-handler
3. Everything else reuses v2 architecture

### Iteration 3 (Nested Expressions):
Same pattern - just new handler logic

### Iteration 4 (Multi-nested):
Same pattern - enhanced handler + event structure

## Test Results

```bash
$ node test-workflow.js
=== Testing Complete Workflow ===

Submitting test requests...

Request req-1763936162244-u08zljsuu submitted: "3 + 5 - 2"
Request req-1763936162244-u08zljsuu completed: 6
✅ "3 + 5 - 2" = 6

Request req-1763936162550-j1anrhuuz submitted: "10 + 20 + 30"
Request req-1763936162550-j1anrhuuz completed: 60
✅ "10 + 20 + 30" = 60

Request req-1763936162866-12rq4z99r submitted: "100 - 50 - 25"
Request req-1763936162866-12rq4z99r completed: 25
✅ "100 - 50 - 25" = 25

Request req-1763936163172-snor3t55o submitted: "7 + 3 + 1 + 9"
Request req-1763936163172-snor3t55o completed: 20
✅ "7 + 3 + 1 + 9" = 20

=== All tests complete ===
```

All 4 test cases pass ✅
