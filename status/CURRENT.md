# Current Status

**Last Updated:** 2025-12-10

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - container libs refactor complete**
- Location: `projects/11-app-architecture/`

### Current Focus

**Container libs architecture** - report.js and freetext.js in spl/container/_lib.

This session completed:
- Renamed README.json → index.json (flat facts pattern)
- Renamed reqs: readme_type → identity_type, index_type → handler_type
- Created spl/container/_lib/report.js (builds four-level structure from flat facts)
- Created spl/container/_lib/freetext.js (renders structure to natural language)
- Refactored whoami to use container libs via orchestrator pattern
- Updated lib overlay: `.js` suffix for direct lib files (`lib/spl/container/report.js`)

### Key Design Decisions

**Container libs architecture:**
- `report.js` - flat facts → four-level structure (per facet, no composition)
- `freetext.js` - four-level structure → natural language (per facet per level, no composition)
- `whoami.js` (method lib) - orchestration: component selection, accumulation, level combination

**Lib require pattern:**
- `lib/spl/container/selfeval` → `spl/container/selfeval/_lib/selfeval.js` (container's main lib)
- `lib/spl/container/report.js` → `spl/container/_lib/report.js` (direct lib file with .js suffix)

**Flat facts pattern:**
- index.json holds raw facts, easy to edit
- report.js builds four-level structure (topline/summary/detail/enriched)
- freetext.js renders to natural language
- No README.md - whoami generates freetext

**Design principles:**
- No defensive coding - trust selfeval to catch problems
- Single concern per lib - report builds, freetext renders, whoami orchestrates
- Structure is fixed - four levels, same everywhere, no overrides

### Key Files

- `projects/11-app-architecture/working/container_libs_design.md` - design doc
- `spl/container/_lib/report.js` - builds four-level structure
- `spl/container/_lib/freetext.js` - renders to natural language
- `spl/container/whoami/_lib/whoami.js` - orchestration
- `_lib/module.js` - updated lib overlay (lines 242-267)

### Working Output

```
./spl spl/container/whoami --silent
spl/container - API (7 methods)
  identity - 3 apiFacets
  handler - base container type
  schemas - input.avsc, metaoutput.avsc
  lib - report.js, freetext.js
  reqs - empty

./spl spl/container/whoami --verbose
spl/container - API (7 methods)
  identity - 3 apiFacets
    Base container type - structural unit for all containers
    introspection: whoami, typeof, selfeval
    crud: create, read, delete
    xpath: select
  handler - base container type
  schemas - input.avsc, metaoutput.avsc
    Universal handler flags and output structure
  lib - report.js, freetext.js
    Container core libs - report building and freetext rendering
  reqs - empty
    Container requirements and contracts
```

### Pending

- **Split identity facet** - identity (name, type, extends, instantiates, purpose) + api (apiFacets, methodCount). Removes special case in freetext renderer.
- Create spl/container/_lib/selfeval.js (validates four-level structure against reqs)
- Refactor selfeval method to use container lib
- Update design doc with final implementation
- Enriched level (deferred - DSL lookups)

### Work Items

| # | Item | Status |
|---|------|--------|
| 1 | Backlog and CIP Consolidation | Done |
| 2 | Splectrum node cleanup | Done |
| 3 | App-based design and implementation experience | In progress |
| 4 | Elevator pitch for Pear/Bare | Ready (`elevator-pitch/`) |
| 5 | Splectrum node install | Pending |

---

## Session Entry Points

**Starting a new session?**

1. Read this file for current context
2. Read `projects/11-app-architecture/working/container_libs_design.md` - the design doc
3. Test: `./spl spl/container/whoami --verbose`

**Key concepts:**
- Flat facts (index.json) → report.js → four-level structure → freetext.js → natural language
- whoami orchestrates, container libs do per-facet work
- .js suffix in lib require path = direct lib file

---

## Notes

This file provides session context. Update when project status changes significantly.
