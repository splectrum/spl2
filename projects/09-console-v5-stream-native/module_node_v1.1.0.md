**Type:** plain req

# module_node

## Spec

Base structural type for SPL2 hierarchy. All nodes in modules derive from module_node.

**Derived types:** module_root, package, api, method

**Core pattern:**
- Has `index.js` with standard async signature
- Has `_schemas/` with input.avsc, output.avsc
- Has `_tests/` for test cases
- Underscore prefix excludes from URI namespace

Runtime merges input into context before invocation.

Standard signature: `export default async function(context) { ... }`

Scope: All structural nodes.

Purpose: Uniform structural pattern enabling overlay resolution, inheritance, and consistent invocation.

## Self-eval

- [ ] Hierarchy level declared (Instance of: {derived_type})

## Files

Reference implementation: `dev/v0/modules/types/module_node/`

## Comments

Base type - no Extends declaration.

Provides default implementation. Derived types inherit unless they override.

Renamed from api_node (v1.0.0) to avoid naming collision with api derived type and to better reflect that this is the base for all module nodes, not just API nodes.

---

**Version:** 1.1.0
