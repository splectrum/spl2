**Type:** plain req
**Version:** 1.0.0

# spl_api_instance

## Spec

The spl/api container - the API type definition itself.

**Purpose:**
Defines what an API is. All API containers implement this type.

**This container provides:**
- Type definition (spl_api_type)
- Tooling inherited by all APIs (via _lib)
- Selfevals for API validation

**Children:**
None currently. API type methods (if any) would live here.

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_api_type structural requirements
- [ ] Type definition present in _reqs

## Comments

spl/api is both:
1. A type definition (spl_api_type) - what APIs must be
2. A container instance - lives at spl/api in the hierarchy

The type definition is the primary artifact. Instance-specific methods may be added later if needed (e.g., api-level introspection tools).
