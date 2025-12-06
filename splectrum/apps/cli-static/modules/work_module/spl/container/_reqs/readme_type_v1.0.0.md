**Type:** plain req
**Version:** 1.0.0

# readme_type

## Spec

README files are visible container documentation in two formats serving different audiences.

**Two formats:**
- `README.md` - natural language, human-readable
- `README.json` - strict schema, machine-readable

**README.md (natural language):**
- Narrative documentation
- Surfaces content from internal folders (_reqs, _selfevals, _schemas, etc.)
- Feeds into integrated help (PAC pattern)
- Entry point for exploration ("I'm exploring, what is this?")

**README.json (strict schema):**
- Mycelium web links
- Self-description (type, purpose)
- Children listing (visible + internal)
- Entry point for navigation/whoami
- Machine-readable structure

**README.json initial structure:**
```json
{
  "api": {},
  "purpose": "Brief description of what this container is"
}
```

or for method:
```json
{
  "method": {},
  "purpose": "Brief description of what this method does"
}
```

- Type key (`api`, `method`, `package`, etc.) indicates container type
- `purpose` - one-line description
- Structure minimal; will evolve through whoami/PAC help implementation

**Relationship:**
- Both describe the same container
- README.md for humans, README.json for machines
- README.json feeds whoami method
- README.md feeds PAC help display

**Content constraints:** None.

## Self-eval

- [ ] README.md present (natural language)
- [ ] README.json present (strict schema)
- [ ] README.json has type key and purpose field
- [ ] Both describe the same container

## Comments

Visible folders (no underscore prefix) have README files. Internal folders (_lib, _reqs, etc.) do not - they have task entrypoints instead.

The README pair enables dual entry: explore (README.md) or execute (task entrypoint via README.json navigation).

**Evolution:**
README.json structure is minimal to start. Will evolve as patterns emerge (e.g., sub-interfaces for APIs, method signatures, schema references).
