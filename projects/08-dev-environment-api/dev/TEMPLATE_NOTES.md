# Dev Environment Template - Preliminary Notes

Notes from v1-v3 iterations and design discussion. To be formalized into template twin product.

---

## Core Concepts

### Work Package Structure

Self-contained, portable module with everything needed for implementation:

```
spl/dev/create/
├── index.js              # Implementation (stub to start)
├── _req.md               # Spec - natural language, what to build
├── _selfeval.json        # Test manifest - what to pass
├── _schemas/
│   ├── input.avsc
│   └── output.avsc
├── tests/
│   ├── create-status.js
│   ├── create-uuid.js
│   └── create-path.js
└── testdata/
    └── ...
```

### Entry Points

- **Markdown req** (`_req.md`) - human/AI readable spec, refs selfEval JSON
- **Self-eval JSON** (`_selfeval.json`) - machine-readable test manifest

AI workflow: Read markdown → extract selfEval path → run tests → iterate to green

### Relative Refs (API Design Requirement)

All refs relative to code folder root (e.g., `src/`) for portability. When package moves/deploys, everything stays linked.

```json
{
  "extends": "spl/dev/_selfeval/api_method_v1.0.0.json",
  "tests": [
    { "script": "spl/dev/create/tests/create-status.js" }
  ]
}
```

---

## Self-Eval JSON Structure

Top-level JSON as general test manifest:

```json
{
  "method": "spl/dev/create",
  "description": "Self-eval for create method",
  "extends": "api_method_selfeval_v1.0.0.json",
  "tests": [
    {
      "name": "creates environment with status",
      "type": "script",
      "script": "tests/create-status.js",
      "category": "logic"
    },
    {
      "name": "schema validates input",
      "type": "schema",
      "schema": "_schemas/input.avsc",
      "data": "testdata/valid-input.json",
      "category": "qc"
    }
  ]
}
```

### Test Types

- `script` - standalone JS script, exit 0/1
- `schema` - validate data against AVRO schema
- `snapshot` - compare output to expected
- (extensible for future types)

### Extends Chain

Self-eval inherits from parent:
- `api_node_selfeval` → base tests
- `api_method_selfeval` → qc, safety tests
- `method_selfeval` → logic tests

Harness collects all tests from chain.

---

## Test Scripts

### AI-Primary Design

No framework. Simple Node.js scripts:

```javascript
// test-create-status.js
import create from '../index.js';

const result = await create({}, { name: 'test' });

if (result.output.status !== 'created') {
  console.log('Expected status "created", got:', result.output.status);
  process.exit(1);
}

process.exit(0);
```

- Exit 0 = pass
- Exit 1 = fail
- Console output = guidance

Most freedom, least friction for implementation and test creation.

---

## Harness Behavior

1. Read markdown req, extract selfEval JSON path
2. Load selfEval JSON
3. Follow extends chain, collect all tests
4. Run tests in sequence
5. Stop on first failure (exit 1)
6. Report 100% pass when all green

### Invocation

AI invokes harness as part of dev loop. Not automated CI - AI-primary.

---

## Handoff Pattern

**Work package handoff:**

1. Receive folder with spec, schemas, tests (stub implementation)
2. Drop into dev env
3. Run harness
4. Tests fail with guidance
5. Implement until 100% pass
6. Done

"Dumb execution, smart definition" - definition is complete, execution follows tests.

---

## Future Directions

### Req to Self-Eval Convertor

Generate self-eval from spec:
- Schemas from input/output descriptions
- Test cases from expected behaviors
- Test scripts from self-eval criteria

AI generating tests for AI to pass.

### Other Ideas

- Template work packages for common patterns
- Composition of work packages
- Parallel work package execution
- Generic tests primed with method-specific data

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| JS deploy scripts | Single language, failures fixed same way |
| Standalone test scripts | Most freedom, least friction |
| JSON test manifest | Machine-readable, extensible |
| Markdown req entry point | Human/AI readable spec |
| Relative refs from code root | Portable packages |
| Self-contained iterations | Fresh env each iteration, no cross-contamination |
| Embedded artifacts in module | Everything travels with the code |

---

## Execution Model

### Sync Methods (Default)

API methods are sync by default:

```javascript
// Our method (sync)
export default function create(ctx, input) {
  const envId = randomUUID();
  const path = `/tmp/dev-env/${input.name}`;
  return { output: { envId, path, status: 'created' } };
}
```

Benefits:
- Simple code
- Easy to test
- No async ceremony

### Async Framework

Runner/framework is async, wraps sync methods:

```javascript
// Runner (async)
async function runMethod(methodPath, ctx, input) {
  const method = await import(methodPath);  // async load
  const result = method.default(ctx, input); // sync call
  return result;
}
```

### Single-Threaded Execution Context

- Each runner/worker sees itself as single-threaded
- Parallelism = multiple workers (separate processes), not async within one
- Queues with workers for parallel execution

### I/O Handling

For methods that need I/O:
- Use sync file ops (readFileSync, writeFileSync) for simplicity
- Or have an async method category when truly needed
- Default is sync

---

## Overlay Pattern

Dev env structure with overlay for work package:

```
dev-env/
├── base/                    # Installed packages (read-only)
│   ├── runtime/
│   ├── spl/dev/_selfeval/
│   └── generic-tests/
└── overlay/                 # Work package (writable)
    └── spl/dev/create/
        ├── index.js
        ├── _req.md
        ├── _selfeval.json
        ├── tests/
        └── ...
```

Harness resolves paths with overlay taking precedence over base.

Benefits:
- Clear separation (base vs work)
- Easy to swap work packages
- Base stays pristine
- Can diff overlay to see what was implemented
- Multiple overlays possible (parallel work)

When done, overlay gets "published" - merged into real codebase.

---

## Dev Env API Methods

### `spl/dev/create`
Create fresh dev environment shell.
- Input: `{ name }`
- Output: `{ envId, path, status: 'created' }`

### `spl/dev/install`
Install base packages into env.
- Input: `{ packages?, reset? }`
- `packages` - specific packages to install
- `reset` - clear base first (partial teardown)
- Creates base/ structure with runtime, generic self-evals, utilities

### `spl/dev/submit`
Submit work package to overlay.
- Input: `{ workPackage?, reset? }`
- `workPackage` - path to work package
- `reset` - clear overlay first (partial teardown)
- Crystallises stepping stones to filepath refs
- Generates version dependency report
- Restores state from _meta/ if resuming

### `spl/dev/cycle`
Run test cycle.
- Input: `{ single? }`
- `single` - run one cycle only (vs loop until done)
- Loop mode: runs → prompts on fail → waits → continues → until 100%
- Single mode: runs once → returns result → exits
- Saves state to work package at each prompt point and completion

### `spl/dev/status`
Report current state.
- Input: `{ silent?, save? }`
- `silent` - suppress screen output
- `save` - write to work package _meta/
- Returns status object (cycles, results, fluency, etc.)
- Default: screen only

### `spl/dev/extract`
Extract package from overlay with meta.
- Output: complete package with:
  - Implementation (complete or in-progress)
  - _meta/: status, cycle-log, fluency, dependencies, test-results

### `spl/dev/teardown`
Clean up environment.
- Options: preserve (for reference), clean (fresh start), publish (merge to codebase)

### API-Level Invocation

```javascript
// Set defaults
await invoke('spl/dev', { verbosity: 'debug' });

// Batch operations
await invoke('spl/dev', {
  batch: [
    ['create', { name: 'my-env' }],
    ['install', { packages: 'standard' }],
    ['submit', { workPackage: './work/pkg' }]
  ]
});
```

### State Management

- State lives in JS object during execution
- Syncs to work package _meta/ at:
  - Each prompt point (cycle failure)
  - Completion (100% pass)
- Enables resume from work package after session break
- Enables handoff between agents

---

## Refs and Crystallisation

### Two Ref Types

**Stepping stone refs** (in requirement specs):
```markdown
Extends: api_method
Self-eval: api_method_selfeval
```
- Used when writing requirements
- Conceptual, not version-bound
- Resolved later

**Filepath refs** (in work packages):
```json
{
  "extends": "base/spl/dev/_selfeval/api_method_selfeval_v1.0.0.json"
}
```
- Pinned to specific versions
- Immutable snapshot
- Implementation tested against these

### Crystallisation

**When:** At work package creation (just before implementation)

**What:** Resolve stepping stone refs to filepath refs
- Look up current versions in glossaries
- Pin all dependencies
- Generate version dependency report

**Req and self-eval crystallise together** - one unit, one step, simpler.

### Early vs Late Crystallisation

**Early:** Create work package with pinned versions upfront
- Good for: planned work, stable dependencies
- Risk: versions outdated by implementation time

**Late:** Keep stepping stones until just before implementation
- Good for: backlog items, evolving dependencies
- Benefit: always uses latest compatible versions

### Version Upgrade

Re-crystallise the req:
1. Resolve stepping stones to current versions (new self-eval with updated tests)
2. Re-run tests against existing implementation
3. Fix any failures

Same pattern as teardown - "start fresh with current state"
- Teardown: fresh env (implicit, each iteration)
- Re-crystallise: fresh deps (explicit, deliberate upgrade)

If tests pass → implementation compatible with new versions
If tests fail → implementation needs update

---

## Cycle Method - Interactive Loop

`cycle` as return-and-resume pattern:

```
cycle → returns failure + guidance
       ↓
   [handoff point]
       ↓
   AI makes fixes (me or delegated agent)
       ↓
cycle/continue → returns next result
       ↓
   [handoff point]
       ...until 100% pass
```

**Benefits:**
- API state stays alive throughout
- No repeated setup/teardown
- Clean handoff points for delegation
- Any AI at handoff can take the work

### Cycle Log

Captures for each cycle:
- Test results (pass/fail sequence)
- Failure messages and guidance
- Changes made (files modified, diffs TBD)
- Timestamps
- Cycle number

### Fluency Metric

Measure of implementation smoothness:

**Measures:**
- Cycles to completion (overall)
- Cycles per test
- Cycles per component
- Time to green

**Interpretation:**
- High fluency (few cycles) → clear spec, good tests, straightforward
- Low fluency (many cycles) → unclear spec, poor guidance, complex

**Uses:**
- Compare implementations
- Identify problematic patterns
- Improve specs/tests
- Estimate effort
- Track improvement over time

### Friction = Partnership Signal

**Key insight:** Low fluency indicates partnership misalignment, not capability gap.

**Friction points reveal:**
- Misunderstanding in spec
- Ambiguity in requirements
- Gap between intent and expression
- Mismatch in mental models

**Response to friction:**
- Review partnership artifacts (spec, guidance, tests)
- Find the misalignment
- Clarify and improve the definition
- **Not** escalate to "more capable agent"

**Partnership is king** - applies across all modes:
- Interactive collaboration
- Autonomous execution
- Delegated work

**Philosophy:** Those who get the most from their capabilities (and understand shortcomings) beat those who rely on blind brute force. More power/capability is not the answer - better alignment is. This is as valid in AI as in any other field.

Friction is feedback on partnership quality, not executor performance. Cycle log and fluency metric feed back to improve shared understanding.

---

## API Design Updates Needed

- Requirement: refs relative to code folder root for portability
- Pattern: work package structure
- Pattern: self-eval inheritance chain
- Pattern: sync methods by default, async framework
- Pattern: overlay for work packages
- Pattern: crystallisation (stepping stone → filepath)
- Pattern: version upgrade via re-crystallisation

---

## Package as Mycelium

### Self-Contained Web

Package is a standalone mycelium - self-contained web with:
- Internal refs relative to package root
- Fixed entry points (mutable filenames)
- Spider to versioned files (immutables)

```
spl/                              # package root
├── _reqs/                        # fixed entry point
│   ├── PACKAGE.md               # mutable - current package req
│   └── package_v1.0.0.md        # immutable - versioned
├── dev/                          # API
│   ├── _reqs/
│   │   ├── API.md               # mutable - current API req
│   │   └── api_v1.0.0.md        # immutable
│   ├── create/
│   │   ├── _reqs/
│   │   │   ├── METHOD.md        # mutable - current method req
│   │   │   └── method_v1.0.0.md # immutable
```

### Portability

- All refs relative to package root (`spl/`)
- Package can be moved/deployed anywhere
- Internal web stays intact
- Same mutable/immutable pattern as repo level

### Future: Packages Spot

- Will create packages spot with repo rules in req spec
- Portable spots: mutable-only hotspots portable if root ref is re-referenced
- Package portability requires relative internal refs

**For closure review:** Consider how package mycelium pattern fits with overall repo mycelium structure.

---

## Bootstrap and P2P

### Bootstrap Sequence

1. Get code running (now - dev env, test harness)
2. Build tooling with that code
3. Upgrade to splectrum data layer
4. Boot into "user" mode

**Building the ladder we climb** - each step builds tools for next step.

### Future: AVRO Container Integration

- Package stored in AVRO container
- Data layer handles storage/retrieval
- `require` implemented on data layer (not filesystem)
- Schema-validated, efficient, language-agnostic

```javascript
// Future
import create from 'spl/dev/create';
// Resolved through mycelium, stored in AVRO
```

### P2P Resilience

Functional layering addresses P2P challenges:
- No central authority for "latest version"
- Nodes may have different capabilities
- Network partitions happen
- Need to work with what's available

**How current patterns help:**
- Self-contained packages travel between nodes
- Relative refs work anywhere
- Can verify package integrity (AVRO schemas)
- Can operate on partial data
- Each layer self-sufficient (degraded but functional)
- Nodes can be at different bootstrap stages

**For closure review:** Consider bootstrap sequence and P2P implications for package design.

---

## API Tooling (Cross-Cutting)

### Help System

Help as queryable metadata tool, not documentation files.

**Metadata structure:**
```javascript
const methodMeta = {
  'spl/dev/create': {
    public: true,
    purpose: 'Create dev environment shell',
    input: { name: 'string' },
    output: { envId: 'string', path: 'string', status: 'string' },
    examples: [...]
  }
}
```

**Query patterns:**
```javascript
invoke('spl/help')                           // API list
invoke('spl/dev/help')                       // Method list (public only)
invoke('spl/dev/help', { method: 'cycle' })  // Method detail
invoke('spl/dev/help', { all: true })        // Include internal methods
invoke('spl/dev/help', { view: 'tree' })     // Hierarchy view
invoke('spl/dev/help', { detail: 'compact' }) // One-liners
```

**Principles:**
- More than complete but tight
- Queryable at any level of detail
- Structured data, not files
- Single source of truth (metadata with implementation)
- Works across all APIs (spl/dev, spl/console, spl/data, etc.)

**Public vs internal:**
- All methods in same namespace
- Help filters by `public` flag
- Default: public methods only
- Flag `all: true` shows everything
- Keeps full method list informative ("what spl/dev is about")

---

## Full Cycle Invocation

### Setup Folder Pattern

Dev environment is ephemeral. Setup folder accumulates completed work.

**Structure:**
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
        ├── tests/
        └── index.js       # IMPLEMENTED
```

**Full cycle:**
```javascript
invoke('spl/dev', {
  setup: './setup',
  workPackage: 'spl-dev-install'  // Name from work-packages/
});
```

**Flow:**
1. Create ephemeral dev env
2. Install from setup/base-modules/
3. Submit from setup/work-packages/{name}/
4. Cycle until 100% pass
5. Extract to setup/completed-modules/{name}/
6. Destroy dev env (clean)

**Result:** Setup folder has one more completed module.

**Perfect for AI delegation:**
- Hand agent: setup folder + work package name
- Agent implements to spec
- Returns: completed module with _meta/ evidence
- Setup folder state advances

**Publish is separate:** Moving completed modules to real codebase is different concern, not part of dev cycle.

---

---

## Self-Eval Inheritance System

### Principle

Type hierarchy with self-eval inheritance - each level adds only what's new, creating a library of reusable test scripts.

**Type hierarchy:**
```
api_node (generic)
  ↓ extends
package (type)
  ↓ instance of
spl (concrete package)
```

**Each level adds only what's missing:**
- **api_node self-eval:** Check underscore prefix rules, _reqs/ folder exists
- **package self-eval:** Check it's top-level, contains apis/methods (adds to api_node)
- **spl instance self-eval:** Check spl/ specific structure (adds to package)

**Execution chain:**
1. Run instance self-eval (spl)
2. Follow "instance of" → run type self-eval (package)
3. Follow "extends" → run parent self-eval (api_node)
4. Collect all tests from the chain

**Reusable script library:**
- `check-entry-points.js` - configurable, used everywhere
- `check-underscore-rules.js` - api_node level
- `check-structure.js` - configurable folders/files check
- `check-top-level.js` - package level
- Each script accepts config, compose complex checks from simple pieces

**Version inheritance:**
- Type version bump → all instances inherit new tests automatically
- Update type self-eval → every instance gets it on next version update
- No need to update every instance manually

**First run principle:**
- Establish the pattern (done in v4)
- Don't overdo implementation initially
- Build out script library as needs emerge
- Validate pattern through use

---

---

## Executable Self-Eval Pattern

### Motivation

Eliminate the bureaucracy layer of JSON manifests that reference test scripts. Make self-eval directly executable.

### Pattern

**File naming:**
- Self-eval scripts: `{req_name}_selfeval*.js` (e.g., `api_node_v1.0.0_selfeval.js`)
- Optional data files: `{req_name}_selfeval_data.json` (e.g., `api_node_v1.0.0_selfeval_data.json`)
- Multiple selfevals per req: Use suffix (e.g., `spl_dev_implementation_v1.0.0_selfeval_structure.js`)

**Location:**
All self-eval files live in `_reqs/` folder alongside requirement markdown files.

**Structure example:**
```
spl-dev-implementation/
├── _reqs/
│   ├── work_module_v1.0.0.md
│   ├── spl_dev_implementation_v1.0.0.md
│   ├── spl_dev_implementation_v1.0.0_selfeval_structure.js
│   ├── spl_dev_implementation_v1.0.0_selfeval_entrypoints.js
│   ├── spl_dev_implementation_v1.0.0_selfeval_data.json    # Optional
│   ├── api_node_v1.0.0_selfeval.js
│   ├── api_node_v1.0.0_selfeval_data.json                  # Optional
│   └── module_v1.0.0_selfeval.js
```

**Execution recipe:**

1. **Select** all `*_selfeval*.js` files in `_reqs/`
2. **Load** all `*_selfeval_data.json` files (if they exist)
3. **Match** data to scripts by base name (e.g., `api_node_v1.0.0`)
4. **Execute** each script, passing matching data (or null if no data file)

```javascript
// Pseudo-code for harness
const selfevals = glob('_reqs/*_selfeval*.js');
const dataFiles = glob('_reqs/*_selfeval_data.json');

// Load all data files
const data = {};
dataFiles.forEach(file => {
  const key = extractBaseName(file); // e.g., 'api_node_v1.0.0'
  data[key] = JSON.parse(readFileSync(file));
});

// Execute all selfevals
selfevals.forEach(scriptPath => {
  const scriptKey = extractBaseName(scriptPath);
  const scriptData = data[scriptKey] || null;

  const test = require(scriptPath);
  test(scriptData); // Execute with data or null
});
```

**Self-eval script signature:**
```javascript
// api_node_v1.0.0_selfeval.js
export default function selfeval(data) {
  // data = contents of api_node_v1.0.0_selfeval_data.json (or null)

  // Perform tests
  if (!fs.existsSync('_reqs')) {
    console.log('ERROR: _reqs folder missing');
    process.exit(1);
  }

  // Use data if provided
  if (data?.requiredFolders) {
    data.requiredFolders.forEach(folder => {
      // check folder exists...
    });
  }

  process.exit(0); // Pass
}
```

**Data file format:**
```json
{
  "requiredFolders": ["spl", "spl/dev"],
  "requiredFiles": ["README.md", "_reqs/_selfeval.json"],
  "internalFolders": ["_reqs", "_schemas", "_tests"]
}
```

### Benefits

- **No bureaucracy:** Script IS the test, not a reference to the test
- **Data separation:** Large test datasets live in JSON, logic in JS
- **Clear ownership:** Filename shows which req it belongs to
- **Reusable:** Same pattern for all levels (module, api_node, method)
- **Flexible:** Multiple selfevals per req via suffixes
- **Standalone:** Everything needed is in `_reqs/` folder

### Test Categories and Data

Data files can organize test inputs by category:

```json
{
  "logic": {
    "testCases": [
      { "input": {...}, "expected": {...} }
    ]
  },
  "safety": {
    "edgeCases": [...]
  },
  "qc": {
    "schemas": ["_schemas/input.avsc", "_schemas/output.avsc"]
  }
}
```

Self-eval script reads categories from data and executes appropriate tests.

### Inheritance Chain

Execution discovers and runs all selfevals in `_reqs/`:
- Instance selfevals (e.g., `spl_dev_implementation_v1.0.0_selfeval*.js`)
- Type selfevals (e.g., `work_module_v1.0.0_selfeval.js`)
- Parent selfevals (e.g., `api_node_v1.0.0_selfeval.js`, `module_v1.0.0_selfeval.js`)

No explicit "extends" chain needed - just run everything discovered. Order doesn't matter (all must pass).

**Copying strategy:**
Work module must be standalone, so inherited selfevals are **copied** into `_reqs/` with their version-stamped names. This makes origin and version explicit.

### Single Concern Principle

**Each selfeval tests ONE thing:**
- `*_selfeval_folders.js` - checks required folders exist
- `*_selfeval_files.js` - checks required files exist
- `*_selfeval.js` - single concern (e.g., api_node checks _reqs/ exists)

**Benefits:**
- **Specific messaging:** First failure is exact and actionable
- **Simple scripts:** Minimal code, easy to understand
- **Clear progression:** Fix one thing, run again, next specific failure
- **Stop-on-first-fail friendly:** Works perfectly with cycle pattern

**Example output:**
```
Running selfevals...
  ✓ Required folders exist
  ✗ Required files exist
    ERROR: Required file missing: README.md

Fix the issue and run cycle again.
```

Single concern = single clear message. No confusion about which part failed.

**Implementation guidance:**
- Minimal: Does one thing, nothing extra
- Complete: Fully handles that one concern
- Simple: Easy to understand and maintain
- Focused: Clear error message for the specific concern

---

---

## API Invocation Model

### Stateful API, Stateless Methods

**API-level invocation = stateful + default:**
- Primary pattern for using APIs
- Creates persistent state/context
- Configuration persists across method calls
- Sets defaults, environment, preferences

```javascript
// Set API context (stateful)
invoke('spl/dev', {
  envRoot: '/custom/path',
  setupRoot: './setup',
  verbosity: 'debug'
});
```

**Method-level invocation = stateless + override:**
- Methods don't keep their own state
- Receive context from three sources (the sandwich):
  1. **API state** (bottom) - persistent defaults from API invocation
  2. **Previous output** (middle) - output from prior method in chain
  3. **Method input** (top) - explicit arguments + overrides

```javascript
// Method invocations operate in API context
const result1 = invoke('spl/dev/create', { name: 'test' });
// Receives: API state
// Returns: { envId, path, status }

const result2 = invoke('spl/dev/install', {
  setupRoot: './other-setup'  // Override API-level default
});
// Receives: API state + result1 (previous output) + own input
// Can override any API-level config for this call only
```

### The Three-Layer Sandwich

Each method invocation resolves input from three layers:

1. **API state** (persistent) - configuration set at API level
2. **Previous output** (chained) - output from last method call
3. **Method input** (explicit) - arguments passed to this method

Priority: Method input > Previous output > API state

Override is per-call only - doesn't change API state.

### API Invocation Schema

API invocation can include:
- **Defaults** - method argument defaults
- **Batch** - array of method calls to execute
- **API-specific config** - context/environment for all methods

All optional, but API invocation is the **primary pattern**.

Example:
```javascript
invoke('spl/dev', {
  envRoot: '/custom/path',           // API-specific
  setupRoot: './setup',               // API-specific
  defaults: {
    install: { packages: 'standard' },
    cycle: { single: false }
  },
  batch: [                            // Execute sequence
    ['create', { name: 'my-env' }],
    ['install', {}],                  // Uses defaults
    ['submit', { workPackage: './work/pkg' }]
  ]
});
```

### Design Principle

APIs are designed **API-first**:
- Think about the stateful context the API manages
- Methods operate within that context
- Previous outputs flow to next method
- Each method can override context temporarily

This enables:
- Workflow composition (chain methods)
- Reduced repetition (defaults at API level)
- Flexible overrides (per-call basis)
- Clean state management (API owns state, methods are pure)

---

---

## v4 Session 2 - Module Structure and Executable Selfevals

### Complete 4-Level Structure Established

**Module hierarchy:**
1. **Module root** (`spl-dev-implementation/`) - Work module instance
2. **Package** (`spl/`) - Cut-down spl package (only dev API)
3. **API** (`spl/dev/`) - Dev Environment API
4. **Methods** (7 methods: create, install, submit, cycle, status, extract, destroy)

Each level has:
- `README.md` - Mutable entry point
- `_reqs/` - Requirements and selfevals (versioned immutables + executable tests)
- Appropriate structure for level (schemas, index.js, etc.)

### Executable Selfeval Pattern (Final)

**File naming:**
- Scripts: `{req_name}_selfeval*.js` (e.g., `api_node_v1.0.0_selfeval.js`)
- Data: `{req_name}_selfeval_data.json` (optional)
- Multiple per req: Use suffix (e.g., `_selfeval_structure.js`, `_selfeval_folders.js`)

**Single concern principle:**
- Each script tests ONE thing
- Minimal, complete, simple
- Focused error messages
- Stop-on-first-fail friendly

**Execution recipe:**
1. Discover all `*_selfeval*.js` in `_reqs/`
2. Load matching `*_selfeval_data.json` files
3. Execute each script with its data (or null)
4. Stop on first failure
5. Report results

**Script signature:**
```javascript
function selfeval(data) {
  // data from {req_name}_selfeval_data.json or null
  // perform tests
  // exit(0) = pass, exit(1) = fail with message
}

if (require.main === module) {
  let data = null;
  try {
    data = require('./{req_name}_selfeval_data.json');
  } catch (e) {}
  selfeval(data);
}
module.exports = selfeval;
```

**Local rules apply:**
- Each node runs its own selfevals
- Selfevals only test what their req specifies
- No checking child nodes (they test themselves)
- Inheritance via copying (version-stamped files in _reqs/)

### Test Runner

Created `run-selfevals.js` - cascading test execution:
- Discovers selfevals at each level
- Executes in tree order (root → package → api → methods)
- Stops on first failure
- Reports progress and results
- Works autonomously - just point it at a module

**Usage:**
```bash
node run-selfevals.js spl-dev-implementation
```

### Glossary Updates

**DSL Glossary additions:**
- `api_method` - moved from stepping stones (structure, not methodology)
- `api_overview` - moved from stepping stones (structure, not methodology)
- `create`, `install`, `submit`, `cycle`, `status`, `extract`, `destroy` - method names with semantic meanings

**Pattern established:**
- All method names must be in DSL with requirement defining meaning
- Method names locked across SPL2 (same meaning everywhere)
- DSL requirements inform help metadata

### Schema Decisions

**API-level invocation schema** (`spl/dev/_schemas/input.avsc`):
- `envRoot` - where to create dev environments (default: /tmp/dev-env)
- `setupRoot` - where setup folder lives
- `verbosity` - logging level
- `defaults` - map of method defaults
- `batch` - array of method calls to execute

**Method schemas:**
- All 7 methods have formal AVRO input/output schemas
- `cycle` refined: `single` (run one test vs all) + `exit` (stop vs loop), both default false
- Help metadata in schema `doc` fields (local help)
- API-level help in overview (usage patterns, examples)

**Design decision:** Don't try to be perfect day one
- Schemas have basic help in `doc` fields
- Overview has usage info
- Centralized help file deferred until help tool implementation
- Sufficient for AI to work with

### Method Argument Review Pattern

**Three-layer sandwich clarified:**
1. **API state** (persistent) - set by API invocation
2. **Previous output** (chained) - from last method call
3. **Method input** (explicit) - arguments to this method

**Priority:** method input > previous output > API state

**Question emerged:** How do methods know which environment?
- Deferred to implementation
- Could be API state tracking "current environment"
- Or explicit passing via previous output
- Pattern will emerge during implementation

### Work Module Structure Pattern

**Module level has:**
- Instance req (`spl_dev_implementation_v1.0.0.md`)
- Type req (`work_module_v1.0.0.md`)
- Base type req (`api_node_v1.0.0.md`)
- Selfevals for each (copied into _reqs/)

**Package/API/Method levels:**
- Instance req (what this specific thing is)
- Type req (pattern for this level)
- Inherited selfevals (copied with version stamps)

**Standalone principle:**
- Work module contains all needed selfevals
- No external dependencies for validation
- Portable - can run anywhere

### Test Execution Results

**16 selfevals across 4 levels - all passing:**
- Module: 3 selfevals (folders, files, api_node)
- Package: 5 selfevals (folders, files, api schemas, api invocable, api_node)
- API: 5 selfevals (methods exist, schemas, invocable, subfolders, api_node)
- Method (create): 3 selfevals (structure, schemas, api_node)

**Other methods:** Stubs created (index.js, README.md, schemas)
- Selfevals partially created
- Will complete as best-effort before closure

### Key Insights

**Autonomy boundary:**
- Good selfevals + clear reqs = autonomous execution possible
- Tests tell you exactly what's missing
- Stop-on-first-fail gives precise guidance
- Pattern enables AI to work independently

**Partnership quality metric:**
- Friction = requirements unclear
- Not "can AI do it" but "are reqs sufficient"
- Test failures improve requirements
- Cycle tightens partnership

**Pragmatism wins:**
- Build what's needed, improve through use
- Don't over-engineer on first pass
- Tests validate the minimum needed
- Sufficient > perfect

---

**Created:** 2025-11-19
**Updated:** 2025-11-20
**Context:** Project 08 - Dev Environment API iterations v1-v4
