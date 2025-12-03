# Entrypoint Pipeline Discussion

**Date:** 2025-12-02

---

## Context

Continuing Project 11 work on app architecture. After implementing appRoot/sessionRoot, moved to analyzing and refactoring the entrypoint pipeline.

---

## Decision Points

### 1. Runtime Identity Properties

**Decision:** Fixed properties over calculated ones.

```js
{
  nodeRoot: '/path/to/node',      // absolute
  appRoot: 'apps/cli-static',     // relative to nodeRoot
  sessionRoot: 'runtime/cli-static'  // relative to nodeRoot
}
```

- No magic derivation (e.g., no `sessionRoot = appRoot.replace('apps/', 'runtime/')`)
- Explicit, readable, can diverge if needed
- App sets these - the app knows its own identity

### 2. Single Pipeline Architecture

**Decision:** All external entry goes through node root `spl.mjs`.

- `spl` (global) → resolves to node → always invokes `spl.mjs` at node root
- Node root is the gatekeeper - all routing decisions happen there
- No bypassing - single entry point into the node

### 3. Routing Abstraction

**Decision:** Abstract routing into cli library.

- Add `routeRequestHandler()` to cli library
- Currently returns cli-static handler (hardcoded)
- Routing logic in one place, ready for location-aware routing later
- Different routing patterns for different entry types:
  - **Terminal route** - location-aware, current work
  - **AVRO RPC route** - direct to app entry point

### 4. App Entry is Internal

**Decision:** Remove CLI handling from `entryPoint.js`.

- App entry is internal only - no direct CLI invocation
- Record already exists when reaching app (Kafka pattern)
- Handover from node spl.mjs to app is internal - just function call with record
- `entryPoint.js` simplifies to identity injection only

### 5. Apps are Methods/Scripts, Not a Fourth Pathway

**Decision:** Three execution pathways remain.

| Pathway | Example |
|---------|---------|
| Method | `pkg/api/method` |
| Script file | `/path/to/script.js` |
| Inline script | `spl/script/inline` |

- An app entry is just a method or script
- The "app-ness" is internal implementation detail
- Caller doesn't know or care if they're calling an app
- Like calling into a **stateful component**

### 6. Apps are Stateful Components

**Decision:** Apps maintain persistent context across requests.

Two concepts:
1. **Request is synchronous** - call in, get response back
2. **App is stateful** - context persists across requests

The app lives, retains configuration/state. Requests come in synchronously, use that persistent context, return.

**Examples:**
- Data layer app: holds connections, caches, config
- Git app: holds repo context, working directory

### 7. Apps are Observable

**Decision:** Apps track what flows through them.

For debugging/bug reports:
```
"Data layer app, what requests were made by requestId 12345?"
→ returns: queries made, mutations, timing, etc.
```

- Each app is a self-aware boundary
- Can report on its own activity
- With appropriate IDs, can interrogate the system for full information

---

## Key Insight

> "As long as we have the appropriate ids, we can interrogate the system for full information."

This shapes solution design massively:
- Every request has an ID that flows through the system
- Each app boundary can be queried about that request
- Full observability through stateful, introspectable components

---

## Implementation Status

| Item | Status |
|------|--------|
| appRoot/sessionRoot properties | Done |
| Remove CLI handling from entryPoint.js | Pending |
| Simplify app entry pattern | Done - API-as-app model |
| Add routeRequestHandler to cli library | Superseded - routing via API method |
| Update node spl.mjs routing | Done - calls spl/cli-static/execute |

---

## Refined Model: API as App

*Insight from continued discussion*

### Core Concept

**An API method executes within the state of the API. An app has persisted state. The method must load the app state and execute within it.**

- The method IS the handler
- The API IS the app
- If handler is generic, it's inherited from base app API

### Inheritance Model

```
spl/app                    ← base app API (generic handler)
   │
   └── spl/cli-static      ← extends spl/app (concrete app with state)
          │
          └── execute      ← method runs within cli-static's state
```

### Override Pattern

Like `base.method()` in Java - override can call base:

```js
// spl/cli-static/execute (override)
async invoke() {
  // Custom pre-processing (load app state, etc.)

  await base.execute(record)  // call inherited implementation

  // Custom post-processing
}
```

### Audit Trail

Override chain is traceable:
```
Request log:
  → spl/cli-static/execute (entry)
    → spl/app/execute (base call)
      → actual method execution
    ← base returns
  ← override returns
```

Full visibility into execution path through overrides.

### Benefits

- **No special framework** - just module/API inheritance
- **App is just an API** - with persisted state
- **Method is the handler** - natural fit
- **Overrides are audited** - call chain visible
- **Pipeline follows same pattern** - each stage is method call, traceable

---

## Implications for Design

- Apps as persistent services, not per-request handlers
- Request ID as correlation key across app boundaries
- Built-in diagnostics/debugging through app observability
- Clean separation: routing (node level) vs execution (app level)
- **Pipeline stages** - same API/method pattern, traceable
- **Inheritance for shared behavior** - base app provides generic handling

---

## Implementation Summary

**Implemented 2025-12-02:**

1. **app.json** - App state file at `apps/cli-static/app.json`
   - Contains: name, appRoot, sessionRoot
   - Loaded by execute method

2. **spl/app** - Base app API
   - `spl/app/execute` - base execute method (load state, merge request)

3. **spl/cli-static** - CLI Static App API
   - Extends spl/app
   - `spl/cli-static/execute` - session-based handler
   - Loads app state, starts session watchers, FAF to inbox, consumes result

4. **Root spl.mjs routing**
   - Calls `spl/cli-static/execute` directly
   - No intermediate framework needed

**Deleted files:**
- `lib/entryPoint.js` - superseded by API-as-app model
- `apps/cli-static/spl.mjs` - superseded by spl/cli-static/execute
- `apps/cli-static/app.mjs` - logic moved to spl/cli-static/execute
- `apps/cli-static/session.mjs` - logic moved to spl/cli-static-session/execute
- `spl/request/execute` - superseded by spl/cli-static/execute

**Key insight realized:** The API IS the app. Methods execute within API state. No special framework - just modules with inheritance.

---

## Record Structure Evolution

### Namespaced Headers by API

Each API has its own header space:

```json
{
  "headers": {
    "spl": {
      "request": { ... },
      "runtime": {
        "nodeRoot": "...",
        "appAPI": "spl/cli-static",
        "sessionAPI": "spl/cli-static-session"
      },
      "cli-static": {
        "name": "cli-static",
        "root": "apps/cli-static"
      },
      "cli-static-session": {
        "name": "simple",
        "root": "runtime/cli-static/requests"
      }
    }
  },
  "value": {}
}
```

- **runtime.appAPI** - points to app API (e.g., `spl/cli-static`)
- **runtime.sessionAPI** - points to session API (e.g., `spl/cli-static-session`)
- **headers.spl.[api-name]** - metadata for that API

### Value vs Headers

- **value** - actual state/payload data
- **headers** - metadata for routing/processing
- App state goes in value, exposed in metastate (headers) what's needed elsewhere

---

## App → Session Handover

### Session as Separate Component

- Session governs internal processing (parallelism, queue management, etc.)
- App chooses session type - can change during lifetime
- Session is request-stateless but context-aware via runtime

### Handover Flow

```
Root spl.mjs
  → spl/cli-static/execute (app handler)
    → loads app.json
    → sets headers.spl.cli-static
    → sets headers.spl.cli-static-session
    → sets runtime.appAPI, sessionAPI
    → spl/cli-static-session/execute (session handler)
      → reads config from headers
      → watchers, FAF, process
      → returns result
```

Record evolution through pipeline. Each component adds its metadata.

### Session Configuration

Session config in app state file (app.json):

```json
{
  "headers": {
    "spl": {
      "cli-static-session": {
        "name": "simple",
        "root": "runtime/cli-static/requests"
      }
    }
  }
}
```

App owns configuration, session provides behavior.

---

## Execute = Load + Handle

### Method Decomposition

```
spl/cli-static/execute = spl/cli-static/load + spl/cli-static/handle
spl/cli-static-session/execute = spl/cli-static-session/load + spl/cli-static-session/handle
```

- **load** - reads state from file, sets up context
- **handle** - processes request (assumes state loaded)
- **execute** - composes both

Clean decomposition:
- Load is reusable (can load without handling)
- Handle is focused (assumes context ready)
- Execute is convenience composition

---

## State Management Pattern

### Data Change Record

State changes follow event-sourcing pattern:

- **load** → reads last record from state file
- **property update** → triggers FAF (fire and forget)
- Change record written to state topic
- Next load reads latest

```
spl/cli-static.someProperty = newValue
  → triggers FAF to state topic
  → change record written
  → next load reads latest
```

### Benefits

- Full audit trail of state changes
- Observable, traceable, recoverable
- State file becomes change log, not just current state
- Every mutation is a recorded event

### State Files

- **app.json** - app state in `apps/cli-static/app.json`
- **session.json** - session state (separate file, not embedded)

---

## Implementation Summary (Updated)

**Implemented:**

1. **app.json** - Namespaced headers structure
   - `headers.spl.cli-static` - app metadata
   - `headers.spl.cli-static-session` - session metadata
   - `value` - app state

2. **spl/cli-static/execute** - App handler
   - Loads app.json
   - Sets headers and runtime (appAPI, sessionAPI)
   - Calls session handler
   - Extracts output

3. **spl/cli-static-session/execute** - Session handler
   - Reads config from headers
   - Manages watchers (inbox → processing → outbox)
   - FAF and consume pattern

4. **Root spl.mjs**
   - Routes to app via `requireSpl('spl/cli-static/execute', record)`
   - Clean handover

**To implement:**

- Execute = Load + Handle decomposition
- Separate session.json file
- Data change record pattern (FAF on property update)
- Load as reusable method

---

## Clean Code Result

Each handler is focused:

- **Root** - routing decision only
- **App handler** - load state, set context, delegate to session
- **Session handler** - processing strategy only

No tangled responsibilities. Record carries context forward. Each component reads what it needs from headers, adds what it contributes.
