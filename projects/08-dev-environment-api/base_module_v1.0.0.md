**Type:** plain req
**Extends:** module

# base module

## Spec

**Module** type providing foundational runtime and support functionality. The complete, first-layer module in env.

Characteristics:
- Layer 0 (foundation)
- Complete API units (full package/API/method hierarchy)
- Contains runtime support
- Provides generic self-evals
- Common utilities
- Everything else overlays on top

Structure follows **module** pattern:
```
base/                        # base module
├── _reqs/
│   ├── MODULE.md
│   └── base_module_v1.0.0.md
├── spl/runtime/
├── spl/dev/_selfeval/
└── ...
```

Location: `modules/base/` in env

Scope: Module type.

Purpose: Provide foundational code that all other modules build upon.

## Self-eval

- [ ] Extends **module**
- [ ] Layer 0 (first in layer order)
- [ ] Complete API units (not partial)
- [ ] Contains runtime support
- [ ] Provides generic self-evals
- [ ] Complete foundational functionality

## Comments

"Base" indicates foundational layer. Other module types (work module, patch module) overlay on top.
