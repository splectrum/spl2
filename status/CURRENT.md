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

### In Progress: spl/http API

**Reqs written:**
- `spl/http/_reqs/spl_http_v1.0.0.md` - API specification
- `spl/http/get/_reqs/` - GET method req + schemas
- `spl/http/post/_reqs/` - POST method req + schemas

**Registered in spl:**
- `spl/index.json` updated with `api.instance: ["http"]`
- `spl/_reqs/spl_instance_v1.0.0.md` updated

**Next:** Create spl/http container and implement methods.

---

## Session Entry

1. Read this file
2. Test: `spl spl/whoami` (should show `instance: http`)
3. Test: `spl spl/container/selfeval` (should pass)
4. Continue: Create spl/http container using `spl spl/container/create`
5. Then: Implement spl/http/get and spl/http/post methods
