**Type:** lib req
**Version:** 1.0.0

# set_lib

## Purpose

Business logic for property mutation operations. Handles filesystem operations for reading/writing JSON files.

## Exports

| Function | Purpose |
|----------|---------|
| joinPath | Join path segments |
| getDirPath | Get directory path from file path |
| exists | Check if path exists |
| readJson | Read and parse JSON file |
| writeJson | Write JSON file with formatting |
| ensureDir | Create directory if it doesn't exist |

## Usage

```javascript
const setLib = await module.require('lib/spl/crud/set')

const fileFsPath = setLib.joinPath(workModulePath, targetPath, targetFile)

if (setLib.exists(fileFsPath)) {
  const content = setLib.readJson(fileFsPath)
}

setLib.ensureDir(dirPath)
setLib.writeJson(fileFsPath, content)
```

## Self-eval

- [ ] All fs/path operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] JSON formatting preserved with trailing newline
