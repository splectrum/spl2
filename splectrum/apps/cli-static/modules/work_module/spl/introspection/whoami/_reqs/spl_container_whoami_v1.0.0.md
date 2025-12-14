**Type:** plain req
**Version:** 1.0.0
**Implements:** spl_method_type_v1.0.0

# spl_container_whoami

## Spec

Returns the type and description of the parent container by reading its README.json.

**Input:** None

**Output:**
- `type` - container type (api, method, package, module, modules)
- `purpose` - one-line description

**Behavior:**
1. Resolve parent container from method path (spl/container/whoami → spl/container)
2. Read README.json from parent container
3. Return structured response

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_method_type structural requirements
- [ ] Returns type from README.json
- [ ] Returns purpose from README.json
- [ ] Handles missing README.json gracefully

## Comments

whoami is the simplest introspection method - just reads and returns README.json content. It's available on all containers via inheritance from spl/container.
