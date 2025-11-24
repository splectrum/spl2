# Execution and Free Scripting Exploration Notes

**Date:** 2025-11-21
**Context:** Product Twin 1 - Building Blocks Exploration

---

## Core Insights

### Free Scripting and Events Are Compatible

Free scripting doesn't prevent event-based execution. Script can submit events, wait for results, manage flow - it just writes code that interacts with the event system.

### Batch Pattern at Multiple Levels

Sequential execution via batch at any scope:

**Method level:**
```javascript
spl.console.batch([
  { method: "log", params: {...} },
  { method: "warn", params: {...} }
])
```

**API level:**
```javascript
spl.batch("console", [
  { method: "log", params: {...} },
  { method: "warn", params: {...} }
])
```

**Package level:**
```javascript
spl.batch("spl", [
  { api: "console", method: "log", params: {...} },
  { api: "dev", method: "create", params: {...} }
])
```

**Root level (cross-package):**
```javascript
spl.batch([
  { package: "spl", api: "console", method: "log", params: {...} },
  { package: "custom", api: "deploy", method: "start", params: {...} }
])
```

---

## Execution Mode

**Fundamental:** Execution mode goes in execution record.

```javascript
{
  executionMode: "sequential",  // or "parallel", "conditional", "adaptive", etc.
  modeData: {
    steps: [...],      // for sequential
    branches: [...],   // for parallel
    rules: {...}       // for adaptive
  }
}
```

### Handler Implements Mode

Handler runs mode, may borrow existing modes:

```javascript
// Shared mode implementations
const modes = {
  sequential: async (event, executor) => {
    const step = event.modeData.steps[event.executionState.stepIndex]
    const result = await executor(step)
    event.runtimeState.currentOutput = result
    event.executionState.stepIndex++
    event.complete = (event.executionState.stepIndex >= event.modeData.steps.length)
    return event
  }
}

// Handler uses mode
const consoleHandler = {
  execute: async (event) => {
    const mode = modes[event.executionMode]
    return await mode(event, (step) => consoleAPI[step.method](step.params))
  }
}
```

**Modes are reusable patterns.** Handler runs mode, provides execution function.

### Handlers Can Be Multimodal

Handler can switch modes mid-execution as long as event state tracks it:

```javascript
executionState: {
  currentMode: "sequential",
  modeStack: [{ mode: "sequential", stepIndex: 3 }],  // for mode switching
  stepIndex: 5
}
```

**Error handling = mode switch:**

```javascript
if (event.error) {
  event.executionState.previousMode = event.executionState.currentMode
  event.executionState.currentMode = "error-recovery"
}

// Error recovery logic
if (recovered) {
  event.error = null
  event.executionState.currentMode = event.executionState.previousMode
}
```

Error doesn't break flow, it switches to error-handling mode.

---

## Handler Internal State

**Critical:** If handler has internal state, it must state dump with same cadence as execution steps.

**Solution:** Independent state stream.

```
events/requests/         ← Execution events
events/handler-state/    ← Handler state dumps
```

**Request event:**
```javascript
{
  eventId: "req-123",
  pipelineType: "spl/console",
  executionMode: "sequential",
  runtimeState: {...},
  executionState: {...}
}
```

**Handler state event:**
```javascript
{
  eventId: "state-456",
  associatedRequest: "req-123",
  handlerId: "console-handler-001",
  handlerState: {
    cache: {...},
    counters: {...},
    context: {...}
  }
}
```

**Price of freedom:** Independent state streams. Low management overhead, fire and forget.

---

## Mutable vs Immutable Execution

**Key distinction:** Execution record is mutable (happy path). Event trail is immutable (audit/exception).

### Mutable Execution Record

**Minimal and complete for happy path:**
```javascript
// execution/current/req-123.json
{
  eventId: "req-123",
  pipelineType: "spl/console",
  executionMode: "sequential",
  runtimeState: { /* current state */ },
  executionState: { stepIndex: 2, currentMode: "sequential" }
}
```

- Overwritten each step (mutable)
- Just enough info to execute next step if all goes well
- Suffers from "appropriate memory loss"

### Immutable Event Trail

**More than complete for reconstruction:**
```javascript
// events/audit/req-123/event-001.json
{
  eventId: "req-123",
  sequence: 1,
  timestamp: "...",
  runtimeState: { /* full snapshot */ },
  executionState: { /* full snapshot */ },
  metadata: { codeVersion, environment, timing, ... }
}
```

- Fire and forget (never modified)
- Rich metadata for reconstruction
- Used when deviating from happy path

### Handler Writes Both

1. Rich event to audit trail (preserves everything)
2. Lean event to execution record (discards past, keeps future-needed)

**Execution record can discard information after fire-and-forget** - it can always be recovered from audit trail.

---

## Natural Forgetfulness

**Not:** Managed retention policies
**Instead:** Natural forgetfulness via structure

```javascript
{
  // PRESENT (kept in execution record)
  current: {
    input: {...},
    output: {...},
    step: 5,
    mode: "sequential"
  },

  // CONTEXT (kept - needed for execution)
  runtime: {
    platform: "node",
    apiStates: {...}
  },

  // PAST (naturally forgotten from execution record)
  history: {
    steps: [...],
    outputs: [...]
  },

  // RECONSTRUCTION (naturally forgotten from execution record)
  metadata: {
    timestamp: "...",
    codeVersion: "...",
    environment: {...}
  }
}
```

**Structure implies lifecycle:**
- `current.*` → kept, overwritten each step
- `runtime.*` → kept, accumulates
- `history.*` → written to audit, dropped from execution
- `metadata.*` → written to audit, dropped from execution

**The art of minimizing friction:** Natural forgetfulness rather than managed retention policies.

The shape of the data tells you its lifecycle. No retention policy code needed.

---

## One Event Type: Leaky Bucket

**Not two types of events.** One event, appropriately leaky.

**Handler writes event (info-rich NOW):**
- Full richness in the present
- Fire and forget to audit trail (preserves richness)
- Leak/discard for execution record (keep only what's needed)

**Same event structure, different retention:**
1. **Audit trail:** Preserves full richness (immutable)
2. **Execution record:** Leaks past information, keeps future-needed (mutable)

**Appropriate leakiness:** Event structure naturally implies what stays vs. what's forgotten.

---

## Key Principles

1. **Free scripting + events compatible** - script manages event flow
2. **Execution mode fundamental** - goes in execution record
3. **Handler implements mode** - runs it, may borrow shared modes
4. **Handlers multimodal** - can switch modes, track state
5. **Error handling = mode switch** - not flow break
6. **Independent state streams** - handler state separate from requests
7. **Mutable execution record** - minimal for happy path, appropriate memory loss
8. **Immutable audit trail** - rich for reconstruction/exceptions
9. **Natural forgetfulness** - structure implies lifecycle
10. **One event type** - leaky bucket pattern

---

**These explorations inform Product Twin 1 event structure design.**
