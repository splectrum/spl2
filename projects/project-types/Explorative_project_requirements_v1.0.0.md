# Explorative Project Requirements

**Version:** 1.0.0
**Created:** 2025-11-12
**Purpose:** Define characteristics, methodology, and WOW guidance for Explorative Projects

---

## What is an Explorative Project?

An **Explorative Project** is characterized by:
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

**Collaboration Mode:** **COLLABORATIVE**

Explorative projects require **human + AI collaboration** throughout:

**Planning Phase:**
- Human provides architectural intuition and constraints
- AI proposes implementation approaches
- Discuss and decide together before execution
- Create PROJECT_BRIEF collaboratively

**Execution Phase:**
- Work in dialogue, not autonomously
- AI implements, human reviews and guides
- Architectural decisions discussed before committing
- Regular check-ins on direction

**Discovery Phase:**
- Stop and discuss when discovering new patterns
- Validate architectural implications together
- Document decisions and rationale in DAILY_LOG

**Rationale:** Explorative projects involve critical architectural decisions that benefit from both human intuition (experience, constraints, vision) and AI capabilities (rapid implementation, pattern recognition). Too critical to run autonomously.

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
- This document adds: collaboration mode (COLLABORATIVE), twin pair methodology, explorative-specific success criteria
- Where this document specifies additional constraints, those constraints are **in addition to** PRINCE2 base requirements (not conflicting)
- Example: PROJECT_BRIEF must have products (PRINCE2) AND twin pair structure (Explorative)

**Referenced at Project Initiation:**
- PROJECT_BRIEF.md must reference this document (first line): `Requirements: ../project-types/Explorative_project_requirements_v1.0.0.md`
- PROJECT_BRIEF.md must also reference PRINCE2_operational (second line)
- Dual requirements pattern enables quality assessment

---

## Related Artifacts

- PRINCE2_operational_v1.2.0: Base project management requirements (extended by this document)
- Philosophy_v1.1.0: Minimal and complete, evidence-based evolution
- TDC_framework_v1.1.0: Artifact-to-requirements pinning

---

*This requirements document itself provides WOW guidance for Explorative Projects. Future project types will define their own collaboration modes and methodologies.*
