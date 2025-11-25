# Lessons Learned - Project 09

**Date:** 2025-11-26

---

## Project Summary

**Original goal:** Convert Console v4 to stream-native execution
**Actual outcome:** Dev environment foundation with type hierarchy and selfeval inheritance

The project pivoted from API migration to establishing foundational patterns. This was valuable but different from the original scope.

---

## Methodology

### Exploration Projects Can Pivot

The project started with clear products (Event Schema, Console Handler, etc.) but exploration led to foundational work instead. This is okay - exploration is about discovery. The key is recognizing when to regroup.

**Learning:** When scope diverges significantly, close the project cleanly and create a follow-on rather than forcing original products.

### Twin Pair Still Works

Even though we pivoted, the twin pair methodology (build + learn) produced valuable patterns:
- Type hierarchy emerged from implementation
- Overlay pattern emerged from needing inherited selfevals
- Lib resolution emerged from wanting clean imports

**Learning:** Discovery through building works even when destination changes.

### Iteration Structure Helps

The v0/v1.0/v1.1 structure allowed experiments without losing working state:
- v1.0 captured fire-and-forget pattern
- v1.1 became the working iteration
- v0 evolved into reusable template

**Learning:** Cheap iterations enable experimentation with safety net.

---

## Technology

### ES Modules Throughout

Committed to ES modules for all code. Required converting CommonJS files mid-project.

Key patterns:
- `import { fileURLToPath } from 'url'` for __dirname
- `import * as data from './data.js'` for namespace imports
- `import.meta.url` for entry point detection

**Learning:** Decide module format early and stick with it.

### Symlinks for Lib Resolution

Three-layer pattern works well:
1. Source: `work_module/_lib/core.js`
2. Symlink: `lib/core.js` → source
3. Re-export: `node_modules/lib/core.js`

Methods get clean imports without path traversal.

**Learning:** Symlinks + re-exports can bridge Node's module resolution with custom structures.

### WSL2 Limitations

`fs.watch({recursive:true})` doesn't work on WSL2. Used polling instead (100ms interval).

**Learning:** Test on target platform early; workarounds may be needed.

---

## Architecture

### Type Hierarchy as Declaration

Types declare inheritance in README.json:
```json
{ "type": "method", "extends": "module_node" }
```

Hierarchy built dynamically at prepare time, not hardcoded.

**Learning:** Declaration-driven structure scales better than hardcoded relationships.

### Overlay for Inheritance

Two operations cover most needs:
- `selectFile()` - first match wins (implementations)
- `collectAll()` - accumulate from all layers (selfevals, requirements)

Layer order matters: work_module ancestors first, then type chain.

**Learning:** Simple overlay operations + clear layer order = powerful inheritance.

### Selfevals as Structural Validation

Type selfevals validate structure:
- module_node selfeval: underscore folders in type, non-underscore are instances
- Runs on every node of that type automatically

**Learning:** Inherited selfevals provide consistent validation without repetition.

### Kafka-Style Event Records

Headers namespaced by API path:
- `headers.spl.runtime` - cross-cutting
- `headers.spl.request` - lifecycle
- `headers.pr09.console.hello` - method input

Value remains direct (not namespaced).

**Learning:** Namespace headers by responsibility; keep value simple.

---

## Process

### Backlog Item Removal

Discovered that backlog items should be removed when project is created, not at closure. We missed this for Project 09.

**Learning:** Add to project creation checklist.

### Dev Bundle Cloning

New projects should clone v0 dev bundle. This is now a procedural step.

**Learning:** Capture in howto glossary (create_project update or new dev bundle howtos).

### Safe Bash Deletes

Never `rm -rf` while cwd is inside target directory. Use absolute paths or cd out first.

**Learning:** Wrap dangerous operations in safe abstractions (future: install API will handle this).

---

## Risks Assessment

| Risk | Outcome |
|------|---------|
| R1: Event metadata insufficient | **Inconclusive** - Not fully tested, structure defined |
| R2: Self-evals too weak | **Mitigated** - Inherited selfevals work well for structure |
| R3: Free scripting constrained | **Not tested** - Didn't reach real usage |
| R4: Handler pattern complex | **Mitigated** - Handler daemon works simply |
| R5: Storage abstraction leaks | **Not tested** - Stayed with JSON files |
| R6: Approach B doesn't deliver | **Inconclusive** - Foundations laid, not validated |

Most risks deferred to follow-on project where actual API work will test them.

---

## Key Artifacts

| Artifact | Value |
|----------|-------|
| `dev/v0/` | Reusable dev environment template |
| `TYPE_HIERARCHY_OVERLAY_DESIGN.md` | Architecture roadmap |
| `LIB_RESOLUTION_PATTERN.md` | Lib resolution design |
| `OVERLAY_EXTRACTION_PATTERN.md` | Overlay pattern |
| `dev modules_v1.0.0.md` | Stepping stone created |

---

## Recommendations for Follow-On

1. **Start from v0** - Clone, don't rebuild
2. **Build real APIs** - Test the patterns with actual functionality
3. **Keep arithmetic exercises** - Useful for validating core patterns
4. **Validate risks** - Original risks need testing with real usage
5. **Formalize howtos** - Dev bundle procedures should be in howto glossary
