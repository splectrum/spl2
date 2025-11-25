**Type:** plain req
**Extends:** module_node

# branch

## Spec

Non-leaf module_node. Can contain child nodes and accept batch operations.

**Derived types:** module_root, package, api

**Adds to input:**
- `batch` - array of invocations to execute within scope

Branch nodes can receive a batch of operations scoped to their children. This enables pipeline configuration at different granularities.

Scope: Non-leaf nodes.

Purpose: Uniform batch capability for all container nodes.

## Self-eval

- [ ] Can have child nodes
- [ ] Accepts batch input argument

## Files

Reference implementation: `dev/v0/modules/types/branch/`

## Comments

Intermediate type between module_node and specific container types (module_root, package, api).

Method extends module_node directly (leaf, no batch capability).

---

**Version:** 1.0.0
