**Type:** lib req
**Version:** 1.0.0

# lift_lib

## Purpose

Business logic for lifting (materializing) resources from overlay into work_module. Supports single resource lifting and bulk module-layer lifting.

## Exports

| Function | Purpose |
|----------|---------|
| containerExists | Check if container exists in work_module (has index.json) |
| resourceExistsLocally | Check if resource already exists in work_module |
| liftResource | Copy single resource from overlay source to work_module |
| liftModules | Lift entire container from lower module layers to work_module |

## Usage

```javascript
const liftLib = await module.require('lib/spl/crud/lift')

// Check container exists
if (liftLib.containerExists(workModulePath, targetPath)) { ... }

// Check resource exists locally
if (liftLib.resourceExistsLocally(workModulePath, targetPath, resource)) { ... }

// Lift single resource
const result = liftLib.liftResource(sourcePath, workModulePath, targetPath, resource, dryRun)

// Lift from module layers
const result = await liftLib.liftModules(targetPath, dryRun, recursive)
```

## Self-eval

- [ ] All fs/path operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] Functions return status objects for dry_run support
- [ ] liftModules walks hierarchy.json layers correctly
