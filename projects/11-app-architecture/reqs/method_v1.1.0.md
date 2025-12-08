# method

**Type:** plain req
**Extends:** projects/06-glossary-term-requirements/reqs/method_v1.0.0.md
**Version:** 1.1.0
**Project:** 11-app-architecture
**Focus:** DSL meaning

---

## Spec

Handler that is a member of an apiFacet of a Splectrum API.

A method is the invokable unit - what you actually call. It belongs to an apiFacet, which belongs to an API. The chain: API → apiFacet → method.

### Character

- Invokable: you call it, it does something
- Member: belongs to an apiFacet
- Handler: processes requests, produces responses
- Leaf: end of the path, no children

### Relationship chain

```
API (managed unit with state)
  └── apiFacet (external interface)
        └── method (invokable handler)
```

When you invoke `spl/container/whoami`:
- `spl` = package
- `container` = API
- `whoami` = method (handler in container's apiFacet)

## Self-eval

- [ ] Description conveys handler/invokable meaning
- [ ] Membership in apiFacet clear
- [ ] Chain relationship understood
- [ ] No implementation details in description

## Comments

"method" aligns with common programming usage (OOP method, function). Splectrum meaning adds the apiFacet membership context.

### Examples

| Method | API | What it does |
|--------|-----|--------------|
| whoami | spl/container | introspection |
| status | spl/runtime | runtime state |
| cycle | spl/dev | dev iteration |

Each method is a handler doing one thing within its API's facet.
