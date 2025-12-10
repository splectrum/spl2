# Current Status

**Last Updated:** 2025-12-10

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - selfeval implemented, runner pattern refactoring**
- Location: `projects/11-app-architecture/`

### Current Focus

**Selfeval method and runners** - validation framework for containers.

This session completed:
- Selfeval method refactored to new flag scheme (`--meta`, `--report`, `--runner`, `--dry-run`, `--fail-fast`, `--levels`)
- 5 selfeval runners: lib, api, schemas, handler, reqs
- Bidirectional checking: manifest→reality AND reality→manifest (catches unregistered files)
- Runner registry in `_selfevals/index.json` with explicit file/name/description
- Selfeval req updated with output structure spec

### In Progress

**Lib pattern standardization** - all libs should use `create()` pattern:
- Runners currently use `export default` - need to revert to `create()` returning `{ run }`
- Lib runner should dynamically inspect exports instead of relying on manifest declarations
- Manifest should just list files, not exports

### Key Design Decisions

**Selfeval structure:**
- `_selfevals/index.json` - registry with runner metadata (name, description, file)
- `_lib/selfeval_*.js` - runner code
- `_tests/` - test data (future)
- Runners receive `containerFsPath` and read what they need

**Runner registry format:**
```json
{
  "runners": {
    "lib": { "name": "lib", "description": "...", "file": "selfeval_lib.js" }
  }
}
```

**Lib pattern (to be enforced):**
- All libs use `export function create(module)` returning object with exports
- No `export default` for libs
- Manifest lists files only, exports discovered at runtime

### Key Files

Work module: `splectrum/apps/cli-static/modules/work_module/`

- `spl/container/selfeval/index.js` - selfeval method
- `spl/container/selfeval/_reqs/selfeval_method_v1.0.0.md` - output spec
- `spl/container/_lib/selfeval.js` - framework (loadRegistry, loadRunner, runAll)
- `spl/container/_lib/selfeval_lib.js` - lib runner
- `spl/container/_lib/selfeval_api.js` - api runner
- `spl/container/_lib/selfeval_schemas.js` - schemas runner
- `spl/container/_lib/selfeval_handler.js` - handler runner
- `spl/container/_lib/selfeval_reqs.js` - reqs runner
- `spl/container/_selfevals/index.json` - runner registry
- `spl/container/_reqs/index.json` - registered req files

### Working Commands

```bash
./spl spl/container/selfeval                    # summary (default)
./spl spl/container/selfeval --meta=topline     # minimal
./spl spl/container/selfeval --meta=detail      # full breakdown
./spl spl/container/selfeval --meta=report      # JSON output
./spl spl/container/selfeval --report           # freetext + JSON
./spl spl/container/selfeval --runner=lib       # specific runner
./spl spl/container/selfeval --dry-run          # list runners
```

### Current selfeval output

```
spl/container | FAIL
4/5 runners passed
  lib | PASS (8/8 files)
  api | FAIL (2/7 methods - 5 not implemented)
  schemas | PASS (2/2 files)
  handler | PASS (1/1 checks)
  reqs | PASS (18/18 files)
```

### Next Steps

1. **Revert runners to create() pattern** - uniform lib pattern
2. **Update lib runner** - dynamically inspect exports instead of manifest
3. **Remove exports from manifest** - just list files

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
2. Test: `./spl spl/container/selfeval --meta=detail`
3. Next: Revert runners to `create()` pattern, update lib runner to inspect exports

**Key patterns:**
- Methods use `module.output(freetext, structured)` not return
- Libs use `create(module)` returning object with exports
- Runners are libs with a `run(containerFsPath)` export
- Freetext renderer: `freetext.render(json, level)`

---

## Notes

This file provides session context. Update when project status changes significantly.
