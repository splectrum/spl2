# detail

**Type:** plain req
**Version:** 1.0.0
**Project:** 11-app-architecture

---

## Spec

Full description; mainly used in metadata.

Complete explanatory output - everything a user needs to understand the subject fully. No internals or diagnostics.

### Character

- Full explanation
- Multiple sections/paragraphs acceptable
- Complete context provided
- User-facing information, not internals

### Usage

As output level:
- `gradedOutput({ detail: "schemas:\n  input.avsc - input schema\n    key (string) - record identifier\n    ...", ... })`

As flag:
- `spl spl/container/whoami --detail`

### Mappings

| Foreign | Native |
|---------|--------|
| verbose | detail |

### Examples

```
schemas:
  input.avsc - input schema for method invocation
    key (string) - record identifier
    headers (object) - metadata headers
    value (object) - payload content
  metaoutput.avsc - metadata output structure
    status (string) - execution status
    timing (object) - performance metrics
```

Full field-level information, complete picture for the user.

## Self-eval

- [ ] Complete explanation provided
- [ ] All relevant user-facing information included
- [ ] Context and relationships explained
- [ ] No internal/diagnostic information

## Comments

Part of the four-level output system: topline → summary → detail → debug.

Detail answers "tell me everything about this" from a user perspective. Still excludes internals - that's debug.
