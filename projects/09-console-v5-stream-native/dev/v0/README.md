# v0 - Reusable Dev Environment Package

**Purpose:** Template for creating isolated development environments with work modules.

## What This Is

A **dev environment package** provides:
1. **Source modules** (`modules/`) - Types and work module source
2. **Install script** - Prepares implementation from modules
3. **Deploy script** - Creates isolated environment instances
4. **Test script** - Runs tests in environment
5. **Destroy script** - Cleans up environments

## Structure

```
v0/
├── README.md                    # This file
├── package.json                 # Enable ES modules for scripts
├── deploy.js                    # Create new environment
├── test.js                      # Test latest environment
├── destroy.js                   # Remove environment(s)
├── handler.js                   # Request handler (copied to env)
├── submit.js                    # Request submitter (copied to env)
├── install/                     # Installation tools
│   ├── install.js               # Copies modules/ to implementation/
│   └── package.json.template    # Template for environment package.json
├── modules/                     # Source bundles
│   ├── types/                   # Type definitions
│   │   ├── module_node/
│   │   ├── branch/
│   │   ├── method/
│   │   └── ...
│   └── work_module/             # Work module source
│       ├── _lib/                # Root level libs
│       │   └── core.js
│       └── pr09/                # Package
│           └── console/         # API
│               └── hello/       # Method
│                   ├── index.js
│                   └── _reqs/
├── implementation/              # Prepared by install (from modules/)
│   ├── work_module/
│   ├── types/
│   ├── lib/                     # Symlinks to _lib/
│   └── node_modules/lib/        # Re-exports
└── environments/                # Deployed instances
    └── env-{timestamp}/
        ├── package.json
        ├── handler.js
        ├── submit.js
        ├── events/requests/
        ├── work_module/
        ├── types/
        ├── lib/
        └── node_modules/lib/
```

## How It Works

### 1. Develop in modules/

Source code lives in `modules/`:
- `modules/types/` - Type definitions
- `modules/work_module/` - Your work module
- `modules/work_module/_lib/` - Shared libraries

```bash
# Create a method
mkdir -p modules/work_module/pr09/console/hello
# Add index.js, _reqs/, etc.
```

### 2. Install (Prepare Implementation)

Install copies modules/ to implementation/ with lib resolution:

```bash
node install/install.js
```

This:
1. Clears and recreates `implementation/`
2. Copies `modules/work_module/` and `modules/types/`
3. Creates `lib/` symlinks to `_lib/` files
4. Creates `node_modules/lib/` re-exports

### 3. Deploy

Creates a fresh environment instance from implementation/:

```bash
node deploy.js
```

This:
1. Runs install (prepares implementation/)
2. Creates `environments/env-{timestamp}/`
3. Copies implementation/ to environment
4. Creates events/requests/ directory
5. Copies handler.js and submit.js

### 4. Run

In the deployed environment:

```bash
cd environments/env-{timestamp}
node submit.js     # Submit a request
node handler.js    # Process requests
```

### 5. Test

Run tests in the latest environment:

```bash
node test.js                    # Test latest environment
node test.js env-123456         # Test specific environment
```

### 6. Destroy

Clean up environments:

```bash
node destroy.js                 # Remove all environments (prompts)
node destroy.js env-123456      # Remove specific environment
```

## Lib Resolution Pattern

Libraries are resolved through three layers:

| Layer | Location | Purpose |
|-------|----------|---------|
| Source | `work_module/_lib/core.js` | Actual lib code |
| Symlink | `lib/core.js` | Points to source |
| Re-export | `node_modules/lib/core.js` | Node resolution |

Methods import libs cleanly:
```javascript
import { createSpl } from 'lib/core.js'
```

Node walks up to `node_modules/lib/`, which re-exports from `lib/`, which symlinks to source.

## Method Structure

Each method has:
```
pr09/console/hello/
├── index.js                         # Method implementation
└── _reqs/
    ├── pr09_console_hello_v1.0.0.md      # Requirements
    └── pr09_console_hello_v1.0.0_selfeval.js  # Self-eval
```

Method pattern:
```javascript
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)

  console.log(spl.headers.pr09.console.hello.message)
  spl.complete()
}
```

## Event Record Structure

Kafka-compatible record:
```json
{
  "headers": {
    "spl": {
      "runtime": { "error": null, "timestamp": "..." },
      "request": { "guid": "...", "completed": false, "ttl": 5, "uri": "pr09/console/hello" }
    },
    "pr09": {
      "console": {
        "hello": { "message": "hello friend" }
      }
    }
  }
}
```

## Cloning for Iterations

Clone v0 for new iterations:

```bash
cp -r v0 v1.1
cd v1.1
# Update modules/work_module/ with iteration code
node deploy.js
```

---

**Pattern Source:** pr08/v4 dev environment API
**First Use:** Project 09 - Console v5 Stream Native
