**Type:** plain req
**Version:** 1.0.0

# selfeval_hierarchy_runner

## Spec

Selfeval runner for hierarchy.json validation in spl/modules containers.

**File:** `_lib/selfeval_hierarchy.js`

**Purpose:** Validate hierarchy.json exists and has correct structure.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Run hierarchy validation |

**Checks:**
1. hierarchy.json exists
2. `layers` is an array
3. Each layer has `name` and `type` fields
4. Each layer's folder exists

**Result structure:**
```json
{
  "pass": true,
  "topline": "hierarchy | PASS",
  "summary": "N/N checks",
  "checks": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_hierarchy.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

This runner validates the hierarchy.json structure required by spl/modules type.
