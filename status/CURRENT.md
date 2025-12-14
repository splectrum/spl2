# Current Status

**Last Updated:** 2025-12-14

---

## Status: Project 12 Active

**Project 12: Wrapper APIs** - Exploration Project

### Objective

Wrap existing tools (git, file, search) within splectrum context. Platform-agnostic (Node/Bare).

### Current Phase

**Type hierarchy refactor in progress.** Created spl/introspection. Next: spl/crud.

### Completed This Session

**spl/introspection type created:**
- New base API type for introspection methods
- spl/container now extends spl/introspection
- Moved whoami, selfeval methods to spl/introspection
- Moved framework libs (report, freetext, selfeval, avsc) to spl/introspection
- Moved lib reqs (report_lib, freetext_lib, selfeval_framework_lib, avsc_lib)
- Moved base schemas (input.avsc, metaoutput.avsc)
- Created spl_introspection_type and spl_introspection_instance reqs
- Added select method to roadmap (xpath-style queries)

**stackType parameter for buildTypeStack:**
- Added 'full' (default), 'extends', 'instantiates' options
- Schema inheritance now correctly uses 'instantiates' chain
- Updated module.js req with documentation

**API format support:**
- Support flat api array `["method1", "method2"]` in addition to nested facets
- Updated report.js and selfeval_api.js

### Type Hierarchy (Current)

```
spl/introspection (base)
  - api: whoami, selfeval
  - _lib: report, freetext, selfeval, avsc
  - _schemas: input.avsc, metaoutput.avsc

spl/container (extends spl/introspection)
  - api: create, lift, update, delete
  - _lib: structural selfeval runners
  - _schemas: container, lib, reqs, schemas, selfevals
```

### Type Hierarchy (Target)

```
spl/introspection (base)
  - api: whoami, selfeval, [select - roadmap]

spl/crud (extends spl/introspection)
  - api: create, lift, update, delete

spl/container (extends spl/crud)
  - structural constraints only, no api methods
```

### Key Commands

```bash
spl spl/container/selfeval         # Validate (3 levels: container, introspection, api)
spl spl/introspection/selfeval     # Validate introspection
spl spl/introspection/whoami       # Check introspection structure
spl spl/container/whoami           # Check container structure
```

### Next Steps

1. Create spl/crud type (extends spl/introspection)
2. Move lifecycle methods (create, lift, update, delete) to spl/crud
3. spl/container becomes structural constraints only

### Parked: spl/http API

Reqs written, resume after type hierarchy complete.

---

## Session Entry

1. Read this file
2. Run: `spl spl/container/selfeval` (should pass, 3 levels)
3. Continue with spl/crud creation
