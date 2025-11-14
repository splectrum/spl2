# Twin Pair 2 Detailed Plan: Platform Switching Pattern

**Created:** 2025-11-14 (Execute stage - JIT planning)
**Purpose:** Explore platform-agnostic code patterns for Bare/Node compatibility

---

## Overview

Based on Twin Pair 1 findings, explore how to write code that runs on both Bare and Node. Test platform detection, API abstraction, and performance characteristics of switching pattern.

**Deliverables:**
- Product 2A: Platform-Switchable Code Examples (deliverable)
- Product 2B: Platform Switching Requirements (requirements)

---

## Approach

**Strategy:** Build simple examples that run on both platforms, discover patterns and constraints

**Key Questions:**
1. How reliable is runtime detection? (`typeof Bare !== 'undefined'`)
2. What's the performance overhead of detection?
3. Can we abstract differences cleanly?
4. What breaks when switching between platforms?
5. Are there API differences beyond global namespace?

**Quality Criteria:**
- Examples run successfully on both Bare and Node
- Platform detection is reliable (no false positives/negatives)
- Code is readable and maintainable
- Performance overhead is acceptable
- Patterns are generalizable

---

## Examples to Create

### Example 1: Runtime Detection
**File:** `07-runtime-detection.js`
**Purpose:** Validate platform detection pattern
**Tests:**
- Detect Bare vs Node reliably
- Output platform-specific information
- Validate detection doesn't fail on either runtime

**Run on:** Both Bare and Node

---

### Example 2: Simple Platform Abstraction
**File:** `08-platform-abstraction.js`
**Purpose:** Abstract platform differences for basic operations
**Operations:**
- Get platform name (Bare.platform vs process.platform)
- Get process ID (Bare.pid vs process.pid)
- Exit with code (Bare.exit vs process.exit)

**Pattern to test:**
```javascript
const runtime = {
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  pid: typeof Bare !== 'undefined' ? Bare.pid : process.pid,
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
}
```

**Run on:** Both Bare and Node

---

### Example 3: File System Abstraction
**File:** `09-fs-abstraction.js`
**Purpose:** Abstract file system operations for both platforms
**Operations:**
- Write file
- Read file
- Delete file

**Pattern to test:**
```javascript
const fs = typeof Bare !== 'undefined'
  ? require('bare-fs')
  : require('fs').promises
```

**Validation:**
- Same code runs on both platforms
- File operations work identically
- No platform-specific code in business logic

**Run on:** Both Bare and Node

---

### Example 4: Performance of Detection
**File:** `10-detection-overhead.js`
**Purpose:** Measure performance overhead of runtime detection
**Tests:**
- Baseline: Direct call (no detection)
- Overhead: With detection check
- Report overhead percentage

**Run on:** Both Bare and Node (compare results)

---

## Implementation Steps

1. **Create detection example** - validate `typeof Bare` pattern
2. **Run on both platforms** - ensure detection works correctly
3. **Create abstraction examples** - test API wrapping patterns
4. **Measure performance** - quantify overhead
5. **Document findings** - capture patterns and constraints
6. **Extract requirements** - formalize what we learned

---

## Expected Discoveries

**Likely findings:**
- Runtime detection is reliable and fast
- Performance overhead is negligible for detection
- File system abstraction is straightforward
- Some APIs may not have clean equivalents
- Error handling may differ between platforms

**Questions to answer:**
- Is there a "best" abstraction pattern?
- Should abstraction be inline or library?
- Are there APIs that don't abstract cleanly?
- What's the complexity cost of maintaining dual compatibility?

---

## Completion Criteria

**Product 2A complete when:**
- 4 examples created and tested
- All examples run on both Bare and Node
- Examples are self-testing
- Performance measurements captured
- Findings documented

**Product 2B complete when:**
- Requirements extracted from findings
- Patterns documented
- Constraints identified
- Recommendations for platform abstraction approach

---

## Notes

**Collaborative approach:**
- Discuss findings as examples run
- Validate assumptions with user
- Adjust strategy based on discoveries

**Connection to Twin Pair 3:**
- These patterns will inform runtime migration approach
- Insights guide how to port Project 03 runtime to Bare
