**Type:** plain req
**Version:** 1.0.0
**Extends:** spl_container_type_v1.0.0

# spl_modules_type

## Spec

Modules is a container type representing the modules spot - root container for all modules.

**Extends spl/container with:**

**Structural constraints:**
- Root level (no parent constraint)
- Children must be module containers (implement spl/module)

**Modules-level concerns:**
- The modules spot
- Registry of available modules
- Entry point for module discovery

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Children are module containers
- [ ] README.json has type "modules"

## Comments

Modules is the spot - the root of the module hierarchy. The full path: modules → module → package → api → method.
