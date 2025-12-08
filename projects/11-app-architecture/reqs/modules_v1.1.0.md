# modules

**Type:** plain req
**Extends:** projects/08-dev-environment-api/modules_v1.0.0.md
**Version:** 1.1.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Collection of Splectrum code modules.

The modules container holds multiple modules with ordering. It's the layer management boundary - where module overlay resolution happens.

### Character

- Collection: contains modules
- Ordered: layer sequence matters
- Resolution context: where overlay logic applies

### Relationship

```
modules (collection with ordering)
  └── module (collection of packages)
        └── package (managed collection)
              └── API (managed unit)
```

The modules collection defines which module layers exist and their order.

## Self-eval

- [ ] Description conveys collection meaning
- [ ] Ordering/layering aspect implied
- [ ] No implementation details in description

## Comments

"modules" is the plural/container form of "module". Simple semantic: if module is a collection of packages, modules is a collection of those collections.

Layer order: base modules first, then work module, then patches. The modules collection captures this stack.

### Examples

A dev environment's modules:
```
modules/
  types/         (layer 0)
  base_module/   (layer 1)
  work_module/   (layer 2)
```

Each layer can override/extend the previous.
