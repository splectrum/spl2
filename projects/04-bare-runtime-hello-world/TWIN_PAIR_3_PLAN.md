# Twin Pair 3 Detailed Plan: Runtime Hello World Migration

**Created:** 2025-11-14 (Execute stage - JIT planning)
**Purpose:** Migrate Project 03 runtime hello world to run on Bare platform

---

## Overview

Port actual SPL2 runtime code from Project 03 to run on both Bare and Node. Discover real migration challenges, test platform abstraction patterns in practice.

**Source:** `/home/herma/splectrum/spl2/projects/03-runtime-hello-world/runtime-poc/`

**Deliverables:**
- Product 3A: Migrated Runtime Code (deliverable - runs on both platforms)
- Product 3B: Migration Guide & Requirements (requirements)

---

## Analysis of Project 03 Code

**Current characteristics:**
- Uses ESM (import/export statements)
- Node-specific APIs: `process.exit()`, shebang `#!/usr/bin/env node`
- File path APIs: `path.resolve()`, `path.dirname()`, `fileURLToPath()`, `import.meta.url`
- Dynamic imports for module loading
- Complex structure: runtime → execution → hello world

**Migration challenges identified:**
1. ESM requires .mjs extension on Bare (or convert to CommonJS)
2. `import.meta.url` - need to check Bare support
3. `path` module - need Bare equivalent
4. `process.exit()` - need abstraction
5. Dynamic module loading - test on Bare

---

## Migration Strategy

**Approach A: Minimal Migration (Recommended)**
- Create simplified version of hello world that demonstrates core pattern
- Port key runtime mechanisms (module loading, context, API invocation)
- Keep it simple enough to run on both platforms easily
- Focus on proving the pattern works, not full feature parity

**Approach B: Full Port**
- Migrate entire Project 03 runtime
- Higher complexity, more discovery
- May hit more edge cases

**Recommendation:** Start with Approach A (minimal), expand if valuable

---

## Minimal Migration Plan

### What to Migrate

**Core components:**
1. **Module loader** - Dynamic import of methods by path
2. **Context object** - apiState, args, runtime, execution structure
3. **Simple method invocation** - Call pr03/hello/greet equivalent
4. **Platform abstraction** - Apply Twin Pair 2 patterns

**Simplified structure:**
```
examples/
  11-runtime-minimal/
    platform.js          # Platform abstraction (Bare vs Node)
    module-loader.js     # Dynamic module loading
    context.js           # Context creation
    hello-method.js      # Simple hello world method
    runtime.js           # Main entry point
```

### What to Simplify

**Remove for MVP:**
- Kafka record structure (use plain objects)
- Complex state management (basic object is enough)
- ANSI colors (keep simple console.log)
- Validation script complexity
- Full three-layer stack (two layers sufficient for proof)

**Keep essential:**
- Module path resolution
- Dynamic method loading
- Context passing
- Platform abstraction

---

## Implementation Steps

### Step 1: Create Platform Abstraction Module
Based on Twin Pair 2 patterns:
```javascript
// platform.js
module.exports = {
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code),
  // ... more as needed
}
```

### Step 2: Create Simple Module Loader
Test dynamic import on both platforms:
```javascript
// module-loader.js
async function loadMethod(modulePath) {
  const module = await import(modulePath)
  return module.default || module
}
```

### Step 3: Create Context Structure
Simplified version of Project 03 context:
```javascript
// context.js
function createContext(state = {}) {
  return {
    state,
    getState: (key) => state[key],
    setState: (key, value) => { state[key] = value }
  }
}
```

### Step 4: Create Hello Method
Simple method following SPL pattern:
```javascript
// methods/hello/index.js
module.exports = async function hello(context) {
  return { message: 'Hello from SPL on ' + context.runtime }
}
```

### Step 5: Create Runtime Entry Point
Ties it all together:
```javascript
// runtime.js
const platform = require('./platform')
const loader = require('./module-loader')
const { createContext } = require('./context')

async function main() {
  const ctx = createContext({ runtime: platform.platform })
  const hello = await loader.loadMethod('./methods/hello')
  const result = await hello(ctx)
  console.log(result.message)
  platform.exit(0)
}
```

### Step 6: Test on Both Platforms
```bash
bare runtime.js
node runtime.js
```

---

## Key Questions to Answer

1. **Does dynamic import work on Bare?**
2. **Can we load modules by path on both platforms?**
3. **Do path resolution APIs work identically?**
4. **What breaks when migrating real SPL code?**
5. **Are there unexpected Bare limitations?**
6. **How complex is the migration in practice?**

---

## Success Criteria

**Product 3A complete when:**
- Minimal runtime runs on both Bare and Node
- Module loading works on both platforms
- Context passing works identically
- Hello world method executes successfully
- Code is platform-agnostic (uses abstraction)

**Product 3B complete when:**
- Migration patterns documented
- Challenges and solutions captured
- Requirements extracted
- Guidance for full runtime migration

---

## Completion Approach

**Iterative:**
1. Start with simplest possible version
2. Add complexity incrementally
3. Test on both platforms at each step
4. Document what works and what doesn't
5. Stop when pattern is proven (don't need full feature parity)

---

## Expected Discoveries

**Likely findings:**
- Some Node APIs need bare-* equivalents
- Dynamic import may work differently
- Path resolution might need adjustment
- Overall pattern should port successfully

**Unknown:**
- Performance of dynamic imports on Bare
- Module caching behavior
- Error handling differences
- Edge cases in module resolution

---

**Next:** Create platform abstraction and start migration
