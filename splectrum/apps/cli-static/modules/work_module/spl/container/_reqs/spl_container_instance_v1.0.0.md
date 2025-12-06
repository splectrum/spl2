**Type:** plain req
**Version:** 1.0.0

# spl_container_instance

## Spec

The spl/container API - methods available on all containers.

**API facets:**

| Facet | Purpose | Candidate methods |
|-------|---------|-------------------|
| crud | Create, read, delete containers | create, read, delete |
| types | Type introspection | whoami, typeof |
| xpath | Structural queries | select |

**Batch handling:**
- API-level invocation can include `batch` argument
- Batch executes multiple method calls in sequence
- Implemented in spl/container index.js

**Method dispatch:**
- Methods organized by API facet (organizational only)
- All methods callable directly on container
- API facets are for documentation/discovery, not enforcement

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] API facets documented in README.json
- [ ] Batch handling implemented (when index.js exists)

## Comments

This is the base API - all container types (package, api, method) inherit these methods.

**Method status:**
- Candidate methods listed above are initial set
- Actual methods defined when implemented (each in own container)
- No `update` method - Write/Edit + selfevals handles modifications

**API facet naming:**
- crud, types, xpath are organizational API facets
- Listed in README.json `apiFacets` for discovery
- Methods live in their own containers (e.g., spl/container/whoami/)
