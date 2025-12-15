**Type:** plain req
**Version:** 1.0.0

# selfeval_handler_runner

## Spec

Selfeval runner for handler facet validation.

**File:** `_lib/selfeval_handler.js`

**Purpose:** Validate container has index.js that exports a function.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Execute handler validation |

**Checks:**
- index.js exists at container root
- Exports a function (default export or module.exports)

**Result structure:**
```json
{
  "pass": true,
  "topline": "handler | PASS",
  "summary": "1/1 checks",
  "checks": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_handler.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

Handler is the container entry point - must export a function.
