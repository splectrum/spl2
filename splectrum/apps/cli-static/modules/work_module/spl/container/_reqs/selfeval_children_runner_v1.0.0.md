**Type:** plain req
**Version:** 1.0.0

# selfeval_children_runner

## Spec

Selfeval runner for child type validation.

**File:** `_lib/selfeval_children.js`

**Purpose:** Validate that child containers conform to expected types defined on their type.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath, config)` | Run child type validation |

**Behavior:**
1. Reads `instanceChildren` from config (passed from registry entry)
2. If not defined, skips (pass)
3. For each non-underscore child folder:
   - Reads child's index.json
   - Checks if extends or instantiates matches instanceChildren
4. Reports pass/fail for each child

**Registry config:**
```json
{
  "name": "children",
  "file": "selfeval_children.js",
  "instanceChildren": "spl/method"
}
```

This means: "instances of this type should have children of type spl/method"

**Result structure:**
```json
{
  "pass": true,
  "topline": "children | PASS",
  "summary": "N/N children",
  "children": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_children.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

Enforces child type constraints defined on the type, applied to instances. Skip if instanceChildren not defined on type.
