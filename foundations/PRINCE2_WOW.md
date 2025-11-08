# PRINCE2 Ways of Working

## Philosophy

**Lightweight, not heavy** - Use PRINCE2 principles for structure and visibility, skip bureaucracy.

**Living artifacts** - Documents that learn and evolve, not static paperwork.

**Self-improving** - Each project makes the next one better.

## What We Use (and Don't Use)

### We Use ✅

**Project Brief** (per project)
- Defines what we're building (products)
- Clear quality criteria (TDC validation)
- Success criteria
- Template: `PROJECT_BRIEF.md`
- Already validated in project 01

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

**Project Index** (global)
- List of all projects with status
- Quick reference
- File: `projects/INDEX.md`

### We Don't Use ❌

- Stage plans (sprint-sized projects = single stage)
- Exception reports (overkill for our context)
- Quality register (TDC covers this)
- Communication strategy (just human + AI)
- Detailed product descriptions (TDC work items are sufficient)

## Project Lifecycle

### 1. Initiate Project

**Create project folder:**
```
projects/XX-project-name/
├── PROJECT_BRIEF.md       (from template)
├── DAILY_LOG.md           (create empty)
├── RISKS.md               (create empty)
└── LESSONS_LEARNED.md     (create at project close)
```

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
```

### 3. Close Project

**Foundation maintenance is built into project close - this ensures foundations stay current and validated.**

**Step 1: Evaluate Products**
- Review each product against its quality criteria (TDC validation)
- Ensure all products meet "good enough" standard
- Document any deviations or learnings

**Step 2: Synthesize Project Learnings**
- Review DAILY_LOG.md for patterns and key decisions
- Review RISKS.md for risk learnings and outcomes
- Create project's LESSONS_LEARNED.md synthesizing insights
- Organize by category (Methodology, Technology, Architecture, Process, etc.)
- Document what worked, what didn't, why it matters

**Step 3: Update Foundations**
- Extract key constraints/decisions from project learnings
- Update PRINCIPLES.md or other foundation docs with new constraints
- **Reference the project for full context** (e.g., "Use AVRO client-side - see project 01/LESSONS_LEARNED.md")
- Don't duplicate detail - foundations stay minimal, project has the full story
- Update templates (PROJECT_BRIEF, etc.) if learnings reveal improvements

**Step 4: Re-Validate Foundations**
- **Run REQUIREMENTS.md validation tests on updated foundations**
- Ensure all tests still Green (or improve Yellow scores)
- If foundation updates broke validation, fix before closing project
- Foundation quality is maintained as part of project lifecycle
- Document validation results (update VALIDATION_RESULTS.md if needed)

**Step 5: Update Project Index**
- Mark project status as "Complete" in projects/INDEX.md
- Add completion date
- Note key outcomes

**Step 6: Final Commit and Push**
- Ensure all project artifacts committed (including LESSONS_LEARNED.md)
- Ensure foundation updates committed
- Ensure validation results committed
- Push to GitHub (keep in sync)

**Project cannot close until:**
- ✅ All products validated (TDC)
- ✅ Lessons synthesized (LESSONS_LEARNED.md created)
- ✅ Foundations updated with new constraints
- ✅ Foundations re-validated (all tests pass)
- ✅ Everything committed and pushed

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
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Execute Project                             │
│ - Daily Log captures decisions/learnings    │
│ - Risk Register evolves with reality        │
│ - Products developed and validated          │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Close Project                               │
│ - Validate products (TDC)                   │
│ - Synthesize lessons (LESSONS_LEARNED.md)   │
│ - Update foundations (new constraints)      │
│ - Re-validate foundations (REQUIREMENTS.md) │
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

## Roles (PRINCE2 Simplified)

**Executive (Human):**
- Sets strategic direction
- Approves project initiation
- Makes go/no-go decisions
- Defines success criteria

**Project Manager (AI with Human):**
- AI proposes project structure and approach
- Human approves or refines
- AI executes day-to-day
- Collaborative decision-making per WOW.md

**Team (AI):**
- Implements products
- Validates against TDC criteria
- Updates living documents
- Proposes improvements

## Document Templates

### PROJECT_BRIEF.md Template

```markdown
# Project Brief: [Project Name]

**Project Code:** [XX-short-name]
**Start Date:** [YYYY-MM-DD]
**Status:** [Initiated | In Progress | Complete]

## Project Definition

### Background
[Why this project exists, context]

### Project Objective
[What we're trying to achieve]

### Business Justification
[Why this matters, what value it delivers]

## Products to be Delivered

### Product 1: [Name]
**Description:** [What this product is]

**What we'll do:**
[Specific tasks/work to create this product]

**Quality Criteria (TDC Validation):**
- [Criterion 1]
- [Criterion 2]
- [How we'll validate it's done right]

**Deliverables:**
- [Specific files/artifacts created]

[Repeat for each product]

## Approach
[How we'll execute, sequence, method]

## Scope
### In Scope
- [What's included]

### Out of Scope
- [What's explicitly not included]

## Success Criteria
**Project succeeds when:**
- [Criterion 1]
- [Criterion 2]

**Project fails if:**
- [Failure condition 1]

## Dependencies & Constraints
**Dependencies:**
- [What we need to have]

**Constraints:**
- [What limits us]

## Risks
[Initial known risks - detailed in RISKS.md]

## Timebox
**Estimated Effort:** [Time estimate]
**Target Completion:** [Date or "Flexible"]

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
# Lessons Learned: [Project Name]

Project learnings synthesized at close. Key constraints extracted to foundations with references back to this document.

**Project:** [XX-project-name]
**Completed:** [YYYY-MM-DD]

---

## [Category - e.g., Methodology, Technology, Architecture, Process]

### [Lesson Title]
**From:** [DAILY_LOG.md entry, RISKS.md risk, or general observation]
**Date Discovered:** [YYYY-MM-DD]

**What we learned:**
[The lesson - what worked, what didn't work, what we discovered]

**Why it matters:**
[Impact, significance, how it affects future work]

**Evidence:**
[Specific examples, data, references to commits or files]

**Application going forward:**
[How to apply this learning in future projects]

**Foundation update:**
[What constraint/decision was added to foundations, or "None - project-specific"]

---

[Organize by categories, add categories as needed]

## Summary

**What worked well:**
- [Key successes to repeat]

**What didn't work:**
- [Issues to avoid]

**What to change:**
- [Improvements for next project]
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

## First Project Example

Project `01-preliminary-to-workplan` demonstrates this approach:
- Has PROJECT_BRIEF.md ✓
- Has DAILY_LOG.md and RISKS.md ✓
- Will create project's LESSONS_LEARNED.md at close
- Will extract constraints to foundations (with project references)
- Will re-validate foundations before closing
- Will improve templates for project 02

**Bootstrap:** Project 01 establishes the living documents pattern and foundation maintenance process that all future projects will use.
