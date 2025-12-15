**Type:** plain req
**Version:** 1.0.0

# schemas_type

## Spec

The schemas facet holds AVRO schemas for a container. Location: `_schemas/` folder with `index.json` manifest.

**Structure:**
```
_schemas/
  ├── index.json        ← manifest (flat facts)
  ├── input.avsc        ← input value schema
  ├── metainput.avsc    ← input headers schema
  ├── output.avsc       ← output value schema
  ├── metaoutput.avsc   ← output headers schema
  ├── state.avsc        ← state value schema
  └── metastate.avsc    ← state headers schema
```

**index.json structure:**
```json
{
  "name": "schemas",
  "purpose": "Container schemas for input, output, and state",
  "files": ["input.avsc", "metaoutput.avsc"]
}
```

**Fields:**
- `name` - always "schemas"
- `purpose` - brief description
- `files` - list of schema files present

**Schema pairs (Kafka record pattern):**

| Pair | Value schema | Headers schema | Purpose |
|------|--------------|----------------|---------|
| Input | `input.avsc` | `metainput.avsc` | Method input |
| Output | `output.avsc` | `metaoutput.avsc` | Method output |
| State | `state.avsc` | `metastate.avsc` | Container state |

**Flat facts pattern:**
- `index.json` holds raw facts (file list, purpose)
- whoami builds four-level structure from schema contents
- freetext renderer produces natural language

## Self-eval

- [ ] Folder named `_schemas` with underscore prefix
- [ ] Contains `index.json` manifest
- [ ] index.json has `name`, `purpose`, `files` fields
- [ ] Schema files use `.avsc` extension
- [ ] Schema files follow AVRO specification

## Comments

Internal folders use underscore prefix. The `index.json` manifest enables whoami to discover and report on schema contents.
