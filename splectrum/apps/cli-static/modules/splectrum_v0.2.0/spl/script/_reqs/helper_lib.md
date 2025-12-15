# Helper Library (ai.js)

**Status:** Active

## Purpose

Utility functions for AI/exploration workflows. Reduces boilerplate in inline scripts.

## Functions

### File Reading

```javascript
// Read file through resolution - combines resolve + read
lib.readFile(containerPath, relativePath)

// Read JSON through resolution - combines resolve + read + parse
lib.readJson(containerPath, relativePath)
```

### Inspection

```javascript
// Shorthand for buildTypeStack
lib.stack(containerPath, mode = 'full')

// List all methods available on a container (walks type chain)
lib.methods(containerPath)

// List children with their types
lib.children(containerPath)
```

### Quick Checks

```javascript
// Has index.json?
lib.exists(containerPath)

// Is this a method path? (no index.json, parent has index.json)
lib.isMethod(path)

// Find physical method definition for a virtual method
lib.physicalMethod(virtualMethodPath)
```

### Output Helpers

```javascript
// JSON.stringify(obj, null, 2)
lib.json(obj)

// Format array as aligned table
lib.table(arr, columns)
```

## Usage

```bash
spl '/* explore */
const ai = await module.require("lib/spl/script/ai.js")

// Quick stack inspection
module.output(ai.json(ai.stack("spl/container", "instantiates")))
'
```

```bash
spl '/* read */
const ai = await module.require("lib/spl/script/ai.js")

// Read index.json in one call
const index = await ai.readJson("spl/container", "index.json")
module.output(ai.json(index))
'
```

## Design Notes

- All functions receive module context via create(module) pattern
- Async functions for file operations
- Sync functions for formatting/checks where possible
- Error handling returns null rather than throwing (exploration-friendly)
