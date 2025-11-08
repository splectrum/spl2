# Risk Register: Preliminary to Workplan

## Active Risks

### R01: Methodology Too Complex to Use
**Identified:** 2025-11-07
**Probability:** Medium
**Impact:** Medium

**Description:** PRINCE2 + TDC methodology could become too heavy/bureaucratic to use consistently, defeating the purpose of lightweight approach.

**Mitigation:**
- Keep minimal - only use artifacts that provide value
- Test with first project (this one)
- Iterate based on actual usage
- "Good enough" quality standard, not perfection

**Status:** Active → Mitigating through Product 2 and 3 design

**Updates:**
- 2025-11-08: Creating lightweight templates. Focus on living artifacts that learn. Skipping heavy PRINCE2 elements (stage plans, exception reports, etc.). Looking good so far.

---

### R02: Bare Runtime Compatibility Issues
**Identified:** 2025-11-07
**Probability:** Medium
**Impact:** High

**Description:** Vite + AVRO polyfills proven for browser (product-poc), but Bare runtime compatibility unknown. Could require significant tooling changes.

**Mitigation:**
- Early exploration to validate compatibility
- May need abstraction layer if compatibility difficult
- Alternative: keep development in Node.js with Bare compatibility constraints
- Document compatibility requirements

**Status:** Active - needs early exploration

**Updates:**
- 2025-11-07: Documented in PRODUCT-POC-FINDINGS.md as exploration item. Will address in early project.

---

## Closed Risks

### R03: Repository Review Reveals Fundamental Issues
**Identified:** 2025-11-07
**Probability:** Low
**Impact:** High
**Status:** Avoided ✅

**Description:** Repository reviews (product-poc, spl1) could reveal fundamental flaws in SPL2 approach requiring major rethink.

**What happened:**
- product-poc validation: Technology stack proven, AVRO client-side works, testing approach validated
- spl1 validation: Core principles sound (API-centric, state-backed, Kafka records)
- Key lesson: SPL1 was too restrictive (problem), but principles were right (validated)

**Resolution:** Reviews strengthened foundations rather than undermining them. All validation tests improved from 3 Green/5 Yellow to 8 Green/0 Yellow.

**Lesson:** Repository reviews were extremely valuable. Real evidence much stronger than theoretical design.

---

### R04: Foundations Have Blocking Gaps
**Identified:** 2025-11-07
**Probability:** Medium
**Impact:** High
**Status:** Avoided ✅

**Description:** Initial foundations documentation might have critical gaps that block starting work.

**What happened:**
- Initial validation: 3 Green, 5 Yellow, 0 Red
- Assessment: "Good enough" to start work, but improvements needed
- Repository reviews provided concrete evidence and examples
- Re-validation: 8 Green, 0 Yellow, 0 Red

**Resolution:** Gaps closed through:
- Clear SPL2 definition added
- Repository findings provide real-world validation
- Concrete examples from prototypes
- Three-tier documentation structure
- Maturity ratings clarify confidence levels

**Lesson:** "Good enough" quality standard works. Started with Yellow scores (acceptable), improved to all Green through iteration. Perfect upfront not needed.

---

## Risk Lessons

### What We Learned

**Risk mitigation through iteration works:**
- Started with "good enough" foundations
- Repository reviews revealed no blocking issues
- Iterated documentation to address Yellow scores
- All tests Green without major rework

**Early exploration is valuable:**
- Bare runtime compatibility flagged early
- Can plan exploration project before committing to implementation
- Better to know what we don't know

**Living artifacts reduce process risk:**
- Lightweight PRINCE2 approach mitigates "too heavy" risk
- Templates designed to evolve based on usage
- Bootstrap approach (Product 2 and 3 validate themselves)

**Real evidence beats theoretical design:**
- Repository reviews provided concrete validation
- 194+ tests, performance metrics, actual implementations
- Much stronger than design discussions
- Should continue evidence-based approach

---

**Next Risk Review:** End of project (when closing Project 01)
