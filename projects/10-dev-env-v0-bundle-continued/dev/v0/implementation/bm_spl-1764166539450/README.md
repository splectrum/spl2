# module_root

Root node of a module bundle. Entry point for module-level operations.

**Extends:** module_node

## Purpose

Every module bundle has a module_root as its top-level node. Provides module-level invocation, metadata, and configuration.

## Structure

Contains one or more packages. May have module-level schemas for module-wide operations.

## Invocation

Returns module metadata (package inventory, version info).

Inherits default from module_node unless overridden.

## Examples

- `spl-core/` - core module root
- `spl-dev-implementation/` - dev implementation module root

---

**Version:** 1.0.0
