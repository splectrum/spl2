# Exploration Project Requirements

**Version:** 1.1.0
**Created:** 2025-11-12
**Updated:** 2025-11-18
**Purpose:** Define characteristics, methodology, and WOW guidance for Exploration Projects

---

## What is an Exploration Project?

An **Exploration Project** is characterized by:
- **Architecture discovery** - Validating core design decisions through implementation
- **Pattern creation** - Establishing new patterns while using them
- **Twin pair methodology** - Creating deliverables and templates in parallel
- **Evidence-based evolution** - Discovering what's needed through doing
- **Critical validation** - Proving foundational concepts work

**When to use:**
- Early in development when architecture is undefined
- Validating critical path functionality
- Establishing new patterns or methodologies
- High uncertainty requiring discovery through implementation

**When NOT to use:**
- Following well-established patterns (use template-based project)
- Routine implementation with clear requirements
- Low-risk, well-understood work

---

## WOW Guidance: Collaboration Mode

**Collaboration Mode:** **COLLABORATIVE** (default)

Exploration projects require **human + AI collaboration** as the default mode. Collaboration is critical for architectural decisions and discovery work.

**Rationale:** Exploration projects involve critical architectural decisions that benefit from both human intuition (experience, constraints, vision) and AI capabilities (rapid implementation, pattern recognition). Too critical to run autonomously by default.

### Autonomous Activities

The following activities are **exempt from collaboration** and can be executed autonomously:

**Project Creation:**
- Create project folder
- Create PROJECT_BRIEF (echo backlog item content)

**Project Initiation:**
- Create RISKS register
- Initial DAILY_LOG entry

**Closure Phase:**
- LESSONS_LEARNED
- PARTNERSHIP_REFLECTION
- Commit/push

### Collaborative Activities

All other activities require collaboration, especially:

**Project Initiation:**
- Review/refine PROJECT_BRIEF
- Create PROJECT_PLAN

**Execution Phase:**
- Design work (architectural decisions)
- Implementation (writing code)
- Testing
- Documentation updates
- DAILY_LOG entries

**Discovery Phase:**
- Recognizing new patterns
- Validating architectural implications
- Documenting decisions and rationale

**Closure Phase:**
- PARTNERSHIP_REVIEW
- Foundation/glossary updates
- INDEX.md/BACKLOG.md updates

---

## Methodology: Twin Pair Pattern

**Deliverable Structure:**
Products come in **twin pairs**:
- **Implementation** - Working artifact (code, system, process)
- **Template/Pattern** - Generalized reusable guidance

**Benefits:**
- Templates validated through actual use
- Implementation guided by template thinking
- Cross-pollination between specific and general
- Evidence-based patterns (not speculation)

**Discovery Freedom:**
Twin pairs can be **skipped** if discovery reveals they're unnecessary:
- Document why skipped in DAILY_LOG
- Validate decision (redundant? premature? covered elsewhere?)
- Pattern: Plan optimistically, adjust based on evidence

---

## Success Criteria

An Explorative Project succeeds when:
1. **Architecture validated** - Core concepts proven to work
2. **Patterns established** - Reusable guidance captured
3. **Evidence gathered** - Decisions documented with rationale
4. **Foundation laid** - Future work can build confidently
5. **Lessons captured** - Learning synthesized for next projects

**Not measured by:**
- Perfect completeness (minimal and complete philosophy)
- All planned deliverables (discovery may show some unnecessary)
- Zero rework (exploration expects refinement)

---

## Artifact Requirements

**PROJECT_BRIEF.md:**
- Must reference these requirements (first line)
- Explicit project type: "Explorative Project"
- Twin pair structure with implementation + template

**DAILY_LOG.md:**
- Record all architectural decisions with rationale
- Document discoveries and "For Project Closure" items
- Capture evidence for pattern validation

**LESSONS_LEARNED.md:**
- Synthesize key discoveries
- Document what worked / what didn't
- Guide future explorative projects

**Deliverables:**
- Implementation artifacts with requirement references
- Templates/patterns validated through use
- Foundation updates if new principles discovered

---

## Base Requirements

This document **extends** PRINCE2_operational (base project management requirements) with additional requirements specific to explorative projects.

**Inheritance Pattern:**
- All PRINCE2_operational requirements apply (project lifecycle, artifacts, closure process)
- This document adds: collaboration mode (COLLABORATIVE), autonomous activities list, twin pair methodology, exploration-specific success criteria
- Where this document specifies additional constraints, those constraints are **in addition to** PRINCE2 base requirements (not conflicting)
- Example: PROJECT_BRIEF must have products (PRINCE2) AND twin pair structure (Explorative)

**Referenced at Project Initiation:**
- PROJECT_BRIEF.md must reference this document (first line): `Requirements: ../04-bare-runtime-hello-world/Exploration_project_requirements_v1.1.0.md`
- PROJECT_BRIEF.md must also reference PRINCE2_operational (second line)
- Dual requirements pattern enables quality assessment

---

## Related Artifacts

- PRINCE2_operational_v1.2.0: Base project management requirements (extended by this document)
- Philosophy_v1.1.0: Minimal and complete, evidence-based evolution
- TDC_framework_v1.1.0: Artifact-to-requirements pinning

---

## Changelog

**v1.1.0 (2025-11-18):**
- Added "Autonomous Activities" section with explicit list of activities exempt from collaboration
- Restructured "WOW Guidance: Collaboration Mode" section for clarity
- Autonomous: Project creation, RISKS register, initial DAILY_LOG, LESSONS_LEARNED, PARTNERSHIP_REFLECTION, commit/push
- Collaborative: PROJECT_BRIEF refinement, PROJECT_PLAN, all execution/discovery work, PARTNERSHIP_REVIEW, foundation updates

**v1.0.0 (2025-11-12):**
- Initial version defining Exploration Project characteristics and methodology

---

*This requirements document itself provides WOW guidance for Explorative Projects. Future project types will define their own collaboration modes and methodologies.*
