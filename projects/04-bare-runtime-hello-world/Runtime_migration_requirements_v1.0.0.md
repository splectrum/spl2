# Runtime Migration Requirements v1.0.0

**Created:** 2025-11-14
**Product:** Twin Pair 3 - Product 3B (Requirements)
**Source:** RUNTIME_MIGRATION_GUIDE.md and minimal runtime migration
**Purpose:** Define requirements and patterns for migrating SPL2 runtime to Bare

---

## 1. Module Format Requirements

### REQ-MIG-MOD-001: CommonJS for Dual-Platform Code
**Requirement:** SPL2 runtime code targeting both Bare and Node MUST use CommonJS module format.
**Rationale:** CommonJS works identically on both platforms, avoids .mjs extension complexity.
**Pattern:**
```javascript
// Instead of ESM:
// import { something } from './module'
// export { result }

// Use CommonJS:
const { something } = require('./module')
module.exports = { result }
```
**Validation:** Minimal runtime uses CommonJS, works identically on both platforms.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Decision 1: Use CommonJS".

### REQ-MIG-MOD-002: Synchronous Module Loading
**Requirement:** Runtime module loading SHOULD use synchronous `require()` instead of dynamic `import()`.
**Rationale:** `require()` works identically on both platforms, simpler code.
**Pattern:**
```javascript
// Use require for module loading
const module = require('./path/to/module')

// Methods can still be async
const result = await module.someAsyncMethod()
```
**Validation:** module-loader.js uses `require()`, tested on both platforms.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Decision 2: Synchronous Module Loading".

---

## 2. Platform Abstraction Requirements

### REQ-MIG-ABS-001: Centralized Platform Abstraction Module
**Requirement:** Runtime MUST provide single platform abstraction module for all platform-specific APIs.
**Location:** `runtime/platform.js` (or equivalent)
**Purpose:** Single source of truth for platform differences.
**API Structure:**
```javascript
module.exports = {
  name: string,           // 'Bare' | 'Node.js'
  platform: string,       // OS platform
  version: string,        // Runtime version
  exit: (code) => void,   // Exit process
  // ... extend as needed
}
```
**Validation:** platform.js implemented and tested.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Platform Abstraction Layer".

### REQ-MIG-ABS-002: Business Logic Platform-Agnostic
**Requirement:** SPL methods and business logic MUST NOT contain platform-specific code.
**Rationale:** All platform differences handled by abstraction layer.
**Pattern:**
```javascript
// ✓ CORRECT: Uses abstraction
const platform = require('./platform')
console.log(`Running on: ${platform.name}`)

// ✗ INCORRECT: Direct platform check
if (typeof Bare !== 'undefined') {
  console.log('Running on Bare')
}
```
**Validation:** methods/hello/index.js has no platform-specific code.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Platform-agnostic business logic".

### REQ-MIG-ABS-003: Platform Abstraction Extension
**Requirement:** Platform abstraction module SHOULD be extended as new platform-specific needs arise.
**Pattern:** Add new properties/methods to platform.js when needed.
**Examples:**
- File system operations (if needed beyond modules)
- Environment variable access
- Path operations
- Process information
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Recommendations for Full Migration".

---

## 3. Context Management Requirements

### REQ-MIG-CTX-001: Context-Based State Management
**Requirement:** Runtime MUST use context object for state management.
**Rationale:** Enables method isolation, state scoping, platform-agnostic design.
**API Required:**
- `getState(key)` - Read value by key
- `setState(key, value)` - Write value by key
**Pattern:**
```javascript
const { createContext } = require('./context')
const ctx = createContext(initialState)
const value = ctx.getState('some.nested.key')
ctx.setState('another.key', value)
```
**Validation:** context.js implemented with getState/setState.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Context Management".

### REQ-MIG-CTX-002: Nested Key Support
**Requirement:** Context MUST support nested key access using dot notation.
**Format:** `'parent.child.grandchild'`
**Behavior:**
- Read: Traverse nested objects, return value or undefined
- Write: Create intermediate objects as needed
**Pattern:**
```javascript
ctx.setState('platform.info.version', 'v1.0.0')
const version = ctx.getState('platform.info.version')  // 'v1.0.0'
```
**Validation:** context.js supports arbitrary nesting depth.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Context Management".

### REQ-MIG-CTX-003: Context Initialization
**Requirement:** Context SHOULD be initialized with platform information.
**Rationale:** Makes platform details available to all methods.
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
**Validation:** runtime.js initializes context with platform info.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Runtime Execution Flow".

---

## 4. Method Pattern Requirements

### REQ-MIG-METHOD-001: Method Signature
**Requirement:** SPL methods MUST follow signature: `async function method(context)`.
**Parameters:** Single context parameter
**Return:** Result object (structure method-specific)
**Pattern:**
```javascript
async function methodName(context) {
  // Read from context
  const input = context.getState('some.key')

  // Business logic
  const result = processInput(input)

  // Write to context
  context.setState('output.key', result)

  // Return result
  return { result }
}

module.exports = methodName
```
**Validation:** methods/hello/index.js follows pattern.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Method Pattern".

### REQ-MIG-METHOD-002: Context State Updates
**Requirement:** Methods SHOULD write results to context state (in addition to returning).
**Rationale:** Enables state inspection, debugging, chaining.
**Pattern:**
```javascript
async function hello(context) {
  const greeting = "Hello!"
  context.setState('hello.greeting', greeting)  // Store in context
  return { message: greeting }                   // Also return
}
```
**Validation:** hello method stores greeting in context.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Method Pattern".

### REQ-MIG-METHOD-003: Platform-Agnostic Methods
**Requirement:** Methods MUST be platform-agnostic (no Bare/Node-specific code).
**Rationale:** Platform differences handled by abstraction layer, not methods.
**Validation:** Method code runs identically on both platforms.
**Evidence:** hello method produces identical results on Bare and Node.

---

## 5. Module Loading Requirements

### REQ-MIG-LOAD-001: Dynamic Method Loading
**Requirement:** Runtime MUST support loading methods dynamically by path.
**API:** `loadMethod(path)` returns method function
**Pattern:**
```javascript
const { loadMethod } = require('./module-loader')
const method = loadMethod('./methods/hello')
const result = await method(context)
```
**Validation:** module-loader.js loads methods dynamically.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Module Loading".

### REQ-MIG-LOAD-002: Error Handling in Module Loading
**Requirement:** Module loader MUST provide clear errors when loading fails.
**Pattern:**
```javascript
function loadMethod(methodPath) {
  try {
    return require(methodPath)
  } catch (error) {
    throw new Error(`Failed to load method from ${methodPath}: ${error.message}`)
  }
}
```
**Rationale:** Help debug missing or broken modules.
**Validation:** module-loader.js wraps errors with context.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Module Loading".

---

## 6. Runtime Execution Requirements

### REQ-MIG-EXEC-001: Execution Flow
**Requirement:** Runtime execution MUST follow standard flow:
1. Initialize platform abstraction
2. Create context with platform info
3. Load method dynamically
4. Invoke method with context
5. Verify/process results
6. Exit with appropriate code

**Validation:** runtime.js follows this flow.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Runtime Execution Flow".

### REQ-MIG-EXEC-002: Platform-Specific Exit
**Requirement:** Runtime MUST use platform abstraction for process exit.
**Pattern:**
```javascript
const platform = require('./platform')

// Success
platform.exit(0)

// Failure
platform.exit(1)
```
**Rationale:** `Bare.exit()` vs `process.exit()` difference.
**Validation:** runtime.js uses platform.exit().
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Platform Abstraction Layer".

### REQ-MIG-EXEC-003: Error Handling
**Requirement:** Runtime MUST catch and handle errors gracefully.
**Pattern:**
```javascript
try {
  // Execution logic
  platform.exit(0)
} catch (error) {
  console.error('Error:', error.message)
  console.error(error.stack)
  platform.exit(1)
}
```
**Validation:** runtime.js has try/catch with error handling.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Runtime Execution Flow".

---

## 7. Migration Process Requirements

### REQ-MIG-PROC-001: Incremental Migration
**Requirement:** Runtime migration SHOULD proceed incrementally, testing each component.
**Approach:**
1. Migrate one module/component
2. Test on both platforms
3. Fix issues before next migration
4. Repeat

**Rationale:** Catch issues early, reduce risk.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Recommendations for Full Migration".

### REQ-MIG-PROC-002: ESM to CommonJS Conversion
**Requirement:** ESM code MUST be converted to CommonJS for dual-platform support.
**Conversion:**
- `import { x } from 'module'` → `const { x } = require('module')`
- `export { y }` → `module.exports = { y }`
- `export default z` → `module.exports = z`
**Effort:** Low (can be automated)
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Recommendations for Full Migration".

### REQ-MIG-PROC-003: Node-Specific Dependency Identification
**Requirement:** Migration process MUST identify Node-specific dependencies.
**Check for:**
- File system operations (require bare-fs on Bare)
- Process operations (require bare-process on Bare)
- Environment variables (require bare-env on Bare)
- npm packages using Node-specific APIs
**Action:** Abstract or replace with platform-agnostic alternatives.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Recommendations for Full Migration".

---

## 8. Testing Requirements

### REQ-MIG-TEST-001: Dual-Platform Testing
**Requirement:** All migrated code MUST be tested on both Bare and Node.
**Commands:**
```bash
bare runtime.js
node runtime.js
```
**Validation:** Identical behavior on both platforms.
**Evidence:** Minimal runtime tested on both platforms successfully.

### REQ-MIG-TEST-002: Behavior Validation
**Requirement:** Tests MUST verify identical behavior on both platforms.
**Checks:**
- Same output
- Same state updates
- Same error handling
- Same performance characteristics (roughly)
**Validation:** runtime.js produces identical results.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Runtime Execution Flow" shows identical output.

---

## 9. Compatibility Observations

### OBS-MIG-COMPAT-001: CommonJS Works Identically
**Observation:** `require()` and `module.exports` work identically on both platforms.
**Impact:** No compatibility issues with CommonJS.
**Evidence:** All modules load identically.

### OBS-MIG-COMPAT-002: Async/Await Support
**Observation:** async/await works identically on both platforms.
**Impact:** Methods can use modern async patterns without concern.
**Evidence:** hello method uses async, works on both platforms.

### OBS-MIG-COMPAT-003: Core JavaScript Identical
**Observation:** Object manipulation, Date, JSON, console all work identically.
**Impact:** Business logic requires no special handling.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "What Works Identically".

---

## 10. Performance Requirements

### REQ-MIG-PERF-001: Startup Time Acceptable
**Requirement:** Runtime startup SHOULD complete in under 500ms on both platforms.
**Observed:** Both platforms startup instantly (< 250ms).
**Validation:** Subjective observation during testing.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Performance Observations".

### REQ-MIG-PERF-002: No Platform Overhead
**Requirement:** Platform abstraction MUST NOT introduce measurable overhead.
**Observed:** No noticeable performance difference.
**Rationale:** Simple ternary expressions, evaluated once.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Performance Observations".

---

## 11. Patterns

### PATTERN-MIG-001: Platform Abstraction Module
**Pattern:** Single module exports object with platform-specific values resolved.
**Code:**
```javascript
// platform.js
module.exports = {
  name: typeof Bare !== 'undefined' ? 'Bare' : 'Node.js',
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
}

// usage
const platform = require('./platform')
console.log(platform.name)
platform.exit(0)
```
**Use Case:** All platform-specific API access.
**Evidence:** platform.js in minimal runtime.

### PATTERN-MIG-002: Context-Based Method Invocation
**Pattern:** Methods receive context, read/write state, return results.
**Code:**
```javascript
async function method(context) {
  const input = context.getState('input.key')
  const result = process(input)
  context.setState('output.key', result)
  return { result }
}
```
**Use Case:** All SPL method implementations.
**Evidence:** hello method in minimal runtime.

### PATTERN-MIG-003: Dynamic Method Loading
**Pattern:** Load methods by path using require(), invoke with context.
**Code:**
```javascript
const method = require('./methods/hello')
const result = await method(context)
```
**Use Case:** Runtime method resolution and invocation.
**Evidence:** runtime.js and module-loader.js.

---

## 12. Constraints

### CONSTRAINT-MIG-001: ESM Not Recommended
**Constraint:** ESM support requires .mjs extension on Bare, complicates dual-platform.
**Impact:** Use CommonJS for cleaner dual-platform code.
**Workaround:** Convert ESM to CommonJS during migration.
**Evidence:** Twin Pair 1 CONSTRAINT-001, validated in migration.

### CONSTRAINT-MIG-002: Some Node Built-ins Require Bare Modules
**Constraint:** Features like process.env, filesystem require bare-* modules on Bare.
**Impact:** Must install bare-fs, bare-env, etc. as dependencies.
**Mitigation:** Abstract access through platform module.
**Evidence:** RUNTIME_MIGRATION_GUIDE.md "Recommendations for Full Migration".

---

## 13. Questions for Twin Pair 4 (Platform Abstraction Architecture)

**Architecture Questions:**
- Should platform abstraction be runtime-internal or separate library?
- How to structure for extensibility (new platforms in future)?
- Should abstraction be synchronous or support async initialization?
- How to handle platform-specific optimizations?

**API Design Questions:**
- Should platform module export object or class?
- Should state management be part of platform abstraction?
- How to version platform abstraction API?

**Packaging Questions:**
- One package for both platforms or separate?
- How to handle platform-specific dependencies in package.json?
- Should there be runtime-selection mechanism?

---

**End of Runtime Migration Requirements v1.0.0**

*Extracted from minimal runtime migration demonstrating SPL2 pattern works on both Bare and Node.*
