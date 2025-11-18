**Type:** plain req
**Extends:** api_node

# package

## Spec

Top-level api node in SPL2 hierarchy. Root of an API tree.

Contains APIs, internal folders, and auxiliary files. Cannot be invoked directly - serves as namespace container.

Naming: lowercase, descriptive of domain. Pattern `prXX` for project evaluation packages.

Purpose: Namespace separation for API organization. Each package is an independent API surface.

## Self-eval

- [ ] Top-level folder (no parent api node)
- [ ] Contains at least one api or method
- [ ] Not directly invokable
- [ ] Name is lowercase

## Comments

Examples:
- `spl/` - core Splectrum infrastructure package
- `pr03/` - Project 03 evaluation package
