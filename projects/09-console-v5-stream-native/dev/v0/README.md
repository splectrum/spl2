# v0 - Dev Environment Template

**Purpose:** Template for creating isolated development environments with type hierarchy and selfeval inheritance.

## Quick Start

```bash
# Clone to new iteration
node clone.js ../v1.0
cd ../v1.0

# Create environment and test
node deploy.js
node cycle.js        # prepare + test

# Develop in environments/env-*/modules/work_module/
# Re-run cycle.js after changes

# When done
node publish.js      # Copy work_module back with timestamp
node destroy.js      # Clean up
```

## Scripts

| Script | Purpose |
|--------|---------|
| `clone.js` | Create new iteration from this template |
| `deploy.js` | Create environment from implementation/ |
| `prepare.js` | Build hierarchy.json (layer sequences) |
| `test.js` | Run selfevals from all layers |
| `cycle.js` | Convenience: prepare + test |
| `publish.js` | Copy work_module back with type flattening |
| `destroy.js` | Remove environment(s) |

## Structure

```
v0/
├── package.json
├── clone.js, deploy.js, prepare.js, test.js
├── cycle.js, publish.js, destroy.js
├── handler.js, submit.js          # Copied to env
├── environments/                   # Deployed instances (gitignored)
└── implementation/                 # Source
    ├── types/                      # Type definitions
    │   ├── module_node/            # Base type (has _lib/, _reqs/)
    │   ├── branch/                 # Extends module_node
    │   ├── module_root/            # Extends branch
    │   ├── package/                # Extends branch
    │   ├── api/                    # Extends branch
    │   └── method/                 # Extends module_node
    └── work_module/                # Work module
        ├── _lib/                   # Root level libs
        │   ├── core.js             # SPL wrapper
        │   └── overlay.js          # Overlay resolution
        └── pr09/console/hello/     # Example method
```

## Environment Structure

Created by `deploy.js`:

```
env-{timestamp}/
├── package.json
├── hierarchy.json          # Built by prepare.js
├── handler.js, submit.js
├── events/requests/
├── lib/                    # Symlinks to work_module/_lib/
├── node_modules/lib/       # Re-exports from lib/
└── modules/
    ├── types/
    └── work_module/
```

## Type Hierarchy

Types declare inheritance via README.json:
```json
{ "type": "method", "extends": "module_node" }
```

Hierarchy built dynamically by `prepare.js`:
- Reads type declarations at runtime
- Creates layer sequence per node
- Order: work_module ancestors → type chain

## Selfeval Inheritance

Selfevals collected from all layers using overlay:
- Type selfevals run on every node of that type
- Same-named selfevals: lower layer wins
- `module_node` selfeval validates folder structure on all nodes

## Lib Resolution

Three-layer resolution for clean imports:

| Layer | Location | Purpose |
|-------|----------|---------|
| Source | `work_module/_lib/core.js` | Actual code |
| Symlink | `lib/core.js` | Points to source |
| Re-export | `node_modules/lib/core.js` | Node resolution |

Methods import cleanly:
```javascript
import { createSpl } from 'lib/core.js'
```

## Method Pattern

```javascript
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)

  console.log(spl.headers.pr09.console.hello.message)
  spl.complete()
}
```

## Cloning to New Project

```bash
# From new project folder
mkdir dev
cp -r ../09-console-v5-stream-native/dev/v0 dev/v0
cd dev/v0
node clone.js ../v1.0
```

Update package.json name/description for the new project.

---

**Source:** Project 09 - Console v5 Stream Native
