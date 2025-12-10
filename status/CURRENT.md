# Current Status

**Last Updated:** 2025-12-10

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **In Progress - whoami refactored, selfeval next**
- Location: `projects/11-app-architecture/`

### Current Focus

**Output flag refactoring** - unified `--meta` and `--report` flag scheme across methods.

This session completed:
- Refactored whoami method with new flag scheme
- New flags: `--meta`, `--report`, `--facet`, `--levels`
- Generic freetext renderer in `spl/container/_lib/freetext.js`
- Incremental report structure (topline/summary/detail/enriched per level)
- Updated module.js with `getMetaLevel()`, `getReportLevel()`, `getDetailLevel()`
- Removed `gradedOutput()` - superseded by `module.output(freetext, structured)`

### Key Design Decisions

**Flag scheme (applies to all methods):**
- `--meta=topline|summary|detail|enriched|report` - freetext level (default: summary)
- `--report=topline|summary|detail|enriched` - structured output level (default: none)
- `--meta=report` echoes structured as JSON to freetext

**Report structure:**
- Each level contains only INCREMENTAL information
- topline: identity/existence
- summary: purpose/description
- detail: full breakdown
- enriched: source code

**Generic freetext renderer:**
- Walks any JSON with topline/summary/detail/enriched keys
- No domain knowledge - fully generic
- Lives in `spl/container/_lib/freetext.js`
- Usage: `freetext.render(json, level)`

**Facet filtering:**
- `--facet=api,lib` - comma-delimited
- Container always present as envelope
- If container not in facet list, shows topline only

### Key Files

Work module: `splectrum/apps/cli-static/modules/work_module/`

- `_lib/module.js` - getMetaLevel(), getReportLevel(), getDetailLevel(), output()
- `_reqs/module_instance_v1.0.0.md` - updated with new flag scheme
- `spl/container/_lib/freetext.js` - generic freetext renderer
- `spl/container/_lib/report.js` - incremental report builder
- `spl/container/whoami/index.js` - refactored method
- `spl/container/whoami/_reqs/spl_container_whoami_v2.0.0.md` - updated req
- `spl/container/selfeval/_reqs/selfeval_method_v1.0.0.md` - updated req

### Working Commands

```bash
./spl spl/container/whoami                    # summary freetext (default)
./spl spl/container/whoami --meta=topline     # minimal
./spl spl/container/whoami --meta=detail      # full breakdown
./spl spl/container/whoami --meta=report      # JSON output
./spl spl/container/whoami --report           # freetext + JSON
./spl spl/container/whoami --facet=lib        # lib facet only
./spl spl/container/whoami --facet=api,lib    # multiple facets
```

### Next Steps

1. **Implement selfeval method** - same pattern as whoami
   - Update index.js with new flow
   - Use module.output(), getMetaLevel(), etc.
   - Reuse whoami lib for container report building

2. **Update lib_runner.js** - return hierarchical structure with levels

3. **More selfeval runners** - schemas, api, handler

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
2. Test: `./spl spl/container/whoami --meta=detail`
3. Next: Implement selfeval method (see `spl/container/selfeval/index.js`)

**Key patterns:**
- Methods use `module.output(freetext, structured)` not return
- `module.getMetaLevel()`, `module.getReportLevel()`, `module.getDetailLevel()`
- Report structure: incremental data per level (topline/summary/detail/enriched)
- Generic freetext renderer: `freetext.render(json, level)`

---

## Notes

This file provides session context. Update when project status changes significantly.
