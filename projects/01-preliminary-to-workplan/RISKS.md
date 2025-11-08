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

**Status:** Mitigated ✅

**Updates:**
- 2025-11-08: Creating lightweight templates. Focus on living artifacts that learn. Skipping heavy PRINCE2 elements (stage plans, exception reports, etc.). Looking good so far.
- 2025-11-08: Products 2 and 3 complete. Methodology proven lightweight and usable through project execution. Successfully applied PRINCE2 + TDC without bureaucracy. Risk mitigated through actual practice.

---

### R03: Foundation Documents Drift from "Minimal and Complete"
**Identified:** 2025-11-08
**Probability:** Medium
**Impact:** Medium

**Description:** Over time, foundation documents may accumulate content and lose their "concise overview" quality. Without systematic evaluation techniques, they could become bloated (not minimal) or miss essential information (not complete), defeating their purpose.

**Evidence of Risk:**
- PRINCIPLES.md initially grew to 288 lines, had to refactor to 120 lines
- Tension between adding necessary information and staying concise
- Fresh Context Test depends on foundations being scannable

**Current Mitigation:**
- Pattern established: detail lives in projects, foundations have constraints + references
- Re-validation required at project close (REQUIREMENTS.md 8 tests)
- DAILY_LOG captures decision to move LESSONS_LEARNED and TEMPLATE_GUIDANCE to project folders

**Gap:**
- No systematic evaluation techniques beyond REQUIREMENTS.md tests
- Need criteria to answer: "Is this minimal enough?" and "Is this still complete?"
- Need techniques for: detecting bloat, measuring scanability, identifying what can move to projects

**Future Mitigation:**
- Exploration project to develop foundation evaluation methodology
- Products: Evaluation checklist, refactoring patterns, "health check" process
- Integrate enhanced evaluation into project close validation

**Status:** Active - pattern established, techniques needed

**Updates:**
- 2025-11-08: Risk identified during project close discussion. Pattern for decluttering established (detail to projects), but evaluation methodology needed for systematic quality maintenance.

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
