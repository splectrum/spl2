**Type:** plain req
**Version:** 1.0.0

# spl_crud_instance

## Spec

The spl/crud API - lifecycle methods available on containers that extend this type.

**API:**

| Method | Purpose |
|--------|---------|
| create | Establish new container identity |
| lift | Materialize overlay resources for editing |
| update | Apply drift fixes and schema inheritance |
| delete | Remove container from work_module |

**Methods:**

### create

Establishes a new container by creating index.json in work_module.

**Behavior:**
- Validates parent allows this child (via instanceChildren or api.types)
- Creates directory structure if needed
- Writes index.json with name, instantiates, extends
- Does not create other files (lift for that)

**Flags:**
- `--name` - Container path to create (derived from invocation if not specified)

**Output:**
- Status: created, exists, error
- Created index.json content

### lift

Materializes overlay resources into work_module for editing.

**Behavior:**
- Resolves resource through overlay (type chain)
- Copies to work_module at same relative path
- Preserves original content

**Flags:**
- `--resource` - Resource path to lift (e.g., index.js, _lib/helper.js)

**Output:**
- Status: lifted, already_local, not_found
- Source and destination paths

### update

Applies fixes to container: drift correction, schema inheritance merge.

**Behavior:**
- Checks for drift between manifest and filesystem
- Merges parent schemas into child schemas (inheritance)
- Updates manifests to match reality

**Flags:**
- `--dryRun` - Preview changes without applying

**Output:**
- Status: updated, no_changes, error
- List of changes made or to be made

### delete

Removes container from work_module.

**Behavior:**
- Removes container directory and contents
- Preserves _reqs/ folder (requirements are documentation)
- Does not affect parent types or overlay

**Flags:**
- `--force` - Skip confirmation
- `--keepReqs` - Preserve _reqs/ (default: true)

**Output:**
- Status: deleted, not_found, error
- List of removed files

## Self-eval

- [ ] Methods create, lift, update, delete callable
- [ ] create establishes valid index.json
- [ ] lift copies from overlay to work_module
- [ ] update fixes drift and merges schemas
- [ ] delete removes container preserving _reqs/

## Comments

These methods inherit to all containers via the type chain. spl/container extends spl/crud, so all containers have lifecycle operations.

Inherits introspection methods (whoami, selfeval) from spl/introspection.
