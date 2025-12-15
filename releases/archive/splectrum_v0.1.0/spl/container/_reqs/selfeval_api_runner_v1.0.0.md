**Type:** plain req
**Version:** 1.0.0

# selfeval_api_runner

## Spec

Selfeval runner for api facet validation.

**File:** `_lib/selfeval_api.js`

**Purpose:** Validate declared methods exist as folders with index.js. Bidirectional: manifest to reality and reality to manifest.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Execute api validation |

**Checks:**
- Declared methods have folder with index.js
- Method folders are declared in api

**Result structure:**
```json
{
  "pass": true,
  "topline": "api | PASS",
  "summary": "7/7 methods",
  "methods": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_api.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

Method is a folder with index.js. Folders starting with underscore are skipped (internal facets).
