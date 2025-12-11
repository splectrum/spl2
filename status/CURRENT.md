# Current Status

**Last Updated:** 2025-12-12

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - Ready for container creation**
- Location: `projects/11-app-architecture/`

### Current Focus

**Type system complete.** All 7 types and method instances pass selfeval. Ready for:
1. module.js `this` refactor (cleanup)
2. `spl/container/create` method (the biggy)

### Completed This Session (2025-12-12)

**Type stack architecture:**
1. Algorithm fixed - extends chain first (type layer), then instantiates chain (instance layer)
2. Dynamic `instanceLevel` - not hardcoded, handles bootstrap case
3. Instance vs Type distinction - instantiates=structural, type field=content

**Runner infrastructure:**
4. Type runners on `spl/container`: lib, schemas, handler, reqs, final
5. Instance runners: `api` on spl/api, `children` on spl/api and spl/package
6. `selfeval_children.js` checks `instantiates` (structural type)
7. `selfeval_handler.js` uses overlay for inheritance

**Type fixes:**
8. `spl/api` and `spl/method` now extend `spl/container`
9. `spl/api` bootstrap - instantiates itself, instanceLevel=1
10. Empty manifests for `spl/_lib`, `spl/_reqs`, `spl/_schemas`, `spl/api/*`, `spl/method/*`
11. Added `index.json` to `spl/container/create` and `spl/container/delete` methods

### All Selfevals Passing

```bash
./spl spl/selfeval --levels=all             # PASS 3/3 levels
./spl spl/container/selfeval --levels=all   # PASS 2/2 levels
./spl spl/api/selfeval --levels=all         # PASS 2/2 levels
./spl spl/method/selfeval --levels=all      # PASS 3/3 levels
./spl spl/package/selfeval --levels=all     # PASS 3/3 levels
./spl spl/module/selfeval --levels=all      # PASS 3/3 levels
./spl spl/modules/selfeval --levels=all     # PASS 3/3 levels
./spl spl/container/whoami/selfeval --levels=all  # PASS 3/3 levels
```

### Next Steps

1. **module.js `this` refactor** - cleanup forward reference pattern (see `notes/module_js_this_refactor.md`)
2. **`spl/container/create` method** - scaffold new containers from type

**For project closure:**
- Update _reqs with design decisions from `notes/type_stack_and_selfeval_architecture.md`

### Key Design Decisions

**Type stack structure:**
- Type layer first: container → extends chain
- Instance layer second: instantiates → extends chain (deduped)
- `instanceLevel` marks where instance layer begins

**Stack examples:**
- `spl`: `[spl, spl/package, spl/container]`, instanceLevel: 2
- `spl/package`: `[spl/package, spl/container, spl/api]`, instanceLevel: 3
- `spl/api`: `[spl/api, spl/container]`, instanceLevel: 1 (bootstrap)

**Runner categories:**
- `runners` - run at every level (type validation)
- `instanceRunners` - run only at instanceLevel (instance validation)

**Final resources (no overlap):** `_reqs/*.md`, `_lib/*.js`, `_tests/*.js`
**Non-final (inherit via overlay):** `index.js`, `_schemas/*.avsc`

### Key Files

Work module: `splectrum/apps/cli-static/modules/work_module/`

- `_lib/module.js` - buildTypeStack, resolveOverlay
- `spl/container/_lib/selfeval.js` - selfeval framework
- `spl/container/_selfevals/index.json` - type runners
- `spl/api/_selfevals/index.json` - api instanceRunner
- `spl/package/_selfevals/index.json` - children instanceRunner
- `notes/type_stack_and_selfeval_architecture.md` - design document

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
2. Test: `./spl spl/selfeval --levels=all`
3. Read: `projects/11-app-architecture/notes/type_stack_and_selfeval_architecture.md`

**Key patterns:**
- Methods use `module.output(freetext, structured)` not return
- Libs use `create(module)` returning object with exports
- Runners are libs with a `run(containerFsPath)` export
- Type stack: extends chain first, then instantiates chain, deduped
- instanceLevel: dynamic, where instanceRunners execute

---

## Notes

This file provides session context. Update when project status changes significantly.
