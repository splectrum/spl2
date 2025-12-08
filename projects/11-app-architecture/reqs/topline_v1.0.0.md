# topline

**Type:** plain req
**Version:** 1.0.0
**Project:** 11-app-architecture

---

## Spec

Title-style summary; mainly used in metadata.

The briefest meaningful output - like a headline or title. Conveys what something is in the fewest words possible.

### Character

- Headline-style: could be a title
- Single line typically
- Essential identity only
- No explanation, no context

### Usage

As output level:
- `gradedOutput({ topline: "schemas - input.avsc, metaoutput.avsc", ... })`

As flag:
- `spl spl/container/whoami --topline`

### Mappings

| Foreign | Native |
|---------|--------|
| silent | topline |

### Examples

```
schemas - input.avsc, metaoutput.avsc
spl/container/whoami - container introspection
env-1234 - active
```

Each example is a complete topline - you know what it is, nothing more.

## Self-eval

- [ ] Title-style brevity (could be a headline)
- [ ] Single line or very short
- [ ] Essential identity conveyed
- [ ] No explanation or context included

## Comments

Part of the four-level output system: topline → summary → detail → debug.

Topline answers "what is this?" in the briefest form.
