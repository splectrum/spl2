# Continual Improvement Proposal (CIP) Register

**Project:** 02-initial-workplan
**Last Updated:** 2025-11-14

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

### CIP-009: splectrum-native Repository Model

**Type:** Architectural Foundation
**Status:** Captured
**Priority:** High (foundational for data layer)
**Source:** Project 04 closure + adhoc chat exploration
**Date Captured:** 2025-11-14

**Description:**
Define and implement the **splectrum-native repository model** - a polyglot persistence architecture optimized for human-AI collaboration that serves as the foundation for SPL2's data layer.

**Architecture:**
- **Immutable artifact streams** (event sourcing)
- **Multiple mutable indexes** (CQRS projections)
- **Location-transparent references** (URN-style logical identifiers)
- **Multi-model query interfaces** (document, graph, streaming, transactional)
- **Natural language schemas** as first-class representation
- **P2P network native** design

**Research Completed:**
- Phase 1: Multi-model databases (CosmosDB ARS, ArangoDB), Kafka stream-table duality, content-addressed storage (IPFS, Git), schema evolution (Confluent)
- Phase 2: Knowledge graphs (RDF, Wikidata), P2P systems (OrbitDB, Holochain, Gun.js), Event Sourcing + CQRS, persistent data structures, Merkle trees, Datomic

**Key Finding:**
We're already implementing Event Sourcing + CQRS implicitly. Research validates core patterns and identifies genuine innovations (NL ↔ rigid schema transformation, universal reference model, 4-layer hybrid architecture).

**Connection to SPL2's Totality:**
splectrum-native is the data layer foundation that enables:
- **TDC methodology:** Immutable artifacts, requirements traceability, quality assessment
- **DSL engine:** Schema discovery, type-guided composition, pattern reuse
- **AI optimization:** Multiple query patterns, natural language schemas
- **P2P networking:** Location-transparent, content-addressed, distributed

**Documentation:**
- Full CIP: `cips/CIP-009_splectrum-native-repository-model.md`
- Design discussion: `chats/2025-11-14_location-transparent-references-and-cross-repo-linking.md`
- Phase 1 research: `chats/2025-11-14_state-of-art-research-phase1-multi-interface-data-systems.md`
- Phase 2 research: `chats/2025-11-14_state-of-art-research-phase2-knowledge-graphs-p2p-systems.md`

**Related Backlog Items:**
- [Repository Streaming Structure](../backlog/repository-streaming-structure.md) - High priority
- [Natural Language Schema Transformation](../backlog/natural-language-schema-transformation.md) - High priority addon

**Rationale:**
During Project 04 closure, extensive discussions revealed the need for a repository model that scales from single to multiple repositories seamlessly, enables cross-platform linking (local/GitHub/P2P/web), reduces information lookup friction, and supports multiple data access patterns. This connects directly to SPL2's data layer implementation.

**Avenues Worth Pursuing:**
- Agent-centric architecture (personal source chains + shared indexes)
- Merkle tree verification (O(log n) integrity checks)
- Multi-model query layer (document, graph, streaming, transactional interfaces)
- Schema registry integration (Confluent patterns, AVRO evolution)
- CRDT-based index synchronization (conflict-free P2P)
- Persistent data structure optimizations (structural sharing)

**Processing Guidance:**
When processed, create/update backlog items:
- Location-Transparent Reference System (new)
- Multi-Model Query Interface Layer (new)
- Merkle Tree Verification Infrastructure (new)
- Agent-Centric Source Chain Architecture (exploration)
- Update existing: Repository Streaming Structure, Natural Language Schema Transformation

Spawn new CIPs:
- CRDT-Based Index Synchronization (P2P specific)
- Schema Registry for SPL2 (schema management)
- Persistent Data Structure Optimizations (performance)

**Next Steps:**
- Process CIP to create formal backlog items
- Consider proof-of-concept for location-transparent resolver
- Test CSV index performance at scale
- Update foundations (PRINCIPLES.md, Data_architecture_vX.X.X)

---

### CIP-010: Splectrum Product Vision and Positioning

**Type:** Strategic Vision
**Status:** Proposed
**Priority:** High (foundational for project direction)
**Source:** Adhoc chat exploration following CIP-009
**Date Captured:** 2025-11-14

**Description:**
Define Splectrum's complete product vision, positioning in the decentralization ecosystem, and engagement strategy with aligned communities.

**Establishes:**
- **The Stack:** P2P → Data Layer → DSL Engine → HAICC (four-layer architecture)
- **The Acronym:** HAICC = Human-AI Collaboration Creativity (pronounced "hike")
- **The Name:** Splectrum (platform) enabling HAICC (methodology)
- **The Vision:** Decentralizing creation through human-AI collaboration
- **The Positioning:** Making P2P application development accessible

**P2P Vision:**
Three streams converging:
1. **Blockchain/Cardano** - Decentralized trust (academic rigor, Charles Hoskinson's vision)
2. **Holepunch/Pear** - Decentralized infrastructure (P2P platform, no central servers)
3. **HAICC/Splectrum** - Decentralized creation (human-AI collaboration)

**The realization:**
> "Would it be possible to run typical client-server applications in decentralized networks where solutions persist through the coming together of users?"

**Full stack decentralization:**
```
Create without gatekeepers (Splectrum)
Host without platforms (Pear)
Settle without banks (Cardano)
```

**Community alignment:**
- **Cardano:** Shared values (academic rigor, first principles, long-term vision). Potential: artifact verification, Plutus DSLs, Project Catalyst funding.
- **Holepunch:** Technical synergy (already on Bare runtime, splectrum-native designed for P2P). Potential: reference applications, developer tooling, ecosystem contribution.

**The pitch:**
> "HAICC on Splectrum: Making P2P Application Development Accessible"

Developers HAICCing with Splectrum don't think about P2P complexity - AI collaboration + DSL Engine + Data Layer handle it automatically.

**Use cases that resonate:**
- Home automation (local-first smart home)
- Collaborative development tools (P2P Git alternative)
- Personal knowledge management (P2P notes)
- Small business apps (no SaaS rent forever)
- Community networks (user-controlled social)

**Documentation:**
- Full CIP: `cips/CIP-010_splectrum-product-vision-and-positioning.md`
- Complete discussion: `chats/2025-11-14_haicc-stack-and-product-vision.md`
- Related: CIP-009 (splectrum-native repository model)

**Rationale:**
Following extensive discussion on repository architecture (CIP-009), the full product vision crystallized through exploring stack architecture, naming, P2P strategy, and community alignment. This strategic vision positions Splectrum at intersection of three powerful movements (blockchain, P2P, AI collaboration) and provides clear direction for community engagement and ecosystem building.

**Processing Guidance:**
Create strategic artifacts:
- Product positioning document (stack, HAICC, capabilities, audiences)
- Community engagement plan (Cardano timeline, Holepunch roadmap, content schedule)
- Messaging framework (key messages, pitches, value props)

Update foundations:
- PRINCIPLES.md (add HAICC, P2P vision, decentralization principles)
- WOW.md (HAICC methodology, engagement approach, partnership principles)

Create backlog items:
- Community Engagement Infrastructure (website, blog, docs)
- Reference Application: Home Automation P2P
- HAICC Methodology Documentation
- Cardano Integration Exploration
- Pear Showcase Application

Establish presence:
- Project website (splectrum.io or splectrum.dev)
- GitHub organization structure
- Technical blog, documentation site
- Join Cardano/Holepunch communities

**Next Steps:**
- Process into formal strategic plan
- Create website, establish presence
- Begin community engagement
- Build reference applications
- Demonstrate value, grow ecosystem

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
