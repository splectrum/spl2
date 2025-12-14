**Type:** plain req
**Version:** 1.0.0

# spl_container_instance

## Spec

The spl/container API - methods available on all containers.

**API:**

| Facet | Methods | Purpose |
|-------|---------|---------|
| introspection | whoami, selfeval | Container identity and validation |
| lifecycle | create, delete | Container CRUD operations |

**Methods:**

- `whoami` - Container introspection, shows identity, api, handler, reqs, lib, schemas
- `selfeval` - Validate container against requirements using runners
- `create` - Create new container (stub)
- `delete` - Delete container (stub)

**Flags (common to all methods):**
- `--meta=topline|summary|detail|enriched|report` - output verbosity
- `--report` - include structured JSON in output
- `--levels` - show available type inheritance levels
- `--levels=all` - run on all levels
- `--levels=<type>` - run on specific level

**Type inheritance:**
- Methods inherit down the type chain
- Each level can define its own _selfevals/ runners
- `--levels` traverses type stack: instance chain first, then type chain

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] API facets documented in index.json
- [ ] Methods whoami, selfeval, create, delete present

## Comments

This is the base API - all container types inherit these methods.

Methods use `module.output(freetext, structured)` pattern for output.
Libs use `create(module)` pattern returning object with exports.
Runners are libs with a `run(containerFsPath)` export.
