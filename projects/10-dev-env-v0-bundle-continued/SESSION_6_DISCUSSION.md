# Session 6 Discussion - Event Visibility and WYSIWI

**Date:** 2025-11-27
**Context:** Continuing Project 10, reviewing friction points from Session 5
**Status:** In progress - Item 1 complete, starting Item 2

---

## Starting Point

Session 5 completed splectrum node deployment (root + sidecar) and entry point design doc. It also exposed friction between designed workflow and actual exploration:

1. **Rushing led to shortcuts** - Writing directly to implementation/ instead of environment
2. **Workflow as overhead** - If the preferred way isn't the easiest way, that's a design signal
3. **Interactive vs detached mode** - Different activities need different workflows

---

## Friction Points Addressed

**Already addressed by design:**

1. **Interactive vs detached mode** - Context-aware routing. Same command, different behavior based on invocation location (dev bundle root vs environment).

2. **Node resolution** - Global `spl` finds nearest `splectrum/` traversing up. Invoke from anywhere.

3. **Invocation flexibility** - Three modes:
   - Single command CLI: discoverable, tab-completable
   - Inline script: exploration, multi-step, conditional
   - File script: reusable workflows

---

## Remaining Friction Points

**To be addressed through code review and re-implementation:**

1. **Selfeval runtime path** - Selfevals currently hand-craft records, bypassing real invocation. When runtime changes, they break silently.

2. **Event visibility** - Handler shortcuts lose traceability. Records should persist somewhere observable.

3. **Mode detection** - Happy path detection + background tamper detection (not blocking).

4. **Script library** - Should be part of node structure (`splectrum/scripts/`). Acknowledges existence of free scripting.

---

## WYSIWI Principle

**"What You See Is What Is"**

This is the programmatic side of a state (data) change approach:

- All relevant state is detected at runtime
- State is captured in the request execution record
- Code operates on record state only (not environment)
- Record is single source of truth during execution
- Debugging = inspect the record (everything is visible)

**Functional programming friendly:**
- Methods are pure functions of record → result
- No `process.cwd()` or environment sniffing mid-execution
- No hidden state

**Current violations in codebase:**
- Methods calling `process.cwd()` directly
- Selfevals constructing fake records (bypassing detection)
- Runtime context not fully captured in `spl.runtime`
- `process.chdir()` side effect in entry point

**Mindset shift required:**
This is a more uncommon but far more robust coding style. It requires adapting to, but pays off massively in:
- Auditability
- Debugging
- Reproducibility
- Testing

---

## Event Tracing for Auditability

**Core principle:** Splectrum needs to leave an appropriate trace of data change events so full auditing can be done.

- Every data change leaves a trace (event record on filesystem)
- Higher-level code may pseudo-compile lower levels (less detailed trace)
- But the trail is always sufficient for audit at that level
- DSL APIs are the abstraction layer for this

**Events as filesystem topics:**
- Records written to folders (topics)
- Folder = topic, file = event
- No additional tooling needed initially
- Visibility through standard filesystem tools (ls, cat)

---

## Code Review Observations

**spl.mjs (entry point):**
- Creates `runtime` object with `cwd`, `splectrumDir`, `invokedFrom`
- Passes to `run()`
- Missing: request ID, timestamp, event writing

**run.js (runner):**
- Builds record with `spl.request.completed = false` and `spl.runtime`
- Calls `methodMod.handle(record)` - fire and forget
- Missing: event persistence, request ID, timestamp
- Record disappears after execution (no visibility)

**WYSIWI violations identified:**
1. No request ID - can't correlate events
2. No timestamp - can't order events
3. No event persistence - record is ephemeral
4. `process.chdir(__dirname)` - side effect outside record

---

## What Needs to Happen

For proper WYSIWI and event visibility:

1. **Generate request ID** at entry point
2. **Capture timestamp** at entry point
3. **Detect runtime state** (mode, context) at entry point
4. **Register all state in record** before any method execution
5. **Write event record** to filesystem topic (before and/or after execution)
6. **Methods operate on record only** - no environment access
7. **Final record persisted** as completion event

---

## Decisions Made

1. **Script library** - Part of node structure (`splectrum/scripts/`)
2. **Event visibility** - Filesystem folders as topics, no additional tooling yet
3. **Mode detection** - Happy path + background tamper detection
4. **Selfeval fix** - Must invoke through same API as real usage

---

## Implementation Plan

**Sequence rationale:** Bootstrap thinking - use splectrum to build splectrum. Each piece we add becomes available for the next piece. Build tools that help you build tools.

| Order | Item | Rationale |
|-------|------|-----------|
| 1 | Entry point with node resolution | Foundation - find nearest splectrum/ |
| 2 | Script library | Workspace for building. Scripts help implement the rest |
| 3 | Event persistence | From here on, everything is observable |
| 4 | Request record creation/expansion | Now we have somewhere to write events |
| 5 | Dev mode detection and implementation | Detected state goes into record |
| 6 | Selfeval refactoring | Full invocation path now exists |
| 7 | Further code refactoring | Clean up remaining WYSIWI violations |

---

## Script-First Development Pattern

**Key insight:** Test/implement functionality as script first, then cast into API method.

1. **Script first** - Pure functionality. Input → output. Test it, iterate, get it right.

2. **Cast into API method** - Wrap with record handling. Record in → call script → record out → event.

**Separation of concerns:**
- Script: the *what* (logic, transformation)
- API method: the *how* (record state, events, audit trail)

**Benefits:**
- Scripts are easy to test (just run them)
- Scripts are easy to understand (no record ceremony)
- API methods become thin wrappers
- Data change approach layered on top, not mixed in
- Scripts remain reusable after casting

This explains why script library (#2) comes early - we need the workspace before we can build the infrastructure that tracks it.

---

## Progress

### Item 1: Entry Point with Node Resolution - COMPLETE

**Implemented:**
- Global `spl` entry point at `/home/herma/splectrum/spl2/spl`
- Node resolution: traverses up from cwd to find nearest `splectrum/` with `package.json` containing `name: "splectrum"`
- Three invocation modes working:
  1. Single command: `spl spl/dev/cycle --name=env-123`
  2. Inline script: `spl "console.log(runtime.nodeRoot)"`
  3. File script: `spl ./script.js --arg=value`
- Added to PATH in `~/.bashrc`
- Programmatic API: `spl.dev.cycle()` → 3-level (package/api/method)

**Key design decisions:**
- All logic in JS (bash wrapper is minimal)
- Node detected by `splectrum/package.json` with `name: "splectrum"`
- Runtime captured upfront (WYSIWI): nodeRoot, splectrumDir, invokedFrom, mode
- Global spl resolves to nearest node - dev bundles in projects override root node

**Files modified:**
- `/home/herma/splectrum/spl2/splectrum/spl.mjs` - Rewritten with node resolution, mode detection, triple invocation
- `/home/herma/splectrum/spl2/splectrum/scripts/` - Created (script library folder)
- `~/.bashrc` - Added PATH entry

### Item 2: Script Library - COMPLETE

**Implemented:**
- Script resolution: `spl scriptname` resolves from `splectrum/scripts/` folder
- Scripts live inside the node (not at nodeRoot)
- Added `_positional` array to parsed args for positional arguments
- Added `cwd` alias to runtime for backwards compatibility

**Built-in scripts created:**
- `splectrum/scripts/status.js` - Node status, directories, package info
- `splectrum/scripts/list-methods.js` - List available methods
- `splectrum/scripts/help.js` - General help or method-specific help

**Mode detection (final):**
1. Explicit file path (./script.js, ../script.js, /absolute/path) → file mode
2. Starts with `/*` → inline script mode (preamble required)
3. Script name found in `splectrum/scripts/` → library mode
4. Default → command mode (method path)

**Four invocation modes:**
1. `spl spl/dev/cycle --name=env` - command mode (default)
2. `spl status --verbose` - library mode
3. `spl ./workflow.js --arg=val` - file mode
4. `spl "/* script */ code"` - inline script mode (requires `/*` preamble)

### Node Structure Discussion

Significant design discussion captured in `NODE_STRUCTURE_DESIGN.md`:

**Mycelium web pattern:**
- Self-similar structure at every level
- Each folder has: README.md, README.json, _reqs/ (when meaningful)
- Pattern cascades from repository to node to folder to module

**Node structure (splectrum/ IS the node):**
```
splectrum/
├── README.md, README.json, package.json
├── _reqs/           # Node requirements
├── docs/            # Documentation
├── scripts/         # Script library
├── data/            # Persistent node storage
├── apps/            # User-facing apps
│   └── cli/         # Default CLI app
│       ├── config/
│       ├── state/
│       ├── session/requests/
│       └── channel/
├── runtime/         # Node-internal (system, boot)
├── lib/, modules/
└── spl.mjs, run.js
```

**App model:**
- App = self-contained unit (config, state, session, channel)
- Apps are external-facing (request context in, response routing out)
- Runtime is internal-facing (system maintenance, boot)
- CLI is the default app (`apps/cli/`)
- Apps can bridge to external systems (git, s3, webhooks)

### Item 3: Event Persistence - IN PROGRESS

**Design work completed:**
- EVENT_STORAGE_DESIGN.md captures DCE principles and structure
- Two-level event structure (app DCEs vs session DCEs)
- File/folder storage: folder = key prefix, filename = timestamp
- Complete record snapshots (no deltas)
- Handler/app owns its topic structure

**Implementation started:**
- Created `apps/cli-static/` - default app for terminals without specific ID
- Entry point builds proper Kafka-style record structure
- App routing via `SPL_TERMINAL_ID` env var (format: `appId` or `appId:appInstanceId`)
- Simple echo flow working (no DCE writing yet)

**Record structure (entry point → app):**
```javascript
{
  headers: {
    spl: {
      request: {
        id: 'req-<timestamp>-<random>',
        timeReceived: <timestamp>,
        appId: 'cli-static',
        appInstanceId: null  // for instance-specific apps
      },
      runtime: {
        nodeRoot, splectrumDir, invokedFrom, globalSplectrumDir
      }
    }
  },
  value: {
    mode: 'command',  // or 'script'
    request: {
      method: 'spl/dev/deploy',
      input: { name: 'env-123' }
    }
  }
}
```

**Key design decisions:**
- Entry point does all resolution work (script loading, arg parsing)
- Apps receive normalized, ready-to-process records
- Terminal ID can route to different apps (cli-static is default)
- No FAFs in entry point happy path

**Next:** App hands off to session for actual processing
