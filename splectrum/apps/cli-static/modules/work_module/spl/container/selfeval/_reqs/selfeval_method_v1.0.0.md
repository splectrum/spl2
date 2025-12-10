**Type:** plain req
**Version:** 1.0.0

# selfeval_method

## Spec

The `selfeval` method validates container implementation against declared constraints.

### Flags

| Dimension | Flag | Values | Default |
|-----------|------|--------|---------|
| Meta level | `--meta` | topline, summary, detail, enriched, report | summary |
| Report level | `--report` | topline, summary, detail, enriched | (none) |
| Runner filter | `--runner` | comma-delimited runner names | all |
| Dry run | `--dry-run` | boolean | false |
| Fail fast | `--fail-fast` | boolean | false |

**--meta**: Controls freetext output
- `--meta=topline` → PASS/FAIL only
- `--meta=summary` or (default) → runner results
- `--meta=detail` → includes missing/extra details
- `--meta=enriched` → includes source excerpts
- `--meta=report` → echoes structured as JSON

**--report**: Controls structured output
- (not set) → no structured output
- `--report` → summary level results
- `--report=detail` → detailed results

**--runner**: Filter to specific runners
- `--runner=lib` → run lib runner only
- `--runner=lib,schemas` → run lib and schemas runners
- (not set) → all runners

**--dry-run**: List runners without executing

**--fail-fast**: Stop on first failure

### Output Structure

Hierarchical like whoami: selfeval envelope wraps runner results.

```
selfeval (envelope)
  topline: "spl/container | PASS"
  summary: "3 runners, all passed"
  runners[] (facets)
    runner (e.g. lib)
      topline: "lib | PASS"
      summary: "validates exports match manifest"
      detail: test suite results
      enriched: individual test cases
```

**topline**: Identity + pass/fail
- Envelope: `spl/container | PASS`
- Runner: `lib | PASS`

**summary**: Description
- Envelope: runner count, overall status
- Runner: what it validates

**detail**: Test suite results
- Runner: per-file or per-check results

**enriched**: Individual test cases
- Runner: each assertion with expected/actual

### Expected Flow

1. Process flags (meta, report, runner, dry-run, fail-fast)
2. Load runner registry from _selfevals/index.json
3. Filter runners based on --runner flag
4. If --dry-run, output runner list and exit
5. Build container report (reuse whoami lib)
6. Run selected runners against report
7. Render freetext at meta level
8. Output freetext and structured (if report requested)

## Self-eval

- [ ] Supports --meta flag (topline, summary, detail, enriched, report)
- [ ] Supports --report flag (topline, summary, detail, enriched)
- [ ] Supports --runner flag for filtering
- [ ] Supports --dry-run for runner listing
- [ ] Supports --fail-fast for early exit
- [ ] Method flow visible in index.js
- [ ] Output is hierarchical: envelope wraps runners
- [ ] Each level (topline/summary/detail/enriched) has incremental info
- [ ] Uses generic freetext renderer

## Comments

Part of the introspection API facet alongside `whoami` and `typeof`. Validates that implementation matches manifest declarations.
