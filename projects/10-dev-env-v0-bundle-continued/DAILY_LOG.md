# Daily Log

## 2025-11-26

### Session Start

**Context:** Starting Project 10 - Dev Env v0 Bundle Continued

**Project Type Discovery:**
- Applied autonomy criterion from create project howto
- Backlog item has no explicit Type field
- Question: Can work be executed autonomously from existing reqs? **No**
- Core APIs and library functions need to be discovered through iteration
- Conclusion: **exploration project**

**Howto Evolution:**
- Updated `create project` howto to v1.2.0
- Added project type recipe with autonomy criterion
- Recipe serves dual purpose: discover when not specified, validate when specified
- New req created in this project folder

**For Project Closure:**
- create_project_v1.2.0.md created (howto evolution)
- blank_project_v1.2.0.md created (added reqs/ folder to project artifacts)

---

### Clone Script Improvement

**Completed:** clone.js now auto-detects project number and accepts optional arguments:
- `node clone.js <path> [name] [description]`
- Auto-detects project from path pattern `projects/NN-name/dev/`
- Updates package.json name, version, and description automatically

---

### Iteration Plan: spl/dev/clone and Splectrum Install

**Goal:** Gradual self-hosting - use Splectrum to manage Splectrum

**Naming Convention:**
- `bm_` prefix: base module (infrastructure, Layer 0)
- `wm_` prefix: work module (development)
- Example: `bm_spl_dev`, `wm_spl_dev`

**Install Structure:**
```
dev/v0/
├── spl               # Entry script (#!/usr/bin/env node, executable)
├── clone.js          # Legacy script (thin wrapper → spl dev/clone)
├── splectrum/        # Splectrum install
│   ├── package.json
│   ├── node_modules/
│   ├── lib/
│   ├── modules/
│   └── run.js
├── implementation/   # Source modules
│   ├── types/
│   ├── work_module/
│   └── wm_spl_dev/
└── environments/
```

**Invocation:** `./spl spl/dev/clone --path=../v1.0`

**Version Plan:**

| Step | Version | Deliverable | Status |
|------|---------|-------------|--------|
| 1 | v0.0 | Create wm_spl_dev with spl/dev/clone method | DONE |
| 2 | v0.0 | Test via handler invocation | DONE |
| 3 | v0.1 | Design splectrum/ install structure + spl entry point | DONE |
| 4 | v0.1 | Create upgrade.js (default bundle root, optional path arg) | DONE |
| 5 | v0.1 | Test upgrade.js with custom path | DONE |
| 6 | v0.1 | Run upgrade.js to install at bundle root | DONE |

---

### Upgrade Script Plan

**Purpose:** Bundle upgrade - creates splectrum install with spl entry point

**Usage:**
```bash
node upgrade.js              # Default: install to bundle root (../../)
node upgrade.js ./test-spl   # Custom path for testing
```

**What upgrade.js creates:**

```
<target>/
├── spl                    # Entry point (#!/usr/bin/env node, executable)
└── splectrum/
    ├── package.json
    ├── node_modules/lib/  # lib resolution (re-exports)
    ├── lib/               # symlinks to module _lib/
    ├── modules/
    │   └── wm_spl_dev/    # copied from implementation/
    └── run.js             # (future: core runner)
```

**spl entry point:**
- Parses `api/method` or `package/api/method`
- Defaults package to `spl` for short form
- Finds method in modules/
- Builds record with input from CLI args
- Runs handle(), reports result

**Implementation strategy discovered:**
- Methods output stats (files/folders/size) for verification
- Selfeval is test harness, not validator
- Selfeval verifies independently (doesn't trust method output)
- Context-dependent tests can be skipped
- Clone copies current location to destination (context-agnostic)

---

### Session 2 - Upgrade Script Implementation (v0.1)

**Completed:** Steps 3-6 of version plan

**Key decisions:**
1. **Fully-specified method paths** - No defaulting package to `spl`, require `spl/dev/clone` not `dev/clone`. Visibility over convenience in core code.
2. **Shell wrapper pattern** - `spl` (shell script) → `splectrum/spl.mjs` (ES module). Hides .mjs extension from users.
3. **Runtime in record** - Runtime properties (cwd, splectrumDir, invokedFrom) passed in `spl.runtime` headers, not via `process.cwd()`. Methods depend only on record contents.
4. **Bundle root as runtime.cwd** - The `spl` entry point at bundle root sets `runtime.cwd` to its own directory. All paths relative from there.

**Installed structure:**
```
project-root/
├── spl                   # shell wrapper (executable)
└── splectrum/
    ├── spl.mjs           # CLI implementation (ES module)
    ├── run.js            # core runner
    ├── package.json
    ├── lib/              # symlinks to module _lib/
    ├── node_modules/lib/ # re-exports for clean imports
    └── modules/
        └── wm_spl_dev/
```

**Usage:** `./spl spl/dev/clone --path=./target`

---

### Session 3 - API Namespace Model and spl/dev Methods

**Design work completed:**
- API_NAMESPACE_MODEL.md - APIs contain properties + methods in same namespace
- state.avsc (internal) + metastate.avsc (public subset) on branch nodes
- Updated types/branch to v1.1.0, types/api to v1.1.0
- Created spl/runtime and spl/request APIs with metastate schemas
- Full req audit for all work module nodes (added selfevals, constraints)

**Key decisions:**
- metastate is subset of state (when both exist)
- APIs can start metastate-only, add state.avsc when needed
- Sync handled by simple loop at appropriate moment

**PROJECT_PLAN.md created** - was missing from project initiation

**Started spl/dev method migration:**
- Goal: Self-hosting - use Splectrum to manage dev bundle
- Methods to implement: deploy, prepare, test, cycle, publish, destroy, upgrade
- Deployed dev environment: env-1764151558962

**spl/dev/deploy implemented** in environment:
- Created README.json, req, and index.js
- Uses runtime.cwd for path resolution

**Blocking issue discovered:**
- prepare.js hardcodes `work_module` but deploy.js uses `wm_*` pattern
- Scripts need updating to find wm_* dynamically
- This affects prepare.js, test.js, publish.js

**Next steps:**
1. Fix prepare.js to find wm_* pattern (line 63)
2. Continue implementing spl/dev methods in environment
3. Publish back, upgrade, test

---

### Session 4 - Self-Hosting Complete

**Module Management Model Simplified:**

Discussion established simplified model for module management:
- Single monolithic `bm_spl` module containing all API code
- Small `wm_*` work modules for additions/fixes, merged into base on completion
- Versioning at codebase level (git), not module level
- No registry needed yet - implementation/ suffices

**Publish behavior (dual output):**
- `wm_*-{timestamp}` - Standalone snapshot of work module (types flattened)
- `bm_*-{timestamp}` - Work module merged into base module (types flattened)
- Active versions (`wm_*`, `bm_*`) untouched until manual promotion
- Promotion: `cp -r bm_spl-{ts} bm_spl`

**spl/dev methods implemented:**

| Method | Purpose |
|--------|---------|
| `deploy` | Create env from implementation (wm_* + types) |
| `prepare` | Build hierarchy.json |
| `test` | Run selfevals (stops on first failure, or --continueOnFailure) |
| `cycle` | prepare + test |
| `publish` | Create timestamped wm_* and bm_* artifacts |
| `upgrade` | Install bm_spl to splectrum/ |

**Self-hosting achieved:**

```bash
./spl spl/dev/deploy                      # Create environment
./spl spl/dev/cycle --name=env-*          # prepare + test
./spl spl/dev/publish --name=env-*        # Create artifacts
# Manual: cp -r bm_spl-{ts} bm_spl        # Promote
./spl spl/dev/upgrade                     # Install to splectrum/
```

**Test results:** 17 selfevals pass, 0 fail

**Clone selfeval disabled:**
- Clone tests require bundle root context (package.json present)
- When run from environment, context is wrong
- Disabled with explanation in output - not a real failure

**Structure after upgrade:**
```
dev/v0/
├── spl                      # Entry point (works!)
├── splectrum/
│   └── modules/bm_spl/      # Deployed standalone module
├── implementation/
│   ├── types/
│   ├── wm_spl_dev/          # Active work module
│   ├── wm_spl_dev-{ts}/     # Timestamped snapshots
│   ├── bm_spl/              # Active base module
│   └── bm_spl-{ts}/         # Timestamped releases
└── environments/
    └── env-1764151558962/   # Development environment
```

**Next:** Discussion about repo-wide `./spl` entry point

---

### Session 4 (continued) - Splectrum Node Design

**Design discussion:**
- Central `./spl` entry point at repo root
- Root node in `splectrum/` spot
- Ops sidecar in `splectrum/ops/` for safe upgrade/rollback
- Dev bundles in projects remain isolated workbenches

**Key decisions:**
- Symlink version pattern: `bm_spl -> versions/bm_spl-{ts}`
- Sidecar manages root node (no bootstrap paradox)
- Sidecar as subfolder of splectrum/ (not separate top-level spot)

**Design doc created:** `SPLECTRUM_NODE_DESIGN.md`

**Gap analysis:**

Already have:
- spl/dev API: deploy, prepare, test, cycle, publish, upgrade, clone

Need for repo-wide deployment:
- Update spl/dev/upgrade for symlink version pattern
- Root node install script
- spl/ops API: status, upgrade, rollback, list
- Sidecar bootstrap

**Plan:**
1. Implement minimum for repo-wide deployment (this project)
2. Deploy configuration
3. Close project
4. New project from same backlog item for remaining work
5. Working with repo-wide nodes will validate stability

**Next session:**
- Implement symlink version pattern in upgrade
- Create root node install
- Create sidecar with spl/ops API
- Deploy and test

---

### Session 5 - Splectrum Node Deployment Complete

**Implemented:**
- Symlink version pattern in `spl/dev/upgrade`
  - Modules stored in `versions/bm_spl-{timestamp}/`
  - Symlink `bm_spl -> versions/bm_spl-{timestamp}`
  - Keeps last 5 versions, prunes old ones
  - Handles legacy directory → symlink migration

- Root node installed at `spl2/splectrum/`
  - Using `./spl spl/dev/upgrade --target=../../../..` from dev bundle

- Sidecar installed at `spl2/splectrum/ops/`
  - Separate `bm_spl_ops` module with spl/ops API only
  - Manages root node from independent process

- spl/ops API methods:
  - `status` - show root node state, active version, symlink health
  - `list` - show available versions with timestamps
  - `upgrade` - deploy candidate to root node
  - `rollback` - revert to previous version

**Process issues identified:**
- Wrote code directly to implementation/ instead of environment (wrong)
- Clone selfeval failing - needs proper runtime context in record
- Event records not visible - handler shortcuts lose traceability
- Handcrafted records in selfevals bypass runtime path

**Corrected workflow (followed for spl/ops):**
1. Create work module structure in implementation/ (folders, README.json)
2. Deploy environment
3. Implement in environment
4. Cycle until tests pass
5. Publish back to implementation/
6. Promote and upgrade

**Design discussion: Entry Point**

Problem: Implementation workflow feels like overhead during exploration.

Root cause: Creating structure and implementing at same time (interactive exploration) vs implementing from finished spec (autonomous execution).

**Solution: Interactive mode**
- Work directly in `implementation/` when in dev bundle
- `spl/dev/cycle` from bundle root runs against implementation (interactive)
- `spl/dev/cycle` from environment runs against modules (detached)
- Context determines mode automatically (no flag needed)
- API-level state set at record creation, not runtime detection

**Entry Point Design (ENTRY_POINT_DESIGN.md):**

Triple mode invocation:
1. Single command CLI: `spl spl/dev/cycle --name=env-123`
2. Inline script: `spl "await spl.dev.cycle({ name: 'env-123' })"`
3. File invocation: `spl ./workflow.js --env=prod`

Node resolution:
- `spl` command finds nearest `splectrum/` traversing up from cwd
- Like `node_modules` resolution
- Can invoke from anywhere within node's directory tree

Script library:
- `scripts/` folder at node root
- Local scripts override parent scripts
- Resolved by name: `spl deploy-all`

Programmatic API:
- `spl.dev.cycle({ name: 'env-123' })`
- API-level state: `spl.dev({ mode: 'interactive' }).cycle()`
- Full JS flexibility in scripts

**Files created:**
- `ENTRY_POINT_DESIGN.md` - full design doc

**Committed:** Session 5 work + entry point design

**Implementation experience discussion:**

The session exposed friction between how the workflow is designed and how exploration actually happens:

1. **Rushing leads to shortcuts** - Speed pressure caused bypassing the proper workflow (writing directly to implementation/ instead of environment). This loses traceability and breaks tests.

2. **"Discipline problem" reframed** - Rather than requiring discipline to follow the workflow, the preferred way should be the easiest way. If the workflow feels like overhead, that's a design signal.

3. **Exploring vs implementing** - Two distinct modes:
   - *Implementing from finished spec*: Structure defined, requirements clear. Deploy/cycle/publish makes sense - you're verifying against spec.
   - *Interactive exploration*: Discovering design through implementation. Structure evolves. The environment isolation adds friction.

4. **Solution insight**: Interactive mode where you work directly in `implementation/` without deploying. The overlay logic switches based on context (dev bundle root vs environment). Same infrastructure, different routing.

5. **Events must be visible** - Fire-and-forget should create observable events, not invisible ones. Records should be written somewhere to enable traceability.

6. **Selfevals should use runtime path** - Hand-crafting records bypasses the real path. When runtime changes, selfevals break in confusing ways. Fix: selfevals invoke methods through the same API as real usage.

Key principle: *Don't fight the workflow - if it feels wrong, the design needs adjustment.*

---

### Session 7 - CLI Pipeline Restructure

**Goal:** Clean up entry point pipeline, align with record-first pattern.

**Documentation cleanup:**
- Fixed path references in foundation docs (WOW.md, PRINCIPLES.md, PARTNERSHIP.md)
- Changed `Filename.md (folder/)` to proper `folder/Filename.md` format
- Updated CURRENT.md key docs section

**CLI restructure - record-first pattern:**

Created Kafka record at entry point with all input:
```javascript
const record = {
  headers: {
    spl: {
      request: { timeReceived },
      runtime: { nodeRoot }
    }
  },
  value: {
    argv, cwd, mode, resolvedPath, input, method, error
  }
}
```

**Bound pattern for libs:**

`cli.js` refactored to export `create(record)` returning bound object:
- Methods read/write record internally
- Caller doesn't know property paths
- `cli.resolveNode()`, `cli.detectMode()`, `cli.parseArgs()`
- `cli.validate()` returns boolean, writes error to record
- `cli.handleError()` outputs console-friendly message, exits

**requireSpl introduced:**

Single function in `lib/moduleBootstrap.js`:
```javascript
const cli = requireSpl('lib/cli', record)
```
- URI pattern: `lib/xxx` for libs, `pkg/api/method` for modules (TBD)
- Returns bound object with record internalized

**spl.mjs now thin:**
```javascript
import { requireSpl } from './lib/moduleBootstrap.js'

const record = { ... }
const cli = requireSpl('lib/cli', record)

cli.resolveNode()
if (!cli.validate()) cli.handleError()
cli.detectMode()
cli.parseArgs()
// dispatch...
```

**Design decisions:**
- `headers` = public metadata (flows downstream)
- `value` = internal state (spl/cli's business)
- spl/cli conceptually extends spl/runtime
- Free style (lib/) and formal (modules/) share bound pattern
- Two require functions: `requireSpl` for splectrum, `requireNonSpl` for platform externals

**Next:**
- Add `requireNonSpl(moduleName)` skeleton for platform externals
- Add module resolution to requireSpl
- Implement dispatch + execution handlers
- Add FAF before error exit
- Later: platform switch in requireNonSpl

---

### Session 7 (continued) - Core Lib and FAF

**Core lib location decision:**
- Named `spl` at package level (not API level)
- Path: `modules/bm_spl/spl/_lib/spl.js`
- Required as: `lib/spl`
- Contains FAF and other foundational utilities

**For project closure docs:**
- Update NODE_STRUCTURE_DESIGN.md: core lib path is `lib/spl` (package level)

**FAF implementation:**
- Added `faf(destination, options)` to `lib/spl`
- Supports `{ sync: true }` for pre-exit writes
- Default async (fire and forget), sync blocks until complete

**Error topic structure:**
- Topic first, then app: `runtime/error/cli`
- cli.js: `resolveErrorTopic()` returns path
- spl.js: `faf()` writes record
- spl.mjs: `spl.faf(cli.resolveErrorTopic(), { sync: true })` before handleError

**Tested:** Error record written to `runtime/error/cli/{timestamp}.json` with full WYSIWI state

**Platform metadata:**
- Add `runtime.platform.type` = `'bare'` | `'node'`
- Detect early in CLI processing

**Script lib discussion:**
- `lib/spl/script` provides `script.input()`, `script.output()`
- Abstracts record structure from scriptwriter
- Scripts wrapped on load (no export boilerplate)
- Comment preamble for documentation

**Platform module tiers:**
- Preferred: fs, path (splectrum internals)
- Extended: os, crypto, http, etc. (registered in platformModules)
- External: npm packages (standard require, single platform only)

**Script type detection:**
- Detect from code patterns: import/require vs requireNonSpl
- Single platform scripts can use any npm package
- Platform-portable scripts use requireNonSpl only

---

### Task Split: Pre/Post Request Record Creation

**Pre-request (spl/cli - entry point):**
- Create initial record ✓
  - headers.spl.request.timeReceived
  - headers.spl.runtime.invokedFrom (was cwd)
  - headers.spl.runtime.platform.type = 'node'
  - value.argv
- Resolve node → runtime.nodeRoot ✓
- Detect mode → value.mode ✓
- Parse args → value.input ✓
- Load external script file → value.script, mode file→script ✓
- Validate (checks all errors) ✓
- Error handling with FAF (sync) ✓
- Hand off to cli-static app (next)

**Mode values:**
- `'command'` → method invocation (spl/dev/cycle)
- `'script'` → inline code or preloaded external file
- `'library'` → internal scripts (scripts/ or apps/xxx/scripts/)

**Error codes:**
- `NO_ARGS` - no arguments provided
- `NO_NODE` - no splectrum/ node found
- `FILE_NOT_FOUND` - explicit file path doesn't exist
- `FILE_READ_ERROR` - can't read file (permissions, etc.)

**Post-request (cli-static app) - three pipelines:**
1. **Command** - method invocation (spl/dev/cycle)
2. **Internal script** - library/app scripts (from scripts/)
3. **Inline script** - code string (including preloaded external files)

**Internal script resolution (app handles):**
- App scripts first: `apps/cli-static/scripts/`
- Node scripts second: `scripts/`

**Internal vs external script detection:**
- If resolved path is inside `nodeRoot` → mode = `'library'` (internal, not preloaded)
- If resolved path is outside `nodeRoot` → mode = `'file'` (external, preloaded as inline)
- Prevents internal scripts from being treated as external when invoked with `./` path

---

### App Invocation Architecture

**App as method:**
- API state = app's internal state (config, session, etc.)
- Input = record (spl/cli record, RPC message, etc.)
- Output = depends on transport (console for CLI, response message for RPC)

**Invocation patterns:**
```javascript
// CLI (cli-static) - outputs to console, returns nothing
await cliStatic.handle(cliRecord)

// AVRO RPC - returns response message
const response = await rpcApp.handle(record)
```

**Record transformation:**
```
spl/cli record → App (preprocessing) → Request record → Session → Output
```

**Stateful vs Stateless:**
- **App (stateful context):** config, state, channel setup - persists across requests
- **Session (stateless context):** processes single request, everything in record (WYSIWI)

**Sync/Async bridge:**
- External (client): synchronous - user/client waits for response
- Internal (session): asynchronous - FAF to inbox/processing/outbox

```
Client ──sync──► App ──async──► Session
                  │                │
                  │◄──async────────┘
Client ◄──sync──┘
```

**cli-static flow:**
1. Receives spl/cli record (sync)
2. Preprocesses → request record
3. FAF to session inbox
4. Waits for outbox
5. Outputs to console
6. Returns to spl.mjs

---

### External Entry Point Convention

**`spl.mjs` = external entry point (wherever it appears)**

Entry point files by purpose:
| File | Purpose |
|------|---------|
| `spl.mjs` | External entry point (CLI, process, etc.) |
| `app.mjs` | App-internal entry (if separate from spl.mjs) |
| `index.js` | API method entry point (in modules) |
| `handle.js` | Internal request handler (session scripts) |

**Invocation patterns:**

1. **Direct to app:**
   ```
   process → apps/cli-static/spl.mjs (JSON record)
   ```

2. **Global with routing:**
   ```
   process → splectrum/spl.mjs → routing → app
   ```

**Routing options:**
- CLI args → cli-static (current)
- JSON message type → appropriate app
- Explicit app target in message

**Self-documenting entry points:**
- Each `spl.mjs` returns help on what it expects when requested
- `--help` or no args shows: expected format, options, examples
- Generalizes to all external communications

This pattern applies to all external communication entry points.

---

### Entry Point Framework

**File structure per app:**
```
apps/cli-static/
├── spl.mjs    # Entry point shell (thin, standard)
└── app.mjs    # Implementation (name, help, handle)
```

**app.mjs provides:**
```javascript
export const name = 'cli-static'
export const help = `Usage: ...`
export async function handle(record) { ... }
```

**spl.mjs wires it up (boilerplate):**
```javascript
import { entryPoint } from '../../lib/entryPoint.js'
import * as app from './app.mjs'
export const { handle } = entryPoint(app, import.meta.url)
```

**Framework (lib/entryPoint.js) provides:**
- Main module detection
- `--help` handling
- JSON parsing from argv
- Export of handle for programmatic use
- Consistent error handling

**Invocation paths:**
1. Global: `./spl status` → splectrum/spl.mjs → cli-static
2. Direct help: `node apps/cli-static/spl.mjs --help`
3. Direct JSON: `node apps/cli-static/spl.mjs '{"headers":...}'`
4. Programmatic: `import { handle } from './apps/cli-static/spl.mjs'`

---

### App API Vision

**Inheritance pattern for apps:**
- Base API: `spl/app` - provides common methods (load, save, send, consume)
- Apps extend base: `app/cli-static` inherits from `spl/app`
- Apps add specific methods: history, statistics, etc.
- Resolution follows extends chain (app first, then base)

**MVP for cli-static:**
- `handle(record)` - main entry point
- Inbox/outbox pattern (core, not optional):
  1. FAF to session inbox
  2. Session picks up → dispatch → execute
  3. FAF to outbox
  4. App consumes from outbox
  5. Console output

**Deferred:**
- State loading/saving
- spl/app base implementation
- Full inheritance resolution

**Session location:** `runtime/cli-static/` (per NODE_STRUCTURE_DESIGN.md)
```
runtime/cli-static/
├── inbox/       # incoming requests
├── processing/  # being worked on
└── outbox/      # complete
```

---

## 2025-11-30

### Session 7 Continued - Consumer Design & Request Structure

**Focus:** Consumer pattern design, request record structure, terminology.

---

### Consumer Design

Created `CONSUMER_DESIGN.md` documenting folder watcher pattern:

**Two consumer types:**
1. **Persistent** - long-running, state file control
   - Watches sourceDir for new files
   - Secondary watch on state file for control (stop, pause)
   - Bidirectional: API writes control, watcher writes stats/heartbeat
   - Lock protocol: atomic rename (write .tmp, rename to target)

2. **Transient** - short-lived, TTL-based
   - Double-barrel TTL: `maxTime` + `maxTriggers`
   - Whichever limit hits first triggers shutdown
   - Use case: request/response (app outbox watcher)

**Consumer architecture:**
- Consumer watches folder, invokes handler on new file
- Handler owns destination and cleanup (deletes source after FAF)
- Record gets `sourcePath` attached for handler to use
- Consumer stamps trail: `headers.spl.consumers[]`

**spl/consumer API planned:**
- `watch` - starts watcher
- `status` - reads state file
- `stop` - writes running:false
- `pause/resume` - control processing

---

### Overlay Logic Moved

Moved from module `_lib/overlay.js` to `lib/moduleBootstrap.js`:
- `createOverlay(hierarchy)` - create resolver from hierarchy map
- `loadOverlay(hierarchyPath)` - load hierarchy.json and create resolver

Methods: selectFile, selectFromFolder, collectAll, collectAllNoOverlay, getNode, getAllNodes

Removed overlay.js from:
- `modules/versions/bm_spl-*/\_lib/`
- `ops/splectrum/modules/versions/bm_spl_ops-*/\_lib/`

---

### spl/request Record Structure

**Key design insight:** Input and output are operational metadata, not API state.

```
headers.spl.request.timeReceived  - fixed
headers.spl.request.type          - fixed (command/library/script)
headers.spl.request.method        - updated
headers.spl.request.input         - updated (parsed args)
headers.spl.request.output        - updated (execution result)
headers.spl.runtime.*             - fixed
headers.spl.consumers[]           - appended
headers.spl.error                 - set on error
value                             - API state (method-managed)
```

**parseArgs() now writes directly to `headers.spl.request.input`**
- Input is metadata, belongs in headers from the start
- Not in value (that's for API state)

---

### Record Transformation Pattern

**Same record evolves through pipeline** - not new records created.

**Terminology:**
- Conceptual: "transform" - record evolves, FAF captures snapshots
- Function names: `set*` - simple, clear intent

**Functions in app.mjs:**
- `setCommandRequest(record)` - sets type, method
- `setLibraryRequest(record)` - sets error (NOT_IMPLEMENTED)
- `setScriptRequest(record)` - sets error (NOT_IMPLEMENTED)
- `setUnknownModeError(record, mode)` - sets error

**FAF as event sourcing:**
- Each FAF captures snapshot of record's evolution
- Creates change event, not new record
- Audit trail of record states

---

### Basic Watcher Implemented

`apps/cli-static/scripts/watcher.js`:
- `createWatcher({ sourceDir, handler, consumerId })`
- Watches for `rename` events (file dropped in)
- Filters `.json` files
- Tracks in-flight to prevent double-processing
- Attaches `sourcePath` to record
- Stamps consumer trail
- Returns `{ stop }` handle

---

### App Flow Working

```
./spl spl/dev/cycle --name=test
    ↓
spl.mjs (creates record, parseArgs sets headers.spl.request.input)
    ↓
cli-static handle(record)
    ↓
setCommandRequest(record) - sets type='command', method
    ↓
watcher on outbox started
    ↓
FAF to outbox
    ↓
watcher catches, outputs record.value (null for now), stops
```

---

### Next Steps

1. Session setup (inbox → processing → outbox pipeline)
2. Double-barrel TTL for transient watcher
3. Move watcher to spl/consumer API

---

### Key Files Changed

- `lib/moduleBootstrap.js` - added overlay functions
- `modules/bm_spl/spl/cli/_lib/cli.js` - parseArgs writes to headers
- `apps/cli-static/app.mjs` - set* functions, record transformation
- `apps/cli-static/scripts/watcher.js` - basic folder watcher
- `spl.mjs` - input placeholder moved to headers

---

### Design Documents Created

- `CONSUMER_DESIGN.md` - consumer pattern, spl/request structure, fixed vs updated properties
