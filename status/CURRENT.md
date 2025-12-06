# Current Status

**Last Updated:** 2025-12-06 (session 2)

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - Item 3 (App-based experience)**
- Location: `projects/11-app-architecture/`

### Current Focus

**Container Implementation** - base structural type with inherited API.

Key deliverables completed:
- App-session pipeline with proper inbox/outbox pattern
- State management via `faf`/`consumeLatest` pair
- Session as async processor with self-destructing watchers (short-TTL mode)
- Clean separation: app orchestrates, session processes
- Container structure set up at `splectrum/apps/cli-static/modules/work_module/spl/container/`
- Plain req v1.1.0 created (added Version and Models sections)

Design decisions made (2025-12-05/06):
- **Container** = universal structural unit (replacing "folder-node")
- Types are APIs in normal hierarchy (spl/container, spl/api, spl/method)
- Runtime resolution with inheritance (folder → type chain → lib)
- Spider principle: each entrypoint describes its own contents
- Underscore folders have task entrypoints (`<foldername>.json`)
- API groupings are organizational only (in README.json)

### Next Steps

1. Write container reqs (two separate reqs, single concern each):
   - `container_type_v1.0.0.md` - structural contract (what a container IS)
   - `container_api_v1.0.0.md` - API definition (what a container CAN DO)
2. Implement container methods (grouped as CRUD, Types, XPath)
3. Long-lived session mode (app-session pair initialization)

### Key Insight (this session)

**Type duality** - every type has two concerns:
- **Type definition** - constraints on instances/derived types (structural)
- **Type implementation** - API methods the type provides (functional)

This applies to all types (container, api, method, package). Two reqs per type:
- `<type>_type_v1.0.0.md` - the contract
- `<type>_api_v1.0.0.md` - the implementation

Selfevals split accordingly:
- Type selfevals: "Is this a valid container?" (structural)
- API selfevals: "Do the methods work?" (behavioral)

Method reqs live on the method container itself.

### Completed Work Items

| # | Item | Status |
|---|------|--------|
| 1 | Backlog and CIP Consolidation | Done |
| 2 | Splectrum node cleanup | Done |

### In Progress

| # | Item | Status |
|---|------|--------|
| 3 | App-based design and implementation experience | In progress - app-session pipeline done |

### Remaining

| # | Item | Status |
|---|------|--------|
| 4 | Elevator pitch for Pear/Bare | In progress - overview document ready |
| 5 | Splectrum node install | Pending |

---

## Key Implementation Details

### API-as-App Model

- **App = API with state** - methods execute within API's persisted state
- **Method = handler** - the method IS the handler
- **Inheritance** - generic handlers inherited from base app API
- **Override pattern** - like `base.method()` in Java, leaves audit trace

### App-Session Pipeline

```
Root spl.mjs
  → spl/cli-static/execute (app handler)
    → loads app state (consumeLatest from state topic)
    → starts session (spl/cli-static-session/start)
    → starts outbox watcher
    → FAFs request to session inbox
    → waits on outbox
    → returns result

Session (running async):
  → inbox watcher picks up request
  → processing watcher executes method
  → FAFs result to outbox
  → watchers self-destruct (short-TTL)
```

### State Management

- **faf** - writes timestamped record to topic (never overwrites)
- **consumeLatest** - reads latest record from topic
- State files are topics (folders), not single files
- Event-sourcing style: full audit trail

### Record Structure

```js
{
  headers: {
    spl: {
      request: { ... },
      runtime: { nodeRoot, appAPI, sessionAPI },
      'cli-static': { name, root },
      'cli-static-session': { name, root }
    }
  },
  value: {}  // actual state/payload
}
```

Each API has its own header namespace.

---

## Splectrum Node Structure

```
splectrum/
  spl.mjs                     # Node entrypoint
  lib/moduleBootstrap.js      # requireSpl, requireNonSpl
  modules/bm_spl/
    spl/
      _lib/spl.js             # Core lib (faf, consumeLatest, etc.)
      cli-static/execute/     # App handler
      cli-static-session/start/  # Session start
      app/                    # Base app API
    pr09/console/hello/       # Reference method
  apps/cli-static/
    state/                    # App state topic
  runtime/cli-static/
    requests/                 # inbox, processing, outbox
    session/state/            # Session state topic
```

---

## Session Entry Points

**Starting a new session?**

1. Read this file for current context
2. Read `projects/11-app-architecture/notes/type_carries_tooling_2025-12-05.md` for current design direction
3. Read `projects/11-app-architecture/DAILY_LOG.md` for work history

**Key design documents (Dec 2025):**
- `notes/type_carries_tooling_2025-12-05.md` - container API, whoami, select, resolution approach, req decisions
- `notes/design_implementation_app_decisions_2025-12-04.md` - verbs, PAC pattern
- `notes/cli_namespacing_and_context_2025-12-04.md` - scripting layer, context management
- `notes/natural_language_bridge_2025-12-04.md` - DSL glossary as semantic foundation
- `notes/executable_documentation_principle_2025-12-03.md` - scripts as howtos

**Key implementation locations:**
- `splectrum/apps/cli-static/modules/work_module/spl/container/` - container being implemented
- `splectrum/spl.mjs` - node entrypoint, routes to app
- `splectrum/modules/bm_spl/spl/_lib/spl.js` - core lib with faf/consumeLatest

**Req structure:**
- Using plain req v1.1.0 (projects/11-app-architecture/reqs/plain_req_v1.1.0.md)
- Type duality: `<type>_type_v*.md` (contract) + `<type>_api_v*.md` (implementation)
- Next: write container_type_v1.0.0.md and container_api_v1.0.0.md

**Elevator pitch materials:**
- `projects/11-app-architecture/elevator-pitch/` - overview and block files
- Main doc: `CONVERSATION_2025-12-06.md` - ready for use

---

## Notes

This file provides session context. Update when project status changes significantly.
