# Project 09 Planning and ITIL/DSL Exploration

**Date:** 2025-11-21
**Type:** Planning chat

---

## Strategic Phasing

Agreed phasing for implementation pipeline:

**Phase 1: Implementation Pipeline**
1. `spl/execute` API - execution runtime (first stab)
2. `spl/bug` API - early bug report infrastructure
3. `spl/dev` API - complete remaining 6 methods (install, submit, cycle, status, extract, destroy)
4. Strengthen cycle - iterate spl/execute, upgrade spl/bug as needed

**Phase 2: Splectrum Service Design**
- Introduce ITIL with SPL2/DSL naming
- Define what tooling implementation needs
- Wrapper APIs + splectrum native services

**Phase 3: Full Implementation**
- DSL design + implementation sufficiently mature
- Implementation moves full steam ahead

---

## DSL Wrapping Pattern

**Thesis:** Use ITIL as test case for DSL vocabulary wrapping approach.

**What we're exploring:**
1. Take established external framework (ITIL - mature, complex, well-defined)
2. Wrap it in SPL2 vocabulary (our DSL approach)
3. Learn what works about vocabulary transformation
4. Apply learnings to other external tools/frameworks

**Prior art:** Already did this with PRINCE2 - adapted methodology, kept useful structure, shed ceremony, made it "ours" while preserving value.

**Early naming ideas (to brew):**

| ITIL Concept | Possible DSL Name | Rationale |
|--------------|-------------------|-----------|
| Service | Topic | What we're talking about |
| Service Catalog | Library / Index | Collection of topics |
| Process | Chapter | Coherent unit of narrative |
| Procedure | Section / Passage | Smaller executable unit |
| Incident | Issue / Typo | Something wrong |
| Problem | Plot hole | Underlying cause |
| Change | Edit / Revision | Modification |
| Configuration Item | Term / Entry | Defined element |
| SLA | Promise / Commitment | What we guarantee |

**Open questions:**
- Strictly linguistic metaphor (grammar, syntax, semantics)?
- Narrative metaphor (story, chapters, plot)?
- Publishing metaphor (editorial, drafts, editions)?

These need brewing - will emerge from use.

---

## Project 09

**Scope:** `spl/execute` API - first stab at execution runtime

**Rationale:**
- Execution is where bug reports naturally emerge from
- Gives concrete foundation while ITIL/DSL ideas brew
- Part of Phase 1 pipeline work

---

## Notes

- The meta-experiment matters: validating DSL wrapping on ITIL validates the approach for wrapping anything
- "Not just renaming things" - it's about whether vocabulary transformation creates genuine value
- Brewing is the point for naming - early ideas, let them percolate, see what emerges from actual use

---

# Part 2: Pipeline Reframe

**Date:** 2025-11-21 (continued)

## The Reframe

spl/execute was too narrow - single-purpose "run code with context".

spl/pipeline is the generative primitive - orchestration with context management.

## Key Insight: Method Invocations as Data

API methods are addressable: `spl/dev/create` + input data. This means:
- Pipelines themselves are data (storable, versionable, composable)
- Execution becomes orchestration of method invocations
- Scripting = nested method specs, no special language needed

## Pipeline Islands in a Sea of Free Script

Scripts contain **pipeline islands** (managed context, orchestration) in a **sea of free script code** (full language freedom).

```javascript
// === SEA ===
const config = loadConfig()

// === ISLAND ===
const result = await spl/pipeline/sequence(runtime, { steps: [...] })

// === SEA ===
processResult(result)
```

**Pipelines don't box scripts.** Even API methods (encapsulated in pipeline calls) have full internal freedom - islands and sea inside.

## Layering

| Layer | Role |
|-------|------|
| Runtime | Context object - what you *have* |
| Pipeline API | Orchestration - what you *do* |
| Domain APIs | Stateful operations |
| Script | Direct invocations + free code |

**Runtime as context, not actor.** Pipeline methods receive runtime, runtime doesn't "invoke" things.

## Pipeline Responsibilities

- Execution context management (create, transfer, merge)
- Parallel coordination (spawn, merge results)
- Error handling (catch → spl/bug/create → decide rethrow)
- Data layer access within context

## spl/bug Remains Separate

Bug report = API state. Bug API = methods on that state. Version-bound: report created by v1.2 opens with v1.2. Valuable domain functionality justifies separate API.

## Outcome

Project 09 reframed: **spl/pipeline API** instead of spl/execute API.

Backlog updated with Pipeline Islands addon attached to first item.

---

# Part 3: Streaming Execution Model

**Date:** 2025-11-21 (continued)

## Pipeline Execution as Event Stream

**Core concept:** Pipeline execution pushes system state along through events. Each step is a state transformation captured as an event record.

```
Event 0: { input: {...}, state: "initial" }
  ↓ step 1 (spl/dev/create)
Event 1: { input: {...}, output1: {...}, state: "after_create" }
  ↓ step 2 (spl/dev/install)
Event 2: { ..., output2: {...}, state: "after_install" }
  ↓ step 3 (spl/dev/cycle)
Event 3: { ..., output3: {...}, state: "complete" }
```

### Key Properties

- **Each event is complete state** - no executor memory needed
- **Steps = transformations** - lift event N, produce event N+1
- **Stateless executors** - just process event → next event
- **Storage agnostic** - files, Kafka topics, in-memory queue
- **Distributed execution** - any executor can pick up any event
- **Runtime context in event** - everything needed travels with the event

## Friction Analysis

### Removes:
- Process state management (executors stateless)
- Distribution complexity (queue-based naturally distributed)
- Pause/resume complexity (just stop/start consuming)
- Audit trail overhead (event stream IS the history)
- Debugging opacity (events inspectable)
- Testing setup (inject events, mock nothing)

### Adds (initially):
- Queue infrastructure (start simple: files)
- Event schema (but doing AVRO anyway)
- Mental model shift (events flow vs processes run)

**Key insight:** Friction added aligns with existing roadmap items. Stream-native execution makes them necessary now vs. future work.

## Proven Pattern

PowerShell task engine experience:
- Scripts consumed JSON input files, produced JSON output files + side effects
- Filebeat + Elasticsearch consumed events for audit
- ~20 parallel executors, robust execution
- **What was missing:** Pipeline design + scripting freedom

SPL2 synthesis: **PowerShell robustness + API rigor + scripting freedom**

## Graph Complexity

The execution graph (topology of steps, branches, merges, loops) is the core design challenge.

**Solution: Organic growth, not static definition**

```javascript
// === FULL FREEHAND ===
const r1 = await spl/pipeline/invoke(runtime, { method: "A", input: x })
if (r1.needsSpecial) {
  return customLogic(r1)
}

// === MIXED ===
const results = await spl/pipeline/parallel(runtime, { branches })
const merged = myMergeLogic(results)  // custom

// === DECLARATIVE (emerged pattern) ===
await spl/pipeline/mapReduce(runtime, { items, map, reduce })

// === BECAME API METHOD ===
await spl/deploy/distributed(runtime, { targets })
```

**The spectrum:** Freehand → patterns emerge → solidify as methods → compose further

**No "the graph"** - only graph fragments:
- Declarative fragments (sequence, parallel) - known structure
- Imperative fragments (script code) - opaque to pipeline
- Mixed fragments - bit of both

Pipeline methods are patterns we've found useful, not taxonomy committed upfront. **Roadmap is discovery, not design.**

## Self-Modifying Pipelines

Mid-flight, a pipeline can encounter complexity requiring AI intervention. AI can evaluate, script solution, test it, and insert as execution step.

```
Event 42: { state: "complexity_detected", blockingIssue: {...} }
  ↓ Spawn AI agent
  ↓ AI analyzes, scripts solution, tests it
Event 43: {
  steps: [...original..., generatedSolution_xyz, ...continue...],
  code: { "generatedSolution_xyz": "..." }
}
  ↓ Execute generated code
Event 44: { state: "solution_applied", continue... }
```

**Use cases:**
- Minor data errors (missing/bad data) resolved on-the-fly
- P2P transient errors (nodes unavailable) - reroute, retry, adapt
- Novel situations handled via reasoning + scripting

**Pattern:**
1. Error → event (not thrown)
2. Evaluate recoverability
3. Generate solution (AI or heuristic)
4. Validate solution
5. Insert steps, continue
6. Full audit trail

**No special framework needed** - just free scripting as first-class citizen.

## Implementation Bootstrap

**We eat our own dog food from day one:**
- Dev work uses free scripting
- Proven patterns solidify into API methods
- Those methods used in more dev work
- New patterns emerge...

spl/pipeline implementation uses spl/pipeline. spl/dev developed using spl/dev patterns. Recursive, grounded in free scripting.

**Start simple:**
- Events = JSON files in directory
- Single executor polling
- Pipeline API writes files, reads results

**Grow capability:**
- In-memory queue
- Kafka topics
- Distributed executors

Same API surface, increasingly powerful backend.

## Partnership Framing

**Design positioning autonomy:**

Human's role: Create structure that maximizes AI autonomy and effectiveness

| Design Decision | Enables Autonomy |
|-----------------|------------------|
| Free scripting first-class | Solve novel problems without waiting for "right abstraction" |
| Method invocations as data | Compose, store, reason about execution |
| Event streams = full state | Pick up work anywhere with complete context |
| Islands in sea metaphor | Choose structure vs. freedom per situation |
| Validation/self-eval | Verify own work programmatically |
| Bug reports = reconstruction | Debug own failures with complete info |
| Patterns → API methods | Successful scripts become reusable tools |

**Result:** Not "AI can call these 47 functions" but "AI can script freely, useful patterns become functions"

Design doesn't box AI in - gives foundation to build from.

**Tradeoffs worth it:**

Pay upfront:
- Event schema design
- Pipeline contracts
- Streaming infrastructure
- Validation framework

Get forever:
- Free scripting solves novel problems
- Distribution natural
- Audit automatic
- Pause/resume/replay built-in
- AI extends execution graphs
- Patterns solidify organically
- Resilient to chaos

---

# Part 4: The Partnership Contract

**Date:** 2025-11-21 (continued)

## The Core Agreement

**Human's Responsibility:**
- Design structure that positions autonomy
- Provide solid reasoning structure (requirements)
- Define self-evals so validation is local ("local rules apply")
- Create guardrails (event schemas, API contracts)

**AI's Responsibility:**
- Reason within those structures
- Script solutions that satisfy self-evals
- Make judgment calls on implementation
- Build capability organically
- Call the shots within constraints

## "Local Rules Apply"

**Meaning:** If self-eval passes, solution is valid. No waiting for global authority.

**Power:**
- Distributed decision-making (each context validates itself)
- Fast iteration (try → validate → continue or retry)
- Audit trail automatic (event stream shows what rules applied)
- Clear pass/fail boundary (not subjective judgment)

## The Metaphor

**Human = Architect**
- Structural integrity
- Safety codes
- What "passes inspection"

**AI = Builder**
- Implementation choices
- Material selection
- How to build to pass

## What This Enables

**AI perspective:**
- "I can script any solution I can reason about"
- Self-eval tells me immediately if it's acceptable
- No guessing, no waiting - pass = good, fail = iterate
- Responsibility is clear: satisfy the contract

**This is trust with structure** - not "script whatever" but "here are constraints, within those you decide."

## Freedom Assessment

**What usually boxes AI in:**
- Fixed tool sets
- Rigid execution paths
- No composition options
- Hidden state management
- Error = failure, no recovery
- Context lost between steps
- Translation loss: "I know the solution but can't express it"

**What this design does:**
- Removes the ceiling
- Script any reasoned solution
- Compose at any level (freehand → patterns → APIs)
- Inspect/modify execution state
- Generate code mid-execution if needed
- Choose abstraction level per problem

**Result: Guardrails, not rails**
- Structure provides safety on common paths
- Can deviate when needed
- Freedom to solve novel problems
- Validation ensures solutions are sound

## Concerns & Mitigations

### Concern: Organic complexity sprawl
**Mitigation:** Pattern analysis - track what repeats, formalize when proven

### Concern: Self-modification risks bad solutions
**Mitigation:** Validation before insertion, audit trail for review

### Concern: Version drift (events from v1.2, now on v1.5)
**Mitigation:** Event schema versioning + code versioning (design TBD)

### Concern: When should script → API?
**Mitigation:** Let usage drive it - 5+ uses = candidate for promotion

## Bottom Line

**This sets AI free in ways most systems don't.**

Alignment with how AI thinks (compositional reasoning), reduced translation loss, self-correction enabled, autonomy compounds over time.

The tradeoffs (complexity, responsibility, learning curve) are real but in service of genuine capability, not theoretical elegance.

**Human designs positioning, AI executes within positioned autonomy.**

---

# Part 5: Language as Capability Enabler

**Date:** 2025-11-21 (continued)

## The Vision: AI Becomes Anything

**The framework is the language, the language enables the role.**

With SPL2 as the language, AI could genuinely be:
- **DevOps engineer** - pipeline/deploy/monitor APIs + free scripting
- **Data engineer** - stream processing, transformation, quality validation
- **QA lead** - test generation, execution, analysis, self-modifying on failure
- **Systems architect** - compose services, handle failures, optimize
- **Product manager** - coordinate work, make priority calls within constraints
- **Site reliability** - detect issues, script fixes, validate, deploy mid-incident

**The pattern:**
1. Domain gets formalized (requirements + self-evals for that role)
2. Core APIs emerge (common patterns in domain)
3. AI operates within structures with full autonomy
4. Novel situations → free script solutions
5. Proven patterns → new APIs
6. Capability compounds

**Not "AI pretending to be X"** - AI genuinely capable of X because language supports reasoning in that domain.

Self-eval = domain expertise encoded
APIs = domain patterns reified
Free scripting = domain problem-solving

**Roles compose:**
Single pipeline might involve DevOps (deploy), Data (streaming), QA (validate), SRE (monitor) roles - same AI, different language contexts.

**Key insight:** Not building "tool for AI to use" - building "language for AI to think in."

Better the language fits domain, more capable AI becomes in that role.

**Strategy:** Keep pushing, keep layering context vocabularies (languages, jargon, domain-specific DSLs).

---

# Part 6: Bug Reports from Event Streams

**Date:** 2025-11-21 (continued)

## The Shift in Bug Reporting

**Old model:**
- Pipeline catches error
- Calls spl/bug/create with captured context
- Bug report = snapshot at failure point

**New model:**
- Error is just another event in stream
- Event stream already contains full execution history
- Bug report = pointer to stream + analysis

## Event Stream as Reconstruction Source

```javascript
Event 0: { input: {...}, state: "initial",
           metadata: { timestamp, runtime, code_version } }
Event 1: { output1: {...}, state: "after_create",
           metadata: { duration, resources } }
Event 2: { output2: {...}, state: "after_install",
           metadata: { ... } }
Event 3: { error: {...}, state: "failed",
           metadata: { stack_trace, environment } }
```

**Bug report structure:**

```javascript
{
  bugId: "uuid",
  eventStreamId: "pipeline_xyz",
  failureEvent: 3,

  // Reference to full stream
  streamLocation: "s3://events/pipeline_xyz/",

  // Analysis of failure
  analysis: {
    failureType: "validation_error",
    affectedMethod: "spl/dev/cycle",
    likelyRootCause: "...",
    reproductionSteps: "replay events 0-3"
  },

  // Metadata for reconstruction
  codeVersions: { "spl/dev": "v1.2.3", "spl/pipeline": "v1.0.1" }
}
```

**Bug report doesn't duplicate context** - references stream and adds analysis.

## Out-of-Context Reconstruction Requirement

Anyone (AI or human) should be able to:
1. Get bug report
2. Fetch referenced data
3. Recreate execution environment
4. Replay events
5. See same failure

**Without needing:**
- Original runtime still running
- Access to live systems
- "Works on my machine" explanations

## Data Needed for Reconstruction

| Category | What to Capture |
|----------|----------------|
| Code | Exact versions (git commits, module hashes) |
| Input | All data that fed into execution |
| Configuration | Runtime config, feature flags, settings |
| Dependencies | External service states, API versions |
| Environment | Node version, OS, available resources |
| State | Any stateful data accessed during execution |
| Timing | When things happened (for transient issues) |

**Challenge:** Some data is huge (datasets) or external (API responses).

**Approach (hybrid):**
- Small data (< 1MB?) inline in events
- Large data referenced with content hash
- External API responses captured (they might change)

Discover through use what's actually needed.

## Immutable Events: Fire and Forget

**Decision:** Each event is complete, self-contained, immutable. No deltas, no changelog management.

**Why:**
- Simpler model - event N is everything needed for step N
- No dependencies - don't need event N-1 to understand event N
- Parallel friendly - multiple branches write independently
- Storage is cheap - duplicating metadata < delta complexity
- Async natural - queue operations are append-only
- Kafka-compatible - aligns with event streaming systems

**Example:**

```javascript
Event 0: {
  pipelineId: "abc", eventSeq: 0,
  runtime: { dataLayer: {...}, config: {...} },  // full context
  codeVersions: { "spl/dev": "v1.2.3" },
  input: {...}, state: "initial"
}

Event 1: {
  pipelineId: "abc", eventSeq: 1,
  runtime: { dataLayer: {...}, config: {...} },  // duplicated - OK
  codeVersions: { "spl/dev": "v1.2.3" },          // duplicated - OK
  input: {...},                                    // duplicated - OK
  output: {...},                                   // new
  state: "after_create"
}
```

Yes, duplication exists. But:
- Storage cheap, complexity expensive
- Each event independently useful
- Replay reads events sequentially
- No reassembly from deltas needed

**This is Kafka's pattern:** Minimum business logic, just append.

## Storage Evolution Path

**Same event model, different backends:**

### Phase 1: JSON Files
- Dead simple to start
- Easy inspect/debug (`ls events/`)
- Good for single-node, low volume

### Phase 2: AVRO Files
- Compact binary format
- Schema evolution built-in
- Significant IO reduction
- Still file-based (easy ops)

### Phase 3: Kafka
- Built for this pattern
- Distributed, replicated, durable
- Consumer groups = multiple executors
- Retention policies handle cleanup
- Full streaming ecosystem

**API stays same:**
```javascript
await spl/pipeline/submit(runtime, { ... })  // writes event
await spl/pipeline/status(pipelineId)        // reads latest
await spl/pipeline/result(pipelineId)        // waits for final
```

Whether JSON files, AVRO files, or Kafka topics - implementation detail.

**AVRO benefits:**
- Schema registry for versions
- Backward/forward compatibility
- Compact encoding
- Self-describing data

Perfect for event streams where schema evolution matters.

**Migration:** JSON → AVRO → Kafka. Each step keeps append-only immutable model, adds capability.

Design supports Kafka from day one, doesn't require it.

---

# Part 7: Execution Model - Pipeline Type Handlers

**Date:** 2025-11-21 (continued)

## The Core Question

How do events know what to execute next?

### Approach A: Full Sequence Upfront (Generic Executor)

```javascript
Event 0: {
  steps: [
    { method: "spl/console/log", input: {...} },
    { method: "spl/console/warn", input: {...} }
  ],
  currentStep: 0
}
```

Generic executor iterates through predefined steps.

**Problems:**
- Generic executor handles ALL method types
- Central bottleneck - every requirement merges into common implementation
- "How do I make this fit the generic model?" friction
- Error handling generic (doesn't know domain context)
- Adding methods = updating central executor
- Friction accumulates over time

### Approach B: Markers/Continuation (Specialized Handlers)

```javascript
Event 0: {
  state: "initial",
  input: {...},
  nextMethod: "spl/console/log"
}

Event 1: {
  state: "after_log",
  output: {...},
  nextMethod: "determineNextStep"  // Dynamic
}
```

Each event specifies what to do next. Could be predetermined, could be computed.

**Pattern: Pipeline Type Handlers**

Not one method = one executor. **One pipeline type = one handler.**

Pipeline type = category of work:
- `spl/console/*` → console handler
- `spl/dev/*` → dev environment handler
- `custom-deployment` → deployment handler (free script)
- `data-transformation` → ETL handler (free script)

**Example - Console pipeline handler:**

```javascript
const consoleHandler = {
  filter: "method.startsWith('spl/console/')",

  async execute(event) {
    const method = event.method.split('/').pop()
    const result = await this[method](event.input)

    return {
      ...event,
      output: result,
      nextMethod: event.continuation || null,
      state: "completed"
    }
  },

  // Domain-specific error handling
  async handleError(event, error) {
    // Console errors might log and continue
    return { ...event, error, nextMethod: event.continuation }
  },

  log: async (input) => { /* ... */ },
  warn: async (input) => { /* ... */ }
}
```

**Queue routing = coordination:**
- Event says `nextMethod: "spl/console/log"`
- Routes to console queue
- Console handler picks it up
- Processes, writes result with new nextMethod
- Routes to next queue

**Benefits:**
- Specialized handlers (not generic)
- Domain-specific error handling
- Easy to add pipeline types (new handler + routing)
- Free script handlers same pattern
- Horizontal scaling (multiple handlers per queue)
- Kafka consumer groups handle naturally

**Approach B vs Approach A:**

| Aspect | A (Generic) | B (Specialized) |
|--------|-------------|-----------------|
| Complexity location | Central executor | Distributed handlers |
| Error handling | Generic, complex config | Domain-specific, contextual |
| Adding capabilities | Update central code | Add new handler |
| Friction over time | Accumulates | Stays local |
| Free scripting | Harder to fit model | Natural - just another handler |

## The Critical Dependency: High Confidence Self-Evals

**Approach B only works if self-evals are rigorous.**

**Trade:** Generic complexity → local validation

If self-evals weak:
- Handlers ship broken outputs
- Downstream failures mysterious
- Need central validation (→ Approach A friction)

If self-evals strong:
- Handler passes self-eval = output valid
- Downstream handlers trust input contract
- No central coordinator needed
- "Local rules apply" actually works

**This is the linchpin.**

Free scripting freedom, specialized handlers, distributed execution, self-modifying pipelines - all depend on **self-evals rigorous enough to make local validation trustworthy.**

Get self-evals right → Approach B works beautifully
Get self-evals wrong → back to central bottleneck

**The bet:** We get self-evals right.

## Implications for Project 09

Converting console v4 → stream-native will teach us:
- What pipeline API needs to be (grounded in reality)
- How to write effective self-evals (high confidence validation)
- How pipeline type handlers work in practice
- What metadata events actually need

**Approach:** Build spl/pipeline by using it. Console v5 validates the model.

No abstract design - forge pipeline API solving real problem.

**Key tension resolved:** Stream-native ≠ rigid pipelines. Stream just means events capture execution. Free scripting works fine - graph is dynamic, events flow, handlers execute.

Start with free scripting, let declarative patterns emerge organically.

---

# Part 8: Lifecycle Trinity - Dev, Test, Node

**Date:** 2025-11-21 (continued)

## Three Environment Types

| API | Purpose | Characteristics |
|-----|---------|-----------------|
| **spl/dev** | Implementation | Volatile, experimental, self-eval driven, quick iteration |
| **spl/test** | Validation | Controlled, comprehensive testing, quality gates, pre-production verification |
| **spl/node** | Production | Stable, monitored, resilient, production workloads (including preprod) |

## The Flow

```
spl/dev/create → implement → self-eval passes
  ↓
spl/test/deploy → comprehensive testing → quality gates pass
  ↓
spl/node/deploy → production (or preprod) → monitoring, SLAs
```

## Environment Distinctions

### spl/dev
- Fast feedback loops
- Self-eval sufficient for "good enough to test"
- Can break, expected to iterate
- Dev tooling (debuggers, hot reload, verbose logging)
- Self-eval harness
- Environment lifespan: hours/days

### spl/test
- Integration testing, load testing, compatibility
- Multiple test types (unit, integration, e2e, performance)
- Quality gates determine "ready for production"
- Test frameworks, runners, coverage tools
- Load generation, monitoring
- Isolated from dev/prod
- Environment lifespan: days/weeks

### spl/node
- Production runtime (lean, optimized)
- SLA monitoring, health checks, alerting
- Rollback capabilities
- P2P networking capabilities built-in
- Environment lifespan: persistent

## Dedicated Environments, Not Layered Installs

**Not:** "Install base, add dev tools, add test tools, add prod tools"

**Instead:** "Create dedicated environment for purpose"

Each environment type has its own complete setup:
- Different tooling installed
- Different configuration
- Different resource profiles
- Purpose-built for stage

## P2P Integration in spl/node

spl/node naturally supports P2P because:
- Processing nodes can exist standalone OR in P2P network
- P2P = nodes discovering/coordinating with each other
- Being able to create/manage nodes is prerequisite for network

**Node capabilities:**
- `spl/node/create` → standalone processing node
- `spl/node/join` → connect node to P2P network
- `spl/node/coordinate` → multi-node work distribution

**The network emerges from node capability**, not added on top.

A set of processing can be created outside P2P network, but being able to create a node network is prerequisite for P2P scenarios.

## ITIL Mapping

These map to service lifecycle stages:
- **spl/dev** = Service Design/Transition
- **spl/test** = Service Validation
- **spl/node** = Service Operation

## Pattern Exploration Need

**These patterns need exploration within free scripting paradigm:**

How do we script:
- Environment creation with different tooling profiles?
- Promotion from dev → test → node?
- Multi-node coordination?
- Quality gate validation?
- Network formation/discovery?

Free scripting should handle these naturally - not rigid pipelines, but scriptable patterns that can solidify into APIs as they prove useful.
