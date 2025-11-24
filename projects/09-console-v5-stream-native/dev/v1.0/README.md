# v1.0 - Iteration 1.0: Fire-and-Forget Pattern

**Purpose:** Prove basic sequential execution with async processing using fire-and-forget pattern.

## What This Iteration Accomplished

This iteration implements and validates the **fire-and-forget pattern** for stream-native execution:

1. ✅ **Fire-and-forget request submission** - `invoke-v2.js` submits request and exits immediately (or waits for result)
2. ✅ **Handler daemon** - `daemon-core-v2.js` watches queue, processes asynchronously
3. ✅ **Sequential arithmetic handler** - `iteration-1-handler-v2.js` processes `3 + 5 - 2` step-by-step
4. ✅ **Event persistence** - `data.js` provides filesystem-based event stream
5. ✅ **Pure handlers** - Handlers return events, daemon publishes them
6. ✅ **Lifecycle management** - `install-handler.js` / `uninstall-handler.js` with PID tracking

## Key Discoveries

### Fire-and-Forget Pattern
- Each processing step fires next step event and exits
- Handler daemon uses sequential step tracking (`lastProcessedStep` Map)
- Events persisted to filesystem create audit trail
- Polling-based file watching (100ms) for WSL2 compatibility

### Architecture Evolution
**V1 → V2 improvements:**
- **Handler purity:** Handlers return events, don't publish
- **Daemon publishes:** `daemon-core-v2.js` publishes events returned by handler
- **Client gets results:** `invoke-v2.js` with `waitForCompletion()` pattern
- **Lifecycle management:** Install/uninstall scripts with PID tracking

### Critical Insights
- **Event streams need cursors** - Not full scans (prevents reprocessing loop)
- **Sequential step tracking** - Map<requestId, lastStep> prevents duplicate processing
- **Modular architecture** - daemon-core + handler separation enables reuse

## Files in This Iteration

### Core Components

**data.js** - Data layer operations
- `publish(topic, event)` - Write event to filesystem
- `consume(topic, options)` - Read events from topic
- `seek(topic, options)` - Navigate event stream
- `read(topic)` - Get latest event
- `write(topic, event)` - Publish with read semantics
- Atomic writes via temp file + rename

**daemon-core-v2.js** - Generic daemon for processing
- Watches request queue (polling-based)
- Calls handler for each new event
- Publishes events returned by handler
- Tracks last processed step per request

**iteration-1-handler-v2.js** - Sequential arithmetic handler
- Pure function: takes event, returns event
- Processes one operation per step
- Handles: `3 + 5 - 2` → `6`

**invoke-v2.js** - Client interface
- `invoke(input, options)` - Submit request
- `waitForCompletion(requestId)` - Poll for result
- Fire-and-forget or wait modes

**install-handler.js** - Start daemon
- Spawns daemon as background process
- Saves PID to file
- Handles graceful shutdown

**uninstall-handler.js** - Stop daemon
- Reads PID from file
- Kills daemon process
- Cleans up PID file

**test-workflow.js** - Integration test
- Complete workflow test
- 4 test cases: `3+5-2=6`, `10+20+30=60`, etc.

## Test Results

All 4 test cases passed:
- `3 + 5 - 2 = 6` ✅
- `10 + 20 + 30 = 60` ✅
- `100 - 50 - 25 = 25` ✅
- `7 + 3 + 1 + 9 = 20` ✅

## Event Structure (V2)

```javascript
// Step 0 (pending)
{
  requestId: "req-...",
  step: 0,
  input: "3 + 5 - 2",
  status: "pending",
  metadata: { timestamp: "...", topic: "..." }
}

// Step 1 (in progress)
{
  requestId: "req-...",
  step: 1,
  input: "3 + 5 - 2",
  value: 3,
  remaining: "+ 5 - 2",
  status: "pending",
  metadata: { timestamp: "...", topic: "..." }
}

// Final step (completed)
{
  requestId: "req-...",
  step: 3,
  input: "3 + 5 - 2",
  output: 6,
  status: "completed",
  metadata: { timestamp: "...", topic: "..." }
}
```

## Usage

### Deploy Environment

```bash
node deploy.js
```

This creates a new environment with all files copied from `implementation/pr09/`.

### Run Tests

From within deployed environment:

```bash
cd environments/env-{timestamp}/
node modules/pr09/test-workflow.js
```

### Start Daemon

```bash
node modules/pr09/install-handler.js
```

### Submit Request

```bash
node modules/pr09/invoke-v2.js "3 + 5 - 2"
```

### Stop Daemon

```bash
node modules/pr09/uninstall-handler.js
```

## What's Next

**Iteration 1.1:** Namespace structure & state context
- Establish `pr09/` namespace
- Event structure: `headers.pr09.*` for metadata, `value` for payload
- Handler-specific hives (arithmetic, validation, logging)
- Runtime-driven processing (`requestcomplete` flag)

## Pattern Value

This iteration proves the fundamental pattern for all future work:
1. Events as persistent audit trail
2. Fire-and-forget for async processing
3. Pure handlers that return events
4. Generic daemon that publishes
5. Client can fire-and-forget or wait

The pattern scales from simple arithmetic to complex pipeline execution.

---

**Source:** Cloned from v0 (reusable dev env package)
**Status:** Complete and tested
**Next:** Clone to v1.1 for namespace structure work
