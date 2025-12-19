**Type:** lib req
**Version:** 1.0.0

# update_lib

## Purpose

Business logic for container update operations. Handles drift detection and fixing for index.json and schema inheritance.

## Exports

| Function | Purpose |
|----------|---------|
| readJson | Read and parse JSON file |
| writeJson | Write JSON file with formatting |
| fileExists | Check if file exists |
| getDirPath | Get directory path from file path |
| joinPath | Join path segments |
| fixContainerFacet | Fix index.json to match container.avsc schema |
| mergeSchemaInheritance | Merge parent schema fields into child schemas |
| mergeSchemaFields | Merge parent fields into single child schema |

## Usage

```javascript
const updateLib = await module.require('lib/spl/crud/update')

// Read JSON
const result = updateLib.readJson(filePath)
if (result.ok) { ... }

// Fix container drift
const changes = await updateLib.fixContainerFacet(targetPath, targetIndex, targetIndexPath, dryRun)

// Merge schema inheritance
const schemaChanges = await updateLib.mergeSchemaInheritance(targetPath, dryRun)
```

## Self-eval

- [ ] All fs/path operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] Both container and schema drift handled
