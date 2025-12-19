**Type:** lib req
**Version:** 1.0.0

# selfeval_schemas_data_runner

## Purpose

Selfeval runner for schema data validation. Validates that data files (_schemas/*.json) conform to their corresponding schema definitions (_schemas/*.avsc).

## Exports

| Function | Purpose |
|----------|---------|
| run | Execute schema data validation |

## Behavior

1. Scans _schemas/ for .json data files
2. For each data file, finds corresponding .avsc schema
3. Validates data against schema
4. Reports validation errors

## Self-eval

- [ ] Uses factory pattern with create(module)
- [ ] Validates .json files against .avsc schemas
- [ ] Reports specific validation failures
