# module

**Type:** plain req
**Extends:** projects/08-dev-environment-api/module_v1.0.0.md
**Version:** 1.1.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Collection of Splectrum code packages.

A module bundles packages together as a deployable/portable unit. It's the distribution boundary - what gets installed, overlaid, or handed off.

### Character

- Collection: contains packages
- Portable: can be moved, installed, overlaid
- Self-contained: everything needed is inside
- Layerable: modules overlay each other

### Types

Different module types serve different purposes:
- **base module**: foundational runtime packages
- **work module**: implementation packages being developed
- **patch module**: targeted fixes overlaying base/work

### Relationship

```
module
  └── package (managed collection)
        └── API (managed unit)
              └── method (handler)
```

## Self-eval

- [ ] Description conveys collection meaning
- [ ] Portability/distribution aspect clear
- [ ] No implementation details in description

## Comments

The module is the unit of deployment/handoff. When you "install a module" or "overlay a module", you're working with a package collection as a unit.

### Examples

| Module | Contains |
|--------|----------|
| work_module | spl package, user packages |
| base_module | core runtime packages |
