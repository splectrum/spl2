# container

Base structural type for SPL2 hierarchy - the universal folder node.

All structural units derive from container: package, api, method.

## Structure

```
{container}/
  _lib/           # Shared utilities (lib.json)
  _reqs/          # Requirements (reqs.json)
  _schemas/       # Input/output schemas (schemas.json)
  _selfevals/     # Self-evaluations (selfevals.json)
  _tests/         # Test cases (tests.json)
  README.md       # This file (narrative)
  README.json     # Structure definition (mycelium web)
  index.js        # Implementation (if executable)
```

## Inherited API

Every container has these methods (from container type):

- `whoami` - structural introspection, self + context
- `select` - XPath-style structural queries
- `create` - scaffold new container structure

## Conventions

**Underscore prefix:** Internal folders excluded from URI namespace. No README files inside. Task-specific entrypoint instead.

**Spider principle:** Each folder with an entrypoint describes its own contents. Parent just links, doesn't duplicate.

---

**Version:** 1.0.0
