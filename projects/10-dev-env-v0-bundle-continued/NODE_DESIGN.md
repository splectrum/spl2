# Node Design

**Project:** 10 - Dev Env v0 Bundle Continued
**Created:** 2025-11-26 (merged 2025-11-30)
**Status:** Design document - input for API Design Documentation project
**Source:** Merged from SPLECTRUM_NODE_DESIGN.md and NODE_STRUCTURE_DESIGN.md

---

## Overview

A Splectrum node is a self-describing, self-similar structure that follows the **mycelium web pattern**: the same structural conventions cascade from repository level down to individual folders.

This document covers:
- Node identification and structure
- Repository-level deployment (root node, sidecar, dev nodes)
- App model and session architecture
- Entry point and invocation
- Version management

---

## Core Principle: Self-Similar Structure

Every structural folder follows the same pattern:

```
<folder>/
├── README.md              # Natural language - what is this?
├── README.json            # Machine-readable metadata
└── _reqs/                 # Requirements (when meaningful)
    └── <req-name>_v1.0.0.md
```

This pattern applies at every level: repository, node, structural folder, module, method.

**Benefits:**
- Any point in the tree can describe itself to humans and machines
- Tools know exactly what to look for at each level
- Navigation is implicit in the structure
- Self-documenting at every scale

---

## Node Identification

A directory is a Splectrum node if it contains:
- `package.json` with `"name": "splectrum"`

This allows node resolution: traverse up from cwd until finding a valid node.

---

## Repository Structure

```
spl2/
├── spl                          # Entry point (shell wrapper → splectrum/)
├── splectrum/                   # Root node (production)
│   ├── spl.mjs                  # CLI implementation
│   ├── run.js                   # Core runner
│   ├── package.json
│   ├── lib/                     # Library files
│   ├── node_modules/lib/        # Re-exports for clean imports
│   ├── modules/
│   │   ├── bm_spl/              # Active base module (symlink → versions/)
│   │   └── versions/            # Version history
│   │       ├── bm_spl-1764157292442/
│   │       └── bm_spl-{previous}/
│   └── ops/                     # Sidecar node (operations)
│       ├── spl                  # Local entry point
│       ├── spl.mjs
│       ├── run.js
│       ├── package.json
│       ├── lib/
│       ├── node_modules/lib/
│       └── modules/
│           └── bm_spl_ops/      # Ops-only module
├── projects/
│   └── NN-xxx/dev/v0/           # Development bundles
│       ├── implementation/
│       │   ├── types/
│       │   ├── wm_spl_dev/      # Work in progress
│       │   └── bm_spl/          # Upgrade candidate
│       ├── environments/
│       └── spl                  # Local entry point (dev)
└── ...
```

---

## Node Structure

```
splectrum/                   # The node (identified by package.json with name: "splectrum")
├── README.md                # Node overview
├── README.json              # Node metadata
├── package.json             # Node identifier
├── _reqs/                   # Node-level requirements
│
├── docs/                    # Additional documentation
│   ├── README.md
│   └── README.json
│
├── scripts/                 # Script library
│   ├── README.md
│   ├── README.json
│   ├── _reqs/
│   ├── status.js
│   ├── help.js
│   └── list-methods.js
│
├── data/                    # Local node repository (persistent)
│   ├── README.md
│   └── README.json
│
├── apps/                    # User-facing apps (portable definitions)
│   ├── README.md
│   ├── README.json
│   └── cli-static/          # Default CLI app
│       ├── README.md
│       ├── README.json
│       ├── spl.mjs          # App entry point
│       ├── app.mjs          # App implementation
│       ├── scripts/         # POC scripts (if POC)
│       ├── config/          # App configuration
│       ├── state/           # Persistent app state
│       └── channel/         # External communication
│
├── runtime/                 # Node runtime state
│   ├── README.md
│   ├── README.json
│   ├── cli-static/          # Session for cli-static
│   │   ├── inbox/           # Incoming requests
│   │   ├── processing/      # Being worked on
│   │   └── outbox/          # Complete, waiting for app
│   ├── system/              # Background maintenance
│   └── boot/                # Bootstrap
│
├── lib/                     # Library files
│   └── moduleBootstrap.js   # Bootstrap layer (real file)
│
├── modules/                 # Installed modules
│
├── spl.mjs                  # Entry point implementation
└── run.js                   # Method runner
```

---

## Folder Purposes

### docs/
Additional documentation beyond README.md. Design docs, guides, etc.

### scripts/
Script library for the node. Scripts are invoked by name:
```bash
spl status
spl help
```

### data/
Persistent node-local storage. Config, cache, indexes, etc. Survives restarts - the node's "memory".

### apps/
User-facing applications. Each app is a self-contained unit bundling everything needed for a particular use case or integration.

### runtime/
Node runtime state. Contains:
- **App sessions** - `runtime/[app]/` or `runtime/[app]/[instance]/`
- **System processes** - boot, background maintenance

Sessions are runtime state, not part of the portable app definition.

### lib/
Bootstrap layer. `moduleBootstrap.js` provides `requireSpl()` - resolves module, imports, wraps with createSpl. Must be real file because it enables module loading (chicken-egg).

### modules/
Installed modules containing method implementations.

---

## Node Types

### Root Node (`splectrum/`)

The primary Splectrum node. User-facing, production.

**Entry point:** `./spl` (repo root)

**Contains:**
- All production APIs (`spl/dev`, `spl/runtime`, `spl/request`, future APIs)
- Version history for rollback capability

**Invocation:**
```bash
./spl spl/dev/deploy              # Create dev environment
./spl spl/dev/cycle               # Run tests
./spl spl/dev/publish             # Create upgrade candidate
```

### Ops Sidecar (`splectrum/ops/`)

Minimal node dedicated to managing the root node. Independent process.

**Entry point:** `./splectrum/ops/spl`

**Contains:**
- `spl/ops` API only (upgrade, rollback, status, list)
- Minimal footprint, rarely changes

**Invocation:**
```bash
./splectrum/ops/spl spl/ops/status                    # Show root node status
./splectrum/ops/spl spl/ops/upgrade --candidate=...   # Deploy to root
./splectrum/ops/spl spl/ops/rollback                  # Revert to previous
./splectrum/ops/spl spl/ops/list                      # Show versions
```

**Why sidecar?**
- Independent from root - can fix root if broken
- No bootstrap paradox - doesn't manage itself
- Direct filesystem access to `../modules/`

### Dev Nodes (`projects/NN-xxx/dev/v0/`)

Isolated development environments within projects.

**Entry point:** `./spl` (within dev bundle)

**Contains:**
- Work module (`wm_*`) in development
- Local splectrum install for testing
- Types for development

---

## App Model

An **app** is a portable, self-contained definition:

```
apps/my-app/
├── README.md
├── README.json
├── spl.mjs              # Entry point shell (thin, standard)
├── app.mjs              # Implementation (name, help, handle)
├── scripts/             # POC implementation scripts (if POC)
├── config/              # App configuration
├── state/               # Persistent app state
└── channel/             # External communication
```

**Session lives in runtime, not in app:**

```
runtime/
├── my-app/              # Session for app without instances
│   ├── inbox/
│   ├── processing/
│   └── outbox/
└── other-app/
    ├── instance-1/      # Session for instance 1
    └── instance-2/      # Session for instance 2
```

### App vs Session

| Location | Contains | Nature |
|----------|----------|--------|
| apps/my-app/ | App definition | Portable, installable |
| runtime/my-app/ | Session state | Node-specific, runtime |

### App Components

| Component | Purpose |
|-----------|---------|
| config/ | How the app is set up |
| state/ | What the app remembers (persistent across requests) |
| channel/ | How it communicates externally |

### Apps vs Runtime

**apps/** = External facing
- Request context on the way in (who/what is asking, their state, their config)
- Response context on the way out (where to route results, how to format)
- "The world talking to splectrum"

**runtime/** = Internal facing
- Node-level processes (boot, system maintenance)
- Not scoped to any particular app
- "Splectrum infrastructure"

### Module Resolution with App Override

Apps can override node modules for formalization-in-place.

**Resolution stack (top to bottom):**

```
App stack (if override mode):
  - App work modules (bm_*)
  - App base modules (b_*)

Node stack:
  - Node work modules (bm_*)
  - Node base modules (b_*)
  - Node type modules (t_*)
```

**Graduation path:**
```
app/scripts/faf.js        # POC freestyle
  ↓ formalize
app/modules/bm_faf/       # Work module in app
  ↓ promote
node/modules/bm_faf/      # Work module at node level
```

---

## Entry Point

### Global Command

The `spl` command is added to PATH and can be invoked from anywhere:

```bash
export PATH="/home/herma/splectrum/spl2:$PATH"
```

The entry point (`spl` shell script) hands off to `splectrum/spl.mjs`.

### Node Resolution

When invoked, `spl` traverses up from the current directory to find the nearest Splectrum node.

```javascript
function resolveNode(startDir) {
  let dir = startDir

  while (dir !== path.dirname(dir)) {  // not at root
    const splectrumPath = path.join(dir, 'splectrum')
    if (fs.existsSync(splectrumPath) && fs.statSync(splectrumPath).isDirectory()) {
      return {
        nodeRoot: dir,
        splectrumDir: splectrumPath
      }
    }
    dir = path.dirname(dir)
  }

  throw new Error('No splectrum/ node found in directory tree')
}
```

### Invocation Modes

Four invocation modes:

1. **Command mode** (default) - `spl spl/dev/cycle --name=env-123`
2. **Library mode** - `spl status --verbose`
3. **File mode** - `spl ./workflow.js --arg=value`
4. **Inline script mode** - `spl "/* */ console.log(runtime.nodeRoot)"`

**Detection order:**
1. Starts with `./`, `../`, or absolute path → **file mode**
2. Starts with `/*` → **inline script mode**
3. Script name found in `splectrum/scripts/` → **library mode**
4. Default → **command mode**

### Runtime Context

On invocation, runtime context is captured upfront (WYSIWI):

```javascript
const runtime = {
  cwd: nodeRoot,              // Where splectrum/ was found
  nodeRoot: nodeRoot,         // Alias
  splectrumDir: splectrumDir, // The splectrum/ folder
  invokedFrom: process.cwd(), // Where user ran command
  mode: detected.mode         // command|library|file|script
}
```

---

## APIs

### spl/dev (Root Node)

Development workflow management.

| Method | Purpose |
|--------|---------|
| `deploy` | Create dev environment from implementation |
| `prepare` | Build hierarchy.json |
| `test` | Run selfevals |
| `cycle` | prepare + test |
| `publish` | Create timestamped artifacts |
| `upgrade` | Install module to local splectrum |
| `clone` | Clone dev bundle to new location |
| `destroy` | Remove environments |

### spl/ops (Sidecar Only)

Root node operations.

| Method | Purpose |
|--------|---------|
| `status` | Show current version, health check |
| `upgrade` | Deploy candidate to root node |
| `rollback` | Revert to previous version |
| `list` | Show available versions |

---

## Version Management

### Symlink Pattern

```
splectrum/modules/
├── bm_spl -> versions/bm_spl-1764157292442   # Symlink to active
└── versions/
    ├── bm_spl-1764157292442/                  # Current
    ├── bm_spl-1764150000000/                  # Previous
    └── bm_spl-1764140000000/                  # Older
```

**Benefits:**
- Atomic switch (symlink update)
- Instant rollback
- Version history preserved
- Clear audit trail

### Version Retention

Keep N versions (configurable, default 5). Prune old versions on upgrade.

---

## Development Workflow

```
1. Developer works in project dev bundle
   └── projects/NN-xxx/dev/v0/

2. Test locally
   └── ./spl spl/dev/cycle

3. Publish candidate
   └── ./spl spl/dev/publish
   └── Creates: implementation/bm_spl-{timestamp}/

4. Upgrade root node (via sidecar)
   └── ./splectrum/ops/spl spl/ops/upgrade --candidate=projects/.../bm_spl-{ts}
   └── Copies to splectrum/modules/versions/
   └── Updates symlink splectrum/modules/bm_spl

5. Root node now has new capabilities
   └── ./spl spl/new/feature
```

---

## Bootstrap Layer

`lib/moduleBootstrap.js` is a real file (not symlink) that provides:

```javascript
// Splectrum libs/modules (async, bound to record)
const cli = await requireSpl('lib/spl/cli', record)

// Platform modules (sync, registered)
const fs = requireNonSpl('fs')
```

**requireSpl(uri, record):**
- `lib/spl/cli` → resolves to `modules/bm_spl/spl/cli/_lib/cli.js`
- Calls `mod.create(record, { requireNonSpl })` - injects dependencies
- Returns bound object

**requireNonSpl(moduleName):**
- Sync lookup from pre-loaded registry
- Must be registered (enforces explicit dependencies)
- Ready for Bare platform switch

```javascript
const platformModules = {
  'fs': fsModule,     // later: 'bare-fs' on Bare
  'path': pathModule  // later: 'bare-path' on Bare
}
```

---

## data/ vs runtime/

| Aspect | data/ | runtime/ |
|--------|-------|----------|
| Lifetime | Persistent | Transient (session lifetime) |
| Purpose | Node memory | Working state |
| Contents | Config, cache, indexes | Request queues, events |
| Survives restart | Yes | Maybe (audit logs) |

---

## Gitignore

```gitignore
# Root node generated
/splectrum/lib/
/splectrum/node_modules/
/splectrum/ops/lib/
/splectrum/ops/node_modules/

# Environments (all dev bundles)
**/dev/v*/environments/
**/dev/v*/splectrum/
**/dev/v*/spl
```

**Tracked:**
- `splectrum/modules/` - production modules
- `splectrum/ops/modules/` - ops module
- `splectrum/spl.mjs`, `run.js`, `package.json` - infrastructure

---

## References

- ENTRY_POINT_DESIGN.md - Detailed entry point and invocation modes
- CONSUMER_DESIGN.md - Session inbox/outbox consumer pattern
- EVENT_STORAGE_DESIGN.md - Data change event principles
