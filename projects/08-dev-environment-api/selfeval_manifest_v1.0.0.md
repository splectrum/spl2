**Type:** plain req

# selfeval manifest

## Spec

JSON test manifest for self-evaluation. Machine-readable test specification.

Structure:
```json
{
  "method": "spl/dev/create",
  "description": "Self-eval for create method",
  "extends": "api_method_selfeval_v1.0.0.json",
  "tests": [
    {
      "name": "creates environment with status",
      "type": "script",
      "script": "tests/create-status.js",
      "category": "logic"
    },
    {
      "name": "schema validates input",
      "type": "schema",
      "schema": "_schemas/input.avsc",
      "data": "testdata/valid-input.json",
      "category": "qc"
    }
  ]
}
```

**Core fields:**
- `method` - Method path (e.g., "spl/dev/create")
- `description` - Human-readable description
- `extends` - Parent selfeval to inherit from (optional)
- `tests` - Array of test specifications

**Test specification:**
- `name` - Human-readable test name
- `type` - Test type (script, schema, snapshot)
- `category` - Test category (logic, safety, qc)
- Type-specific fields (script, schema, data, etc.)

**Test types:**
- `script` - Standalone JS script, exit 0/1
  - Fields: `script` (path to JS file)
- `schema` - Validate data against AVRO schema
  - Fields: `schema` (path to .avsc), `data` (path to JSON)
- `snapshot` - Compare output to expected
  - Fields: `snapshot` (path to expected output)
- (Extensible for future types)

**Test categories:**
- `logic` - Business logic correctness
- `safety` - Error handling, edge cases
- `qc` - Schema validation, contracts

**Extends chain:**
- Manifests can extend parent manifests
- Harness collects all tests from chain
- Child can override parent tests

**All paths relative to package root.**

Scope: Work package.

Purpose: Machine-readable test specification for harness execution.

## Self-eval

- [ ] Valid JSON structure
- [ ] Contains method path
- [ ] Contains tests array
- [ ] Each test has name, type, category
- [ ] Paths are relative to package root
- [ ] Extends path (if present) is valid
- [ ] Test types are recognized
- [ ] Categories are recognized

## Comments

Test manifest is consumed by harness. AI reads `_req.md`, harness reads `_selfeval.json`.
