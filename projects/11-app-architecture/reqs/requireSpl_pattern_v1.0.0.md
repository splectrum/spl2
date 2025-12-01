# requireSpl Pattern

**Version:** 1.0.0
**Status:** Working document
**Created:** 2025-12-01

---

## Overview

`requireSpl` is the unified entry point for loading splectrum libs, modules, and scripts. Everything goes through one function, returns consistent interfaces, and enforces platform abstraction.

## Location

`splectrum/lib/moduleBootstrap.js`

## Usage

```js
const result = await requireSpl(uri, record)
```

## Four URI Patterns

| Pattern | Example | Returns |
|---------|---------|---------|
| `lib/...` | `lib/spl`, `lib/spl/cli` | Bound utility object |
| `pkg/api/method` | `spl/dev/cycle`, `pr09/console/hello` | `{ invoke() }` |
| `/absolute/path` | `/home/.../scripts/status.js` | `{ invoke() }` |
| `spl/script/inline` | Special method | `{ invoke() }` (content from record) |

## The Two `create()` Signatures

### Libs

```js
// In: modules/bm_spl/spl/_lib/spl.js
export function create(record, { requireNonSpl }) {
  const fs = requireNonSpl('fs')
  const path = requireNonSpl('path')

  return {
    input() { ... },
    output(data) { ... },
    complete() { ... },
    faf(dir, opts) { ... }
  }
}
```

- Receives `{ requireNonSpl }` - platform module access
- Returns utility object with methods
- Only libs touch platform modules

### Methods

```js
// In: modules/bm_spl/pr09/console/hello/index.js
export async function create(record, { requireSpl }) {
  const spl = await requireSpl('lib/spl', record)

  return {
    async invoke() {
      const input = spl.input()
      // Implementation using libs
      spl.output({ ... })
      spl.complete()
    }
  }
}
```

- Receives `{ requireSpl }` - can load libs
- Returns `{ invoke() }` - single execution entry point
- Uses libs for all operations, never direct platform access

## Why This Pattern

### Consistency
- Same `create()` factory pattern for libs and methods
- Predictable structure = fast comprehension
- No "how does this one work?" - they all work the same

### Platform Abstraction
- Methods only get `requireSpl` - must use libs
- Libs only get `requireNonSpl` - wrap platform specifics
- When platform changes (Node → Bare), only libs need updating

### Meaningful Code
- Method implementations read like operations: `spl.writeToTopic(...)`
- Not raw platform calls: `fs.writeFileSync(...)`
- Self-documenting through lib function names

## Overlay Resolution

Methods resolve via overlay layers defined in `modules/hierarchy.json`:

```json
{
  "layers": [
    { "name": "bm_spl", "type": "bundle_module" }
  ]
}
```

Resolution walks layers in order, first match wins. Future: app modules overlay node modules.

## Scripts

Scripts (file and inline) are wrapped in AsyncFunction with dependencies pre-bound:

```js
// What scripts receive:
async function(record, spl, requireSpl, requireNonSpl) {
  // Script content here
}
```

Scripts have more freedom (can use requireNonSpl directly) - they're exploration/utility code, not formal implementations.

## Calling Pattern

```js
// In app handler:
const method = record.headers.spl.request.method
const executable = await requireSpl(method, record)
await executable.invoke()
```

Two lines. Clean. Uniform.

---

## Reference Implementation

See `modules/bm_spl/pr09/console/hello/index.js` for the canonical method implementation.
