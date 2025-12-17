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
- **SKIP** - intentionally skipped (e.g., root container)
- **NONE** - not applicable / no data (e.g., no schemas)

### Output Format

**Topline format** - includes count and lists failures:
```
tools/7zip | PASS (9/9)
tools/7zip | FAIL (7/9) - container, tests
```

**Summary line** - counts AND explicit failure list:
```
7 PASS, 2 FAIL (container, tests), 0 SKIP
```

**Output order** - FAIL first, then PASS (failures are priority):
```
tools/7zip | FAIL (7/9) - container, tests
  spl/container
    container | FAIL - expected spl/api in stack
    tests | FAIL - 2/3 files (edge.json, null.json)
    handler | PASS
    schemas | NONE - no schemas
    lib | PASS - 3/3 files
```

**Container levels preserved** - shows where runners are registered (type chain).

**Clear "none" wording** - use "NONE - no schemas" not "EMPTY - no _schemas/index.json".

### Tests Runner Detail

Lists every test file with pass/fail:
```
tests | FAIL - 2/3 files
  auth.json | PASS - 5/5 cases
  crud.json | PASS - 3/3 cases
  edge.json | FAIL - 2/3 cases
    case "null input" | FAIL - expected X, got Y
```

### Flags

(Unchanged from v1.0.0)

| Dimension | Flag | Values | Default |
|-----------|------|--------|---------|
| Meta level | `--meta` | topline, summary, detail, enriched, report | summary |
| Report level | `--report` | topline, summary, detail, enriched | (none) |
| Runner filter | `--runner` | comma-delimited runner names | all |
| Dry run | `--dry-run` | boolean | false |
| Fail fast | `--fail-fast` | boolean | false |

### Example Output (summary level)

**Pass case:**
```
tools/7zip | PASS (9/9)
  tools/7zip
    (no runners)
  spl/wrapper
    (no runners)
  spl/api
    (no runners)
  spl/container
    container | PASS - 3/3 checks
    handler | PASS
    schemas | NONE - no schemas
    lib | NONE - no lib
    reqs | NONE - no reqs
    final | PASS - 54 files
    schemas_inheritance | PASS - 7 files
    schemas_data | NONE - no schemas
    tests | NONE - no tests
```

**Fail case:**
```
tools/7zip | FAIL (7/9) - container, tests
  spl/container
    container | FAIL - expected spl/api in stack, got spl/foo
    tests | FAIL - 1/3 files (edge.json)
    handler | PASS
    schemas | NONE - no schemas
    lib | PASS - 3/3 files
    reqs | PASS - 2/2 files
    final | PASS - 54 files
    schemas_inheritance | PASS - 7 files
    schemas_data | NONE - no schemas
```

## Self-eval

- [ ] Status vocabulary: PASS, FAIL, SKIP, NONE used consistently
- [ ] Topline shows count and failure list: `name | FAIL (7/9) - runner1, runner2`
- [ ] Summary shows counts with failure list: `7 PASS, 2 FAIL (x, y), 0 SKIP`
- [ ] Output order: FAIL runners before PASS runners
- [ ] NONE wording: "no schemas" not "no _schemas/index.json"
- [ ] Tests runner lists all test files with status
- [ ] Container levels preserved in output

## Comments

v1.1.0 focuses on output clarity - making failures visible and easy to diagnose.
Changes are additive to v1.0.0 flag and structure specs.
