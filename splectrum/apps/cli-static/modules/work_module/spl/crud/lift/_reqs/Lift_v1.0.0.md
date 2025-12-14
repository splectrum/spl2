# Lift Method Requirement

**Version:** 1.0.0
**Container:** spl/container/lift
**Type:** Method

## Purpose

Materialize resources from overlay into work_module, making them editable.

## Why Lift Exists

The overlay resolves resources through multiple layers:
1. App modules (work_module first)
2. Splectrum modules (bm_spl, etc.)
3. Type inheritance chain (extends/instantiates)

When you want to edit a resource (e.g., `index.js`) for a container:
- The overlay knows which resource applies (may be inherited from type)
- You don't know where it physically lives
- `lift` finds it via overlay and copies to work_module

Without lift, you'd have to manually trace the type chain and layer hierarchy.

## Invocation

```bash
# Single resource - for editing
spl spl/container/test/lift --resource=index.js

# All resources - for standalone/portable container (future)
spl spl/container/test/lift --all
```

## Flags

| Flag | Description |
|------|-------------|
| `--resource=<name>` | Single resource to lift (e.g., `index.js`, `_lib/foo.js`) |
| `--all` | Lift all resources (future - creates standalone container) |
| `--dryRun` | Show what would be lifted without doing it |

## Behavior

### Single Resource (`--resource`)

1. Container must exist in work_module (has index.json)
2. Resolve resource through overlay
3. If resource already exists locally → report exists, no action
4. Copy resource to work_module location
5. Resource now editable via standard tools

### All Resources (`--all`) - Future

1. Enumerate all resources overlay resolves for container
2. Copy each to work_module (skip if already exists locally)
3. Result: standalone container, no longer depends on overlay

## Constraints

- Container must exist (call create first)
- Additive only - existing resources preserved
- To reset a resource: delete it locally, then lift again

## Output

Structured output includes:
- `status`: 'lifted', 'exists', 'not_found', 'dry_run'
- `resource`: the resource name
- `sourcePath`: where it was found
- `targetPath`: where it was copied
