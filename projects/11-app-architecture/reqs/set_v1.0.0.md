# set

**Version:** 1.0.0
**Type:** verb
**Context:** Splectrum app-internal operations

---

## Definition

Set establishes a named context value for subsequent operations. The value persists in app state until explicitly changed or cleared.

## Syntax

```
set <context-type> <value>
```

## Context Types

| Context Type | Purpose | Example |
|--------------|---------|---------|
| api-context | Data structure being worked on | `set api-context spl/project` |
| method-context | Tool namespace being used | `set method-context spl/dev` |
| pac | Global PAC setting | `set pac on` |
| verbose | Global verbose setting | `set verbose off` |

## Behavior

1. Reads current state
2. Updates specified context
3. Persists to app state
4. Returns confirmation (if PAC enabled)

## PAC Output

```
Will set:
  api-context: spl/project
  (previously: <none>)

Proceed? [y/n]
```

## Default PAC

on (state-changing operation)

---

**Created:** 2025-12-04
**Project:** 11-app-architecture
