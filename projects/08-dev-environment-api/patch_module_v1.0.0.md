**Type:** plain req
**Extends:** module

# patch module

## Spec

**Module** type for targeted fixes and modifications. Partial API unit overlaying on **base module** or **work module**.

Characteristics:
- Layer 2+ (overlays base/work)
- Partial API unit (only patched parts)
- Surgical changes (specific methods/files)
- Named for issue (bugfix-123, hotfix-auth)
- Shadows only affected paths

Structure follows **module** pattern:
```
bugfix-123/                  # patch module
├── _reqs/
│   ├── MODULE.md
│   └── patch_module_v1.0.0.md
├── _meta/                   # state tracking
│   ├── status.json
│   └── patch-info.json      # what's patched
├── spl/dev/create/          # only patched method
│   └── index.js             # fixed implementation
└── ...                      # only affected files
```

**Contrast with base module:**
- Base: complete API units
- Patch: partial API unit (just what's changed)

Location: `modules/{patch-name}/` in env

Scope: Module type.

Purpose: Apply targeted fixes/modifications without full module replacement.

## Self-eval

- [ ] Extends **module**
- [ ] Layer 2+ (overlays base/work)
- [ ] Partial API unit
- [ ] Only contains changed parts
- [ ] Named for issue/purpose
- [ ] Documents what's patched

## Comments

Patch modules enable on-the-fly fixes without replacing complete modules. Multiple patches can stack in layer order.
