# Platform Abstraction Architecture

**Created:** 2025-11-14
**Product:** Twin Pair 4 - Product 4A (Deliverable)
**Purpose:** Architecture design for SPL2 runtime platform abstraction

---

## Executive Summary

Based on validated patterns from Twin Pairs 1-3, this document defines the architecture for platform abstraction in SPL2 runtime. The design enables SPL2 to run on multiple JavaScript runtimes (Bare, Node.js, and potentially others) with minimal complexity and zero performance overhead.

**Key Design Principles:**
- **Simplicity** - Minimal abstraction layer, only what's necessary
- **Zero overhead** - No performance penalty
- **Extensibility** - Easy to add platforms or capabilities
- **Local rules apply** - Each implementation self-contained

---

## 1. Architecture Overview

### High-Level Structure

```
SPL2 Runtime
    ↓
Platform Abstraction Layer (runtime/platform/)
    ↓
┌──────────────┬──────────────┬──────────────┐
│   Bare       │   Node.js    │   Future     │
│   Runtime    │   Runtime    │   Runtimes   │
└──────────────┴──────────────┴──────────────┘
```

### Layering

**Layer 1: Business Logic (SPL Methods)**
- Platform-agnostic
- Uses platform abstraction API
- No runtime detection

**Layer 2: Platform Abstraction**
- Single detection point
- Unified API
- Runtime-specific implementations

**Layer 3: Native Runtime APIs**
- Bare, Node.js, etc.
- Platform-specific

---

## 2. Module Structure

### Directory Organization

```
runtime/
├── platform/
│   ├── index.js              # Main entry point
│   ├── detection.js          # Runtime detection
│   ├── process.js            # Process/platform info
│   ├── filesystem.js         # File system abstraction
│   ├── lifecycle.js          # Exit, signals, etc.
│   └── README.md             # Usage guide
├── context.js                # Context management
├── module-loader.js          # Method loading
└── (other runtime components)
```

### Self-Contained Dev Environment

**Following "local rules apply":**
```
runtime/
├── package.json              # All dependencies declared
├── node_modules/             # Local dependencies (bare, bare-fs, etc.)
├── .gitignore               # Exclude node_modules
├── scripts/
│   ├── build.js             # Build/validate scripts
│   ├── test-bare.js         # Test on Bare
│   └── test-node.js         # Test on Node
└── platform/
    └── (abstraction modules)
```

**Dependencies in package.json:**
```json
{
  "dependencies": {
    "bare-fs": "^4.5.1",
    "bare-stream": "^2.x.x"
  },
  "devDependencies": {
    "bare": "^1.24.2"
  },
  "scripts": {
    "test:bare": "bare scripts/test-bare.js",
    "test:node": "node scripts/test-node.js",
    "test": "npm run test:bare && npm run test:node"
  }
}
```

---

## 3. API Design

### platform/index.js - Main Entry Point

**Exported API:**
```javascript
module.exports = {
  // Runtime information
  name: string,              // 'Bare' | 'Node.js' | ...
  platform: string,          // 'linux' | 'darwin' | 'win32' | ...
  arch: string,              // 'x64' | 'arm64' | ...
  version: string,           // Runtime version

  // Process information
  pid: number,               // Process ID
  argv: string[],            // Command line arguments

  // Lifecycle
  exit: (code: number) => void,

  // File system (from filesystem.js)
  fs: {
    writeFile: (path, content) => Promise<void>,
    readFile: (path, encoding?) => Promise<string|Buffer>,
    stat: (path) => Promise<Stats>,
    unlink: (path) => Promise<void>,
    // ... other fs operations
  },

  // Environment (lazy-loaded)
  env: object,               // Environment variables

  // Utilities
  isDetected: () => boolean,
  getPlatformName: () => string
}
```

### Usage Example

```javascript
const platform = require('./platform')

// Runtime info
console.log(`Running on ${platform.name} ${platform.version}`)
console.log(`Platform: ${platform.platform}, Arch: ${platform.arch}`)

// File system
await platform.fs.writeFile('test.txt', 'content')
const content = await platform.fs.readFile('test.txt', 'utf8')

// Lifecycle
platform.exit(0)
```

---

## 4. Platform Detection

### detection.js

**Single detection, cached result:**

```javascript
// detection.js
let _detectedRuntime = null

function detectRuntime() {
  if (_detectedRuntime !== null) {
    return _detectedRuntime
  }

  // Detect Bare
  if (typeof Bare !== 'undefined') {
    _detectedRuntime = 'bare'
    return _detectedRuntime
  }

  // Detect Node.js
  if (typeof process !== 'undefined' &&
      process.versions &&
      process.versions.node) {
    _detectedRuntime = 'node'
    return _detectedRuntime
  }

  // Unknown runtime
  throw new Error('Unsupported JavaScript runtime')
}

function isBare() {
  return detectRuntime() === 'bare'
}

function isNode() {
  return detectRuntime() === 'node'
}

module.exports = { detectRuntime, isBare, isNode }
```

**Design decisions:**
- Detect once, cache result (runtime doesn't change)
- Throw error for unknown runtimes (fail fast)
- Simple boolean helpers for common checks

---

## 5. Core Abstractions

### process.js - Process Information

**Purpose:** Abstract process/platform information

```javascript
// process.js
const { isBare } = require('./detection')

module.exports = {
  get name() {
    return isBare() ? 'Bare' : 'Node.js'
  },

  get platform() {
    return isBare() ? Bare.platform : process.platform
  },

  get arch() {
    return isBare() ? Bare.arch : process.arch
  },

  get version() {
    return isBare() ? Bare.version : process.version
  },

  get pid() {
    return isBare() ? Bare.pid : process.pid
  },

  get argv() {
    return isBare() ? Bare.argv : process.argv
  }
}
```

**Design decisions:**
- Use getters for lazy evaluation (but detection is cached)
- Direct property access, no function calls
- Simple ternary expressions

### filesystem.js - File System Operations

**Purpose:** Unified file system API

```javascript
// filesystem.js
const { isBare } = require('./detection')

// Load appropriate fs module
const fs = isBare()
  ? require('bare-fs')
  : require('fs').promises

// Export unified API (both have same interface)
module.exports = {
  writeFile: fs.writeFile,
  readFile: fs.readFile,
  stat: fs.stat,
  unlink: fs.unlink,
  mkdir: fs.mkdir,
  readdir: fs.readdir,
  // ... extend as needed
}
```

**Design decisions:**
- Leverage API compatibility (bare-fs mirrors fs.promises)
- No wrapper functions needed (direct export)
- Add methods as needed by SPL2 runtime

### lifecycle.js - Exit and Signals

**Purpose:** Process lifecycle control

```javascript
// lifecycle.js
const { isBare } = require('./detection')

function exit(code = 0) {
  if (isBare()) {
    Bare.exit(code)
  } else {
    process.exit(code)
  }
}

// Future: signal handling, cleanup hooks, etc.

module.exports = { exit }
```

**Design decisions:**
- Function wrapper needed (different APIs)
- Extensible for signal handling later

---

## 6. Integration with SPL2 Runtime

### Initialization Pattern

**In main runtime entry point:**

```javascript
// runtime/index.js
const platform = require('./platform')
const { createContext } = require('./context')
const { loadMethod } = require('./module-loader')

async function initializeRuntime() {
  // Create context with platform info
  const context = createContext({
    platform: {
      name: platform.name,
      platform: platform.platform,
      version: platform.version
    }
  })

  return context
}

// Methods never import platform directly - use context
```

**Design decisions:**
- Platform detection happens once at initialization
- Context carries platform info to methods
- Methods remain platform-agnostic

### Method Implementation Pattern

**Methods use context, not platform directly:**

```javascript
// methods/example/index.js
async function exampleMethod(context) {
  // Read platform info from context (if needed)
  const platformName = context.getState('platform.name')

  // Business logic - platform-agnostic
  const result = doWork()

  // Store in context
  context.setState('example.result', result)

  return { result }
}

module.exports = exampleMethod
```

**Design decisions:**
- Methods never detect platform themselves
- Platform info available through context
- Keeps methods testable (mock context)

---

## 7. Extension Mechanism

### Adding New Platforms

**Steps to add Deno, Bun, etc.:**

1. **Update detection.js:**
```javascript
// Detect Deno
if (typeof Deno !== 'undefined') {
  _detectedRuntime = 'deno'
  return _detectedRuntime
}
```

2. **Update process.js:**
```javascript
get platform() {
  if (isBare()) return Bare.platform
  if (isDeno()) return Deno.build.os
  return process.platform
}
```

3. **Update filesystem.js if needed:**
```javascript
const fs = isBare() ? require('bare-fs')
        : isDeno() ? Deno  // Deno has different API
        : require('fs').promises
```

4. **Test on new platform**

**Design principle:** Extend conditionals, don't restructure

### Adding New Capabilities

**Example: Adding environment variable support:**

1. **Create environment.js:**
```javascript
// platform/environment.js
const { isBare } = require('./detection')

// Lazy-load (some runtimes require module)
let _env = null

function getEnv() {
  if (_env !== null) return _env

  _env = isBare()
    ? require('bare-env')
    : process.env

  return _env
}

module.exports = { getEnv }
```

2. **Export from index.js:**
```javascript
const { getEnv } = require('./environment')

module.exports = {
  // ... existing exports
  get env() {
    return getEnv()
  }
}
```

**Design principle:** Add new modules, export from index.js

---

## 8. Migration Path from Project 03

### Step-by-Step Approach

**Phase 1: Create Platform Abstraction (This Project)**
- Implement platform/ module structure
- Test independently on both Bare and Node
- Validate API design

**Phase 2: Integrate with Existing Runtime**
- Replace direct process/Bare references with platform imports
- Convert ESM to CommonJS (if not done)
- Test incrementally

**Phase 3: Update Methods**
- Ensure methods use context, not platform directly
- Remove any platform-specific code from methods
- Validate on both platforms

**Phase 4: Full Validation**
- Run all Project 03 tests on both platforms
- Performance benchmarking
- Production readiness review

### Conversion Examples

**Before (Node-specific):**
```javascript
console.log(`Platform: ${process.platform}`)
process.exit(0)
```

**After (Platform-agnostic):**
```javascript
const platform = require('./platform')
console.log(`Platform: ${platform.platform}`)
platform.exit(0)
```

**Before (Method with platform detection):**
```javascript
async function method() {
  if (typeof Bare !== 'undefined') {
    // Bare-specific code
  } else {
    // Node-specific code
  }
}
```

**After (Method using context):**
```javascript
async function method(context) {
  const platformName = context.getState('platform.name')
  // Platform-agnostic code
}
```

---

## 9. Trade-offs and Decisions

### Decision 1: Object Export vs Class

**Chosen:** Object export
**Rationale:**
- Simpler (no instantiation needed)
- Getters provide lazy evaluation if needed
- Matches proven pattern from Twin Pairs 2-3

**Alternative:** Class with singleton pattern
- More structured
- But adds complexity for no benefit

### Decision 2: Single index.js vs Multiple Imports

**Chosen:** Single entry point (index.js exports everything)
**Rationale:**
- One import for consumers: `require('./platform')`
- Internal organization still modular
- Easier API evolution

**Alternative:** Import specific modules
- `require('./platform/filesystem')`
- More explicit, but more imports

### Decision 3: Synchronous vs Async Initialization

**Chosen:** Synchronous (detection and module loading)
**Rationale:**
- Detection is instant (typeof check)
- No async initialization complexity
- Simpler consumer code

**Alternative:** Async initialization
- Could support async platform-specific setup
- But not needed for current platforms

### Decision 4: Error Handling for Unknown Runtimes

**Chosen:** Throw error (fail fast)
**Rationale:**
- Better than undefined behavior
- Forces explicit platform support
- Clear error message

**Alternative:** Return null/undefined
- Could allow graceful degradation
- But risks hidden bugs

### Decision 5: Lazy vs Eager Module Loading

**Chosen:** Lazy for optional features (env), eager for core
**Rationale:**
- Core features (platform, fs) always needed
- Optional features (env) load on demand
- Balances startup speed and memory

---

## 10. Testing Strategy

### Test Coverage Requirements

**Unit tests:**
- Platform detection logic
- Each abstraction module independently
- Error conditions

**Integration tests:**
- Full platform API together
- Actual SPL methods using platform
- Context integration

**Cross-platform tests:**
- Same test suite runs on Bare and Node
- Validates identical behavior
- Performance comparison

### Test Structure

```
runtime/
├── tests/
│   ├── unit/
│   │   ├── detection.test.js
│   │   ├── process.test.js
│   │   └── filesystem.test.js
│   ├── integration/
│   │   └── platform.test.js
│   └── cross-platform/
│       └── runtime.test.js
└── scripts/
    ├── test-bare.js      # Run tests on Bare
    └── test-node.js      # Run tests on Node
```

### Self-Testing Pattern

**Following Project 03 pattern:**
```javascript
// Each test is executable and self-validating
async function testFilesystem() {
  const platform = require('../platform')

  await platform.fs.writeFile('test.txt', 'content')
  const content = await platform.fs.readFile('test.txt', 'utf8')

  if (content !== 'content') {
    console.error('✗ FAIL: Content mismatch')
    platform.exit(1)
  }

  await platform.fs.unlink('test.txt')
  console.log('✓ PASS: Filesystem test')
}

testFilesystem().catch(err => {
  console.error(err)
  process.exit(1)
})
```

---

## 11. Performance Considerations

### Zero-Overhead Design

**Detection overhead:**
- Cached after first call (microseconds)
- Never re-evaluated

**Abstraction overhead:**
- Direct property access (getters)
- Direct function exports (no wrapping)
- Ternary expressions optimized by JIT

**Measured impact:** Negligible (< 0.1% based on Twin Pair 2 benchmarks)

### Memory Footprint

**Minimal:**
- Small module (< 1KB per abstraction file)
- No large data structures
- Lazy loading for optional features

---

## 12. Future Considerations

### Potential Extensions

**Platform support:**
- Deno runtime
- Bun runtime
- Browser (if applicable)

**Capabilities:**
- Network operations (HTTP, TCP)
- Subprocess management
- IPC mechanisms
- Timers (already built-in, but might need abstraction for advanced features)

**Optimization:**
- Platform-specific fast paths
- JIT-friendly patterns
- Performance profiling hooks

### Deferred Decisions

**Not needed now, revisit when evidence emerges:**
- Async initialization
- Plugin system for custom platforms
- Runtime switching (hot-swapping platforms)
- Multiple platform support in single process

---

## 13. Documentation Requirements

### For Platform Abstraction Users (SPL2 Runtime Developers)

**Must document:**
- How to import and use platform API
- What abstractions are available
- Examples for common operations
- Migration guide from direct runtime APIs

### For Platform Maintainers

**Must document:**
- How to add new platforms
- How to add new capabilities
- Testing requirements
- API compatibility rules

### For End Users

**Not needed:**
- Platform abstraction is internal detail
- Users don't interact with it directly
- Transparent to application developers

---

## 14. Success Criteria

**Architecture is successful if:**

1. **Simple** - < 500 lines of code total
2. **Fast** - No measurable overhead
3. **Complete** - Supports all SPL2 runtime needs
4. **Extensible** - New platforms added in < 1 day
5. **Maintainable** - Clear structure, easy to understand
6. **Validated** - Works identically on Bare and Node

**Measured via:**
- Code size (lines, complexity)
- Performance benchmarks
- Test coverage
- Time to add new platform (future)

---

## 15. Conclusion

This architecture provides a clean, simple, performant foundation for SPL2 runtime platform abstraction. Based on validated patterns from hands-on exploration, it enables SPL2 to run on multiple JavaScript runtimes without complexity or performance penalty.

**Key strengths:**
- Proven patterns (Twin Pairs 1-3 validation)
- Minimal complexity
- Zero overhead
- Easy to extend
- Following "local rules apply" (self-contained)

**Implementation ready:** All design decisions made, patterns validated, ready for production implementation.

---

**End of Product 4A - Platform Abstraction Architecture**

*Design synthesizes findings from Twin Pairs 1-3. Ready for implementation.*
