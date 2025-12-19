**Type:** lib req
**Version:** 1.0.0

# selfeval_lib

## Purpose

Selfeval framework for container validation. Loads runners from _lib/, executes selected runners, returns structured results with hierarchical levels.

## Exports

| Function | Purpose |
|----------|---------|
| getContainerFsPath | Get filesystem path for container |
| loadRegistry | Load _selfevals/index.json registry |
| loadRunner | Load a runner from _lib |
| runAll | Run selected runners against container |
| buildTypeStack | Build type stack for levels support |
| loadRegistryFromType | Load _selfevals from a type |
| loadRunnerFromType | Load runner from type's _lib |

## Usage

```javascript
const selfeval = await module.require('lib/spl/introspection/selfeval.js')

const containerFsPath = selfeval.getContainerFsPath(containerPath)
const registry = selfeval.loadRegistryFromType(typePath)
const fn = await selfeval.loadRunnerFromType(meta, typePath)
const results = await selfeval.runAll(containerFsPath, containerName, runners, opts)
```

## Self-eval

- [ ] Uses factory pattern with create(module)
- [ ] Supports hierarchical level execution
- [ ] Handles runner load errors gracefully
