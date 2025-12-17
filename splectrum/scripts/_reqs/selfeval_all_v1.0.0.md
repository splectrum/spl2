**Type:** plain req
**Version:** 1.0.0

# selfeval_all

## Spec

Tree selfeval for container hierarchies. Validates a container and all its descendants.

**Invocation:**
```bash
spl selfeval-all <container> [--failFast] [--detail]
```

**Options:**
- `--failFast` - Stop at first failure, show detail for that container
- `--detail` - Show selfeval breakdown for every container

**Output format:**
```
container tree
---
container | PASS
  container/child1 | PASS
  container/child2 | FAIL
---
FAIL | 2 passed, 1 failed, 3 total
```

**JSON output:**
```json
{
  "pass": false,
  "summary": "2/3",
  "results": [
    { "container": "container", "pass": true },
    { "container": "container/child1", "pass": true },
    { "container": "container/child2", "pass": false }
  ]
}
```

**Implementation:**
- Walks container hierarchy via instance children
- Runs selfeval on each container
- Tracks visited containers to avoid cycles
- Uses hierarchy.json for layer resolution

## Self-eval

- [ ] `spl selfeval-all spl` validates spl tree
- [ ] `--failFast` stops at first failure with detail
- [ ] `--detail` shows breakdown for all containers
- [ ] Returns pass/fail summary with results array

## Comments

Established fixture for tree validation. Essential for development iteration.
