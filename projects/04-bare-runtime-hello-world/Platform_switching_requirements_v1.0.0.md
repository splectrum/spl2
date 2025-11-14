# Platform Switching Requirements v1.0.0

**Created:** 2025-11-14
**Product:** Twin Pair 2 - Product 2B (Requirements)
**Source:** PLATFORM_SWITCHING_GUIDE.md findings and examples
**Purpose:** Define requirements and patterns for platform-agnostic code

---

## 1. Runtime Detection Requirements

### REQ-SWITCH-DETECT-001: Bare Runtime Detection Method
**Requirement:** Code MUST use `typeof Bare !== 'undefined'` for Bare detection.
**Rationale:** Reliable, fast, no false positives/negatives.
**Pattern:**
```javascript
const isBare = typeof Bare !== 'undefined'
```
**Validation:** Example 07 tested on both platforms, 100% reliable.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 1.

### REQ-SWITCH-DETECT-002: Node Runtime Detection Method
**Requirement:** Code MUST use `typeof process !== 'undefined' && process.versions && process.versions.node` for Node detection.
**Rationale:** `process.versions.node` unique to Node.js, avoids false positives.
**Pattern:**
```javascript
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node
```
**Validation:** Example 07 tested on both platforms, mutually exclusive with Bare detection.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 1.

### REQ-SWITCH-DETECT-003: Detection Optimization
**Requirement:** Runtime detection SHOULD be performed once at module initialization, not in hot code paths.
**Rationale:** Detection has measurable overhead in tight loops (microseconds per call).
**Pattern:**
```javascript
// Module top level - detect once
const isBare = typeof Bare !== 'undefined'

// Use throughout module
function doSomething() {
  const platform = isBare ? Bare.platform : process.platform
}
```
**Performance:** 10M iterations: 42ms overhead (Bare), 257ms overhead (Node).
**Validation:** Example 10 benchmarks detection overhead.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 1 "Detection Performance".

---

## 2. Platform Abstraction Requirements

### REQ-SWITCH-ABS-001: Platform Information Abstraction
**Requirement:** Platform-agnostic code MUST abstract platform information access.
**Properties to Abstract:**
- `platform` - OS platform (Bare.platform / process.platform)
- `arch` - CPU architecture (Bare.arch / process.arch)
- `pid` - Process ID (Bare.pid / process.pid)
- `version` - Runtime version (Bare.version / process.version)
- `argv` - Command line arguments (Bare.argv / process.argv)
**Pattern:**
```javascript
const runtime = {
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  arch: typeof Bare !== 'undefined' ? Bare.arch : process.arch,
  pid: typeof Bare !== 'undefined' ? Bare.pid : process.pid,
  version: typeof Bare !== 'undefined' ? Bare.version : process.version,
  argv: typeof Bare !== 'undefined' ? Bare.argv : process.argv
}
```
**Validation:** Example 08 validates identical values on both platforms.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 2 "Simple Object Abstraction".

### REQ-SWITCH-ABS-002: Process Exit Abstraction
**Requirement:** Platform-agnostic code MUST abstract process exit functionality.
**Pattern:**
```javascript
const exit = (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
```
**Rationale:** Exit mechanisms differ (Bare.exit vs process.exit), abstraction provides unified interface.
**Validation:** Example 08 uses abstraction successfully on both platforms.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 2.

### REQ-SWITCH-ABS-003: File System Abstraction
**Requirement:** Platform-agnostic code MUST use abstracted file system module.
**Pattern:**
```javascript
const fs = typeof Bare !== 'undefined'
  ? require('bare-fs')
  : require('fs').promises
```
**Rationale:** `bare-fs` and `fs.promises` have compatible APIs (Promise-based, same method names).
**API Compatibility:**
- `writeFile(path, content)` - ✓ Compatible
- `readFile(path, encoding)` - ✓ Compatible
- `stat(path)` - ✓ Compatible
- `unlink(path)` - ✓ Compatible
**Validation:** Example 09 runs identical fs code on both platforms.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 2 "File System Abstraction".

---

## 3. Abstraction Strategy Requirements

### REQ-SWITCH-STRAT-001: Layered Architecture
**Requirement:** Platform-agnostic systems SHOULD use layered architecture separating platform detection from business logic.
**Layers:**
1. **Business Logic Layer** - Platform-agnostic, no detection code
2. **Platform Abstraction Layer** - Single detection point, exports unified API
3. **Platform-Specific Layer** - Bare or Node.js native APIs
**Rationale:** Clear separation of concerns, testable, maintainable.
**Pattern:**
```
runtime/
  platform.js         # Abstraction layer (detects, exports unified API)
  business-logic.js   # Uses platform.js, platform-agnostic
```
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 9 "Architecture Recommendations".

### REQ-SWITCH-STRAT-002: Module-Level Detection
**Requirement:** Runtime detection MUST occur at module level, not function level.
**Pattern:**
```javascript
// ✓ CORRECT: Module level
const isBare = typeof Bare !== 'undefined'
function getPlatform() {
  return isBare ? Bare.platform : process.platform
}

// ✗ INCORRECT: Function level
function getPlatform() {
  return typeof Bare !== 'undefined' ? Bare.platform : process.platform
}
```
**Rationale:** Avoid repeated detection overhead, clearer code, single source of truth.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 3 "Recommended Approach".

### REQ-SWITCH-STRAT-003: Abstraction Strategy Selection
**Requirement:** Choose abstraction strategy based on complexity:
- **Inline Ternary:** Single property access, simple operations
- **Object Wrapper:** Multiple platform properties needed
- **Module Abstraction:** Complex APIs with compatible modules
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 3 "Abstraction Strategies".

---

## 4. API Compatibility Requirements

### REQ-SWITCH-COMPAT-001: Compatible Core APIs
**Requirement:** Platform-agnostic code MAY assume core JavaScript APIs are identical on both platforms.
**APIs Verified Compatible:**
- `console.log()`, `console.error()` - ✓ Identical
- `setTimeout()`, `setInterval()`, `clearTimeout()`, `clearInterval()` - ✓ Identical
- `Promise`, `async/await` - ✓ Identical
- `const`, `let`, arrow functions, template literals - ✓ Identical
**Evidence:** Bare_platform_requirements_v1.0.0.md, PLATFORM_SWITCHING_GUIDE.md Section 4.

### REQ-SWITCH-COMPAT-002: File System API Compatibility
**Requirement:** Platform-agnostic file operations MAY assume `bare-fs` and `fs.promises` are compatible.
**Compatible Methods Verified:**
- `writeFile(path, content)` - Same signature, same behavior
- `readFile(path, encoding)` - Same signature, same behavior
- `stat(path)` - Same signature, same return structure
- `unlink(path)` - Same signature, same behavior
**Validation:** Example 09 demonstrates identical behavior.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 4 "API Compatibility Matrix".

### REQ-SWITCH-COMPAT-003: Environment Variable Access Requires Abstraction
**Requirement:** Environment variable access MUST be abstracted (not identical on both platforms).
**Difference:**
- Node: `process.env.VAR_NAME` (built-in)
- Bare: `require('bare-env').VAR_NAME` (requires module)
**Pattern:**
```javascript
const env = typeof Bare !== 'undefined'
  ? require('bare-env')
  : process.env
const myVar = env.MY_VARIABLE
```
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 5 "Gotcha: Environment Variables".

---

## 5. Constraint Requirements

### CONSTRAINT-SWITCH-001: Module Availability Differences
**Constraint:** Some Node.js built-in APIs require external modules in Bare.
**Examples:**
- `process.env` (Node built-in) → `bare-env` (Bare module)
- `process` object (Node built-in) → `bare-process` (Bare module)
**Impact:** package.json must include Bare-specific dependencies.
**Mitigation:** Install required bare-* modules, abstract access.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 5 "Constraint 1".

### CONSTRAINT-SWITCH-002: npm Package Compatibility
**Constraint:** Not all npm packages work on both Bare and Node.
**Impact:** Packages using Node-specific APIs may fail on Bare.
**Mitigation:**
- Test package compatibility before use
- Prefer bare-* modules when available
- Check package for Node-specific dependencies
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 5 "Constraint 2".

### CONSTRAINT-SWITCH-003: ESM File Extension Requirement
**Constraint:** ESM code requires .mjs extension on Bare (Node can use package.json config).
**Impact:** Cannot share .js ESM files without modification or standardization.
**Recommendation:** Use CommonJS for platform-agnostic code.
**Alternative:** Standardize on .mjs for both platforms.
**Evidence:** Bare_platform_requirements_v1.0.0.md CONSTRAINT-001, PLATFORM_SWITCHING_GUIDE.md Section 5.

---

## 6. Performance Requirements

### REQ-SWITCH-PERF-001: Detection Overhead Acceptable
**Requirement:** Runtime detection overhead MUST be negligible for real-world use.
**Measured Overhead:**
- 10M iterations on Bare: 42ms absolute (0.0000042ms per call)
- 10M iterations on Node: 257ms absolute (0.0000257ms per call)
**Assessment:** Overhead unmeasurable in real applications (microseconds per call).
**Recommendation:** Detection overhead is acceptable even in frequently-called code.
**Validation:** Example 10 benchmarks overhead.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 1 "Detection Performance".

---

## 7. Testing Requirements

### REQ-SWITCH-TEST-001: Dual Platform Testing
**Requirement:** Platform-agnostic code MUST be tested on both Bare and Node.
**Rationale:** Ensure behavior is identical, catch platform-specific issues.
**Pattern:**
```bash
bare example.js  # Test on Bare
node example.js  # Test on Node
```
**Validation:** Examples 07-10 all run successfully on both platforms.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 8 "Recommendations".

### REQ-SWITCH-TEST-002: Self-Testing Pattern for Both Platforms
**Requirement:** Examples SHOULD validate their own behavior on both platforms.
**Pattern:**
```javascript
if (actualResult !== expectedResult) {
  console.error('FAIL:', description)
  const exit = typeof Bare !== 'undefined' ? Bare.exit : process.exit
  exit(1)
}
console.log('✓ Test passed')
```
**Validation:** All Twin Pair 2 examples use self-testing pattern.
**Evidence:** Examples 07-10 source code.

---

## 8. Development Workflow Requirements

### REQ-SWITCH-DEV-001: CommonJS for Compatibility
**Requirement:** Platform-agnostic SPL2 code SHOULD use CommonJS module format.
**Rationale:**
- Both platforms support CommonJS well
- Avoids .mjs extension complexity
- async/await works in CommonJS
- Simpler for dual-platform development
**Alternative:** Standardize on .mjs if ESM required.
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 8 "Recommendations".

### REQ-SWITCH-DEV-002: Platform Abstraction Module
**Requirement:** SPL2 runtime SHOULD provide platform abstraction module.
**Purpose:** Single module exports unified API, hides detection logic.
**Structure:**
```javascript
// runtime/platform.js
module.exports = {
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  pid: typeof Bare !== 'undefined' ? Bare.pid : process.pid,
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code),
  // ... more abstractions
}

// business-logic.js
const platform = require('./runtime/platform')
console.log('Platform:', platform.platform)
platform.exit(0)
```
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 8 "For SPL2 Runtime Development".

### REQ-SWITCH-DEV-003: Document Platform Requirements
**Requirement:** Projects using platform-agnostic code MUST document required modules.
**Contents:**
- List Bare-specific modules in package.json dependencies
- Note platform-specific code locations
- Testing instructions for both platforms
**Evidence:** PLATFORM_SWITCHING_GUIDE.md Section 8 "Recommendations".

---

## 9. Patterns

### PATTERN-SWITCH-001: Inline Ternary Detection
**Pattern:** Single property access with inline detection.
```javascript
const platform = typeof Bare !== 'undefined' ? Bare.platform : process.platform
```
**Use Case:** Simple, one-off property access.
**Trade-off:** Repeated detection if used frequently.
**Evidence:** Examples 07-10 use this pattern.

### PATTERN-SWITCH-002: Object Wrapper Abstraction
**Pattern:** Object encapsulating multiple platform properties.
```javascript
const runtime = {
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  arch: typeof Bare !== 'undefined' ? Bare.arch : process.arch,
  pid: typeof Bare !== 'undefined' ? Bare.pid : process.pid,
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
}
```
**Use Case:** Multiple platform properties needed in scope.
**Benefit:** Single detection point, organized namespace.
**Evidence:** Example 08 demonstrates pattern.

### PATTERN-SWITCH-003: Module Abstraction
**Pattern:** Abstract entire module with compatible API.
```javascript
const fs = typeof Bare !== 'undefined'
  ? require('bare-fs')
  : require('fs').promises
```
**Use Case:** Complex APIs with existing compatibility.
**Benefit:** No wrapper code needed, full API available.
**Evidence:** Example 09 demonstrates pattern.

---

## 10. Questions for Twin Pair 3 (Runtime Migration)

**Migration Questions:**
- How much of Project 03 runtime code is already platform-agnostic?
- What Node-specific APIs does SPL2 runtime use?
- Can we migrate incrementally or need full rewrite?
- Are there performance differences in real SPL2 workloads?

**Testing Questions:**
- Do existing SPL2 tests run on both platforms?
- Are there Bare-specific failure modes?
- How do we validate identical behavior?

**Architecture Questions:**
- Where should platform abstraction live in SPL2 structure?
- Should abstraction be runtime concern or separate library?
- How to handle platform-specific optimizations?

---

**End of Platform Switching Requirements v1.0.0**

*Extracted from hands-on exploration documented in PLATFORM_SWITCHING_GUIDE.md and validated examples.*
