# Method Resolution and API Association

**Created:** 2025-12-14
**Status:** IMPLEMENTED (2025-12-15)

## Discovery

During investigation of `spl spl/container/whoami --help` returning "No input schema found", we discovered a fundamental aspect of method resolution that wasn't properly implemented.

## The Problem

`module.resolve('spl/container/whoami', '_schemas/input.avsc')` returns `null`, even though the file exists at `spl/introspection/whoami/_schemas/input.avsc`.

## Solution

The fix was implemented in `buildTypeStackInternal` in `_lib/module.js`:

### 1. Virtual Method Resolution (instantiates mode)

When `buildTypeStack(path, 'instantiates')` is called for a path without index.json (virtual method):
- Extract parent path and method name
- Walk parent's instantiates chain to find which type has the method as a physical child
- Return that physical method's instantiates stack

### 2. Instantiates Mode Fix

The instantiates mode was stopping at first duplicate. Fixed to skip duplicates but continue following the extends chain.

## The Three Stack Modes

- **full** = container + extends + instantiates (deduped)
- **extends** = container + extends chain
- **instantiates** = container + instantiates chain (following type's extends, skipping duplicates but continuing)

## Why Methods Are Special

Methods are not standalone containers. They are extensions of their API definition:

- `spl/introspection` defines `whoami` method with its input.avsc
- `spl/container/whoami`, `spl/crud/whoami` are the same `whoami` method "applied" to different APIs
- They all share the schema from the original definition at `spl/introspection/whoami`

The method is "attached" to its original API first, then its own inheritance kicks in.

## Verification

```bash
# All now work:
spl spl/whoami --help
spl spl/container/whoami --help
spl spl/crud/whoami --help

# Test with inline script:
spl '/* test */ module.output(JSON.stringify(module.buildTypeStack("spl/container/whoami", "instantiates"), null, 2))'
# Returns: ["spl/introspection/whoami", "spl/method", "spl/container", "spl/crud", "spl/introspection"]
```
