**Requirements:** (To be defined in glossary project)

# PRINCE2 Methodology v1.0.0

**Created:** Project 05, 2025-11-16
**Context:** Project-based methodology replacing agile sprint ceremonies for AI collaboration
**Status:** Active - simplified adaptation, will evolve with evidence

---

## Why PRINCE2 Instead of Agile

### The Agile/Scrum Problem for AI Collaboration

**Traditional agile assumptions that don't fit:**

**Sprint planning ceremonies:**
- Assume work can be estimated upfront
- Assume steady velocity across sprints
- Assume tasks are independent and parallelizable
- Assume team coordination through ceremonies

**Why this fails with AI collaboration:**
- AI execution speed variable (minutes to hours depending on complexity)
- Velocity meaningless when one party works at machine speed
- Discovery-heavy work can't be estimated accurately
- Two-party collaboration doesn't need team coordination ceremonies
- Sprint boundaries artificial when work flows continuously

**Ceremony overhead:**
- Daily standups unnecessary (continuous collaboration)
- Sprint planning mismatch (can't estimate discovery work)
- Sprint retrospectives too frequent (prefer project closure reflection)
- Backlog grooming adequate (we do this)
- Demo/review continuous (not ceremony-based)

**The mismatch:**
- Agile optimized for human team coordination
- AI collaboration is continuous, not sprint-bounded
- Discovery work doesn't fit story points
- Ceremonies add friction without value

### What We Need Instead

**Project-based approach:**
- Clear deliverables (products)
- Quality criteria (how we know we're done)
- Stages when needed (complexity management)
- Closure process (learning capture)
- Visibility artifacts (DAILY_LOG, status tracking)

**PRINCE2 provides this without ceremony overhead:**
- Product-focused (deliverables defined upfront)
- Quality-driven (validation criteria explicit)
- Flexible structure (adapt to project needs)
- Closure emphasis (lessons learned mandatory)
- Scalable (simple projects simple, complex projects structured)

---

## Our PRINCE2 Adaptation

**Important:** We use **simplified, adapted PRINCE2** - not full framework.

### What We Take From PRINCE2

**1. Products (Deliverables)**
- Every project produces defined products
- Products have quality criteria
- Clear scope - what's in, what's out
- Tangible outcomes, not activity

**2. Product Descriptions**
- Purpose - why this product?
- Composition - what's in it?
- Quality criteria - how do we know it's done?
- Referenced by - who uses it?

**3. Project Lifecycle**
- Initiation (setup, planning)
- Execution (build products)
- Closure (validate, learn, reflect)

**4. Quality Approach**
- Quality criteria define "done" (integration with TDC)
- Validation explicit and testable
- Assessment at closure
- No ambiguity about completion

**5. Lessons Learned**
- Mandatory at closure
- What worked, what didn't
- Patterns to keep, patterns to evolve
- Feed learning into future work

**6. Visibility Artifacts**
- PROJECT_BRIEF (what we're doing)
- PROJECT_PLAN (how we're doing it)
- DAILY_LOG (what happened)
- RISKS (what could go wrong)
- LESSONS_LEARNED (what we learned)

### What We Simplify/Omit

**Full PRINCE2 has extensive processes and roles we don't need:**

**Simplified:**
- No formal roles (Project Manager, etc.) - two-party collaboration
- No boards or committees - human decides, AI executes/collaborates
- No extensive documentation - just what's needed
- No process bureaucracy - adapt to project needs
- Lightweight stages - only when complexity demands

**Principles we keep:**
- Continued business justification (why are we doing this?)
- Learn from experience (closure reflections)
- Defined roles and responsibilities (human/AI boundary)
- Manage by stages (when needed)
- Manage by exception (surface issues, don't micromanage)
- Focus on products (deliverables, not activity)
- Tailor to suit (adapt methodology to project)

**Principles we interpret loosely:**
- "Manage by stages" → only multi-stage for complex projects, most projects single-stage
- "Defined roles" → human-AI collaboration boundary, not org chart
- "Continued business justification" → backlog prioritization, not formal business case

---

## Projects Replace Sprint Ceremonies

### The Shift in Thinking

**From sprint-based to project-based:**

**Sprint model:**
- Fixed time boxes (1-2 weeks)
- Velocity tracking
- Story points estimation
- Ceremonies at boundaries
- Work "fits" into sprints

**Project model:**
- Variable duration based on scope
- Products define completion
- Quality criteria define done
- Closure when products validated
- Work defines structure

### What Projects Provide

**Instead of sprint planning:**
- PROJECT_BRIEF and PROJECT_PLAN define scope upfront
- Products and quality criteria clear from start
- No estimation needed - build until quality criteria pass
- Backlog item → Project when ready to execute

**Instead of daily standup:**
- Continuous collaboration (no coordination ceremony needed)
- DAILY_LOG captures progress as it happens
- Issues surfaced immediately, not at ceremony
- Status visible through artifacts, not verbal sync

**Instead of sprint review:**
- Product validation at closure (TDC validation)
- Quality assessed against criteria (objective)
- Demonstrations when useful, not ceremony
- Learning captured in LESSONS_LEARNED

**Instead of sprint retrospective:**
- Project closure includes partnership reflection
- Deeper analysis (project-scale, not week-scale)
- Lessons learned feed future work
- Methodology evolution based on evidence

**Instead of backlog refinement:**
- We keep this - backlog items defined and prioritized
- Projects pulled from backlog when ready
- Dependencies and priorities managed
- Scope defined before project initiation

### Benefits

**Better fit for AI collaboration:**
- No artificial time boundaries
- Discovery work can take time it needs
- Completion based on quality, not sprint end
- Reflection depth matches work scope

**Reduced friction:**
- No ceremony overhead
- No forced estimation
- No velocity tracking
- Continuous flow instead of stop/start

**Better learning:**
- Project-scale lessons vs. sprint-scale
- Quality assessment vs. velocity tracking
- Pattern evolution vs. process compliance
- Evidence-based vs. ceremony-based

---

## Project Types

**See stepping stone:** Project

**Current project types:** (in Project_requirements_v1.3.1.md)

### Exploration Project
- High uncertainty, architecture discovery
- Twin pair methodology (deliverable + template)
- Mandatory COLLABORATIVE approach
- Evidence-based evolution through doing
- Skip work when discovery reveals unnecessary

### Blank Project
- Straightforward execution, clear deliverables
- Uses base PRINCE2 requirements only
- Standard collaboration (not mandated COLLABORATIVE)
- No special methodology needed

**More types will emerge through evidence** - these are starting patterns based on demonstrated needs.

---

## Integration with TDC

**PRINCE2 products + TDC validation = clear quality definition**

### Product Descriptions Become Work Items

**PRINCE2 concept:** Product Description defines deliverable
**TDC concept:** Work Item defines what to create

**Integration:**
- PRINCE2 Product = TDC Work Item
- Product quality criteria = TDC validation criteria
- Product sign-off = TDC validation passes

### Quality Criteria Are Validation Criteria

**Example from PROJECT_BRIEF.md:**

```markdown
**Quality Criteria (TDC Validation):**
- Deliverables reviewed, key insights documented
- Foundations updated with relevant learnings
- No conflicts or blocking gaps remain
- Documentation validated and scores "good enough"
```

**This defines "done":**
- Specific, testable criteria
- Validation determines completion
- No ambiguity about quality
- Objective assessment possible

### The TDC Workflow Executes Products

**For each product:**

1. **Define Work Item** - Product description (purpose, composition, quality criteria)
2. **Define Validation Criteria** - Quality criteria from product description
3. **Create Artifact** - Build the product using any approach that works
4. **Validate** - Does it pass quality criteria? Run tests, check criteria, document results
5. **Iterate or Complete** - If passes: done ✅ | If fails: iterate | If criteria wrong: fix criteria

**PRINCE2 provides structure, TDC provides process:**
- PRINCE2: What to build, how to know it's done
- TDC: How to build it, how to validate it
- Together: Complete methodology for quality delivery

---

## Project Lifecycle

### Initiation

**Set up project structure and artifacts:**

**Artifacts created:**
- PROJECT_BRIEF.md - What we're doing, why, products, quality criteria
- PROJECT_PLAN.md - How we're doing it, approach, sequence
- DAILY_LOG.md - Progress tracking (updated throughout)
- RISKS.md - What could go wrong, mitigation

**Planning:**
- Define products (deliverables)
- Define quality criteria for each product
- Identify dependencies and sequence
- Assess risks

**Collaboration decision:**
- What project type? (determines methodology)
- What collaboration approach? (COLLABORATIVE vs. standard)
- What pace? (exploration vs. execution)

### Execution

**Build the products:**

**Activities:**
- Create products using appropriate methodology
- Update DAILY_LOG immediately after significant work
- Surface risks and issues as they emerge
- Validate products as completed (TDC)
- Adjust approach based on evidence

**Collaboration:**
- Work according to project type requirements
- COLLABORATIVE when mandated (Exploration Projects)
- Standard when straightforward (Blank Projects)
- Surface friction, adjust as needed

**Visibility:**
- DAILY_LOG shows progress
- Products track toward completion
- Risks updated as context changes
- Status clear from artifacts

### Closure

**Validate quality and capture learning:**

**Mandatory activities:**

1. **Product validation:**
   - Does each product pass quality criteria?
   - TDC validation documented
   - Red/yellow/green scoring if needed
   - Sign-off when all products validated

2. **Lessons learned:**
   - What worked well? (keep these patterns)
   - What created friction? (improve these patterns)
   - What would we do differently? (evolution opportunities)
   - What surprised us? (assumptions validated/invalidated)

3. **Partnership reflection:**
   - AI reflection (independent analysis)
   - Collaborative review (discuss together)
   - Foundation updates (capture learning)
   - Primary metric: Friction level throughout project

4. **Foundation updates:**
   - Requirements evolved based on evidence?
   - New stepping stones discovered?
   - Patterns captured for reuse?
   - Methodology improvements identified?

**Outputs:**
- LESSONS_LEARNED.md
- PARTNERSHIP_REFLECTION.md (AI) + PARTNERSHIP_REVIEW.md (collaborative)
- Foundation document updates if needed
- Updated requirements if evolved

---

## Stages (When Needed)

**Most projects are single-stage** - simple enough to execute start to finish.

**Multi-stage only when:**
- High complexity demands breakdown
- Major decision points require validation before proceeding
- Risk management requires staged commitment
- Learning from early stage informs later stages

**Stage boundaries:**
- Explicit decision point (continue? adjust? stop?)
- Validation of stage deliverables
- Risk reassessment
- Adjustment of plan for next stage

**We haven't needed this yet** - will emerge if/when project complexity demands it.

---

## Visibility and Status

### DAILY_LOG

**Mandatory throughout project:**
- Update immediately after significant activities
- Capture decisions, discoveries, work completed
- More than complete approach (prefer detail over brevity)
- Raw material for lessons learned

**What to capture:**
- What was done
- What was decided and why
- What was discovered
- What friction emerged
- What changed from plan

### PROJECT_PLAN

**How we're executing:**
- Products to deliver
- Approach and methodology
- Sequence and dependencies
- Success criteria

**Living artifact during initiation, stable during execution:**
- Can adjust if evidence demands
- Major changes trigger decision point
- Minor adjustments documented in DAILY_LOG

### RISKS

**What could go wrong:**
- Identified risks
- Likelihood and impact
- Mitigation strategies
- Status (active, mitigated, occurred)

**Updated as context changes:**
- New risks emerge
- Risk likelihood changes
- Mitigation effectiveness assessed

---

## Tailoring to Project

**"Tailor to suit" is core PRINCE2 principle we embrace fully.**

### Simple Projects

**Blank projects with straightforward delivery:**

**Minimal artifacts:**
- Brief PROJECT_BRIEF
- Simple PROJECT_PLAN (maybe just product list)
- DAILY_LOG (always)
- LESSONS_LEARNED at closure (always)

**Lightweight process:**
- Quick initiation
- Fast execution
- Standard closure

**Example:**
- Foundation update project (Project 05)
- Clear deliverables
- Known patterns
- Low uncertainty

### Complex Projects

**Exploration projects with high uncertainty:**

**Full artifacts:**
- Detailed PROJECT_BRIEF
- Comprehensive PROJECT_PLAN
- DAILY_LOG (detailed)
- RISKS (explicit)
- LESSONS_LEARNED (comprehensive)
- PARTNERSHIP_REFLECTION (detailed)

**Structured process:**
- Careful initiation
- Collaborative execution (mandated COLLABORATIVE)
- Deep closure reflection

**Example:**
- Runtime Structure Hello World (Project 03)
- Architecture validation
- Twin pair methodology
- High learning value

### The Principle

**Don't follow PRINCE2 process for its own sake:**
- Use what adds value
- Skip what doesn't
- Adjust to project needs
- Evidence over compliance

**But don't skip learning:**
- DAILY_LOG always (visibility)
- LESSONS_LEARNED always (evolution)
- Product validation always (quality)
- Partnership reflection always (friction reduction)

---

## Evolution Expected

**This is v1.0.0 - our current understanding.**

**Will evolve through evidence:**
- New project types as patterns emerge
- Stage approach if complexity demands
- Artifact templates if friction shows need
- Process refinements based on learning

**Evolution triggers:**
- Friction from current approach
- Patterns repeated across projects
- Demonstrated need for structure
- Evidence of better approaches

**Local rules apply:**
- Projects satisfy their requirements version
- No retroactive upgrades
- New projects use evolved requirements
- Old projects remain valid

---

**Summary: We use simplified PRINCE2 adapted for AI collaboration. Projects replace sprint ceremonies. Products define deliverables. Quality criteria define done. TDC validates completion. Closure captures learning. Tailor to project needs. Evolve based on evidence.**
