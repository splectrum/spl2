# module_node

Base structural type for SPL2 hierarchy.

All nodes derive from module_node: module_root, package, api, api_method.

## Structure

```
{node}/
├── index.js          # Entry point (standard async signature)
├── README.md         # This file (natural language)
├── README.json       # Structure definition (machine readable)
├── _schemas/         # Input/output schemas
│   ├── input.avsc
│   └── output.avsc
└── _tests/           # Test cases
```

## Conventions

**Underscore prefix:** Internal folders/files excluded from URI namespace.

**Standard signature:** `export default async function(context) { ... }`

**Input handling:** Runtime merges input into context before invocation.

## Default Behavior

Default index.js returns `{ status: 'not_implemented' }`.

Derived types inherit default unless they override.

## See Also

- README.json for machine-readable structure

---

**Version:** 1.1.0
