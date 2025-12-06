**Type:** plain req
**Version:** 1.0.0
**Extends:** spl_container_type_v1.0.0

# spl_api_type

## Spec

API is a container type that groups related methods addressing a single concern.

**Extends spl/container with:**

**Structural constraints:**
- Children must be method containers (implement spl/method)
- Parent must be package container (implement spl/package)

**API-level concerns:**
- Defines argument namespace for all child methods
- Owns API-level state (shared across methods)
- API facets (organizational groupings of methods, in README.json)

**index.js responsibilities:**
- Batch handling (execute multiple methods in sequence)
- Method dispatch
- API-level state initialization

**README.json structure:**
```json
{
  "api": {
    "facetName": ["method1", "method2"],
    "anotherFacet": ["method3"]
  },
  "purpose": "Description of this API"
}
```

- `api` key indicates this is an API; value contains API facets
- Each facet is an organizational grouping of methods
- Methods list derived from union of all facet arrays
- Structure will evolve as whoami/PAC help implementation clarifies needs

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Children are method containers
- [ ] Parent is package container
- [ ] README.json has type "api"
- [ ] README.json lists methods

## Comments

API is the elementary building block - smallest standalone deployable unit. Methods within an API:
- Share argument namespace
- Share API-level state
- Deploy together

**Inheritance:**
All container structure (README, index.js, _lib, _reqs, _schemas, _selfevals, _tests) inherited from spl/container. This type adds API-specific constraints.

**API facets:**
Organizational only - methods are directly callable on the API. API facets organize related methods for documentation/discovery, not enforcement.
