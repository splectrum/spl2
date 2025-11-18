**Type:** plain req
**Extends:** api_node

# method

## Spec

Invokable api node. Leaf of the API hierarchy.

Contains `index.js` with method implementation, internal folders, and auxiliary files. This is what gets executed.

Naming: lowercase, verb or action-oriented.

URI: Constructed from path - `package/api/method` (e.g., `spl/runtime/run`).

Purpose: Atomic unit of execution in SPL2.

## Self-eval

- [ ] Contains index.js with method implementation
- [ ] Invokable via URI
- [ ] No child api nodes (leaf)
- [ ] Name is lowercase, action-oriented

## Comments

Examples:
- `spl/runtime/run/` - entry point for SPL2 execution
- `spl/execution/invoke/` - invoke a single method
- `pr03/hello/greet/` - output hello world greeting
