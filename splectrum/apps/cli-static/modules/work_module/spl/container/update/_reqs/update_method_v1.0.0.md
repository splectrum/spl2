**Type:** plain req
**Version:** 1.0.0

# update_method

## Spec

Update method for spl/container lifecycle. Performs maintenance operations on a container.

**Invocation:** `spl <container>/update`

**Purpose:** Idempotent maintenance - run anytime to fix drift and sync inherited resources.

**Operations:**

1. **Container facet fix** - Fix index.json to match container.avsc schema
   - Reads container.avsc to get allowed fields and defaults
   - Removes extra fields not in schema
   - Adds missing required fields with schema defaults
   - Preserves valid existing fields

2. **Schema inheritance merge** - Propagate parent schema fields to derived schemas
   - Reads parent input.avsc from type chain
   - Merges parent fields into child input.avsc (name, type, default, doc)
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
- [ ] Fixes container facet (index.json) per container.avsc
- [ ] Merges parent schema fields into child schemas
- [ ] Reports changes made
- [ ] Idempotent - no changes when already in sync

## Comments

Part of the lifecycle facet alongside create, lift, delete.

Schema merge direction: base → derived (parent fields propagate down).
