**Type:** plain req
**Version:** 1.0.0

# selfeval_framework_lib

## Spec

Selfeval framework lib for loading and executing validation runners.

**File:** `_lib/selfeval.js`

**Purpose:** Load runner registry, instantiate runners, execute validation against container.

**Exports:**

| Function | Signature | Description |
|----------|-----------|-------------|
| `loadRegistry` | `(containerFsPath)` | Load `_selfevals/index.json` registry |
| `loadRunner` | `(runnerMeta, containerFsPath)` | Load and instantiate a runner from `_lib/` |
| `runAll` | `(containerFsPath, containerName, runners, options?)` | Execute runners and aggregate results |
| `buildTypeStack` | `(containerPath)` | Build type stack (see container_type_v1.0.0.md) |
| `loadRegistryFromType` | `(typePath)` | Load `_selfevals/index.json` from a specific type |
| `loadRunnerFromType` | `(runnerMeta, typePath)` | Load and instantiate a runner from a specific type's `_lib/` |

**Options for runAll:**
- `failFast` - stop on first failure (default: false)

### Runner Types

Runners are registered in `_selfevals/index.json`. Two categories based on when they execute:

**Type runners** (`runners` array):
- Run at every level in the type stack
- Validate container structure against that level's rules
- Examples: `lib`, `schemas`, `handler`, `reqs`, `final`

**Instance runners** (`instanceRunners` array):
- Run only at the `instanceLevel` (direct type)
- Validate instance-specific rules
- Examples: `children` (on spl/package), `api` (on spl/api)

| Runner | Defined On | Category | Purpose |
|--------|-----------|----------|---------|
| lib | spl/container | type | Check _lib exports match manifest |
| schemas | spl/container | type | Check schema files match manifest |
| handler | spl/container | type | Check index.js exists (via overlay) |
| reqs | spl/container | type | Check req files match manifest |
| final | spl/container | type | Check no overlap in final resources |
| children | spl/package | instance | Check children match instanceChildren type |
| api | spl/api | instance | Check api methods match folders |

### Runner Resolution

Runners are loaded via overlay from the type that defines them.

Example: `api` runner defined in `spl/api/_selfevals/index.json` with `file: "selfeval_api.js"`:
1. Resolve `spl/api/_lib/selfeval_api.js` via overlay
2. `spl/api` extends `spl/container`
3. Found at `spl/container/_lib/selfeval_api.js`

### Output States

Runner results use three states:

- **PASS** - validation succeeded with items checked
- **FAIL** - validation failed
- **EMPTY** - nothing to validate (not a failure, just nothing there)

**Result structure:**
```json
{
  "pass": true,
  "topline": "container | PASS",
  "summary": "5/5 runners passed",
  "runners": [...]
}
```

## Self-eval

- [ ] File exists at `_lib/selfeval.js`
- [ ] Exports `create(module)` function
- [ ] Created object exports `loadRegistry`, `loadRunner`, `runAll`, `buildTypeStack`, `loadRegistryFromType`, `loadRunnerFromType`

## Comments

Orchestrates selfeval validation. Individual runners implement facet-specific checks. Type stack algorithm documented in container_type_v1.0.0.md.
