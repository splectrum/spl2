# selfeval

Introspection method that validates a container against its declared structural constraints.

## Usage

```bash
spl spl/container/selfeval                    # run all facets
spl spl/container/selfeval --facet=structure  # run specific facet
spl spl/container/selfeval --dry-run          # list what would run
```

## Facets

| Facet | Purpose |
|-------|---------|
| structure | File/folder existence checks |
| schemas | Schema conformance validation |

## Data-Driven

Each container declares constraints in `_selfevals/`:
- `selfevals.json` - manifest listing available facets
- `selfeval_<facet>.json` - data for each facet

Generic runner functions interpret the data. Containers don't need custom validation code.

---

**Version:** 1.0.0
