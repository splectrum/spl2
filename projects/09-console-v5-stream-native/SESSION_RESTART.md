# Session Restart Guide - Project 09

**Last Updated:** 2025-11-25

---

## Current Status

**Project:** Console v5 Stream Native (Exploration)

**Phase:** Product Twin 1 - Building Blocks Exploration
**Stage:** V0 model dev env foundation in progress

---

## Where We Are

**Iteration 1.0:** Complete ✅
- Fire-and-forget + handler daemon pattern validated
- ES modules conversion complete
- Full cycle tests passing (4/4)
- Extraction mechanism added

**V1.1 Preparation:** Design complete, implementation ready to start
- Complete type hierarchy design documented
- Overlay + extraction pattern defined
- Dev modules stepping stone created
- V0 model dev env structure started

**Next:** Populate v0 model dev env, then begin v1.1 iteration

---

## V0 Model Dev Env (Current Focus)

**Location:** `projects/09-console-v5-stream-native/dev/v0/`

**Purpose:** Always-current, portable, self-contained development environment template

**Current state:**
```
dev/v0/
├── docs/                       # ✅ Created with clean req files
│   ├── modules.md              # Generic filename, version in post-amble
│   └── dev modules.md          # Generic filename, version in post-amble
├── modules/                    # ✅ Created, needs population
│   └── types/                  # ⏸ Empty - needs node type folders
├── implementation/pr09/        # ✅ Exists from v1.0
├── install/                    # ✅ Exists
├── package.json                # ✅ Exists
└── deploy.js, test.js, etc.   # ✅ Exist
```

**To complete v0:**
1. Create node type folders: modules/types/{api_node, package, api, api_method}/
2. Write requirements for each node type
3. Create modules/_index.json (layer ordering)
4. Update v0/README.md (model dev env explanation)
5. Update status/CURRENT.md (note v0 location)

---

## Major Design Artifacts

**All in project root:**

1. **OVERLAY_EXTRACTION_PATTERN.md**
   - Multi-layer overlay resolution
   - Progressive refinement with defaults
   - Extract merges layers for deployment

2. **TYPE_HIERARCHY_OVERLAY_DESIGN.md**
   - Complete architecture roadmap
   - Type hierarchy: api_node (base) with siblings
   - Declaration-driven resolution
   - Hierarchy map: one search sequence per node
   - Two operations: selectFile() + collectAll()

3. **PRACTICAL_PATTERNS.md**
   - File naming & versioning patterns
   - Bundle documentation strategy
   - Glossary conventions
   - Version post-amble pattern

4. **DATA_VS_LANGUAGE.md**
   - Mycelium vs DSL distinction
   - Data structures vs operators
   - Uniform naming pattern
   - Foundational understanding

5. **dev modules_v1.0.0.md**
   - Stepping stone (also in glossary)
   - Type-aware modules for dev environments
   - Extends base modules pattern

**Status:** All committed and pushed

---

## Key Design Decisions

### 1. V0 as Always-Current Model

- Lives in latest project
- Update as patterns evolve
- Portable, self-contained
- Clone for new iterations

### 2. Overlay Resolution Strategy

**Two operations:**
- **selectFile():** First match wins (get implementation, fall back to defaults)
- **collectAll():** Accumulate from all layers (get all self-evals/requirements)

**Layer structure:**
- Layer 0: types/ (node type definitions)
- Layers 1..n-1: named base modules (by package)
- Layer n: work module (project-specific)

### 3. File Naming Conventions

**External (stepping stones):** Versioned filenames
- `dev modules_v1.0.0.md`
- Referenced in glossaries

**Internal (bundles):** Generic filenames
- `dev modules.md`
- Version in post-amble: `**Version:** 1.0.0`
- Stable references, no link breakage

### 4. Glossary Separation

**Stepping stones:** Space separator
- `dev modules`, `base module`
- Methodology/dev concepts
- Test: "Only exists during development"

**DSL:** Underscore separator
- `api_node`, `api_method`
- Runtime vocabulary
- Test: "Exists at runtime"

### 5. Data vs Language

**Mycelium:**
- Data structures (`api_node`, `package`, etc.)
- Data change events (DCE)
- The "what" that flows

**DSL:**
- Operators/methods (`spl/api_node/`, `spl/package/`, etc.)
- Generate/process events
- The "how" that executes

**Uniform pattern:** Data structure name = API name

---

## Next Session Tasks

### Immediate: Complete V0 Model Dev Env

1. **Create node type folders:**
   ```bash
   cd dev/v0/modules/types
   mkdir api_node package api api_method
   ```

2. **Write requirements for each node type:**
   - api_node (base type, no extends)
   - package (extends api_node)
   - api (extends api_node)
   - api_method (extends api_node)
   - Each with: _reqs/ folder, req file, basic self-eval

3. **Create modules/_index.json:**
   ```json
   {
     "layers": [
       { "name": "types", "type": "types" }
     ]
   }
   ```

4. **Update status/CURRENT.md:**
   Add highly visible note about v0 model dev env location

5. **Update v0/README.md:**
   Explain model dev env concept, structure, usage

### Then: Begin V1.1 Iteration

6. Clone v0 to v1.1
7. Implement namespace structure work:
   - ExecutionContext wrapper
   - Handler using context
   - Structured event format
   - Handler-specific hives

---

## Important Files to Review

**On restart:**
1. This file (SESSION_RESTART.md)
2. DAILY_LOG.md (session 4 entries)
3. TYPE_HIERARCHY_OVERLAY_DESIGN.md (complete architecture)
4. PRACTICAL_PATTERNS.md (working patterns)
5. DATA_VS_LANGUAGE.md (foundational understanding)

**For implementation:**
6. dev/v0/docs/dev modules.md (dev-specific overlay system)
7. dev/v0/docs/modules.md (base layer management)
8. PROJECT_PLAN.md (v1.1 scope)

---

## Questions Resolved

1. **Where does model dev env live?**
   - In latest project: `projects/09-.../dev/v0/`
   - Always current, update as we evolve

2. **How to reference req files?**
   - Glossary: versioned (`dev modules_v1.0.0.md`)
   - Bundles: generic (`dev modules.md`)
   - Version in post-amble internally

3. **What goes in v0/docs/ vs project root?**
   - v0/docs/: Clean req files only (distilled summaries)
   - Project root: Working documents (will be distilled at closure)

4. **Module vs DSL terms?**
   - module/modules: Stepping stones (dev-only)
   - api_node/etc: DSL (runtime vocabulary)

5. **Naming conventions?**
   - Stepping stones: space separator
   - DSL: underscore separator
   - URI parts: forward slash separator

---

## Critical Patterns

**Progressive Refinement:**
- Work module can start minimal
- Overlay provides defaults
- Tests run with base implementations
- Gradually override specifics
- Extract produces complete module

**Declaration-Driven:**
- Types declare "Extends: api_node"
- Instances declare "Instance of: api_method"
- Hierarchy map built from declarations
- Validated upfront on env creation

**Uniform DSL:**
- Data structure name = API name
- Example: `api_node` data + `spl/api_node/` API
- Inheritance works naturally
- Clear, discoverable, low friction

---

## Status Summary

**Complete:**
- ✅ Iteration 1.0 (ES modules, tests, extraction)
- ✅ Type hierarchy design (complete roadmap)
- ✅ Overlay pattern design
- ✅ dev modules stepping stone
- ✅ V0 structure created
- ✅ Foundational understanding documented

**In Progress:**
- ⏸ V0 node type population
- ⏸ V0 documentation updates

**Next:**
- Complete v0 model dev env
- Begin v1.1 iteration
- Implement namespace structure

---

**Ready for handover:** All design complete, clear next steps, comprehensive notes captured.
