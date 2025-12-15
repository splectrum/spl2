**Type:** plain req
**Version:** 1.1.0
**Supersedes:** avsc_lib_v1.0.0

# avsc_lib

## Spec

Avro schema tooling lib using the `avsc` npm package.

**File:** `_lib/avsc.js`

**Purpose:** Schema parsing, validation, and comparison for container data.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `parseSchema` | `(schemaPath)` | Load and parse Avro schema file, return type or errors |
| `validate` | `(type, value)` | Validate value against parsed schema type |
| `compareSchemas` | `(parentSchema, childSchema)` | Compare schemas for inheritance validation |

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

### compareSchemas(parentSchema, childSchema)

Field-by-field comparison for inheritance validation.

- Compares field names: all parent fields must exist in child
- Compares field types: must be compatible
- Compares metadata: doc, default should match

**Input:** Raw schema objects (JSON), not parsed types.

**Returns:**
```json
{
  "compatible": true
}
```

**On incompatibility:**
```json
{
  "compatible": false,
  "missing": ["fieldName"],
  "typeMismatch": [{"field": "x", "parent": "string", "child": "int"}],
  "metadataDrift": [{"field": "y", "key": "doc", "parent": "desc", "child": "other"}]
}
```

## Self-eval

- [ ] File exists at `_lib/avsc.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports: parseSchema, validate, compareSchemas
- [ ] parseSchema returns ok/error result
- [ ] validate returns null for valid data
- [ ] compareSchemas detects missing fields
- [ ] compareSchemas detects type mismatches
- [ ] Works on both Node and Bare runtimes

## Comments

Enables selfevals:
1. Schema files in `_schemas/` are valid Avro
2. Test/selfeval data conforms to declared schemas
3. Schema inheritance is valid (child has parent fields)

Uses `module.require('avsc')` which works on both Node and Bare via import maps.
