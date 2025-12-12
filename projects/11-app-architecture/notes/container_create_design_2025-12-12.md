# Container Lifecycle Design

**Date:** 2025-12-12

## Overview

Container lifecycle methods on `spl/container`:
- **create** - establish container identity in work_module
- **lift** - materialize files from overlay for editing
- **delete** - remove from work_module (overlay directive)

## API Structure

```json
"api": {
  "introspection": ["whoami", "selfeval"],
  "lifecycle": ["create", "lift", "delete"]
}
```

---

## Create

### Invocation

```bash
spl spl/container/test/create
```

Creates on a **virtual container** - a path that doesn't exist yet but is resolvable via the type system.

### What Create Does

Minimal establishment of container identity:
1. Create folder in work_module
2. Create `index.json` with name, type, purpose, instantiates

That's it. The overlay provides everything else (handler, libs, schemas inherit from type).

### Prerequisites

1. **Parent must expect this child** - listed in parent's `api` field
2. **Type must be determinable** - via parent's instance type → instanceChildren

### Type Resolution Chain

```
spl/container/test (virtual)
  → parent: spl/container
  → parent's instantiates: spl/api
  → spl/api's instanceChildren: spl/method
  → test will instantiate spl/method
```

### Algorithm

```
create(targetPath):
  1. Parse targetPath → parentPath + childName
  2. Resolve parent's index.json
  3. Validate childName is in parent's api (flatten all facet lists)
  4. Get parent's instantiates → get that type's instanceChildren
  5. Determine work_module fs path for target
  6. Create folder
  7. Create index.json:
     {
       "name": targetPath,
       "type": "<instanceChildren type name>",
       "purpose": "<to be defined>",
       "instantiates": "<instanceChildren>"
     }
  8. Return summary
```

### Idempotent

- If container already exists in work_module → no-op
- Safe to run multiple times

### dryRun Mode

```bash
spl spl/container/test/create --dryRun
```

Shows what would be created without doing it.

---

## Lift

### Why Lift Exists

The overlay resolves files through multiple layers:
1. App modules (work_module first)
2. Splectrum modules (bm_spl, etc.)
3. Type inheritance chain (extends/instantiates)

When you want to edit `index.js` for `spl/container/test`:
- The overlay knows which `index.js` applies (maybe inherited from `spl/method` type)
- You don't know (or shouldn't need to know) where it physically lives
- `lift` finds it via overlay and copies to work_module

Without lift, you'd have to manually trace the type chain and layer hierarchy. Lift encapsulates that complexity.

### Invocation

```bash
# Single resource - for editing
spl spl/container/test/lift --resource=index.js

# All resources - for standalone/portable container
spl spl/container/test/lift --all
```

### Two Use Cases

**lift --resource=index.js** (single resource)
- Pulls one resource for editing
- Container still depends on overlay for everything else
- Use case: local development, modifying specific behavior

**lift --all** (standalone container)
- Materializes ALL resources into work_module
- Container becomes **self-contained**
- No longer relies on type chain or other modules
- Use case: portability, distribution, moving to different module stack

### What Lift Does

Materializes resources from overlay into work_module, making them editable.

Note: "resource" rather than "file" - currently these are files, but the abstraction allows for other storage (Kafka topics, databases, etc.) in the future.

Once lifted, the resource is local to work_module and can be modified using standard tools (Edit, Write). The overlay no longer provides that resource - work_module's version takes precedence.

### Workflow

1. `create` - container exists (identity only)
2. `lift --resource=index.js` - resource now in work_module
3. Edit/Write - make changes directly
4. `selfeval` - verify

### Algorithm

```
lift(containerPath, options):
  1. Resolve container in work_module (must exist)
  2. If --resource specified:
     - Resolve resource through overlay
     - Copy to work_module location
  3. If --all specified:
     - Enumerate all resources overlay resolves for container
     - Copy each to work_module (skip if already exists locally)
  4. Return summary of lifted resources
```

### Additive Only

- Existing resources in work_module are preserved
- Lift only adds missing resources
- To reset a resource: delete it locally, then lift again

---

## Delete

### Invocation

```bash
spl spl/container/test/delete
```

### What Delete Does

Two effects:
1. Removes container from work_module (files deleted)
2. Acts as **overlay directive** - tells overlay to stop at work_module

### Overlay Directive Behavior

After delete, overlay resolution for this path stops at work_module (finds nothing) rather than continuing to search other layers.

This enables "fresh scaffold" pattern:
1. `spl spl/container/test/delete` - removes and blocks overlay
2. `spl spl/container/test/create` - creates fresh (no copy from other layers)

### Algorithm

```
delete(containerPath):
  1. Resolve container in work_module
  2. Remove folder and contents
  3. Create overlay stop marker (mechanism TBD)
  4. Return summary
```

---

## Key Principles

### Minimal Create

Create only establishes identity. The overlay provides:
- Handler (index.js) - inherited from type
- Libs (_lib/) - inherited from type
- Schemas (_schemas/) - inherited from type

Files only exist in work_module when they need to diverge.

### Lift Enables Editing

Lift is the entry point for modification. Once a file is lifted:
- It's in work_module
- Standard Edit/Write tools can modify it
- Overlay no longer provides that file for this container

### Single-Level Operations

All operations are single-level:
- create one container
- lift files for one container
- delete one container

Recursion is explicit - call on each child separately.

### Separation of Concerns

- **create/lift/delete** - structural (files exist, location)
- **selfeval** - semantic (files are correct/complete)
- **Edit/Write** - content modification

---

## Open Questions

- Delete overlay stop marker mechanism - how to signal "stop here"?
- Purpose field in create - prompt user or generate from context?
- Validation: should create fail if parent doesn't list child, or warn?
