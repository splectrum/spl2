**Type:** plain req
**Version:** 1.0.0

# spl_method_instance

## Spec

The spl/method container - the method type definition itself.

**Purpose:**
Defines what a method is. All method containers implement this type.

**This container provides:**
- Type definition (spl_method_type)
- Tooling inherited by all methods (via _lib)
- Selfevals for method validation

**Children:**
None. Method type is a leaf definition.

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_method_type structural requirements
- [ ] Type definition present in _reqs

## Comments

spl/method is both:
1. A type definition (spl_method_type) - what methods must be
2. A container instance - lives at spl/method in the hierarchy

The type definition is the primary artifact.
