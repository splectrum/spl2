# Create Method Requirement

**Version:** 1.0.0
**Container:** spl/container/create
**Type:** Method

## Purpose

Establish container identity in work_module by creating minimal scaffolding.

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
```

## Flags

| Flag | Description |
|------|-------------|
| `--dryRun` | Show what would be created without doing it |
| `--purpose` | Purpose description for the container (optional) |

## Prerequisites

1. **Parent must expect this child** - child name must be listed in parent's `api` field
2. **Type must be determinable** - via parent's `instantiates` -> type's `instanceChildren`

## Type Resolution Chain

```
spl/container/test (virtual)
  -> parent: spl/container
  -> parent's instantiates: spl/api
  -> spl/api's instanceChildren: spl/method
  -> test will instantiate spl/method
```

## Behavior

1. Parse target path into parent + child name
2. Validate child is expected by parent (in api field)
3. Resolve child's type via parent's instanceType -> instanceChildren
4. Create folder in work_module
5. Create index.json with identity fields

## Output

Creates index.json with:
```json
{
  "name": "<full container path>",
  "type": "<type name from instanceChildren>",
  "purpose": "<provided or default>",
  "instantiates": "<instanceChildren path>"
}
```

## Constraints

- Container must not already exist (reports "exists" if found)
- Parent must exist and have api field
- Parent's instance type must have instanceChildren field
- Creates in app's work_module (respects appAPI context)

## Idempotent

Safe to call multiple times - reports "exists" without modification if container already present.
