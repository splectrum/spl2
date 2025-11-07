# Project Brief: Preliminary to Workplan

**Project Code:** 01-preliminary-to-workplan
**Start Date:** 2025-11-07
**Status:** Initiated

---

## Project Definition

### Background
SPL2 foundations documentation has been created defining how we work (WOW) and core principles (PRINCIPLES). Before we can execute efficiently on the main workplan, we need to:
1. Validate foundations against past experience (spl1, prototype)
2. Establish practical PRINCE2 working structure
3. Create TDC workflow and templates

### Project Objective
Establish validated foundations and working methodology (PRINCE2 + TDC) ready for efficient project execution.

### Business Justification
Without these prerequisites:
- We might build on unvalidated assumptions
- We lack practical templates/workflow for efficient work
- We'll waste time figuring out "how to work" on every task
- Visibility and decision-making will be ad-hoc

With these in place:
- Foundations validated against real experience
- Clear, repeatable workflow
- Fast project initiation
- Systematic learning capture

---

## Products to be Delivered

### Product 1: Repository Review & Foundation Update
**Description:** Foundations validated and updated based on past experience

**What we'll do:**
1. Review `/home/herma/advanced-informatics/product-poc/` for:
   - Tooling choices (React, AVRO, testing frameworks)
   - What worked, what didn't
   - Lessons applicable to SPL2
2. Review `archive/` in spl2 repo for:
   - spl1 pipelining implementation
   - Relevant architectural insights
   - Lessons learned
3. Extract learnings and additions for foundations
4. Update foundation documentation
5. Re-evaluate all documentation against REQUIREMENTS.md
6. Iterate until foundations ready for workplan execution

**Quality Criteria (TDC Validation):**
- Product-poc reviewed, key insights documented
- spl1 archive reviewed, pipelining approach understood
- Foundations updated with relevant learnings
- No conflicts or blocking gaps remain
- Documentation validated and scores "good enough"
- Ready to support efficient workplan execution

**Deliverables:**
- Repository review findings document
- Updated PRINCIPLES.md and/or PRINCIPLES_DETAILED.md
- Updated VALIDATION_RESULTS.md
- Clear, validated foundations

### Product 2: Lightweight PRINCE2 Setup
**Description:** Self-improving project structure with living artifacts

**What we'll do:**
Create lightweight PRINCE2 implementation focused on **living artifacts** that learn and evolve:
- **Logs** (decisions, lessons, issues) that capture knowledge
- **Risk register** that updates as we learn
- **Project template** that incorporates learning from past projects
- Maximum benefit (visibility, learning), minimum overhead
- Self-improving system: each project makes the next one better

**Quality Criteria (TDC Validation):**
- Defined which artifacts we use (and don't use)
- Templates for key artifacts (logs, project brief, etc.)
- Clear workflow for project lifecycle
- Artifacts demonstrate learning/evolution capability
- Can initiate new project efficiently
- Lightweight enough to use consistently
- Integration with TDC clear

**Deliverables:**
- PRINCE2_WOW.md documenting our approach
- Artifact templates
- Project folder structure/conventions
- Example of how artifacts evolve
- Updated WOW.md (if needed)

### Product 3: TDC Template/Framework
**Description:** The meta-tool for defining and evaluating all products

**What we'll do:**
Create the validation mechanism used by all other work:
- TDC work item template (how we define what to build)
- Validation criteria template (how we define "done")
- Validation results template (how we capture results)
- Integration with PRINCE2 Product Descriptions
- This IS how we evaluate Products 1 and 2 (bootstrap!)

**Key insight:** Product 3 is the mechanism that makes all products work. We create the evaluation framework while using it.

**Quality Criteria (TDC Validation):**
- Work item template clear and usable
- Validation criteria template enables clear "done" definition
- Validation results template captures findings effectively
- Workflow documented (create → validate → iterate)
- Works seamlessly with PRINCE2 Product Descriptions
- Successfully validates Products 1 and 2 using this framework
- Can create and validate any work item type

**Deliverables:**
- TDC_FRAMEWORK.md documenting approach
- TDC templates (work item, validation criteria, results)
- Examples of TDC applied to different artifact types
- Integration guide with PRINCE2
- Updated WOW.md (if needed)

---

## Approach

**Sequence:**
1. **Repository Review** (spl1 archive, prototype)
   - Review spl1 pipelining implementation
   - Evaluate prototype tooling choices
   - Document findings
   - Update foundations documentation
   - Re-validate documentation

2. **PRINCE2 Setup** (can happen in parallel with 3)
   - Define artifacts and templates
   - Document workflow
   - Create examples

3. **TDC Setup** (can happen in parallel with 2)
   - Create templates
   - Document workflow
   - Create examples

4. **Integration Validation**
   - Ensure PRINCE2 and TDC work together
   - Test by creating example work item

**Method:**
- Exploratory research for repository review
- Documentation and template creation
- Validation against use cases

---

## Scope

### In Scope
- Review of spl1 pipelining and prototype
- Updates to foundations based on review
- PRINCE2 working structure for our context
- TDC templates and workflow
- Documentation of both methodologies

### Out of Scope
- Deep dive into all of spl1 (only pipelining and relevant learnings)
- Prototype reimplementation (evaluation only)
- Actual implementation of core platform
- Long-term project planning (comes after)

---

## Success Criteria

**Project succeeds when:**
1. ✅ Foundations validated and updated based on past experience
2. ✅ Can initiate new PRINCE2 project efficiently using templates
3. ✅ Can create and validate work items using TDC templates
4. ✅ Ready to start first exploration project with clear methodology

**Project fails if:**
- ❌ Major gaps discovered in foundations that block work
- ❌ Methodology too heavy/complex to use efficiently
- ❌ Repository review reveals fundamental flaws in approach

---

## Dependencies & Constraints

**Dependencies:**
- Access to spl1 archive (available in /archive/)
- Access to prototype repository (location TBD)
- Foundations documentation (exists)

**Constraints:**
- Keep methodology lightweight (not heavy PRINCE2)
- Templates must be simple enough to use consistently
- Focus on "good enough" not perfect

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Repository review reveals fundamental issues | High | Address immediately, update principles |
| Methodology too complex to use | Medium | Keep minimal, test with example |
| Templates don't fit actual work | Medium | Iterate based on first usage |

---

## Timebox

**Estimated Effort:** 1-2 weeks
**Target Completion:** Flexible (learning-driven, not time-driven)

---

## Next Steps

1. Locate prototype repository
2. Begin spl1 archive review
3. Document findings as we go
4. Create templates incrementally
5. Validate everything works together

---

## Notes

This project is meta - we're establishing how to work. Expect iteration and refinement. The goal is "good enough to start" not perfect.
