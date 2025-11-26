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
