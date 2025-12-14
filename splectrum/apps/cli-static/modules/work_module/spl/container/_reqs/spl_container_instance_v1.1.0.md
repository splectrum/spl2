**Type:** plain req
**Version:** 1.1.0
**Supersedes:** spl_container_instance_v1.0.0

# spl_container_instance

## Spec

The spl/container API - methods available on all containers.

**API:**

| Facet | Methods | Purpose |
|-------|---------|---------|
| introspection | whoami, selfeval | Container identity and validation |
| lifecycle | create, lift, update, delete | Container CRUD operations |

**Methods:**

- `whoami` - Container introspection, shows identity, api, handler, reqs, lib, schemas
- `selfeval` - Validate container against requirements using runners
- `create` - Create container in work_module by establishing identity (index.json)
- `lift` - Materialize resources from overlay into work_module for editing
- `update` - Update container (schema inheritance merge, drift fix)
- `delete` - Remove container from work_module (preserves _reqs/)

**Global flags (base input schema):**

All containers inherit these flags from spl/container input.avsc:

- `--dryRun` - Preview only, no action taken
- `--silent` - Omit narrative, data only
- `--help` / `-h` - Show usage information (rewrites to whoami --usage)

**Method-specific flags:**

Methods define their own flags in `_schemas/input.avsc`. For example whoami has:
- `--meta` - Freetext output level
- `--report` - Structured output level
- `--facet` - Facet filter
- `--levels` - Depth level for type inheritance
- `--usage` - Show input schema as usage

**Type inheritance:**
- Methods inherit down the type chain
- Each level can define its own _selfevals/ runners
- `--levels` traverses type stack: instance chain first, then type chain

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] API facets documented in index.json
- [ ] Methods whoami, selfeval, create, lift, update, delete present

## Comments

This is the base API - all container types inherit these methods.

Methods use `module.output(freetext, structured)` pattern for output.
Libs use `create(module)` pattern returning object with exports.
Runners are libs with a `run(containerFsPath)` export.
