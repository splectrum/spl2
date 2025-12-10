# Current Status

**Last Updated:** 2025-12-10

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - levels support for whoami/selfeval**
- Location: `projects/11-app-architecture/`

### Current Focus

**Type inheritance levels** - whoami and selfeval support for type stack traversal.

This session completed:
- All 5 selfeval runners converted to `create()` pattern
- Lib manifest updated with name, description, exports per file
- Reqs manifest restructured to `requirements` array with name/description/file
- Created req files for all 8 lib files
- Renamed identity_type/instance to container_type/instance
- Simplified API to 4 methods: whoami, selfeval, create, delete
- Created create/delete method stubs
- spl/container selfeval now passes 5/5 runners
- **whoami --levels** implemented with type stack

### In Progress

**Selfeval levels support** - same pattern as whoami:
- Build type stack (instance chain first, then type chain, deduped)
- Each level runs runners from that type's _selfevals/
- Runners test against current container's structure

### Key Design Decisions

**Type stack (levels):**
- Instance chain first (instantiates), then type chain (extends), deduped
- spl/modules: 1 spl/container, 2 spl/modules
- `--levels` alone shows available levels
- `--levels=all` runs all levels
- `--levels=spl/container` runs specific level

**Final resources (cannot overlap across type chain):**
- _reqs/*.md
- _lib/*.js
- _tests/*.js

**Non-final (each level has its own):**
- index.json
- _schemas/*.avsc
- _selfevals/

**Selfeval inheritance:**
- Each level has own _selfevals/index.json
- Runner code in that level's _lib/ (final, so available via overlay)
- Runners validate current container's structure against that level's rules

### Key Files

Work module: `splectrum/apps/cli-static/modules/work_module/`

- `spl/container/whoami/index.js` - whoami with --levels support
- `spl/container/whoami/_lib/whoami.js` - buildTypeStack, buildContainerAtLevel
- `spl/container/_lib/selfeval.js` - framework with buildTypeStack, loadRegistryFromType
- `spl/container/index.json` - extends: null, instantiates: spl/api
- `spl/modules/index.json` - extends: spl/container, instantiates: spl/api
- `spl/modules/_reqs/spl_modules_type_v1.0.0.md` - hierarchy.json spec

### Working Commands

```bash
./spl spl/modules/whoami                      # current level only
./spl spl/modules/whoami --levels             # show available levels
./spl spl/modules/whoami --levels=all         # all levels
./spl spl/modules/whoami --levels=spl/container  # specific level

./spl spl/container/selfeval                  # all runners pass
./spl spl/container/selfeval --meta=detail    # full breakdown
```

### Current whoami output

```
spl/modules [levels: 1 spl/container, 2 spl/modules]
  spl/modules | Type [2/2]
  Modules spot type - collection of module instances
    api | 0 facets, 0 methods
    handler | Modules spot type container
    reqs | empty
    Requirements for spl/modules container
```

### Next Steps

1. **Add levels support to selfeval** - same pattern as whoami
2. **Create generic schema runner** - validates JSON against expected structure
3. **Create generic children runner** - validates child types
4. **Create generic final-files runner** - validates no overlap in final resources
5. **Add _selfevals and _lib to spl/modules** - hierarchy runner
6. **Upgrade spl/module, spl/package, spl/method** - new structure

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
2. Test: `./spl spl/modules/whoami --levels=all`
3. Next: Add levels to selfeval method

**Key patterns:**
- Methods use `module.output(freetext, structured)` not return
- Libs use `create(module)` returning object with exports
- Runners are libs with a `run(containerFsPath)` export
- Type stack: instance chain first, then type chain, deduped
- Final resources: _reqs, _lib, _tests (no overlap)

---

## Notes

This file provides session context. Update when project status changes significantly.
