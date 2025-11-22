# Console API v5 - Stream Native (Project 09)

**Priority:** Critical
**Type:** Implementation Project
**Dependencies:** Console API v4 (exploration complete)
**Phase:** 1 - Implementation Pipeline Foundation
**Related Chat:** chats/2025-11-21_project-09-planning-and-itil-dsl.md

---

## Overview

Convert Console API v4 to stream-native execution model while building spl/pipeline API. Use console conversion as the vehicle for discovering what pipeline needs to be.

**Not separate projects** - building pipeline by using it. Console v5 validates and shapes the pipeline design.

---

## Core Design Principles

Based on extensive design session (see related chat), implementing:

### Pipeline Islands in Sea of Free Script

Scripts contain pipeline islands (managed context, orchestration) in a sea of free script code (full language freedom).

```javascript
// === SEA ===
const config = loadConfig()

// === ISLAND ===
const result = await spl/pipeline/invoke(runtime, {
  method: "spl/console/log",
  input: {...}
})

// === SEA ===
processResult(result)
```

### Stream-Native Execution

- Events capture execution state
- Immutable, append-only events
- Each event = complete state (no deltas)
- Pipeline type handlers (not generic executor)
- Out-of-context reconstruction capability

### Pipeline Type Handlers (Approach B)

Console handler reads filtered queue, processes console.* methods, handles errors contextually.

```javascript
const consoleHandler = {
  filter: "method.startsWith('spl/console/')",
  async execute(event) { /* domain logic */ },
  async handleError(event, error) { /* console-specific handling */ }
}
```

Not generic executor - specialized handler per pipeline type.

---

## Scope

### Part 1: spl/pipeline API Foundation

**Event Schema:**
- Design event structure (AVRO)
- Runtime context representation
- Metadata for reconstruction
- nextMethod continuation pattern

**Core Methods:**
- `spl/runtime/create` - create runtime context object
- `spl/pipeline/invoke` - single method call with context
- `spl/pipeline/sequence` - chain steps (if pattern emerges)
- `spl/pipeline/parallel` - concurrent execution (if needed)

**Storage (Phase 1):**
- Start simple: JSON files in directory
- Single executor polling
- Prove the model works

### Part 2: Console v5 Stream-Native

**Convert v4 wrapper to v5:**
- Console handler (pipeline type)
- Methods: log, error, warn, info, debug
- Event-based execution
- Self-eval integration

**Self-Eval Requirements:**
- High confidence validation (critical for Approach B)
- Output contract verification
- Enable "local rules apply" model

### Part 3: Bug Report Integration

**Bug reports from event streams:**
- Error = event in stream
- Bug report = pointer to stream + analysis
- Reconstruction from events
- Test out-of-context reconstruction

---

## What We'll Learn

This project will teach us:
- What pipeline API actually needs (not abstract design)
- How to write high-confidence self-evals
- How pipeline type handlers work in practice
- What event metadata is required for reconstruction
- Where free scripting needs support vs stays free
- How Approach B friction compares to lived experience with Approach A

**Design through use** - forge pipeline API solving real problem.

---

## Success Criteria

1. Console v5 works via stream-native execution
2. Pipeline API enables console handler naturally
3. Self-evals provide high confidence local validation
4. Events contain sufficient reconstruction context
5. Free scripting feels natural, not constrained
6. Bug report from event stream proves reconstruction works
7. Pattern emerges for other APIs to follow

---

## Expected Products

1. **spl/pipeline API** (v1)
   - Event schema (AVRO)
   - Runtime context model
   - Core methods (invoke, possibly sequence/parallel)
   - Storage backend (JSON files)

2. **Console API v5**
   - Stream-native implementation
   - Console handler (pipeline type)
   - Self-eval requirements (high confidence)
   - Method specs with validation

3. **Event executor**
   - Console handler implementation
   - Queue polling mechanism
   - Event routing logic
   - Error handling pattern

4. **Bug report from events**
   - Example failure captured
   - Bug report structure
   - Reconstruction demonstration
   - Out-of-context replay

5. **Documentation**
   - Pattern guide: v4 → v5 conversion
   - How to write pipeline type handlers
   - Self-eval authoring guide
   - Event schema design decisions

---

## Design Decisions to Validate

### Critical Bets

1. **Approach B works** - specialized handlers > generic executor
2. **High confidence self-evals achievable** - local validation trustworthy
3. **Free scripting + stream-native compatible** - no tension
4. **Immutable events practical** - duplication < delta complexity
5. **JSON files sufficient for Phase 1** - don't need Kafka yet

### Open Questions

- How much metadata per event? (discover minimum viable)
- When does sequence/parallel become needed? (maybe not yet)
- What error patterns emerge? (inform handler design)
- How dynamic can nextMethod be? (test self-modification)
- What's the right event granularity? (per method call? batched?)

---

## Migration Path (Future)

This establishes pattern for:
- spl/dev API → stream-native
- spl/test API → stream-native
- spl/node API → stream-native
- Other domain APIs → stream-native

Console v5 is the template.

---

## Connection to Strategic Vision

### Lifecycle Trinity
Console v5 runs in **spl/dev environments** (volatile, experimental). Later spl/test and spl/node follow same pattern.

### Language as Capability
Stream-native + free scripting + self-eval = foundation for AI to become anything. Console is first domain language.

### Partnership Contract
- Human: Design event schema, self-eval requirements (positioning autonomy)
- AI: Implement handlers, script solutions (execute within positioned autonomy)

### ITIL Integration (Phase 2)
Console as service with service-level requirements. Vocabulary TBD.

---

## Notes

- **Start simple** - JSON files, single handler, prove it works
- **Learn before committing** - let real use inform API surface
- **Free scripting first** - declarative patterns emerge, not imposed
- **Bet on self-evals** - Approach B depends on getting this right
- **Eat own dog food** - build pipeline by using it from day one

---

**Created:** 2025-11-21
**Source:** Project 09 planning chat (extensive design session)
**Supersedes:** Original "spl/execute API" concept (reframed to spl/pipeline)
