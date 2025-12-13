# Current Status

**Last Updated:** 2025-12-13

---

## Status: Project 12 Active

**Project 12: Wrapper APIs** - Exploration Project

### Objective

Wrap existing tools (git, file, search) within splectrum context. Platform-agnostic (Node/Bare).

### Current Phase

**Execution phase.** Designing spl/http API - reqs complete, ready to create container.

### Products

1. **spl/container/_lib/avsc** - schema parsing and validation lib ✓
2. **spl/http** - HTTP client API (in progress)
3. **spl/tools/git** - git wrapper (planned)
4. **spl/tools/7zip** - archive wrapper (planned)

### Completed: Entry Point Reorganization ✓

**New structure:**
```
splectrum/
  bin/                    # Shell entry points
    spl                   # Node runtime
    splb                  # Bare runtime
    _reqs/                # Setup documentation
  entrypoints/            # JS bootstrap code
    spl.mjs               # Main entrypoint
    _reqs/                # Entrypoint documentation
```

**PATH setup:** Add to `/etc/environment`:
```
PATH="/home/herma/splectrum/spl2/splectrum/bin:..."
```

See `bin/_reqs/bin_setup_v1.0.0.md` for full setup instructions.

### Completed: avsc Integration ✓

- `spl/container/_lib/avsc.js` - parseSchema, validate functions
- selfeval_schemas runner validates .avsc files as valid Avro
- Works on both Node and Bare runtimes

### In Progress: --help / --usage Feature

**Completed:**
- Global `--help` / `-h` flag on spl/container (rewrites to whoami --usage)
- Entry point handles --help rewrite in cli.js (`rewriteHelp()` in cli.js)
- `--usage` flag on whoami (filters to schemas/input facet)
- Hierarchical facet filter (e.g., `schemas/input`) in parseFacets
- Schema field rendering at detail level (shows flags, types, defaults, docs)
- Input schema added to whoami method (`_schemas/input.avsc`)
- Api facet hidden when container has no API methods
- `compareSchemas()` added to avsc.js lib (field-by-field comparison)
- selfeval_schemas_inheritance runner created (checks parent fields in derived schemas)

**Pending:**
- Fix: selfeval runner needs to run on derived container (whoami), not just base (spl/container)
  - selfeval --levels flag determines which levels run their runners
  - Runner currently passes on base, need to test on derived
- Add `update` handler for schema merge/drift fix (idempotent)
- Update all containers with inherited fields (run update to fix)
- Update CLAUDE.md with --help guidance

**Design decisions:**
- Explicit schemas (copy parent fields) + automation to prevent drift
- Merge direction: base → derived (parent fields propagate down)
- spl/container hierarchy refactor planned: spl/introspection ← spl/crud ← spl/container
- One API per type (remove apiFacets complexity)
- whoami level 0 wrapper needed for summary across all levels

**Key files modified:**
- `splectrum/entrypoints/spl.mjs` - added `cli.rewriteHelp()` call
- `splectrum/modules/bm_spl/spl/cli/_lib/cli.js` - added `rewriteHelp()` method
- `spl/container/_schemas/input.avsc` - added `help` field
- `spl/container/_reqs/spl_container_type_v1.0.0.md` - added Global flags section
- `spl/container/whoami/_schemas/input.avsc` - created with meta, report, facet, levels, usage
- `spl/container/whoami/_lib/whoami.js` - hierarchical facet filter, schema content reading
- `spl/container/_lib/report.js` - buildSchemas now renders fields at detail level, formatAvroType helper
- `spl/container/_lib/avsc.js` - added compareSchemas()
- `spl/container/_lib/selfeval_schemas_inheritance.js` - new runner
- `spl/container/_selfevals/index.json` - registered schemas_inheritance runner

**New reqs:**
- `spl/container/_reqs/avsc_lib_v1.1.0.md` - adds compareSchemas
- `spl/container/_reqs/selfeval_schemas_inheritance_runner_v1.0.0.md` - new runner

### Parked: spl/http API

**Reqs written:**
- `spl/http/_reqs/spl_http_v1.0.0.md` - API specification
- `spl/http/get/_reqs/` - GET method req + schemas
- `spl/http/post/_reqs/` - POST method req + schemas

**Registered in spl:**
- `spl/index.json` updated with `api.instance: ["http"]`
- `spl/_reqs/spl_instance_v1.0.0.md` updated

**Next:** Resume after --help feature complete.

---

## Session Entry

1. Read this file
2. Test: `spl spl/whoami --help` (should show input schema fields)
3. Test: `spl spl/container/selfeval` (schemas_inheritance runner should run)
4. Continue: Fix selfeval runner to properly detect drift on derived containers
5. Then: Implement `update` handler for schema merge
6. Then: Update all containers with inherited fields
7. Then: Update CLAUDE.md with --help guidance

**Todo list:**
- [x] Global --help flag and rewrite
- [x] --usage flag on whoami
- [x] Api facet hidden for methods
- [x] compareSchemas in avsc.js
- [x] selfeval_schemas_inheritance runner
- [ ] Fix runner to detect drift on derived containers
- [ ] Add update handler for schema merge
- [ ] Update all containers with inherited fields
- [ ] Update CLAUDE.md
- [ ] Refactor spl/container hierarchy
- [ ] whoami level 0 wrapper
