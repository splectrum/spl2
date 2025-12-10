**Type:** plain req
**Version:** 1.0.0
**Extends:** spl_container_type_v1.0.0
**Instantiates:** spl_api_v1.0.0

# spl_modules_type

## Spec

Modules is a container type representing the modules spot - root container for all modules.

**Extends spl/container with:**

**Structural constraints:**
- Root level (no parent constraint)
- Contains `hierarchy.json` at spot level
- Children must be module containers (implement spl/module)

**hierarchy.json structure:**
```json
{
  "layers": [
    { "name": "work_module", "type": "work_module" }
  ]
}
```

**Fields:**
- `layers` - ordered list of module layers
- Each layer has `name` (folder name) and `type` (module type)

**Modules-level concerns:**
- The modules spot
- Registry of available modules via hierarchy.json
- Entry point for module discovery

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Contains hierarchy.json with layers array
- [ ] Children are module containers
- [ ] Each child folder listed in hierarchy.json layers

## Comments

Modules is the spot - the root of the module hierarchy. The full path: modules → module → package → api → method.
