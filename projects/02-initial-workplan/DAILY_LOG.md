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

**Lesson:** Comfort with imperfection

**Context:** Working through Twin Pair 1 (Foundation Analysis)

**Learning:**
One has to feel comfortable with not being perfect. This aligns with "good enough" (PRINCE2), "minimal and complete", and exploration-driven development. Perfectionism blocks progress - comfort with imperfection enables organic evolution and learning.

**Why it matters:**
- Explorative work requires trying, learning, adjusting
- Mistakes become lessons learned (data for improvement)
- Rigid adherence to "doing it right" prevents discovery
- Natural flow and organic change are more valuable than rigid process

**Application:**
- Trust the process, document discoveries, continue
- Work → discover → document → evolve
- Not: plan → validate → execute → check
- Embrace "good enough" and iterate based on evidence

---

**Decision:** Skip Twin Pair 2 (Foundation Update Methodology + Template)

**Rationale:**
Foundation update methodology emerged naturally through Twin Pair 1 work:
- Foundations simplified to minimal headlines (~5KB total)
- Pattern clear: version detail in projects, reference from foundations
- Risk R03 (foundation drift) already mitigated through simplification
- Categorization, dependency tagging, priority frameworks unnecessary for this simple structure
- Anticipated complexity doesn't exist - would be over-engineering

**What we have instead:**
- Pattern demonstrated through actual application (Twin Pair 1)
- FOUNDATION_ANALYSIS_TEMPLATE.md captures the approach
- Artifact-to-requirements pinning pattern documented
- Clear examples in practice

**Project scope adjusted:** 8 products → 6 products (2 twin pairs instead of 4)
- Twin Pair 1: Foundation Analysis + Template ✅
- Twin Pair 2: ~~Foundation Update Methodology + Template~~ (skipped - unnecessary)
- Twin Pair 3: Dependency & Priority Analysis + Template (next)
- Twin Pair 4: Headline Workplan + Template

**Lesson:** Explorative project methodology working as intended - discovered through doing that planned work was unnecessary. This is efficient, not wasteful.

---

**Innovation:** Project Backlog artifacts added to PRINCE2

**What we created:**
Created backlog structure for project planning:
- `projects/BACKLOG.md` - Register of identified projects with priority and dependencies
- `projects/backlog/[project-name].md` - Individual project detail files
- Both follow artifact-to-requirements pattern (references added, requirements files embryonic)

**PRINCE2 extension:**
Created PRINCE2_operational_v1.1.0.md (minor version - addition):
- Added Project Backlog as planning artifact
- Documented in "What We Use" section
- Follows pattern: global register + individual items + requirements references
- Consistent with existing extensions (project close process, foundation maintenance)

**Why it matters:**
- Systematic dependency and priority analysis for workplan
- Visible backlog of identified work
- Pattern for capturing project proposals
- Enables informed planning based on analysis

**Application:**
- Backlog populated during Twin Pair 3 (Dependency & Priority Analysis)
- Informs Twin Pair 4 (Headline Workplan)
- Evolves as new projects identified

---

**Discovery:** Product Types vs Project Types

**Context:** During backlog item requirements work

**What we discovered:**
Confusion arose when labeling backlog items with "Feature Project", "Infrastructure Project", etc. These are actually **product types**, not project types. A project can deliver multiple products of different types.

**Clarity:**
- **Project Types:** Exploration Project, Project Addons (what kind of project)
- **Product Types:** Feature, Infrastructure, Template, Documentation, etc. (what kind of deliverable)
- Projects have types, products within projects have types

**Why it matters:**
- Clear distinction prevents confusion
- Product types are formal product management concept
- PRINCE2 projects deliver products - product typing helps organize and plan
- Need templates for different product types

**Recommendation:**
Introduce formal product types as part of lightweight ITIL implementation (see CIP-002). ITIL has service/product management concepts that align with this. Don't distract from current backlog work - defer to ITIL exploration.

**Current approach:**
Keep project types simple (Exploration, Project Addons). Defer product type formalization until ITIL work.

---

**Lesson:** Over-engineering and Minimal+Complete in Practice

**Context:** Throughout Project 02

**Pattern observed:**
We consistently over-engineered during this project:
- Foundation analysis: Created too much detail initially, had to simplify
- Twin Pair 2: Planned but realized it was unnecessary (skipped)
- Backlog item requirements: Created elaborate 8-test validation framework, simplified to 2 mandatory requirements
- Twin Pair 3 template: Thought we needed separate template document, requirements files sufficient
- Product types vs project types: Added unnecessary types prematurely

**What we learned:**
We don't yet have a good understanding of what "minimal but complete" means in practice. Tendency is to add structure, tests, documentation, and complexity before validating it's needed. Change of mindset required.

**Why it matters:**
- Over-engineering wastes effort
- Creates maintenance burden
- Obscures what actually matters
- Contradicts "minimal and complete" principle
- Need to practice the constraint, not just acknowledge it

**Application going forward:**
- Question every addition: is this actually needed NOW?
- Start minimal, add based on evidence
- Trust that "good enough" really is good enough
- Catch ourselves when adding premature structure
- Use "comfort with imperfection" - don't perfect before using

**Risk identified:**
Added to RISKS.md - tendency to over-engineer is ongoing risk that needs active management.

---

**Decision:** Twin Pair 4 (Headline Workplan + Template) is Redundant

**Context:** Completing Project 02

**Rationale:**
BACKLOG.md already serves as the headline workplan:
- Lists projects in execution order
- Shows priorities and dependencies
- Includes timeframes and brief context
- Provides clear overview for planning

Creating separate workplan document would duplicate this information. The backlog register IS the headline workplan.

**Pattern confirmed:**
Like Twin Pair 2 and Twin Pair 3 template, discovered through doing that planned work was unnecessary. Explorative project methodology working as intended - validate by doing, skip what turns out to be redundant.

**Project status:** All twin pairs complete (1 delivered, 2 skipped as unnecessary, 3 delivered with built-in template, 4 redundant). Ready for project close.

---

*Entries will be added as work progresses*
