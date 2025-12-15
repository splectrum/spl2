**Type:** plain req
**Version:** 1.0.0

# selfeval_lib_runner

## Spec

Selfeval runner for lib facet validation.

**File:** `_lib/selfeval_lib.js`

**Purpose:** Validate lib files match manifest expectations. Bidirectional: manifest to reality and reality to manifest.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Execute lib validation |

**Checks:**
- Declared files exist
- Declared exports exist in code
- Actual files are declared in manifest
- Actual exports are declared in manifest

**Result structure:**
```json
{
  "pass": true,
  "topline": "lib | PASS",
  "summary": "8/8 files",
  "files": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_lib.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

Bidirectional checking catches both missing implementations and unregistered files.
