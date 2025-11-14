# Bare Platform Guide

**Created:** 2025-11-14
**Product:** Twin Pair 1 - Product 1A (Deliverable)
**Purpose:** Hands-on findings from exploring Bare JavaScript runtime

---

## 1. Installation & Setup

### How Bare Installs

Bare uses npm for distribution but is NOT just a Node module - it's a standalone JavaScript runtime.

**Installation command:**
```bash
npm install -g bare
```

**What actually happens:**
1. npm installs the `bare` package to `/usr/local/lib/node_modules/bare/`
2. Creates symlink `/usr/local/bin/bare` pointing to the package
3. Package contains:
   - Platform-specific native binary (`bare-runtime-linux-x64/bin/bare` - ELF 64-bit executable)
   - Node.js bootstrap wrapper (launches the native binary)
   - Bundled core modules (bare-fs, bare-process, bare-events, etc.)

**Architecture insight:**
- The `bare` command is a Node.js script (`#!/usr/bin/env node`)
- It spawns the actual Bare runtime binary using `bare-runtime/spawn`
- Node is ONLY used to launch Bare, not to run it
- Once launched, Bare runs its own JS engine (V8/JavaScriptCore/QuickJS)

**Clever design:** Uses npm ecosystem for easy cross-platform distribution while remaining a standalone runtime.

### Installation Details

**Version installed:** v1.24.2 (as of 2025-11-14)

**Installation steps:**
```bash
# Global installation
npm install -g bare

# Verify installation
bare --version
# Output: v1.24.2
```

**Installation time:** ~26 seconds (6 packages added)

**Platform tested:** Linux x86-64 (WSL2)

**Prerequisites:** Node.js and npm (for installation only, not runtime)

**Installation complexity:** Very simple - single npm command

### File Structure

```
/usr/local/lib/node_modules/bare/
├── bin/bare                    # Node.js wrapper script
├── node_modules/
│   ├── bare-runtime/           # Runtime launcher
│   ├── bare-runtime-linux-x64/ # Platform-specific binary
│   │   └── bin/bare            # Actual native ELF executable
│   ├── bare-fs/                # File system module
│   ├── bare-process/           # Process module
│   ├── bare-events/            # Events module
│   └── [20+ other bare-* modules]
├── package.json
└── README.md
```

### Uninstallation

```bash
npm uninstall -g bare
```

---

## 2. Documentation & Community

### Official Documentation

**Main website:** https://bare.pears.com/
**GitHub:** https://github.com/holepunchto/bare
**npm:** https://www.npmjs.com/package/bare

**Documentation found:**
- README on GitHub (good overview, basic examples)
- Pears documentation site (more comprehensive)
- API references for individual bare-* modules

**Documentation quality:**
- Getting started: Good (clear installation, basic usage)
- API reference: Distributed across module repos (bare-fs, bare-module, etc.)
- Examples: Basic examples available
- Completeness: Moderate - need to navigate multiple repos for full picture

### Community

**Maintained by:** Holepunch team
**License:** Apache-2.0
**Activity:** Recently updated (v1.24.2 released recently)
**Ecosystem:** 78+ packages using bare-fs, suggesting active ecosystem

**Community resources:**
- GitHub issues/discussions
- Associated with Pears platform (P2P applications)
- Part of larger Holepunch ecosystem

### Where to Get Help

- GitHub issues: https://github.com/holepunchto/bare/issues
- Module-specific repos for detailed API questions
- Pears documentation for broader context

---

## 3. Library Ecosystem

### Minimal Core Philosophy

**Bare provides NO standard library beyond:**
- Core JavaScript API (Object, Array, Promise, etc.)
- `Bare` global namespace (platform info, lifecycle)
- Module system (CommonJS + ESM)

**Everything else requires external modules.**

### Essential Bundled Modules

When you install `bare` globally, core modules come bundled:

**File System:**
- `bare-fs` - File system operations (read, write, stat, etc.)

**Process:**
- `bare-process` - Process information and control
- `bare-env` - Environment variables
- `bare-subprocess` - Spawn child processes

**System:**
- `bare-os` - Operating system information
- `bare-path` - Path manipulation
- `bare-url` - URL parsing

**I/O:**
- `bare-stream` - Stream operations
- `bare-pipe` - Pipe operations
- `bare-tty` - TTY operations

**Events:**
- `bare-events` - Event emitter
- `events-universal` - Universal events

**Other:**
- `bare-module-resolve` - Module resolution
- `bare-signals` - Signal handling
- `bare-hrtime` - High-resolution time
- `bare-semver` - Semantic versioning

### Using Bare Modules

**In project-specific code:**
```bash
npm install bare-fs
```

**In code:**
```javascript
const fs = require('bare-fs')
// or
import fs from 'bare-fs'
```

### npm Compatibility

**Yes, npm works with Bare!**
- Can use `npm install` in Bare projects
- Can use npm packages (if they don't rely on Node-specific APIs)
- Bare modules distributed via npm

**Tested:**
- Created package.json with `npm init -y`
- Installed bare-fs with `npm install bare-fs`
- Works exactly like Node.js workflow

### Library Discovery

- npm registry: Search for "bare-" packages
- Holepunch GitHub org: https://github.com/holepunchto
- Pears documentation for recommended modules

### Ecosystem Maturity

**Observations:**
- Core modules well-maintained (Holepunch team)
- Focused on P2P/networked applications
- Smaller ecosystem than Node.js
- Quality over quantity approach

---

## 4. Development Workflow

### Running Bare Programs

**Basic execution:**
```bash
bare script.js
```

**With arguments:**
```bash
bare script.js arg1 arg2
```

**Inline evaluation:**
```bash
bare -e "console.log('Hello')"
bare -p "2 + 2"  # Print result
```

**REPL (interactive mode):**
```bash
bare
# Opens interactive Bare REPL
```

### Command Line Options

**Available flags:**
- `--version` or `-v` - Display version
- `--eval` or `-e <script>` - Execute inline code
- `--print` or `-p <script>` - Run code and print result
- `--inspect` - Activate debugger
- `--help` or `-h` - Show help

### Error Messages

**Quality:** Clear and helpful

**Example error (missing module):**
```
Error: Cannot find module 'bare-fs'
```

**Stack traces:** Standard JavaScript stack traces work

### Debugging

**Inspector available:**
```bash
bare --inspect script.js
```

**Note:** Haven't tested full debugging workflow yet

### Development Iteration

**Speed:** Fast
- Bare startup time feels instant
- Edit-run cycle is quick
- No build step needed for simple scripts

**Workflow:**
1. Edit JavaScript file
2. Run `bare script.js`
3. See results immediately

---

## 5. Module System

### Module Format Support

**Both CommonJS and ESM supported!**

**CommonJS example:**
```javascript
// CommonJS works with .js extension
const fs = require('bare-fs')
module.exports = { something }
```

**ESM example:**
```javascript
// ESM requires .mjs extension
import fs from 'bare-fs'
export { something }
```

**Tested:**
- ✓ CommonJS confirmed working (used in examples with .js extension)
- ✓ ESM confirmed working (requires .mjs file extension)
- ✓ Top-level await works in .mjs files

**Key finding:** ESM requires .mjs extension. Using `import` in .js files throws "Cannot use import statement outside a module" error.

### Module Resolution

**Uses standard Node.js-style resolution:**
- Looks in `node_modules/`
- Follows package.json
- Supports bare-module-resolve package for custom resolution

**Module loading:** Uses `Module.load()` internally

---

## 6. Testing

**Framework availability:** Not explored yet
**Self-testing approach:** Easy to implement

**Self-testing pattern used in examples:**
```javascript
// Validate results
if (readContent !== expectedContent) {
  console.error('FAIL:', description)
  Bare.exit(1)
}
console.log('✓ Test passed')
```

**Works well for simple validation.**

---

## 7. Code Compatibility

### JavaScript Features Tested

**✓ Modern JavaScript works:**
- `const`/`let` declarations ✓
- Arrow functions ✓
- Template literals ✓
- async/await ✓
- Promises ✓
- Destructuring ✓ (used in code, no issues)

**Example tested:**
```javascript
const testContent = 'Hello from Bare file system!\nLine 2'
await fs.writeFile(testFile, testContent)
const readContent = await fs.readFile(testFile, 'utf8')
```

**All modern syntax works without issues.**

### Compatibility with Node

**Can write very similar code to Node:**
- Same async/await patterns
- Similar module system (require/import)
- Similar API structure (bare-fs mirrors Node fs)

**Differences:**
- Must explicitly install modules (bare-fs vs built-in fs)
- `Bare` global instead of some Node globals
- Smaller API surface

---

## 8. Core APIs

### Bare Global Namespace

**Always available:**

```javascript
Bare.platform   // 'linux', 'darwin', 'win32', 'android', 'ios'
Bare.arch       // 'x64', 'arm64', 'arm', 'ia32', 'mips', 'mipsel'
Bare.version    // 'v1.24.2'
Bare.pid        // Process ID (number)
Bare.argv       // Command line arguments (array)
Bare.exit([code]) // Exit immediately
```

**Example output:**
```
Platform: linux
Architecture: x64
Bare version: v1.24.2
Process ID: 132431
Arguments: ['/usr/local/lib/.../bare', '/path/to/script.js']
```

### Console

**Built-in console works:**
```javascript
console.log('message')
console.error('error message')
```

**No library needed - console is built-in.**

### Timers

**Built-in timer functions (no library needed):**
```javascript
// setTimeout - execute once after delay
setTimeout(() => {
  console.log('Executed after 100ms')
}, 100)

// setInterval - execute repeatedly
const intervalId = setInterval(() => {
  console.log('Tick')
}, 50)

// clearInterval - stop interval
clearInterval(intervalId)

// clearTimeout also available
```

**Tested:**
- ✓ setTimeout works
- ✓ setInterval works
- ✓ clearInterval works
- ✓ Timers integrate with event loop properly

**All work exactly like Node.js/browser timers.**

### File System (bare-fs)

**Requires:** `npm install bare-fs`

**Promise-based API:**
```javascript
const fs = require('bare-fs')

// Write file
await fs.writeFile('file.txt', 'content')

// Read file
const content = await fs.readFile('file.txt', 'utf8')

// Get stats
const stats = await fs.stat('file.txt')
console.log(stats.size, stats.isFile(), stats.isDirectory())

// Delete file
await fs.unlink('file.txt')
```

**Tested operations:**
- ✓ writeFile
- ✓ readFile (with encoding)
- ✓ stat (file info)
- ✓ unlink (delete)

**All work as expected.**

### Streams (bare-stream)

**Requires:** `npm install bare-stream`

**Provides Readable and Writable streams:**
```javascript
const { Readable, Writable } = require('bare-stream')

const readable = new Readable({
  read() {
    this.push('data')
    this.push(null) // End stream
  }
})

readable.on('data', chunk => {
  console.log('Received:', chunk.toString())
})

readable.on('end', () => {
  console.log('Stream ended')
})
```

**Tested:**
- ✓ Readable streams work
- ✓ Event emitters work ('data', 'end' events)
- ✓ Stream API similar to Node.js

### Environment Variables

**Not built-in - requires bare-env module**

To access environment variables, install `bare-env` module (not tested yet).

### Lifecycle Events

**Bare emits lifecycle events:**
- `beforeExit` - Loop has no pending work
- `exit` - Process termination
- `uncaughtException` - Unhandled error
- `unhandledRejection` - Unhandled promise rejection

**Not tested yet.**

---

## 9. Performance & Runtime Characteristics

### Startup Time

**Measured:** ~246ms (real time) for simple script
```bash
$ time bare -e "console.log('Quick startup')"
real    0m0.246s
user    0m0.202s
sys     0m0.042s
```

**Assessment:** Very fast - under 250ms cold start
**Feels instant** in interactive development

### Execution Speed

**Benchmark results (basic operations):**

1. **Array operations (1M iterations):**
   - Duration: 72ms
   - Throughput: ~13.8M ops/sec

2. **Object creation (100K objects):**
   - Duration: 47ms
   - Throughput: ~2.1M objects/sec

3. **String concatenation (100K iterations):**
   - Duration: 3ms
   - Throughput: ~33M ops/sec

**Assessment:** Excellent performance for basic JavaScript operations
**Comparable to Node.js** for CPU-bound tasks

### Memory Footprint

**Not measured yet** (would need process monitoring tools)

### Performance Summary

**Strengths:**
- ✓ Fast startup (<250ms)
- ✓ Excellent CPU performance
- ✓ Efficient for JavaScript-heavy workloads
- ✓ No noticeable lag in development

**No performance issues observed in testing.**

---

## 10. Developer Experience

### Build Tools

**Not explored yet**

### Package.json

**Works normally:**
```bash
npm init -y
npm install bare-fs
```

**Standard npm workflow applies.**

### Project Structure

**No special conventions required:**
- Write .js files
- Install dependencies with npm
- Run with `bare script.js`

**Very similar to Node.js projects.**

### What Surprises Node Developers

**Positive surprises:**
- Installation is trivial (npm install -g bare)
- Very similar to Node.js development
- Modern JavaScript works out of the box
- npm ecosystem compatible

**Potential surprises:**
- Must install modules explicitly (no built-in fs, etc.)
- Smaller ecosystem than Node
- Different global namespace (Bare vs process/global)

### Overall Developer Experience

**Rating:** Excellent for simple exploration

**Ergonomics:**
- Easy to get started
- Familiar workflow (npm, modern JS)
- Fast iteration
- Clear errors

**Pain points so far:** None encountered

---

## 11. Platform Detection

### Detecting Bare Runtime

**Reliable method:**
```javascript
if (typeof Bare !== 'undefined') {
  console.log('Running on Bare')
  console.log('Platform:', Bare.platform)
} else {
  console.log('Not running on Bare (probably Node)')
}
```

**The `Bare` global is unique to Bare runtime.**

### Feature Detection Alternative

**Could also detect by checking for Bare-specific module:**
```javascript
try {
  require.resolve('bare-fs')
  console.log('Bare modules available')
} catch {
  console.log('Not Bare environment')
}
```

**But `typeof Bare` check is cleaner and more reliable.**

---

## Examples Created

All examples are self-testing and located in `examples/` folder:

### 01-hello-world.js
- Tests basic Bare execution
- Validates Bare global namespace
- Outputs platform information

### 02-file-operations.js
- Tests bare-fs module (CommonJS require)
- Write/read/stat/delete operations
- Self-validates content matches

### 03-esm-modules.mjs
- Tests ESM import/export (.mjs extension required)
- Uses bare-fs with ESM syntax
- Validates ESM and top-level await work

### 04-timers-process.js
- Tests setTimeout, setInterval, clearInterval
- Tests Bare global namespace (platform, pid, argv, version, arch)
- Self-validates timer execution

### 05-performance-test.js
- Benchmarks array operations (1M iterations)
- Benchmarks object creation (100K objects)
- Benchmarks string concatenation (100K iterations)
- Reports throughput metrics

### 06-streams-demo.js
- Tests bare-stream Readable streams
- Tests event emitters ('data', 'end' events)
- Self-validates chunks received

**All examples run successfully on Bare v1.24.2.**

---

## Summary of Key Findings

### Installation
- ✅ Trivial installation via npm
- ✅ Cross-platform support (platform-specific binaries)
- ✅ Clever architecture (npm distribution, native runtime)

### Development
- ✅ Familiar npm workflow
- ✅ Fast iteration, no build step
- ✅ Modern JavaScript fully supported
- ✅ async/await, Promises work perfectly

### Ecosystem
- ⚠️ Requires explicit module installation (minimal core)
- ✅ npm compatible
- ✅ Core modules well-maintained
- ⚠️ Smaller ecosystem than Node

### APIs
- ✅ Console built-in
- ✅ Timers built-in (setTimeout, setInterval)
- ✅ File system available (bare-fs)
- ✅ Streams available (bare-stream)
- ✅ Similar API structure to Node
- ✅ Easy platform detection (Bare global)

### Compatibility
- ✅ Can write very similar code to Node
- ✅ Module system: CommonJS (.js) + ESM (.mjs)
- ✅ Modern JavaScript fully supported
- ⚠️ Different globals (Bare vs process/global)
- ⚠️ ESM requires .mjs extension

### Performance
- ✅ Fast startup (~246ms cold start)
- ✅ Excellent CPU performance (comparable to Node)
- ✅ Efficient for JavaScript-heavy workloads

---

## Questions Answered

**✅ How is Bare installed?**
- Via npm, installs native binary + Node wrapper

**✅ Platform support?**
- Linux confirmed (x86-64), Mac/Windows supported via platform packages

**✅ Documentation quality?**
- Good for getting started, moderate for deep dives

**✅ Library ecosystem?**
- Minimal core, explicit modules, npm compatible

**✅ Development workflow?**
- Excellent - fast, familiar, modern JS works

**✅ Code compatibility?**
- High - similar to Node with minor differences

**✅ Platform detection?**
- Easy - check for `Bare` global

---

## Next Steps for Exploration

**Not yet tested:**
- Testing frameworks/assertion libraries
- Debugging workflow (--inspect flag)
- Build tools / bundlers
- More core modules (subprocess, bare-env, etc.)
- Memory usage measurement
- Error handling patterns in depth
- REPL interactive mode

**Comprehensive foundation established for Phase 2 (Platform Switching).**

---

**End of Product 1A - Bare Platform Familiarization Guide**

*Examples demonstrate concepts. Guide serves as reference for Bare development.*
