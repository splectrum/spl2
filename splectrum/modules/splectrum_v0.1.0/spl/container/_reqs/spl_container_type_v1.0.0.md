**Type:** plain req
**Version:** 1.0.0

# spl_container_type

## Spec

Container is the universal structural unit in SPL2. Every node in the hierarchy is a container.

**Structure:**

A container consists of:

**Identity:**
- `index.json` - container identity: name, type, purpose, extends, instantiates, instanceChildren, api
- `index.js` - handler implementation (optional)

**Internal folders (underscore prefix):**
- `_lib/` - shared code with index.json manifest (see lib_type_v1.0.0)
- `_reqs/` - requirements with index.json manifest (see reqs_type_v1.0.0)
- `_schemas/` - AVRO schemas with index.json manifest (see schemas_type_v1.0.0)
- `_selfevals/` - self-evaluation runners with index.json manifest (see selfevals_type_v1.0.0)
- `_tests/` - test collections (see tests_type_v1.0.0)

**Method folders (no underscore):**
- Each method is a container with `index.js` entry point
- Methods listed in `index.json` api field

**Type inheritance:**
- `extends` - inherit from another type (type chain)
- `instantiates` - instance relationship (instance chain)
- `instanceChildren` - type of child containers for instances of this type
- Type stack built from: instance chain first, then type chain, deduped

**Global flags:**
- `--help` / `-h` - available on all containers
- Entry point rewrites `<container> --help` to `<container>/whoami --usage`
- Shows input schema as usage information

**Type definition requirements:**
- A type should define `instanceChildren` in index.json
- A type should configure the generic children selfeval instance runner to validate children

**Final resources (cannot overlap across type chain):**
- `_reqs/*.md`
- `_lib/*.js`
- `_tests/*.js`

**Non-final (each level has its own):**
- `index.json`
- `_schemas/*.avsc`
- `_selfevals/`

**Self-similar pattern:**
- Every level has the same structural scaffolding
- Container contains containers
- Type hierarchy: spl/container → spl/modules, spl/module, spl/package, spl/method

## Self-eval

- [ ] index.json present with name, type, purpose
- [ ] If extends set, parent type exists
- [ ] If instantiates set, instance type exists
- [ ] Internal folders use underscore prefix
- [ ] Method folders have index.js entry point

## Comments

Container is the base type. All other container types extend spl/container.

**Referenced reqs:**
- lib_type_v1.0.0.md, lib_instance_v1.0.0.md
- reqs_type_v1.0.0.md, reqs_instance_v1.0.0.md
- schemas_type_v1.0.0.md, schemas_instance_v1.0.0.md
- selfevals_type_v1.0.0.md, selfevals_instance_v1.0.0.md
- tests_type_v1.0.0.md, tests_instance_v1.0.0.md
