# Event Storage Design

**Project:** 10 - Dev Env v0 Bundle Continued
**Created:** 2025-11-28
**Status:** Working document - to be formalized at project closure

---

## Overview

Data change events are the audit trail of splectrum processing. They capture the complete state of a record at each processing step completion, enabling visibility, debugging, replay, and pattern-based processing.

## Core Principles

### Events at Step Completion

A data change event is written at the completion of each processing step. A processing step is typically:
- Execution of an API method
- (Scripts: responsibility on script author for visibility - to be explored)

### Fire and Forget

Event writing is fire-and-forget. Writers don't wait for consumers. Downstream processing is triggered by pattern matching on data, not by direct invocation.

### State in Data, Processing Anchored in Patterns

This is a general rule across the board:
- State is kept in data (not hidden in code)
- Processing is anchored in state patterns
- If a pattern matches, processing triggers

### Complete Snapshots

Event content is the **complete record as-is** at that point in time - a full data dump. No delta processing, no change detection. The record state is captured completely.

This is "more than complete" - contains everything, not just what changed.

### Kafka-like Topics

Events are organized like Kafka topics:
- Folder = topic
- Files = events on that topic
- Multiple events with same primary key = state changes over time

## Storage Structure

### File/Folder Approach

Initial storage uses filesystem:
- One event = one file
- Maximum visibility with standard tools (`ls`, `cat`, `grep`)
- Easy debugging: just read the file
- Git-friendly: diffs make sense

### Primary Key Structure

The primary key is distributed across:

| Component | Location |
|-----------|----------|
| Topic | Top-level folder |
| Key prefix | Subfolder structure |
| Timestamp | Filename |
| Key remainder | Inside record (`key` field) |

**Pattern:**
```
<topic-folder>/<primary-key-prefix-as-folders>/<timestamp>.json
```

**Example:**
```
apps/cli/session/requests/
└── spl-dev-cycle/           # Key prefix (method path)
    └── 1732789234567.json   # Timestamp filename
```

Record contains:
```json
{
  "key": {
    "requestId": "req-abc123",
    "method": "spl/dev/cycle"
  },
  "timestamp": 1732789234567,
  "record": { ... full record state ... }
}
```

### Filename Convention

Filename is the **timestamp** (milliseconds since epoch):
- Enables natural ordering
- Easy seek operations
- Unique within key prefix folder
- Sortable with standard tools

### Why Not AVRO (Yet)

AVRO containers offer:
- Better I/O efficiency at scale
- Schema evolution
- Multiple events per file

But require tooling to inspect, reducing visibility.

**Decision:** Start with file/folder for visibility during development. AVRO (or similar) becomes relevant when:
- Event volume makes file-per-event impractical
- Schema enforcement needed
- I/O performance matters at scale

This is a **pseudo-compilation** concern - when optimizing, compact detailed events into denser formats.

## Handler Ownership

Each handler type owns its event storage structure:

```
apps/cli/
└── session/
    └── requests/           # CLI handler's topic structure
        └── ...

apps/api/
└── session/
    └── requests/           # API handler's topic structure (may differ)
        └── ...
```

**Handler owns:**
- Topic structure and naming
- File naming conventions within topics
- Cleanup and housekeeping policies
- Pattern-based processing on its own events

This keeps handlers self-contained. Different handlers can have completely different structures suited to their needs, without external dependencies.

## Pseudo-Compilation and Scalability

Small DSL steps produce many events (high visibility, detailed audit trail).

When focus shifts to higher context levels:
- Steps can be pseudo-compiled into larger units
- Fewer visible data change events
- Necessary transition for scalability

The storage pattern supports both:
- Verbose/visible during development and debugging
- Compiled/dense when scaling

## Two-Level Event Structure

The CLI interacts with the splectrum node through the app. This creates two distinct DCE contexts:

### The Flow

```
CLI (Customer)
 │
 │  "I'd like to deploy an environment"
 ▼
App (Shop)
 │  - Receives order
 │  - Tracks order state
 │  - Deals with customer concerns
 │  - Sends order to manufacturing
 │  - Receives finished goods
 │  - Delivers to customer
 ▼
Session (Manufacturing)
    - Receives work order
    - Executes the work
    - Returns finished product
```

### App vs Session Concerns

| Layer | Concerns | DCEs capture |
|-------|----------|--------------|
| App | Customer identity, order tracking, auth, permissions, delivery, quotas | Request received, response sent, app state changes |
| Session | How to build it, processing steps, resources | Method completions, processing steps, internal state |

The app doesn't care *how* manufacturing works.
The session doesn't care *who* the customer is.

### App-Level DCEs

Client-server interaction audit trail:
- Request received from CLI
- Response sent to CLI
- App state changes (config, customer context)
- Future: auth events, permission checks, rate limiting

### Session-Level DCEs

Internal processing audit trail:
- Method execution completions
- Processing step completions
- Internal orchestration events

### Folder Structure

```
apps/cli/
├── events/              # App DCEs (client-server interaction)
│   └── <timestamp>.json
├── config/
├── state/
├── session/
│   └── events/          # Session DCEs (internal processing)
│       └── <timestamp>.json
└── channel/
```

### Separation Benefits

- **Different retention policies**: App events (external contract) may need longer retention than session events (internal detail)
- **Different verbosity**: Session can be more verbose during debugging
- **Clean boundaries**: Future concerns (auth, quotas) live at app level
- **Independent scaling**: Session events may be pseudo-compiled separately

## cli-static App: Storage Structure

**Note:** This is app-specific. Other apps can structure storage differently.

```
apps/cli-static/
├── requests/                        # App request/response DCEs
│   ├── <timestamp>.json             # Request received
│   └── <timestamp>.response.json    # Response sent
├── config/
├── state/
├── session/
│   └── events/                      # Session DCEs (internal processing)
│       └── <timestamp>.json
└── channel/
```

**Request/response pairing:**
- Same timestamp = same request lifecycle
- `.response.json` suffix = response record
- Natural correlation via filename
- `ls *.response.json` = all responses
- Sorted listing shows pairs together

**Request received example:**
```json
{
  "headers": {
    "spl": {
      "request": { "id": "req-...", "timeReceived": 1732789234567 },
      "runtime": { "nodeRoot": "/path/to/splectrum" }
    }
  },
  "value": {
    "mode": "command",
    "appId": "cli-static",
    "appInstanceId": null,
    "invokedFrom": "/path/to/cwd",
    "method": "spl/dev/deploy",
    "input": { "name": "env-123" }
  }
}
```

**Session event example (method completed):**
```json
{
  "key": {
    "requestId": "<generated-id>",
    "method": "spl/dev/deploy"
  },
  "timestamp": <milliseconds>,
  "type": "method.completed",
  "record": {
    "headers": { ... },
    "value": ...
  }
}
```

## Pattern-Based Processing

Events sitting in topics can trigger processing:

1. **Pattern matcher** watches topic (or polls)
2. **Pattern matches** (e.g., "failed request", "environment created")
3. **Processing triggers** (cleanup, notification, follow-up action)

This is data-driven, not code-driven. The event data determines what happens next.

## App API - Metastate

The app API (`spl/app/`) defines app configuration as metastate, synced with state.

**Metastate properties:**

| Property | Type | Description |
|----------|------|-------------|
| `appModuleOverride` | boolean | Enable app+node module resolution stack |

**Storage:** `apps/<app>/config/app.json`

**Runtime:** Entry point loads metastate → populates `runtime.appModuleOverride`

**Effect:** Override affects both app and session (whole realm).

---

## Request API - Record Structure

The request API (`spl/request/`) handles incoming requests to the node. Even before implementing methods, we define the data contract - the request record structure.

**Note:** Our module structure (`package/api/method`) naturally becomes both a functional AND data requirements store. Each API holds:
- Functional requirements: methods, what they do
- Data requirements: record structures, contracts

The API is the natural home for its data contracts.

The request record follows Kafka-style conventions with clear separation of concerns:

### Headers vs Value (Metadata vs State)

| Component | Purpose | Contents |
|-----------|---------|----------|
| **Headers** | Public metadata - travels with record, shared with all | Request identity, runtime context |
| **Value** | Payload - request API state, local concerns | App routing, method, input |

### Why This Separation?

**Headers (metadata)** answer: "What is this record? Where did it come from?"
- Immutable identity (request ID, timestamp)
- Execution context (node paths)
- Shared across all processing steps
- Useful for logging, tracing, debugging

**Value (state)** answers: "What should happen? How should it be routed?"
- App routing (`appId`, `appInstanceId`) - local concern, not global identity
- Request details (`method`, `input`)
- Can be transformed as record flows through processing

### Request Record Shape

```javascript
{
  headers: {
    spl: {
      request: {
        id: "req-1732789234567-abc123",
        timeReceived: 1732789234567
      },
      runtime: {
        nodeRoot: "/path/to/splectrum"  // The splectrum/ folder IS the node
      }
    }
  },
  value: {
    mode: "command",
    appId: "cli-static",
    appInstanceId: null,
    invokedFrom: "/path/where/user/ran/command",
    method: "spl/dev/cycle",
    input: { name: "env-123" }
  }
}
```

### What Goes Where

**Headers (public metadata):**
- `request.id`, `request.timeReceived` - immutable request identity
- `runtime.nodeRoot` - the splectrum node handling this request
- `consumers` - trail of who consumed this record (boundary crossings)

**Value (request state):**
- `appId`, `appInstanceId` - local routing concern
- `invokedFrom` - request-specific context (where user ran command)
- `method`, `input` - what to do

### Consumer Trail

When a record crosses a boundary, the consumer stamps itself:

```javascript
headers: {
  spl: {
    request: { id, timeReceived },
    runtime: { nodeRoot },
    consumers: [
      { id: 'runtime/cli-static', timestamp: 1732789234600 },
      { id: 'apps/cli-static', timestamp: 1732789234700 }
    ]
  }
}
```

**Boundary crossings only** - internal processing (e.g., inbox → processing → outbox within session) doesn't need tagging.

**Consumer ID format:** Path to the self-contained unit:
- `runtime/cli-static` - session (no instance)
- `runtime/my-app/instance-1` - session with instance
- `apps/cli-static` - app picking up response

**Core principle:** Splectrum implementation is always async (FAF). Some contexts wrap with sync for client convenience.

- Async is fundamental, sync is wrapper
- CLI waits for response = sync wrapper over async processing
- The underlying FAF model doesn't change

### Boundary Crossing at Scale

The consumer trail pattern scales beyond app ↔ session:

| Boundary | Consumer stamp |
|----------|----------------|
| App ↔ Session | `runtime/cli-static`, `apps/cli-static` |
| Node ↔ Node | `node/node-id-123` |
| Peer ↔ Peer | `peer/peer-id-abc` |

Records carry their journey. Same pattern, any scale - including P2P networks.

### Visibility from Data

**Happy path:** Consumer trail shows successful journey through the system.

**Exception path:** Search records to reconstruct what went wrong:
- Record stuck in inbox? → Last consumer shows who didn't pick up
- Missing consumer stamp? → Boundary crossing failed
- Record in processing forever? → Consumer picked up but didn't complete

The data is the audit trail. No separate logging needed.

---

## Fire and Forget (FAF) Pipeline

Reusable FAF pipeline for atomic writes with dedupe handling.

### FAF Data Contract

```javascript
{
  folder: "apps/cli-static/requests",  // Target folder
  filename: "1732789234567.json",       // Target filename
  dedupe: "numeric-digit",              // Dedupe algorithm
  record: { ... }                       // Data to write
}
```

**Caller owns:** filename strategy, folder structure
**FAF owns:** atomic-write-with-dedupe mechanics

### Implementation

1. Async write to temp file (temp folder, temp name)
2. Atomic rename to final location
3. Dedupe: check filename exists, apply algorithm if collision

### Dedupe Algorithms

**numeric-digit**: Append digit, increment on collision (no separator)
```
1732789234567.json      # first attempt
17327892345670.json     # collision → append 0
17327892345671.json     # collision → increment
```

### FAF Location (POC)

Lives in `apps/cli-static/scripts/faf.js` while proving out.
Graduates to node-level or module when formalized.

---

## Open Questions

1. **Request ID generation** - UUID? Timestamp-based? Sequential?
2. **Cleanup policy** - Age-based? Count-based? Manual?
3. **Error events** - Same topic or separate?
4. **Multiple events per request** - Start event + completion event, or just completion?

---

## References

- NODE_STRUCTURE_DESIGN.md - App and session model
- SESSION_6_DISCUSSION.md - WYSIWI principle
