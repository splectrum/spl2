# api

Module_node within a package. Groups related methods under a common namespace.

**Extends:** module_node

## Purpose

Organize methods by domain or functionality within a package.

Contains methods, nested APIs, internal folders, and auxiliary files.

## State

APIs introduce state management. The api.state schema defines API-level state that persists across method invocations.

## Invocation

Returns API overview (method inventory, signatures).

Inherits default from module_node unless overridden.

## Examples

- `spl/dev/` - development environment API
- `spl/runtime/` - runtime management API

---

**Version:** 1.0.0
