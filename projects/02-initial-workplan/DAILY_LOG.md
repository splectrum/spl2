# Daily Log: Initial Workplan

Project log capturing decisions, issues, and lessons as they emerge.

---

## 2025-11-08

**Project Initiated:** 02-initial-workplan
**Type:** Explorative Project (first full implementation with multiple twin pairs)
**Objective:** Create initial headline workplan built on structured foundations and dependency analysis
**Products:** 8 products in 4 twin pairs

**Decision:** Use explorative project methodology
**Why:** Need to create deliverables (workplan, analysis, methodology) AND templates for each. Bootstrap pattern - parallel creation with cross-pollination between instance and pattern.
**Reference:** PROJECT_BRIEF.md

**Innovation:** CIP Register created
**Why:** Need lightweight mechanism to capture improvement ideas as they emerge during work
**Implementation:** Created CIP_REGISTER.md following ITIL Continual Improvement practice
**Initial CIPs:** CIP-000 (document register itself), CIP-001 (product register), CIP-002 (lightweight ITIL)
**Status:** CIP assessment planned for Product 5 (Dependency & Priority Analysis)

**Decision:** CIP maintenance at project close
**Why:** Projects already responsible for foundation maintenance. Adding CIP maintenance follows same pattern and prevents ideas being lost.
**Application:** Will add to PRINCE2_WOW.md if CIP-000 approved during dependency analysis

---

## 2025-11-10

**Methodology Discovery:** Artifact-to-Requirements Pinning Pattern

**What we discovered:**
Each artifact type needs its own versioned requirements document. Artifacts reference the requirements version active when created. This prevents forced upgrades and maintains quality assessment over time.

**Pattern:**
1. Each artifact type has versioned requirements (e.g., WOW_requirements_v1.0.0.md)
2. **Artifacts reference their requirements as mandatory first line**
3. Requirements evolve independently of artifacts
4. Artifacts only judged against their referenced requirements
5. No forced upgrades - only upgrade artifact when deliberately choosing new requirements
6. Without requirements reference, no way to assess artifact quality

**Implementation:**
- Created WOW_requirements_v1.0.0.md (requirements for WOW.md)
- Created Principles_requirements_v1.0.0.md (requirements for PRINCIPLES.md)
- Both in projects/01-preliminary-to-workplan/ (where they were created)
- WOW.md references WOW_requirements_v1.0.0.md
- PRINCIPLES.md references Principles_requirements_v1.0.0.md

**Why it matters:**
- TDC principle: artifacts need requirements to define "done"
- Versioning enables evolution without breaking existing artifacts
- Clear quality assessment at any point in time
- Preserves validity of older artifacts against their requirements

**Application going forward:**
- All artifacts should reference their requirements document
- Requirements documents are versioned and live in project folders
- Artifact validity is always relative to its referenced requirements

---

*Entries will be added as work progresses*
