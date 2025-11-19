# AVRO Wrapper API

**Priority:** High
**Type:** Explorative Project
**Dependencies:** Console API Exploration (patterns)
**Source:** Project 07 - using avsc directly, identified need for wrapper

---

## Overview

Create SPL2 wrapper API for AVRO schema operations. Currently using avsc library directly; wrapper provides consistent SPL2 patterns, caching, and Bare runtime compatibility.

---

## Scope

### Core Components

| Component | Description |
|-----------|-------------|
| **Schema loading** | Load and cache AVRO schemas from files |
| **Validation** | Validate data against schemas (boundary in/out) |
| **Type generation** | Generate TypeScript types from schemas |
| **Schema registry** | Discover and list available schemas |

### API Methods

```
spl/avro/
  load/       # Load schema from file, return cached type
  validate/   # Validate data against schema
  clone/      # Clone/coerce data with schema
  registry/   # List available schemas
  types/      # Generate TypeScript types
```

### Bare Compatibility

- Works on both Node.js and Bare runtime
- Handle any platform-specific adaptations
- Consistent API across platforms

---

## Why Needed

1. **Consistent patterns** - SPL2 invocation model, state management
2. **Schema caching** - Don't reload schemas repeatedly
3. **Validation helpers** - Boundary in/out patterns
4. **Bare compatibility** - Single API for both platforms
5. **Foundation for all APIs** - Every API uses AVRO schemas

---

## Current Usage (Project 07)

```javascript
import avro from 'avsc';

function createSchemaLoader() {
  const cache = new Map();

  function loadSchema(schemaPath) {
    if (cache.has(schemaPath)) {
      return cache.get(schemaPath);
    }
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const type = avro.Type.forSchema(schema);
    cache.set(schemaPath, type);
    return type;
  }

  return { loadSchema };
}
```

This pattern should be wrapped as SPL2 API.

---

## Dependencies

| Dependency | Why Needed | Can Start Without? |
|------------|------------|-------------------|
| Console API Exploration | Wrapper API patterns | No - provides foundation |
| avsc library | Underlying AVRO implementation | No - wraps this |

---

## Expected Products

1. AVRO wrapper API implementation (5 methods)
2. Method requirements with self-eval specs
3. Schema caching system
4. Bare runtime validation
5. TypeScript type generation (if feasible)

---

## Success Criteria

1. Can load and cache schemas via SPL2 API
2. Can validate data at boundaries
3. Works on Node.js and Bare
4. Consistent with SPL2 API patterns
5. Performance acceptable (caching effective)

---

## Notes

- Keep it thin - don't over-abstract avsc
- Focus on patterns we actually use
- May discover need for more methods through use
- Consider: Should this be in core package (zero dependencies except avsc)?

---

**Created:** 2025-11-19
**Source:** Project 07 closure
