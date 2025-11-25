# Lib Resolution Pattern

Three concerns, three layers:

| Concern | Location | Maintenance |
|---------|----------|-------------|
| Node resolution | `node_modules/lib/` | Static (set once) |
| Overlay resolution | `lib/` (symlinks) | On new lib file |
| Source | `modules/work_module/*/_lib/` | Edit freely |

## Structure

```
v0/
├── node_modules/lib/
│   ├── package.json           # { "type": "module" }
│   ├── core.js                # re-export from ../../lib/core.js
│   └── pr09/console/hello.js  # re-export from ../../lib/pr09/console/hello.js
├── lib/
│   ├── core.js                # symlink → modules/work_module/_lib/core.js
│   └── pr09/console/hello.js  # symlink → modules/work_module/pr09/console/hello/_lib/hello.js
└── modules/work_module/
    ├── _lib/
    │   └── core.js            # root level lib (used by all)
    └── pr09/console/hello/
        ├── index.js           # method entry point
        └── _lib/
            └── hello.js       # method-level lib
```

## Usage

```javascript
import { createSpl } from 'lib/core.js'           // root level
import { createHello } from 'lib/pr09/console/hello.js'  // method level
```

## Wrapper Pattern

Libs provide factory functions that bind to the record:

```javascript
// lib/core.js
export function createSpl(record) {
  return {
    headers: record.headers,
    value: record.value,
    complete() { record.headers.spl.request.completed = true },
    error(msg) { /* ... */ }
  }
}
```

Method-level libs extend the pattern:

```javascript
// lib/pr09/console/hello.js
import { createSpl } from 'lib/core.js'

export function createHello(record) {
  const spl = createSpl(record)
  const input = spl.headers.pr09.console.hello

  return {
    ...spl,
    greet() { console.log(input.message) }
  }
}
```

## Method Pattern

index.js stays clean - pure flow orchestration:

```javascript
import { createHello } from 'lib/pr09/console/hello.js'

export function handle(record) {
  const hello = createHello(record)

  hello.greet()
  hello.complete()
}
```

- **index.js** = what (flow, intent)
- **_lib/*.js** = how (implementation details)
- Function names become method's vocabulary

## Rules

- `_lib/` folder at any level holds lib source files
- Install creates/updates symlinks in `lib/`
- `node_modules/lib/` re-exports are static
- Root level libs (core.js) at module_root `_lib/`
- Package/API/method level libs in their respective `_lib/`

## Benefits

- Clean imports (no path traversal)
- Static node_modules (set once)
- Standard Node resolution
- Overlay works via symlinks
- Edit source, changes instant
- index.js reads like requirements
- Implementation details hidden in libs
