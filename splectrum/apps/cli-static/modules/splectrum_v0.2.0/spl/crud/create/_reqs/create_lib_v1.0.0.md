**Type:** lib req
**Version:** 1.0.0

# create_lib

## Purpose

Business logic for creating containers and resources in work_module. Extracted from handler to satisfy no-imports constraint.

## Exports

| Function | Purpose |
|----------|---------|
| createResource | Create an empty resource file in a container |
| readIndex | Read and parse index.json from a path |
| containerExists | Check if container's index.json exists |
| createContainer | Create container directory with index.json |
| getContainerFsPath | Get filesystem path for container in work_module |
| getIndexJsonPath | Get index.json path for a container |

## Usage

```javascript
const createLib = await module.require('lib/spl/crud/create')

// Create resource
const result = createLib.createResource(containerPath, resource, workModulePath, dryRun)

// Read index.json
const index = createLib.readIndex(indexPath)

// Check existence
if (createLib.containerExists(indexJsonPath)) { ... }

// Create container
const result = createLib.createContainer(targetPath, targetFsPath, indexContent, dryRun)
```

## Self-eval

- [ ] All fs/path operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] Functions return status objects for dry_run support
