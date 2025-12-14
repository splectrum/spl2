**Type:** plain req
**Version:** 1.0.0

# avsc_lib

## Spec

Avro schema tooling lib using the `avsc` npm package.

**File:** `_lib/avsc.js`

**Purpose:** Schema parsing and validation for container data.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `parseSchema` | `(schemaPath)` | Load and parse Avro schema file, return type or errors |
| `validate` | `(type, value)` | Validate value against parsed schema type |

### parseSchema(schemaPath)

Loads schema file and parses it using avsc.

- Reads .avsc file from path
- Parses JSON and creates avsc Type
- Returns parsed type if valid
- Returns error info if invalid

**Returns:** `{ ok: true, type }` | `{ ok: false, error }`

### validate(type, value)

Validates value against parsed schema type.

- Uses avsc type.isValid() with errorHook
- Collects all validation errors
- Returns null if valid
- Returns array of error paths/messages if invalid

**Returns:** `null` | `Error[]`

## Self-eval

- [ ] File exists at `_lib/avsc.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports: parseSchema, validate
- [ ] parseSchema returns ok/error result
- [ ] validate returns null for valid data
- [ ] Works on both Node and Bare runtimes

## Comments

Enables two selfevals:
1. Schema files in `_schemas/` are valid Avro
2. Test/selfeval data conforms to declared schemas

Uses `module.require('avsc')` which works on both Node and Bare via import maps.
