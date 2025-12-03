# clear

**Version:** 1.0.0
**Type:** verb
**Context:** Splectrum app-internal operations

---

## Definition

Clear removes a specific context value from app state. Inverse of set.

## Syntax

```
clear <context-type>
```

## Context Types

Same as `set`:
- api-context
- method-context
- pac
- verbose

## Behavior

1. Reads current state
2. Removes specified context (sets to undefined/default)
3. Persists to app state
4. Returns confirmation (if PAC enabled)

## PAC Output

```
Will clear:
  api-context: spl/project → <none>

Proceed? [y/n]
```

## Default PAC

on (state-changing operation)

## Relationship

- `set` - establishes value
- `clear` - removes single value
- `reset` - removes all values (bulk clear)

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
