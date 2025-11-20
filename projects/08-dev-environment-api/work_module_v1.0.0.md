**Type:** plain req
**Extends:** module

# work module

## Spec

**Module** type for implementation work. Specialized module overlaying on **base module**.

Characteristics:
- Layer 1+ (overlays base)
- Contains work package for implementation
- Includes _meta/ for state tracking
- Named for purpose (feature-name, task-id)
- Shadows base module paths as needed

Structure follows **module** pattern:
```
my-feature/                  # work module
├── _reqs/
│   ├── MODULE.md
│   └── work_module_v1.0.0.md
├── _meta/                   # state tracking
│   ├── status.json
│   ├── cycle-log.json
│   └── fluency.json
├── spl/dev/create/          # work package
│   ├── _reqs/
│   ├── index.js
│   └── tests/
└── ...
```

Location: `modules/{work-name}/` in env

Scope: Module type.

Purpose: Contain implementation work with state tracking and overlay behavior.

## Self-eval

- [ ] Extends **module**
- [ ] Layer 1+ (overlays base)
- [ ] Named for purpose
- [ ] Contains _meta/ for state
- [ ] Implements work package

## Comments

Multiple work modules can exist simultaneously. Layer order in modules/_index.json determines priority.
