# Current Status

**Last Updated:** 2025-12-10

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - selfeval framework complete**
- Location: `projects/11-app-architecture/`

### Current Focus

**Selfeval framework** - validation system comparing manifest (index.json) vs implementation (lib files).

This session completed:
- Split identity facet → identity moved into container, api is now a facet
- Hierarchical report structure: container wraps facets as children
- Lib facet now reports: summary (from index.json), detail (extracted from source)
- Created selfeval framework with runner pattern
- Created lib_runner.js - compares expected exports vs actual
- Consistent flag system: --silent/default/--verbose for freetext levels

### Key Design Decisions

**Report hierarchy:**
```
container (name, type, extends, instantiates, purpose)
  └── facets[]
        ├── api (apiFacets, methodCount)
        ├── handler (exists, title)
        ├── schemas (files, purpose)
        ├── lib (files, expected exports, actual exports)
        └── reqs (files, purpose)
```

**Four-level mapping for lib facet:**
- topline: file list
- summary: from index.json (manifest declares)
- detail: from source (extracted functions)
- enriched: (future - function code)

**Selfeval flow:**
- req (requirements) → index.json (manifest) → lib.js (implementation)
- selfeval compares summary vs detail to validate implementation matches manifest

**Output pattern (same for whoami and selfeval):**
- --silent → topline
- (default) → summary
- --verbose → detail
- --report → adds JSON output

### Key Files

Work module: `splectrum/apps/cli-static/modules/work_module/`

- `spl/container/_lib/report.js` - builds hierarchical four-level structure
- `spl/container/_lib/freetext.js` - renders to natural language
- `spl/container/_lib/selfeval.js` - selfeval framework (load runners, execute)
- `spl/container/_selfevals/index.json` - runner registry
- `spl/container/_selfevals/lib_runner.js` - lib facet validation
- `spl/container/whoami/_lib/whoami.js` - whoami orchestration
- `spl/container/selfeval/index.js` - selfeval method

### Working Output

```
./spl spl/container/whoami --silent
spl/container - API
  api - 3 facets, 7 methods
  handler - base container type
  schemas - input.avsc, metaoutput.avsc
  lib - report.js, freetext.js, selfeval.js
  reqs - empty

./spl spl/container/selfeval
Selfeval: spl/container

[lib] PASS
  + report.js: 6/6 exports
  + freetext.js: 18/18 exports
  + selfeval.js: 4/4 exports

Summary: PASS

./spl spl/container/selfeval --silent
PASS
```

### Pending

- More selfeval runners (schemas, api, handler)
- req → index.json validation (does manifest match req?)
- Enriched level (function code extraction)
- Update design doc with final implementation

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
2. Test: `./spl spl/container/whoami --verbose`
3. Test: `./spl spl/container/selfeval`

**Key concepts:**
- Hierarchical report: container wraps facets
- Four levels: topline/summary/detail/enriched
- req → index.json → implementation (selfeval validates the chain)
- Runners in _selfevals/ validate specific facets

---

## Notes

This file provides session context. Update when project status changes significantly.
