# spl/dev API - Overview

**Type:** api overview
**Extends:** api_overview_req_v1.0.0.md

---

## Spec

Dev Environment API for autonomous development with test-driven implementation.

**Purpose:** Enable AI to implement well-specified work packages with self-evaluation quality control.

### Methods

```
spl/dev/                          # API root
├── create/                       # Create environment shell
├── install/                      # Install base packages
├── submit/                       # Submit work package
├── cycle/                        # Run test cycle
├── status/                       # Report state
├── extract/                      # Extract package with meta
└── destroy/                      # Clean up environment
```

---

## Method Specifications

### 1. `spl/dev/create`

**Purpose:** Create fresh dev environment shell

**Input:** `{ name }`
- name: string - Environment name

**Output:** `{ envId, path, status }`
- envId: string - UUID for environment
- path: string - Filesystem path
- status: "created"

**What it does:**
- Generate unique environment ID
- Create directory structure at `/tmp/dev-env/{name}`
- Return environment metadata

**What it doesn't do:**
- Install packages (see install)
- Create modules/ folder (see install)

**Status:** ✓ Work package complete, all tests passing

---

### 2. `spl/dev/install`

**Purpose:** Install base packages into environment

**Input:** `{ packages?, reset? }`
- packages: string | string[] - Package names (default: "standard")
- reset: boolean - Clear base/ first (partial teardown)

**Output:** `{ installed, base, status }`
- installed: string[] - Package names installed
- base: string - Path to base/ folder
- status: "installed"

**What it does:**
- Create modules/base/ structure
- Install runtime support
- Install generic self-evals
- Install common utilities
- Create modules/_index.json with base at layer 0

**What it doesn't do:**
- Submit work packages (see submit)
- Run tests (see cycle)

**Base structure created:**
```
modules/
├── base/
│   ├── _reqs/
│   ├── runtime/
│   ├── spl/dev/_selfeval/      # Generic self-evals
│   └── ...
└── _index.json                  # Layer order
```

**Status:** 🔲 Not yet implemented

---

### 3. `spl/dev/submit`

**Purpose:** Submit work package to overlay

**Input:** `{ workPackage, reset? }`
- workPackage: string - Path to work package folder
- reset: boolean - Clear overlay/ first (partial teardown)

**Output:** `{ overlay, dependencies, status }`
- overlay: string - Path to overlay/ folder
- dependencies: object - Version dependency report
- status: "submitted" | "resumed"

**What it does:**
- Copy work package to modules/{work-name}/
- Crystallize stepping stone refs → filepath refs
- Generate version dependency report
- Restore state from _meta/ if resuming
- Update modules/_index.json with work module at layer 1+

**Crystallization:**
- Resolve stepping stone refs to current versions
- Pin all dependencies in work package
- Generate dependency report (_meta/dependencies.json)

**Resume detection:**
- Check for _meta/status.json in work package
- If present, restore state (cycles, test results, fluency)
- Status: "resumed" instead of "submitted"

**What it doesn't do:**
- Run tests (see cycle)
- Modify work package source

**Status:** 🔲 Not yet implemented

---

### 4. `spl/dev/cycle`

**Purpose:** Run test cycle with return-and-resume

**Input:** `{ single? }`
- single: boolean - Run one cycle only (default: false = loop mode)

**Output:** `{ cycle, results, fluency, status }`
- cycle: number - Current cycle number
- results: object - Test results by category
- fluency: object - Cycles to completion metrics
- status: "pass" | "fail" | "incomplete"

**Loop mode (single: false):**
- Run tests
- On failure: return with guidance → wait for fixes → continue
- On pass: continue to next test
- Stop when 100% pass
- Each failure = handoff point for AI (me or delegated agent)

**Single mode (single: true):**
- Run tests once
- Return result
- Exit (no loop)

**State sync:**
- Saves to _meta/ at each prompt point (failure)
- Saves to _meta/ on completion (100%)
- Enables resume after session break

**Cycle log (_meta/cycle-log.json):**
- Test results per cycle
- Failure messages and guidance
- Changes made (files modified)
- Timestamps

**Fluency metric (_meta/fluency.json):**
- Cycles to completion (overall)
- Cycles per test
- Cycles per component
- Time to green

**What it doesn't do:**
- Make fixes (AI does that)
- Auto-retry without changes

**Status:** 🔲 Not yet implemented

---

### 5. `spl/dev/status`

**Purpose:** Report current state

**Input:** `{ silent?, save? }`
- silent: boolean - Suppress screen output (default: false)
- save: boolean - Write to _meta/ (default: false)

**Output:** `{ env, cycles, results, fluency, status }`
- env: object - Environment info (envId, path, packages)
- cycles: number - Total cycles run
- results: object - Current test results
- fluency: object - Fluency metrics
- status: string - Current state

**Modes:**
- Default: screen only (interactive)
- silent: no screen output (programmatic)
- save: write to _meta/status.json (persist)
- silent + save: dump state to work package (for tools)

**Use cases:**
- Interactive: check progress
- Programmatic: query from other methods
- Persist: snapshot state at checkpoint

**What it doesn't do:**
- Run tests (see cycle)
- Modify state

**Status:** 🔲 Not yet implemented

---

### 6. `spl/dev/extract`

**Purpose:** Extract package from overlay with meta

**Input:** `{ destination? }`
- destination: string - Where to extract (default: current dir)

**Output:** `{ package, meta, status }`
- package: string - Path to extracted package
- meta: object - Metadata summary
- status: "extracted"

**What it extracts:**
- Implementation (complete or in-progress)
- _meta/status.json - Current state
- _meta/cycle-log.json - Cycle history
- _meta/fluency.json - Fluency metrics
- _meta/dependencies.json - Version dependencies
- _meta/test-results.json - Test results

**Use cases:**
- Handoff between agents
- Archive work in progress
- Resume in different environment
- Review implementation state

**What it doesn't do:**
- Modify overlay (read-only)
- Destroy environment

**Status:** 🔲 Not yet implemented

---

### 7. `spl/dev/destroy`

**Purpose:** Clean up environment

**Input:** `{ mode }`
- mode: "clean" | "preserve" | "publish"

**Modes:**
- clean: Remove everything (fresh start)
- preserve: Keep for reference (archive)
- publish: Merge to codebase (graduate)

**Output:** `{ archived?, published?, status }`
- archived: string - Archive path (preserve mode)
- published: string - Published path (publish mode)
- status: "cleaned" | "preserved" | "published"

**What it does (clean):**
- Remove dev environment
- Free resources
- Status: ready for next environment

**What it does (preserve):**
- Archive to date-stamped folder
- Keep for reference
- Status: archived, environment cleaned

**What it does (publish):**
- Merge overlay → real codebase
- Update version tracking
- Clean environment
- Status: published, environment cleaned

**What it doesn't do:**
- Auto-decide which mode (explicit choice)

**Status:** 🔲 Not yet implemented

---

## API-Level Invocation

Beyond individual methods, spl/dev supports API-level operations:

### Set Defaults
```javascript
await invoke('spl/dev', { verbosity: 'debug' });
```

### Batch Operations
```javascript
await invoke('spl/dev', {
  batch: [
    ['create', { name: 'my-env' }],
    ['install', { packages: 'standard' }],
    ['submit', { workPackage: './work/pkg' }]
  ]
});
```

---

## State Management

**State lives in memory during execution:**
- Current environment (envId, path, base, overlay)
- Current work package
- Cycle count
- Test results
- Fluency metrics

**State syncs to _meta/ at:**
- Each prompt point (cycle failure)
- Completion (100% pass)
- Explicit status save

**Enables:**
- Resume from work package after session break
- Handoff between agents
- Progress tracking
- Fluency analysis

---

## Environment Structure

```
/tmp/dev-env/{name}/
├── modules/
│   ├── base/                    # Layer 0 (install)
│   │   ├── _reqs/
│   │   ├── runtime/
│   │   ├── spl/dev/_selfeval/
│   │   └── ...
│   ├── {work-name}/             # Layer 1+ (submit)
│   │   ├── _reqs/
│   │   ├── _meta/               # State tracking
│   │   │   ├── status.json
│   │   │   ├── cycle-log.json
│   │   │   ├── fluency.json
│   │   │   ├── dependencies.json
│   │   │   └── test-results.json
│   │   ├── spl/dev/{method}/    # Work package
│   │   │   ├── _req.md
│   │   │   ├── _selfeval.json
│   │   │   ├── tests/
│   │   │   └── index.js
│   │   └── ...
│   └── _index.json              # Layer order (mutable)
```

---

## Setup Folder Pattern

**Dev environment is ephemeral. Setup folder accumulates completed work.**

```
setup/
├── base-modules/          # Packages for installation
│   └── spl-runtime/
├── work-packages/         # Input queue (pristine specs)
│   ├── spl-dev-install/
│   ├── spl-dev-submit/
│   └── spl-dev-cycle/
└── completed-modules/     # Output - evolved work modules
    └── spl-dev-create/    # Completed: spec + impl + meta
        ├── _req.md
        ├── _selfeval.json
        ├── _meta/         # Journey evidence
        │   ├── status.json
        │   ├── cycle-log.json
        │   ├── fluency.json
        │   └── dependencies.json
        ├── tests/
        └── index.js       # IMPLEMENTED
```

**Full cycle invocation:**
```javascript
invoke('spl/dev', {
  setup: './setup',
  workPackage: 'spl-dev-install'
});
```

**What happens:**
1. Create ephemeral dev env
2. Install from setup/base-modules/
3. Submit from setup/work-packages/spl-dev-install/
4. Cycle until 100% pass
5. Extract to setup/completed-modules/spl-dev-install/
6. Destroy dev env (clean)

**Result:** Setup folder has one more completed module.

**Perfect for AI delegation:**
- Hand agent: setup folder + work package name
- Agent implements to spec
- Returns: completed module with _meta/ evidence
- Setup folder state advances

**Publish is separate:** Moving completed modules to real codebase is different concern, not part of dev cycle.

---

## Typical Workflow

1. **Create environment shell:**
   ```javascript
   invoke('spl/dev/create', { name: 'feature-auth' })
   ```

2. **Install base packages:**
   ```javascript
   invoke('spl/dev/install', { packages: 'standard' })
   ```

3. **Submit work package:**
   ```javascript
   invoke('spl/dev/submit', { workPackage: './work/spl-dev-install' })
   ```

4. **Run cycle (loop mode):**
   ```javascript
   invoke('spl/dev/cycle')
   // → returns failure with guidance
   // → AI fixes code
   // → invoke('spl/dev/cycle') to continue
   // → ... until 100% pass
   ```

5. **Check status:**
   ```javascript
   invoke('spl/dev/status')
   ```

6. **Extract package:**
   ```javascript
   invoke('spl/dev/extract', { destination: './completed/auth-feature' })
   ```

7. **Destroy:**
   ```javascript
   invoke('spl/dev/destroy', { mode: 'clean' })
   ```

**Or use full cycle (recommended for AI delegation):**
```javascript
invoke('spl/dev', {
  setup: './setup',
  workPackage: 'spl-dev-install'
});
// Handles entire flow: create → install → submit → cycle → extract → destroy
```

---

## Key Patterns

1. **Sync methods** - Simple, single-threaded execution
2. **Return-and-resume** - Cycle method enables delegation handoff
3. **State persistence** - _meta/ folder tracks everything
4. **Crystallization** - Stepping stones → filepath refs at submit
5. **Fluency metric** - Cycles to completion measures partnership quality
6. **Layered modules** - base → work → patch overlay pattern
7. **Portable packages** - Relative refs, can move/deploy anywhere

---

## Implementation Status

- ✓ create - Complete (v4)
- 🔲 install - Not yet implemented
- 🔲 submit - Not yet implemented
- 🔲 cycle - Not yet implemented
- 🔲 status - Not yet implemented
- 🔲 extract - Not yet implemented
- 🔲 destroy - Not yet implemented

---

## Self-eval

**Structural verification (not behavioral testing):**

### All methods exist with correct structure
- [ ] spl/dev/create/index.js exists
- [ ] spl/dev/install/index.js exists
- [ ] spl/dev/submit/index.js exists
- [ ] spl/dev/cycle/index.js exists
- [ ] spl/dev/status/index.js exists
- [ ] spl/dev/extract/index.js exists
- [ ] spl/dev/destroy/index.js exists

### Method signatures match overview
- [ ] create: input schema matches `{ name }`, output matches `{ envId, path, status }`
- [ ] install: input schema matches `{ packages?, reset? }`, output matches `{ installed, base, status }`
- [ ] submit: input schema matches `{ workPackage, reset? }`, output matches `{ overlay, dependencies, status }`
- [ ] cycle: input schema matches `{ single? }`, output matches `{ cycle, results, fluency, status }`
- [ ] status: input schema matches `{ silent?, save? }`, output matches `{ env, cycles, results, fluency, status }`
- [ ] extract: input schema matches `{ destination? }`, output matches `{ package, meta, status }`
- [ ] destroy: input schema matches `{ mode }`, output matches `{ archived?, published?, status }`

### Complete method structure
- [ ] Each method has _req.md
- [ ] Each method has _selfeval.json
- [ ] Each method has _schemas/input.avsc
- [ ] Each method has _schemas/output.avsc
- [ ] Each method has tests/ folder

### API-level components
- [ ] Help system metadata exists
- [ ] API-level invocation handler exists
- [ ] Setup folder pattern documented

### Documentation accuracy
- [ ] All claimed patterns work as described
- [ ] Overview is immediately usable
- [ ] Method purposes are clear

---

## Comments

Overview self-eval is **structural verification** - checks that what we claim exists actually exists with correct signatures.

Method-level self-evals (via _selfeval.json) handle behavioral testing.

---

**Created:** 2025-11-20
**Updated:** 2025-11-20
**Purpose:** API overview with inventory and top-level interface
