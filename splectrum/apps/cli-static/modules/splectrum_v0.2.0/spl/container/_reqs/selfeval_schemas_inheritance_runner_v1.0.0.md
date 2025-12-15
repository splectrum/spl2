**Type:** plain req
**Version:** 1.0.0

# selfeval_schemas_inheritance_runner

## Spec

Selfeval runner for schema inheritance validation.

**File:** `_lib/selfeval_schemas_inheritance.js`

**Purpose:** Validate that schema files include all inherited fields from parent types in the type chain.

**Algorithm:**
1. Build type stack for the container
2. Collect schema files across all levels (input.avsc, metaoutput.avsc, etc.)
3. For each schema file, identify the level it first appears
4. For levels below, verify child schema includes all parent fields
5. Field-by-field comparison: name, type, default, doc

**Merge direction:** Base type → derived type. Parent fields propagate down.

**On drift detected:** Report fail with message to run `update` handler.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `run` | `(containerFsPath)` | Execute inheritance validation |

**Checks:**
- All parent schema fields present in child
- Field types compatible
- Metadata in sync (doc, default)

**Result structure:**
```json
{
  "pass": true,
  "topline": "schemas inheritance | PASS",
  "summary": "3 files checked"
}
```

**On failure:**
```json
{
  "pass": false,
  "topline": "schemas inheritance | FAIL",
  "summary": "drift detected - run update to fix",
  "driftedFiles": ["input.avsc"]
}
```

**Dependencies:**
- `avsc.js` lib for `compareSchemas(parentSchema, childSchema)`
- Type stack building (from module)

## Self-eval

- [ ] File exists at `_lib/selfeval_schemas_inheritance.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `run` function
- [ ] Detects missing inherited fields
- [ ] Reports "run update" on failure

## Comments

Works with `update` handler (spl/container/update) which performs the actual merge to fix drift.
