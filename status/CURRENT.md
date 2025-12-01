# Current Status

**Last Updated:** 2025-12-01

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - Item 3 (App-based experience)**
- Location: `projects/11-app-architecture/`

### Current Focus

**requireSpl Pattern Implementation** - unified module/lib/script loading with consistent `create()` pattern.

Key deliverables completed:
- `modules/hierarchy.json` - overlay layer configuration
- Unified `requireSpl` handling lib, method, script file, inline script
- Consistent interface: libs return utility objects, executables return `{ invoke() }`
- Reference implementation: `pr09/console/hello`
- Pattern documentation: `projects/11-app-architecture/reqs/requireSpl_pattern_v1.0.0.md`

### Next Steps

1. App overlay implementation - app modules layering over node modules
2. App lifecycle patterns - how apps declare their modules/hierarchy

### Completed Work Items

| # | Item | Status |
|---|------|--------|
| 1 | Backlog and CIP Consolidation | Done |
| 2 | Splectrum node cleanup | Done |

### In Progress

| # | Item | Status |
|---|------|--------|
| 3 | App-based design and implementation experience | In progress - requireSpl pattern done |

### Remaining

| # | Item | Status |
|---|------|--------|
| 4 | Elevator pitch for Pear/Bare | Pending |
| 5 | Splectrum node install | Pending |

---

## Key Implementation Details

### requireSpl Pattern

Two `create()` signatures:

**Libs** - `create(record, { requireNonSpl })`:
- Platform module access only
- Returns utility object with methods

**Methods** - `create(record, { requireSpl })`:
- Lib access only (no direct platform)
- Returns `{ invoke() }`
- Uses meaningful lib calls, not raw fs/path

See `reqs/requireSpl_pattern_v1.0.0.md` for full documentation.

### Archived

- `spl/dev` API moved to `archive/spl-dev-api/` - superseded by app-based approach

---

## Splectrum Node Structure

```
splectrum/
  lib/moduleBootstrap.js    # requireSpl, requireNonSpl, overlay resolution
  modules/
    hierarchy.json          # Layer configuration
    bm_spl/                  # Bundle module
      pr09/console/hello/   # Reference method implementation
      spl/_lib/             # Core libs (spl, cli)
  apps/cli-static/          # Current CLI app
  scripts/                  # Freestyle scripts
  runtime/                  # Session/request processing
```

---

## Session Entry Points

**Starting a new session?**

1. Read this file for current context
2. Read `projects/11-app-architecture/DAILY_LOG.md` for detailed work history
3. Read `projects/11-app-architecture/reqs/requireSpl_pattern_v1.0.0.md` for the implementation pattern

**Key files to understand current state:**
- `splectrum/lib/moduleBootstrap.js` - the unified requireSpl implementation
- `splectrum/modules/bm_spl/pr09/console/hello/index.js` - reference method implementation
- `splectrum/apps/cli-static/app.mjs` - simplified app handler using requireSpl

---

## Notes

This file provides session context. Update when project status changes significantly.
