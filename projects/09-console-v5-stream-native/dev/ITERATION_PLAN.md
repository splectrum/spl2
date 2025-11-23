# Iteration Plan - Product Twin 1: Building Blocks Exploration

**Date:** 2025-11-23
**Exercise:** Arithmetic expression handler with increasing complexity

---

## Overview

Explore stream-native execution building blocks through practical arithmetic expression evaluation. Start simple, add complexity incrementally to prove key design aspects.

**Handler:** `spl/arithmetic` - evaluates mathematical expressions

**Progression:** Sequential → Precedence → Nested → Complex

---

## Iteration 1: Simple Sequential Arithmetic

**Expression:** `3 + 5 - 2`

**Purpose:** Prove basic sequential execution pattern

**Demonstrates:**
- Event structure with `current/runtime/history/metadata`
- Simple handler that processes steps sequentially
- State accumulation in `runtime.value.arithmetic`
- Input → processing → output flow
- Natural forgetfulness (history leaks, current stays)

**Test Cases:**
```
3 + 5 - 2 = 6
10 + 20 + 30 = 60
100 - 50 - 25 = 25
7 + 3 + 1 + 9 = 20
```

**Event Structure (Initial):**
```javascript
{
  current: {
    input: "3 + 5 - 2",
    output: null,
    step: 0
  },

  runtime: {
    value: {
      arithmetic: {
        // State accumulates here
      }
    },
    platform: "node"
  },

  history: {
    // Previous steps leak here
  },

  metadata: {
    timestamp: "...",
    version: "..."
  }
}
```

**Deliverables:**
- Event structure implementation
- Simple sequential handler
- 4+ test cases passing
- Evidence: natural forgetfulness works

---

## Iteration 2: Operator Precedence

**Expression:** `3 + 5 * 3`

**Purpose:** Prove handler intelligence (not just left-to-right)

**Demonstrates:**
- Handler parses expression
- Handler decides execution order (precedence rules)
- Dynamic step planning (not predefined in event)
- Approach B: handler has flow logic, event has state

**Test Cases:**
```
3 + 5 * 3 = 18  (not 24)
2 * 3 + 4 = 10
10 - 2 * 3 = 4  (not 24)
5 + 10 / 2 = 10  (not 7.5)
2 + 3 * 4 - 5 = 9
```

**Handler Logic:**
- Parse expression into tokens
- Identify operators and precedence
- Build execution plan (multiply first, then add)
- Execute in correct order

**Deliverables:**
- Handler with precedence logic
- 5+ test cases passing
- Evidence: handler controls flow, not event

---

## Iteration 3: Single Nested Expression

**Expression:** `3 * (5 + 7)`

**Purpose:** Prove sub-pipeline pattern

**Demonstrates:**
- Nested pipeline creation
- Sub-expression as independent event
- Parent waits for child completion
- Child result feeds parent
- Pipeline coordination

**Test Cases:**
```
3 * (5 + 7) = 36
(10 + 5) * 2 = 30
(8 - 3) + 4 = 9
2 * (3 + 4 * 2) = 22
```

**Event Structure (Nested):**
```javascript
// Parent event
{
  current: {
    input: "3 * (5 + 7)",
    output: null,
    step: 0,
    waitingFor: "child-event-id"  // blocked
  },
  // ...
}

// Child event (sub-expression)
{
  current: {
    input: "5 + 7",
    output: 12,
    step: 2,
    parentEvent: "parent-event-id"
  },
  // ...
}
```

**Deliverables:**
- Nested pipeline creation logic
- Parent/child event coordination
- 4+ test cases passing
- Evidence: sub-pipelines work independently

---

## Iteration 4: Multiple Nested Expressions

**Expression:** `3 * (5 + 7) / (2 - 3)`

**Purpose:** Prove complex pipeline coordination

**Demonstrates:**
- Multiple concurrent sub-pipelines
- Parent waits for multiple children
- Result aggregation from multiple sources
- Complex execution graph

**Test Cases:**
```
3 * (5 + 7) / (2 - 3) = -36
(10 + 5) * (8 - 3) = 75
(2 + 3) * (4 + 5) / (1 + 2) = 15
((3 + 2) * (4 - 1)) + 5 = 20
```

**Event Structure (Multi-nested):**
```javascript
// Parent event
{
  current: {
    input: "3 * (5 + 7) / (2 - 3)",
    output: null,
    step: 0,
    waitingFor: ["child-1-id", "child-2-id"]  // blocked on both
  },
  // ...
}

// Child events complete independently
// Parent resumes when all children done
```

**Deliverables:**
- Multi-child coordination logic
- Concurrent sub-pipeline handling
- 4+ test cases passing
- Evidence: complex graphs work

---

## Cross-Cutting Deliverables (All Iterations)

### AVRO Schemas

**Per iteration:**
- Schema for event structure
- Schema for arithmetic state
- Schema for test case format

**Validates:**
- Structural compliance
- Fast filtering
- Serialization format

### Selfevals

**Per iteration:**
- Event structure selfeval
- Arithmetic state consistency selfeval
- Result correctness selfeval

**Validates:**
- Semantic compliance
- Business rules
- Invariants

### Queue Mechanics

**File-based queue:**
- Atomic writes (temp → rename)
- Event pickup by handler
- State update and write back

**Proves:**
- Queue pattern reliable
- No lost events
- No corrupted state

### Test Harness

**For each iteration:**
- Test case runner
- Expected vs actual comparison
- Pass/fail reporting

**Format:**
```javascript
// test-cases/iteration-1.json
[
  { input: "3 + 5 - 2", expected: 6 },
  { input: "10 + 20 + 30", expected: 60 },
  // ...
]
```

### Documentation

**Per iteration:**
- What was proven
- What was discovered
- Gaps/limitations found
- Design decisions made

---

## Success Criteria

**Iteration 1:**
- ✅ Event structure with natural forgetfulness
- ✅ Sequential handler works
- ✅ All test cases pass

**Iteration 2:**
- ✅ Handler intelligence proven
- ✅ Precedence rules work
- ✅ All test cases pass

**Iteration 3:**
- ✅ Sub-pipeline pattern works
- ✅ Parent/child coordination
- ✅ All test cases pass

**Iteration 4:**
- ✅ Complex coordination works
- ✅ Multiple children handled
- ✅ All test cases pass

**Overall:**
- ✅ AVRO + selfeval validation proven
- ✅ Queue mechanics reliable
- ✅ Building blocks validated for console v4 migration

---

## Notes

- Each iteration builds on previous
- Keep code minimal (prove concept, not production)
- Document discoveries as we go
- Test harness makes validation trivial
- Arithmetic provides clear right/wrong answers
- Complexity progression natural and intuitive

---

**Ready for pipeline design + execution record design, then implementation!**
