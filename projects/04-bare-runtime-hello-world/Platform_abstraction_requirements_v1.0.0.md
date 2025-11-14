# Platform Abstraction Requirements v1.0.0

**Created:** 2025-11-14
**Product:** Twin Pair 4 - Product 4B (Requirements)
**Source:** PLATFORM_ABSTRACTION_ARCHITECTURE.md
**Purpose:** Define requirements for implementing SPL2 platform abstraction

---

## 1. Module Structure Requirements

### REQ-ABSTRACT-STRUCT-001: Modular Organization
**Requirement:** Platform abstraction MUST be organized into focused modules.
**Structure:**
```
runtime/platform/
├── index.js          # Main entry point
├── detection.js      # Runtime detection
├── process.js        # Process/platform info
├── filesystem.js     # File system operations
├── lifecycle.js      # Exit, signals
└── README.md         # Usage documentation
```
**Rationale:** Separation of concerns, maintainability, clear responsibilities.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 2.

### REQ-ABSTRACT-STRUCT-002: Local Rules Apply
**Requirement:** Platform abstraction implementation MUST be self-contained dev environment.
**Requirements:**
- Own package.json declaring all dependencies
- Local node_modules (not global installs)
- Local bare runtime as devDependency
- .gitignore excluding node_modules
- Scripts for building and testing

**Rationale:** Cleanup, lift-and-shift, air-gapped scenarios, reproducibility.
**Evidence:** DAILY_LOG "Local Rules Apply" section, PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 2.

### REQ-ABSTRACT-STRUCT-003: Single Entry Point
**Requirement:** Platform abstraction MUST export unified API from single entry point (index.js).
**Pattern:**
```javascript
const platform = require('./platform')  // Single import
platform.name          // Access all features
platform.fs.readFile()
platform.exit()
```
**Rationale:** Simple consumer code, easier API evolution, clear interface.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 3, Decision 2.

---

## 2. Platform Detection Requirements

### REQ-ABSTRACT-DETECT-001: Runtime Detection Logic
**Requirement:** Detection module MUST identify current JavaScript runtime.
**Supported Runtimes:** Bare, Node.js (minimum)
**Detection Method:**
- Bare: `typeof Bare !== 'undefined'`
- Node: `typeof process !== 'undefined' && process.versions && process.versions.node`
**Validation:** Twin Pair 2 validated detection reliability.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 4.

### REQ-ABSTRACT-DETECT-002: Cached Detection
**Requirement:** Runtime detection MUST be performed once and cached.
**Pattern:**
```javascript
let _detectedRuntime = null

function detectRuntime() {
  if (_detectedRuntime !== null) return _detectedRuntime
  // ... detect and cache
  return _detectedRuntime
}
```
**Rationale:** Runtime doesn't change, avoid repeated detection overhead.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 4.

### REQ-ABSTRACT-DETECT-003: Unknown Runtime Error
**Requirement:** Detection MUST throw error for unsupported/unknown runtimes.
**Behavior:** `throw new Error('Unsupported JavaScript runtime')`
**Rationale:** Fail fast, prevent undefined behavior, force explicit support.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 9 Decision 4.

### REQ-ABSTRACT-DETECT-004: Helper Functions
**Requirement:** Detection module SHOULD export boolean helper functions.
**Helpers:**
- `isBare()` - Returns true if Bare runtime
- `isNode()` - Returns true if Node runtime
**Rationale:** Convenience, readable code.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 4.

---

## 3. API Design Requirements

### REQ-ABSTRACT-API-001: Core API Shape
**Requirement:** Platform abstraction MUST export object with specified structure.
**Required Properties:**
```javascript
{
  name: string,          // Runtime name
  platform: string,      // OS platform
  arch: string,          // CPU architecture
  version: string,       // Runtime version
  pid: number,           // Process ID
  argv: string[],        // Command line args
  exit: function,        // Exit process
  fs: object,            // File system operations
  env: object            // Environment variables (lazy)
}
```
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 3.

### REQ-ABSTRACT-API-002: Property Access Pattern
**Requirement:** API properties SHOULD use getters for lazy evaluation where appropriate.
**Pattern:**
```javascript
module.exports = {
  get platform() {
    return isBare() ? Bare.platform : process.platform
  }
}
```
**Rationale:** Lazy evaluation, JIT-friendly, simple syntax.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 5.

---

## 4. Process Abstraction Requirements

### REQ-ABSTRACT-PROC-001: Platform Information
**Requirement:** Process abstraction MUST provide runtime and platform information.
**Properties:**
- `name` - Runtime name ('Bare' | 'Node.js')
- `platform` - OS platform string
- `arch` - CPU architecture string
- `version` - Runtime version string
- `pid` - Process ID number
- `argv` - Command line arguments array
**Implementation:**
```javascript
get platform() {
  return isBare() ? Bare.platform : process.platform
}
```
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 5 "process.js".

---

## 5. File System Abstraction Requirements

### REQ-ABSTRACT-FS-001: Unified File System API
**Requirement:** File system abstraction MUST provide Promise-based API.
**Methods Required:**
- `writeFile(path, content)` - Write file
- `readFile(path, encoding)` - Read file
- `stat(path)` - Get file stats
- `unlink(path)` - Delete file
- `mkdir(path, options)` - Create directory
- `readdir(path)` - Read directory
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 5 "filesystem.js".

### REQ-ABSTRACT-FS-002: API Compatibility Leverage
**Requirement:** File system abstraction SHOULD leverage bare-fs / fs.promises compatibility.
**Pattern:**
```javascript
const fs = isBare()
  ? require('bare-fs')
  : require('fs').promises

module.exports = {
  writeFile: fs.writeFile,  // Direct export, no wrapper
  readFile: fs.readFile,
  // ...
}
```
**Rationale:** APIs are compatible, no wrapping needed, zero overhead.
**Evidence:** Twin Pair 2 validated API compatibility, PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 5.

---

## 6. Lifecycle Abstraction Requirements

### REQ-ABSTRACT-LIFE-001: Process Exit
**Requirement:** Lifecycle abstraction MUST provide exit function.
**Signature:** `exit(code: number = 0) => void`
**Implementation:**
```javascript
function exit(code = 0) {
  if (isBare()) {
    Bare.exit(code)
  } else {
    process.exit(code)
  }
}
```
**Rationale:** Different APIs (Bare.exit vs process.exit), needs wrapper.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 5 "lifecycle.js".

### REQ-ABSTRACT-LIFE-002: Future Lifecycle Features
**Requirement:** Lifecycle module SHOULD be extensible for future needs.
**Potential Extensions:**
- Signal handling
- Cleanup hooks
- Graceful shutdown
**Note:** Not implemented initially, but architecture supports.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 12 "Future Considerations".

---

## 7. Integration Requirements

### REQ-ABSTRACT-INT-001: Runtime Initialization
**Requirement:** SPL2 runtime MUST initialize platform abstraction early and inject into context.
**Pattern:**
```javascript
const platform = require('./platform')
const context = createContext({
  platform: {
    name: platform.name,
    platform: platform.platform,
    version: platform.version
  }
})
```
**Rationale:** Makes platform info available to methods without direct imports.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 6.

### REQ-ABSTRACT-INT-002: Method Platform-Agnosticism
**Requirement:** SPL methods MUST NOT import platform directly, use context instead.
**Pattern:**
```javascript
// ✓ CORRECT
async function method(context) {
  const platformName = context.getState('platform.name')
  // ...
}

// ✗ INCORRECT
async function method(context) {
  const platform = require('../platform')  // DON'T
  // ...
}
```
**Rationale:** Keeps methods testable, platform-agnostic, loosely coupled.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 6.

---

## 8. Extension Requirements

### REQ-ABSTRACT-EXT-001: Adding New Platforms
**Requirement:** Architecture MUST support adding new platforms (Deno, Bun, etc.) via extension.
**Process:**
1. Update detection.js with new runtime check
2. Update abstraction modules (process.js, filesystem.js, etc.) with new conditionals
3. Test on new platform
**Pattern:** Extend conditionals, don't restructure.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 7 "Adding New Platforms".

### REQ-ABSTRACT-EXT-002: Adding New Capabilities
**Requirement:** Architecture MUST support adding new abstraction modules.
**Process:**
1. Create new module (e.g., environment.js, network.js)
2. Implement platform-specific logic
3. Export from index.js
4. Test on all platforms
**Pattern:** Add modules, export from index.js.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 7 "Adding New Capabilities".

---

## 9. Testing Requirements

### REQ-ABSTRACT-TEST-001: Cross-Platform Test Suite
**Requirement:** Platform abstraction MUST have tests running on all supported platforms.
**Commands:**
```bash
npm run test:bare   # Run on Bare
npm run test:node   # Run on Node
npm run test        # Run on both
```
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 10.

### REQ-ABSTRACT-TEST-002: Test Organization
**Requirement:** Tests SHOULD be organized into unit, integration, and cross-platform.
**Structure:**
```
tests/
├── unit/              # Individual module tests
├── integration/       # Full API tests
└── cross-platform/    # Same code, both runtimes
```
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 10.

### REQ-ABSTRACT-TEST-003: Self-Testing Pattern
**Requirement:** Tests SHOULD follow self-testing pattern from Project 03.
**Pattern:**
```javascript
async function test() {
  // ... test logic
  if (actualResult !== expected) {
    console.error('✗ FAIL')
    platform.exit(1)
  }
  console.log('✓ PASS')
}
```
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 10.

---

## 10. Performance Requirements

### REQ-ABSTRACT-PERF-001: Zero-Overhead Design
**Requirement:** Platform abstraction MUST NOT introduce measurable overhead.
**Targets:**
- Detection: Cached, microseconds total
- Property access: Direct getters, JIT-optimized
- Function calls: Direct exports, no wrapping where possible
**Validation:** Benchmark on both platforms, compare to direct API access.
**Evidence:** Twin Pair 2 measured < 0.1% overhead, PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 11.

### REQ-ABSTRACT-PERF-002: Minimal Memory Footprint
**Requirement:** Platform abstraction SHOULD have minimal memory footprint.
**Target:** < 1KB per module
**Pattern:** Small modules, no large data structures, lazy loading for optional features.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 11.

---

## 11. Documentation Requirements

### REQ-ABSTRACT-DOC-001: Usage Documentation
**Requirement:** Platform abstraction MUST include usage documentation.
**Contents:**
- How to import and use API
- Available abstractions
- Examples for common operations
- Migration guide from direct runtime APIs
**Location:** platform/README.md
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 13.

### REQ-ABSTRACT-DOC-002: Maintainer Documentation
**Requirement:** Platform abstraction MUST include maintainer documentation.
**Contents:**
- How to add new platforms
- How to add new capabilities
- Testing requirements
- API compatibility rules
**Location:** platform/CONTRIBUTING.md or similar
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 13.

---

## 12. Migration Requirements

### REQ-ABSTRACT-MIG-001: Incremental Migration Path
**Requirement:** Migration from Project 03 runtime MUST be incremental.
**Phases:**
1. Create platform abstraction (standalone)
2. Integrate with existing runtime (replace direct references)
3. Update methods (use context, not platform)
4. Full validation (tests on both platforms)
**Rationale:** Reduce risk, catch issues early.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 8.

### REQ-ABSTRACT-MIG-002: Conversion Examples
**Requirement:** Documentation MUST provide before/after examples for migration.
**Example:**
```javascript
// Before
console.log(`Platform: ${process.platform}`)

// After
const platform = require('./platform')
console.log(`Platform: ${platform.platform}`)
```
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 8.

---

## 13. Design Decisions (Rationale)

### DECISION-ABSTRACT-001: Object Export vs Class
**Decision:** Export object, not class
**Rationale:** Simpler (no instantiation), getters provide lazy evaluation, matches proven pattern.
**Alternative Rejected:** Class with singleton (adds complexity for no benefit).
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 9 Decision 1.

### DECISION-ABSTRACT-002: Single Entry Point
**Decision:** Single index.js exports everything
**Rationale:** One import for consumers, internal organization still modular, easier API evolution.
**Alternative Rejected:** Import specific modules (more imports, more coupling).
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 9 Decision 2.

### DECISION-ABSTRACT-003: Synchronous Initialization
**Decision:** Synchronous detection and module loading
**Rationale:** Detection is instant, no async complexity, simpler consumer code.
**Alternative Rejected:** Async initialization (not needed for current platforms).
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 9 Decision 3.

### DECISION-ABSTRACT-004: Fail Fast on Unknown Runtime
**Decision:** Throw error for unsupported runtimes
**Rationale:** Better than undefined behavior, forces explicit support, clear error.
**Alternative Rejected:** Return null/undefined (risks hidden bugs).
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 9 Decision 4.

### DECISION-ABSTRACT-005: Lazy for Optional, Eager for Core
**Decision:** Lazy load optional features, eager for core
**Rationale:** Core always needed, optional on-demand, balances startup and memory.
**Alternative Rejected:** All lazy (complicates common case) or all eager (wastes memory).
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 9 Decision 5.

---

## 14. Constraints

### CONSTRAINT-ABSTRACT-001: API Compatibility Dependency
**Constraint:** File system abstraction depends on bare-fs mirroring fs.promises API.
**Impact:** If APIs diverge, need wrapper layer.
**Current State:** APIs are compatible (Twin Pair 2 validated).
**Mitigation:** Monitor bare-fs updates, add wrapper if needed.
**Evidence:** Twin Pair 2 findings, PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 5.

### CONSTRAINT-ABSTRACT-002: Platform-Specific Dependencies
**Constraint:** Some features require platform-specific modules (bare-fs, bare-env).
**Impact:** package.json must include platform dependencies.
**Mitigation:** Declare all dependencies, test installation on both platforms.
**Evidence:** Twin Pair 1 findings, PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 2.

---

## 15. Success Criteria

### REQ-ABSTRACT-SUCCESS-001: Simplicity
**Criterion:** Total implementation < 500 lines of code
**Rationale:** Simple enough to understand and maintain.
**Measurement:** Count lines across all platform/ modules.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 14.

### REQ-ABSTRACT-SUCCESS-002: Performance
**Criterion:** No measurable overhead (< 1% in benchmarks)
**Rationale:** Zero-overhead abstraction principle.
**Measurement:** Benchmark platform operations vs direct API calls.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 14.

### REQ-ABSTRACT-SUCCESS-003: Completeness
**Criterion:** Supports all SPL2 runtime needs
**Rationale:** Must be sufficient for production use.
**Measurement:** Successfully run Project 03 runtime on both platforms.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 14.

### REQ-ABSTRACT-SUCCESS-004: Extensibility
**Criterion:** New platform added in < 1 day
**Rationale:** Easy to extend for future runtimes.
**Measurement:** Time to add Deno support (future test).
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 14.

---

## 16. Future Considerations

### FUTURE-ABSTRACT-001: Additional Platforms
**Platforms:** Deno, Bun, Browser (if applicable)
**Status:** Deferred until demand exists
**Preparation:** Architecture supports extension.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 12.

### FUTURE-ABSTRACT-002: Additional Capabilities
**Capabilities:**
- Network operations (HTTP, TCP)
- Subprocess management
- IPC mechanisms
- Advanced timers
**Status:** Deferred until SPL2 runtime needs them.
**Preparation:** Extension mechanism defined.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 12.

### FUTURE-ABSTRACT-003: Optimizations
**Optimizations:**
- Platform-specific fast paths
- JIT-friendly patterns
- Performance profiling hooks
**Status:** Deferred until performance profiling shows need.
**Preparation:** Zero-overhead baseline established.
**Evidence:** PLATFORM_ABSTRACTION_ARCHITECTURE.md Section 12.

---

**End of Platform Abstraction Requirements v1.0.0**

*Architecture design complete. Requirements formalized. Ready for implementation.*
