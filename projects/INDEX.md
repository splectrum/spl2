# Projects Index

## Active Projects

| Code | Name | Status | Started | Products |
|------|------|--------|---------|----------|
| 04-bare-runtime-hello-world | Bare Runtime Hello World | Initiated | 2025-11-12 | 2 products |

## Completed Projects

| Code | Name | Completed | Key Outcomes |
|------|------|-----------|--------------|
| 01-preliminary-to-workplan | Preliminary to Workplan | 2025-11-08 | Validated foundations, established PRINCE2+TDC methodology, bootstrap pattern |
| 02-initial-workplan | Initial Workplan | 2025-11-10 | Simplified foundations, backlog structure with 9 projects, artifact-to-requirements pattern, minimal+complete practice guidance |
| 03-runtime-hello-world | Runtime Structure "Hello World" | 2025-11-12 | Core architecture validated, single-parameter method signature, platform abstraction, glossary discovery, MVP+End Vision pattern, Local Rules Apply generality |

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
**Objective:** Validate Bare platform basics through simplest possible implementation

**Project Type:** Explorative Project (Small - 3-5 days)

**Products:**
1. Working Bare Hello World
2. Bare Platform Familiarization Documentation

**Status:** Initiated - Project brief created, ready to execute

**Key Focus:**
- Bare installation and setup
- Basic execution (console, file I/O)
- Library landscape survey
- Development workflow
- Platform viability validation

**Why Critical:**
- Platform viability validation before deeper investment
- Discover showstoppers early
- Foundation for Bare Runtime Compatibility deep dive
- Required for Bare-based architecture confidence

**Project Addon:**
- Import Resolution Experiment (compare package aliases vs importModule function in Bare context)

**See:** `projects/04-bare-runtime-hello-world/PROJECT_BRIEF.md` for full details

---

**Legend:**
- Status: Initiated | In Progress | Complete | On Hold
- Priority: High | Medium | Low

**Notes:**
- Update this index when projects are initiated, change status, or complete
- Keep it current for quick reference
- Link to project folders for details
