**Type:** plain req
**Extends:** project

# blank project

## Spec

Base project type with PRINCE2 project requirements. Straightforward execution with clear deliverables. All other project types extend from this.

Scope: Project.

Purpose: For work that is clear and straightforward, following established patterns with low uncertainty.

### Project Phases

#### 1. Create Project

Autonomous activity.

- Create project folder: `projects/NN-project-name/`
- Create PROJECT_BRIEF.md (from backlog item if applicable)
- Create RISKS.md
- Create DAILY_LOG.md
- Remove backlog item (if project originated from backlog)
- Update INDEX.md with new project

#### 2. Initiate Project

**Reference requirements in PROJECT_BRIEF preamble:**
- Look up project type in glossary (stepping stones)
- Get req file from Req column
- Reference in PROJECT_BRIEF first line

**Define in PROJECT_BRIEF.md:**
- Products to deliver (what we're building)
- Quality criteria per product (TDC validation)
- Success criteria for overall project
- Scope, approach, constraints

**Initial risks:**
- Identify known risks in RISKS.md
- Document mitigation approaches

#### 3. Execute Project

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

#### 4. Close Project

**Step 1: Evaluate Products**
- Review each product against its quality criteria (TDC validation)
- Ensure all products meet "good enough" standard
- Document any deviations or learnings

**Step 2: Synthesize Project Learnings**
- Review DAILY_LOG.md for patterns and key decisions
- Review RISKS.md for risk learnings and outcomes
- Create project's LESSONS_LEARNED.md synthesizing insights
- Organize by category (Methodology, Technology, Architecture, Process, etc.)

**Step 3: Foundation Maintenance**
- Extract key constraints/decisions from LESSONS_LEARNED.md
- Small updates: do at project closure
- Large updates: create separate Foundation Update project

**Step 4: CIP Review (Optional)**
- Review CIP Register for items from this project
- Add new CIPs discovered during project
- Process CIPs if capacity allows

**Step 5: Backlog Grooming (Optional)**
- Add new backlog items discovered during project
- Review backlog health (growth rate, staleness, priorities)
- Update backlog item statuses

**Step 6: Partnership Reflection (Mandatory)**
- Create PARTNERSHIP_REFLECTION.md
- Assess methodology effectiveness
- Identify risks and challenges
- Document friction points and learnings

**Step 7: Update Project Index**
- Mark project status as "Complete" in projects/INDEX.md
- Add completion date
- Note key outcomes

**Step 8: Final Commit and Push**
- Ensure all project artifacts committed
- Push to remote

### Project Cannot Close Until

- All products validated (TDC)
- Lessons synthesized (LESSONS_LEARNED.md created)
- Partnership Reflection complete
- Everything committed and pushed

## Self-eval

- [ ] Has required project artifacts (BRIEF, PLAN, LOG, RISKS)
- [ ] Clear deliverables defined
- [ ] Follows project phases (create, initiate, execute, close)
- [ ] Low uncertainty execution
- [ ] Backlog item removed (if applicable)
- [ ] Closure checklist completed

## Comments

Other project types extend this: exploration project adds twin pair methodology and collaboration requirements.

Evolved from blank_project_v1.0.1.md - added phases from PRINCE2_operational_v1.2.0.md.
