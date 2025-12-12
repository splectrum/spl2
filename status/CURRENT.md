# Current Status

**Last Updated:** 2025-12-13

---

## Status: Project 12 Active

**Project 12: Wrapper APIs** - Exploration Project

### Objective

Wrap existing tools (git, file, search) within splectrum context. Platform-agnostic (Node/Bare).

### Current Phase

**Execution phase.** Implementing spl/container/_lib/avsc.

### Products

1. **spl/container/_lib/avsc** - schema parsing and validation lib
2. **spl/git** - git wrapper (design → implementation)
3. **spl/container/select** - xpath-style queries (research → vision → syntax → MVP)
4. **Additional Wrapper APIs** - research and potential implementation

### Completed: Bare Test ✓

Dual entry points working:
- `splectrum/spl` - Node runtime entry point
- `splectrum/splb` - Bare runtime entry point

**Platform compatibility via import maps (package.json):**
- `readline` → `bare-node-readline`
- `process` → `bare-node-process`
- `url` → `bare-node-url`
- `util`, `stream`, `zlib`, `crypto`, `events`, `buffer` → bare-node-* equivalents

No custom abstraction code - import maps handle all switching.

### Completed: avsc Integration ✓

**avsc dependencies:** Zero npm packages, all Node builtins have Bare equivalents.

**Solution:** `module.require()` uses import attributes on Bare:
```javascript
import(uri, { with: { imports: 'bare-node-runtime/imports' } })
```

Updated in `apps/cli-static/modules/work_module/_lib/module.js` line 381-384.

**Verified working:**
```bash
module.require('avsc')  # Works on both Node and Bare
```

### Completed: spl/container/_lib/avsc ✓

**Decision:** Start with avsc as a lib in `spl/container/_lib/`, not API methods. Methods can come later.

**Lib functions:**
- `parseSchema(schemaPath)` - load and validate Avro schema file
- `validate(type, value)` - check value against parsed schema

**Enables two selfevals:**
1. Schema files in `_schemas/` are valid Avro
2. Test/selfeval data conforms to declared schemas

**Files:**
- `spl/container/_reqs/avsc_lib_v1.0.0.md` - requirements
- `spl/container/_lib/avsc.js` - implementation

**Verified:** Works on both Node and Bare runtimes.

**Integrated:** selfeval_schemas runner now validates .avsc files as valid Avro schemas.

### Also Completed This Session

- Fixed CRLF line endings in spl/splb shell scripts
- Upgraded legacy scripts (status.js, help.js) to new module interface
- Removed obsolete test scripts
- Installed bare-node-runtime and all required compatibility packages

---

## Session Entry

1. Read this file
2. Test: `spl spl/whoami` and `splb spl/whoami`
3. Test: `spl spl/container/selfeval` (validates .avsc schemas)
4. Test script available: `spl test-avsc`
5. Next: Consider spl/git wrapper or other Project 12 products
