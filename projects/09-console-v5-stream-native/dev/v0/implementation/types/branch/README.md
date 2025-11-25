# branch

Non-leaf module_node. Can contain child nodes and accept batch operations.

**Extends:** module_node

## Purpose

Intermediate type for nodes that can have children. Adds batch capability to input.

## Batch

Branch nodes accept a `batch` argument - array of invocations to execute within scope.

## Derived Types

- module_root (extends branch)
- package (extends branch)
- api (extends branch)

---

**Version:** 1.0.0
