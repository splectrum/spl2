**Type:** plain req
**Version:** 1.0.0

# selfeval_reqs_runner

## Spec

Selfeval runner for reqs facet validation.

**File:** `_lib/selfeval_reqs.js`

**Purpose:** Validate declared req files exist. Bidirectional: manifest to reality and reality to manifest.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Execute reqs validation |

**Checks:**
- Declared files exist in `_reqs/`
- Req files (.md) are declared in manifest

**Result structure:**
```json
{
  "pass": true,
  "topline": "reqs | PASS",
  "summary": "18/18 files",
  "files": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_reqs.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

All .md files in _reqs/ should be registered in manifest.
