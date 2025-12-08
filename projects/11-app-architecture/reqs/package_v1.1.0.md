# package

**Type:** plain req
**Extends:** projects/06-glossary-term-requirements/reqs/package_v1.0.0.md
**Version:** 1.1.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Namespace container; groups related APIs.

A package is a boundary - everything inside belongs together, has shared identity. When you see a package name, you're seeing an independent API surface with its own coherent purpose.

Think of it as "the thing you import" or "the thing you reference as a unit". The package name is the first segment of any API path.

### Character

- Boundary: defines what's in and what's out
- Identity: gives a name to a coherent set of functionality
- Independence: each package stands on its own

### Relationship to API

A package contains APIs. The package is the "who", the APIs are the "what capabilities".

`spl` (package) contains `spl/runtime` (API), `spl/container` (API), etc.

## Self-eval

- [ ] Description conveys namespace/grouping meaning
- [ ] Boundary concept clear
- [ ] Independence conveyed
- [ ] No implementation details in description

## Comments

The word "package" is common across programming (npm package, Python package, Java package). Splectrum meaning aligns - it's the distribution/reference unit.

### Examples

| Package | Purpose |
|---------|---------|
| spl | Core Splectrum infrastructure |
| pr03 | Project 03 test package |
| myApp | User application package |

`spl/runtime/status` = package `spl`, API `runtime`, method `status`

The package name anchors the path.
