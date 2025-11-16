# Project Requirements v1.3.1

**Version:** 1.3.1
**Created:** Project 05 (v1.3.1 - added Blank Project type)
**Status:** Active
**Applies to:** All formal project work in projects/ folder

Requirements for project management using PRINCE2 principles adapted for SPL2 context.

---

## Philosophy

**Lightweight, not heavy** - Use PRINCE2 principles for structure and visibility, skip bureaucracy.

**Living artifacts** - Documents that learn and evolve, not static paperwork.

**Self-improving** - Each project makes the next one better.

---

## Artifact Management

These artifacts are maintained continuously throughout project lifecycle (not phase-specific).

### DAILY_LOG.md

**Purpose:** Chronological record of decisions, issues, and learnings throughout project.

**Format:** Append-only (immutable once written). Add new entries, don't edit existing.

**Content:**
- Decisions made (and why)
- Issues encountered (and resolution)
- Lessons as they emerge
- Planning sessions (JIT planning during Execute)
- Stage completion notes
- "For Project Closure" items

**Example entry:**
```markdown
## 2025-11-13

**Decision:** Chose twin pair structure for products
**Why:** Exploration Project requires creating deliverable + template in parallel
**Reference:** PROJECT_PLAN.md

**Planning Session:** Stage 1 - Installation and Setup
- Approach: Test on Linux first, document platform differences
- Quality criteria: Installation documented, no blockers identified
- Tasks: Install Bare, run hello world, document process

**Stage 1 completed:** Basic installation working, documented in SETUP.md
```

### RISKS.md

**Purpose:** Track risks throughout project lifecycle.

**Format:** Append-only. Add risks as discovered, update status with new entries.

**Content:**
- Risk identification (probability, impact)
- Mitigation approaches
- Status updates (active, materialized, avoided)
- Risk learnings

**Example:**
```markdown
### R01: Platform Incompatibility
**Identified:** 2025-11-13
**Probability:** Medium | **Impact:** High

**Description:** Bare may have fundamental incompatibilities with our architecture

**Mitigation:** Early validation through hello world exploration

**Updates:**
- 2025-11-14: Risk avoided - Bare works as expected for basic use
```

---

## Project Lifecycle

Projects follow a 4-stage lifecycle: Create → Initiate → Execute → Close

### 1. Create Project

**Purpose:** Set up project structure and capture WHAT needs to be done from backlog item.

**Activities:**

**1.1 Create project folder:**
```
projects/XX-project-name/
├── PROJECT_BRIEF.md       (created at Create - WHAT)
├── PROJECT_PLAN.md        (created at Initiate - high-level HOW)
├── DAILY_LOG.md           (created at Create - empty)
├── RISKS.md               (created at Create - empty)
├── LESSONS_LEARNED.md     (created at Close)
└── PARTNERSHIP_REFLECTION.md (created at Close)
```

**1.2 Create PROJECT_BRIEF.md - homogeneous compilation:**

**Compile from backlog item detail + addons (if any):**
- Backlog item detail provides base WHAT
- Addons integrated seamlessly (not separate sections)
- Result: unified description of WHAT needs to be achieved

**Requirements references (first lines):**
- **Line 1:** Project type requirements (from backlog item detail)
  - Example: `Requirements: projects/04-bare-runtime-hello-world/Exploration_project_requirements_v1.0.0.md`
- **Line 2:** Project requirements (current version from glossary)
  - Example: `Requirements: projects/04-bare-runtime-hello-world/Project_requirements_v1.3.0.md`

**Project metadata:**
- Project code (XX-project-name)
- Project type (from backlog item detail)
- Start date
- Status: "Active"

**WHAT to achieve (compiled from backlog item + addons):**
- Background (why this project exists)
- Project objective (what we're trying to achieve)
- Business justification (why this matters)
- Scope boundaries (what's in/out)
- Dependencies (what's needed before/after)
- Any initial constraints identified

**NOT included at Create stage (that's HOW):**
- Products to deliver (defined during Initiate)
- Quality criteria (defined during Initiate)
- Success criteria (defined during Initiate)
- Detailed approach (defined during Initiate/Execute)

**1.3 Create empty artifacts:**
- DAILY_LOG.md (empty, ready for use)
- RISKS.md (empty, risks identified during Initiate)

**1.4 Remove from BACKLOG.md:**
- Remove top item from backlog (project now active)

---

**Create stage complete when:**
- ✅ Project folder exists in projects/
- ✅ PROJECT_BRIEF.md exists with requirements, metadata, and WHAT
- ✅ DAILY_LOG.md and RISKS.md exist (empty)
- ✅ Top backlog item removed

**Ready for Initiate stage:** Project structure in place, WHAT captured, now plan HOW.

---

## Available Project Types

Project type determines additional requirements and collaboration mode for Initiate stage.

**Blank Project:**
- Straightforward execution with clear deliverables
- Uses base Project requirements only (no special methodology)
- Standard collaboration approach (not mandated COLLABORATIVE)
- Requirements: None (base Project requirements apply)

**Exploration Project:**
- Architecture discovery through twin pair methodology
- High uncertainty requiring evidence-based evolution
- Collaborative initiation (human + AI planning together)
- Requirements: `Exploration_project_requirements_v1.0.0.md`

**[Future project types]:**
- Template-Based Project (routine implementation with established patterns)
- Maintenance Project (updates, fixes, incremental improvements)
- Research Project (pure investigation, no implementation required)
- Emergency Project (urgent fixes, streamlined process)

**Note:** If no existing project type fits, create new project type requirements during Create stage.

---

### 2. Initiate Project

**Purpose:** Detailed analysis and high-level workplan (NOT detailed JIT planning).

**Activities:**

**2.1 Detailed analysis and understanding:**
- Review and understand all requirements (Project + Project Type)
- Analyze constraints from requirements
- Understand dependencies and context
- Identify approach patterns appropriate for project type

**2.2 Create PROJECT_PLAN.md with high-level workplan:**
- **Number of products/stages** (e.g., "4 twin pairs", "3 phases")
- **Brief description each** (one-line WHAT for each product/stage)
- **Rough sequence/dependencies** (what must happen before what)
- **NOT detailed approach** (that's JIT during Execute)
- **NOT quality criteria** (that's JIT during Execute)
- **NOT task breakdown** (that's JIT during Execute)

**Example high-level workplan:**
```markdown
## Products

1. **Product 1: Bare Installation & Setup**
   - Install Bare, validate basic execution, document workflow

2. **Product 2: Platform Familiarization**
   - Library landscape, module system, development workflow

3. **Product 3: Installation Template**
   - Generalized installation guidance for future projects

4. **Product 4: Platform Validation Template**
   - Reusable pattern for validating new platforms
```

**2.3 Identify and document initial risks:**
- Add known risks to RISKS.md
- Document mitigation approaches
- Risks will evolve during execution

**2.4 Validate accommodation of all requirements:**
- Confirm Project requirements will be satisfied
- Confirm Project Type requirements will be satisfied
- All requirements used for validation at project close

---

**Initiate stage complete when:**
- ✅ PROJECT_PLAN.md exists with high-level workplan
- ✅ Initial risks documented in RISKS.md
- ✅ All requirements understood and accommodated in plan

**Ready for Execute stage:** High-level plan in place, ready for JIT detailed planning.

---

### 3. Execute Project

**Purpose:** Iteratively plan and implement products through JIT planning.

**Execute = Iteration of: Plan → Implement**

**3.1 Plan (JIT - Just-In-Time):**

**Detail plan for next chunk:**
- Select next product/stage from PROJECT_PLAN
- Define detailed approach for THIS chunk
- Define quality criteria for THIS chunk
- Break down into tasks for THIS chunk
- Follow project type requirements (e.g., twin pairs for Exploration)

**Document planning session in DAILY_LOG:**
```markdown
**Planning Session:** Product 1 - Bare Installation & Setup
- Approach: Test on Linux first, document platform-specific issues
- Quality criteria: Installation works, basic execution validated, process documented
- Tasks: Download Bare, install, run hello world, test file I/O, document findings
```

**May create stage-specific files:**
- Created during Plan step as needed
- No rigid naming (minimal and complete)
- Examples: `STAGE_01_SETUP.md`, `INSTALLATION.md`, `FINDINGS.md`

**3.2 Implement:**

**Do the planned work:**
- Execute tasks from Plan step
- Build/code/document per plan

**Update DAILY_LOG continuously:**
- Decisions made (and why)
- Issues encountered (and resolution)
- Learnings as they emerge
- References to commits/files

**Update RISKS.md as reality emerges:**
- Add new risks discovered
- Update existing risk status
- Document risk learnings

**Note stage/product completion in DAILY_LOG:**
```markdown
**Product 1 completed:** Bare installation working on Linux, documented in SETUP.md
```

**3.3 Iterate:**

Repeat Plan → Implement for each product/stage until all complete.

---

**Execute stage complete when:**
- ✅ All products/stages from PROJECT_PLAN implemented
- ✅ DAILY_LOG documents full execution journey
- ✅ All deliverables created

**Ready for Close stage:** Work complete, ready to synthesize learnings and close.

---

### 4. Close Project

**Purpose:** Evaluate results, synthesize learnings, maintain mutable spots, evaluate against requirements.

**Close Process (project reached end):**

**4.1 Evaluate Products:**
- Review each product against its quality criteria
- Ensure all products meet "good enough" standard
- Document any deviations or learnings
- Products delivered per PROJECT_PLAN

**4.2 Synthesize Project Learnings:**
- Review DAILY_LOG.md for patterns and key decisions
- Review RISKS.md for risk learnings and outcomes
- Create LESSONS_LEARNED.md synthesizing insights
- Organize by category (Methodology, Technology, Architecture, Process, etc.)
- Document what worked, what didn't, why it matters

**4.3 Review and Act on Learnings:**
- Review LESSONS_LEARNED.md collaboratively
- Identify actionable items from learnings:
  - CIPs (Continual Improvement Proposals) for methodology improvements
  - Backlog items for new work identified
  - Stepping stones work needed
  - Foundation or glossary updates needed
- Create identified items (CIPs, backlog items, etc.)
- Not housekeeping - this is acting on project-specific discoveries

**4.4 Housekeeping (Optional):**
- Maintain mutable spots discovered during project
- See Spots requirements for housekeeping activities per spot type
- Examples: Update foundations, update glossaries, add CIPs, groom backlog
- Optional because: May be nothing to maintain, or capacity doesn't allow
- Housekeeping details defined in spot requirements (friction reduction)

**4.5 Project Evaluation:**
- Evaluate project against all requirements (Project + Project Type)
- If evaluation passes → Continue to Final Commit/Push
- If evaluation fails:
  - Try to fix issues identified
  - If can't fix → Document as risks/learnings in LESSONS_LEARNED.md
  - Project still completes (not aborted)

**4.6 Final Commit and Push:**
- Add DAILY_LOG entry: "**Project Completed:** [date] - [brief summary]"
- Ensure all project artifacts committed:
  - LESSONS_LEARNED.md
  - Any housekeeping updates (if done)
  - Updated mutable spots (if housekeeping done)
- Commit with descriptive message
- Push to GitHub (keep in sync)

---

**Close complete when:**
- ✅ All products evaluated
- ✅ Learnings synthesized (LESSONS_LEARNED.md)
- ✅ Learnings reviewed and actionable items created
- ✅ Housekeeping done (if applicable)
- ✅ Project evaluated against requirements
- ✅ DAILY_LOG shows "Project Completed"
- ✅ Everything committed and pushed

**Project status:** Completed

---

### 4-Alt. Abort Project

**Purpose:** Wrap up project stopped before completion, preserve learnings.

**When to abort:** Project stopped mid-execution (priority change, blocking issue, resource constraints, etc.)

**Abort Process:**

**4-Alt.1 Synthesize Learnings:**
- Review DAILY_LOG.md for what was accomplished
- Review RISKS.md for what was discovered
- Create LESSONS_LEARNED.md synthesizing insights
- Document why project aborted
- Document what was learned despite incompletion
- Document current state and handoff information (if resuming later)

**4-Alt.2 Housekeeping (Optional):**
- Same as Close process
- Maintain mutable spots if applicable
- See Spots requirements for details

**4-Alt.3 Final Commit and Push:**
- Add DAILY_LOG entry: "**Project Aborted:** [date] - [reason for abort]"
- Ensure artifacts committed:
  - LESSONS_LEARNED.md (partial project learnings)
  - Any housekeeping updates (if done)
  - Current work state (as-is)
- Commit with descriptive message
- Push to GitHub

---

**Abort complete when:**
- ✅ Learnings synthesized (even if partial)
- ✅ Housekeeping done (if applicable)
- ✅ DAILY_LOG shows "Project Aborted [reason]"
- ✅ Everything committed and pushed

**Project status:** Aborted

---

## Notes

- **Create is mechanical:** Set up structure, compile WHAT from backlog item + addons
- **Initiate is analysis:** Understand requirements, create high-level workplan (not detailed)
- **Execute is iterative:** Plan (JIT) → Implement → repeat
- **Addons:** Integrated seamlessly into PROJECT_BRIEF at Create (homogeneous compilation)
- **Project exists** when folder created with required artifacts (operational definition)
- **Single source of truth:** Glossary lookup for current requirement versions

---

**Changes from v1.2.0 (PRINCE2_operational):**

**Renamed and restructured:**
- **File name:** PRINCE2_operational → Project_requirements (consistent naming)
- **4-stage lifecycle:** Create → Initiate → Execute → Close (added Create, restructured others)
- **Abort process:** Documented as Close alternative (preserve learnings from stopped projects)

**Create stage (new):**
- Mechanical setup: folder structure, empty artifacts
- Compile PROJECT_BRIEF from backlog item + addons (homogeneous compilation)
- PROJECT_BRIEF contains WHAT (not HOW): background, objective, justification, scope, dependencies, constraints
- Remove from BACKLOG.md at Create (one-way flow)
- No INDEX.md updates (removed INDEX.md entirely)

**Initiate stage (restructured):**
- High-level workplan only (NOT detailed planning)
- Create PROJECT_PLAN.md: products/stages, brief descriptions, rough sequence
- No JIT detail (that's Execute)
- Removed collaboration mode references (project type specific, not base requirement)
- Initial risks documented

**Execute stage (restructured):**
- Iteration of: Plan (JIT) → Implement
- JIT planning documents in DAILY_LOG or stage files
- Stage completion noted in DAILY_LOG
- No rigid upfront planning

**Close stage (simplified):**
- 5 steps: Evaluate Products, Synthesize Learnings, Housekeeping (optional), Project Evaluation, Final Commit/Push
- Housekeeping: References Spots requirements (friction reduction - details not here)
- Removed INDEX.md updates (no INDEX.md)
- DAILY_LOG entry: "Project Completed [date]"
- Project evaluation: try to fix, document if can't, still completes

**Abort process (new):**
- 3 steps: Synthesize Learnings, Housekeeping (optional), Final Commit/Push
- Preserves learnings from stopped projects
- DAILY_LOG entry: "Project Aborted [date] - [reason]"

**Artifact changes:**
- **Removed INDEX.md:** Status tracked via DAILY_LOG, tooling auto-generates later
- **Status values:** Active (default) / Completed (DAILY_LOG) / Aborted (DAILY_LOG)
- **PROJECT_PLAN.md:** New artifact for high-level workplan (created at Initiate)
- **Artifact Management:** DAILY_LOG and RISKS top-level (not phase-specific), append-only format
- **Immutable artifacts:** PROJECT_BRIEF, PROJECT_PLAN, LESSONS_LEARNED.md, PARTNERSHIP_REFLECTION.md
- **Append-only artifacts:** DAILY_LOG.md, RISKS.md

**Integration changes:**
- **Backlog integration:** Remove from backlog at Create, addons compiled into PROJECT_BRIEF
- **Glossary lookup:** Current requirements from glossary (not hardcoded paths)
- **Housekeeping:** Defined in Spots requirements (not detailed here)
- **Requirements references:** Project type + Project requirements (not "PRINCE2_operational")

**Rationale:**
- **Separates concerns:** Create (mechanical), Initiate (analysis), Execute (JIT), Close (wrap up)
- **Agile approach:** JIT planning vs rigid upfront planning, enables adaptation
- **Reduces friction:** Housekeeping in Spots requirements, no INDEX.md maintenance, minimal overhead
- **Preserves learnings:** Even aborted projects capture what was learned
- **Clear artifacts:** Immutable vs append-only distinction, lifecycle explicit
- **Single-thread model:** One project at a time, abort when priorities change

---

**Changes from v1.3.0:**

**Added Blank Project type:**
- New project type for straightforward execution with clear deliverables
- Uses base Project requirements only (no special methodology)
- Standard collaboration (not mandated COLLABORATIVE like Exploration)
- No additional requirements document needed
- Added to Available Project Types section
