**Type:** plain req

# module

## Spec

Root API node structure containing api-node hierarchy. Currently three levels: package, API, method.

Self-contained mycelium with:
- Internal refs relative to module root
- Fixed entry points (mutable filenames)
- Spider to versioned files (immutables)
- Portable - can be moved/deployed anywhere

Structure:
```
module/
├── README.md              # mutable entry point (natural language)
├── _reqs/
│   └── module_v1.0.0.md   # versioned immutable
└── [package]/             # package api_node (extends api_node_v1.0.0)
    ├── README.md          # package entry point
    ├── _reqs/             # package level reqs
    └── [api]/             # api api_node (extends api_node_v1.0.0)
        ├── README.md      # api entry point
        ├── _reqs/         # api level reqs
        └── [method]/      # method api_node (extends api_node_v1.0.0)
            ├── README.md  # method entry point
            ├── _reqs/     # method level reqs
            │   └── _selfeval.json
            ├── _schemas/
            ├── _tests/
            └── index.js
```

**Three-level hierarchy (fixed):**
- Level 1: Package (namespace root)
- Level 2: API (groups related methods)
- Level 3: Method (invokable leaf)

Future extensions will be backward compatible.

**Api node structure:**
Each level (package/api/method) follows **api_node** pattern (see api_node_v1.0.0.md):
- `_reqs/` folder with mutable entry point
- Underscore-prefixed items excluded from URI namespace
- Internal folders: `_schemas/`, `_tests/`

**Package invocation:**
Packages can be invoked with package-level arguments (not just methods).

Scope: Global.

Purpose: Container for API node hierarchy with portability and self-contained references.

## Self-eval

- [ ] Contains api-node hierarchy
- [ ] Internal refs relative to module root
- [ ] Has mutable entry points
- [ ] Has versioned immutables
- [ ] Portable (refs intact when moved)

## Comments

Types: install module (base/), work module (overlay/).
Extends to: package (contains APIs), API (contains methods), method (leaf node).
