**Type:** plain req
**Version:** 1.0.0

# reqs_type

## Spec

The reqs facet holds requirements for a container. Location: `_reqs/` folder with `index.json` manifest.

**Structure:**
```
_reqs/
  ├── index.json                  ← manifest (flat facts)
  ├── identity_type_v1.0.0.md     ← type req
  ├── identity_instance_v1.0.0.md ← instance req
  └── ...
```

**index.json structure:**
```json
{
  "name": "reqs",
  "purpose": "Container requirements and contracts",
  "files": ["identity_type_v1.0.0.md", "identity_instance_v1.0.0.md"]
}
```

**Fields:**
- `name` - always "reqs"
- `purpose` - brief description
- `files` - list of req files present

**Req file naming:**
- Pattern: `<facet>_<type>_v<semver>.md`
- Type reqs: `<facet>_type_v<semver>.md` - what something IS (structural)
- Instance reqs: `<facet>_instance_v<semver>.md` - what something CONTAINS (content)

**Flat facts pattern:**
- `index.json` holds raw facts (file list, purpose)
- whoami builds four-level structure
- freetext renderer produces natural language

## Self-eval

- [ ] Folder named `_reqs` with underscore prefix
- [ ] Contains `index.json` manifest
- [ ] index.json has `name`, `purpose`, `files` fields
- [ ] Req files follow naming convention `<facet>_<type>_v<semver>.md`
- [ ] Type reqs use `_type_` suffix
- [ ] Instance reqs use `_instance_` suffix

## Comments

Internal folders use underscore prefix. The `index.json` manifest enables whoami to discover and report on req contents.

The type/instance suffix pattern separates structural contracts from content constraints.
