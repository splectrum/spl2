**Type:** plain req
**Version:** 1.0.0

# selfeval_tests_lib

## Spec

Selfeval runner for data-driven tests from `_tests/` folder.

**File:** `_lib/selfeval_tests.js`

**Purpose:** Scan `_tests/` folder for test files, load appropriate test runners, execute tests.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Execute all tests in `_tests/` folder |

**Test file format:**
```json
{
  "name": "test suite name",
  "category": "optional category",
  "tests": [
    {
      "name": "test name",
      "runner": "command",
      "command": "/whoami",
      "expect": { ... }
    }
  ]
}
```

**Test discovery:**
1. Read `_tests/index.json` for manifest
2. Load each file from `files` array
3. Execute each test using declared runner

**Runner resolution:**
- Runner name maps to `_selfevals/test_runners/{name}.js`
- Resolved via overlay from selfeval method path
- Runner loaded via `module.resolve(methodPath, path)`

**Result structure:**
```json
{
  "pass": true,
  "topline": "tests | PASS",
  "summary": "5/5 tests in 2 files",
  "files": [
    {
      "name": "file name",
      "pass": true,
      "tests": [...]
    }
  ]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval_tests.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function

## Comments

Data-driven test framework. Test runners are pluggable - each test declares its runner. Command runner is the default.
