# Lessons Learned - Project 08: Dev Environment API

**Project:** 08-dev-environment-api
**Date:** 2025-11-20
**Type:** Exploration Project

---

## What Went Well

### 1. Foundation-First Approach

- Built complete 4-level module structure (Module → Package → API → Methods)
- Established executable selfeval pattern before full implementation
- 23 passing selfevals validate the pattern works
- Test runner (`run-selfevals.js`) enables autonomous validation
- One fully implemented method (`create`) proves the pattern

**Key insight:** Foundation quality > implementation quantity. The structure validates the approach.

### 2. Executable Selfeval Pattern

**Pattern established:**
- File naming: `{req_name}_selfeval*.js` with optional `{req_name}_selfeval_data.json`
- Single concern per script (minimal, complete, simple)
- Local rules apply (each node tests only itself)
- Stop-on-first-fail with focused error messages
- Version-stamped naming shows provenance

**Benefits:**
- No bureaucracy layer (script IS the test)
- Autonomous execution (test runner cascades through structure)
- Precise guidance (single concern = single clear message)
- Standalone modules (all dependencies copied into _reqs/)

### 3. Pragmatic Scope Management

- Started with 6 products in PROJECT_BRIEF
- Focused on foundation when pattern emergence showed that was the real value
- Consciously stopped at "structure complete" rather than rushing to full implementation
- Deferred implementation to next project with clear handoff

**Twin pair methodology in action:** Implementation informed what pattern was actually needed.

### 4. Schema-Driven Design

- Complete AVRO schemas for API invocation + all 7 methods
- Help metadata in schema `doc` fields (local help)
- Three-layer sandwich clarified (API state → previous output → method input)
- Pragmatic: "build what's needed, improve through use"

### 5. Req Infrastructure Evolution

**Created in this project:**
- `project_v1.3.0.md` - lightweight concept
- `blank_project_v1.1.0.md` - with phases from PRINCE2
- `exploration_project_v1.1.0.md` - collaboration modes
- `backlog_register_v1.1.0.md` - with capabilities section
- `howto_glossary_v1.0.0.md` - howto glossary req
- `create_project_v1.0.0.md` - first howto entry
- `glossary/HOWTO_GLOSSARY.md` - new glossary (user's land)

**Pattern validated:**
- Reqs have "Capabilities" section → points to howtos
- Howtos are procedures → reference stepping stones for concepts
- Glossaries are indexes → always current, point to latest req versions

---

## What Could Be Improved

### 1. Single Concern Discipline

Initially created combined selfevals checking multiple concerns. User feedback: "I prefer single concern selfevals - hence multiple per node req."

**Fix:** Split into separate scripts (e.g., `_selfeval_folders.js`, `_selfeval_files.js`)

**Lesson:** Single concern enables precise error messages. Stop-on-first-fail pattern needs focused failures.

### 2. Local Rules Understanding

First API node selfeval checked child nodes. User feedback: "you should not check for _reqs on any other node than current node... each node tests only itself."

**Fix:** Changed to only check current node, let children run their own selfevals

**Lesson:** Local rules apply - execution cascades, but each level validates itself only.

### 3. ES Modules vs CommonJS

Attempted to use ES modules (`import`/`export`) in selfeval scripts but Node.js execution required CommonJS (`require`/`module.exports`).

**Fix:** Switched all selfevals to CommonJS pattern

**Lesson:** Runtime environment determines module format. Check execution context first.

### 4. Glossary Organization

Had `api_method` and `api_overview` in stepping stones glossary. User feedback: "api method is api in DSL... All things have reqs, our use of api, package, api_overview etc. is locked in by req..."

**Fix:** Moved to DSL glossary as structural artifacts, not methodology patterns

**Lesson:** Distinguish structural/runtime vocabulary (DSL) from methodology concepts (stepping stones).

### 5. Glossary Ref Accuracy

Glossary entries had incomplete refs (just filenames, not full paths). User feedback: "this is a very important repository pattern, otherwise we will get lost completely and you'll have to scan search all the time"

**Fix:** All glossary Req columns now use full paths relative to repo root

**Lesson:** Glossaries are the index. If refs are incomplete or wrong, navigation breaks and AI has to resort to scanning. Full paths relative to repo root are mandatory.

---

## Key Insights

### Architectural Patterns

**1. Module Structure**
- 4 levels: Module → Package → API → Methods
- README.md as universal entry point (mutable, points to versioned reqs)
- _reqs/ contains ONLY versioned immutables + executable selfevals
- Inheritance via copying with version stamps (standalone, portable)

**2. Selfeval Inheritance**
- Types define tests, instances inherit via copying
- All selfevals live in `_reqs/` with version-stamped naming
- Test runner discovers and executes in tree order
- Each node validates only itself (local rules)

**3. API Invocation Model**
- Stateful API (default/primary pattern)
- Stateless methods (receive sandwich input)
- Three layers: API state → previous output → method input
- Priority: method input > previous output > API state
- Override is per-call only

### Partnership Patterns

**1. Collaboration ↔ Autonomy Transition**

**Rule:** Reqs quality determines execution mode
- Detailed, complete reqs → autonomous mode (just execute)
- Gaps, ambiguity, unclear reqs → collaborative mode (clarify together)

**When autonomous execution fails:**
- Question is NOT "why couldn't AI do it?"
- Question IS "where did the requirements mislead?"
- Failure is feedback on partnership quality, not executor capability
- Response: find misunderstanding → update reqs → resume autonomous

**2. Fluency as Partnership Metric**
- Low fluency (many cycles) = requirements unclear
- Not a signal to get "more powerful AI"
- Signal to improve shared understanding through better requirements
- **Partnership is king** - failures improve requirements, which improves future autonomy

**3. Friction Investigation Pattern**
- AI understood X, requirement meant Y → clarify wording
- Requirement silent on edge case → add to spec
- Assumption buried in context → make explicit
- Two requirements conflict → resolve contradiction

### Development Patterns

**1. Single Concern Principle**
- Each selfeval tests exactly ONE thing
- Minimal, complete, simple
- Focused error messages
- Perfect for stop-on-first-fail execution

**2. Version-Stamped Inheritance**
- Selfevals copied into `_reqs/` with full version in filename
- Shows provenance (which req, which version)
- Makes modules standalone
- Enables portable work packages

**3. Pragmatic Sufficiency**
- "Build what's needed, improve through use"
- Don't try to be perfect day one
- Tests validate the minimum needed
- Sufficient > perfect

---

## Recommendations for Future Projects

### For Module Development

1. **Structure first, implementation second**
   - Complete structure with selfevals validates pattern
   - One working method proves it works
   - Full implementation can follow in separate project

2. **Single concern selfevals**
   - One script = one test = one clear message
   - Makes debugging precise and fast
   - Stop-on-first-fail works perfectly

3. **Version stamps everywhere**
   - Filenames show origin and version
   - Makes inheritance explicit
   - Enables standalone modules

### For Autonomous Execution

1. **Clear selfevals enable autonomy**
   - Good tests + clear reqs = AI can execute independently
   - Stop-on-first-fail gives precise guidance
   - Test failures improve requirements

2. **Local rules pattern**
   - Each node validates only itself
   - Children test themselves
   - Execution cascades through structure

3. **Friction signals partnership gaps**
   - Many cycles = unclear requirements
   - Fix requirements, not capability
   - Tests tighten alignment

### For Requirements Work

1. **Capabilities section pattern**
   - Reqs include "what can I do" section
   - Points to howtos for procedures
   - Howtos reference stepping stones for concepts

2. **Unplanned work is valuable**
   - Req infrastructure improvements emerged from friction
   - Pattern: backlog register → capabilities → howto → stepping stones
   - Foundation work pays off immediately

3. **Glossary-first organization**
   - Four territories: Creator's (stepping stones), User's (howto), Language (DSL), Functional (spots)
   - Structural vocabulary in DSL
   - Methodology concepts in stepping stones

---

## Artifacts Created

### Requirements (Immutables)

**Module structure:**
- `module_v1.0.0.md` - Module pattern with README.md entry points
- `work_module_v1.0.0.md` - Work module type
- `spl_dev_implementation_v1.0.0.md` - Instance spec
- `api_node_v1.0.0.md` - Base API node pattern
- `api_overview_v1.0.0.md` - API overview pattern

**Method names (DSL):**
- `create_v1.0.0.md`, `install_v1.0.0.md`, `submit_v1.0.0.md`
- `cycle_v1.0.0.md`, `status_v1.0.0.md`, `extract_v1.0.0.md`, `destroy_v1.0.0.md`

**Infrastructure:**
- `project_v1.3.0.md` - Lightweight project concept
- `blank_project_v1.1.0.md` - With PRINCE2 phases
- `exploration_project_v1.1.0.md` - Collaboration modes
- `backlog_register_v1.1.0.md` - With capabilities section
- `howto_glossary_v1.0.0.md` - Howto glossary requirement
- `create_project_v1.0.0.md` - First howto

### Implementation

**Module structure:**
- Complete 4-level hierarchy (Module → Package → API → Methods)
- 23 selfevals across all levels (all passing)
- Test runner (`run-selfevals.js`) for autonomous execution
- AVRO schemas for API + all 7 methods
- `create` method fully implemented
- 6 methods stubbed with structure and selfevals

**Glossaries:**
- `glossary/HOWTO_GLOSSARY.md` - New glossary in user's land
- Updated DSL_GLOSSARY with 9 entries (api_method, api_overview, 7 method names)
- Updated STEPPING_STONES_GLOSSARY with work_package

**Bootstrap scripts:**
- `v1-deploy.sh` through `v4-deploy.sh` - Iteration progression
- `v4-cycle.sh`, `v4-destroy.sh`, `v4-all.sh` - Dev environment operations

### Documentation

- `TEMPLATE_NOTES.md` - Extensive pattern documentation
- `DAILY_LOG.md` - Complete session notes across 3 sessions
- `PRODUCT_EVALUATION.md` - Formal product assessment

---

## Metrics

- **Iterations:** 4 (v1-v4)
- **Selfevals created:** 23 (all passing)
- **Requirements created:** 15+
- **DSL entries added:** 9
- **Glossary updates:** 3 glossaries
- **Methods:** 7 defined, 1 implemented, 6 stubbed
- **Project scope:** Started with 6 products, delivered foundation for all

---

## For Project Closure Review

### CIP-014 (Comprehensive API Design)

Project 08 generated significant API design evidence:
- Help system design (metadata, queryable structure)
- Full cycle invocation pattern
- Setup folder pattern (AI delegation)
- State management across methods
- API-level vs method-level operations
- Method metadata structure
- Public vs internal method filtering

**Action needed:** Consolidate with CIP-014, move design patterns to design/ spot

### Req Infrastructure Pattern

Created pattern: backlog register → capabilities → howto → stepping stones

**Action needed:** Assess if pattern is working, refine if needed

### Collaboration ↔ Autonomy Pattern

Established clear pattern for mode switching based on requirements quality.

**Action needed:** Consider documenting as formal pattern in foundations or design docs

---

## Final Note

This exploration project delivered the **foundation for autonomous development infrastructure** rather than a complete working API. The 4-level module structure, executable selfeval pattern, and test runner prove the approach works.

**Key achievement:** Established pattern that enables:
- Clear requirements specification
- Autonomous execution with precise guidance
- Partnership quality feedback through friction
- Standalone, portable work modules

The decision to stop at "foundation complete" was correct for exploration work. Next project inherits a validated pattern ready for full implementation.

**"Partnership is king"** - the insight that friction signals partnership gaps, not capability limits, emerged as the core discovery from this project. Good selfevals + clear reqs = autonomous execution. The pattern works.
