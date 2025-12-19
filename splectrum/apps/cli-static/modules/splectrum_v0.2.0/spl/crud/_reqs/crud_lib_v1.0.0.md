**Type:** lib req
**Version:** 1.0.0

# crud_lib

## Purpose

Shared CRUD utilities for work module path resolution. Used by all CRUD operations to dynamically locate the active work module from hierarchy.json.

## Exports

| Function | Purpose |
|----------|---------|
| getWorkModulePath | Get full filesystem path to active work_module layer |

## Usage

```javascript
const crud = await module.require('lib/spl/crud')

const workModulePath = await crud.getWorkModulePath()
if (!workModulePath) {
  // No work module found in hierarchy.json
}
```

## Behavior

- Reads hierarchy.json from appropriate modules directory
- Respects app context (uses app hierarchy.json when in app context)
- Returns null if no work_module layer found
- Returns full filesystem path to work module directory

## Self-eval

- [ ] Uses factory pattern with create(module)
- [ ] Respects app context via module.getAppAPI()
- [ ] Returns null on missing hierarchy.json
