**Type:** plain req
**Extends:** module_node

# module_root

## Spec

Root node of a module bundle. Entry point for module-level operations.

Every module bundle has a module_root as its top-level node. Contains the package(s) and module-level configuration.

**Structure:**
- Module-level README.md, README.json
- Contains one or more packages
- May have module-level _schemas/, _tests/

Scope: Module bundle root.

Purpose: Entry point for module-level invocation, metadata, and configuration.

## Self-eval

- [ ] Is root folder of module bundle
- [ ] Contains at least one package

## Files

Reference implementation: `dev/v0/modules/types/module_root/`

## Comments

Inherits from module_node. Can be invoked to return module metadata.

---

**Version:** 1.0.0
