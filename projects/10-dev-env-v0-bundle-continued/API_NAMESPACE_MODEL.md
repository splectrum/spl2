# API Namespace Model

Working document capturing the design insight that an API namespace contains both properties and methods.

---

## Core Concept

An API is a namespace containing:
- **Properties** - data/state (defined by schema)
- **Methods** - operations (defined by handler folders)

Both are accessed via the same path pattern: `package.api.name`

## Examples

```
spl.runtime.cwd              # property
spl.runtime.splectrumDir     # property
spl.runtime.invokedFrom      # property
spl.runtime.resolve          # method (future)

spl.request.completed        # property
spl.request.complete         # method
spl.request.fail             # method

spl.dev.clone                # method
```

## Structure

```
package/
└── api/
    ├── README.json           # type: api
    ├── _schemas/
    │   ├── state.avsc        # internal state (value, private)
    │   └── metastate.avsc    # public state (headers, shared)
    ├── methodA/
    │   ├── README.json       # type: method
    │   └── index.js          # handle()
    └── methodB/
        ├── README.json
        └── index.js
```

## Headers (Shared State)

Properties are carried in headers for cross-consumer sharing:

```javascript
record.headers = {
  spl: {
    runtime: {
      cwd: '/path/to/bundle',
      splectrumDir: '/path/to/bundle/splectrum',
      invokedFrom: '/path/where/invoked'
    },
    request: {
      completed: false
    },
    dev: {
      clone: {
        // method input/output
        path: './target',
        output: { created: '...' }
      }
    }
  }
}
```

## Schemas Define State

Branch nodes (module_root, package, api) have two state schemas:

### state.avsc - Complete Internal State

The source of truth. Contains all fields (public + private):

```json
{
  "type": "record",
  "name": "RuntimeState",
  "fields": [
    { "name": "cwd", "type": "string" },
    { "name": "splectrumDir", "type": "string" },
    { "name": "invokedFrom", "type": "string" },
    { "name": "startTime", "type": "long" },
    { "name": "requestCount", "type": "int" }
  ]
}
```

### metastate.avsc - Public Subset (Headers)

Declares which fields from state are exposed publicly. Must be a subset of state:

```json
{
  "type": "record",
  "name": "RuntimeMetastate",
  "fields": [
    { "name": "cwd", "type": "string" },
    { "name": "splectrumDir", "type": "string" },
    { "name": "invokedFrom", "type": "string" }
  ]
}
```

The runtime copies metastate fields from internal state into headers for sharing.

**Key constraint:** When both exist, metastate fields must exist in state (subset relationship).

**Pragmatic approach:** APIs can start with metastate only (no private state). Add state.avsc and sync logic only when private state is actually needed. Different APIs may have different sync requirements.

Methods (leaf nodes) don't own state - they operate on parent branch state.

## Methods Operate on State

Methods can read and modify the API's state:

```javascript
// spl/runtime/resolve (future)
export function handle(record) {
  const spl = createSpl(record)
  const runtime = spl.headers.spl.runtime
  const input = runtime.resolve  // method input

  // Use runtime properties
  const resolved = path.resolve(runtime.cwd, input.path)

  runtime.resolve.output = { resolved }
  spl.complete()
}
```

## Analogy

Like a class/object interface:
- Properties = instance variables
- Methods = instance methods
- Namespace = the class/object itself

The API is the public interface, exposing both what it knows (properties) and what it can do (methods).

---

## Design Decisions

1. **Flat namespace** - Properties and methods coexist at the same level under the API. No separate `_state` nesting.

2. **Schema as source of truth** - Properties defined in schemas, not ad-hoc.

3. **State on branch nodes** - All branch types (module_root, package, api) can have state. Methods (leaves) don't own state.

4. **Public/private separation** - `metastate.avsc` for headers (shared), `state.avsc` for value (private).

5. **APIs can be state-only initially** - An API might start with just properties (like spl/runtime), with methods added later.

## Type Hierarchy

```
module_node (base)
├── branch (non-leaf) ← has state.avsc + metastate.avsc
│   ├── module_root   (global state)
│   ├── package       (package state)
│   └── api           (api state)
└── method (leaf)     ← no state, only input/output
```

---

**Source:** Project 10 - Discussion on runtime properties and header structure
