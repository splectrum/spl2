# Risk Register: Initial Workplan

## Active Risks

### R01: Foundation Restructuring Breaks Validation

**Identified:** 2025-11-08
**Probability:** Medium
**Impact:** High

**Description:** During Product 1 (Foundation Analysis & Restructuring), changes to foundation documents could break REQUIREMENTS.md validation tests. Currently all 8 tests are Green - restructuring might introduce inconsistencies, gaps, or bloat.

**Mitigation:**
- Re-validate after each significant change
- Maintain backup before restructuring
- Keep changes incremental
- Cross-reference with REQUIREMENTS.md tests throughout
- Product 1 quality criteria includes "Passes REQUIREMENTS.md validation"

**Status:** Active - will be highly relevant during Product 1 work

**Updates:**
- 2025-11-08: Risk identified during project initiation. Mitigation strategy defined.

---

### R02: Templates Too Specific to This Project

**Identified:** 2025-11-08
**Probability:** Medium
**Impact:** Medium

**Description:** Templates created during explorative project might be too tailored to Project 02 specifics and not generalizable for future use. Could result in templates that only work for this exact scenario.

**Mitigation:**
- Consciously generalize during template creation
- Test mental model: "Would this work for a different project?"
- Include examples but make framework reusable
- Document assumptions and constraints in templates
- Template quality criteria includes "Reusable for future work"

**Status:** Active - relevant throughout all twin pair work

**Updates:**
- 2025-11-08: Risk identified during project initiation. Mitigation through conscious generalization.

---

### R03: Dependency Analysis Misses Critical Items

**Identified:** 2025-11-08
**Probability:** Medium
**Impact:** High

**Description:** During Product 5 (Dependency & Priority Analysis), could miss critical work items, dependencies, or priorities. Would result in workplan that doesn't reflect reality or has major gaps.

**Mitigation:**
- Cross-reference multiple sources (THINGS_TO_DO.md, foundations, lessons learned, CIPs)
- Review with fresh eyes after initial analysis
- Check against PRINCIPLES_DETAILED.md for exploration items
- Product 5 quality criteria includes "All major work areas covered"
- Systematic methodology rather than ad-hoc thinking

**Status:** Active - will be critical during Product 5 work

**Updates:**
- 2025-11-08: Risk identified during project initiation. Mitigation through systematic approach.

---

### R04: Lose Parallel Creation (Fall into Sequential Mode)

**Identified:** 2025-11-08
**Probability:** Medium
**Impact:** Medium

**Description:** Explorative project methodology requires creating deliverable + template in parallel with cross-pollination. Risk of falling into sequential mode (finish deliverable, then create template) which loses the key benefit of the methodology.

**Mitigation:**
- Explicitly track parallel work in DAILY_LOG
- CIP-001 (Product Register) would help visibility if implemented
- Remind ourselves: work on BOTH at same time
- Document cross-pollination insights as they happen
- Review parallelism at each twin pair transition

**Status:** Active - relevant throughout all twin pair work

**Updates:**
- 2025-11-08: Risk identified during project initiation. First project with this methodology - need vigilance.

---

### R05: Workplan Too Detailed or Too Vague

**Identified:** 2025-11-08
**Probability:** Medium
**Impact:** Medium

**Description:** During Product 7 (Headline Workplan), difficulty finding right level of detail. Too detailed = planning everything upfront (violates exploration principle). Too vague = no actionable guidance.

**Mitigation:**
- Define "headline" criteria upfront in Product 7
- Aim for: phases/chunks, exploration projects identified, dependencies visible
- NOT: detailed task lists, time estimates, resource allocation
- Validate granularity against ability to initiate next project
- Product 7 quality criteria includes appropriate level

**Status:** Active - will be critical during Product 7 work

**Updates:**
- 2025-11-08: Risk identified during project initiation. Need clear definition of "headline" level.

---

### R06: AI Falls into Execution Mode Instead of Collaborative Discovery

**Identified:** 2025-11-08
**Probability:** Medium
**Impact:** High

**Description:** Explorative projects, especially those touching WOW and foundations, require tight collaboration for creative cross-pollination. Risk of AI falling into autonomous execution mode instead of collaborative discovery. This loses the key benefit: maximizing creative output through human-AI collaboration and kindling new ideas together.

**Why it matters:**
- Explorative work needs collaborative discovery, not solo execution
- Cross-pollination between human and AI IS the methodology
- AI creative interventions are as important as human ones
- Completeness and minimal principles safeguard creative freedom within boundaries
- Working alone misses opportunities for better solutions

**Mitigation:**
- AI asks questions and proposes options rather than executing alone
- Present multiple approaches for discussion
- Seek human intuition and ideas before proceeding
- Document collaborative insights in DAILY_LOG
- Remember: exploration = discovery together, not delivery alone

**Status:** Active - critical throughout all explorative work

**Updates:**
- 2025-11-08: Risk identified when AI started to execute Foundation Analysis alone. Caught early and corrected to collaborative approach.

---

### R07: Tendency to Over-Engineer

**Identified:** 2025-11-10
**Probability:** High
**Impact:** Medium

**Description:** Throughout Project 02, consistent pattern of over-engineering emerged. We add structure, tests, documentation, and complexity before validating it's needed. Examples: elaborate validation frameworks, premature product types, unnecessary templates, excessive detail. Don't yet understand "minimal but complete" in practice - tendency is to build more than necessary.

**Why it matters:**
- Wastes effort on unnecessary work
- Creates maintenance burden
- Obscures what actually matters
- Contradicts "minimal and complete" core principle
- Slows down progress with premature optimization

**Pattern observed:**
- Foundation analysis: Too much detail initially
- Twin Pair 2: Planned but unnecessary (skipped)
- Backlog requirements: 8 tests → simplified to 2
- Twin Pair 3 template: Thought we needed separate doc, requirements sufficient
- Product types: Added prematurely

**Mitigation:**
- Question every addition: is this actually needed NOW?
- Start minimal, add based on evidence (not speculation)
- Trust "good enough" really is good enough
- Catch ourselves when adding premature structure
- Practice "comfort with imperfection"
- Collaborative checkpoints: ask "are we over-engineering this?"
- Evidence-based evolution: only add when pain is felt

**Status:** Active - ongoing risk requiring active management

**Updates:**
- 2025-11-10: Risk identified after multiple instances during Project 02. Mindset change required. Added to lessons learned.

---

## Closed Risks

*(None yet)*

---

## Risk Lessons

*(To be captured at project close)*

---

**Next Risk Review:** During twin pair transitions and at project close
