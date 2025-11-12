**Type:** Project Addon
**Parent Project:** Bare Runtime Hello World
**Status:** Backlog

---

# Import Resolution Experiment (Project Addon)

## Purpose

Compare two import resolution approaches in Bare runtime context to determine best pattern for SPL2: package aliases (build-time) vs dynamic importModule function (runtime). Evidence-based decision making.

---

## Background

Project 03 (Runtime Structure Hello World) identified that methods importing auxiliary libraries with relative paths (`../../_utils/index.js`) is fragile and ugly.

**Two approaches explored:**

**Approach 1: Package aliases (implemented in runtime-poc)**
- Build script creates package directories in `node_modules/`
- Each alias: package.json + index.js that re-exports from actual location
- Clean imports: `import { generateUUID } from 'spl_utils'`
- Overhead: Build step, package files to maintain
- Benefit: Clean readable imports, no path traversal

**Approach 2: Dynamic importModule function (proposed for Bare)**
- Auxiliary function: `importModule(modulePath)` resolves and imports
- Usage: `const { generateUUID } = await importModule('spl/_utils')`
- Zero overhead: No build step, no extra files
- Centralized resolution logic (one place to change)
- Platform-aware resolution potential
- Clean module references without `../../` ugliness

**Decision:** Implement both in different contexts, compare based on evidence, standardize on best approach.

---

## What This Addon Explores

**In context of Bare Runtime Hello World project:**

1. **Implement importModule function approach**
   - Create `importModule(modulePath)` resolution function
   - Resolve module paths to actual file locations
   - Handle platform-specific paths if needed
   - Integrate with Bare's module system

2. **Convert auxiliary library imports**
   - Refactor methods to use `importModule('spl/_utils')`
   - Test in Bare runtime environment
   - Validate clean import syntax

3. **Compare approaches in practice**
   - Package aliases (Node.js runtime-poc) vs importModule (Bare)
   - Developer experience: Which is cleaner to write?
   - Maintenance: Which is easier to manage?
   - Debugging: Which provides better error messages?
   - Build complexity: Which adds less overhead?
   - Platform compatibility: Which works better across Node/Bare?

4. **Gather evidence**
   - Pain points with each approach
   - Benefits of each approach
   - Performance implications (if measurable)
   - Integration complexity

5. **Make recommendation**
   - Based on actual usage experience
   - Consider: simplicity, maintainability, platform compatibility
   - Recommend standardization on one approach for SPL2

---

## Success Criteria

**Addon complete when:**

1. ✅ importModule function implemented and working in Bare context
2. ✅ Auxiliary library imports using importModule in Bare project
3. ✅ Both approaches tested in real development scenarios
4. ✅ Evidence gathered on pros/cons of each
5. ✅ Clear recommendation documented with rationale
6. ✅ Decision: Standardize on approach X because of evidence Y

---

## Deliverables

**Code:**
- `importModule(modulePath)` implementation for Bare
- Refactored imports using importModule pattern
- Working examples in Bare Runtime Hello World

**Documentation:**
- Comparison document: Package aliases vs importModule
- Pros/cons of each approach (from actual experience)
- Evidence gathered during development
- Recommendation with rationale
- Migration guide if standardizing on different approach than Node.js runtime-poc

---

## Integration with Parent Project

**Bare Runtime Hello World scope:**
- Primary: Validate Bare basics (installation, execution, workflow)
- Addon: While working in Bare, implement and test importModule approach

**Addon enhances parent:**
- Improves import ergonomics in Bare hello world
- Provides evidence for architectural decision
- Doesn't block parent project completion (can be done in parallel)

**Addon independence:**
- Can be deferred if parent project reveals Bare blockers
- Can be completed after parent if capacity limited
- Should be done while context fresh (during Bare work)

---

## Technical Approach

**importModule implementation:**
```javascript
// Example implementation (refine based on Bare specifics)
async function importModule(modulePath) {
  // Resolve: 'spl/_utils' -> '{basePath}/spl/_utils/index.js'
  const resolvedPath = resolveModulePath(modulePath);

  // Dynamic import
  const module = await import(resolvedPath);

  return module;
}
```

**Usage in methods:**
```javascript
// Before (ugly relative paths)
import { generateUUID } from '../../_utils/index.js';

// After (clean importModule)
const { generateUUID } = await importModule('spl/_utils');
```

**Comparison criteria:**
- Code readability
- Ease of refactoring (moving modules around)
- Error messages quality
- Build/setup complexity
- Performance (negligible, but measure if possible)
- Platform compatibility
- Debugging experience
- Learning curve for developers

---

## Notes

**Evidence-based methodology in action:**
- Don't speculate which approach is better
- Implement both in real contexts (Node vs Bare)
- Gather evidence through actual use
- Decide based on experience, not theory

**Explorative project pattern:**
- Addon discovered during Project 03 (not planned upfront)
- Validates twin pair skipping flexibility (can adjust on evidence)
- Fits naturally with Bare Runtime Hello World work

**No pressure to complete:**
- Addon enhances but doesn't block parent project
- If Bare work reveals other priorities, defer this
- Optimal: Complete while in Bare context (fresh experience)

---

## Expected Outcome

**One of:**
1. **Standardize on package aliases** - Evidence shows build-time resolution cleaner despite overhead
2. **Standardize on importModule** - Evidence shows runtime resolution simpler and more flexible
3. **Use both contextually** - Evidence shows each has optimal use cases (rare, but possible)

**Documentation updated:**
- API_DESIGN.md with standard import pattern
- Migration guide if switching approaches
- Template updates for future projects

**Confidence:**
- Architectural decision backed by real-world evidence
- No speculation, just experience
- Pattern proven in both Node.js and Bare contexts
