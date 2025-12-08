# summary

**Type:** plain req
**Version:** 1.0.0
**Project:** 11-app-architecture

---

## Spec

Compact description; mainly used in metadata.

Brief but informative output - more than a title, less than full explanation. The default level when no flags specified.

### Character

- Compact but descriptive
- Few lines typically
- Key information included
- Brief context, no deep explanation

### Usage

As output level:
- `gradedOutput({ summary: "schemas:\n  input.avsc - input schema\n  metaoutput.avsc - metadata output", ... })`

As flag:
- `spl spl/container/whoami --summary` (or just default, no flag)

### Mappings

No foreign mappings - summary is the default, no conventional flag equivalent.

### Examples

```
schemas:
  input.avsc - input schema for method invocation
  metaoutput.avsc - metadata output structure
```

```
spl/container/whoami - container introspection
Returns structured information about a container at configurable depth.
```

Each example provides identity plus brief description.

## Self-eval

- [ ] More than a title, includes brief description
- [ ] Compact - few lines, not paragraphs
- [ ] Key information present
- [ ] No deep explanation or internals

## Comments

Part of the four-level output system: topline → summary → detail → debug.

Summary is the default level - what you get without flags. Answers "what is this and what does it do?" briefly.
