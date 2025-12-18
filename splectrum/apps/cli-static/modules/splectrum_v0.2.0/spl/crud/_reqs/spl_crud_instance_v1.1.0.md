**Type:** plain req
**Version:** 1.1.0

# spl_crud_instance

## Spec

The spl/crud API - lifecycle methods available on containers that extend this type.

**API:**

| Method | Purpose |
|--------|---------|
| create | Establish new container identity or resource |
| lift | Materialize overlay resources for editing |
| read | Read resource from work_module |
| write | Write to existing resource in work_module |
| update | Apply drift fixes and schema inheritance |
| delete | Remove container from work_module |

**Methods:**

### create

Establishes a new container by creating index.json in work_module, or creates a new resource file.

**Behavior:**
- Container: Validates parent allows this child (via instanceChildren or api.types)
- Container: Creates directory structure if needed
- Container: Writes index.json with name, instantiates, extends
- Resource: Creates empty file at specified path (--resource flag)
- Resource: Validates path starts with _lib/, _schemas/, or _reqs/

**Flags:**
- `--name` - Container path to create (derived from invocation if not specified)
- `--resource` - Resource file to create (e.g., _lib/wrapper.js)

**Output:**
- Status: created, exists, error
- Created content path

### lift

Materializes overlay resources into work_module for editing.

**Behavior:**
- Resolves resource through overlay (type chain)
- Copies to work_module at same relative path
- Returns file contents for immediate use

**Flags:**
- `--resource` - Resource path to lift (e.g., index.js, _lib/helper.js)

**Output:**
- Status: lifted, already_local, not_found
- Source and destination paths
- File contents

### read

Reads a resource from work_module physical folder.

**Behavior:**
- Reads from work_module only (not overlay)
- Supports wildcards in resource path (e.g., `_reqs/foo_v*.md`)
- Single match: returns file contents and resolved filename
- Multiple matches: returns list of matching filenames
- No match: returns not_found

**Flags:**
- `--resource` - Resource path to read, supports wildcards (e.g., `_reqs/spl_crud_instance_v*.md`)

**Output:**
- Status: ok, multiple, not_found, error
- `file` - Resolved filename (single match)
- `contents` - File contents (single match)
- `files` - List of matching filenames (multiple matches)

### write

Writes to an existing resource in work_module.

**Behavior:**
- Writes to work_module only
- File must already exist (use create for new files)
- Overwrites entire file contents

**Flags:**
- `--resource` - Resource path to write (e.g., index.js, _lib/helper.js)
- `--content` - Content to write (or stdin)

**Output:**
- Status: ok, not_found, error
- File path

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

- [ ] Methods create, lift, read, write, update, delete callable
- [ ] create establishes valid index.json or resource file
- [ ] lift copies from overlay to work_module, returns contents
- [ ] read returns contents from work_module
- [ ] write updates existing file in work_module
- [ ] update fixes drift and merges schemas
- [ ] delete removes container preserving _reqs/

## Comments

These methods inherit to all containers via the type chain. spl/container extends spl/crud, so all containers have lifecycle operations.

Inherits introspection methods (whoami, selfeval) from spl/introspection.

All crud methods operate on work_module physical folder but may resolve through overlay stack.
