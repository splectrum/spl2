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

**Created:** 2025-11-19
**Updated:** 2025-11-20
**Context:** Project 08 - Dev Environment API iterations v1-v4
