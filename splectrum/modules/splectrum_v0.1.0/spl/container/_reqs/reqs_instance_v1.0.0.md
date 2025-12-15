**Type:** plain req
**Version:** 1.0.0

# reqs_instance

## Spec

Content constraints for `_reqs` folder instances.

**Instance req files:**
- Container-specific requirements
- Define what this particular container must achieve
- Reference type reqs via extends pattern

**Relationship to type reqs:**
- Type reqs (inherited) define the structural contract
- Instance reqs define container-specific requirements
- Both coexist in `_reqs/` folder

## Self-eval

- [ ] Conforms to reqs_type structural requirements
- [ ] Instance reqs reference their type via extends (if applicable)
- [ ] Each req has clear spec and self-eval sections

## Comments

Instance reqs emerge as containers are implemented. The type contract defines structure; instance reqs capture what this specific container must do.
