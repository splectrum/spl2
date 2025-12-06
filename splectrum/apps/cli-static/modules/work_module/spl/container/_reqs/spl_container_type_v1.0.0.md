**Type:** plain req
**Version:** 1.0.0

# spl_container_type

## Spec

Container is the universal structural unit in SPL2. Every node in the hierarchy is a container.

**Structure:**

A container consists of:

**Visible elements (have README):**
- `README.md` - natural language documentation (see readme_type_v1.0.0)
- `README.json` - machine-readable structure (see readme_type_v1.0.0)
- `index.js` - implementation (see index_type_v1.0.0)

**Internal folders (underscore prefix, have task entrypoint):**
- `_lib/` - shared code (see lib_type_v1.0.0)
- `_reqs/` - requirements (see reqs_type_v1.0.0)
- `_schemas/` - AVRO schemas (see schemas_type_v1.0.0)
- `_selfevals/` - self-evaluations (see selfevals_type_v1.0.0)
- `_tests/` - test collections (see tests_type_v1.0.0)

**Naming conventions:**
- Visible folders: no underscore prefix, have README.md + README.json
- Internal folders: underscore prefix, have `<foldername>.json` task entrypoint (without underscore)
- Req files: `<name>_v<semver>.md`
- Type/instance suffix: `_type_` for structural, `_instance_` for content constraints
- Deduplication: additional suffix when same name used for different node types

**Self-similar pattern:**
- Every level has the same structural scaffolding
- Container contains containers
- Type hierarchy: container → package, api, method (all extend container)

**Type duality:**
- Every type has two concerns: structural contract (type) and content constraints (instance)
- Type reqs define what something IS
- Instance reqs define what something CONTAINS

**Content constraints:** None.

## Self-eval

- [ ] README.md present
- [ ] README.json present
- [ ] Internal folders use underscore prefix
- [ ] Internal folders have task entrypoint `<foldername>.json`
- [ ] Self-similar structure (containers all the way down)

## Comments

Container is the base type. Package, API, and method extend container with additional constraints.

The spider pattern: this req references the component reqs (readme, lib, reqs, schemas, selfevals, tests). Each component has its own type and instance reqs.

**Referenced reqs:**
- readme_type_v1.0.0.md, readme_instance_v1.0.0.md
- index_type_v1.0.0.md, index_instance_v1.0.0.md
- lib_type_v1.0.0.md, lib_instance_v1.0.0.md
- reqs_type_v1.0.0.md, reqs_instance_v1.0.0.md
- schemas_type_v1.0.0.md, schemas_instance_v1.0.0.md
- selfevals_type_v1.0.0.md, selfevals_instance_v1.0.0.md
- tests_type_v1.0.0.md, tests_instance_v1.0.0.md
