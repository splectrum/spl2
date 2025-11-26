# Implementation Strategy

Working document for implementation patterns discovered during Project 10.

---

## Method Implementation Pattern

### Structure

```
spl/dev/clone/
├── README.json       # Type declaration (method)
├── index.js          # Implementation
└── _reqs/
    ├── spl_dev_clone_v1.0.0.md          # Natural language spec + self-eval
    └── spl_dev_clone_v1.0.0_selfeval.js # Executable test harness
```

### index.js Pattern

```javascript
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.{package}.{api}.{method}

  // Do work
  // ...

  // Set output (include stats for verification)
  spl.headers.{package}.{api}.{method}.output = {
    // results
    stats: { files, folders, size }  // for independent verification
  }

  // Complete or error
  spl.complete()  // or spl.error('message')
}
```

### Self-eval Pattern

Self-eval is a **test harness**, not a validator:
- Invokes method with test inputs
- Verifies results independently (doesn't trust method's reported output)
- Tests edge cases

**Verification approaches:**
1. **Stats comparison** - count files/folders/size, compare source vs dest
2. **Spot checks** - verify key content (e.g., package.json name/description)
3. **Edge cases** - test error conditions (destination exists, missing args)

**Independence principle:** Self-eval calculates expected results itself, doesn't rely on what the method reports.

---

## Execution Context Issue (Discovered)

**Problem:** Method runs in deployed environment, but may need bundle context.

spl/dev/clone is designed to clone the bundle (v0), but:
- Selfeval runs in deployed environment (env-xxx)
- Environment has different structure than bundle
- Clone's file list doesn't match environment

**Options:**
1. **Run selfeval from bundle root** - requires different test setup
2. **Clone is context-aware** - detects if in bundle vs environment
3. **Bundle-only method** - clone only makes sense at bundle level

**Decision:** Clone copies current location to destination, whatever that is. Stats-based tests are context-dependent - skip when context doesn't match. Other tests (custom name/description, error cases) work in any context.

---

## Stats for Verification

Output stats from methods that create/modify filesystem:

```javascript
function countStats(dir) {
  let files = 0, folders = 0, size = 0
  // recursive walk
  return { files, folders, size }
}
```

Selfeval can then:
1. Calculate expected stats (source minus exclusions)
2. Compare with actual stats
3. Allow small tolerance for dynamic content (e.g., package.json changes)

---

## Testing Learnings

1. **Lib resolution requires deployed environment** - `import { createSpl } from 'lib/core.js'` needs symlinks
2. **Selfeval location matters** - running from wrong directory breaks context
3. **Edge case tests are valuable** - error conditions caught early

---

## Open Questions

1. How should bundle-level methods (clone, deploy) differ from runtime methods?
2. Should selfeval run in bundle context or environment context?
3. How to test without full deploy cycle?

---

**Last Updated:** 2025-11-26
