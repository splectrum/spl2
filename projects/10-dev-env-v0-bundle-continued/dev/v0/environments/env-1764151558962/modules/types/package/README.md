# package

Top-level module_node in SPL2 hierarchy. Root of an API tree.

**Extends:** module_node

## Purpose

Namespace separation for API organization. Each package is an independent API surface.

Contains APIs, methods, internal folders, and auxiliary files.

## Naming

Lowercase, descriptive of domain.

Pattern `prXX` reserved for project evaluation packages.

## Invocation

Returns package metadata (API inventory, version info).

Inherits default from module_node unless overridden.

## Examples

- `spl/` - core Splectrum infrastructure
- `pr09/` - Project 09 evaluation package

---

**Version:** 1.1.0
