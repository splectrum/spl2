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

## Closed Risks

*(None yet)*

---

## Risk Lessons

*(To be captured at project close)*

---

**Next Risk Review:** During twin pair transitions and at project close
