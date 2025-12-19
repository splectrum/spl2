**Type:** lib req
**Version:** 1.0.0

# delete_lib

## Purpose

Business logic for deleting containers and resources from work_module. Handles filesystem operations for removal.

## Exports

| Function | Purpose |
|----------|---------|
| joinPath | Join path segments |
| getDirPath | Get directory path from file path |
| exists | Check if path exists |
| deleteFile | Delete a file |
| deleteDir | Delete a directory (optionally recursive) |
| readDir | Read directory entries with types |
| readDirNames | Read directory entry names |
| isDir | Check if path is directory |
| cleanupEmptyDir | Remove empty directory if not container root |

## Usage

```javascript
const deleteLib = await module.require('lib/spl/crud/delete')

if (deleteLib.exists(fsPath)) {
  deleteLib.deleteFile(fsPath)
}

// Container deletion
const entries = deleteLib.readDir(targetFsPath)
for (const entry of entries) {
  if (deleteLib.isDir(entryPath)) {
    deleteLib.deleteDir(entryPath, true)
  }
}
```

## Self-eval

- [ ] All fs/path operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] _reqs preservation logic remains in handler
