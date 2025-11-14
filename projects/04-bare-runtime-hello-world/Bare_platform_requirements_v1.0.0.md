# Bare Platform Requirements v1.0.0

**Created:** 2025-11-14
**Product:** Twin Pair 1 - Product 1B (Requirements)
**Source:** BARE_PLATFORM_GUIDE.md findings and examples
**Purpose:** Define requirements, patterns, and constraints for Bare platform development

---

## 1. Installation Requirements

### REQ-BARE-INSTALL-001: npm-based Installation
**Requirement:** Bare MUST be installable via npm global installation.
**Rationale:** Leverages existing npm ecosystem for distribution while maintaining standalone runtime.
**Validation:** `npm install -g bare` installs successfully.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 1, v1.24.2 installed in ~26 seconds.

### REQ-BARE-INSTALL-002: Platform Binary Architecture
**Requirement:** Bare installation MUST include platform-specific native binary.
**Rationale:** Standalone runtime independence from Node.js execution.
**Pattern:** npm package contains Node.js wrapper + native binary for target platform.
**Evidence:** `/usr/local/lib/node_modules/bare/node_modules/bare-runtime-linux-x64/bin/bare` is ELF executable.

### REQ-BARE-INSTALL-003: Node.js Bootstrap
**Requirement:** Bare command MAY use Node.js for bootstrapping/launching.
**Rationale:** Simplifies cross-platform launcher while keeping runtime independent.
**Pattern:** `/usr/local/bin/bare` is Node.js script that spawns native binary via `bare-runtime/spawn`.
**Evidence:** `/usr/local/lib/node_modules/bare/bin/bare` contains `#!/usr/bin/env node`.

### REQ-BARE-INSTALL-004: Installation Prerequisites
**Requirement:** Bare installation REQUIRES Node.js and npm present on system.
**Constraint:** Node.js only needed for installation, not for Bare runtime execution.
**Evidence:** npm used for package installation; Bare binary runs independently thereafter.

---

## 2. Module System Requirements

### REQ-BARE-MODULE-001: CommonJS Support
**Requirement:** Bare MUST support CommonJS module syntax with .js extension.
**Pattern:**
```javascript
const module = require('module-name')
module.exports = { ... }
```
**Validation:** 01-hello-world.js, 02-file-operations.js run successfully.
**Evidence:** All .js examples use CommonJS require() successfully.

### REQ-BARE-MODULE-002: ESM Support with .mjs Extension
**Requirement:** Bare MUST support ESM module syntax with .mjs extension.
**Constraint:** ESM import/export REQUIRES .mjs file extension.
**Pattern:**
```javascript
// filename.mjs
import { item } from 'module-name'
export { item }
```
**Validation:** 03-esm-modules.mjs runs successfully with import/export.
**Error Pattern:** Using `import` in .js file throws "Cannot use import statement outside a module".
**Evidence:** BARE_PLATFORM_GUIDE.md Section 5, example 03-esm-modules.mjs.

### REQ-BARE-MODULE-003: Top-Level Await
**Requirement:** Bare MUST support top-level await in .mjs files.
**Pattern:**
```javascript
// filename.mjs
const data = await fetchData()
```
**Validation:** 03-esm-modules.mjs uses top-level await successfully.
**Evidence:** Example 03 line 13: `await writeFile(testFile, content)` executes at module top level.

### REQ-BARE-MODULE-004: Node-Style Module Resolution
**Requirement:** Bare MUST resolve modules from `node_modules/` directory.
**Rationale:** npm compatibility for dependency management.
**Pattern:** Same resolution as Node.js (looks in node_modules/, follows package.json).
**Validation:** `require('bare-fs')` resolves to `examples/node_modules/bare-fs/`.
**Evidence:** 02-file-operations.js successfully requires bare-fs from node_modules.

---

## 3. Core API Requirements

### REQ-BARE-CORE-001: Bare Global Namespace
**Requirement:** Bare MUST provide `Bare` global object with platform information and lifecycle methods.
**Required Properties:**
- `Bare.platform` - Platform string ('linux', 'darwin', 'win32', 'android', 'ios')
- `Bare.arch` - Architecture string ('x64', 'arm64', 'arm', 'ia32', 'mips', 'mipsel')
- `Bare.version` - Version string (e.g., 'v1.24.2')
- `Bare.pid` - Process ID (number)
- `Bare.argv` - Command line arguments (array)
- `Bare.exit([code])` - Exit process immediately
**Validation:** 01-hello-world.js validates all properties exist and have correct types.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 8, example output shows all properties.

### REQ-BARE-CORE-002: Built-in Console
**Requirement:** Bare MUST provide built-in console object with log/error methods.
**Methods Required:** `console.log()`, `console.error()`
**Constraint:** No library installation needed for console.
**Validation:** All examples use console.log() without importing module.
**Evidence:** Every example file uses console successfully.

### REQ-BARE-CORE-003: Built-in Timers
**Requirement:** Bare MUST provide built-in timer functions.
**Functions Required:**
- `setTimeout(callback, ms)` - Execute once after delay
- `setInterval(callback, ms)` - Execute repeatedly
- `clearTimeout(id)` - Cancel timeout
- `clearInterval(id)` - Cancel interval
**Constraint:** No library installation needed for timers.
**Validation:** 04-timers-process.js tests all timer functions successfully.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 8 "Timers", example 04 output shows timers work.

### REQ-BARE-CORE-004: Minimal Core Philosophy
**Requirement:** Bare core MUST be minimal - only console, timers, and Bare global built-in.
**Constraint:** All other functionality (file system, networking, etc.) REQUIRES external modules.
**Rationale:** Lightweight runtime, explicit dependencies.
**Evidence:** File system requires bare-fs, streams require bare-stream (BARE_PLATFORM_GUIDE.md Section 3).

---

## 4. Module Ecosystem Requirements

### REQ-BARE-ECO-001: npm Package Manager Compatibility
**Requirement:** Bare projects MUST support standard npm workflow.
**Commands Required:**
- `npm init` - Create package.json
- `npm install <package>` - Install dependencies
- Standard package.json format
**Validation:** Created package.json with npm init, installed bare-fs with npm install.
**Evidence:** examples/package.json created via npm init -y, dependencies section contains bare-fs.

### REQ-BARE-ECO-002: File System Module (bare-fs)
**Requirement:** File system operations REQUIRE bare-fs module installation.
**API Pattern:** Promise-based (async/await compatible).
**Essential Functions:**
- `writeFile(path, content)` - Write file
- `readFile(path, encoding)` - Read file
- `stat(path)` - Get file info
- `unlink(path)` - Delete file
**Installation:** `npm install bare-fs`
**Validation:** 02-file-operations.js tests all functions successfully.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 8 "File System".

### REQ-BARE-ECO-003: Streams Module (bare-stream)
**Requirement:** Stream operations REQUIRE bare-stream module installation.
**API Pattern:** Event-based, similar to Node.js streams.
**Classes:**
- `Readable` - Readable stream
- `Writable` - Writable stream
**Events:** 'data', 'end', 'error'
**Installation:** `npm install bare-stream`
**Validation:** 06-streams-demo.js creates Readable stream, receives data/end events.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 8 "Streams".

### REQ-BARE-ECO-004: Module Discovery
**Requirement:** Bare modules SHOULD be discoverable via npm registry with "bare-" prefix.
**Pattern:** Search npm for packages starting with "bare-" for ecosystem modules.
**Examples:** bare-fs, bare-stream, bare-process, bare-events, bare-env
**Evidence:** BARE_PLATFORM_GUIDE.md Section 3 lists 20+ bare-* modules.

---

## 5. JavaScript Compatibility Requirements

### REQ-BARE-JS-001: Modern JavaScript Support
**Requirement:** Bare MUST support modern JavaScript syntax (ES2015+).
**Features Required:**
- `const` / `let` declarations
- Arrow functions
- Template literals
- Destructuring
- Promises
- async/await
**Validation:** All examples use modern syntax without issues.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 7, examples use all listed features.

### REQ-BARE-JS-002: Async/Await Support
**Requirement:** Bare MUST support async/await for asynchronous operations.
**Pattern:**
```javascript
async function example() {
  const result = await asyncOperation()
}
```
**Validation:** 02-file-operations.js uses async/await for all file operations.
**Evidence:** Example 02 line 6-44 uses await for fs operations.

### REQ-BARE-JS-003: Promise Support
**Requirement:** Bare MUST support native Promise objects.
**Pattern:** All async APIs should return Promises.
**Validation:** bare-fs returns Promises for all operations.
**Evidence:** await fs.readFile() works (Promises are awaitable).

---

## 6. Platform Detection Requirements

### REQ-BARE-DETECT-001: Bare Runtime Detection
**Requirement:** Code MUST be able to detect Bare runtime reliably.
**Pattern:**
```javascript
if (typeof Bare !== 'undefined') {
  // Running on Bare
} else {
  // Not Bare (probably Node)
}
```
**Rationale:** `Bare` global is unique to Bare runtime.
**Validation:** 01-hello-world.js checks `typeof Bare === 'undefined'` as validation.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 11 "Platform Detection".

### REQ-BARE-DETECT-002: Platform Information Access
**Requirement:** Bare MUST provide platform and architecture information via Bare global.
**Use Case:** Conditional logic based on platform (Linux vs macOS vs Windows).
**Pattern:**
```javascript
if (Bare.platform === 'linux') {
  // Linux-specific code
} else if (Bare.platform === 'darwin') {
  // macOS-specific code
}
```
**Validation:** Bare.platform returns 'linux' on test system.
**Evidence:** 01-hello-world.js output shows Platform: linux.

---

## 7. Performance Requirements

### REQ-BARE-PERF-001: Fast Startup Time
**Requirement:** Bare cold start SHOULD complete in under 500ms for simple scripts.
**Measured:** 246ms (real time) for "hello world" script.
**Pattern:** `time bare -e "console.log('test')"` shows <250ms.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 9, time measurement output.

### REQ-BARE-PERF-002: CPU Performance
**Requirement:** Bare SHOULD provide performance comparable to Node.js for CPU-bound JavaScript.
**Benchmarks (observed):**
- Array operations: ~13.8M ops/sec (1M iterations in 72ms)
- Object creation: ~2.1M objects/sec (100K objects in 47ms)
- String concatenation: ~33M ops/sec (100K iterations in 3ms)
**Validation:** 05-performance-test.js measures throughput.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 9 "Execution Speed".

---

## 8. Development Workflow Requirements

### REQ-BARE-DEV-001: Command Line Execution
**Requirement:** Bare MUST execute JavaScript files via command line.
**Pattern:** `bare <filename.js>`
**Arguments:** `bare <filename> arg1 arg2` (accessible via Bare.argv)
**Validation:** All examples run via `bare <filename>`.
**Evidence:** Every example execution in BARE_PLATFORM_GUIDE.md.

### REQ-BARE-DEV-002: Inline Evaluation
**Requirement:** Bare SHOULD support inline code evaluation.
**Pattern:**
- `bare -e "<code>"` - Evaluate code
- `bare -p "<expression>"` - Evaluate and print result
**Validation:** `bare -e "console.log('Quick startup')"` works (startup time test).
**Evidence:** BARE_PLATFORM_GUIDE.md Section 9 timing test uses -e flag.

### REQ-BARE-DEV-003: Error Messages
**Requirement:** Bare MUST provide clear error messages with stack traces.
**Observed Quality:** Clear, helpful error messages.
**Example:** "Cannot use import statement outside a module" (ESM in .js file error).
**Evidence:** BARE_PLATFORM_GUIDE.md Section 4 "Error Messages".

---

## 9. Testing Requirements

### REQ-BARE-TEST-001: Self-Testing Pattern
**Requirement:** Bare code SHOULD support self-testing pattern for validation.
**Pattern:**
```javascript
// Test code
if (actualResult !== expectedResult) {
  console.error('FAIL:', description)
  Bare.exit(1)
}
console.log('✓ Test passed')
```
**Rationale:** Lightweight testing without framework dependency.
**Validation:** All 6 examples use self-testing pattern successfully.
**Evidence:** Every example has validation section and exits with code 1 on failure.

---

## 10. Constraints

### CONSTRAINT-001: ESM File Extension
**Constraint:** ESM syntax (import/export) REQUIRES .mjs file extension.
**Impact:** Cannot use import in .js files.
**Workaround:** Use CommonJS (require) in .js, or rename to .mjs for ESM.
**Evidence:** 03-esm-modules.js failed with .js extension, worked with .mjs.

### CONSTRAINT-002: Explicit Module Installation
**Constraint:** All functionality beyond console/timers REQUIRES explicit module installation.
**Impact:** File system, networking, environment access all need npm install.
**Pattern:** Must run `npm install bare-fs` before using file system.
**Evidence:** bare-fs, bare-stream required installation before use.

### CONSTRAINT-003: Different Global Namespace
**Constraint:** Bare uses `Bare` global instead of Node's `process` global.
**Impact:** Code using process.* won't work without modification.
**Migration Pattern:** Replace `process.platform` with `Bare.platform`, etc.
**Evidence:** No `process` global exists in Bare (would need bare-process module).

### CONSTRAINT-004: Smaller Ecosystem
**Constraint:** Bare ecosystem is smaller than Node.js ecosystem.
**Impact:** Some npm packages may not work if they depend on Node-specific APIs.
**Mitigation:** Test package compatibility, prefer bare-* modules when available.
**Evidence:** BARE_PLATFORM_GUIDE.md Section 3 notes smaller ecosystem.

---

## 11. Patterns

### PATTERN-001: Platform-Agnostic Code Structure
**Pattern:** Use runtime detection to switch between Bare and Node APIs.
```javascript
const fs = typeof Bare !== 'undefined'
  ? require('bare-fs')
  : require('fs').promises

const platform = typeof Bare !== 'undefined'
  ? Bare.platform
  : process.platform
```
**Use Case:** Write code that runs on both Bare and Node.
**Next Twin Pair:** Twin Pair 2 will explore this pattern in depth.

### PATTERN-002: npm Workflow Consistency
**Pattern:** Use same npm workflow for both Bare and Node projects.
**Commands:**
```bash
npm init -y
npm install <package>
bare script.js  # Instead of: node script.js
```
**Benefit:** Familiar workflow, no new tools to learn.
**Evidence:** examples/ folder uses standard package.json and node_modules/.

### PATTERN-003: Self-Testing Examples
**Pattern:** Embed validation in example code for reliability.
**Structure:**
1. Execute functionality
2. Validate results match expectations
3. Exit with code 1 on failure, 0 on success
4. Print clear success/failure messages
**Benefit:** Examples serve as executable tests, failures obvious.
**Evidence:** All 6 examples follow this pattern.

---

## 12. Questions for Future Twin Pairs

### For Twin Pair 2 (Platform Switching):
- How to structure code for both Bare and Node compatibility?
- Performance overhead of runtime detection?
- Can we abstract platform differences into single interface?

### For Twin Pair 3 (Migration):
- What breaks when migrating from Node to Bare?
- How to handle Node-specific dependencies?
- Can SPL2 runtime be made platform-agnostic?

### For Twin Pair 4 (Abstraction):
- Best architecture for platform abstraction layer?
- Should abstraction be in runtime or separate library?
- How to minimize performance overhead of abstraction?

---

**End of Bare Platform Requirements v1.0.0**

*Extracted from hands-on exploration documented in BARE_PLATFORM_GUIDE.md and validated examples.*
