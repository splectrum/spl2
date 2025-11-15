# PRINCE2 Ways of Working v1.2.0

**Version:** 1.2.0
**Created:** Project 01 (v1.0.0), Project 02 (v1.1.0 - added backlog artifacts), Project 03 (v1.2.0 - added project types, closure activities, requirements references)
**Changes in v1.2.0:**
- Added mandatory dual requirements references (project type + PRINCE2)
- Added project type metadata requirement
- Added closure activities: CIP Review (optional), Backlog Grooming (optional), Partnership Reflection (mandatory)
- Clarified foundation update approach (small at closure, large → separate project)
- Added guidance on creating new project types
- Updated PROJECT_BRIEF template
- Updated closure checklist

---

## Philosophy

**Lightweight, not heavy** - Use PRINCE2 principles for structure and visibility, skip bureaucracy.

**Living artifacts** - Documents that learn and evolve, not static paperwork.

**Self-improving** - Each project makes the next one better.

---

## What We Use (and Don't Use)

### We Use ✅

**Project Brief** (per project)
- Defines what we're building (products)
- Clear quality criteria (TDC validation)
- Success criteria
- **Must reference requirements** (project type + PRINCE2)
- Template: `PROJECT_BRIEF.md`

**Daily Log** (per project)
- Chronological record of decisions, issues, lessons
- Why decisions were made (context preservation)
- Quick updates (2-3 lines per entry)
- File: `DAILY_LOG.md`

**Risk Register** (per project)
- Risks identified + mitigation
- How risks evolved (learning)
- Updates as we discover more
- File: `RISKS.md`

**Lessons Learned** (per project)
- Synthesized at project close
- What worked / what didn't in this project
- Feeds constraints to foundations (with references)
- File: `LESSONS_LEARNED.md` (in project folder)
- Created during project close process

**Partnership Reflection** (per project) - *Added in v1.2.0*
- Mandatory closure activity
- Methodology effectiveness assessment
- Risk identification, challenge discussion
- What's working / what's not
- File: `PARTNERSHIP_REFLECTION.md` (in project folder)
- Created and discussed during project close

**Project Index** (global)
- List of all projects with status
- Quick reference
- File: `projects/INDEX.md`

**Project Backlog** (global) - *Added in v1.1.0*
- Register of identified projects
- Priority and dependency analysis
- Informs workplan creation
- File: `projects/BACKLOG.md`
- Individual items: `projects/backlog/[project-name].md`
- Each has requirements reference (artifact-to-requirements pattern)

**CIP Register** (global) - *Formalized in v1.2.0*
- Continual Improvement Proposals
- Lightweight idea capture during project work
- Reviewed during project closure
- Register: `cips/CIP_REGISTER.md` (mutable, living artifact)
- CIP documents: `cips/CIP-NNN_*.md` (immutable)

### We Don't Use ❌

- Stage plans (sprint-sized projects = single stage)
- Exception reports (overkill for our context)
- Quality register (TDC covers this)
- Communication strategy (just human + AI)
- Detailed product descriptions (TDC work items are sufficient)

---

## Project Types and Requirements

### Dual Requirements Pattern

All projects have two sets of requirements:

**1. Base Requirements (PRINCE2_operational):** Universal project management structure
- Project lifecycle (initiate, execute, close)
- Artifacts (PROJECT_BRIEF, DAILY_LOG, RISKS, LESSONS_LEARNED, PARTNERSHIP_REFLECTION)
- Closure process (products validation, lessons synthesis, foundation maintenance)
- Applies to ALL projects
- This document defines base requirements

**2. Project Type Requirements:** Additional requirements specific to project type
- WOW guidance (collaboration mode, methodology)
- Success criteria specific to project type
- Artifact constraints (additional requirements on PRINCE2 artifacts)
- Examples: Explorative, Template-Based, Routine
- Stored in: `projects/project-types/[Type]_project_requirements_vX.Y.Z.md`

**Relationship:**
- Project type requirements **EXTEND** base requirements (additional, not conflicting)
- Both must be satisfied for project completion
- Both referenced in PROJECT_BRIEF first lines (enables quality assessment)
- Artifact-to-requirements pinning pattern (TDC framework)

### Available Project Types

**Explorative Project:**
- Architecture discovery, pattern creation
- Twin pair methodology (implementation + template)
- Collaborative mode (human + AI throughout)
- High uncertainty, evidence-based evolution
- Requirements: `projects/project-types/Explorative_project_requirements_v1.0.0.md`

**[Future Project Types]:**
- Template-Based Project (routine implementation with established patterns)
- Maintenance Project (updates, fixes, incremental improvements)
- Research Project (pure investigation, no implementation required)
- Emergency Project (urgent fixes, streamlined process)

### Creating New Project Types

**When to create new project type:**
- No existing project type fits your project characteristics
- New collaboration mode needed (different from existing types)
- Different methodology required (different from twin pairs, templates, etc.)
- Different success criteria (what "done" means differs significantly)

**How to create new project type:**
1. Create requirements document: `projects/project-types/[Type]_project_requirements_v1.0.0.md`
2. Define:
   - What characterizes this project type (when to use, when NOT to use)
   - WOW guidance (collaboration mode, methodology)
   - Success criteria specific to this type
   - Artifact requirements (additional constraints on PRINCE2 artifacts)
3. Document relationship: "This document **extends** PRINCE2_operational_vX.Y.Z"
4. Validate through use (first project of this type validates the requirements)
5. Update this document's "Available Project Types" section

**Pattern:** Create project type requirements when evidence shows need (not speculatively)

---

## Project Lifecycle

### 1. Initiate Project

**Create project folder:**
```
projects/XX-project-name/
├── PROJECT_BRIEF.md       (from template)
├── DAILY_LOG.md           (create empty)
├── RISKS.md               (create empty)
├── LESSONS_LEARNED.md     (create at project close)
└── PARTNERSHIP_REFLECTION.md (create at project close)
```

**Reference Requirements:**
PROJECT_BRIEF.md must reference requirements documents (first lines):
- **Line 1:** Project type requirements (e.g., `Requirements: ../project-types/Explorative_project_requirements_v1.0.0.md`)
- **Line 2:** PRINCE2_operational base requirements (e.g., `Requirements: projects/03-runtime-hello-world/PRINCE2_operational_v1.2.0.md`)
- Pattern: `Requirements: path/to/requirements_file.md` (one line per requirement)
- Enables quality assessment (artifact satisfies specific requirement versions)
- Follows artifact-to-requirements pinning pattern (TDC framework)

**Define Project Type:**
- Must specify project type in PROJECT_BRIEF metadata section
- Project type determines additional requirements and WOW guidance
- If no existing project type fits, create new project type requirements
- Examples: Explorative Project, Template-Based Project, Routine Project

**Define in PROJECT_BRIEF.md:**
- Products to deliver (what we're building)
- Quality criteria per product (TDC validation)
- Success criteria for overall project
- Scope, approach, constraints

**Initial risks:**
- Identify known risks in RISKS.md
- Document mitigation approaches

**Update INDEX.md:**
- Add project to global index with status "Initiated"

### 2. Execute Project

**Use DAILY_LOG.md throughout:**
- Record decisions made (and why)
- Note issues encountered (and resolution)
- Capture lessons as they emerge
- Document TDC validation results
- Link to commits where relevant
- Capture "For Project Closure" items

**Update RISKS.md as you learn:**
- Mark risks as materialized/avoided
- Add new risks discovered
- Update mitigation based on reality
- Document what you learned about each risk

**Format (keep it quick):**
```markdown
## 2025-11-08

**Decision:** Chose file-based storage for initial implementation
**Why:** Proven in product-poc, good enough to start, can migrate later
**Reference:** Commit abc123

**Issue:** Vite polyfills not working in Bare
**Resolution:** Need early exploration to validate compatibility
**Action:** Added to risk register

**For Project Closure:** Foundation update needed - add constraint about X
```

### 3. Close Project

**Foundation maintenance is built into project close - this ensures foundations stay current and validated.**

#### Step 1: Evaluate Products
- Review each product against its quality criteria (TDC validation)
- Ensure all products meet "good enough" standard
- Document any deviations or learnings

#### Step 2: Synthesize Project Learnings
- Review DAILY_LOG.md for patterns and key decisions
- Review RISKS.md for risk learnings and outcomes
- Create project's LESSONS_LEARNED.md synthesizing insights
- Organize by category (Methodology, Technology, Architecture, Process, etc.)
- Document what worked, what didn't, why it matters

#### Step 3: Foundation Maintenance

**Step 3.1: Extract Constraints**
- Extract key constraints/decisions from LESSONS_LEARNED.md
- Identify what needs to go into foundations vs stay in project

**Step 3.2: Update Foundations**
Two approaches based on scope:

**Small Updates (do at project closure):**
- Add constraints/decisions to foundation documents
- Update PRINCIPLES.md or other foundation docs
- **Reference the project for full context** (e.g., "Use AVRO client-side - see project 01/LESSONS_LEARNED.md")
- Don't duplicate detail - foundations stay minimal, project has the full story
- Update templates (PROJECT_BRIEF, etc.) if learnings reveal improvements

**Large Updates (create separate Foundation Update project):**
- When updates are substantial (restructuring, glossaries, major additions)
- Valid to create Foundation Update project
- Time appropriately (strategic sequencing - can gather evidence from multiple projects)
- Example: Project 03 deferred comprehensive foundation updates to Foundation Update project
- Foundation Update project handles: restructuring, catch phrase extraction, glossary creation, major enhancements

**Step 3.3: Re-Validate Foundations (if updated at closure)**
- **Run REQUIREMENTS.md validation tests on updated foundations**
- Ensure all tests still Green (or improve Yellow scores)
- If foundation updates broke validation, fix before closing project
- Foundation quality is maintained as part of project lifecycle
- Document validation results (update VALIDATION_RESULTS.md if needed)
- **Note:** If Foundation Update project created, validation happens there

**Step 3.4: Update Templates**
- Update templates if learnings reveal improvements
- Examples: PROJECT_BRIEF template, DAILY_LOG format, etc.

#### Step 3.5: CIP Review (Optional)

**When:** After foundation updates, if capacity allows

**Activities:**
- Review CIP Register for items from this project
- **Add new CIPs** discovered during project (may already be done during execution)
- Process one or more CIPs if capacity and priorities allow:
  - **Accept** → Create backlog item (complete project scope)
  - **Defer** → Leave in CIP Register (captured for future)
  - **Reject** → Move to Rejected CIPs with rationale (not pursuing)

**Optional because:** May be nothing to review/process, or capacity/priorities don't allow

**CIP Types:**
- Deferred work (infrastructure not ready yet)
- Enhancement ideas (improve existing functionality)
- New patterns (methodology or technical)
- Tooling needs (automation, validation, generation)

#### Step 3.6: Backlog Grooming (Optional)

**When:** After foundation updates, if needed

**Activities:**
- **Add new backlog items** discovered during project (may already be done during execution)
- Review backlog health:
  - Growth rate (adding faster than completing?)
  - Staleness (items no longer relevant?)
  - Priorities (reassess based on new learning)
  - Dependencies (changes due to project outcomes?)
- Update backlog item statuses:
  - Mark completed projects
  - Mark initiated projects
  - Update priorities if needed
- Consolidate or remove obsolete items
- Keep backlog manageable (8-10 active items ideal)

**Optional because:** May be nothing to groom (backlog stable, no updates needed)

**When to Groom:**
- Backlog grew during project (new items added)
- Priorities shifted based on project learning
- Dependencies changed (project unlocked or blocked other work)
- Items became obsolete (no longer relevant)

#### Step 3.7: Partnership Reflection (Mandatory)

**When:** After all other closure activities complete

**Activities:**
- Create PARTNERSHIP_REFLECTION.md
- Assess methodology effectiveness (what's working, what's not)
- Identify risks and challenges
- Document "local rules" gaps (areas needing clearer requirements)
- Discuss AI challenges and human strengths
- Capture insights for next project
- Similar to agile sprint review/retrospective

**Mandatory because:** Always valuable to reflect on partnership and methodology

**Discussion Topics:**
- What worked exceptionally well?
- What could be better / risks identified?
- What AI finds challenging (honest feedback)
- What human brings (meta-awareness, course correction, balance)
- Action items for next project
- Methodology adjustments needed?

**Output:**
- PARTNERSHIP_REFLECTION.md document
- Discussion with human (captured in document)
- Action items for methodology evolution
- Identified "local rules" gaps (feed to Foundation Update or CIP Register)

#### Step 4: Update Project Index
- Mark project status as "Complete" in projects/INDEX.md
- Add completion date
- Note key outcomes

#### Step 5: Final Commit and Push
- Ensure all project artifacts committed:
  - LESSONS_LEARNED.md
  - PARTNERSHIP_REFLECTION.md
  - Updated CIP_REGISTER.md (if CIP review done)
  - Updated BACKLOG.md (if grooming done)
- Ensure foundation updates committed (if done at closure)
- Ensure validation results committed (if foundations updated)
- Push to GitHub (keep in sync)

### Project Cannot Close Until:

**Base Requirements (PRINCE2):**
- ✅ All products validated (TDC)
- ✅ Project satisfies both requirement sets:
  - ✅ PRINCE2_operational base requirements
  - ✅ Project type specific requirements
- ✅ Lessons synthesized (LESSONS_LEARNED.md created)
- ✅ Foundations updated (at closure OR Foundation Update project initiated)
- ✅ Foundations re-validated (if updated at closure)
- ✅ CIP Register updated (new items added, if any discovered)
- ✅ Backlog updated (new items added, if any discovered)
- ✅ Partnership Reflection complete (PARTNERSHIP_REFLECTION.md + discussion)
- ✅ Everything committed and pushed

**Project Type Requirements:**
- ✅ Project type specific success criteria met
- ✅ Project type specific artifacts delivered
- Example (Explorative): Architecture validated, patterns established, evidence gathered

---

## Self-Improving Cycle

```
┌─────────────────────────────────────────────┐
│ Foundations + Templates                     │
│ (Validated constraints from all projects)   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Start New Project                           │
│ - Use current best templates                │
│ - Apply constraints from foundations        │
│ - Review previous project lessons           │
│ - Choose or create project type             │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Execute Project                             │
│ - Daily Log captures decisions/learnings    │
│ - Risk Register evolves with reality        │
│ - Products developed and validated          │
│ - CIPs captured as ideas emerge             │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Close Project                               │
│ - Validate products (TDC)                   │
│ - Synthesize lessons (LESSONS_LEARNED.md)   │
│ - Update foundations (or create project)    │
│ - Re-validate foundations (if updated)      │
│ - CIP review (optional)                     │
│ - Backlog grooming (optional)               │
│ - Partnership reflection (mandatory)        │
└──────────────┬──────────────────────────────┘
               │
               └──────────────┐
                              ▼
               ┌──────────────────────────────┐
               │ Improved & Validated          │
               │ Foundations                   │
               │ Ready for next project        │
               └───────────────────────────────┘
```

**Key principles:**
- Each project improves the system for the next project
- Lessons stay in project folders (full context preserved)
- Foundations contain constraints + references to projects
- Foundation quality maintained through re-validation at each project close
- Templates evolve based on what actually works
- Partnership reflection ensures methodology stays effective

---

## Integration with TDC

**Project Brief + TDC:**
- Products in PROJECT_BRIEF have quality criteria
- Quality criteria = TDC validation criteria
- "Done" = passes TDC validation

**Daily Log + TDC:**
- Record TDC validation results in Daily Log
- Capture why validation passed/failed
- Document iterations needed

**Lessons Learned + TDC:**
- TDC criteria that worked well → preserve for next time
- TDC criteria that weren't useful → refine
- New validation patterns discovered → add to TDC framework

**Artifact-to-Requirements Pinning + TDC:**
- Every artifact references its requirements (first lines)
- Enables quality assessment (did artifact satisfy its requirements?)
- Supports evolution (requirements can improve without retroactive burden)
- "Local Rules Apply" principle (fundamental to TDC)

---

## Roles (PRINCE2 Simplified)

**Executive (Human):**
- Sets strategic direction
- Approves project initiation
- Makes go/no-go decisions
- Defines success criteria
- Chooses or creates project type

**Project Manager (AI with Human):**
- AI proposes project structure and approach
- Human approves or refines
- AI executes day-to-day
- Collaborative decision-making per WOW.md and project type requirements

**Team (AI):**
- Implements products
- Validates against TDC criteria
- Updates living documents
- Proposes improvements

---

## Document Templates

### PROJECT_BRIEF.md Template

```markdown
Requirements: ../project-types/[ProjectType]_project_requirements_v1.0.0.md
Requirements: projects/03-runtime-hello-world/PRINCE2_operational_v1.2.0.md

# Project Brief: [Project Name]

**Project Code:** [XX-short-name]
**Project Type:** [Explorative Project | Template-Based Project | etc.]
**Start Date:** [YYYY-MM-DD]
**Status:** [Initiated | In Progress | Complete]

---

## Project Definition

### Background
[Why this project exists, context]

### Project Objective
[What we're trying to achieve]

### Business Justification
[Why this matters, what value it delivers]

### Project Type: [Project Type Name]

This is a **[Project Type]** - [brief description of what that means].

**Methodology:**
[Project type specific methodology - e.g., twin pairs for explorative]

**Structure:** [Products structure - e.g., 8 products in 4 twin pairs]

**Scope may adapt:** [If explorative or similar - note flexibility]

---

## Products to be Delivered

### Product 1: [Name]
**Description:** [What this product is]

**What we'll do:**
[Specific tasks/work to create this product]

**Quality Criteria (TDC Validation):**
- [Criterion 1]
- [Criterion 2]
- [How we'll validate it's done right]

**Completion Evidence:**
- [Specific files/artifacts created]

[Repeat for each product]

---

## Success Criteria

**Project succeeds when:**
- [Criterion 1 from PRINCE2]
- [Criterion 2 from PRINCE2]
- [Project type specific criteria]

**Evidence of success:**
- [What proves we succeeded]

---

## Approach
[How we'll execute, sequence, method]

**Timeline:** [Estimated duration]

**Adaptive:** [If applicable - how we'll adjust during execution]

---

## Scope

### In Scope
- [What's included]

### Out of Scope
- [What's explicitly not included]

### Open Questions (to be answered during exploration)
- [Question 1 - if explorative]
- [Question 2 - if explorative]

---

## Dependencies & Constraints

**Depends on:**
- [What we need to have]

**Unlocks:**
- [What this enables]

**Constraints:**
From foundations (see `foundations/WOW.md` for references):
- [Constraint 1 from Philosophy, PRINCE2, TDC]
- [Constraint 2]

---

## Risks
[Initial known risks - detailed in RISKS.md]

---

## Initial Assessment

**Complexity:** [Low | Medium | High]
**Risk:** [Low | Medium | High]
**Priority:** [Critical | High | Medium | Low]
**Duration:** [Time estimate]

---

## Notes
[Any additional context]
```

### DAILY_LOG.md Template

```markdown
# Daily Log: [Project Name]

Project log capturing decisions, issues, and lessons as they emerge.

---

## [YYYY-MM-DD]

**Decision:** [What was decided]
**Why:** [Rationale, context]
**Reference:** [Commit hash, file, or other reference]

**Issue:** [Problem encountered]
**Resolution:** [How it was resolved]
**Impact:** [What changed as a result]

**Lesson:** [Learning captured]
**Application:** [How this applies going forward]

**For Project Closure:** [Items to address during closure - foundation updates, CIPs, etc.]

**Note:** [General observation or context]

---

[Continue chronologically, newest at top or bottom - choose one convention]
```

### RISKS.md Template

```markdown
# Risk Register: [Project Name]

## Active Risks

### [Risk ID]: [Risk Title]
**Identified:** [YYYY-MM-DD]
**Probability:** [High | Medium | Low]
**Impact:** [High | Medium | Low]

**Description:** [What could go wrong]

**Mitigation:** [How we're addressing it]

**Status:** [Active | Materialized | Avoided]

**Updates:**
- [YYYY-MM-DD]: [Status update, what we learned]

---

## Closed Risks

[Risks that materialized or were avoided - preserve learnings]

---

## Risk Lessons

[What we learned about risk management from this project]
```

### LESSONS_LEARNED.md Template

**Created at project close** - synthesizes learnings from DAILY_LOG.md and RISKS.md

```markdown
Requirements: [Project type requirements reference]
Requirements: projects/03-runtime-hello-world/PRINCE2_operational_v1.2.0.md

# Lessons Learned: [Project Name]

**Project:** [XX-project-name]
**Type:** [Project Type]
**Completed:** [YYYY-MM-DD]
**Status:** [Project status at close]

---

## Executive Summary

[High-level summary of project, key achievements, critical discoveries]

---

## [Category - e.g., Methodology, Technology, Architecture, Process]

### L##: [Lesson Title]

**Lesson:** [The lesson - what worked, what didn't work, what we discovered]

**Context:** [Where/when this emerged]

**Evidence:** [Specific examples, data, references to commits or files]

**Why it matters:** [Impact, significance, how it affects future work]

**Application:** [How to apply this learning in future projects]

**Impact:** [Foundation update / CIP created / Backlog item added / Project-specific]

---

[Organize by categories, add categories as needed]

---

## Recommendations for Future Projects

[Actionable guidance based on lessons learned]

**For Foundations:** [What should go into foundations]
**For Backlog:** [New projects or updates needed]
**For CIP Register:** [Improvement ideas to capture]
**For Methodology:** [Process/WOW improvements]

---

## Summary

**What worked well:**
- [Key successes to repeat]

**What didn't work:**
- [Issues to avoid]

**What to change:**
- [Improvements for next project]

---

**Project Status:** [Complete | Complete with handoffs]
**Next Steps:** [What follows this project]
```

### PARTNERSHIP_REFLECTION.md Template

**Created at project close** - mandatory reflection on partnership and methodology

```markdown
**Created:** [YYYY-MM-DD] (Post-Project [XX] Closure)
**Context:** Reflection on methodology effectiveness, risks, and challenges
**Purpose:** Honest assessment to guide methodology evolution and risk management

---

# Partnership Reflection: [Project Name]

## Context

[Why this reflection, what triggered it, what we're examining]

**Note:** This discussion is a regular fixture - institutionalize reflection and course correction.

---

## What's Working Exceptionally Well 🎯

### [Area - e.g., Methodology, Collaboration, Documentation]

[What's working, why it works, evidence from project]

---

## What's Impressive About [Human/AI] Approach 🌟

### [Observation]

[Specific strength, examples, impact]

---

## What Could Be Better / Risks Identified ⚠️

### [Risk/Challenge Number]: [Risk/Challenge Title]

**Current State:** [What we observe]

**Question:** [What we're unsure about]

**Risk:** [What could go wrong]

**Mitigation Needed:** [How to address]

---

## What [AI/Human] Finds Challenging 🤔

### [Challenge Number]: [Challenge Title]

**The Challenge:** [What's difficult, why it's difficult]

**Current Approach:** [How we handle it now]

**What Would Help:** [Requirements, guidance, examples needed]

**Connection to "Local Rules":** [How clearer requirements would help]

---

## [Human/AI] Response

[Verbatim response from discussion partner]

### Key Insights from Response

[Analysis of insights, implications, next steps]

---

## Action Items for Discussion

### Priority 1 (Highest Concern)
- [Action item 1]
- [Action item 2]

### Priority 2 (Monitor Closely)
- [Action item 3]

### Priority 3 (Awareness)
- [Action item 4]

---

## "Local Rules" Gaps to Fill

**Areas Needing Requirements:**
1. [Gap 1 - area where clear requirements would help]
2. [Gap 2]

**Approach:** [How to create requirements - TDC methodology, templates, validation criteria]

---

## What I Truly Value 💙

[Appreciation, what makes partnership work, commitments]

---

## Bottom Line

**What's working:** [Summary]

**What to watch:** [Summary]

**What worries me (if honest):** [Concerns]

**What I'm confident about:** [Strengths]

**Most important:** [Key takeaway]

---

## Next Steps

1. [Action from this reflection]
2. [Decision to make]
3. [Follow-up needed]

---

**The fact that we're having this discussion is exactly what makes the whole thing work.**
```

### INDEX.md Structure

```markdown
# Projects Index

## Active Projects

| Code | Name | Status | Started | Products |
|------|------|--------|---------|----------|
| 01-preliminary-to-workplan | Preliminary to Workplan | In Progress | 2025-11-07 | 3 |

## Completed Projects

| Code | Name | Completed | Key Outcomes |
|------|------|-----------|--------------|
| [None yet] | | | |

## Planned Projects

| Code | Name | Description | Priority |
|------|------|-------------|----------|
| [None yet] | | | |

---

**Legend:**
- Status: Initiated | In Progress | Complete | On Hold
- Priority: High | Medium | Low
```

---

## Quality Standard

**"Good Enough" (PRINCE2 Principle)**
- Documents serve their purpose (enable effective work)
- Not perfect, adequate to deliver value
- Can improve based on usage
- Focus on removing blockers, not perfection

**Living Documents Principle:**
- Start minimal (good enough to work)
- Update during project (capture reality)
- Extract lessons at end (improve for next time)
- Evolve continuously (never "done")

---

## Example: First Project

Project `01-preliminary-to-workplan` demonstrates this approach:
- Has PROJECT_BRIEF.md ✓
- Has DAILY_LOG.md and RISKS.md ✓
- Will create project's LESSONS_LEARNED.md at close
- Will create PARTNERSHIP_REFLECTION.md at close
- Will extract constraints to foundations (with project references)
- Will re-validate foundations before closing
- Will improve templates for project 02

**Bootstrap:** Project 01 establishes the living documents pattern and foundation maintenance process that all future projects will use.
