**Type:** lib req
**Version:** 1.0.0

# info_lib

## Purpose

Business logic for info method. Handles filesystem operations for reading JSON files.

## Exports

| Function | Purpose |
|----------|---------|
| readJson | Read and parse JSON file, return null on error |

## Usage

```javascript
const infoLib = await module.require('lib/spl/introspection/info')

const index = infoLib.readJson(indexPath)
if (index) {
  // use index data
}
```

## Self-eval

- [ ] All fs operations encapsulated in lib
- [ ] Handler uses only module.require() for this lib
- [ ] Returns null on read/parse errors
