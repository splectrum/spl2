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
