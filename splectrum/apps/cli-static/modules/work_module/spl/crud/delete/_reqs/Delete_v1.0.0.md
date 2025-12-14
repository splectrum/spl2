# Delete Method Requirement

**Version:** 1.0.0
**Container:** spl/container/delete
**Type:** Method

## Purpose

Remove container from work_module, dematerializing its local resources.

## Why Delete Exists

Delete removes a container's local presence in work_module. After deletion:
- Local resources are gone (except _reqs which are immutable)
- Overlay resolution continues to parent layers (unless stop marker exists - future)

This enables:
- Clean removal of local customizations
- Reset to inherited behavior
- Container lifecycle management

## Invocation

```bash
# Delete container from work_module
spl spl/container/test/delete

# Preview what would be deleted
spl spl/container/test/delete --dryRun
```

## Flags

| Flag | Description |
|------|-------------|
| `--dryRun` | Show what would be deleted without doing it |

## Behavior

1. Locate container in work_module
2. Remove all files and folders EXCEPT `_reqs/` (immutables preserved)
3. If folder becomes empty, remove folder too
4. If `_reqs/` exists, folder stays with just reqs

## Preserved Resources

The `_reqs/` folder is never deleted:
- Requirements are immutable artifacts
- They document decisions even after implementation is removed
- Enables audit trail and re-creation

## Output

Structured output includes:
- `status`: 'deleted', 'not_found', 'dry_run'
- `removed`: list of deleted items
- `preserved`: list of preserved items (typically just '_reqs')
- `folderRemoved`: whether container folder was removed

## Constraints

- Container must exist in work_module (reports "not_found" otherwise)
- Only affects work_module layer (other module layers untouched)
- Respects appAPI context for work_module location

## Future: Overlay Stop Marker

Design note: A future enhancement may add an overlay stop marker mechanism. When present, this would tell overlay resolution to stop at work_module rather than continuing to search parent layers. This enables "fresh scaffold" patterns where delete + create produces a clean container without inheriting from other layers.

Current implementation: Simple removal without stop marker.
