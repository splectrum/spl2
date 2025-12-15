**Type:** plain req
**Version:** 1.0.0

# selfeval_schemas_runner

## Spec

Selfeval runner for schemas facet validation.

**File:** `_lib/selfeval_schemas.js`

**Purpose:** Validate declared schema files exist. Bidirectional: manifest to reality and reality to manifest.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Execute schemas validation |

**Checks:**
- Declared files exist in `_schemas/`
- Schema files (.avsc, .json) are declared in manifest

**Result structure:**
```json
{
  "pass": true,
  "topline": "schemas | PASS",
  "summary": "2/2 files",
  "files": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_schemas.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

Skips index.json when checking for unregistered files.
