# Project Plan - Project 09: Console v5 Stream Native

**Created:** 2025-11-21
**Project Brief:** projects/09-console-v5-stream-native/PROJECT_BRIEF.md

---

## Plan Overview

Three twin products exploring stream-native execution through building blocks, migration, and reconstruction validation.

---

## Twin Product 1: Building Blocks Exploration

**Purpose:** Discover and validate fundamental components of stream-native execution

### Implementation

**Event Structure:**
- Runtime context (where/how to execute: platform, environment, dataLayer, config)
- Runtime state (API states, currentInput, currentOutput)
- Execution state (pipelineType, stepCompleted, stepIndex, expandedSteps)
- Error state (null or error details)
- Completion flag

**Handler Patterns:**
- Mechanical handlers (sequential list walking)
- Intelligent handlers (dynamic flow decisions based on state)
- Dynamic expansion (single step → multiple steps on-the-fly)
- Error handling flows
- Completion semantics per handler type

**Queue Mechanics:**
- Atomic writes (temp file → rename pattern)
- Event pickup (generic executor lifts, filters, routes to handler)
- Handler execution (reads event, updates state, writes back)
- File-based queue (JSON files in directory)

**State Management:**
- API states accumulation through execution
- Input/output tracking between steps
- Execution stack for nested flows

**Flow Control:**
- pipelineType identifies which handler processes event
- stepCompleted + stepIndex track progress
- Handler decides next step based on current state
- No predefined execution path in event (Approach B)

### Pattern

Build → Prototype → Validate → Document

Discover through coding what actually works.

### Quality Criteria

- Event structure enables handler flow decisions
- Handlers can implement diverse flow patterns
- Queue mechanics are atomic and reliable
- State persists correctly through execution
- Errors propagate without losing context

---

## Twin Product 2: Console v4 Migration

**Purpose:** Apply building blocks to real migration, discover gaps

### Implementation

**Console Handler:**
- pipelineType: "spl/console"
- Filter: method starts with "spl/console/"
- Flow logic: single method execution → complete
- Error handling: console-specific (log error, continue vs abort)

**Console v5 Methods:**
- Migrate: log, error, warn, info, debug
- Wrap in event-based execution
- Update to use runtime state
- Maintain v4 functionality

**Self-Evals:**
- Review v4 self-evals
- Adapt for event-based execution (if needed)
- Validate self-evals still provide high-confidence validation
- Test: self-eval failures prevent progression

**Execution Context Metadata:**
- Refine what metadata enables reconstruction
- Code versions, timestamps, environment state
- Discover minimum viable metadata through use

**Error Handling:**
- Console errors via execution state
- Handler flow decisions on error
- Cycling feedback integration (if applicable)

### Pattern

Migrate → Test → Refine → Validate

Building blocks inform migration, migration reveals building block gaps.

### Quality Criteria

- Console v5 functionally equivalent to v4
- Event-based execution feels natural (free scripting works)
- Self-evals provide trustworthy local validation
- Errors handled gracefully via execution state
- Metadata sufficient for reconstruction

---

## Twin Product 3: Bug Report from Events

**Purpose:** Prove event streams enable out-of-context reconstruction

### Implementation

**Event Stream as Source:**
- Capture event stream from intentional failure
- Event stream contains full execution history
- Metadata includes code versions, environment, timing

**Bug Report Structure:**
- Reference to event stream (file location or ID)
- Analysis of failure (type, affected method, root cause)
- Reproduction steps (replay events)
- Metadata for reconstruction (code versions, etc.)

**Reconstruction Demo:**
- Take bug report
- Fetch referenced event stream
- Recreate execution environment from metadata
- Replay events
- Observe same failure

### Pattern

Fail → Capture → Analyze → Reconstruct

Validate that events contain what's needed.

### Quality Criteria

- Bug report successfully references event stream
- Event stream metadata sufficient for environment recreation
- Replay produces same failure
- Reconstruction works out-of-context (different machine/time)
- Demonstrates reconstruction-based architecture viability

---

## Execution Approach

### Stage 1: Building Blocks (Product 1)

1. Design event structure
2. Implement queue mechanics (file-based)
3. Create generic executor (lift, filter, route)
4. Build simple handler (mechanical sequential)
5. Prototype and validate
6. Document patterns discovered

### Stage 2: Migration (Product 2)

7. Create console handler
8. Migrate console/log method
9. Test event-based execution
10. Migrate remaining methods (error, warn, info, debug)
11. Validate self-evals work with events
12. Refine metadata based on learnings

### Stage 3: Reconstruction (Product 3)

13. Create intentional failure scenario
14. Capture event stream
15. Design bug report structure
16. Implement reconstruction demo
17. Validate out-of-context replay
18. Document reconstruction pattern

### Stage 4: Integration & Documentation

19. End-to-end testing
20. Document building blocks
21. Document migration pattern (v4 → v5 guide)
22. Capture learnings for future APIs

---

## Key Explorations

**From Product 1:**
- What event structure enables diverse flow patterns?
- How do handlers balance mechanical vs. intelligent logic?
- When should handlers dynamically expand steps?
- What completion semantics make sense?

**From Product 2:**
- Do building blocks support real migration smoothly?
- What gaps emerge when converting v4?
- Can self-evals remain high-confidence in event model?
- What metadata is actually needed vs. theoretical?

**From Product 3:**
- Does event stream capture sufficient reconstruction context?
- What does "out-of-context" actually require?
- Is bug report → replay workflow practical?

---

## Success Criteria

**Product 1:**
- Event structure validated through prototype
- Multiple handler patterns work
- Queue mechanics atomic and reliable

**Product 2:**
- Console v5 functionally equivalent to v4
- Free scripting feels natural
- Self-evals trustworthy
- Migration pattern documented

**Product 3:**
- Reconstruction demo successful
- Event metadata sufficient
- Out-of-context replay works

**Overall:**
- Stream-native execution model proven viable
- Foundation for future API conversions established
- Critical bets validated (Approach B, self-evals, events)

---

## Notes

- **Exploration through building** - prototype to discover, don't design in abstract
- **Product 2 informs Product 1** - migration reveals building block needs
- **Start simple** - file-based queue, mechanical handlers, prove concepts
- **Learn before scaling** - discover patterns before optimizing
- **Document discoveries** - capture what works for future APIs

---

**Twin pair methodology:** Each product has implementation + pattern. Build the thing, extract the learnings.
