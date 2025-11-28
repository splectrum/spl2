# Node Structure Design

**Project:** 10 - Dev Env v0 Bundle Continued
**Created:** 2025-11-27
**Status:** Working document - to be formalized at project closure

---

## Overview

A Splectrum node is a self-describing, self-similar structure that follows the **mycelium web pattern**: the same structural conventions cascade from repository level down to individual folders.

## Core Principle: Self-Similar Structure

Every structural folder follows the same pattern:

```
<folder>/
├── README.md              # Natural language - what is this?
├── README.json            # Machine-readable metadata
└── _reqs/                 # Requirements (when meaningful)
    └── <req-name>_v1.0.0.md
```

This pattern applies at every level:
- Repository
- Node
- Structural folder
- Module
- Method

**Benefits:**
- Any point in the tree can describe itself to humans and machines
- Tools know exactly what to look for at each level
- Navigation is implicit in the structure
- Self-documenting at every scale

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
│       ├── index.js         # App entry point
│       ├── scripts/         # POC scripts (if POC)
│       ├── config/          # App configuration
│       ├── state/           # Persistent app state
│       ├── requests/        # Request/response DCEs
│       └── channel/         # External communication
│
├── runtime/                 # Node runtime state
│   ├── README.md
│   ├── README.json
│   ├── cli-static/          # Session for cli-static (no instance)
│   │   └── ...
│   ├── system/              # Background maintenance
│   └── boot/                # Bootstrap
│
├── lib/                     # Library files
│   ├── core.js → symlink    # Module lib
│   ├── overlay.js → symlink # Module lib
│   └── moduleBootstrap.js   # Real file - bootstrap layer
├── modules/                 # Installed modules
│
├── spl.mjs                  # Entry point implementation
└── run.js                   # Method runner (to be replaced by requireSpl)
```

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
Library files and symlinks:
- **Symlinks** - `core.js`, `overlay.js` → point to module _lib folders
- **Real files** - `moduleBootstrap.js` → bootstrap layer (cannot be in module)

`moduleBootstrap.js` provides `requireSpl()` - resolves module, imports, wraps with createSpl. Must be real file because it enables module loading (chicken-egg).

### modules/
Installed modules containing method implementations.

### _reqs/
Requirements pertaining to this folder/level. Internal-facing documentation included for completeness.

## App Model

An **app** is a portable, self-contained definition:

```
apps/my-app/
├── README.md
├── README.json
├── index.js             # App entry point
├── scripts/             # POC implementation scripts (if POC)
├── config/              # App configuration
├── state/               # Persistent app state
├── requests/            # Request/response DCEs
└── channel/             # External communication
```

**Session lives in runtime, not in app:**

```
runtime/
├── my-app/              # Session for app without instances
│   └── ...
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
| requests/ | Request/response DCEs (FAF writes) |
| channel/ | How it communicates externally |

### Module Resolution

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

**Key points:**
- Type modules only at node level (foundation)
- App has work modules and base modules only
- Request carries origin app → session uses correct stack
- App flags `appModuleOverride: true` in runtime metadata
- Override affects both app and session (whole realm)
- Default: node stack only

**Prerequisite:** App override assumes node modules folder contains a type module.

**Graduation path:**
```
app/scripts/faf.js        # POC freestyle
  ↓ formalize
app/modules/bm_faf/       # Work module in app
  ↓ promote
node/modules/bm_faf/      # Work module at node level
```

**Benefits:**
- Apps formalize at their own pace without dev bundle
- Production nodes can evolve in-place
- Proper pathway for flexible implementation (no corner cutting)
- POC → work module → promoted, all within app context

### Session Structure

Session lives in `runtime/[app]/` (or `runtime/[app]/[instance]/` for instanced apps).

**Session interface:**
- **In:** inbox
- **Out:** outbox

Everything else is internal to the session.

**Request processing structure:**

```
runtime/cli-static/
└── requests/                # User request processing
    ├── inbox/               # Incoming from app (FAF)
    ├── processing/          # Being worked on
    ├── outbox/              # Complete, waiting for app
    └── scripts/             # Handler scripts (freestyle, encapsulated)
        ├── inbox.js         # Picks inbox → FAF to processing
        └── process.js       # Kicks steps → FAF to outbox when done
```

**Flow:**
1. App FAF writes to inbox
2. Handler picks from inbox → FAF to processing
3. Handler kicks processing steps until complete
4. Complete → FAF to outbox
5. App watches outbox, picks up response

**Handler characteristics:**
- Stateless - watches, processes, moves on
- Three-part separation: initiation / ongoing / completion
- Self-contained: scripts live within session structure

**Other session structures** (housekeeping, audit, etc.) will be added as separate folders within the session when needed.

### Apps vs Runtime

**apps/** = External facing
- Request context on the way in (who/what is asking, their state, their config)
- Response context on the way out (where to route results, how to format)
- Persistent across requests
- "The world talking to splectrum"

**runtime/** = Internal facing
- Node-level processes (boot, system maintenance)
- Not scoped to any particular app
- "Splectrum infrastructure"

### Request Flow

```
[External]              [App]                    [External]
    │                     │                          │
    ▼                     ▼                          ▼
 Request ───► apps/my-app/ ───► processing ───► apps/my-app/
              ├── config/                        └── channel/
              ├── state/                             └── (response routing)
              └── session/
                  └── requests/
```

The app shapes what goes in and what comes out.

### Apps as Integration Adapters

Apps can bridge splectrum to external systems:

| App | Channel | Use case |
|-----|---------|----------|
| cli | local filesystem | Default interactive use |
| git-sync | Git repository | Version-controlled workflows |
| s3-archive | S3 bucket | Cloud backup of request history |
| webhook | HTTP endpoints | Notify external services |

An app can:
- Pull state from external source on request
- Push results to external destination on response
- Maintain sync between local state and remote

### Default App

The CLI itself is an app - `apps/cli/`. This is the default for interactive `spl` commands.

**For now:** Implement `apps/cli/` only. Others added when needed.

## data/ vs runtime/

| Aspect | data/ | runtime/ |
|--------|-------|----------|
| Lifetime | Persistent | Transient (session lifetime) |
| Purpose | Node memory | Working state |
| Contents | Config, cache, indexes | Request queues, events |
| Survives restart | Yes | Maybe (audit logs) |

## Separation: data/ vs modules/

- **modules/** = Code (method implementations)
- **data/** = State (no code)

API state structures could theoretically be stored in data/, but API state persistence is transient (lifetime of pipeline). To be explored further.

## Node Identification

A directory is a Splectrum node if it contains:
- `package.json` with `"name": "splectrum"`

This allows node resolution: traverse up from cwd until finding a valid node.

## Entry Point

### Global Command

The `spl` command is added to PATH and can be invoked from anywhere:

```bash
export PATH="/home/herma/splectrum/spl2:$PATH"
```

The entry point (`spl` shell script) hands off to `splectrum/spl.mjs`.

### Node Resolution

When invoked, `spl` traverses up from the current directory to find the nearest Splectrum node (directory containing `splectrum/` with `package.json` where `name: "splectrum"`).

```
/home/user/project/deep/nested/folder
         ↑ search upward
/home/user/project/splectrum/  ← found! This is the node
```

This allows:
- Invoke from anywhere within a node's tree
- Inner nodes override outer nodes (dev bundles in projects)
- Same command, context-aware behavior

### Invocation Modes

From any location under a node:

```bash
# Command mode (default) - package/api/method
spl spl/dev/cycle --name=env-123

# Library mode - scripts from splectrum/scripts/
spl status

# File mode - explicit path
spl ./my-script.js --arg=value

# Inline mode - requires /* preamble
spl "/* */ console.log(runtime.nodeRoot)"
```

### Mode Detection

Detection order:
1. Starts with `./`, `../`, or absolute path → **file mode**
2. Starts with `/*` → **inline script mode**
3. Found in `splectrum/scripts/` → **library mode**
4. Default → **command mode**

### Runtime Context

On invocation, runtime context is captured upfront (WYSIWI):

```javascript
const runtime = {
  cwd: nodeRoot,              // Where splectrum/ was found
  nodeRoot: nodeRoot,         // Alias
  splectrumDir: splectrumDir, // The splectrum/ folder
  invokedFrom: process.cwd(), // Where user ran command
  mode: detected.mode,        // command|library|file|script
  globalSplectrumDir: __dirname
}
```

### Argument Parsing

```bash
spl spl/dev/deploy --name=env-123 --verbose
```

Parsed as:
```javascript
{
  _positional: [],
  name: "env-123",
  verbose: true
}
```

- `--key=value` → `{ key: "value" }`
- `--flag` → `{ flag: true }`
- Non-flag arguments → `_positional` array

### Script Context

Scripts (library, file, inline) receive:

```javascript
// Available in script scope:
spl      // Programmatic API: spl.dev.cycle({ name: 'env' })
args     // Parsed arguments
runtime  // Runtime context
fs       // Node fs module
path     // Node path module
console  // Console for output
```

## WYSIWI and Event Persistence

"What You See Is What Is" - all relevant state captured in request records.

- Every request writes to `apps/<app>/session/requests/`
- Record contains: request ID, timestamp, runtime context, input, output
- Enables: audit trail, debugging, replay, analysis

## Open Questions

1. **Request cleanup policy** - Handled by session's scheduled tasks. Details TBD.
2. **README.json schema** - What fields are standard across all levels?
3. **_reqs/ everywhere?** - Only where meaningful contracts exist, or consistent pattern?

---

## Implementation Status

- [x] Node identification (package.json with name: "splectrum")
- [x] Script library (splectrum/scripts/)
- [x] Entry point with mode detection (spl.mjs)
- [ ] README.md/README.json at each level
- [ ] data/ folder
- [ ] apps/ folder structure
- [ ] apps/cli/ - default CLI app
- [ ] Event persistence to apps/cli/session/requests/
- [ ] runtime/ folder structure (system, boot)

---

## References

- SESSION_6_DISCUSSION.md - WYSIWI principle, implementation plan
- ENTRY_POINT_DESIGN.md - Entry point and invocation modes
