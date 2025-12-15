**Type:** plain req
**Version:** 1.0.0

# selfeval_final_runner

## Spec

Selfeval runner for final resources overlap detection.

**File:** `_lib/selfeval_final.js`

**Purpose:** Validate that final resources don't overlap across the type chain.

**Final resources:**
- `_reqs/*.md` - requirement files
- `_lib/*.js` - library files
- `_tests/*.js` - test files

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Run overlap detection |

**Behavior:**
1. Builds type stack using selfeval.buildTypeStack
2. For single level, passes (no overlap possible)
3. Collects all files from final dirs across all levels
4. Detects any file that appears in multiple levels
5. Reports overlaps as failures

**Result structure:**
```json
{
  "pass": true,
  "topline": "final | PASS",
  "summary": "N files, no overlaps",
  "overlaps": []
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_final.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

Ensures type inheritance doesn't create file conflicts. Each file should exist in exactly one level of the type chain.
