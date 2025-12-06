**Type:** plain req
**Version:** 1.0.0

# reqs_type

## Spec

The `_reqs` folder is an internal container folder holding requirements for a container.

**Structure:**
- Folder name: `_reqs` (underscore prefix = internal)
- Task entrypoint: `reqs.json`
- No README.md/README.json (internal folder)

**Req file structure:**
- Each req is a separate markdown file
- Naming: `<name>_v<semver>.md` (e.g., `container_type_v1.0.0.md`)
- Type reqs define structural contracts
- Instance reqs define content constraints

**Type vs instance reqs:**
- Type reqs: `<name>_type_v<semver>.md` - what something IS (structural)
- Instance reqs: `<name>_instance_v<semver>.md` - what something CONTAINS (content)

**reqs.json entrypoint:**
- Lists available reqs (type and instance)
- Provides entry for req validation tasks

## Self-eval

- [ ] Folder named `_reqs` with underscore prefix
- [ ] Contains `reqs.json` task entrypoint
- [ ] No README.md or README.json present
- [ ] Req files follow naming convention `<name>_v<semver>.md`
- [ ] Type reqs use `_type_` suffix
- [ ] Instance reqs use `_instance_` suffix
- [ ] reqs.json lists available reqs

## Comments

Internal folders use underscore prefix to distinguish from visible (navigable) folders. The task entrypoint (`reqs.json`) enables direct execution without spidering through README.

The type/instance suffix pattern separates structural contracts from content constraints. Both may exist for the same subject (e.g., `schemas_type_v1.0.0.md` and `schemas_instance_v1.0.0.md`).
