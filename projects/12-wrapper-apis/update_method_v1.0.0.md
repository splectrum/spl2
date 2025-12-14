**Type:** plain req
**Version:** 1.0.0

# update_method

## Spec

Update method for spl/container lifecycle. Performs maintenance operations on a container.

**Invocation:** `spl <container>/update`

**Purpose:** Idempotent maintenance - run anytime to fix drift and sync inherited resources.

**Operations:**

1. **Schema inheritance merge** - Propagate parent schema fields to derived schemas
   - Reads parent input.avsc from type chain
   - Merges parent fields into child input.avsc
   - Preserves child-specific fields
   - Reports drift if child diverged from parent

**Flags:**

- `--dryRun` - Preview changes without applying
- `--silent` - Omit narrative output

**Output:**

- Lists operations performed
- Reports drift detected and fixed
- No-op if already in sync

**Idempotent:** Safe to run repeatedly. If container is already in sync, reports "up to date".

## Self-eval

- [ ] Method present at spl/container/update
- [ ] Handles --dryRun flag
- [ ] Merges parent schema fields into child
- [ ] Reports drift detection
- [ ] Idempotent - no changes when already in sync

## Comments

Part of the lifecycle facet alongside create, lift, delete.

Schema merge direction: base → derived (parent fields propagate down).
