# Current Status

**Last Updated:** 2025-12-02

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - Item 3 (App-based experience)**
- Location: `projects/11-app-architecture/`

### Current Focus

**API-as-App Model** - apps are APIs with persisted state, methods execute within that state.

Key deliverables completed:
- App-session pipeline with proper inbox/outbox pattern
- State management via `faf`/`consumeLatest` pair
- Session as async processor with self-destructing watchers (short-TTL mode)
- Clean separation: app orchestrates, session processes

### Next Steps

1. Development experience - streamlined design and implementation workflow
2. Long-lived session mode (app-session pair initialization)

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
| 4 | Elevator pitch for Pear/Bare | Pending |
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
2. Read `projects/11-app-architecture/notes/entrypoint_pipeline_discussion_2025-12-02.md` for design details
3. Read `projects/11-app-architecture/DAILY_LOG.md` for work history

**Key files to understand current state:**
- `splectrum/spl.mjs` - node entrypoint, routes to app
- `splectrum/modules/bm_spl/spl/cli-static/execute/index.js` - app handler
- `splectrum/modules/bm_spl/spl/cli-static-session/start/index.js` - session start
- `splectrum/modules/bm_spl/spl/_lib/spl.js` - core lib with faf/consumeLatest

---

## Notes

This file provides session context. Update when project status changes significantly.
