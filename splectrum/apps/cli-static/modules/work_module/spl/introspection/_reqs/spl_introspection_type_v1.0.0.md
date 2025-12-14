**Type:** plain req
**Version:** 1.0.0

# spl_introspection_type

## Spec

Introspection is the base API type for containers. It provides methods to examine container identity and validate against requirements.

**Purpose:**

- Enables containers to report their own identity, structure, and capabilities
- Provides validation framework for containers to check themselves against requirements
- Can operate on virtual containers (non-existent paths) by examining type stack

**Architecture:**

The introspection API follows a shared-lib pattern where methods use common libs for building and rendering output:

```
Methods              Libs
-------              ----
whoami  ─────────┬── report.js ──── Build four-level structures
                 ├── freetext.js ── Render structured JSON as text
                 └── avsc.js ────── Schema parsing utilities

selfeval ────────┬── selfeval.js ── Framework: registry, runners, execution
                 ├── freetext.js ── Render results as text
                 └── avsc.js ────── Schema validation
```

**Output pipeline:**

1. Methods gather facts from container (index.json, files, etc.)
2. report.js builds four-level structure: topline → summary → detail → enriched
3. freetext.js renders structure as human-readable text
4. Methods output both freetext and structured JSON

**Methods:**

- `whoami` - Container introspection (see whoami/_reqs/spl_container_whoami)
- `selfeval` - Validate against requirements (see selfeval/_reqs/selfeval_method)

**Libs:**

- `report.js` - Build four-level structures (see report_lib)
- `freetext.js` - Render structured JSON (see freetext_lib)
- `selfeval.js` - Selfeval framework (see selfeval_framework_lib)
- `selfeval_final.js` - Overlap detection runner
- `avsc.js` - Avro schema utilities (see avsc_lib)

**Lib pattern:**

Libs use `create(module)` factory returning object with exports:
```javascript
export function create(module) {
  return {
    methodName() { ... },
    async asyncMethod() { ... }
  }
}
```

## Self-eval

- [ ] Methods whoami, selfeval present with index.js
- [ ] Framework libs present in _lib/
- [ ] Libs follow create(module) pattern

## Roadmap

**select** - XPath-style query method for finding containers matching criteria.

- Single method with rich query syntax (like SQL, jq, CSS selectors)
- Query language encapsulates all xpath-type handling
- Libs shared into base API, available internally to extending types
- Examples: `/spl/dev/*`, `//*[@index.json/identity/extends = 'spl/api']`

## Comments

spl/introspection is the base of the type hierarchy. spl/container extends spl/introspection to add structural constraints and lifecycle methods.

**Referenced reqs:**
- report_lib_v1.0.0.md
- freetext_lib_v1.0.0.md
- selfeval_framework_lib_v1.0.0.md
- avsc_lib_v1.1.0.md
- whoami/_reqs/spl_container_whoami_v2.0.0.md
- selfeval/_reqs/selfeval_method_v1.0.0.md
