**Type:** lib req
**Version:** 1.0.0

# write_lib

## Purpose

Business logic for writing resources to work_module. Handles filesystem operations for file writing.

## Exports

| Function | Purpose |
|----------|---------|
| getContainerFsPath | Get filesystem path for container in work_module |
| containerExists | Check if container directory exists |
| resourceExists | Check if resource file exists |
| writeFile | Write content to resource file |

## Usage

```javascript
const writeLib = await module.require('lib/spl/crud/write')

const containerFsPath = writeLib.getContainerFsPath(workModulePath, containerPath)
if (!writeLib.containerExists(containerFsPath)) { ... }
if (!writeLib.resourceExists(containerFsPath, resource)) { ... }

writeLib.writeFile(containerFsPath, resource, content)
```

## Self-eval

- [ ] All fs/path operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] File must exist before writing (create first)
