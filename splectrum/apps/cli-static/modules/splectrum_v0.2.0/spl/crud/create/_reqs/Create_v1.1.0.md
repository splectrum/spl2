# Create Method Requirement

**Version:** 1.1.0
**Container:** spl/container/create
**Type:** Method

## Purpose

Establish container identity in work_module by creating minimal scaffolding, or create resource files within existing containers.

## Why Create Exists

Containers need identity before they can be used. Create establishes this identity with minimal footprint - just an index.json. The overlay provides everything else (handler, libs, schemas) through type inheritance.

This enables:
- Type-driven development (inherit behavior, override only what differs)
- Clean separation between identity and implementation
- Lightweight container creation

## Invocation

```bash
# Create on virtual container path (what you want to exist)
spl spl/container/test/create

# Preview what would be created
spl spl/container/test/create --dryRun

# Specify purpose
spl spl/container/test/create --purpose="Test method for validation"

# Create a resource file within an existing container
spl spl/wrapper/create --resource=_lib/wrapper.js
```

## Flags

| Flag | Description |
|------|-------------|
| `--dryRun` | Show what would be created without doing it |
| `--resource` | Create a resource file instead of a container (e.g., `_lib/wrapper.js`) |

## Prerequisites

### Container Creation
1. **Parent must expect this child** - child name must be listed in parent's `api` field
2. **Type must be determinable** - via parent's `instantiates` -> type's `instanceChildren`

### Resource Creation
1. **Container must exist** - target container must already exist
2. **Resource path must be valid** - must start with `_lib/`, `_schemas/`, or `_reqs/`

## Type Resolution Chain

```
spl/container/test (virtual)
  -> parent: spl/container
  -> parent's instantiates: spl/api
  -> spl/api's instanceChildren: spl/method
  -> test will instantiate spl/method
```

## Behavior

### Container Creation (default)
1. Parse target path into parent + child name
2. Validate child is expected by parent (in api field)
3. Resolve child's type via parent's instanceType -> instanceChildren
4. Create folder in work_module
5. Create index.json with identity fields

### Resource Creation (--resource)
1. Verify container exists
2. Validate resource path (must be _lib/, _schemas/, or _reqs/)
3. Create parent directory if needed
4. Create empty file

## Output

### Container Creation
Creates index.json with:
```json
{
  "name": "<full container path>",
  "type": "<type name from instanceChildren>",
  "purpose": "<provided or default>",
  "instantiates": "<instanceChildren path>"
}
```

### Resource Creation
Creates empty file at specified path, reports path created.

## Constraints

- Container must not already exist (reports "exists" if found)
- Parent must exist and have api field
- Parent's instance type must have instanceChildren field
- Creates in app's work_module (respects appAPI context)
- Resource files must be in _lib/, _schemas/, or _reqs/ folders

## Idempotent

Safe to call multiple times - reports "exists" without modification if container or resource already present.
