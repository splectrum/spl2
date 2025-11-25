# Daily Log - Project 09: Console v5 Stream Native

---

## 2025-11-21

### Project Initiation

**Created project structure:**
- PROJECT_BRIEF.md
- DAILY_LOG.md (this file)
- RISKS.md

**Project type:** Exploration - discovering stream-native execution through console conversion

**Background:**
Extensive design session (chats/2025-11-21_project-09-planning-and-itil-dsl.md) explored:
- Pipeline islands in sea of free script
- Stream-native execution model
- Approach B (specialized handlers)
- Partnership contract
- Self-evals as linchpin

**Next:** Collaborative PROJECT_PLAN creation, then begin conversion work.

---

**PROJECT_PLAN created:**

Three twin products defined:
1. Building Blocks Exploration (event structure, handlers, queue mechanics)
2. Console v4 Migration (apply building blocks to real conversion)
3. Bug Report from Events (prove reconstruction)

**Key discoveries during planning:**
- Runtime = execution record (not separate concept)
- Events carry state, handlers decide flow (Approach B)
- pipelineType + stepCompleted/stepIndex track progress
- Handlers can be mechanical, intelligent, or dynamically expand steps
- Example: spl/dev/cycle expands single method into sequential selfeval list on-the-fly
- Queue: atomic writes (temp → rename), generic executor routes to handlers
- Handler freedom: as long as event state has enough info, any flow logic works

**Next:** Begin Stage 1 - Building Blocks exploration

---

## 2025-11-23

### API Ecosystem Design Session

**Explored API type taxonomy:**
- Three top-level types: Wrapper, DSL, [Future TBD]
- DSL subtypes: DSL/Execution (runtime, error, pipeline) and DSL/[Other]
- DSL/Execution common feature: API states library in `value` property
- Runtime is nested under execution (DSL/Execution/Runtime)
- Error extends runtime (DSL/Execution/Error)
- "execution" reserved as API type descriptor, not instance name

**AVRO + Selfeval synergy discovered:**
- Two-layer validation: AVRO (structure) + Selfeval (semantics)
- Bidirectional: Compliance testing + Discovery testing
- Trial and error selfeval testing to find compatible APIs
- Local rules apply: decompose complexity into many small reqs

**Created:** API_ECOSYSTEM_NOTES.md

---

### Pipeline Design and Data Layer

**Pipeline execution model - three layers:**
1. Free script handler (audit trail)
2. Pipeline processor (audit trail)
3. Request processing sequence (one per step)

**Fire-and-reference pattern:**
- Not fire-and-forget - events preserved with references
- Spider/mycelium pattern for reconstruction
- Top-down references (pipeline → steps) = happy path
- Bottom-up index = if required (exception scenarios)

**Filesystem implementation:**
- Primary key = folder + filename
- Subfolders for natural grouping: `events/pipeline-{id}/step-{n}_{timestamp}.json`
- Most recent file = last executed step

**Two data layer interfaces:**
1. Streaming (immutable): publish, consume, seek
2. Mutable file (versioned): read (latest), write (= publish)
- Both operate on same underlying immutable event stream
- Different access patterns for different use cases

**Execution context simplified:**
- Runtime/execution context → metadata header
- No nested multilevel records
- Flat event structure, single concern

**Value → Result flow:**
- Input → value (step 0)
- value → value (intermediate steps)
- value → result (last step)
- result → output (returned to handler)

**Programmatic disconnection:**
- Processor waits/listens for last step on topic
- Notification mechanism for completion

**Created:** PIPELINE_DESIGN_NOTES.md

---

### Iteration Plan Created

**Arithmetic handler exercise:**
- Four iterations: simple sequential → precedence → nested → multi-nested
- Test cases with clear right/wrong answers
- Progressive complexity demonstrates key design aspects

**Iterations:**
1. `3 + 5 - 2` - Sequential execution, natural forgetfulness
2. `3 + 5 * 3` - Handler intelligence, operator precedence
3. `3 * (5 + 7)` - Sub-pipeline pattern, parent/child coordination
4. `3 * (5 + 7) / (2 - 3)` - Complex coordination, multiple sub-pipelines

**Cross-cutting:** AVRO schemas, selfevals, queue mechanics, test harness

**Created:** dev/ITERATION_PLAN.md

**Next:** Begin implementation - data layer interfaces, then iteration 1

---

### Iteration 1 Implementation Complete

**Architecture decision: Functional scripts first, API structure later**
- dev/src/ - Functional implementation for iterations 1-4
- Focus: handler-request-pipeline interaction, audit trail, naming patterns
- Later (Product Twin 2): Proper spl/data API with Project 08 module structure

**Data layer implemented (dev/src/data.js):**
- Four operations: publish, consume, seek, read, write
- Filesystem implementation (later becomes spl/data/fs when abstracted)
- Atomic writes via temp file + rename (critical for listener pattern)
- Topic-based organization: `events/{topic}/{timestamp}.json`
- Only complete files visible to listeners (.tmp files excluded)

**Fire-and-forget + Handler daemon pattern:**
- **invoke.js** - Free script creates step 0 request, exits immediately (fire-and-forget)
- **handler-daemon.js** - Daemon watches request/ queue, processes requests asynchronously
- **File watcher** - fs.watch() with recursive option, only processes complete .json files
- **Stateless handler** - No internal state = no handler state events needed
- **Request events only** - Stream: `request/{requestId}/`

**Event structure:**
```javascript
// Step 0 (pending)
{
  requestId: "req-...",
  step: 0,
  input: "3 + 5 - 2",
  status: "pending",
  metadata: { timestamp: "...", topic: "..." }
}

// Step 1 (completed)
{
  requestId: "req-...",
  step: 1,
  input: "3 + 5 - 2",
  output: 6,
  status: "completed",
  metadata: { timestamp: "...", topic: "..." }
}
```

**Test files created:**
- iteration-1-async-test.js - Submit test cases (fire-and-forget)
- iteration-1-check-results.js - Verify results after processing
- Test cases: `3 + 5 - 2`, `10 + 20 + 30`, `100 - 50 - 25`, `7 + 3 + 1 + 9`

**Key learnings:**
1. Separate API structure from functional implementation (patterns first)
2. Stateless handlers don't need handler state events
3. Fire-and-forget enables async, decoupled processing
4. Atomic writes critical for listener pattern (only pick up complete files)
5. Handler watches for new files, processes step 0 requests
6. Request processing completes when output is single number (step 1)

**Files created:**
- dev/src/data.js (data operations)
- dev/src/invoke.js (fire-and-forget request creation)
- dev/src/handler-daemon.js (queue processor with file watcher)
- dev/src/iteration-1-async-test.js (test harness)
- dev/src/iteration-1-check-results.js (result verification)
- dev/src/arithmetic-handler.js (old synchronous version - can be removed)
- dev/src/iteration-1-test.js (old synchronous version - can be removed)

**Next steps:**
1. Test iteration 1 (run handler-daemon, submit requests, verify results)
2. Iteration 2: Operator precedence (handler intelligence)
3. Iteration 3: Nested expressions (pipeline pattern)
4. Iteration 4: Multi-nested expressions (complex coordination)

---

### Iteration 1.0 Testing & Refinement

**Platform issue resolved:**
- WSL2 doesn't support `fs.watch({recursive:true})`
- Switched to polling-based approach (100ms interval)
- Appropriate for exploration code

**Testing completed:**
- All 4 test cases pass: `3+5-2=6`, `10+20+30=60`, `100-50-25=25`, `7+3+1+9=20`
- Fire-and-forget pattern works
- Handler daemon processes asynchronously
- Event persistence confirmed
- Audit trail reconstruction successful

**Critical bug fixed - Reprocessing Loop:**
- **Problem:** Handler repeatedly processed step 0 instead of advancing
- **Root cause:** `processPendingRequests()` scanned ALL events every 100ms, always found step 0 as "pending"
- **Solution:** Track last processed step number per request (`Map<requestId, lastStep>`)
- **Pattern:** Only process next sequential step (lastStep + 1)
- **Key insight:** Event streams need cursors/positions, not full scans

**Architecture evolution - V2: Clean separation:**

**V1 issues:**
- Handler called `data.publish()` directly (coupling)
- No client-side result retrieval (fire-and-forget only)
- No daemon lifecycle management

**V2 improvements:**
1. **Handler purity:** Handler returns events, doesn't publish
2. **Daemon publishes:** `daemon-core-v2.js` publishes events returned by handler
3. **Client gets results:** `invoke-v2.js` with `waitForCompletion()` pattern
4. **Lifecycle management:** `install-handler.js` / `uninstall-handler.js` with PID tracking

**V2 Components created:**
- `daemon-core-v2.js` - Generic watcher + publisher (3.4K)
- `iteration-1-handler-v2.js` - Pure handler (2.4K)
- `invoke-v2.js` - Submit + wait for results (2.3K)
- `install-handler.js` - Start daemon (1.3K)
- `uninstall-handler.js` - Stop daemon (1.3K)
- `test-workflow.js` - Complete integration test (875 bytes)

**V2 testing:** All 4 test cases pass ✅

---

### Friction Analysis & 1.x Iteration Planning

**Friction points identified:**
1. Handler complexity mixing concerns (business logic + logging + errors)
2. No exception path separation (crash vs graceful error handling)
3. Daemon does too much (watching + reading + calling + publishing + logging)
4. Event structure not formalized (ad-hoc per handler)

**Low-friction vision:**
- **Single concern handlers:** Happy path only, clean business logic
- **Exception handlers:** Separate handlers for error paths (API method switches in future)
- **Housekeeping:** Background processes (don't interfere with request processing)
- **Handler hives:** Each handler owns its namespace in metadata

**Critical insights:**
- **Headers namespaced:** `headers.pr09.*` for all metadata (request, runtime, handler hives)
- **Value direct:** `value` is just the data payload (not namespaced)
- **Fire-and-forget principle:** Dump internal state AS IS, nothing more
- **Single record = minimal & complete:** Handler needs just enough to continue
- **Event history = more than complete:** Reconstruction shows full story
- **No step tracking needed:** Runtime properties drive processing (`requestcomplete`, `errorthrown`)
- **Processing until runtime says stop:** Handler checks `requestcomplete`, not step numbers

**Iteration 1.x plan created:**
- 1.0: Fire-and-forget pattern ✅ COMPLETE
- 1.1: Namespace structure & state context (pr09/, headers/value separation)
- 1.2: Event router & handler registry (separate routing from daemon)
- 1.3: Exception handlers & error events (error handling separation)
- 1.4: Middleware & cross-cutting concerns (logging extraction)
- 1.5: Polish & documentation (prepare for iteration 2)

---

### Iteration 1.1 Implementation Started

**Goal:** Establish pr09/ namespace structure and state context wrapper

**Namespace decision:**
- Everything in `pr09/` (simple, no prxx/spl split during exploration)
- Structure: `pr09/state/`, `pr09/handling/`, `pr09/router/`, `pr09/spot/`, `pr09/error/`

**State context design:**
- **headers.pr09.request.*** - Request metadata (id)
- **headers.pr09.runtime.*** - Runtime state (requestcomplete, errorthrown, status, handler, timestamp)
- **headers.pr09.{handler}.*** - Handler-specific hives (arithmetic, validation, logging)
- **value** - Direct data payload (NOT namespaced, owned by primary handler)

**Key principle:** Value = just the value itself
- Step 0: `value: "3 + 5 - 2"`
- Step 1: `value: 3` or `value: { current: 3, remaining: "+ 5 - 2" }`
- Step 2: `value: 8`
- Final: `value: 6`
- Reconstruction from event history tells the full story

**Files created:**
- `pr09/state/context.js` - ExecutionContext wrapper with direct property access ✅
- `pr09/state/context-test.js` - Tests for context wrapper ✅
- `pr09/handling/arithmetic1.js` - Refactored handler using context ✅
- `pr09/handling/arithmetic1-test.js` - Handler tests ✅

**All tests pass:** Context wraps events, handler processes step-by-step, metadata hives work

**Pause for restructure:**
- Need to follow pr08 v4 pattern: iteration folders with deploy scripts
- Structure: `dev/v1.0/` (iteration 1.0 original), `dev/v1.1/` (new pr09 structure)
- Each iteration standalone, no shared folders
- Next: Organize v1.0 properly, then continue with v1.1

**Session status:** Ready to restructure and continue iteration 1.1 implementation

---

## 2025-11-24

### Iteration 0: Reusable Dev Environment Package

**Purpose:** Create first properly reusable dev env package for all future iterations

**Pattern discovered:** pr08/v4 structure analysis revealed proper pattern:
- **Source** work module in root (not environment itself)
- **Deploy script** creates environment in `environments/`
- **Environment** gets package.json + node_modules + copy of work module
- **Separation:** Source (version controlled) vs Environments (gitignored, ephemeral)

**v0 Package Structure:**
```
v0/
├── README.md              # Complete documentation (replaces _reqs/)
├── deploy.sh             # Create new environment
├── test.sh               # Test latest environment
├── destroy.sh            # Remove environment(s)
├── implementation/       # Source work module (version controlled)
│   └── pr09/            # Work code lives here
└── environments/         # Created environments (gitignored)
    └── env-{timestamp}/ # Each deployment
        ├── package.json
        ├── node_modules/
        └── modules/
            └── pr09/    # Copied from implementation/
```

**Key decisions:**
1. **No _reqs/ folder** - README.md contains all necessary documentation
2. **implementation/ folder** - Holds source work module
3. **environments/ folder** - Holds deployed environments (ephemeral)
4. **Timestamp-based envs** - env-{timestamp} for easy multiple deployments
5. **Self-documenting** - README.md explains structure, cloning, usage

**Scripts created:**
- `deploy.sh` - Creates environment, copies work module, installs deps, runs tests
- `test.sh` - Finds and runs all *-test.js files in environment
- `destroy.sh` - Removes specific or all environments with confirmation

**Documentation pattern:**
- Contents-first: What this package contains
- Cloning-focused: How to clone for new iterations
- Usage examples: Three concrete examples
- Pattern explanation: Why this structure works

**Tested successfully:**
- ✅ deploy.sh creates environment (empty implementation/)
- ✅ test.sh handles "no modules" gracefully
- ✅ destroy.sh removes environment with confirmation

**Reusability:**
- This v0 is the template for all future iterations
- Clone to v1.0, v1.1, v2.0, etc.
- Each iteration independent with own implementation/ and environments/
- Low friction pattern established

**Notes updated:**
- PROJECT_PLAN now references iteration 0 as blank dev install template
- Future iterations should look for v0 pattern, not search through old work
- v0 is the first properly reusable dev env package

**Next:** Clone v0 to v1.0 and organize iteration 1.0 work (fire-and-forget pattern)

---

## 2025-11-24 (Session 2)

### v0 Refinement: install/ folder and clone.js

**install/ folder added:**
- Problem: Template files cluttering root directory
- Solution: `install/` folder for all environment assets
- Contains: `package.json.template`, `install.js` hook
- Deploy script copies from `install/` to new environments
- Keeps root clean and organized

**clone.js script created:**
- Turnkey iteration creation from v0
- Automatically updates package.json (name, version, description)
- Parses destination folder name (v1.0 → version 1.0.0)
- Makes all scripts executable
- Usage: `node clone.js ../v1.1`

**Pattern decision:**
- JS scripts instead of bash (more consistent, easier to maintain)
- All scripts: deploy.js, test.js, destroy.js, clone.js
- ES modules enabled in v0 package.json

**v0 final structure:**
```
v0/
├── README.md
├── package.json             # Enable ES modules
├── clone.js                 # NEW: Turnkey cloning
├── deploy.js, test.js, destroy.js
├── install/                 # NEW: Assets folder
│   ├── package.json.template
│   └── install.js          # Optional hook
├── implementation/
└── environments/
```

---

### v1.0 Creation and Organization

**Cloned from v0:**
- Used `node clone.js ../v1.0`
- package.json automatically updated
- All scripts ready to use

**Iteration 1.0 work copied:**
- 7 files from dev/src/ to v1.0/implementation/pr09/:
  - data.js (data layer operations)
  - daemon-core-v2.js (generic daemon)
  - iteration-1-handler-v2.js (arithmetic handler)
  - invoke-v2.js (client interface)
  - install-handler.js (start daemon)
  - uninstall-handler.js (stop daemon)
  - test-workflow.js (integration test)

**v1.0 README created:**
- Documents what iteration accomplished
- Lists all files with descriptions
- Shows event structure (V2)
- Usage instructions
- Test results (4/4 passing)
- Key discoveries documented

**Deployed successfully:**
- `node deploy.js` creates environment
- Environment: `env-1763988185891`
- All files copied to modules/pr09/

---

### Critical Issue Discovered: CommonJS vs ES Modules

**Problem found during testing:**
- v1.0 work files use CommonJS (`require`, `module.exports`)
- Environment package.json has `"type": "module"`
- Test execution fails with: "require is not defined in ES module scope"

**Root cause:**
- Original dev/src/ work done in CommonJS
- v0 template uses ES modules (for deploy/test/destroy scripts)
- Environment inherits ES module setting
- Work files incompatible

**Files needing conversion (all 7):**
- daemon-core-v2.js
- data.js
- install-handler.js
- invoke-v2.js
- iteration-1-handler-v2.js
- test-workflow.js
- uninstall-handler.js

**Options:**
1. Convert all files to ES modules (import/export)
2. Change environment to CommonJS (remove "type": "module")
3. Use .cjs extensions for CommonJS files

**Decision needed:** Follow splectrum standard (ES modules)

---

### Missing: Extraction/Reporting Mechanism

**Issue identified:**
- Deployed and tested, but no test reports saved
- No mechanism to extract "new state" work module
- Pattern from pr08/v4: `extract` method creates install candidate

**What's missing:**
1. **Reports folder** - Capture test results, validation logs
2. **Extract script** - Copy successful work module to install candidate
3. **Status tracking** - Mark iteration as "ready for install"

**pr08/v4 pattern:**
- Work module after testing returns "new state"
- If fully implemented → install candidate
- extract/ method in spl/dev API

**Need to add:**
- `extract.js` script to v0 template
- Reports folder in environment structure
- Test result persistence
- Extract workflow: test → validate → extract → install candidate

---

### Documentation Updates

**PROJECT_PLAN updated:**
- Added iteration 0 (blank dev install template)
- Added iteration 1.0 (fire-and-forget pattern) ✅ COMPLETE
- Added iterations 1.1-1.5 (namespace, router, exceptions, middleware, polish)
- References to ITERATION_PLAN.md for arithmetic exercise

**DAILY_LOG updated:**
- Complete session 1 notes preserved
- Session 2 work documented
- All decisions and discoveries captured

---

### Committed and Pushed

**Commit:** "Project 09: v0 dev env package + v1.0 iteration complete"

**61 files changed, 5478 insertions(+)**

Includes:
- Complete v0 package (clone.js, install/ folder, all scripts)
- Complete v1.0 iteration (7 work files, README, deployed environment)
- Updated PROJECT_PLAN and DAILY_LOG
- dev/src/ with original work (for reference)

---

### Session Status and Next Steps

**Current state:**
- ✅ v0 reusable dev env package complete
- ✅ v1.0 iteration cloned and organized
- ✅ v1.0 README documents accomplishments
- ✅ All work committed and pushed
- ❌ v1.0 tests not executable (CommonJS/ES modules mismatch)
- ❌ No extraction/reporting mechanism yet

**Immediate next session tasks:**
1. **Convert v1.0 files to ES modules** (7 files)
   - Change `require()` → `import`
   - Change `module.exports` → `export`
   - Test each file after conversion

2. **Full cycle test:**
   - `node deploy.js`
   - Run tests in environment
   - Verify all 4 test cases pass
   - Capture test results

3. **Add extraction mechanism:**
   - Create `extract.js` script
   - Add reports/ folder to environment
   - Implement test result persistence
   - Document extraction workflow

4. **Validate pattern:**
   - Full workflow: deploy → test → extract → destroy
   - Verify extracted work module is install-ready
   - Document in v0 README

**Long-term:**
- Clone v1.0 to v1.1 for namespace structure work
- Continue through iterations 1.1-1.5
- Eventually publish v0 to install/ spot at project closure

**Key insight from session:**
Testing the full cycle reveals issues early. The CommonJS/ES modules mismatch wouldn't have been caught without actually running the tests. This validates the need for the extraction workflow - it forces full cycle validation.

---

## Session 3: 2025-11-24 (ES Module Conversion + Extraction Mechanism)

**Duration:** ~1 hour
**Focus:** Resolve CommonJS/ES modules issue, complete extraction mechanism

### ES Module Conversion Complete

**Problem resolved:**
- 7 work files in v1.0/implementation/pr09/ were CommonJS
- Environment package.json has `"type": "module"`
- Tests failing with "require is not defined in ES module scope"

**Files converted:**
1. data.js - Added import/export, __dirname setup
2. daemon-core-v2.js - Changed require → import
3. iteration-1-handler-v2.js - Changed module.exports → export
4. invoke-v2.js - Changed require → import
5. install-handler.js - Added __dirname setup, changed imports
6. uninstall-handler.js - Added __dirname setup
7. test-workflow.js - Changed require.main check to import.meta.url

**Key patterns:**
- `import { fileURLToPath } from 'url'` for __dirname replacement
- `const __dirname = path.dirname(fileURLToPath(import.meta.url))`
- `import * as data from './data.js'` for namespace imports
- `export { ... }` for named exports
- `import.meta.url` for entry point detection

### Full Cycle Test Successful

**Workflow executed:**
1. Deploy: `node deploy.js` → env-1763991250705 created
2. Install: `node install-handler.js` → daemon started (PID 767639)
3. Test: `node test-workflow.js` → All 4 tests passed
4. Uninstall: `node uninstall-handler.js` → daemon stopped gracefully

**Test results (all passed):**
- `3 + 5 - 2 = 6` (3 steps)
- `10 + 20 + 30 = 60` (3 steps)
- `100 - 50 - 25 = 25` (3 steps)
- `7 + 3 + 1 + 9 = 20` (4 steps)

**Handler daemon processing visible:**
- Step-by-step event publishing logged
- Fire-and-forget pattern working correctly
- Poll-based queue processing functioning
- Graceful shutdown working

### Extraction Mechanism Added

**Created extract.js script:**
- Finds latest (or specified) environment
- Copies work module to extracted/{envName}/
- Preserves event logs if present
- Creates MANIFEST.json with extraction metadata

**Extraction structure:**
```
extracted/env-{timestamp}/
├── pr09/                      # Work module files
├── events/                    # Event logs (if any)
└── MANIFEST.json              # Extraction metadata
```

**Workflow validated:**
- Deploy → Test → Extract → Destroy
- All steps working correctly
- Extract preserves work for install candidate
- Destroy cleans up after extraction

**Scripts added:**
- v0/extract.js (template)
- v1.0/extract.js (copy)

### Pattern Complete

**v0 package now has:**
- deploy.js - Create environment
- test.js - Run tests
- extract.js - Create install candidate ✅ NEW
- destroy.js - Clean up
- clone.js - Clone to new iteration

**Full dev workflow:**
1. Modify implementation/pr09/
2. `node deploy.js` → fresh environment
3. `node test.js` → verify tests pass
4. `node extract.js` → capture install candidate
5. Review extracted/ for next iteration
6. `node destroy.js` → clean up

### Session Status

**Completed:**
- ✅ ES module conversion (7 files)
- ✅ Full cycle test validation (4/4 passing)
- ✅ Extraction mechanism implementation
- ✅ Workflow validation (deploy/test/extract/destroy)

**v1.0 state:**
- Fire-and-forget + handler daemon pattern working
- ES modules throughout
- Full dev workflow functional
- Install candidate extractable
- Ready for refinement or next iteration

**Next options:**
1. Clone v1.0 to v1.1 for namespace structure (planned)
2. Add reports/ folder for persistent test results
3. Enhanced extraction with test summaries
4. Begin iteration 1.1 work

### Key Learnings

**ES modules in Node.js:**
- `__dirname` not available, must reconstruct from import.meta.url
- Entry point detection changes from `require.main === module` to comparing paths
- Namespace imports useful for data modules: `import * as data`

**Dev workflow value:**
- Extract enables capturing "known good" state
- Extraction before destroy prevents loss
- Manifest provides traceability
- Pattern enables rapid iteration

**Testing discoveries:**
- Fire-and-forget pattern needs async wait in tests
- Handler daemon processing visible via logging
- Event streams preserved for audit/reconstruction
- Poll-based queue processing simple and effective

---

## Session 4: 2025-11-25 (Design Evolution & V0 Model Dev Env)

**Duration:** ~3 hours
**Focus:** Type hierarchy design refinement, dev modules stepping stone, v0 model dev env foundation

### Major Design Work

**1. Overlay + Extraction Pattern Design**
- Created OVERLAY_EXTRACTION_PATTERN.md
- Multi-layer overlay resolution (work → base → types → models)
- Progressive refinement with defaults
- Extract merges layers for deployment
- Committed separately as design principle

**2. Type Hierarchy & Overlay Design (Complete Roadmap)**
- Created TYPE_HIERARCHY_OVERLAY_DESIGN.md
- Type hierarchy: api_node (base) with package/api/api_method siblings
- Declaration-driven: types declare "Extends:", instances declare "Instance of:"
- Upfront validation on env creation
- Two overlay operations: selectFile() (first match), collectAll() (accumulate)
- Hierarchy map: one search sequence per node
- Progressive refinement pattern documented
- Committed with full architecture

**3. Hierarchy Map Implementation Details**
- Added hierarchy map section to design doc
- Layer sequences built once on deploy
- Stable cache (only rebuilds on structure changes)
- selectFile() for implementations (falls back to defaults)
- collectAll() for self-evals/requirements (accumulates all layers)
- Export behavior: always produces complete module
- Committed as design enhancement

### Stepping Stone Created

**dev modules (extends modules):**
- Created dev modules_v1.0.0.md
- Type-aware modules folder for dev environments
- Layer 0 = types/, Layers 1..n-1 = base modules, Layer n = work module
- Overlay resolution with selectFile/collectAll
- Dev-only (not in production/runtime)
- Added to STEPPING_STONES_GLOSSARY.md
- Fixed naming: "dev modules" with space (not hyphen)
- Added version post-amble: **Version:** 1.0.0

### Practical Patterns Discovered

**File Naming & Versioning:**
- External (stepping stones): versioned filenames (`term_v1.0.0.md`)
- Internal (bundles): generic filenames (`term.md`)
- Version tracked in post-amble internally
- Stable references in bundles, no link breakage

**Glossary Conventions:**
- Stepping stones: space separator (`dev modules`)
- DSL: underscore separator (`api_node`)
- Different purposes: methodology vs runtime vocabulary

**V0 Model Dev Env Pattern:**
- V0 as always-current portable template
- Lives in latest project: `projects/09-.../dev/v0/`
- Self-contained with all docs/types/patterns
- Clone and use anywhere

### V0 Model Dev Env Started

**Structure created:**
```
dev/v0/
├── docs/                   # Clean req files only
│   ├── modules.md          # Generic filename, version in post-amble
│   └── dev modules.md      # Generic filename, version in post-amble
├── modules/                # Dev modules structure
│   └── types/              # Layer 0 (created, empty)
└── ... (existing scripts)
```

**Working documents in project root:**
- PRACTICAL_PATTERNS.md - File naming, bundling, conventions
- DATA_VS_LANGUAGE.md - Mycelium vs DSL distinction

### Foundational Understanding Developed

**Data vs Language Distinction:**
- Mycelium: Data structures + data change events (the "what")
- DSL: Operators/methods that generate events (the "how")
- Uniform pattern: data structure name = API name
- Example: `api_node` data structure + `spl/api_node/` API
- Inheritance: derived data structures get parent API methods

**Naming Conventions Confirmed:**
- DSL uses underscore: `api_node`, `api_method`
- URI separator: forward slash `/`
- Example: `spl/api_node/validate/`
- Consistent, discoverable, low friction

### Session Status

**Completed:**
- ✅ Overlay + extraction pattern documented
- ✅ Type hierarchy complete design
- ✅ Hierarchy map implementation details
- ✅ dev modules stepping stone created and registered
- ✅ Version post-amble pattern established
- ✅ V0 structure started (docs/ and modules/ created)
- ✅ Foundational understanding documented
- ✅ Data vs language distinction clarified

**In Progress:**
- ⏸ V0 model dev env population (modules/types/ needs node type folders)
- ⏸ Node type requirements (api_node, package, api, api_method)
- ⏸ Status/CURRENT.md update (note v0 location)

**Next Session:**
1. Create node type folders in modules/types/
2. Write requirements for each node type
3. Create _index.json for modules/
4. Update status/CURRENT.md with v0 location
5. Update v0 README with model dev env explanation
6. Ready to start v1.1 iteration work

### Key Decisions

**1. V0 is always-current model:**
- Update it as patterns evolve
- Lives in latest project
- Portable, self-contained
- Clone for new iterations

**2. Working docs vs bundle docs:**
- Working docs in project root (PRACTICAL_PATTERNS.md, etc.)
- Bundle docs in v0/docs/ (clean req files only)
- Distill working docs to summaries at project closure

**3. Version tracking:**
- Filenames: versioned externally, generic in bundles
- Post-amble: **Version:** x.y.z in all touched req files
- Incremental: only add when we touch files, no mass upgrade

**4. Glossary separation:**
- Stepping stones: methodology/dev concepts (space separator)
- DSL: runtime vocabulary (underscore separator)
- Clear distinction based on: "exists at runtime?"

### Design Artifacts Created

**Project root:**
1. OVERLAY_EXTRACTION_PATTERN.md - Overlay + extraction design
2. TYPE_HIERARCHY_OVERLAY_DESIGN.md - Complete architecture roadmap
3. PRACTICAL_PATTERNS.md - Working patterns (file naming, bundling, etc.)
4. DATA_VS_LANGUAGE.md - Mycelium vs DSL foundational distinction
5. dev modules_v1.0.0.md - Stepping stone (also in glossary)

**All committed and pushed** (multiple commits during session)

### Insights

**Low friction prerequisites:**
- Clear understanding of data vs language
- Consistent naming conventions
- Predictable patterns everywhere
- Discoverable structure
- Good understanding reduces friction

**Progressive refinement enabled:**
- Overlay provides defaults
- Work module can start minimal
- Tests run with base implementations
- Gradually override specific parts
- Extract produces complete module

**Uniform DSL pattern:**
- Every data structure has associated API
- Same name for both (e.g., `api_node`)
- Natural inheritance
- Clear, discoverable

**Version 1.0.0 note:**
- Added version post-amble to touched req files
- Pattern established for future req files
- Clean separation: versioned source, generic bundle references

---

## 2025-11-25

### Session 6: Event Record Structure & Lib Resolution

**Event record structure refined:**

Applied Kafka record rules with proper API namespacing:
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

**Key decisions:**
- `headers.spl.runtime` - cross-cutting runtime state (error, timestamp)
- `headers.spl.request` - request lifecycle (guid, completed, ttl, uri)
- Method input namespaced by path: `headers.pr09.console.hello.*`
- `value` = API state (data desk), not used for direct method invocation yet
- `_return` enables pipelining (at all levels: method, API, package)

**Method signature:**
```javascript
import spl from 'spl/core.js'

export function handle(record) {
  console.log(record.headers.pr09.console.hello.message)
  spl.complete(record)
}
```
- Method receives Kafka record directly
- Method imports libs (encapsulation)
- Handler is dumb - just passes record

**Lib resolution pattern established:**

Three concerns, three layers:

| Concern | Location | Maintenance |
|---------|----------|-------------|
| Node resolution | `node_modules/spl/core.js` | Static (set once) |
| Overlay resolution | `lib/spl/core.js` (symlink) | On new lib file |
| Source | `modules/work_module/spl/_lib/core.js` | Edit freely |

Benefits:
- Clean imports (no path traversal)
- Static package.json (no sync needed)
- Standard Node resolution
- Overlay works via symlinks
- spl is just a package like pr09 (same structure)

See: LIB_RESOLUTION_PATTERN.md

**Work module structure:**
```
modules/
└── work_module/           # module_root
    ├── spl/               # package (core libs)
    │   └── _lib/
    │       └── core.js
    └── pr09/              # package (our work)
        └── console/       # api
            └── hello/     # method
```

**Next:** Implement lib resolution structure and test hello method with spl/core.js

---

### Lib Resolution Implemented

**Final structure:**
```
v0/
├── node_modules/lib/
│   ├── package.json      # { "type": "module" }
│   └── core.js           # re-export from ../../lib/core.js
├── lib/
│   └── core.js           # symlink → modules/work_module/_lib/core.js
└── modules/work_module/
    ├── _lib/
    │   └── core.js       # root level lib source
    └── pr09/console/hello/
        └── index.js
```

**Import pattern:** `import { createSpl } from 'lib/core.js'`

**Wrapper pattern adopted:**

Libs provide factory functions that bind to the record:

```javascript
// core.js
export function createSpl(record) {
  return {
    headers: record.headers,
    value: record.value,
    complete() { record.headers.spl.request.completed = true },
    error(msg) { /* ... */ }
  }
}
```

**Method pattern - clean index.js:**

```javascript
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)

  console.log(spl.headers.pr09.console.hello.message)
  spl.complete()
}
```

**Method-level libs extend for domain vocabulary:**

```javascript
// index.js - reads like requirements
import { createHello } from 'lib/pr09/console/hello.js'

export function handle(record) {
  const hello = createHello(record)

  hello.greet()
  hello.complete()
}
```

- **index.js** = what (flow, intent)
- **_lib/*.js** = how (implementation details)
- Function names become method's vocabulary

**Hierarchy for libs:**
- `node_modules/lib/` - static, set once
- `lib/` - symlinks, updated on new lib
- `modules/work_module/_lib/` - root level libs
- `modules/work_module/{pkg}/{api}/{method}/_lib/` - method level libs

See: LIB_RESOLUTION_PATTERN.md

**Tests passing:** hello method works with full lib resolution chain

---

### Dev Environment Flow Fixed

**Proper flow established:**
1. `modules/` - source bundles (work_module, types)
2. `install/install.js` - copies modules/ to implementation/ with lib resolution
3. `deploy.js` - creates env instance from implementation/
4. Run in `environments/env-{timestamp}/`

**Fire-and-forget events:**
- Timestamped filenames with collision handling (digit suffix)
- Two events per request: initial (pending) + executed (complete)
- TTL counts down (not iteration up)

**Method requirements and self-eval:**
- Created `pr09/console/hello/_reqs/pr09_console_hello_v1.0.0.md`
- Created self-eval that validates:
  - index.js exists and exports handle
  - Reads from correct namespace
  - Calls complete()
  - No cross-API access

**README.md updated** with current structure and flow.

**Full cycle verified** in deployed environment instance.
