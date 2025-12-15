**Type:** plain req
**Version:** 1.0.0

# spl_crud_type

## Spec

CRUD is the lifecycle API type for containers. It extends spl/introspection to add create, read, update, delete operations.

**Purpose:**

- Provides lifecycle management methods for containers
- Enables container creation, materialization, modification, and removal
- Operates on the work_module filesystem

**Architecture:**

The CRUD API extends introspection with lifecycle methods:

```
spl/introspection (base)
  - api: whoami, selfeval

spl/crud (extends spl/introspection)
  - api: create, lift, update, delete

spl/container (extends spl/crud)
  - structural constraints only
```

**Methods:**

- `create` - Establish new container identity (see create/_reqs/)
- `lift` - Materialize overlay resources for editing (see lift/_reqs/)
- `update` - Apply drift fixes and schema inheritance (see update/_reqs/)
- `delete` - Remove container from work_module (see delete/_reqs/)

**Work module pattern:**

All CRUD operations target the work_module. Resources from parent types (via overlay) are read-only until lifted.

```
Overlay resolution:  type chain → work_module (writable)
Create:              establishes index.json in work_module
Lift:                copies overlay resource to work_module
Update:              modifies work_module resources
Delete:              removes from work_module (preserves _reqs/)
```

## Self-eval

- [ ] Methods create, lift, update, delete present with index.js
- [ ] Extends spl/introspection
- [ ] Methods operate on work_module

## Roadmap

### set method

Targeted property modification via facet/key mapping.

**Invocation:**
```bash
spl spl/foo/set --keyValues='{"container": {"extends": "spl/bar"}}'
```

**Input:**
- `--keyValues` - JSON structure where first key maps to facet file

**Facet mapping:**
- `container` → `index.json`
- `lib` → `_lib/index.json`
- `reqs` → `_reqs/index.json`
- `schemas` → `_schemas/index.json`
- etc.

**Merge behavior:**
- Object keys: deep merge (preserves unmentioned keys)
- Scalar values: replace
- Array values: replace (atomic)
- `null` value: delete key

**Example:**
```json
{
  "container": { "extends": "spl/crud", "api": ["create", "lift"] },
  "lib": { "purpose": "Updated purpose" }
}
```

Would:
1. Read `index.json`, merge extends and api, write back
2. Read `_lib/index.json`, merge purpose, write back

**Future array operations (if needed):**
```json
{
  "container": {
    "api": ["create", "lift"],    // replace
    "api+": ["update"],           // append
    "api-": ["delete"]            // remove items
  }
}
```

Key suffix syntax for array mutations. Not in MVP - start simple, extend when real need emerges.

## Comments

spl/crud separates lifecycle operations from structural constraints. This allows types that need CRUD without container structure (future use cases).

**Referenced reqs:**
- spl_introspection_type_v1.0.0.md
- create/_reqs/ (method-specific)
- lift/_reqs/ (method-specific)
- update/_reqs/ (method-specific)
- delete/_reqs/ (method-specific)
