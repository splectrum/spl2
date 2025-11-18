**Type:** plain req
**Extends:** api_node

# api

## Spec

Api node within a package. Groups related methods under a common namespace.

Contains methods, child apis, internal folders, and auxiliary files. Cannot be invoked directly - serves as organizational unit.

Naming: lowercase, descriptive of functionality.

Purpose: Logical grouping of related operations within a package.

## Self-eval

- [ ] Child of package or another api
- [ ] Contains at least one method or child api
- [ ] Not directly invokable
- [ ] Name is lowercase

## Comments

Examples:
- `spl/runtime/` - runtime context management api
- `spl/execution/` - execution context management api
- `pr03/hello/` - hello world demonstration api
