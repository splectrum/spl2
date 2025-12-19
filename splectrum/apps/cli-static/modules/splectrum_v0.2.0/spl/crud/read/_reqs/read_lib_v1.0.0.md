**Type:** lib req
**Version:** 1.0.0

# read_lib

## Purpose

Business logic for reading resources from work_module. Handles filesystem operations including wildcard matching.

## Exports

| Function | Purpose |
|----------|---------|
| getContainerFsPath | Get filesystem path for container in work_module |
| containerExists | Check if container directory exists |
| findMatchingFiles | Find files matching a wildcard pattern |
| readFile | Read file contents from container |

## Usage

```javascript
const readLib = await module.require('lib/spl/crud/read')

const containerFsPath = readLib.getContainerFsPath(workModulePath, containerPath)
if (!readLib.containerExists(containerFsPath)) { ... }

// Wildcard matching
const result = readLib.findMatchingFiles(containerFsPath, 'foo_v*.md')
// { found: true, files: ['foo_v1.0.0.md'] }

// Direct read
const file = readLib.readFile(containerFsPath, 'index.js')
// { exists: true, contents: '...' }
```

## Self-eval

- [ ] All fs/path operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] Wildcard pattern converts to regex correctly
