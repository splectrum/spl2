**Type:** plain req
**Version:** 1.0.0
**Extends:** spl_container_type_v1.0.0

# spl_module_type

## Spec

Module is a container type representing a standalone work unit.

**Extends spl/container with:**

**Structural constraints:**
- Parent must be modules container (implement spl/modules)
- Children must be package containers (implement spl/package)

**Module-level concerns:**
- Standalone mycelium (self-contained)
- All dependencies copied in (portable)
- Work unit boundary

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Parent is modules container
- [ ] Children are package containers
- [ ] README.json has type "module"

## Comments

Module is the work unit - portable, self-contained, with all dependencies. The hierarchy: modules → module → package → api → method.
