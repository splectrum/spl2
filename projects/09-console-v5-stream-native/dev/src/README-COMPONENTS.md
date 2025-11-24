# Reusable Components - Iteration 1

## Overview

Iteration 1 demonstrates fire-and-forget + handler daemon pattern with modular, reusable components.

## Core Components

### 1. `data.js` - Data Layer (Filesystem)
**Purpose:** Event persistence and retrieval

**Operations:**
- `publish(topic, event)` - Create new event (append-only, atomic)
- `consume(topic, options)` - Read events in order
- `seek(topic, position)` - Jump to position
- `read(topic)` - Get latest
- `write(topic, data)` - Create new version

**Key Feature:** Atomic writes (temp + rename) ensure listeners only see complete files

**Status:** ✅ Tested and stable

---

### 2. `daemon-core.js` - Generic Handler Daemon
**Purpose:** Reusable polling-based event processor

**API:**
```javascript
const { createDaemon } = require('./daemon-core.js')

const daemon = createDaemon({
  requestDir: '/path/to/request/dir',
  processEvent: (requestId, event) => {
    // Your processing logic here
  },
  pollInterval: 100  // optional, default 100ms
})

daemon.start()  // Start processing
daemon.stop()   // Stop processing
```

**How it works:**
1. Polls `requestDir` every 100ms (configurable)
2. For each request, tracks last processed step number
3. Finds next sequential step (lastStep + 1) with status 'pending'
4. Calls `processEvent(requestId, event)`
5. Marks step as processed, continues to next

**Key Feature:** Sequential step tracking prevents reprocessing

**Status:** ✅ Tested and stable

---

### 3. `iteration-1-handler.js` - Sequential Arithmetic Handler
**Purpose:** Process arithmetic expressions one operation at a time

**Functions:**
- `parseNextOperation(expression)` - Extract next operator and operand
- `executeOperation(value, operator, operand)` - Perform calculation
- `processRequest(requestId, event)` - Main handler logic

**Event Flow:**
- Step 0: Parse initial value, publish step 1
- Step 1+: Process one operation, publish next step
- Final: When `remaining` is empty, status = 'completed'

**Event Structure:**
```javascript
{
  requestId: "req-...",
  step: 2,
  value: 8,              // Current result
  remaining: "- 2",      // Unparsed expression
  originalInput: "3 + 5 - 2",
  status: "pending"      // or "completed"
}
```

**Status:** ✅ Tested and stable

---

### 4. `handler-daemon.js` - Iteration 1 Main
**Purpose:** Combine daemon-core + iteration-1-handler

**Usage:**
```bash
node handler-daemon.js
```

**Status:** ✅ Tested and stable

---

### 5. `invoke.js` - Request Creator
**Purpose:** Fire-and-forget request submission

**Usage:**
```javascript
const invoke = require('./invoke.js')
const requestId = invoke.createRequest("3 + 5 - 2")
```

**Status:** ✅ Tested and stable

---

## Test Files

### `iteration-1-async-test.js`
Submits 4 test cases, fire-and-forget

### `iteration-1-check-results.js`
Verifies results and shows audit trail

## Reusability for Future Iterations

### For Iteration 2 (Operator Precedence):
1. **Reuse:** `daemon-core.js`, `data.js`, `invoke.js`
2. **Replace:** `iteration-1-handler.js` → `iteration-2-handler.js`
3. **Update:** `handler-daemon.js` to import iteration-2-handler

### For Iteration 3 (Nested Expressions):
1. **Reuse:** `daemon-core.js`, `data.js`
2. **Create:** `iteration-3-handler.js` (sub-pipeline logic)
3. **May need:** Enhanced event structure for parent/child relationships

### For Iteration 4 (Multi-nested):
1. **Reuse:** Everything from Iteration 3
2. **Enhance:** Handler to manage multiple concurrent sub-pipelines

## Key Patterns Established

✅ **Fire-and-forget:** Each step publishes next step and exits
✅ **Sequential processing:** Daemon tracks step numbers, no reprocessing
✅ **Immutable events:** Events never change, new events created
✅ **Atomic writes:** Temp + rename prevents partial reads
✅ **Modular handlers:** Business logic separate from daemon infrastructure

## Testing

```bash
# Terminal 1: Start daemon
node handler-daemon.js

# Terminal 2: Submit requests and check results
node iteration-1-async-test.js
sleep 1
node iteration-1-check-results.js
```

All 4 test cases pass: `3+5-2=6`, `10+20+30=60`, `100-50-25=25`, `7+3+1+9=20`
