# Overlay Operations

Two operations for resolving files across the layer hierarchy.

## Layer Sequence

Each node has a layer sequence built by `prepare.js`:

```javascript
// hierarchy.json
{
  "spl/console/hello": {
    "type": "method",
    "layerSequence": [
      "modules/work_module/spl/console/hello",
      "modules/work_module/spl/console",
      "modules/work_module/spl",
      "modules/work_module",
      "modules/types/method",
      "modules/types/module_node"
    ]
  }
}
```

Order: work_module path ancestors → type chain

## selectFile (First Match)

**Use for:** Implementation files where you want the most specific version.

```javascript
import { selectFile } from 'lib/overlay.js'

// Returns first match walking up layer sequence
const indexPath = selectFile(node, 'index.js')
const schemaPath = selectFile(node, '_schemas/input.avsc')
```

**Behavior:**
- Walks layer sequence from first to last
- Returns path of first existing file
- Stops searching after first match

**Example:**
```
Looking for index.js in spl/console/hello:

1. modules/work_module/spl/console/hello/index.js  → EXISTS ✓ RETURN
2. (stops - found it)
```

If work_module doesn't have it:
```
1. modules/work_module/spl/console/hello/index.js  → not found
2. modules/work_module/spl/console/index.js        → not found
3. ...
4. modules/types/method/index.js                   → EXISTS ✓ RETURN
```

## collectAll (Accumulate)

**Use for:** Selfevals, requirements, schemas where you want everything from all layers.

```javascript
import { collectAll } from 'lib/overlay.js'

// Returns all matches from all layers
const selfevals = collectAll(node, '_reqs/*_selfeval.js')
const schemas = collectAll(node, '_schemas/*.avsc')
```

**Behavior:**
- Walks entire layer sequence
- Collects all matching files
- Returns array of all paths found

**Example:**
```
Collecting selfevals for spl/console/hello:

1. modules/work_module/spl/console/hello/_reqs/*_selfeval.js  → []
2. modules/work_module/spl/console/_reqs/*_selfeval.js        → []
3. modules/work_module/spl/_reqs/*_selfeval.js                → []
4. modules/work_module/_reqs/*_selfeval.js                    → []
5. modules/types/method/_reqs/method_selfeval.js              → [found]
6. modules/types/module_node/_reqs/module_node_selfeval.js    → [found]

Result: [method_selfeval.js, module_node_selfeval.js]
```

## When to Use Which

| Operation | Use Case | Example Files |
|-----------|----------|---------------|
| `selectFile` | Get implementation | index.js, README.md, config.json |
| `collectAll` | Get all validations | *_selfeval.js, *_req.md, *.avsc |

## Same-Named Files

**selectFile:** Lower layer wins (work_module overrides type default)

**collectAll:** All collected, but for selfevals with same name, lower layer wins

This enables:
- Override default implementations
- Inherit all type validations
- Add specific validations at any level

---

**Version:** 1.0.0
