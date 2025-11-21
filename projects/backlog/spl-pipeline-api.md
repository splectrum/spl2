# spl/pipeline API (Phase 1)

**Priority:** High
**Type:** Implementation Project
**Dependencies:** Console API Exploration (patterns)
**Phase:** 1 - Implementation Pipeline
**Addons:** [Pipeline Islands Pattern](addons/pipeline-islands-pattern.md)

---

## Overview

Pipeline orchestration API with context management. Reframes execution from single-purpose "execute" to generative "pipeline" primitive. Enables **pipeline islands in a sea of free script code**.

---

## Scope

### Core Methods

| Method | Description |
|--------|-------------|
| `spl/pipeline/invoke` | Single method call with context |
| `spl/pipeline/sequence` | Chain steps, output → input |
| `spl/pipeline/parallel` | Concurrent execution, merge results |

### Core Components

| Component | Description |
|-----------|-------------|
| **Runtime context** | Created via `spl/runtime/create`, passed to pipeline methods |
| **Context management** | Create, transfer, merge contexts |
| **Parent/child transfer** | Nested pipelines inherit/fork context |
| **Error handling** | Catch, create bug report, decide rethrow/continue |

### Key Design Principles

- **Method invocations as data** - `spl/dev/create` + input is addressable, storable, composable
- **Pipelines don't box scripts** - context available when needed, invisible when not
- **Scripts graduate to APIs** - proven patterns solidify into addressable methods
- **Maximum power from simplicity** - one primitive enables composition

---

## The Pattern

```javascript
// === SEA ===
const config = loadConfig()

// === ISLAND ===
const result = await spl/pipeline/sequence(runtime, {
  steps: [
    { method: "spl/dev/create", input: {...} },
    { method: "spl/dev/install", input: {...} }
  ]
})

// === SEA ===
processResult(result)
```

Even API methods (encapsulated in pipeline) have full internal freedom - islands and sea inside.

---

## Why Phase 1

1. **Generative primitive** - more powerful than single-purpose execute
2. **Uniform context management** - one place, consistent rules
3. **Bug reports emerge naturally** - pipeline catches errors, calls spl/bug
4. **Enables composition** - pipelines contain pipelines
5. **Scripting = data** - no special language, just nested method specs

---

## Expected Products

1. `spl/pipeline` API design
2. Core methods: invoke, sequence, parallel
3. Runtime context creation (`spl/runtime/create`)
4. Context transfer mechanism
5. Error handling with spl/bug integration point
6. Self-eval specs for the API

---

## Success Criteria

1. Can invoke methods with context capture
2. Can sequence and parallelize method calls
3. Context flows correctly through nested pipelines
4. Errors captured with sufficient context for bug reports
5. Free script code works seamlessly around pipeline islands

---

## Notes

- First stab - expect iteration in Phase 2
- Keep minimal - learn from use what's actually needed
- See addon for full design exploration

---

**Created:** 2025-11-21
**Updated:** 2025-11-21 (reframed from spl/execute to spl/pipeline)
**Source:** Project 09 planning chat
