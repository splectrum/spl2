**Type:** plain req
**Version:** 1.0.0

# spl_container_instance

## Spec

The spl/container API - methods available on all containers.

**Sub-interfaces:**

| Interface | Purpose | Candidate methods |
|-----------|---------|-------------------|
| crud | Create, read, delete containers | create, read, delete |
| types | Type introspection | whoami, typeof |
| xpath | Structural queries | select |

**Batch handling:**
- API-level invocation can include `batch` argument
- Batch executes multiple method calls in sequence
- Implemented in spl/container index.js

**Method dispatch:**
- Methods grouped by sub-interface (organizational)
- All methods callable directly on container
- Sub-interface is documentation, not enforcement

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Sub-interfaces documented in README.json
- [ ] Batch handling implemented (when index.js exists)

## Comments

This is the base API - all container types (package, api, method) inherit these methods.

**Method status:**
- Candidate methods listed above are initial set
- Actual methods defined when implemented (each in own container)
- No `update` method - Write/Edit + selfevals handles modifications

**Sub-interface naming:**
- crud, types, xpath are organizational groupings
- Listed in README.json for discovery
- Methods live in their own containers (e.g., spl/container/whoami/)
