**Requirements:** projects/08-dev-environment-api/exploration_project_v1.1.0.md
**Base Requirements:** projects/03-runtime-hello-world/PRINCE2_operational_v1.2.0.md

# Project 09: Console v5 Stream Native

## Project Type

**Exploration Project** - Convert Console v4 to stream-native execution. Discover event model, handlers, and execution patterns through real implementation.

---

## Project Definition

### Purpose

Convert Console API v4 to stream-native execution. Discover event model, handler patterns, and self-eval requirements through real implementation.

### Background

**Design Session:** Comprehensive design exploration (chats/2025-11-21_project-09-planning-and-itil-dsl.md) established:
- Pipeline islands in sea of free script
- Stream-native execution (immutable events, Approach B handlers)
- Partnership contract (architect/builder, local rules apply)
- Self-evals as linchpin for distributed validation
- Lifecycle trinity (spl/dev, spl/test, spl/node)

**Console API v4:** Project 07 delivered working wrapper with 5 methods. Now convert to stream-native.

### Objectives

1. Convert Console v4 methods to event-based execution
2. Discover event schema through real use
3. Implement console handler pattern
4. Write self-evals that enable local validation
5. Prove events capture sufficient reconstruction context
6. Validate stream-native execution model

### Scope

**In scope:**
- Event schema design (AVRO)
- spl/runtime API (create, fork, destroy)
- spl/pipeline API v1 (invoke, possibly sequence/parallel if needed)
- Console handler (pipeline type)
- Console v5 methods (log, error, warn, info, debug)
- Self-eval requirements (high confidence)
- Event executor (console handler implementation)
- Bug report from events (demonstration)
- Storage backend (JSON files - Phase 1)

**Out of scope:**
- Full spl/dev API (Project 08 foundation sufficient)
- Kafka implementation (JSON files sufficient for Phase 1)
- Complete bug report API (prove concept only)
- spl/test, spl/node APIs (future)

### Constraints and Assumptions

**Constraints:**
- Start simple: JSON files, single handler, prove it works
- No premature optimization for Kafka/distribution
- Free scripting must feel natural, not constrained

**Assumptions:**
- Console v4 is valid foundation to convert from
- Approach B (specialized handlers) will prove superior to Approach A (generic executor)
- High-confidence self-evals are achievable
- Immutable events (duplication) < delta complexity

---

## Products

### Core Products

| Product | Purpose |
|---------|---------|
| 1. Event Schema | AVRO schema for pipeline events |
| 2. spl/runtime API | Runtime context creation/management |
| 3. spl/pipeline API v1 | Core orchestration methods |
| 4. Console Handler | Pipeline type handler for console.* methods |
| 5. Console v5 Implementation | Stream-native console methods |
| 6. Self-Eval Requirements | High-confidence validation specs |
| 7. Event Executor | Handler execution engine |
| 8. Bug Report Demo | Reconstruction from events |

### Product Descriptions

#### Product 1: Event Schema

**Purpose:** Define structure for all pipeline events

**Composition:**
- Event structure (AVRO schema)
- Runtime context representation
- Metadata for reconstruction (code versions, environment, timing)
- nextMethod continuation pattern
- Input/output encoding

**Quality criteria:**
- Events are complete (no external dependencies)
- Sufficient for out-of-context reconstruction
- Schema evolution supported
- Validates via AVRO

#### Product 2: spl/runtime API

**Purpose:** Runtime context creation and management

**Composition:**
- `spl/runtime/create` - create runtime context object
- `spl/runtime/fork` - child context for nested execution
- `spl/runtime/destroy` - cleanup
- Runtime context structure (data layer, config, identity)

**Quality criteria:**
- Runtime is data, not actor
- Context contains everything needed for execution
- Forkable for nested pipelines
- Serializable in events

#### Product 3: spl/pipeline API v1

**Purpose:** Core orchestration methods

**Composition:**
- `spl/pipeline/invoke` - single method call with context
- `spl/pipeline/sequence` - chain steps (if pattern emerges)
- `spl/pipeline/parallel` - concurrent execution (if needed)
- Event submission logic
- Result retrieval

**Quality criteria:**
- Supports free scripting (await returns result)
- Events written for audit/reconstruction
- Can be used inline or distributed
- Doesn't force structure

#### Product 4: Console Handler

**Purpose:** Pipeline type handler for console operations

**Composition:**
- Handler structure (filter, execute, handleError)
- Method routing (log, error, warn, info, debug)
- Domain-specific error handling
- Event processing loop

**Quality criteria:**
- Reads filtered queue (console.*)
- Processes events to completion
- Handles errors contextually
- Writes result events with nextMethod

#### Product 5: Console v5 Implementation

**Purpose:** Stream-native console methods

**Composition:**
- 5 methods: log, error, warn, info, debug
- Event-based invocation
- Self-eval integration
- Output formatting

**Quality criteria:**
- Functionally equivalent to v4
- Uses event-based execution
- Passes self-evals
- Free scriptable (natural to use)

#### Product 6: Self-Eval Requirements

**Purpose:** High-confidence validation specifications

**Composition:**
- Self-eval for each console method
- Validation criteria
- Pass/fail determination
- Contract specifications

**Quality criteria:**
- High confidence (local validation trustworthy)
- Automated execution
- Clear pass/fail boundary
- Enables Approach B (local rules apply)

#### Product 7: Event Executor

**Purpose:** Execute events via handlers

**Composition:**
- Event polling mechanism
- Handler registration/routing
- Queue abstraction (JSON files initially)
- Error propagation

**Quality criteria:**
- Can route events to handlers by filter
- Handles execution errors
- Writes result events
- Works with JSON file storage

#### Product 8: Bug Report Demo

**Purpose:** Prove reconstruction from event streams

**Composition:**
- Example failure scenario
- Event stream capture
- Bug report structure (references stream)
- Reconstruction demonstration

**Quality criteria:**
- Can recreate failure out-of-context
- Event stream contains sufficient metadata
- Bug report points to stream + analysis
- Validates reconstruction model

---

## Plan

### Stage 1: Event Foundation

**Focus:** Get event model working

1. Design event schema (AVRO)
2. Implement spl/runtime/create
3. Implement event storage (JSON files)
4. Test: create event, write, read back

### Stage 2: Pipeline Invoke

**Focus:** Single method execution via events

5. Implement spl/pipeline/invoke (minimal)
6. Create console handler structure
7. Implement console/log via handler
8. Test: invoke console/log, verify event flow

### Stage 3: Complete Console v5

**Focus:** All console methods stream-native

9. Implement remaining console methods (error, warn, info, debug)
10. Write self-evals for each method
11. Integrate self-eval validation
12. Test: all methods work, self-evals pass

### Stage 4: Validation & Documentation

**Focus:** Prove the model works

13. Create bug report demo (intentional failure)
14. Demonstrate reconstruction from events
15. Document conversion pattern (v4 → v5)
16. Capture learnings for next APIs

---

## Success Criteria

**Critical validations:**

1. ✅ Console v5 works via stream-native execution
2. ✅ Pipeline API enables free scripting naturally
3. ✅ Self-evals provide high-confidence local validation
4. ✅ Events contain sufficient reconstruction context
5. ✅ Approach B (specialized handlers) feels better than Approach A experience
6. ✅ Bug report from event stream proves reconstruction
7. ✅ Pattern is clear for converting other APIs

**Measurements:**

- Can script console operations freely (feels like v4, works via events)
- Self-eval pass = output valid (no central validation needed)
- Event stream can reconstruct failure out-of-context
- Handler implementation simpler than generic executor would be

---

## Critical Bets

**We're betting:**

1. **Approach B works** - specialized handlers > generic executor
2. **High confidence self-evals achievable** - local validation trustworthy
3. **Free scripting + stream-native compatible** - no tension
4. **Immutable events practical** - duplication < delta complexity
5. **JSON files sufficient** - don't need Kafka yet

**These will be validated or invalidated by project end.**

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Event metadata insufficient | Medium | High | Start with more, discover minimum viable |
| Self-evals too weak | Medium | Critical | Iterate until "high confidence" achieved |
| Free scripting feels constrained | Low | High | Keep "islands in sea" - don't force structure |
| Handler pattern too complex | Low | Medium | Console is simple test - complexity shows early |
| Storage abstraction leaks | Medium | Medium | Keep simple, note where Kafka would help |

---

## Collaboration Mode

**COLLABORATIVE** per implementation project requirements.

- Design decisions validated together
- Critical bets assessed at each stage
- Pattern emergence documented
- Learnings captured for future APIs

---

## Connection to Strategic Vision

### Lifecycle Trinity
Console v5 runs in spl/dev environments (foundation). Later spl/test and spl/node follow same pattern.

### Language as Capability
Stream-native + free scripting + self-eval = foundation for AI to become anything. Console is first domain language.

### Partnership Contract
- Human: Design event schema, self-eval requirements (positioning autonomy)
- AI: Implement handlers, script solutions (execute within positioned autonomy)
- "Local rules apply" - self-eval passes = valid

### Iterative Engineering
Islands in sea get wrapped up, become islands with lakes. Abstraction all the way down, freedom all the way through.

---

## Notes

- **Design through use** - don't design pipeline in abstract, forge it solving real problem
- **Start simple** - JSON files, one handler, prove the model
- **Learn before committing** - open questions answered by building
- **Bet on self-evals** - Approach B depends on getting this right
- **Eat own dog food** - build pipeline by using it from day one

**This project is foundation for everything else.**

---

**Created:** 2025-11-21
**Source:** Comprehensive design session (chats/2025-11-21_project-09-planning-and-itil-dsl.md)
