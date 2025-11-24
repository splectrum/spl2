**Type:** plain req
**Extends:** modules

# dev-modules

## Spec

Specialized **modules** folder for development environments with type-aware overlay resolution.

**Extends modules_v1.0.0.md** with dev-specific constraints:

Structure:
```
modules/
├── types/             # Layer 0 - Node type definitions (dev only)
│   ├── api_node/
│   ├── package/
│   ├── api/
│   └── api_method/
├── spl-core/          # Layer 1..n-1 - Base modules (named by package)
├── spl-console/       # Additional base modules
├── pr09/              # Layer n - Work module (project-specific name)
├── _index.json        # Layer order
└── hierarchy.json     # Generated overlay map (optional cache)
```

**Layer constraints:**
- **Layer 0:** Always `types/` module containing node type definitions
- **Layers 1..n-1:** Base modules, named by package (spl-core, spl-console, etc.)
- **Layer n:** Work module, named by project (pr09, bugfix-123, etc.)

**_index.json format:**
```json
{
  "layers": [
    { "name": "types", "type": "types" },
    { "name": "spl-core", "type": "base" },
    { "name": "spl-console", "type": "base" },
    { "name": "pr09", "type": "work" }
  ]
}
```

**Types module (Layer 0):**
- Contains node type definitions: api_node, package, api, api_method
- Each type has `_reqs/` with type specification and self-evals
- Declares inheritance: `**Extends:** api_node` (or null for base type)
- All instances resolve type chain through this layer

**Base modules (Layers 1..n-1):**
- Named by package they contain (spl-core, spl-console, etc.)
- Provide default implementations for API nodes
- Can be multiple base modules (each named specifically)
- Work module overlays these for specialized implementations

**Work module (Layer n):**
- Project-specific development module
- Named by project (pr09, feature-xyz, bugfix-123)
- Contains only changes/additions (thin layer)
- Overlays base modules and types

**Overlay resolution:**
- Hierarchy map built on environment creation
- Each node gets layer sequence based on its type
- Two operations: selectFile() (first match), collectAll() (accumulate)
- See TYPE_HIERARCHY_OVERLAY_DESIGN.md for details

**Behavior:**
- Layer order determines resolution priority (n → 0)
- Work module (n) overrides base (1..n-1) overrides types (0)
- Types provide default requirements and self-evals
- Base modules provide default implementations
- Work module provides specific changes

**Dev environment only:**
- types/ module only exists in dev environments
- Production/runtime uses standard **modules** pattern
- Extract merges layers into self-contained modules
- Deployed modules don't need types layer

Scope: Dev environment.

Purpose: Enable type-aware overlay resolution with progressive refinement during development.

## Self-eval

- [ ] Extends **modules** (has _index.json with layer order)
- [ ] Layer 0 is types/ module
- [ ] Layers 1..n-1 are named base modules (by package)
- [ ] Layer n is work module (project-specific name)
- [ ] Types module contains node type definitions
- [ ] Hierarchy map generated on deploy (optional)
- [ ] Overlay resolution available (selectFile, collectAll)

## Comments

**Extends:** modules_v1.0.0.md (base pattern)

**Key difference from modules:**
- modules: Generic layer management (all environments)
- dev-modules: Type-aware with Layer 0 = types (dev only)

**Progressive refinement:**
- Work module can start minimal (just requirements)
- Falls back to base implementations via overlay
- Tests run with defaults until overridden
- Extract produces complete self-contained module

**See also:**
- OVERLAY_EXTRACTION_PATTERN.md - Overlay + extraction design
- TYPE_HIERARCHY_OVERLAY_DESIGN.md - Complete architecture

**Used by:** Development environments (v1.1+)
