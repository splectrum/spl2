# Projects Index

## Active Projects

| Code | Name | Status | Started |
|------|------|--------|---------|
| 10-dev-env-v0-bundle-continued | Dev Env v0 Bundle Continued | In Progress | 2025-11-26 |

## Completed Projects

| Code | Name | Completed | Key Outcomes |
|------|------|-----------|--------------|
| 01-preliminary-to-workplan | Preliminary to Workplan | 2025-11-08 | Validated foundations, established PRINCE2+TDC methodology, bootstrap pattern |
| 02-initial-workplan | Initial Workplan | 2025-11-10 | Simplified foundations, backlog structure with 9 projects, artifact-to-requirements pattern, minimal+complete practice guidance |
| 03-runtime-hello-world | Runtime Structure "Hello World" | 2025-11-12 | Core architecture validated, single-parameter method signature, platform abstraction, glossary discovery, MVP+End Vision pattern, Local Rules Apply generality |
| 04-bare-runtime-hello-world | Bare Runtime Hello World | 2025-11-14 | Bare platform validated, dual-platform patterns, three-pillar strategy, platform abstraction architecture, novel contribution to Bare ecosystem |
| 05-foundation-update-documentation-templates | Foundation Update & Documentation Templates | 2025-11-17 | Foundation headline format, design/ spot established, friction as dynamic KPI, AI-primary execution model, Blank Project type created |
| 06-glossary-term-requirements | Glossary Term Requirements | 2025-11-18 | 67+ term reqs (24 DSL, 35+ Stepping Stones, 8 Spots), unified 3-column glossary structure, base concepts (api_node, activity, spot), extends pattern with term names |
| 07-console-api-exploration | Console API - AI-Primary Execution Model | 2025-11-19 | v7 console wrapper (5 methods), 3 design docs, schema-driven merge, boundary validation, self-eval harness, status/ spot, Dev Env API + AVRO Wrapper + CIP Processing backlog items, CIP-015 |
| 08-dev-environment-api | Dev Environment API | 2025-11-20 | 4-level module structure, executable selfeval pattern, test runner, AVRO schemas (API + 7 methods), native vs wrapper API convention, delegation stepping stone, work package pattern |
| 09-console-v5-stream-native | Console v5 Stream Native | 2025-11-26 | v0 dev env template, type hierarchy design, lib resolution pattern, selfeval inheritance, event record structure (pivoted from Console migration to dev env foundation) |

## Planned Projects

| Code | Name | Description | Priority |
|------|------|-------------|----------|
| - | - | - | - |

---

## Project Details

### 01-preliminary-to-workplan
**Objective:** Establish validated foundations and working methodology (PRINCE2 + TDC)

**Products:**
1. Repository Review & Foundation Update ✅
2. Lightweight PRINCE2 Setup ✅
3. TDC Template/Framework ✅

**Status:** Complete - All products delivered and validated

**Key Learnings:**
- Bootstrap pattern for templates (don't create upfront)
- Foundation maintenance as project responsibility
- Exploration + Evidence as core pillars
- Living artifacts over static documentation

**See:** `projects/01-preliminary-to-workplan/LESSONS_LEARNED.md` for full details

### 02-initial-workplan
**Objective:** Create initial headline workplan for SPL2 development

**Project Type:** Explorative Project (4 twin pairs planned, adaptive execution)

**Products Delivered:**
1. Foundation Analysis & Restructuring ✅
2. Foundation Analysis Template ✅
3. ~~Foundation Update Methodology~~ (skipped - emerged naturally)
4. ~~Foundation Update Template~~ (skipped - emerged naturally)
5. Dependency & Priority Analysis ✅ (backlog with 9 projects)
6. Dependency & Priority Analysis Template ✅ (built into requirements)
7. ~~Headline Workplan~~ (redundant - BACKLOG.md serves this purpose)
8. ~~Workplan Template~~ (redundant - BACKLOG.md serves this purpose)

**Status:** Complete - 2 twin pairs delivered, 2 skipped as unnecessary

**Key Outcomes:**
- Foundations simplified to ~5KB (headline/detail separation)
- Backlog structure with 9 projects (execution order, priorities, dependencies)
- Artifact-to-requirements pinning pattern (mandatory for quality assessment)
- Philosophy v1.1.0 (practicing minimal+complete with concrete guidance)
- TDC v1.1.0 (artifact-to-requirements pattern documented)
- PRINCE2 v1.1.0 (backlog artifacts added)

**Key Learnings:**
- Twin pair redundancy is feature, not bug (explorative methodology validates what's needed)
- Over-engineering tendency requires active management (R07)
- "Minimal and complete" understanding vs practice gap
- Comfort with imperfection enables progress
- Table format sufficient for dependency visibility (diagrams can wait)

**See:** `projects/02-initial-workplan/LESSONS_LEARNED.md` for full details

### 03-runtime-hello-world
**Objective:** Validate SPL2's core runtime execution model through minimal "hello world" implementation

**Project Type:** Explorative Project (4 twin pairs)

**Products Delivered:**
1. Twin Pair 1: Development Setup (deployment scripts) + Deployment Template ✅
2. Twin Pairs 2-4: Comprehensive API Design Documentation ✅ (merged conceptually)
3. Platform abstraction implementation ✅
4. Module resolution (convention-based) ✅

**Status:** Complete - Core architecture validated, extensive documentation created

**Key Outcomes:**
- **Core architecture validated:** Single-parameter method signature with hierarchical context, proven execution model
- **Platform abstraction:** Pure methods with auxiliary libraries pattern established
- **API architecture comprehensive:** API_DESIGN.md documents MVP (three-layer structure, state backing, CLI invocation)
- **Glossary discovery:** Two glossaries needed (methodology concepts + API vocabulary) - foundational infrastructure
- **Method execution model:** Single context parameter, hierarchical Kafka records, access rules defined
- **MVP + End Vision pattern:** Build practical MVP, capture architectural vision, migrate when capacity/evidence exists
- **Local Rules Apply generality:** Fundamental TDC principle for ALL artifacts, not just projects
- **Embryonic → Mature pattern:** Systems evolve through stages (embryonic, transitional, mature)

**Key Learnings:**
- Local Rules Apply more general than initially recognized (fundamental TDC principle)
- Glossary is critical from day one (semantic consistency, compositional reasoning)
- Reconstruction-over-archiving requires bug report infrastructure (foundational)
- MVP + End Vision balances pragmatism with architectural integrity
- Over-engineering tendency requires ongoing vigilance (Risk R05)
- Platform abstraction from start enables portability

**Backlog Updates:**
- Added: Bug Report Infrastructure (high priority explorative project)
- Added: Foundation Update & Documentation Templates (highest priority)
- Added: Import Resolution Experiment (addon to Bare Runtime Hello World)
- Updated: CIP Register with 4 new items (CIP-005 to CIP-008)

**See:** `projects/03-runtime-hello-world/LESSONS_LEARNED.md` for comprehensive synthesis (28 lessons)

### 04-bare-runtime-hello-world
**Objective:** Validate Bare as viable platform for SPL2 runtime through exploration

**Project Type:** Explorative Project (4 twin pairs)

**Products Delivered:**
1. Twin Pair 1: Bare Platform Guide + Platform Requirements ✅
2. Twin Pair 2: Platform Switching Guide + Dual-Platform Requirements ✅
3. Twin Pair 3: Runtime Migration Guide + Migration Requirements ✅
4. Twin Pair 4: Platform Abstraction Architecture + Architecture Requirements ✅

**Status:** Complete - All 4 twin pairs delivered, Bare validated as viable platform

**Key Outcomes:**
- **Bare platform validated:** Installation trivial, performance excellent, modern JavaScript supported
- **Dual-platform patterns:** Novel contribution not documented in Bare ecosystem
- **Three-pillar strategy:** Node (dev/server), Bare (P2P/native), Browser (universal reach)
- **Platform abstraction simple:** Object wrapper, zero overhead, CommonJS for dual-platform
- **SPL2 runtime pattern platform-agnostic:** Full Project 03 migration feasible
- **Production-ready architecture:** Clear design, extensible, implementation-ready

**Key Learnings:**
- Twin pair methodology highly effective (4 pairs, all valuable)
- "Local rules apply" pattern violation discovered (runtime-minimal global install)
- Novel dual-platform patterns (original contribution to Bare ecosystem)
- CommonJS better than ESM for dual-platform code
- Zero-overhead abstraction achievable

**See:** `projects/04-bare-runtime-hello-world/LESSONS_LEARNED.md` for full details

### 05-foundation-update-documentation-templates
**Objective:** Restructure foundations based on Projects 03-04 learning, establish design documentation infrastructure

**Project Type:** Blank Project (straightforward execution, clear deliverables)

**Products Delivered:**
1. WOW.md & PRINCIPLES.md Simplification (headline format with references) ✅
2. Design/ Spot Implementation (CIP-013: DESIGN_REGISTER.md, API_DESIGN.md, CHANGELOG) ✅
3. Partnership Stepping Stones (5 terms added to STEPPING_STONES_GLOSSARY) ✅
4. CLAUDE.md Navigation Updates ✅

**Unplanned Deliverables:**
- Blank Project type created (completes project type spectrum)
- CIP-013 implemented (design spot infrastructure)
- CIP-014 created (comprehensive API design work scoped for future)
- Console API Exploration backlog item (AI-primary execution model)
- Friction incarnations documented (design + partnership contexts)

**Status:** Complete - All products delivered, foundations restructured, design infrastructure established

**Key Outcomes:**
- **Foundation headline format:** Concise entry points with references to versioned detail files
- **Friction as dynamic KPI:** Captured across design (5 types) and partnership (6 types) contexts
- **Design/ spot established:** Mutable docs with CHANGELOGs, registry for discovery, follows glossary/ pattern
- **AI-primary execution model:** Fundamental architectural decision - AI calls JavaScript functions, CLI is secondary wrapper
- **Platform vs methodology distinction:** Clear separation (design/ for platform, WOW.md for methodology)
- **CIP-driven infrastructure:** Lightweight now (CIP-013), comprehensive later (CIP-014)

**Key Learnings:**
- Friction as path-finding mechanism (not performance gap to eliminate)
- Discovery through friction (AI-primary model emerged through dialogue)
- Both perspectives valid (AI: uncomfortable, Partnership: productive)
- Unplanned deliverables natural for foundation work
- Blank Project type appropriate for clear scope work

**See:** `projects/05-foundation-update-documentation-templates/LESSONS_LEARNED.md` for comprehensive synthesis

### 06-glossary-term-requirements
**Objective:** Define requirements for glossary terms, enabling artifact-to-requirements pinning for methodology concepts

**Project Type:** Explorative Project

**Products Delivered:**
1. Plain Req Template (base req type with Spec + Self-eval + Comments) ✅
2. DSL Glossary Terms (24 reqs: api_node hierarchy, methods, properties, Kafka records) ✅
3. Stepping Stones Terms (35+ reqs: activities, completeness, collaboration, friction, autonomy) ✅
4. Spots Glossary Terms (8 reqs: spot base concept + 6 repository spots) ✅
5. ~~Spots Structure Twin Pair~~ (deferred - combine with tooling)

**Status:** Complete - 4 products delivered, 1 deferred

**Key Outcomes:**
- **67+ term requirements created:** Infrastructure for all future glossary terms
- **Unified 3-column structure:** Term | Description | Req (consistent across all glossaries)
- **Base concepts established:** api_node (DSL), activity (Stepping Stones), spot (Spots)
- **Extends pattern:** Use term names (not versions) for decoupled evolution
- **Naming conventions:** Single underscore for word boundary, double for hierarchy (DSL)
- **Activity ownership pattern:** Activity registers change with spot, spot executes

**Key Learnings:**
- Autonomy calibration per product (conceptual work needs discussion, mechanical can batch)
- Update indexes immediately (not in batches)
- Term-by-term discussion for conceptual work produces better results
- Extends with term names prevents mass reference updates on version changes

**Deferred Items:**
- Product 5: Spots Structure Twin Pair
- Housekeeping concept definition
- Backlog restructuring (backlog/ as independent spot)
- Spots requirements document

**See:** `projects/06-glossary-term-requirements/LESSONS_LEARNED.md` for full details

### 07-console-api-exploration
**Objective:** Explore Console API implementation to validate AI-primary execution patterns

**Project Type:** Explorative Project

**Products Delivered:**
1. v7 Console API implementation (5 wrapper methods: log, error, warn, info, debug) ✅
2. Schema-driven property selection for three-layer merge ✅
3. Self-eval development harness ✅
4. Design documentation (API_DESIGN.md v0.3.0, DEV_ENVIRONMENT_DESIGN.md, SELF_EVAL_DESIGN.md) ✅
5. status/ spot for dynamic load minimisation ✅
6. Deployment script approach (v7-deploy.sh) ✅

**Status:** Complete - Extensive patterns validated and documented

**Key Outcomes:**
- **Schema-driven merge:** Method input schema defines which properties to merge from three layers
- **Boundary validation:** "Code dangerously with external safeguards" - validate at edges, pure logic inside
- **Wrapper vs DSL APIs:** Two API layers serving different purposes
- **Invocation at any level:** Package/API/method with path depth determining type
- **Self-eval as complete work spec:** "Dumb execution, smart definition"
- **Dev Environment as API:** Management methods for autonomous development
- **Teardown approach:** Fresh environments, deployment scripts, immutable artifacts
- **Four glossary territories:** Creator's (stepping stones), User's (howto), Language (DSL), Functional (spots)
- **status/ spot:** Dashboard for current state, reduces dynamic CLAUDE.md updates
- **Efficient search:** Glossary-first lookup pattern

**Key Learnings:**
- Iteration is king - let patterns emerge through v1-v7 cycles
- Glossaries are the index - efficient search starts there
- CLAUDE.md should be static - use status/ for dynamic content
- Autonomy enables delegation - why clean APIs matter

**Infrastructure Created:**
- status/ spot with CURRENT.md
- CIP-015: Cross-cutting layers over data entities
- blank_project_v1.0.1.md (project creation actions)
- glossary_v1.1.0.md (four territories)

**Backlog Items Created:**
- Dev Environment API (high priority)
- CIP Processing (high priority)
- AVRO Wrapper API (high priority)

**See:** `projects/07-console-api-exploration/LESSONS_LEARNED.md` for full details

### 08-dev-environment-api
**Objective:** Build dev environment API infrastructure enabling autonomous/delegated development

**Project Type:** Explorative Project

**Products Delivered:**
1. 4-level module structure (Module → Package → API → Method) ✅
2. Executable selfeval pattern ({req_name}_selfeval*.js) ✅
3. Test runner (run-selfevals.js) for cascading execution ✅
4. AVRO schemas for API invocation + all 7 methods ✅
5. spl/dev/create method fully implemented ✅
6. 6 methods stubbed with structure and selfevals ✅

**Unplanned Deliverables:**
- delegation stepping stone (partnership evolution pattern)
- Native vs wrapper API convention (single `_` vs double `__` underscore)
- Glossary ref path fix (all refs now relative to repo root)
- API_DESIGN.md v0.4.0 (6 new standalone blocks)

**Status:** Complete - Foundation delivered, full implementation deferred to next project

**Key Outcomes:**
- **Module structure validated:** 4-level hierarchy with README.md entry points, _reqs/ for versioned immutables
- **Executable selfeval pattern:** Scripts directly executable, no JSON manifest bureaucracy
- **Single concern principle:** One test per script, focused error messages, stop-on-first-fail friendly
- **Local rules apply:** Each node tests only itself, execution cascades through tree
- **API invocation model:** Stateful API, stateless methods, three-layer sandwich (API state → previous output → method input)
- **Native vs wrapper APIs:** Decision criterion (does vocabulary fit DSL?), underscore convention
- **Work package pattern:** Self-contained, portable, handoff-ready for delegation
- **Delegation stepping stone:** Mindset shift from executor to orchestrator

**Key Learnings:**
- Foundation quality > implementation quantity (structure validates pattern)
- Single concern enables precise error messages
- Local rules apply means each level validates only itself
- Glossary refs must be full paths relative to repo root (critical infrastructure)
- Partial delivery valid when foundation proves pattern
- Partnership evolving naturally toward higher autonomy

**See:** `projects/08-dev-environment-api/LESSONS_LEARNED.md` for full details

### 09-console-v5-stream-native
**Objective:** Convert Console API v4 to stream-native execution (pivoted to dev environment foundation)

**Project Type:** Explorative Project

**Products Delivered:**
1. v0 Dev Environment Template (7 scripts: clone, deploy, prepare, test, cycle, publish, destroy) ✅
2. Type Hierarchy Design (declaration-driven, dynamic hierarchy map) ✅
3. Lib Resolution Pattern (3-layer: source → symlink → re-export) ✅
4. Selfeval Inheritance System (type selfevals run on all nodes) ✅
5. Event Record Structure (Kafka-style headers with API namespacing) ✅

**Status:** Complete - Pivoted from Console migration to dev env foundation

**Key Outcomes:**
- **v0 template ready for cloning:** New projects clone pr09/v0 for dev environment
- **Type hierarchy works:** module_node base, branch, package, api, method types
- **Overlay operations:** selectFile() (first wins), collectAll() (accumulate)
- **Clean imports:** `import { createSpl } from 'lib/core.js'` without path traversal
- **Inherited selfevals:** Type validations run automatically on all instances

**Key Learnings:**
- Exploration projects can pivot - recognize and regroup
- Declaration-driven structure scales better than hardcoded
- Simple overlay operations + clear layer order = powerful inheritance
- Cheap iterations enable experimentation with safety net

**Deferred to Follow-On:**
- Console v4→v5 migration
- Bug report/reconstruction demo
- Arithmetic iterations 2-4
- spl/runtime and spl/pipeline APIs

**See:** `projects/09-console-v5-stream-native/LESSONS_LEARNED.md` for full details

---

**Legend:**
- Status: Initiated | In Progress | Complete | On Hold
- Priority: High | Medium | Low

**Notes:**
- Update this index when projects are initiated, change status, or complete
- Keep it current for quick reference
- Link to project folders for details
