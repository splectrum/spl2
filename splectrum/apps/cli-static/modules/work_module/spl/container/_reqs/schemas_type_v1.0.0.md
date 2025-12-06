**Type:** plain req
**Version:** 1.0.0

# schemas_type

## Spec

The `_schemas` folder is an internal container folder holding AVRO schemas for a container.

**Structure:**
- Folder name: `_schemas` (underscore prefix = internal)
- Task entrypoint: `schemas.json`
- No README.md/README.json (internal folder)

**Schema file structure:**
- Each schema is a separate AVRO file
- Extension: `.avsc`
- 6 standard schema files in 3 pairs (Kafka record pattern: value + headers)

**Schema pairs:**

| Pair | Value schema | Headers schema | Purpose |
|------|--------------|----------------|---------|
| Input | `input.avsc` | `metainput.avsc` | Method input as Kafka record |
| Output | `output.avsc` | `metaoutput.avsc` | Method output as Kafka record |
| State | `state.avsc` | `metastate.avsc` | Main record (private value, public headers) |

**Value schemas (data):**
- `input.avsc` - actual input data structure
- `output.avsc` - actual output data structure
- `state.avsc` - private state (internal, instance read/write only)

**Headers schemas (metadata + narrative):**
- `metainput.avsc` - input descriptions, examples, defaults (feeds PAC help)
- `metaoutput.avsc` - output descriptions, examples (feeds PAC help)
- `metastate.avsc` - public state (readable by all, writable by implemented types)

**Kafka record nesting:**
- Input and output are Kafka records nested in main record headers
- State/metastate are the main record's value/headers
- Meta schemas carry narrative for integrated help (PAC pattern)

**schemas.json entrypoint:**
- Lists available schemas
- Provides entry for schema validation tasks

## Self-eval

- [ ] Folder named `_schemas` with underscore prefix
- [ ] Contains `schemas.json` task entrypoint
- [ ] No README.md or README.json present
- [ ] Schema files use `.avsc` extension
- [ ] Schema files follow AVRO specification
- [ ] schemas.json lists available schemas
- [ ] Value/headers pairs present for input, output, state

## Comments

Internal folders use underscore prefix to distinguish from visible (navigable) folders. The task entrypoint (`schemas.json`) enables direct execution without spidering through README.

**Visibility model for state:**
- `state.avsc` (value) - private, only the instance reads/writes
- `metastate.avsc` (headers) - public, readable by all, writable only for types the instance implements

**PAC pattern integration:**
- Meta schemas carry the narrative (descriptions, examples, help text)
- This narrative feeds into integrated help displayed during confirmation
- Documentation travels with the schema, not separate
