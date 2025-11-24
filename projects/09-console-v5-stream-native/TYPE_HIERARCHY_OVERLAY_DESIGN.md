# Type Hierarchy & Overlay Design

**Created:** 2025-11-24
**Context:** Roadmap and vision for type-based overlay system with declaration-driven resolution

---

## Overview

Platform architecture uses **type inheritance with overlay resolution** during development and **flattened self-contained instances** for runtime/production. This design captures the full layering model, resolution strategy, and extraction pattern.

---

## Type Hierarchy Model

### Base Type: API Node

All structural types derive from **API Node** (base type):

```
API Node (base type)
├── Package (extends API Node)
├── API (extends API Node)
└── API Method (extends API Node)
```

**Key characteristics:**
- Package, API, and API Method are **siblings**, not a chain
- All derive **directly from API Node**
- Not a linear inheritance chain, but a tree with common root

### Type Extension (Future)

Type system is **extensible** - can add specialized types:

```
API Node (base)
├── Package
│   └── Tools Package (specialized package type)
│       └── [instance: tools/wrapper]
├── API
└── API Method
```

**Pattern:**
- Insert specialized types between base and instance
- Example: Tools Package extends Package extends API Node
- Overlay resolution walks the declared chain automatically

---

## Layering Structure

### Three Distinct Layers

**1. Type Layer (Development)**
- Contains type definitions (API Node, Package, API, API Method)
- Lives in `models/` or `types/` directory
- Each type has requirements and self-evals
- Declares inheritance: `**Extends:** api_node`

**2. Instance Layer (Development & Runtime)**
- Concrete implementations (e.g., `spl/dev/create`)
- Declares type: `**Instance of:** api_method`
- During dev: thin, relies on overlay
- After extraction: complete, self-contained

**3. Work Module Layer (Development Only)**
- Active development changes
- Overlays instance and type layers
- Contains only delta/changes
- Merged during extraction

### Layer Resolution During Development

```
Work module (changes only)
  ↓ overlays
Instance base (if exists)
  ↓ overlays
Type chain (api_method → api_node)
  ↓ overlays
Models/schemas
```

---

## Requirements & Self-Eval Hierarchy

### Multi-Level Validation

For an instance like `spl/dev/create`, requirements and self-evals exist at **all levels**:

**Instance level:** `spl/dev/create/_reqs/`
- `spl_dev_create_v1.0.0.md` (instance-specific requirements)
- `spl_dev_create_v1.0.0_selfeval_structure.js`
- `spl_dev_create_v1.0.0_selfeval_schemas.js`

**Type level:** `models/`
- `api_method_v1.0.0.md` (API Method type requirements)
- `api_method_v1.0.0_selfeval.js`
- `api_node_v1.0.0.md` (API Node base requirements)
- `api_node_v1.0.0_selfeval.js`

### Validation Chain

All levels must pass:

1. Instance-specific self-eval ✓
2. API Method type self-eval ✓
3. API Node type self-eval ✓

**During development:** Overlay resolves self-evals from type layer
**After extraction:** All self-evals merged into instance module

---

## Declaration-Driven Resolution

### Design Decision: Trust Declarations

**Two possible approaches:**

**Option 1: Hard-coded structure (what SHOULD be)**
```javascript
// Overlay knows: api_method extends api_node
const typeChain = { api_method: ['api_node'] }
```

**Option 2: Declaration-driven (what IS) ✓ CHOSEN**
```javascript
// Read from req preambles:
// Instance: "Instance of: api_method"
// Type: "Extends: api_node"
```

### Why Declaration-Driven?

**Pros:**
- **Flexible:** Add new types without changing overlay logic
- **Explicit:** Type chain visible in requirements
- **Traceable:** Clear what instance claims to be
- **Extensible:** Tools Package example works automatically
- **Self-documenting:** Requirements declare their relationships

**Cons:**
- Must validate declarations are correct
- Could declare invalid type chain

**Mitigation:** Validate type layer integrity on dev env creation

---

## Validation Strategy

### Upfront Validation (Deploy Time)

**On dev environment creation:**
```bash
node deploy.js
  → Creates environment structure
  → Copies base layer
  → Copies type/model layer
  → Validates type integrity ✓
    - All declared types exist
    - Extension chains valid (no cycles, end at api_node)
    - Required files present
    - No orphaned types
  → If valid: proceed
  → If invalid: fail fast with clear error
```

**Benefits:**
1. **Fail fast:** Problems caught before work begins
2. **Trust during dev:** Overlay just follows declarations
3. **Clear errors:** Know exactly what's wrong
4. **Performance:** No repeated validation during development
5. **Safety:** Validated foundation for all work

### Runtime Trust

**During development:**
- Overlay resolution trusts validated type chain
- Reads declarations and follows them
- No runtime validation overhead
- Fast, simple resolution logic

---

## Overlay Resolution Algorithm

### Pseudo-Code

```javascript
/**
 * Resolve type chain for an instance
 * Walks declarations to build inheritance chain
 */
function resolveTypeChain(instanceReqPath) {
  const chain = []
  let currentReq = readReq(instanceReqPath)
  chain.push(currentReq)

  // Walk up type hierarchy via declarations
  while (currentReq.instanceOf || currentReq.extends) {
    const parentType = currentReq.instanceOf || currentReq.extends
    const parentReqPath = findTypeReq(parentType)
    const parentReq = readReq(parentReqPath)
    chain.push(parentReq)
    currentReq = parentReq
  }

  return chain  // [instance, api_method, api_node]
}

/**
 * Resolve file via overlay
 * Checks layers in priority order
 */
function resolveFile(path) {
  // Priority order:
  // 1. Work module
  if (exists(`modules/pr09/${path}`)) {
    return `modules/pr09/${path}`
  }

  // 2. Instance base
  if (exists(`base/instances/${path}`)) {
    return `base/instances/${path}`
  }

  // 3. Type chain (from specific to general)
  const typeChain = resolveTypeChain(instanceReq)
  for (const type of typeChain) {
    if (exists(`models/${type.name}/${path}`)) {
      return `models/${type.name}/${path}`
    }
  }

  // Not found
  return null
}

/**
 * Resolve self-eval
 * Collects from all type levels
 */
function resolveSelfEvals(instanceReqPath) {
  const selfEvals = []
  const typeChain = resolveTypeChain(instanceReqPath)

  for (const type of typeChain) {
    const selfEvalsForType = findSelfEvals(type)
    selfEvals.push(...selfEvalsForType)
  }

  return selfEvals  // All self-evals from instance → api_node
}
```

---

## Extraction: Type Chain → Self-Contained Instance

### Dev vs Runtime vs Production

**Dev Environment (type-aware):**
```
Type hierarchy active:
- API Node type
- Package type
- API Method type
- Instance (work module)

Overlay resolution walks type chain
Self-evals validate entire hierarchy
```

**Runtime (instances only):**
```
Extracted module contains:
- Instance code (index.js, etc.)
- Instance reqs (merged from all type levels)
- Instance self-evals (merged from all type levels)

Self-contained for integration testing
No type hierarchy needed
```

**Production (minimal, optional):**
```
Further reduction possible:
- Runtime-required files only
- Strip reqs/ (if not needed for introspection)
- Strip self-evals (if not needed for validation)
- Keep only execution code
```

### Extract Algorithm

**During extraction:**

```javascript
function extractInstance(envName, outputPath) {
  const instance = getInstanceFromEnv(envName)
  const typeChain = resolveTypeChain(instance.reqPath)

  // 1. Collect code files
  const codeFiles = collectFiles(instance, ['*.js', '*.json'])
  copyFiles(codeFiles, outputPath)

  // 2. Merge requirements from type chain
  const allReqs = []
  for (const type of typeChain) {
    allReqs.push(...collectReqs(type))
  }
  mergeReqs(allReqs, `${outputPath}/_reqs/`)

  // 3. Merge self-evals from type chain
  const allSelfEvals = []
  for (const type of typeChain) {
    allSelfEvals.push(...collectSelfEvals(type))
  }
  mergeSelfEvals(allSelfEvals, `${outputPath}/_reqs/`)

  // 4. Create manifest
  createManifest({
    instance: instance.name,
    extractedFrom: envName,
    typeChain: typeChain.map(t => t.name),
    timestamp: new Date().toISOString()
  }, `${outputPath}/MANIFEST.json`)

  // 5. Extract reports separately
  extractReports(envName, `reports/${envName}/`)
}
```

**Result:**
```
implementation/spl-dev-create/
├── _reqs/
│   ├── spl_dev_create_v1.0.0.md              # instance req
│   ├── spl_dev_create_v1.0.0_selfeval_*.js   # instance self-evals
│   ├── api_method_v1.0.0.md                  # type req (merged)
│   ├── api_method_v1.0.0_selfeval.js         # type self-eval (merged)
│   ├── api_node_v1.0.0.md                    # base type req (merged)
│   └── api_node_v1.0.0_selfeval.js           # base self-eval (merged)
├── index.js
├── tests/
├── README.md
└── MANIFEST.json
```

**Critical:** Extracted module is **self-contained** for integration testing

---

## Structure in Dev Environment

### Directory Layout

```
environment/
├── base/                           # Base implementations layer
│   └── instances/
│       └── spl/
│           └── dev/
│               └── create/
│                   ├── index.js    # Generic implementation
│                   └── README.md
│
├── models/                         # Type definitions layer
│   ├── api_node_v1.0.0.md
│   ├── api_node_v1.0.0_selfeval.js
│   ├── package_v1.0.0.md
│   ├── api_v1.0.0.md
│   ├── api_method_v1.0.0.md
│   └── api_method_v1.0.0_selfeval.js
│
├── modules/                        # Work modules layer
│   └── pr09/                       # Active work (delta only)
│       └── spl/
│           └── console/
│               └── create/
│                   └── index.js    # Only what changed
│
├── package.json
└── ... (deploy, test, extract scripts)
```

### Benefits

**During Development:**
- Work module thin (only changes)
- No duplication of type-level requirements
- Self-evals automatically available
- Fast iteration
- Clear "what's different"

**After Extraction:**
- Complete self-contained module
- All requirements merged
- All self-evals included
- Ready for integration testing
- Ready for deployment

---

## File Path Resolution Problem & Solution

### Challenge

Work module code needs library/utility functions without path traversal:

```javascript
// Bad: brittle, implementation-dependent
const dataLayer = require('../../lib/data-layer')

// Good: overlay-resolved
const dataLayer = lib('data-layer')
```

### Solutions

**Option 1: Custom resolution function**
```javascript
import { lib, base } from '@pr09/resolve'

const dataLayer = lib('data-layer')
const apiMethod = base('spl/console/log')
```

**Option 2: Package.json imports**
```json
{
  "imports": {
    "#lib/*": "./base/lib/*",
    "#pr09/*": "./modules/pr09/*",
    "#types/*": "./models/*"
  }
}
```

**Option 3: Build-time resolution**
- Work module uses symbolic references
- Extract resolves all paths
- Output has concrete paths

**For v1.1:** Start with Option 1 (custom functions), evaluate based on ergonomics

---

## Implementation Roadmap

### v1.1: Foundation

**Deliverables:**
1. Type layer structure in `models/`
   - api_node_v1.0.0.md
   - api_method_v1.0.0.md
   - Corresponding self-evals

2. Overlay resolution (basic)
   - Read instance req declaration
   - Walk type chain via declarations
   - Resolve files from layers

3. Extract enhancement
   - Merge requirements from type chain
   - Merge self-evals from type chain
   - Generate complete instance module

4. Namespace structure work (v1.1 goal)
   - ExecutionContext using overlay
   - Handler using overlay
   - Demonstrate thin work module

### v1.2+: Enhancement

**Upfront validation:**
- Type layer integrity checks
- Extension chain validation
- File existence validation

**Resolution refinement:**
- lib() function for utilities
- base() function for base modules
- Performance optimization

**Extract refinement:**
- Conflict resolution strategies
- Manifest detail enhancement
- Production minimization option

### Future: Extensibility

**Specialized types:**
- Tools Package extends Package
- Custom API types
- Domain-specific extensions

**Registry/repository:**
- Type definitions in registry
- Base modules downloadable
- Version management

---

## Key Principles

### 1. Separation of Concerns

**Development complexity:**
- Rich type hierarchy
- Overlay resolution
- Inheritance chains
- Multiple layers

**Runtime simplicity:**
- Flat instances
- Self-contained modules
- No overlay needed
- Direct execution

### 2. Create Once, Reuse Everywhere

**Type definitions:** Written once, inherited by all instances
**Base implementations:** Shared across work modules
**Self-evals:** Type-level validation reused
**Requirements:** Inherited from type chain

### 3. Declaration-Driven

**Trust declarations:** Requirements declare type relationships
**Validate upfront:** Check integrity at env creation
**Runtime trust:** Overlay follows validated declarations
**Explicit relationships:** Clear in requirements, not hidden in code

### 4. Extract as Boundary

**Dev side:** Type hierarchy, overlay, thin modules
**Deployment side:** Flattened instances, complete modules
**Extract transforms:** Type-aware → self-contained
**Testing:** Integration tests use extracted modules

### 5. Fail Fast

**Validation at setup:** Catch problems before work begins
**Clear errors:** Know exactly what's wrong with type chain
**Trust during work:** No validation overhead after setup
**Safe foundation:** Work on validated structure

---

## Benefits Summary

### For Development

- **Thin work modules:** Only changes, no duplication
- **Fast iteration:** Minimal files to modify
- **Clear delta:** Obvious what's different
- **Automatic inheritance:** Self-evals, reqs from types
- **Type safety:** Validated type chain

### For Integration Testing

- **Self-contained:** Extracted module has everything
- **Reproducible:** Same module, different environments
- **Traceable:** MANIFEST shows type provenance
- **Validatable:** All self-evals included

### For Production

- **Flexible deployment:** Can minimize further if needed
- **No overlay:** Direct execution
- **Standard Node.js:** Works anywhere
- **Versioned:** Clear instance version

### For Platform Evolution

- **Extensible types:** Add specialized types easily
- **Backward compatible:** New types don't break existing
- **Declaration-driven:** No hardcoded assumptions
- **Future-proof:** Can add registry, versioning, etc.

---

## Questions & Decisions

### Resolved

1. **Type hierarchy structure?** → Flat siblings from API Node ✓
2. **Resolution strategy?** → Declaration-driven ✓
3. **Validation approach?** → Upfront on env creation ✓
4. **Extract merges types?** → Yes, into self-contained instance ✓
5. **Runtime has types?** → No, instances only ✓

### For v1.1 Implementation

1. **Type layer location?** → `models/` or `types/`?
2. **Resolution function API?** → lib(), base(), or imports?
3. **Validation detail level?** → Full or minimal first pass?
4. **Manifest contents?** → What metadata to track?
5. **Base layer source?** → Manual copy or automated?

### Future Exploration

1. **Type registry?** → Central repository of types?
2. **Version compatibility?** → Type version matching?
3. **Dynamic types?** → Create types at runtime?
4. **Cross-platform?** → Types work across languages?
5. **Optimization?** → Cache type chain resolution?

---

## Next Steps

**Immediate (v1.1 start):**
1. Create `models/` directory with initial types
2. Implement basic overlay resolution
3. Enhance extract.js to merge type chain
4. Build namespace structure work using overlay

**Near-term (v1.1 completion):**
5. Add upfront type validation
6. Implement lib()/base() functions
7. Document overlay patterns for developers
8. Test extraction → integration workflow

**Long-term:**
9. Explore type registry concept
10. Add specialized type examples
11. Optimize resolution performance
12. Expand to other platforms/languages

---

**Status:** Design captured, roadmap established, ready for v1.1 implementation.

**Vision:** Development uses rich type hierarchy with overlay resolution. Extraction flattens to self-contained instances. Production runs simple, direct code. Complexity serves developers, not runtime.
