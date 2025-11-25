# Emerging Patterns - V0 Development

**Created:** 2025-11-25
**Purpose:** Capture WOWs and patterns as they emerge during v0 model dev env development

---

## Terminology

### Bundle vs Package
- **Bundle:** Module container (generic term for folder structure with content)
- **Package:** Reserved for DSL meaning (top-level api_node, root of API tree)

---

## Type Bundle Structure

Type bundles (in modules/types/) define what a type IS:

```
types/{type}/
├── index.js          # Default implementation
├── README.md         # Natural language explanation
└── README.json       # Structure definition + version ref to glossary req
```

**No _reqs/ folder** - the req lives in glossary system, not duplicated in bundle.

README.json contains version back-reference to glossary req for traceability.

### Cascading Spidering Entry Point

README.json is the spidering entry point for module discovery:

```json
{
  "files": {
    "index.js": "Description",
    "_schemas/input.avsc": "Description"
  },
  "children": {
    "child_name": "child_name/README.json"
  }
}
```

- `files`: inventory of this node's files (paths relative to README.json)
- `children`: references to child node README.json files

Spider from any README.json → discover whole subtree.

---

## Work Module Structure

Work module nodes (where new implementation happens) have different needs:

```
{work_module}/{node}/
├── index.js          # Specific implementation (overrides default)
├── _reqs/            # OPTIONAL - requirements for this implementation
│   └── {name}_v{x.y.z}.md
├── _schemas/         # Input/output schemas
└── _tests/           # Test cases
```

**_reqs/ is optional** - only needed where specifying new implementation requirements.

---

## Module Types

Different module types have different structures:

| Module Type | _reqs/ | Purpose |
|-------------|--------|---------|
| Type bundle | No | Defines what a type IS |
| Base module | Optional | Provides default implementations |
| Work module | Optional | New implementation with requirements |

(More module types may emerge)

---

## Cascading Pattern

Minimizes duplication through reference chain:

```
DSL Glossary (term + req ref)
    ↓
v0/modules/types/{type}/ (living implementation)
    ↓
README.md + README.json (entry points)
```

Each level references the next, no duplication of content.

---

## api_node → module_node Rename

### Why Renamed
- `api_node` conflicted with `api` as derived type
- Base type is for all module nodes, not just API nodes
- `module_node` is clearer: structural unit within a module

### All Levels Invokable
- **Old:** package "cannot be invoked directly"
- **New:** All module_nodes are invokable (index.js mandatory at module_node level)
- Package, api can return metadata, help, routing info when invoked

### Derived Types
module_node is base for: module_root, package, api, api_method

### Schema Naming
Type-level schemas use type namespace:
- `module_node.input`, `module_node.output`
- `api.state` (state added at api level, not base)

Instance schemas use instance namespace:
- `spl.dev.create.input`

---

## Conventions

### selfeval
Single word: `selfeval` (not self_eval, not self-eval)

File pattern: `{name}_v{x.y.z}_selfeval_{aspect}.js`

### Async Everywhere
Queue-based design fully supports async.

Standard signature: `export default async function(context) { ... }`

### Input/Output Handling
Runtime merges input into context before invocation.

Single parameter signature (context contains everything).

**Output is not "returned"** - it's assigned to context's transfer block.

### Transfer Block
- `context.transfer` carries data between pipeline steps
- On invocation: contains input
- On completion: set to output (becomes next step's input)

### Node Handler Completion
Three responsibilities on completion:
1. **Set transfer to output** - replace input with output payload
2. **Set request status** - normal completion vs irregular exit
3. **Fire event record** - fire and forget

Default node handler sets transfer to `{}` (empty output).

**Completion action is async** - fire and forget is itself an async operation.

**TODO:** Define context functional setup (context.complete() or equivalent).

---

## Open Questions

1. **Module type as formal concept?** - Work module vs type bundle vs base module structure differences suggest module_type may need formal definition

2. **README.json schema?** - Should we define a schema for README.json structure?

3. **Glossary update for api_node v1.1.0?** - When do we update the glossary ref from v1.0.0 to v1.1.0?

---

## Session Log

**2025-11-25:**
- Started v0 type bundle population
- Created api_node type bundle (README.md, README.json, index.js)
- Discovered _reqs/ not needed in type bundles
- Captured bundle vs package terminology
- Documented cascading pattern
- Noted module type differences emerging
- Renamed api_node → module_node (clearer, avoids naming collision)
- Added _schemas/ and _tests/ as default folders in module_node
- Schema naming: type.input/output/state pattern
- api.state added at api level (not module_node base)
- Default output is empty {} (data payload for piping, not status)
- Removed _tests/ from module_node (defaults cover everything)
- Output is context assignment, not return - smells like runtime concern
- Defined "node handler" terminology (vs "default index.js")
- Defined "transfer" block in context (input → output → next input)
- Node handler completion: 3 responsibilities (set transfer, set status, fire event)
- README.json as cascading spidering entry point (files + children refs)
- Added branch type (non-leaf with batch capability)
- Type hierarchy: module_node → branch → module_root/package/api; module_node → method
- Removed children from type README.json (children are for instances, not types)

---

**Session 5 Summary (2025-11-25):**

Major accomplishments:
1. Renamed api_node → module_node (clearer, avoids collision)
2. Created complete type hierarchy in v0/modules/types/
3. Defined cascading spidering pattern (README.json with files + children)
4. Added branch intermediate type for batch capability
5. Established node handler completion pattern (transfer, status, fire)
6. Updated DSL glossary with all new types

Type hierarchy established:
```
module_node (base - help input)
├── branch (adds batch input)
│   ├── module_root
│   ├── package
│   └── api (adds state schema)
└── method (leaf)
```

Next: Create work module and move implementation scripts into spl API structure.

---

**Status:** Living document - update as patterns emerge
