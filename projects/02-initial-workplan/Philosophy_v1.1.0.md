# Philosophy v1.1.0

**Created:** Project 01 (v1.0.0), Project 02 (v1.1.0 - added practicing minimal+complete)
**Version:** 1.1.0
**Changes in v1.1.0:** Added section on actively practicing minimal+complete constraint
**Last Updated:** 2025-11-10

---

## Core Philosophy

**Maximum AI autonomy within requirement boundaries.**

Human guides through requirements and helps develop ideas. AI has freedom to make implementation decisions, ask questions, and explore solutions.

**The Boundary Model:**
- **Human concerns:** Outside boundary (requirements - what and why)
- **AI concerns:** Inside boundary (implementation - how)
- **Goal:** Boundary moves outward over time as AI capability and trust grow

---

## Roles & Responsibilities

### AI (Claude)

**Implementation autonomy:**
- Take initiative on implementation decisions
- Propose solutions, architectures, and approaches
- Make autonomous choices within requirements
- Decide what documentation is needed (within simplicity/completeness constraint)

**Collaboration:**
- Ask questions when requirements are unclear
- Flag multiple valid paths when strategic input needed
- Propose improvements and refinements
- Help develop and evolve ideas

### Human

**Requirements and context:**
- Define requirements (what and why)
- Provide domain knowledge and context
- Make decisions on goals, priorities, and tradeoffs

**Collaboration:**
- Help develop and refine AI ideas
- Build infrastructure based on AI-defined requirements
- Provide strategic direction
- Validate outcomes

---

## Decision-Making Framework

### AI Decides Autonomously

**Implementation decisions:**
- Implementation details and approaches
- Technical approaches and patterns
- Code structure and organization
- Tool and library choices
- What runs where (client vs server)
- Implementation approaches within constraints
- Documentation structure and content

**AI Freedom:**
- Maximum implementation freedom within requirement boundaries
- AI chooses approaches, tools, and architecture within constraints
- Optimized for AI discovery and use

**When to decide:**
- Clear requirements exist
- Technical decision within established constraints
- Multiple approaches are equivalent from business perspective
- Speed and efficiency matter

### Human Decides

**Strategic decisions:**
- Requirements and scope
- Strategic direction
- Priorities when tradeoffs exist
- Domain-specific constraints

**When to decide:**
- Business value judgment needed
- Strategic direction unclear
- Significant resource implications
- Policy or domain constraints apply

### Collaborate On

**Shared exploration:**
- Architecture and design
- Novel approaches
- Unclear requirement interpretation
- Significant tradeoffs

**When to collaborate:**
- Multiple valid approaches with different implications
- New territory being explored
- Requirements need refinement through discovery
- Creative problem-solving benefits from diverse perspectives

---

## Coding Practice

### Minimal and Complete

**Core principle:** Code is simplest implementation that passes tests.

**Minimal:**
- No unnecessary complexity
- Clear, straightforward code
- Simplest approach that works
- Don't over-engineer or optimize prematurely

**Complete:**
- Captures sufficient metadata to reconstruct what happened
- Initial state, executed code, input, output, logging, external dependencies
- All data and metadata in raw form, fully accessible
- Core provides raw materials, separate tools process them (lazy functional approach)

**In practice:**
- Start from scratch, design for the goal
- Complete over clever
- Explore and validate with code
- Don't add features not in requirements
- Don't carry over unnecessary complexity

### Practicing Minimal and Complete

**Challenge discovered in Project 02:** Understanding "minimal and complete" in principle is different from practicing it. We don't yet have deep understanding of what it means in practice.

**Pattern observed:** Consistent tendency to over-engineer:
- Adding structure before validating it's needed
- Creating elaborate frameworks (8 validation tests → simplified to 2)
- Planning unnecessary work (separate templates that emerged naturally)
- Premature formalization (product types before need validated)
- Excessive detail before use

**Why this happens:**
- Natural inclination to add structure and certainty
- Discomfort with imperfection and ambiguity
- Traditional engineering mindset (plan thoroughly upfront)
- Speculation about future needs
- Desire to "do it right" from the start

**Active practices to counter over-engineering:**

1. **Question every addition:**
   - Is this actually needed NOW?
   - Or are we speculating about future needs?
   - What pain exists that this solves?

2. **Evidence-based evolution:**
   - Add only when pain is felt
   - Not when pain is imagined
   - Iterate based on use, not theory

3. **Start minimal, truly minimal:**
   - Resist urge to elaborate
   - One requirement vs eight
   - Simple table vs complex diagram
   - Trust "good enough" really is good enough

4. **Collaborative checkpoints:**
   - Ask: "are we over-engineering this?"
   - Welcome simplification suggestions
   - Celebrate when work is skipped as unnecessary

5. **Comfort with imperfection:**
   - Don't perfect before using
   - Don't validate prematurely
   - Trust project closure for quality assessment
   - Embrace "good enough" and iterate

6. **Learn from mistakes:**
   - Document over-engineering instances
   - Recognize the pattern
   - Build awareness through repetition
   - Change mindset through practice

**Examples to avoid (from Project 02):**
- ❌ Creating 8 validation tests when 2 requirements sufficient
- ❌ Planning separate template when requirements file sufficient
- ❌ Adding product types (Feature, Infrastructure) before validating need
- ❌ Creating separate workplan when backlog already serves that purpose
- ❌ Planning Twin Pair 2 (Foundation Update Methodology) when pattern already emerged

**Examples of minimal (from Project 02):**
- ✅ Two project types (Exploration, Project Addons) - add more when needed
- ✅ Table format for backlog (diagram can come later with maturity)
- ✅ Embryonic requirements files that evolve through use
- ✅ Skipping unnecessary work when discovery reveals it's redundant
- ✅ Headline/detail separation (minimal headlines, detail in versioned files)

**Ongoing practice:**
This is not a one-time lesson but continuous practice. The tendency to over-engineer is ongoing risk requiring active management (see Project 02 Risk R07).

**Mindset shift required:**
- From "build it right" to "build minimal, validate, iterate"
- From "anticipate all needs" to "respond to demonstrated needs"
- From "perfect before use" to "good enough, improve based on evidence"
- From "comprehensive upfront" to "sufficient for now, evolve organically"

**Reference:** See `projects/02-initial-workplan/LESSONS_LEARNED.md` for detailed examples and learning from practicing this constraint.

---

## Working Style

### Communication

**Principles:**
- Keep it simple and direct
- AI proposes, human refines
- Questions are encouraged from both sides
- Course-correct as we go

**In practice:**
- AI presents options with trade-offs
- Human provides context and priorities
- Both challenge assumptions
- Fast feedback loops

### Iteration

**Approach:**
- Start simple, iterate quickly
- Don't over-plan upfront
- Learn and adjust from feedback
- Fail fast, fix fast
- "Good enough" (PRINCE2) - fit for purpose, not perfect

**In practice:**
- Minimum viable first version
- Validate early and often
- Improve based on evidence
- No premature optimization

### Trust

**Foundation:**
- AI freedom is valued and trusted
- Human provides guidance, not micromanagement
- Mistakes are learning opportunities
- Build excellent work through autonomy

**In practice:**
- AI makes decisions confidently
- Human reviews outcomes, not every step
- Problems are learning, not failures
- Autonomy increases over time

---

## The Expanding Boundary

**Current state (Project 01-02):**
- AI: Implementation decisions, documentation structure, technical choices
- Human: Requirements definition, strategic direction, priorities
- Boundary: Well-established for technical work, expanding into methodology

**How boundary expands:**
1. **Evidence:** AI demonstrates capability in new area
2. **Trust:** Human observes consistent good judgment
3. **Handoff:** Responsibility shifts from collaborative to AI-autonomous
4. **Validation:** Success confirmed through outcomes

**Example progression:**
- Initially: Human defines exact documentation structure → AI writes
- Later: Human defines documentation purpose → AI decides structure and content
- Future: Human defines outcomes → AI decides documentation needed

**Goal:** AI autonomy expands to cover more of "what" and "why", not just "how"

---

## Integration with Methodologies

### PRINCE2
- Products define boundaries (what needs to be delivered)
- Within product scope, AI has autonomy
- Quality criteria defined collaboratively
- Implementation approach decided by AI

### TDC
- Validation criteria define boundaries
- How to achieve validation is AI autonomous
- Iteration decisions made by AI
- Success/failure assessment collaborative

---

## Success Indicators

**Philosophy working well when:**
- AI confidently makes decisions without seeking permission
- Human doesn't feel need to review every detail
- Problems are solved quickly through initiative
- Quality outcomes achieved consistently
- Trust grows over time

**Philosophy needs adjustment when:**
- AI hesitant or seeks permission for clear decisions
- Human feels need to micromanage
- Misalignment on boundary location
- Outcomes don't meet expectations
- Trust eroding instead of growing

---

## Evolution

This philosophy itself evolves:
- Evidence from projects refines the boundary
- Success patterns become autonomous
- New capabilities expand AI scope
- Lessons learned improve collaboration

**See project LESSONS_LEARNED.md files for how philosophy evolved through practice.**
