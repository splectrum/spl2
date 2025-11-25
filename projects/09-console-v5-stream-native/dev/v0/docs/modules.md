**Type:** plain req

# modules

## Spec

Reserved folder within env context for **module** layer management.

Structure:
```
modules/
├── base/                    # install module
├── my-feature-work/         # work module
├── bugfix-123/              # patch module
└── _index.json              # layer order (mutable entry point)
```

Each subfolder (base/, my-feature-work/, etc.) is a **module**.

**_index.json format:**
```json
{
  "layers": [
    { "name": "base", "type": "install" },
    { "name": "my-feature-work", "type": "work" },
    { "name": "bugfix-123", "type": "patch" }
  ]
}
```

**Behavior:**
- **Module** folders are named for their purpose (base, feature-name, bugfix-id)
- Layer order is explicit in _index.json
- Later layers shadow earlier ones (path resolution priority)
- Multiple **module**s can be in progress simultaneously

Scope: Env.

Purpose: Manage multiple modules with explicit layering in dev/runtime environments.

## Self-eval

- [ ] Lives within env context
- [ ] Contains named **module** folders
- [ ] Has _index.json with layer order
- [ ] Layer priority is explicit
- [ ] Path resolution uses layer order

## Comments

Reserved folder name - only used within env context (dev-env, runtime-env).
Each subfolder is a **module** (install module, work module, patch module).

---

**Version:** 1.0.0
