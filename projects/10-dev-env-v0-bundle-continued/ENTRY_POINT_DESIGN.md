# Entry Point Design

**Project:** 10 - Dev Env v0 Bundle Continued
**Created:** 2025-11-26
**Status:** Design proposal

---

## Overview

Single `spl` entry point supporting three invocation modes:
1. Single command CLI
2. Inline script
3. File invocation with arguments

The `spl` command uses node resolution to find the nearest Splectrum node, allowing invocation from anywhere within a node's directory tree.

All modes share common infrastructure: record creation, programmatic API access, event writing, runtime context.

## Node Resolution

### Concept

Like `node_modules` resolution in Node.js, `spl` traverses up from the current directory to find the nearest `splectrum/` folder. This folder defines the Splectrum node context.

### Resolution Algorithm

```javascript
function resolveNode(startDir) {
  let dir = startDir

  while (dir !== path.dirname(dir)) {  // not at root
    const splectrumPath = path.join(dir, 'splectrum')
    if (fs.existsSync(splectrumPath) && fs.statSync(splectrumPath).isDirectory()) {
      return {
        nodeRoot: dir,           // where splectrum/ was found
        splectrumDir: splectrumPath
      }
    }
    dir = path.dirname(dir)
  }

  throw new Error('No splectrum/ node found in directory tree')
}
```

### Examples

```
Directory structure:
/home/herma/splectrum/spl2/
├── splectrum/                    ← root node
├── projects/
│   └── 10-dev-env/
│       └── dev/
│           └── v0/
│               ├── splectrum/    ← dev bundle node
│               ├── implementation/
│               └── environments/
│                   └── env-123/
│                       └── modules/
└── splectrum/
    └── ops/
        └── splectrum/            ← sidecar node
```

**Invocation from different locations:**

```bash
# From implementation folder - resolves to dev bundle node
cd /home/herma/splectrum/spl2/projects/10-dev-env/dev/v0/implementation
spl spl/dev/cycle
# → nodeRoot: /home/herma/splectrum/spl2/projects/10-dev-env/dev/v0
# → splectrumDir: .../dev/v0/splectrum

# From repo root - resolves to root node
cd /home/herma/splectrum/spl2
spl spl/dev/deploy
# → nodeRoot: /home/herma/splectrum/spl2
# → splectrumDir: .../spl2/splectrum

# From sidecar folder - resolves to sidecar node
cd /home/herma/splectrum/spl2/splectrum/ops
spl spl/ops/status
# → nodeRoot: /home/herma/splectrum/spl2/splectrum/ops
# → splectrumDir: .../ops/splectrum

# From deep in a project - traverses up to nearest node
cd /home/herma/splectrum/spl2/projects/10-dev-env/dev/v0/implementation/wm_spl_dev/spl/dev
spl spl/dev/cycle
# → nodeRoot: /home/herma/splectrum/spl2/projects/10-dev-env/dev/v0
# → splectrumDir: .../dev/v0/splectrum
```

### Installation

The `spl` command can be:

1. **Symlinked globally:**
   ```bash
   ln -s /home/herma/splectrum/spl2/spl /usr/local/bin/spl
   ```

2. **Added to PATH:**
   ```bash
   export PATH="/home/herma/splectrum/spl2:$PATH"
   ```

3. **Used directly:**
   ```bash
   /home/herma/splectrum/spl2/spl spl/dev/cycle
   ```

The entry point script itself doesn't change - it always resolves the node from the current working directory.

## Script Library

### Concept

Each Splectrum node can have a `scripts/` folder containing reusable scripts. Scripts are resolved with a search path, allowing local scripts to override or extend global ones.

### Directory Structure

```
/home/herma/splectrum/spl2/
├── scripts/                      ← root node scripts (global)
│   ├── deploy-all.js
│   └── cleanup.js
├── splectrum/
└── projects/
    └── 10-dev-env/
        └── dev/
            └── v0/
                ├── scripts/      ← dev bundle scripts (local)
                │   ├── my-workflow.js
                │   └── deploy-all.js   ← overrides global
                └── splectrum/
```

### Script Resolution

When invoking a script by name (not path), search in order:

1. `scripts/` in current node (nodeRoot)
2. `scripts/` in parent nodes (traversing up)
3. Error if not found

```javascript
function resolveScript(scriptName, nodeRoot) {
  // Start from current node, traverse up
  let dir = nodeRoot

  while (dir !== path.dirname(dir)) {
    const scriptPath = path.join(dir, 'scripts', scriptName)

    // Try with and without .js extension
    if (fs.existsSync(scriptPath)) return scriptPath
    if (fs.existsSync(scriptPath + '.js')) return scriptPath + '.js'

    // Check if this dir has splectrum/ (is a node)
    if (fs.existsSync(path.join(dir, 'splectrum'))) {
      dir = path.dirname(dir)
    } else {
      break
    }
  }

  throw new Error(`Script not found: ${scriptName}`)
}
```

### Invocation

```bash
# By name - resolved from script library
spl deploy-all
spl my-workflow --env=prod

# By path - used directly (no resolution)
spl ./scripts/deploy-all.js
spl /absolute/path/to/script.js
```

**Detection:**
- Contains `/` or starts with `.` → path, use directly
- Otherwise → name, resolve from library

### Script Context

Scripts in the library receive the same context as inline scripts:

```javascript
// scripts/deploy-all.js

// Available in scope:
// spl     - programmatic API
// record  - current record
// args    - command line arguments

const envs = ['dev', 'staging', 'prod']

for (const env of envs) {
  console.log(`Deploying to ${env}...`)
  await spl.dev.deploy({ target: env })
}
```

### Built-in Scripts

The root node can include standard utility scripts:

```
splectrum/
└── scripts/
    ├── status.js       # Show node status
    ├── list-methods.js # List available methods
    ├── help.js         # Show help
    └── init.js         # Initialize new node
```

Invoked as:
```bash
spl status
spl list-methods
spl help spl/dev/cycle
```

### Runtime Context

Node resolution populates runtime context in the record:

```javascript
record.headers.spl.runtime = {
  nodeRoot: '/path/where/splectrum/found',   // the node's root directory
  splectrumDir: '/path/to/splectrum',        // the splectrum/ folder
  invokedFrom: process.cwd(),                 // where user ran command
  modulesDir: '/path/to/modules'              // resolved modules location
}
```

**Context-aware behavior:**

Methods can use `invokedFrom` relative to `nodeRoot` to determine context:

```javascript
// In a method
const runtime = record.headers.spl.runtime
const relativePath = path.relative(runtime.nodeRoot, runtime.invokedFrom)

// Are we in implementation/?
const inImplementation = relativePath.startsWith('implementation')

// Are we in an environment?
const inEnvironment = relativePath.includes('environments/')
```

## Invocation Modes

### 1. Single Command CLI

Direct method invocation with key=value arguments.

```bash
./spl spl/dev/cycle --name=env-123
./spl spl/ops/status
./spl spl/dev/deploy --target=./test
```

**Characteristics:**
- First argument is method path (package/api/method)
- Remaining arguments parsed as `--key=value` pairs
- Simple, discoverable, tab-completable
- Good for one-off calls, documentation, CI/hooks

**Parsing:**
- Method path: `args[0]`
- Input object: `{ key: value }` from `--key=value` pairs
- Boolean flags: `--flag` → `{ flag: true }`

### 2. Inline Script

JavaScript code passed directly as argument.

```bash
./spl "await spl.dev.cycle({ name: 'env-123' })"

./spl "
const env = await spl.dev.deploy()
await spl.dev.cycle({ name: env.name })
if (result.passed) {
  await spl.dev.publish({ name: env.name })
}
"
```

**Characteristics:**
- Full JavaScript flexibility
- Access to `spl` programmatic API
- Access to `record` for direct state manipulation
- Good for exploration, multi-step workflows, conditional logic

**Execution context:**
```javascript
// Available in script scope:
spl      // Programmatic API object
record   // Current record with headers/state
args     // Empty object for inline scripts
```

### 3. File Invocation

JavaScript file with optional arguments.

```bash
./spl ./scripts/deploy-all.js
./spl ./scripts/workflow.js --env=production --verbose
./spl ~/my-scripts/cleanup.js --dry-run
```

**Characteristics:**
- Reusable scripts
- Arguments passed to script as `args` object
- Can be version controlled, shared, documented
- Good for repeatable workflows, automation

**File format:**
```javascript
// scripts/workflow.js

// Args available from command line
const { env, verbose } = args

// Programmatic API available
const result = await spl.dev.deploy()

if (verbose) {
  console.log('Deployed:', result)
}

// Can access record directly
record.headers.spl.workflow = { env, result }
```

## Detection Logic

The entry point determines mode by examining the first argument:

```javascript
function detectMode(firstArg) {
  // File invocation: path exists as file
  if (fs.existsSync(firstArg) && fs.statSync(firstArg).isFile()) {
    return 'file'
  }

  // Single command: starts with known package or contains '/'
  if (firstArg.includes('/') && !firstArg.startsWith('.')) {
    return 'command'
  }

  // Inline script: everything else (JS code)
  return 'script'
}
```

**Priority:**
1. Check if file exists → file mode
2. Check if looks like method path → command mode
3. Default → script mode

## Common Infrastructure

All modes share:

### Record Creation

```javascript
const record = {
  headers: {
    spl: {
      request: {
        id: generateId(),
        mode: detectedMode,      // 'command' | 'script' | 'file'
        timestamp: Date.now(),
        completed: false
      },
      runtime: {
        cwd: bundleRoot,
        splectrumDir: splectrumPath,
        invokedFrom: process.cwd()
      }
    }
  },
  value: null
}
```

### Programmatic API

The `spl` object provides fluent access to methods:

```javascript
// Method invocation
await spl.dev.cycle({ name: 'env-123' })
await spl.ops.status()

// API-level state (returns scoped object)
const dev = spl.dev({ mode: 'interactive' })
await dev.cycle()
await dev.publish()

// Chaining
await spl.dev({ mode: 'interactive' }).cycle({ name: 'env-123' })
```

**Implementation:**
```javascript
function createSplApi(record) {
  return new Proxy({}, {
    get(target, pkg) {
      return new Proxy(function(apiState) {
        // Set API-level state
        record.headers.spl[pkg] = { ...record.headers.spl[pkg], ...apiState }
        return createApiProxy(record, pkg)
      }, {
        get(target, api) {
          return createApiProxy(record, pkg)[api]
        }
      })
    }
  })
}

function createApiProxy(record, pkg) {
  return new Proxy({}, {
    get(target, api) {
      return async function(methodInput) {
        // Invoke method with record
        return await invokeMethod(record, `${pkg}/${api}`, methodInput)
      }
    }
  })
}
```

### Event Writing

All invocations write events:

```javascript
async function writeEvent(record) {
  const eventsDir = path.join(runtime.cwd, 'events')
  fs.mkdirSync(eventsDir, { recursive: true })

  const filename = `${record.headers.spl.request.id}.json`
  fs.writeFileSync(
    path.join(eventsDir, filename),
    JSON.stringify(record, null, 2)
  )
}
```

Events written:
- On record creation (request started)
- On completion (success or error)
- Optionally at intermediate points

## Execution Flow

### Single Command

```
./spl spl/dev/cycle --name=env-123
         │
         ▼
    Parse args
         │
         ▼
    Create record with:
    - spl.request.mode = 'command'
    - spl.dev.cycle = { name: 'env-123' }
         │
         ▼
    Invoke spl/dev/cycle handler
         │
         ▼
    Write event
         │
         ▼
    Output result
```

### Inline Script

```
./spl "await spl.dev.cycle({ name: 'env-123' })"
         │
         ▼
    Create record with:
    - spl.request.mode = 'script'
    - spl.request.source = <script text>
         │
         ▼
    Create execution context:
    - spl = programmatic API
    - record = current record
    - args = {}
         │
         ▼
    Execute script (AsyncFunction)
         │
         ▼
    Write event
         │
         ▼
    Output result
```

### File Invocation

```
./spl ./workflow.js --env=prod
         │
         ▼
    Parse file path and args
         │
         ▼
    Create record with:
    - spl.request.mode = 'file'
    - spl.request.source = <file path>
         │
         ▼
    Create execution context:
    - spl = programmatic API
    - record = current record
    - args = { env: 'prod' }
         │
         ▼
    Execute file content (AsyncFunction)
         │
         ▼
    Write event
         │
         ▼
    Output result
```

## API-Level State and Batch

For complex workflows in single command mode, use API handler with batch:

```bash
./spl spl/dev --mode=interactive --batch="cycle; publish"
```

The `spl/dev` API handler:
1. Receives `{ mode: 'interactive', batch: 'cycle; publish' }`
2. Sets `spl.dev.mode = 'interactive'` in record
3. Parses and executes batch methods in sequence
4. Each method inherits API-level state

## Interactive vs Detached Mode

Determined by execution context and set in record:

```javascript
// In runtime setup
const hasImplementation = fs.existsSync(path.join(cwd, 'implementation'))
const inEnvironment = cwd.includes('/environments/')

record.headers.spl.dev = {
  mode: inEnvironment ? 'detached' : (hasImplementation ? 'interactive' : 'detached')
}
```

**Interactive mode** (in dev bundle with implementation/):
- Methods operate on `implementation/` directly
- Changes immediately testable
- No deploy needed for iteration

**Detached mode** (in environment or no implementation/):
- Methods operate on environment's `modules/`
- Isolated snapshot
- Full deploy/cycle/publish workflow

## Output

### Console Output

```javascript
// Success
console.log(JSON.stringify(result.output, null, 2))
process.exit(0)

// Error
console.error(`Error: ${result.error}`)
process.exit(1)
```

### Programmatic Return

Scripts can capture results:

```javascript
// In script
const result = await spl.dev.cycle({ name: 'env-123' })
// result = { passed: true, ... }
```

## Future Considerations

### REPL Mode

```bash
./spl --repl
spl> await spl.dev.deploy()
{ name: 'env-123', ... }
spl> await spl.dev.cycle({ name: 'env-123' })
{ passed: true, ... }
```

### Pipe Support

```bash
echo '{"name":"env-123"}' | ./spl spl/dev/cycle
cat workflow.js | ./spl -
```

### Watch Mode

```bash
./spl --watch spl/dev/cycle --name=env-123
# Re-runs on file changes
```

---

## Implementation Plan

1. Update `spl.mjs` with mode detection
2. Implement script execution context
3. Create programmatic API (`createSplApi`)
4. Add event writing
5. Update existing methods to read state from record
6. Test all three modes

## Relationship to Existing Code

- `spl.mjs` - needs rewrite for triple mode
- `run.js` - mostly unchanged, still handles method dispatch
- Method handlers - unchanged, already read from record
- `spl/dev` API handler - add batch support
