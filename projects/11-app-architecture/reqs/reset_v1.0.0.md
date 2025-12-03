# reset

**Version:** 1.0.0
**Type:** verb
**Context:** Splectrum app-internal operations

---

## Definition

Reset clears all context values and returns app state to defaults. Bulk clear operation.

## Syntax

```
reset
```

No arguments - affects all context.

## Behavior

1. Reads current state
2. Clears all context values
3. Restores defaults (pac: on, verbose: on)
4. Persists to app state
5. Returns confirmation (if PAC enabled)

## PAC Output

```
Will reset all context:
  api-context: spl/project → <none>
  method-context: spl/dev → <none>
  pac: off → on (default)
  verbose: off → on (default)

Proceed? [y/n]
```

## Default PAC

on (state-changing operation, destructive)

## Relationship

- `set` - establishes single value
- `clear` - removes single value
- `reset` - removes all values, restores defaults

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
