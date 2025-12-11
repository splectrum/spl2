# Type Stack and Selfeval Architecture

Working document capturing design decisions from Project 11 implementation.

## Type Stack

### Structure

The type stack for a container has two layers:

1. **Type layer** (first): container → extends chain
2. **Instance layer** (second): instantiates → extends chain (deduped)

```
buildTypeStack returns { stack: [...], instanceLevel: N }
```

Where `instanceLevel` is the 1-based index where the instance layer begins.

### Examples

**spl (package instance):**
```
stack: [spl, spl/package, spl/container]
instanceLevel: 2

- Level 1: spl (the container itself)
- Level 2: spl/package (instanceLevel - direct type via instantiates)
- Level 3: spl/container (spl/package extends spl/container)
```

**spl/package (type definition):**
```
stack: [spl/package, spl/container, spl/api]
instanceLevel: 3

- Level 1: spl/package (the container itself)
- Level 2: spl/container (extends chain - type layer)
- Level 3: spl/api (instanceLevel - spl/package instantiates spl/api)
```

**spl/container (API instance, type definition):**
```
stack: [spl/container, spl/api]
instanceLevel: 2

- Level 1: spl/container (the container itself, extends: null)
- Level 2: spl/api (instanceLevel - instantiates spl/api)
```

### Algorithm

```javascript
function buildTypeStack(containerPath) {
  const index = readContainerIndex(containerPath)
  const stack = [containerPath]
  const visited = new Set([containerPath])

  // 1. Follow extends chain first (type layer)
  let current = index.extends
  while (current && !visited.has(current)) {
    visited.add(current)
    stack.push(current)
    const typeIndex = readContainerIndex(current)
    if (!typeIndex) break
    current = typeIndex.extends
  }

  // 2. Mark where instance layer begins (1-based)
  const instanceLevel = stack.length + 1

  // 3. Follow instantiates chain (instance layer)
  current = index.instantiates
  while (current && !visited.has(current)) {
    visited.add(current)
    stack.push(current)
    const typeIndex = readContainerIndex(current)
    if (!typeIndex) break
    current = typeIndex.extends
  }

  return { stack, instanceLevel }
}
```

## Instance vs Type

Two orthogonal concepts:

- **instantiates** (structural): What container shape this is. Determines inheritance for overlay resolution.
- **type field** (content): What this container defines. E.g., `type: "Type"` means it defines a type.

Example: `spl/api/index.json`
```json
{
  "name": "spl/api",
  "type": "Type",           // content: defines a type
  "instantiates": "spl/api", // structure: is an API container
  "extends": "spl/container"
}
```

All children of `spl` (the package) are API instances that happen to define Types.

## Final vs Non-Final Resources

**Final resources** - cannot overlap across type chain:
- `_reqs/*.md` - requirements documents
- `_lib/*.js` - library code
- `_tests/*.js` - test files

Each level has its own `index.json` manifest. Files are unique per level.

**Non-final resources** - inherit via overlay:
- `index.js` - handler (inherited from parent type if not overridden)
- `index.json` - identity (each level has its own)
- `_schemas/*.avsc` - schema files (inherited)
- `_selfevals/index.json` - selfeval registry (each level has its own)

## Selfeval Architecture

### Runner Types

**Type runners** (`runners` in `_selfevals/index.json`):
- Run at every level in the type chain
- Validate container structure against that level's rules
- Example: `lib`, `schemas`, `handler`, `reqs`, `final`

**Instance runners** (`instanceRunners` in `_selfevals/index.json`):
- Run only at the `instanceLevel` (direct type)
- Validate instance-specific rules
- Example: `children` (on spl/package), `api` (on spl/api)

### Runner Placement

| Runner | Defined On | Type | Purpose |
|--------|-----------|------|---------|
| lib | spl/container | type | Check _lib exports match manifest |
| schemas | spl/container | type | Check schema files match manifest |
| handler | spl/container | type | Check index.js exists (via overlay) |
| reqs | spl/container | type | Check req files match manifest |
| final | spl/container | type | Check no overlap in final resources |
| children | spl/package | instance | Check children match instanceChildren type |
| api | spl/api | instance | Check api methods match folders |

### Runner Resolution

Runners are loaded via overlay. The runner file (e.g., `selfeval_api.js`) lives in `_lib` of a parent type and is found via the type stack of the type defining the runner.

Example: `api` runner defined in `spl/api/_selfevals/index.json` with `file: "selfeval_api.js"`:
- Resolves `spl/api/_lib/selfeval_api.js` via overlay
- `spl/api` extends `spl/container`
- Found at `spl/container/_lib/selfeval_api.js`

### Empty Manifests

Each container should have explicit empty manifests rather than absent folders:

```json
// _lib/index.json
{ "files": {} }

// _reqs/index.json
{ "requirements": [] }

// _schemas/index.json
{ "files": [] }
```

This makes it clear at each level what is defined (nothing) vs what is missing.

### Output States

- **PASS** - validation succeeded with items checked
- **FAIL** - validation failed
- **EMPTY** - nothing to validate (not a failure, just nothing there)

## Type Hierarchy

Current type definitions in `spl/`:

```
spl/container (extends: null, instantiates: spl/api)
  └── spl/api (extends: spl/container, instantiates: spl/api)
  └── spl/package (extends: spl/container, instantiates: spl/api)
  └── spl/module (extends: spl/container, instantiates: spl/api)
  └── spl/modules (extends: spl/container, instantiates: spl/api)
  └── spl/method (extends: null, instantiates: spl/api)
```

Note: `spl/method` should probably extend `spl/container` for consistency.

## Key Files

- `_lib/module.js` - `buildTypeStack`, `resolveOverlay`
- `spl/container/_lib/selfeval.js` - selfeval framework
- `spl/container/selfeval/index.js` - selfeval method
- `spl/container/_selfevals/index.json` - type runners
- `spl/api/_selfevals/index.json` - api instanceRunner
- `spl/package/_selfevals/index.json` - children instanceRunner

## TODO

- [ ] Update relevant _reqs documents with these design decisions
- [ ] Verify spl/method extends spl/container
- [ ] Add empty manifest folders to spl/container as defaults
- [ ] Consider if spl/api should have empty _lib, _reqs, _schemas folders
