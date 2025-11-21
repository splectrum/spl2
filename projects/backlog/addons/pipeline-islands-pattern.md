# Pipeline Islands Pattern (Addon)

**Type:** Project Addon
**Addon To:** spl/execute API → spl/pipeline API
**Source:** 2025-11-21 chat - pipeline design exploration

---

## Overview

Reframes execution model from "spl/execute" (single-purpose) to "spl/pipeline" (generative primitive). Scripts contain **pipeline islands** in a **sea of free script code**.

---

## Key Concepts

### Pipeline Islands in a Sea of Free Script

```javascript
// === SEA ===
const config = loadConfig()
const targets = determineTargets(config)

// === ISLAND ===
const envs = await spl/pipeline/parallel(runtime, {
  branches: targets.map(t => ({ method: "spl/dev/create", input: t }))
})

// === SEA ===
const viable = envs.filter(e => e.status === 'ready')
logger.info(`${viable.length} environments ready`)

// === ISLAND ===
const results = await spl/pipeline/sequence(runtime, {
  steps: viable.map(e => ({ method: "spl/dev/cycle", input: { env: e.id } }))
})

// === SEA ===
generateReport(results)
```

- **Islands** = managed context, orchestration, error handling, bug capture
- **Sea** = full language freedom, any logic
- **Bridges** = input/output at island boundaries

### Pipelines Don't Box Scripts

Even when a script is encapsulated as an API method (called via pipeline), internally it has full freedom. The pipeline context flows through - available when needed (islands), invisible when not (sea).

### Method Invocations as Data

API methods are addressable: `spl/dev/create` + input data. This means:
- Pipelines are data (storable, versionable, composable)
- Scripts can graduate to API methods
- Complex implementations emerge from composed simple pieces

---

## Layering

| Layer | Role |
|-------|------|
| **Runtime** | Context object (data layer, config) - what you *have* |
| **Pipeline API** | Orchestration, context management - what you *do* |
| **Domain APIs** | Stateful operations (spl/dev, spl/bug, etc.) |
| **Script** | Direct invocations + free code |

### Runtime as Context, Not Actor

```javascript
// Create runtime context
const runtime = spl/runtime/create({ dataLayer: ..., config: ... })

// Pipeline methods receive runtime
spl/pipeline/sequence(runtime, { steps: [...] })
```

Runtime is environment, pipeline is executor.

---

## Pipeline API Methods (Initial)

| Method | Description |
|--------|-------------|
| `spl/pipeline/invoke` | Single method call with context |
| `spl/pipeline/sequence` | Chain steps, output → input |
| `spl/pipeline/parallel` | Concurrent execution |
| `spl/pipeline/branch` | Conditional routing |
| `spl/pipeline/retry` | Retry with backoff |

---

## Pipeline Responsibilities

- **Execution context management** - create, transfer, merge
- **Parent/child context transfer** - nested pipelines inherit/fork
- **Parallel coordination** - spawn, merge results back
- **Error handling** - catch, create bug report, decide rethrow/continue
- **Data layer access** - within context

---

## Relationship to spl/bug

Pipeline catches errors and calls `spl/bug/create` with context. Bug API remains separate because:

- Bug report = API state (the data structure)
- Bug API = methods operating on that state
- Version-bound: report created by bug API v1.2 opens with v1.2
- Valuable domain functionality (reproduce, analyze, fix workflow)

---

## Design Principles

- **Maximum power from simplicity** - one well-designed primitive enables composition
- **No forced structure** - use islands where valuable, swim freely elsewhere
- **Scripts graduate to APIs** - proven patterns solidify into addressable methods
- **Pipelines serve scripts** - context available when needed, invisible when not

---

**Created:** 2025-11-21
**Source:** Chat discussion on execution model reframe
