**Type:** plain req
**Version:** 1.0.0

# selfeval_reqs_coverage_runner

## Spec

Selfeval runner that validates req coverage for .js files. Ensures every JavaScript file has a corresponding requirement document.

**File:** `_lib/selfeval_reqs_coverage.js`

**Pattern:** `create(module)` returns object with `run(containerFsPath)` method.

### Purpose

Enforces documentation discipline by checking that:
- Every `_lib/*.js` file has a corresponding req
- Every `_lib/selfeval_*.js` file has a runner req
- Every `_selfevals/**/*.js` file has a test runner req

### Req Naming Conventions

| File Pattern | Expected Req Pattern |
|--------------|---------------------|
| `_lib/<name>.js` | `<name>_lib_v*.md` |
| `_lib/selfeval_<name>.js` | `selfeval_<name>_runner_v*.md` |
| `_selfevals/**/<name>.js` | `selfeval_<name>_test_runner_v*.md` |

### Output Format

**Pass:**
```
reqs_coverage | PASS
  all .js files have reqs
```

**Fail:**
```
reqs_coverage | FAIL - 2 missing req(s)
  _lib/foo.js: missing: foo_lib_v*.md
  _lib/selfeval_bar.js: missing: selfeval_bar_runner_v*.md
```

### Checks Performed

1. Scan `_lib/` directory for .js files
2. For each file, determine expected req pattern based on filename
3. Check if matching req exists in `_reqs/` folder
4. Scan `_selfevals/` recursively for .js files
5. Check for corresponding test runner reqs

### Behavior

- Only checks containers that have `_lib/` or `_selfevals/` folders
- Skips `_lib/index.json` (manifest, not a lib)
- Uses regex matching for version wildcards in req names
- Reports all missing reqs (not fail-fast)

## Self-eval

- [ ] File exists at `_lib/selfeval_reqs_coverage.js`
- [ ] Exports `create(module)` function
- [ ] Returns object with `run(containerFsPath)` method
- [ ] Detects missing lib reqs
- [ ] Detects missing selfeval runner reqs
- [ ] Detects missing test runner reqs
- [ ] Output format matches specification

## Comments

This runner enforces the principle that all implementation files should have corresponding requirements. Reqs document the "what and why" while the .js files implement the "how".

Missing reqs indicate either:
- New code without documentation (needs req)
- Orphaned code (req was removed, code should be too)
