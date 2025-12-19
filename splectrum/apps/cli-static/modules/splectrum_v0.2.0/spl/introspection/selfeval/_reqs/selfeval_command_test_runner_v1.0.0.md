**Type:** plain req
**Version:** 1.0.0

# selfeval_command_test_runner

## Spec

Test runner for executing spl commands and checking output.

**File:** `selfeval/_selfevals/test_runners/command.js`

**Purpose:** Execute spl commands relative to the container being tested, verify output against expectations.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `name` | (property) | Runner name: `"command"` |
| `run` | `(test)` | Execute test and return result |

**Command resolution:**

Commands are container-relative. The runner derives the full command path from the method being executed:

```javascript
module.getMethod().replace('/selfeval', test.command)
```

Example: Running `spl spl/container/selfeval` with test command `/whoami`:
- `spl/container/selfeval` + `/whoami` → `spl/container/whoami`

**Test format:**
```json
{
  "name": "test name",
  "runner": "command",
  "command": "/whoami --levels=all",
  "expect": {
    "contains": "expected string",
    "notContains": "unexpected string",
    "equals": "exact match",
    "matches": "regex pattern",
    "error": true
  }
}
```

**Expectation types:**

| Field | Type | Description |
|-------|------|-------------|
| `contains` | string \| string[] | Output must contain all strings |
| `notContains` | string \| string[] | Output must not contain any strings |
| `equals` | string | Output must match exactly (trimmed) |
| `matches` | string \| string[] | Output must match all regex patterns |
| `error` | boolean | Whether command should fail |

**Result structure:**
```json
{
  "pass": true,
  "topline": "test name | PASS",
  "detail": "command: /whoami",
  "output": "(first 200 chars on failure)"
}
```

## Self-eval

- [ ] File exists at `selfeval/_selfevals/test_runners/command.js`
- [ ] Exports `create(module)` function
- [ ] Created object has `name` property and `run` function

## Comments

Default test runner for data-driven tests. Commands use `/method` format for container-relative paths.
