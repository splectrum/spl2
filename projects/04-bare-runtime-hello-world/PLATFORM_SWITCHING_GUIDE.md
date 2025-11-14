# Platform Switching Guide

**Created:** 2025-11-14
**Product:** Twin Pair 2 - Product 2A (Deliverable)
**Purpose:** Patterns and findings for writing platform-agnostic code (Bare + Node)

---

## Overview

This guide documents patterns for writing JavaScript code that runs on both Bare and Node.js runtimes. Based on hands-on testing with examples that execute successfully on both platforms.

---

## 1. Runtime Detection

### The Detection Pattern

**Most reliable approach:**
```javascript
const isBare = typeof Bare !== 'undefined'
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node
```

**Why this works:**
- `Bare` global exists only in Bare runtime
- `process.versions.node` exists only in Node.js
- Mutually exclusive - never both true
- Fast - simple property check

**Tested:** Example 07-runtime-detection.js runs on both platforms
**Result:** 100% reliable detection, no false positives/negatives

### Detection Performance

**Overhead measured (10M iterations):**
- **Bare:** 42ms overhead (420% relative, but only 0.0000042ms per call)
- **Node:** 257ms overhead (3212% relative, but only 0.0000257ms per call)

**Interpretation:**
- Relative overhead looks high in tight loops
- Absolute overhead is tiny (microseconds per call)
- **Real-world impact: negligible**

**Recommendation:** Detect once at module load, not in hot loops

### Best Practice Pattern

**Detect once, reuse:**
```javascript
// At module top level
const isBare = typeof Bare !== 'undefined'

// Use throughout module
function getPlatform() {
  return isBare ? Bare.platform : process.platform
}
```

**Avoid:**
```javascript
// DON'T: Repeated detection in loops
for (let i = 0; i < 1000000; i++) {
  const platform = typeof Bare !== 'undefined' ? Bare.platform : process.platform
}
```

---

## 2. Platform Abstraction Patterns

### Simple Object Abstraction

**Pattern:**
```javascript
const runtime = {
  name: typeof Bare !== 'undefined' ? 'Bare' : 'Node.js',
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  arch: typeof Bare !== 'undefined' ? Bare.arch : process.arch,
  pid: typeof Bare !== 'undefined' ? Bare.pid : process.pid,
  version: typeof Bare !== 'undefined' ? Bare.version : process.version,
  argv: typeof Bare !== 'undefined' ? Bare.argv : process.argv,
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
}

// Use in business logic
console.log('Running on:', runtime.platform)
runtime.exit(0)
```

**Benefits:**
- Platform-specific code isolated to abstraction layer
- Business logic is platform-agnostic
- Easy to understand and maintain
- Single detection point

**Tested:** Example 08-platform-abstraction.js works on both platforms
**Result:** Clean abstraction, identical behavior on both runtimes

### File System Abstraction

**Pattern:**
```javascript
const fs = typeof Bare !== 'undefined'
  ? require('bare-fs')
  : require('fs').promises

// Use identical Promise-based API
await fs.writeFile('file.txt', 'content')
const content = await fs.readFile('file.txt', 'utf8')
const stats = await fs.stat('file.txt')
await fs.unlink('file.txt')
```

**Why this works:**
- `bare-fs` API mirrors Node.js `fs.promises`
- Both return Promises
- Method names identical
- Parameters compatible

**Tested:** Example 09-fs-abstraction.js runs same code on both platforms
**Result:** Perfect compatibility, no behavioral differences observed

### Key Discovery

**API Compatibility is Excellent:**
- Bare modules intentionally mirror Node.js APIs
- `bare-fs` matches `fs.promises` interface
- Makes abstraction straightforward
- Minimal shim code needed

---

## 3. Abstraction Strategies

### Strategy 1: Inline Ternary (Simple Cases)

**When to use:** Single property access or simple operations

**Example:**
```javascript
const platform = typeof Bare !== 'undefined' ? Bare.platform : process.platform
```

**Pros:**
- Simple, no extra structure
- Clear what's happening
- Low overhead

**Cons:**
- Repetitive if used many times
- Detection on every call (unless cached)

### Strategy 2: Object Wrapper (Multiple Properties)

**When to use:** Need multiple platform-specific properties

**Example:**
```javascript
const runtime = {
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  pid: typeof Bare !== 'undefined' ? Bare.pid : process.pid,
  // ... more properties
}
```

**Pros:**
- Single detection point
- Organized namespace
- Easy to extend

**Cons:**
- All properties evaluated at creation
- Small memory overhead

### Strategy 3: Module Abstraction (Complex APIs)

**When to use:** Abstracting entire modules (like file system)

**Example:**
```javascript
const fs = typeof Bare !== 'undefined'
  ? require('bare-fs')
  : require('fs').promises
```

**Pros:**
- Leverages existing module compatibility
- No wrapper code needed
- Full API available

**Cons:**
- Requires compatible module APIs
- May import unused functionality

### Recommended Approach

**For SPL2 Runtime:**
1. **Module-level detection** - detect once at top
2. **API abstraction layer** - single module that exports unified API
3. **Business logic imports abstraction** - never detects directly

**Structure:**
```
runtime/
  platform.js         # Abstraction layer
  business-logic.js   # Imports platform.js, platform-agnostic
```

---

## 4. API Compatibility Matrix

### Global Namespace

| Feature | Bare | Node.js | Compatible? |
|---------|------|---------|-------------|
| Platform | `Bare.platform` | `process.platform` | ✓ Same values |
| Architecture | `Bare.arch` | `process.arch` | ✓ Same values |
| Process ID | `Bare.pid` | `process.pid` | ✓ Same values |
| Version | `Bare.version` | `process.version` | ✓ Same format |
| Arguments | `Bare.argv` | `process.argv` | ✓ Same structure |
| Exit | `Bare.exit(code)` | `process.exit(code)` | ✓ Same behavior |

**Conclusion:** All essential properties have direct equivalents

### Built-in APIs

| API | Bare | Node.js | Compatible? |
|-----|------|---------|-------------|
| Console | Built-in | Built-in | ✓ Identical |
| Timers | Built-in | Built-in | ✓ Identical |
| Promises | Built-in | Built-in | ✓ Identical |
| async/await | Built-in | Built-in | ✓ Identical |

**Conclusion:** Core JavaScript APIs are identical

### Module APIs

| Module | Bare | Node.js | Compatible? |
|--------|------|---------|-------------|
| File system | `bare-fs` | `fs.promises` | ✓ API mirrors |
| Streams | `bare-stream` | `stream` | ✓ Similar patterns |
| Process | `bare-process` | `process` (built-in) | ⚠️ Requires module in Bare |
| Environment | `bare-env` | `process.env` (built-in) | ⚠️ Requires module in Bare |

**Conclusion:** Most APIs compatible, some require module installation in Bare

---

## 5. Constraints and Gotchas

### Constraint 1: Different Module Requirements

**Issue:** Node has built-in APIs that Bare requires modules for

**Example:**
- Node: `process.env` is built-in
- Bare: Requires `npm install bare-env`

**Solution:** Install required modules in package.json dependencies

### Constraint 2: Module Resolution

**Issue:** Some npm packages may use Node-specific APIs

**Impact:** Not all npm packages work on Bare

**Mitigation:**
- Test package compatibility
- Prefer bare-* modules when available
- Check package for Node-specific dependencies

### Constraint 3: ESM File Extension

**Issue:** Bare requires .mjs for ESM, Node can use package.json config

**Impact:** Can't share same ESM files without .mjs extension

**Solution:** Use CommonJS for platform-agnostic code, or standardize on .mjs

### Gotcha: Environment Variables

**Node:**
```javascript
const value = process.env.MY_VAR
```

**Bare:**
```javascript
const env = require('bare-env')
const value = env.MY_VAR
```

**Abstraction:**
```javascript
const env = typeof Bare !== 'undefined'
  ? require('bare-env')
  : process.env
```

---

## 6. Examples Created

All examples run successfully on both Bare and Node.js:

### 07-runtime-detection.js
- Tests detection pattern reliability
- Validates mutually exclusive detection
- Outputs platform-specific information on both runtimes

### 08-platform-abstraction.js
- Simple object wrapper for platform APIs
- Unified interface for platform/arch/pid/version
- Business logic uses abstraction, no platform checks

### 09-fs-abstraction.js
- File system operations (write/read/stat/delete)
- Same code runs on both platforms
- Demonstrates API compatibility

### 10-detection-overhead.js
- Measures performance overhead of detection
- 10M iterations benchmark
- Quantifies real-world impact (negligible)

**All examples self-testing, validated on both platforms**

---

## 7. Key Findings

### Finding 1: Detection is Reliable
- `typeof Bare !== 'undefined'` works 100% of the time
- No false positives or negatives
- Fast enough for any use case

### Finding 2: API Compatibility is Excellent
- Bare modules intentionally mirror Node.js
- Most code can be platform-agnostic with simple abstraction
- File system API is nearly identical

### Finding 3: Performance Overhead is Negligible
- Detection takes microseconds per call
- Real-world impact unmeasurable
- Can detect in module initialization without concern

### Finding 4: Abstraction is Simple
- Single-line module abstraction works well
- Object wrapper pattern is clean and maintainable
- No complex shim library needed

### Finding 5: Main Constraint is Module Availability
- Some npm packages won't work on Bare
- Need to test compatibility
- Bare ecosystem is smaller (but growing)

---

## 8. Recommendations

### For SPL2 Runtime Development

**1. Create Platform Abstraction Module**
- Single module exports unified API
- Detects once at module load
- Business logic imports this, never detects directly

**2. Use CommonJS for Compatibility**
- Both platforms support CommonJS well
- Avoid .mjs extension requirement complexity
- Use async/await (works in CommonJS)

**3. Test on Both Platforms**
- Run tests on both Bare and Node
- Validate behavior is identical
- Catch platform-specific issues early

**4. Document Platform Requirements**
- List required Bare modules in package.json
- Note any platform-specific code
- Guide developers on testing approach

**5. Prefer Platform-Agnostic Patterns**
- Use abstraction layer for platform APIs
- Minimize platform-specific code
- Isolate detection to single module

---

## 9. Architecture Recommendations

### For Platform-Agnostic Runtime

**Layered approach:**

```
┌─────────────────────────────┐
│   Business Logic            │  ← Platform-agnostic
│   (API implementations)     │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│   Platform Abstraction      │  ← Single detection point
│   (runtime.js, fs.js)       │
└─────────────────────────────┘
              ↓
┌──────────────┬──────────────┐
│   Bare       │   Node.js    │  ← Platform-specific
│   APIs       │   APIs       │
└──────────────┴──────────────┘
```

**Benefits:**
- Clear separation of concerns
- Easy to test (can mock abstraction layer)
- Platform changes isolated
- Business logic stays clean

---

## 10. Next Steps

**For Twin Pair 3 (Runtime Migration):**
- Apply these patterns to Project 03 runtime
- Test actual SPL2 code on Bare
- Discover any missing abstractions
- Validate performance is acceptable

**For Twin Pair 4 (Platform Abstraction):**
- Design formal abstraction layer
- Create runtime module for SPL2
- Implement switching capability
- Document migration guide

---

**End of Product 2A - Platform Switching Guide**

*Examples demonstrate patterns. Guide serves as reference for platform-agnostic development.*
