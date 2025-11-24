# Session Restart Guide - Project 09

**Last Updated:** 2025-11-23

---

## Current Status

**Project:** Console v5 Stream Native (Exploration)

**Phase:** Product Twin 1 - Building Blocks Exploration

**Stage:** Iteration 1 implementation complete, ready for testing

---

## What We've Built

### Iteration 1: Simple Sequential Arithmetic

**Pattern:** Fire-and-forget + Handler daemon

**Files:** `dev/src/`
- `data.js` - Data operations (publish, consume, seek, read, write)
- `invoke.js` - Fire-and-forget request creation
- `handler-daemon.js` - Queue processor with file watcher
- `iteration-1-async-test.js` - Test harness (4 test cases)
- `iteration-1-check-results.js` - Result verification

**Test cases:** `3 + 5 - 2`, `10 + 20 + 30`, `100 - 50 - 25`, `7 + 3 + 1 + 9`

---

## Key Design Decisions

### 1. Functional Scripts First, API Structure Later

**Now:** `dev/src/` - Functional implementation for iterations 1-4
**Later (Product Twin 2):** Proper `spl/data` API with Project 08 module structure

**Reason:** Focus on handler-request-pipeline interaction patterns, not API formalism

### 2. Fire-and-Forget + Handler Daemon Pattern

**Free script (invoke.js):**
- Creates step 0 request event
- Exits immediately (doesn't wait)

**Handler daemon (handler-daemon.js):**
- Watches `events/request/` folder for new files
- File watcher (fs.watch) detects new complete files
- Processes step 0 requests asynchronously
- Creates step 1 completion events

**Critical:** Atomic writes (temp+rename) ensure listener only sees complete files

### 3. Stateless Handler = No Handler State Events

**Iteration 1:** Handler has no internal state
**Result:** Only request events needed: `request/{requestId}/`
**No:** Handler state events stream

### 4. Request Processing Completes When Output is Single Number

**Step 0:** Input expression, status: pending
**Step 1:** Output result, status: completed
**Done:** Single number result means processing complete

---

## Architecture Patterns Established

### Data Layer (Filesystem Implementation)

**Operations:**
- `publish(topic, event)` - Create new event (append-only, atomic)
- `consume(topic, options)` - Read events in order
- `seek(topic, position)` - Jump to position ('latest', 'first', index)
- `read(topic)` - Get latest (convenience wrapper)
- `write(topic, data)` - Create new version (convenience wrapper)

**Atomic writes:** temp file + rename (critical for listener pattern)

**Topic structure:** `events/{topic}/{timestamp}.json`

### Event Structure

**Flat, simple, metadata in header:**
```javascript
{
  requestId: "req-...",
  step: 0,
  input: "3 + 5 - 2",
  status: "pending",
  metadata: {
    timestamp: "...",
    topic: "request/req-..."
  }
}
```

**Not:** Nested multilevel structures (current/runtime/history/metadata)
**Instead:** Flat request data + metadata header

### Fire-and-Reference Pattern

**Not:** Fire-and-forget
**Pattern:** Fire-and-reference (events preserved, references enable reconstruction)

**Top-down references:** Pipeline → steps (happy path)
**Bottom-up index:** If required (exception scenarios)

---

## Testing Iteration 1

**1. Start handler daemon:**
```bash
cd projects/09-console-v5-stream-native/dev/src
node handler-daemon.js
```

**2. In another terminal, submit test requests:**
```bash
cd projects/09-console-v5-stream-native/dev/src
node iteration-1-async-test.js
```

**3. Check results:**
```bash
node iteration-1-check-results.js
```

**Expected:** All 4 test cases pass, audit trail shows step 0 → step 1 progression

---

## Next Steps

### Immediate: Test Iteration 1

Verify fire-and-forget + handler daemon pattern works correctly.

### After Testing: Iterations 2-4

**Iteration 2:** Operator precedence (`3 + 5 * 3`)
- Handler intelligence (not just left-to-right)
- Handler decides execution order
- Demonstrates Approach B (handler has flow logic)

**Iteration 3:** Nested expressions (`3 * (5 + 7)`)
- Sub-pipeline pattern
- Parent/child event coordination
- Pipeline pattern emerges

**Iteration 4:** Multi-nested (`3 * (5 + 7) / (2 - 3)`)
- Multiple concurrent sub-pipelines
- Complex coordination
- Full pipeline system

---

## Key Exploration Documents

**Design notes:**
- `API_ECOSYSTEM_NOTES.md` - API type taxonomy, AVRO+Selfeval synergy
- `PIPELINE_DESIGN_NOTES.md` - Fire-and-reference, data layer, pipeline model
- `EXECUTION_EXPLORATION_NOTES.md` - Execution modes, handlers, natural forgetfulness
- `ITERATION_PLAN.md` - 4 iterations with test cases

**Status:**
- `DAILY_LOG.md` - Session-by-session progress
- `dev/README.md` - Quick start guide for iteration 1

---

## Important Context

### Three Twin Products

1. **Building Blocks Exploration** (current) - Event structure, handlers, queue mechanics
2. **Console v4 Migration** - Apply building blocks to real conversion
3. **Bug Report from Events** - Prove reconstruction from event streams

### Critical Bets

- **Approach B:** Specialized handlers (not generic executor)
- **Self-evals as linchpin:** High-confidence validation enables "local rules apply"
- **Fire-and-reference:** Events preserved with references for reconstruction
- **Stream-native execution:** Event flows through queues, handlers process

---

## Files to Review on Restart

**Essential:**
1. This file (SESSION_RESTART.md)
2. DAILY_LOG.md (2025-11-23 entries)
3. dev/README.md (quick start)

**Design context:**
4. PIPELINE_DESIGN_NOTES.md
5. API_ECOSYSTEM_NOTES.md

**Implementation:**
6. dev/src/data.js
7. dev/src/invoke.js
8. dev/src/handler-daemon.js

---

## Questions to Address on Restart

1. Did iteration 1 tests pass?
2. Any issues with fire-and-forget + handler daemon pattern?
3. Event structure working as expected?
4. Audit trail reconstruction successful?
5. Ready to move to iteration 2?

---

**Status:** Implementation complete, ready for testing and iteration 2 planning.
