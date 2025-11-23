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
