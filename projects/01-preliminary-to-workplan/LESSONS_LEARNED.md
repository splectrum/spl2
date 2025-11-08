# Lessons Learned

Cross-project learnings that improve our foundations and approach.

**Last Updated:** 2025-11-08

---

## Methodology

### Exploration-Driven Development Works

**Source:** SPL1 and product-poc analysis
**Date:** 2025-11-07

**What we learned:**
Multiple exploration iterations before "production" implementation leads to better outcomes. product-poc did this well (prototypes 1, 2, 2b, 3) and converged on good implementations. SPL1 committed too early without sufficient exploration.

**Why it matters:**
Code explores better than design documents. Trying multiple approaches reveals what actually works vs. what sounds good in theory.

**Application:**
- Sprint-sized exploration projects before production implementation
- Test alternatives, learn what works
- Iterate and converge through validated practice
- Don't commit to implementations too early

**Action taken:**
- Documented in PRINCIPLES_DETAILED.md
- Project structure supports sprint-sized explorations
- "Good enough" quality standard encourages iteration

---

### Test Driven Creation (TDC) Extends Beyond Code

**Source:** Project 01 - preliminary-to-workplan
**Date:** 2025-11-08

**What we learned:**
TDC validation framework works for non-code artifacts (documentation, findings documents). Repository reviews with findings documents demonstrated TDC applied to research/analysis work.

**Why it matters:**
Same quality approach works across all work types - code, documentation, designs, research. Creates consistent quality standard.

**Application:**
- Define quality criteria for any artifact type
- Validation criteria = "tests" for that artifact
- Document findings = validation results
- Iterate until criteria pass

**Action taken:**
- TDC framework applies to all products in PROJECT_BRIEF
- VALIDATION_RESULTS.md demonstrates TDC for documentation
- PRODUCT-POC-FINDINGS.md and SPL1-FINDINGS.md show TDC for research

---

## Technology

### AVRO Client-Side is Viable and Preferred

**Source:** product-poc prototype-2b review
**Date:** 2025-11-07

**What we learned:**
AVRO works client-side with acceptable bundle size (~80KB gzipped). Performance is excellent (<1ms validation). Single source of truth across client and server is achievable.

**Why it matters:**
Eliminates need for separate client-side validation (like Zod) plus server AVRO. Simpler architecture, one schema language, offline capability.

**Application:**
- Use AVRO for all schema validation (client + server)
- Configure Vite with required polyfills (documented in PRINCIPLES_DETAILED.md)
- 80KB gzipped is acceptable for functionality provided

**Action taken:**
- Added to PRINCIPLES.md as validated approach
- Documented Vite configuration in PRINCIPLES_DETAILED.md
- Marked as "Established" maturity (🔵)

---

### Proven Testing Stack: Vitest + Playwright

**Source:** product-poc prototypes
**Date:** 2025-11-07

**What we learned:**
Vitest (unit/integration) + Playwright (E2E) + React Testing Library (components) works exceptionally well. 194+ tests in prototype-2b validated this stack.

**Why it matters:**
Proven through extensive real use. Fast execution, excellent DX, comprehensive coverage. No need to experiment with alternatives.

**Application:**
- Use this testing stack for all SPL2 projects
- Vitest for unit and integration tests
- Playwright for E2E and browser testing
- React Testing Library for component testing

**Action taken:**
- Documented in PRINCIPLES.md as validated tooling
- Marked as "Established" maturity (🔵)

---

## Architecture

### Avoid Over-Restriction Without Purpose

**Source:** SPL1 analysis
**Date:** 2025-11-07

**What we learned:**
SPL1 implementation was "too restrictive without reason due to poor design." Unnecessary constraints (5-layer config hierarchy, rigid patterns) created complexity without benefit.

**Why it matters:**
Constraints should serve the goals (completeness, correctness), not restrict unnecessarily. Minimal implementation = only constrain what MUST be constrained.

**Application:**
- Question every constraint: "Is this necessary for completeness?"
- Default to freedom, constrain only when required
- Simple implementation that achieves the goal
- Maximum freedom for AI implementation choices

**Action taken:**
- Made explicit in PRINCIPLES.md: "Maximum AI Freedom"
- SPL1-FINDINGS.md documents this lesson
- Core principle: Minimal implementation, complete output

---

### API-Centric Design Pattern Works

**Source:** SPL1 analysis
**Date:** 2025-11-07

**What we learned:**
API-centric pattern (all methods in API work on same structure) enables natural composition and pipelining. Validated through SPL1 implementation.

**Why it matters:**
Right abstraction level for DSL building. Methods compose naturally within API, type compatibility implicit.

**Application:**
- Adopt API-centric design for SPL2
- All methods in an API operate on shared data structure
- Clear domain boundaries (API = domain)
- State-backed APIs for execution context

**Action taken:**
- Documented in SPL1-FINDINGS.md
- Will inform pipelining mechanism design
- Marked as pattern to adopt

---

## Process

### Lightweight PRINCE2 Provides Value

**Source:** Project 01 - preliminary-to-workplan
**Date:** 2025-11-08

**What we learned:**
Living artifacts approach (Daily Log, Risk Register, Lessons Learned) provides structure without bureaucracy. Self-improving system where each project makes next one better.

**Why it matters:**
Visibility and learning without overhead. Documents serve purpose (enable work, capture learning) not compliance.

**Application:**
- Use core PRINCE2 artifacts only (skip heavy ones)
- Focus on living documents that evolve
- Extract lessons to improve templates
- Each project feeds wisdom to next

**Action taken:**
- Created PRINCE2_WOW.md documenting approach
- Templates provided for living artifacts
- Integration with TDC defined

---

## Documentation

### Three-Tier Documentation Works Well

**Source:** Project 01 foundations validation
**Date:** 2025-11-08

**What we learned:**
Concise overview (PRINCIPLES.md) + detailed explanations (PRINCIPLES_DETAILED.md) + project-specific (findings) provides good balance.

**Why it matters:**
Quick reference available, deep context when needed, project learnings preserved. Different needs served by appropriate document level.

**Application:**
- Keep overview docs concise (120 lines or less)
- Create _DETAILED versions when extended context needed
- Project-specific findings separate from principles
- Maturity ratings show confidence levels

**Action taken:**
- Restructured foundations to follow this pattern
- All 8 validation tests now Green
- Pattern documented in REQUIREMENTS.md

---

## Notes

This document grows with each project. Add lessons that:
- Affect how we work going forward
- Would have helped if we knew it earlier
- Change our understanding of what works
- Improve templates or foundations

Not every project produces lessons - that's fine. Quality over quantity.
