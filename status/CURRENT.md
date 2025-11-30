# Current Status

**Last Updated:** 2025-11-30

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Session 7 continued.** Consumer design and request record structure.

**Completed this session (continued):**

- Consumer design documented:
  - `CONSUMER_DESIGN.md` - folder watcher pattern, state file control
  - Persistent consumers: watch folder, bidirectional state file
  - Transient consumers: double-barrel TTL (maxTime + maxTriggers)
  - Basic watcher: `apps/cli-static/scripts/watcher.js`

- Overlay logic moved to moduleBootstrap:
  - `createOverlay(hierarchy)`, `loadOverlay(hierarchyPath)` in `lib/moduleBootstrap.js`
  - Removed from `modules/versions/*/\_lib/overlay.js`

- spl/request record structure:
  - Input/output are metadata in headers: `headers.spl.request.input`, `headers.spl.request.output`
  - Value is API state (internal, method-managed)
  - Fixed properties: timeReceived, type, runtime.*
  - Updated properties: method, input, output, value
  - parseArgs() now writes directly to `headers.spl.request.input`

- Record transformation pattern:
  - Same record evolves through pipeline (not new records)
  - `set*` functions: setCommandRequest, setLibraryRequest, setScriptRequest
  - FAF captures evolution snapshots (event sourcing)
  - Terminology: "transform" conceptually, "set" in function names

- App flow working:
  - spl.mjs → cli-static → setCommandRequest → FAF to outbox → watcher outputs
  - Modes: command (implemented), library/script (NOT_IMPLEMENTED errors)

**Next:**
- Session setup (inbox → processing → outbox pipeline)
- Double-barrel TTL for transient watcher
- Move watcher to spl/consumer API

**Key docs:** (in `projects/10-dev-env-v0-bundle-continued/`)
- `CONSUMER_DESIGN.md` - consumer pattern, transient/persistent, spl/request structure
- `DAILY_LOG.md` - Session 7 notes

**Key files:**
- `splectrum/spl.mjs` - CLI entry point, record creation
- `splectrum/lib/moduleBootstrap.js` - requireSpl, requireNonSpl, overlay
- `splectrum/modules/bm_spl/spl/cli/_lib/cli.js` - parseArgs writes to headers
- `splectrum/apps/cli-static/app.mjs` - set* functions, record transformation
- `splectrum/apps/cli-static/scripts/watcher.js` - basic folder watcher

---

## Model Dev Environment

**Location:** `projects/10-dev-env-v0-bundle-continued/dev/v0/`

The current development bundle. Contains working spl/dev and spl/ops implementations.

---

## Recent Completions

| Project | Completed | Key Outcomes |
|---------|-----------|--------------|
| 09 - Console v5 Stream Native | 2025-11-26 | v0 dev env template, type hierarchy, lib resolution, selfeval inheritance, overlay patterns. Pivoted from Console migration to dev env foundation. |
| 08 - Dev Environment API | 2025-11-20 | 4-level module structure, executable selfeval pattern, test runner, delegation stepping stone |
| 07 - Console API Exploration | 2025-11-19 | v7 wrapper API, 3 design docs, status/ spot, CIP-015 |
| 06 - Glossary Term Requirements | 2025-11-18 | 67+ term reqs, unified glossary structure |

---

## Session Entry Points

**Starting a new session?**

1. Read this file for current context
2. Check `projects/INDEX.md` for full project status
3. Check `projects/BACKLOG.md` for work queue (top item = next project)

**Starting a new project?**

Follow `create project` howto in HOWTO_GLOSSARY.md

**Looking up SPL2 concepts?**

MANDATORY: Use glossaries as index - see CLAUDE.md "Glossary-First Lookup" section.
- Understanding → STEPPING_STONES_GLOSSARY.md
- Action → HOWTO_GLOSSARY.md

---

## Notes

This file provides session context without requiring CLAUDE.md updates. Update when project status changes significantly.
