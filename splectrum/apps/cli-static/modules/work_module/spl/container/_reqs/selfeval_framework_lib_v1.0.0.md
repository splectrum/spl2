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
| `buildTypeStack` | `(containerPath)` | Build type stack: instance chain first, then type chain, deduped |
| `loadRegistryFromType` | `(typePath)` | Load `_selfevals/index.json` from a specific type |
| `loadRunnerFromType` | `(runnerMeta, typePath)` | Load and instantiate a runner from a specific type's `_lib/` |

**Options for runAll:**
- `failFast` - stop on first failure (default: false)

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

Orchestrates selfeval validation. Individual runners implement facet-specific checks.
