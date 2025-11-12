# Continual Improvement Proposal (CIP) Register

**Project:** 02-initial-workplan
**Last Updated:** 2025-11-08

Lightweight capture of improvement ideas that emerge during project work. CIPs are reviewed during planning cycles and either implemented, deferred, or rejected based on priority and dependencies.

---

## Active CIPs

### CIP-000: Document CIP Register in Methodology

**Type:** Methodology/Process
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Project 02 - discovery during work
**Date Captured:** 2025-11-08

**Description:**
Add CIP Register to PRINCE2_WOW.md as a standard living artifact. Document:
- Purpose: Lightweight idea capture following ITIL Continual Improvement practice
- When to use: Projects capture CIPs as ideas emerge
- Integration with project close: CIP maintenance as part of closure process
- Workflow: Capture → Review → Assess → Implement/Defer/Reject

**Rationale:**
CIP Register proves useful in Project 02 for capturing improvement ideas. Should be formalized in methodology so future projects can use it. Aligns with ITIL Continual Improvement practice.

**Additional consideration:**
Add "CIP Maintenance" to project close process in PRINCE2_WOW.md:
- Review project CIPs
- Update CIP status
- Promote relevant CIPs to global register
- Close implemented CIPs with outcomes
- Follows pattern of projects being responsible for maintenance (foundations, CIPs)

**Next Steps:**
- Assess during Product 5 (Dependency & Priority Analysis)
- Could be part of Product 2 (Foundation Update Methodology) scope
- Or separate quick update to PRINCE2_WOW.md

---

### CIP-001: Product Register for Project Tracking

**Type:** Process/Tool
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Project 02 discussion
**Date Captured:** 2025-11-08

**Description:**
Create a Product Register as a living artifact for projects with multiple products (especially explorative projects with twin pairs). Would provide:
- Status tracking for all products at a glance
- Visibility of twin pair progression (are we maintaining parallelism?)
- Quality criteria status per product
- Dependencies between products
- Progress monitoring

**Rationale:**
Project 02 has 8 products in 4 twin pairs. Tracking becomes important at this scale. Would help ensure we maintain parallel creation methodology and don't fall into sequential mode.

**Considerations:**
- Where does it fit? (PRINCE2_WOW.md artifact, or ad-hoc as needed?)
- Template creation? (Could be twin pair: Product Register + Product Register Template)
- Integration with existing artifacts (DAILY_LOG, project brief)

**Next Steps:**
- Assess during Product 5 (Dependency & Priority Analysis)
- Decide: include in Project 02 scope, or defer to future project

---

### CIP-002: Lightweight ITIL Implementation

**Type:** Methodology
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Project 02 discussion
**Date Captured:** 2025-11-08

**Description:**
Implement lightweight ITIL practices aligned with SPL2 principles. Potential areas:
- **Service Catalog:** What capabilities SPL2 provides (APIs, DSLs, tools)
- **Change Management:** How we evolve foundations, APIs, methodology (we have some of this)
- **Knowledge Management:** Lessons learned, findings, templates (already doing this)
- **Problem Management:** Pattern identification from issues
- **Configuration Management:** Track dependencies, versions, compatibility
- **CIP Register itself:** Following ITIL Continual Improvement practice

**Rationale:**
We're already doing ITIL-ish things (living artifacts, foundation maintenance, lessons learned). Formalizing with ITIL structure could improve organization and reusability. Aligns well with our systematic approach.

**Considerations:**
- Keep lightweight (not heavy ITIL bureaucracy)
- Align with PRINCE2+TDC methodology
- What ITIL practices provide most value for SPL2?
- Integration points with existing methodology

**Next Steps:**
- Research ITIL 4 practices (which are most relevant?)
- Assess during Product 5 (Dependency & Priority Analysis)
- Potential exploration project: "Lightweight ITIL for SPL2"

---

### CIP-003: Home Automation P2P Application

**Type:** Feature/Application
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Existing in PRINCIPLES.md
**Date Captured:** 2025-11-10

**Description:**
Build P2P home automation application on Splectrum platform:
- Self-contained P2P network (PCs, tablets, mobile, servers)
- Local-first, no cloud dependency
- Conventional distributed apps on P2P infrastructure
- Integration with existing tools (Home Assistant, etc.)

**Rationale:**
Initial real-world application to validate SPL2 platform capabilities. Demonstrates P2P architecture, local-first design, and integration patterns.

**Considerations:**
- Requires Bare runtime compatibility
- P2P layer implementation needed
- Integration patterns with existing tools
- Device ecosystem support

**Next Steps:**
- Assess during Product 5 (Dependency & Priority Analysis)
- May become exploration project or feature development project
- Dependencies on core platform capabilities

---

### CIP-004: Splectrum Core - AI Tooling Platform

**Type:** Feature/Platform
**Status:** Captured
**Priority:** TBD (to be assessed during dependency analysis)
**Source:** Existing in PRINCIPLES.md
**Date Captured:** 2025-11-10

**Description:**
Develop Splectrum as platform for Claude's task automation and problem-solving:
- Platform for creating task-optimized DSLs
- Claude decides what tooling is needed
- Growing library of reusable components
- DSL creation for task-specific languages

**Rationale:**
Primary purpose of SPL2 - enabling AI to create and use custom tooling. DSL engine for building layers of APIs that compose into optimal solutions.

**Considerations:**
- What DSL capabilities are needed?
- How does Claude discover and use tools?
- Component library structure and reusability
- Balance between flexibility and usability

**Next Steps:**
- Assess during Product 5 (Dependency & Priority Analysis)
- Likely multiple exploration projects needed
- Core platform work before applications

---

### CIP-005: GUID-Based Artifact Identification System

**Type:** Infrastructure/Tooling
**Status:** Captured
**Priority:** TBD (implement when execution tracking infrastructure exists)
**Source:** Project 03 - Artifact Identification Discussion
**Date Captured:** 2025-11-10

**Description:**
Implement GUID-based artifact identification system for exact bug reproduction:
- Unique identifier per file/artifact
- Stable across requirement evolution
- Resolves to: requirements + version + hash + metadata
- Enables exact code footprint extraction for bug reproduction
- Requires: GUID generation, resolution mechanism, registry

**Rationale:**
Architecturally superior to requirement references for bug reproduction use case. When error occurs, need to extract complete footprint (exact artifact versions that executed) to enable reconstruction. GUID provides stable identification independent of requirement evolution.

**Current Approach:**
Using requirement reference stamping (`// Requirements: requirement_file_v1.0.0.md`) as interim solution. Simple, manageable manually, satisfies current traceability needs.

**Considerations:**
- Premature without automation infrastructure
- Requires execution tracking to capture which artifacts executed
- Needs bug extraction tooling to generate reproduction packages
- "Local rules apply" - future projects can adopt GUIDs when infrastructure ready

**Next Steps:**
- Implement when execution tracking infrastructure exists
- Build bug extraction / reproduction tooling first
- Then migrate from requirement references to GUID system
- Dependencies: execution tracking, deployment automation, bug report infrastructure

---

### CIP-006: N-Tier API Hierarchy with Hierarchical State Scoping

**Type:** Architecture/Feature
**Status:** Captured
**Priority:** TBD (implement when capacity and evidence support it)
**Source:** Project 03 - API Structure Discussion
**Date Captured:** 2025-11-10

**Description:**
Extend API structure from three-layer MVP to sophisticated hierarchical organization:

**N-tier organizational hierarchy:**
- Flexible depth above API level: `[domain]/[subdomain]/.../[api]/[method]`
- API remains concern + namespace boundary
- Methods always leaves (endpoints)
- Grow hierarchy as needed based on evidence

**Hierarchical APIs with state scoping:**
- APIs can contain sub-APIs
- State scoping: child sees parent state, siblings isolated
- Progressive context refinement down hierarchy
- Complex but powerful for large systems

**Rationale:**
MVP uses simple three-layer structure `[package]/[api]/[method]` (proven from spl1). Works for current needs, but architectural vision shows value in flexible hierarchy for larger systems. N-tier prevents organizational constraints, hierarchical state scoping enables sophisticated state management patterns.

**Current Approach (MVP):**
- Three-layer structure: `[package]/[api]/[method]`
- State backing at API level (methods share API state)
- Single-layer API (no sub-APIs)
- Simple, concrete, sufficient for validation

**Considerations:**
- MVP design doesn't prevent future extension
- Implement when complexity justifies it (evidence-based)
- Pattern fits "MVP + End Vision" approach
- State scoping rules need careful design

**Next Steps:**
- Use MVP for current development
- Gather evidence on organizational needs
- Implement when system scale demands it
- Dependencies: proven MVP, clear use cases for hierarchy

---

### CIP-007: Glossary Management Tooling for API Vocabulary

**Type:** Infrastructure/Tooling
**Status:** Captured
**Priority:** High (foundational for API development)
**Source:** Project 03 - Glossary Discovery
**Date Captured:** 2025-11-11

**Description:**
Automated tooling for managing API vocabulary glossary:
- **Validation:** Ensure consistent term usage across codebase
- **Enforcement:** Prevent naming conflicts, enforce glossary compliance
- **Schema integration:** Link terms to AVRO schemas automatically
- **Requirement generation:** Auto-generate baseline requirements from package/API/method names using glossary definitions

**Current Approach (MVP):**
Manual glossary management in Project 03:
- 4-column structure: Term, Type, Description, Requirement
- Document entries as APIs/methods/properties created
- Deferred columns: Schema reference, Examples (add based on evidence)
- Glossary file: `GLOSSARY_vocabulary_v1.0.0.md` with manual maintenance

**Rationale:**
Glossary is foundational infrastructure, not nice-to-have:
1. Semantic consistency - same concept = same name + schema everywhere
2. Compositional reasoning - AI/humans understand from vocabulary alone
3. Partial requirements generation - names carry semantic meaning
4. Type safety foundation - canonical schemas for validation
5. Day one critical - prevents expensive renaming/migration later

**Tooling Requirements:**
- Validate glossary compliance during development
- Enforce vocabulary rules (prevent non-glossary terms)
- Auto-link to AVRO schemas
- Generate baseline requirements from method signatures
- Integration with IDE/linting

**Considerations:**
- Prove manual pattern first (Project 03)
- Capture pain points during manual use
- Assess deferred columns (schema refs, examples) based on experience
- Build tooling when manual maintenance becomes burden

**Next Steps:**
- Complete Project 03 with manual glossary
- Document manual workflow pain points
- Design tooling based on evidence
- Implement automation when proven valuable

**Risk:** R09 - Lack of glossary tooling during development (accepted for MVP, deferred until proven)

---

### CIP-008: App Overlay Pattern for Module Resolution

**Type:** Feature/Infrastructure
**Status:** Captured
**Priority:** TBD (implement when development workflow demands it)
**Source:** Project 03 - Module Resolution Discussion
**Date Captured:** 2025-11-11

**Description:**
Two-tier module resolution with app overlay pattern (proven from spl1):

**Resolution Order:**
1. Try `apps/{app}/modules/` first (app-specific overlay)
2. Fall back to global `modules/` (standard install)

**Use Cases:**
- Work on modules in app context without touching global install
- Selective override for debugging (app version shadows global)
- Development workflow: Standard install + work-in-progress in overlay
- Safe experimentation without disrupting global modules

**Context Switching:**
- Modules in global folder: run in install context
- Modules in app folder: run in app context
- Clear separation of concerns

**Current Approach (MVP):**
Single resolution path - global modules folder only:
- Convention-based: `{modulesBasePath}/{package}/{api}/{method}/index.js`
- Dynamic ES module import with path validation
- Simple, proven, sufficient for current needs

**Benefits:**
- Safe experimentation
- Module development without install disruption
- Debugging flexibility (override specific modules)
- Clear development workflow

**Considerations:**
- Context determination logic needed
- Security implications of overlay shadowing
- Clear documentation of resolution order
- Tooling to manage overlays

**Next Steps:**
- Prove MVP module resolution first
- Gather evidence on development workflow pain points
- Implement when need for overlay becomes clear
- Dependencies: proven module resolution, clear use cases

---

## Implemented CIPs

*(None yet)*

---

## Rejected CIPs

*(None yet)*

---

## CIP Workflow

**Capture:**
- Idea emerges during work
- Create CIP entry (title, description, type, source)
- Status: Captured
- No detailed analysis at capture time

**Review:**
- At project close: review project's CIPs
- During planning cycles: assess captured CIPs
- Dependency & Priority Analysis: evaluate against other work

**Decision:**
- Implement: Move to planned work (workplan or specific project)
- Defer: Leave in Active CIPs for future consideration
- Reject: Move to Rejected CIPs with rationale

**Close:**
- When implemented: Move to Implemented CIPs
- Document outcome and lessons learned

---

## Notes

- CIPs are lightweight - capture quickly, analyze later
- Not every idea becomes a CIP (use judgment)
- CIP Register reviewed during project close
- Relevant CIPs promoted to global CIP Register (when it exists)
- This project-level register is template for future global register
