# method

Invokable leaf node. Contains actual implementation.

**Extends:** module_node

## Purpose

Execute specific operation. The "doing" node in the hierarchy.

Methods are leaves - they don't contain child nodes.

## Structure

Typically overrides:
- `index.js` - specific implementation
- `_schemas/input.avsc` - method-specific input
- `_schemas/output.avsc` - method-specific output

## Invocation

Executes the method logic. Must override default implementation with actual behavior.

## Examples

- `spl/dev/create/` - create dev environment
- `spl/runtime/run/` - run execution

---

**Version:** 1.0.0
