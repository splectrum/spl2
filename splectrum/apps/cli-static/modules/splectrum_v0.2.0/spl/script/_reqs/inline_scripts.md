# Inline Scripts

**Status:** Implemented (in cli.js)

## Pattern

Inline scripts are detected by cli.js when the argument starts with `/*`:

```bash
spl '/* comment */
const result = module.buildTypeStack("spl/container")
module.output(JSON.stringify(result, null, 2))
'
```

## How It Works

1. cli.js detects `/*` at start of argument
2. Script content is placed in record at `headers.spl.request.script`
3. Method is set to `spl/script/inline`
4. module.require('spl/script/inline') creates executable from script content
5. Script runs with full module context

## Available in Scripts

- `module.input()` - get input flags
- `module.output(freetext, structured)` - set output
- `module.require('lib/...')` - splectrum libs only
- `module.resolve(path, file)` - resolve file paths
- `module.buildTypeStack(path, mode)` - get type stacks
- `await import('fs')` - node/npm modules (use dynamic import)

## Examples

```bash
# Read a file through resolution
spl '/* read */
const fs = await import("fs")
const path = module.resolve("spl/container", "index.json")
module.output(fs.readFileSync(path, "utf8"))
'

# Inspect type stack
spl '/* stack */
const r = module.buildTypeStack("spl/container", "instantiates")
module.output(JSON.stringify(r, null, 2))
'

# Use helper lib
spl '/* explore */
const ai = await module.require("lib/spl/script/ai.js")
module.output(ai.json(ai.stack("spl/container")))
'
```
