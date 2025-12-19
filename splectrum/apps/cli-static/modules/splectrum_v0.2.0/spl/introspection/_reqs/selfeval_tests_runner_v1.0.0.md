**Type:** lib req
**Version:** 1.0.0

# selfeval_tests_runner

## Purpose

Selfeval runner for data-driven tests from _tests/ folder.

## Exports

| Function | Purpose |
|----------|---------|
| run | Execute all tests from _tests/*.json files |

## Usage

```javascript
const runner = await module.require('lib/spl/introspection/selfeval_tests.js')
const result = await runner.run(containerFsPath, meta)
```

## Behavior

1. Scans _tests/ folder for *.json files
2. Each JSON file contains array of test cases
3. Each test specifies a runner (e.g., "command")
4. Delegates to appropriate test runner
5. Aggregates results

## Self-eval

- [ ] Uses factory pattern with create(module)
- [ ] Scans _tests/*.json for test definitions
- [ ] Supports multiple test runner types
