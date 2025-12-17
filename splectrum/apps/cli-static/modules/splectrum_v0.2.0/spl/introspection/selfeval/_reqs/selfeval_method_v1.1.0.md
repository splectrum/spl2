**Type:** plain req
**Version:** 1.1.0
**Extends:** selfeval_method_v1.0.0.md

# selfeval_method

## Spec

The `selfeval` method validates container implementation against declared constraints.

### Status Vocabulary

Consistent status words for all output:
- **PASS** - check passed
- **FAIL** - check failed
- **SKIP** - nothing to validate (e.g., no schemas, no tests) - presence checked elsewhere

### Output Format

**Topline format** - includes count and lists failures:
```
tools/7zip | PASS (9/9)
tools/7zip | FAIL (7/9) - container, tests
```

**Summary line** - counts with explicit failure list:
```
7 PASS, 2 FAIL (container, tests), 1 SKIP
```

**Output order** - FAIL first, then PASS (failures are priority):
```
tools/7zip | FAIL (7/9) - container, tests
  spl/container
    container | FAIL - expected spl/api in stack
    tests | FAIL - 2/3 files (edge.json, null.json)
    handler | PASS
    schemas | SKIP - no schemas
    lib | SKIP - no lib
```

**Container levels preserved** - shows where runners are registered (type chain).

**Clear wording** - use "SKIP - no schemas" not "EMPTY - no _schemas/index.json".

### Tests Runner Detail

Summary shows filename with test count. For failures, lists failed tests with errors:

**Pass:**
```
tests | PASS - auth.json (5), crud.json (3)
```

**Fail:**
```
tests | FAIL - edge.json (1/3)
  "null input" - expected X, got Y
  "empty array" - missing required field
```

### Meta Levels

| Level | Shows |
|-------|-------|
| topline | `container \| STATUS (pass/total)` |
| summary | + grouped level summary: `FAIL: x - a, b`, `PASS: y (n/n)`, `SKIP: z, w` |
| detail | + runner detail for FAIL only |
| enriched | + runner detail for all (FAIL first) |
| report | raw JSON structure |

### Flags

| Dimension | Flag | Values | Default |
|-----------|------|--------|---------|
| Meta level | `--meta` | topline, summary, detail, enriched, report | detail |
| Report level | `--report` | topline, summary, detail, enriched | (none) |
| Runner filter | `--runner` | comma-delimited runner names | all |
| Dry run | `--dry-run` | boolean | false |
| Fail fast | `--fail-fast` | boolean | false |

### Example Output

**Summary (pass):**
```
tools/7zip | PASS (9/9)
  PASS: spl/container (9/9)
  SKIP: tools/7zip, spl/wrapper, spl/api, spl/crud, spl/introspection
```

**Summary (fail):**
```
tools/7zip | FAIL (7/9) - container, tests
  FAIL: spl/container - container, tests
  SKIP: tools/7zip, spl/wrapper, spl/api, spl/crud, spl/introspection
```

**Detail (fail) - default:**
```
tools/7zip | FAIL (7/9) - container, tests
  FAIL: spl/container - container, tests
  SKIP: tools/7zip, spl/wrapper, spl/api, spl/crud, spl/introspection
  spl/container
    container | FAIL - expected spl/api in stack
    tests | FAIL - 1/3 files (edge.json)
```

**Enriched (fail):**
```
tools/7zip | FAIL (7/9) - container, tests
  FAIL: spl/container - container, tests
  SKIP: tools/7zip, spl/wrapper, spl/api, spl/crud, spl/introspection
  spl/container
    container | FAIL - expected spl/api in stack
    tests | FAIL - 1/3 files (edge.json)
    handler | PASS - 1/1 checks
    schemas | SKIP - no schemas
    lib | PASS - 3/3 files
    reqs | PASS - 2/2 files
    final | PASS - 54 files
    schemas_inheritance | PASS - 7 files
    schemas_data | SKIP - no schemas
```

## Self-eval

- [ ] Status vocabulary: PASS, FAIL, SKIP used consistently
- [ ] Topline shows count and failure list: `name | FAIL (7/9) - runner1, runner2`
- [ ] Summary shows counts with failure list: `7 PASS, 2 FAIL (x, y), 1 SKIP`
- [ ] Output order: FAIL runners before PASS runners
- [ ] Clear wording: "no schemas" not "no _schemas/index.json"
- [ ] Tests runner lists all test files with status
- [ ] Container levels preserved in output

## Comments

v1.1.0 focuses on output clarity - making failures visible and easy to diagnose.
Changes are additive to v1.0.0 flag and structure specs.
