# Lessons Learned: Preliminary to Workplan

Project learnings synthesized at close. Key constraints extracted to foundations with references back to this document.

**Project:** 01-preliminary-to-workplan
**Completed:** 2025-11-08

---

## Methodology

### Bootstrap Pattern: Don't Create Templates Upfront

**From:** Product 3 pivot during project execution
**Date Discovered:** 2025-11-08

**What we learned:**
Initially Product 3 was specified as "create TDC templates for all work types." Through discussion about AI+TDC paradigm, we realized creating templates upfront violates our exploration-driven principle. We pivoted to creating **guidance** on template creation plus establishing the **bootstrap pattern**: templates are created while doing the actual work (explorative project produces the deliverable + the template).

**Why it matters:**
- Creating templates upfront = guessing what works, not learning
- Bootstrap pattern = templates validate themselves through actual use
- Aligns perfectly with exploration-driven development
- Templates start "good enough" and improve through real usage

**Evidence:**
- Original PROJECT_BRIEF.md implied creating multiple templates
- Discussion revealed better approach
- Deliverable changed to TEMPLATE_GUIDANCE.md (how to create templates) not templates themselves
- Template will be created in Project 02 while creating actual workplan

**Application going forward:**
- Apply bootstrap pattern to all methodology components
- Guidance + explorative project pattern for anything new
- Don't build methodology upfront, discover through practice

**Foundation update:**
- Added "Methodology Evolution" section to WOW.md
- TEMPLATE_GUIDANCE.md documents bootstrap pattern
- TDC_FRAMEWORK.md references template creation approach

---

### Foundation Maintenance as Project Responsibility

**From:** PRINCE2 setup (Product 2) and discussion about LESSONS_LEARNED.md location
**Date Discovered:** 2025-11-08

**What we learned:**
Initially created LESSONS_LEARNED.md in foundations/ as global cross-project document. Realized this violates "minimal foundations" principle. Better pattern: **foundations contain constraints + references, projects contain detailed context**. Foundation maintenance is built into project close process (not a separate central task).

**Why it matters:**
- Preserves full context where it was discovered (traceability)
- Keeps foundations minimal and scannable
- Foundation quality maintained through project lifecycle
- Each project improves foundations without bloating them

**Evidence:**
- Moved LESSONS_LEARNED.md and TEMPLATE_GUIDANCE.md from foundations/ to project folder
- PRINCE2_WOW.md project close process includes foundation update + re-validation
- Pattern already applied: foundations reference "see project 01/..." for detail

**Application going forward:**
- All detailed documentation lives in project folders
- Foundations get brief constraint + project reference
- Project close includes: synthesize lessons → extract constraints → update foundations → re-validate
- Foundation quality gates are part of every project close

**Foundation update:**
- PRINCE2_WOW.md "Close Project" section includes 6-step process
- Step 3: Update foundations with constraints + references
- Step 4: Re-validate foundations (REQUIREMENTS.md tests)
- Pattern documented and will be followed by all future projects

---

### Exploration + Evidence-Based Development (Core Pillars)

**From:** Repository reviews (Product 1) and overall project approach
**Date Discovered:** 2025-11-07

**What we learned:**
**Exploration and Evidence are the two core pillars** of our approach. Exploration projects produce real deliverables + evidence + methodology (not throwaway spikes). Evidence from real implementations validates methodology decisions much stronger than theoretical design. Different types of exploration projects serve different purposes (technology validation, architecture patterns, methodology creation, feature development).

**Why it matters:**
- Our approach is more valuable than typical spikes (which are often discarded)
- Real data from implementations (194+ tests, performance metrics, actual usage) provides concrete validation
- Distinguishes our approach from both heavy upfront design AND undisciplined iteration
- Each exploration produces lasting value: deliverable + evidence + learned patterns + foundation updates

**Evidence:**
- product-poc: Multiple prototypes → success (194+ tests, performance data)
- spl1: Committed too early → problems (over-restriction, insufficient exploration)
- Project 01: Repository reviews produced findings documents with real evidence
- Foundation improvements: 3 Green/5 Yellow → 8 Green/0 Yellow after adding concrete evidence

**Application going forward:**
- Continue sprint-sized exploration projects
- Capture evidence systematically (findings documents, metrics, validation results)
- Use evidence to improve foundations
- Every significant methodology decision backed by exploration producing evidence

**Foundation update:**
- Already in PRINCIPLES_DETAILED.md (exploration-driven validated from spl1/product-poc contrast)
- Now proven through Project 01 execution
- This lesson captures WHY these are our core pillars

---

### Documentation Validation Framework Works

**From:** Product 1 foundation validation
**Date Discovered:** 2025-11-08

**What we learned:**
REQUIREMENTS.md 8-test framework successfully applied TDC to documentation. Red/Yellow/Green scoring extends beyond code effectively. Objective criteria (Fresh Context Test, Completeness Test, etc.) made documentation quality measurable and improvable.

**Why it matters:**
- Proves TDC works for non-code artifacts
- Provides concrete framework for documentation quality
- Yellow → Green improvements show framework drives actual quality gains
- Pattern is reusable for all documentation validation

**Evidence:**
- Initial validation: 3 Green, 5 Yellow, 0 Red ("good enough" to proceed)
- After improvements: 8 Green, 0 Yellow, 0 Red (strongly validated)
- Framework identified exactly what needed improvement
- Repository reviews strengthened completeness and actionability

**Application going forward:**
- Use REQUIREMENTS.md pattern for all critical documentation
- Red/Yellow/Green scoring for multi-criteria validation
- Validation at project close to ensure foundations stay healthy

**Foundation update:**
- Pattern already documented in REQUIREMENTS.md
- VALIDATION_RESULTS.md demonstrates successful application
- PRINCE2_WOW.md includes foundation re-validation in project close

---

### Living Artifacts Over Static Documentation

**From:** PRINCE2 living artifacts design (Product 2)
**Date Discovered:** 2025-11-08

**What we learned:**
Documents that evolve during project (DAILY_LOG, RISKS, LESSONS_LEARNED) capture more value than static docs written once. Living artifacts: capture decisions as they happen, preserve context, evolve with reality, feed improvements after project close.

**Why it matters:**
- Context preserved (why decisions were made)
- Reality captured (how risks actually evolved)
- Learning enabled (patterns emerge through documentation)
- Contrast with compliance docs that nobody updates

**Evidence:**
- DAILY_LOG captures decisions with "why" at time of decision
- RISKS.md evolved: R01 status Active → Mitigated, R03 added during close
- Template documents designed to evolve (maturity ratings, improvement sections)

**Application going forward:**
- All project artifacts should be "living"
- Update during project, not just at end
- Capture reality, not aspirations
- Synthesize at project close

**Foundation update:**
- PRINCE2_WOW.md emphasizes living documents principle
- Templates designed for evolution
- None needed - principle already established

---

## Technology

### AVRO Client-Side Validated

**From:** product-poc prototype-2b review (Product 1)
**Date Discovered:** 2025-11-07

**What we learned:**
AVRO works client-side with acceptable bundle size (~80KB gzipped), excellent performance (<1ms validation), and enables single source of truth across client and server.

**Why it matters:**
Eliminates need for separate client-side validation library. Simpler architecture, one schema language, offline capability.

**Evidence:**
194+ tests in product-poc, performance metrics documented, Vite polyfill configuration proven.

**Application going forward:**
Use AVRO for all schema validation (client + server).

**Foundation update:**
Added to PRINCIPLES.md as validated approach. Documented in PRINCIPLES_DETAILED.md. Marked as "Established" maturity (🔵).

---

### Testing Stack Validated

**From:** product-poc prototypes review (Product 1)
**Date Discovered:** 2025-11-07

**What we learned:**
Vitest + Playwright + React Testing Library stack proven through 194+ tests.

**Why it matters:**
No need to experiment with alternatives - stack is proven.

**Evidence:**
Extensive real use in product-poc prototypes, fast execution, excellent DX.

**Application going forward:**
Use this testing stack for all SPL2 projects.

**Foundation update:**
Documented in PRINCIPLES.md as validated tooling. Marked as "Established" maturity (🔵).

---

## Architecture

### Avoid Over-Restriction Without Purpose

**From:** SPL1 analysis (Product 1)
**Date Discovered:** 2025-11-07

**What we learned:**
SPL1 was "too restrictive without reason due to poor design." Unnecessary constraints (5-layer config hierarchy, rigid patterns) created complexity without benefit.

**Why it matters:**
Constraints should serve goals (completeness, correctness), not restrict unnecessarily. Minimal implementation = only constrain what MUST be constrained.

**Evidence:**
SPL1 review revealed complex implementation, spl1/SPL1-FINDINGS.md documents the lesson.

**Application going forward:**
- Question every constraint: "Is this necessary for completeness?"
- Default to freedom, constrain only when required
- Maximum freedom for AI implementation choices

**Foundation update:**
Made explicit in PRINCIPLES.md: "Maximum AI Freedom." SPL1-FINDINGS.md documents this lesson. Core principle: Minimal implementation, complete output.

---

### API-Centric Design Validated

**From:** SPL1 analysis (Product 1)
**Date Discovered:** 2025-11-07

**What we learned:**
API-centric pattern (all methods in API work on same structure) enables natural composition and pipelining. Validated through SPL1 implementation.

**Why it matters:**
Right abstraction level for DSL building. Methods compose naturally within API.

**Evidence:**
SPL1 implementation demonstrated pattern working.

**Application going forward:**
Adopt API-centric design for SPL2.

**Foundation update:**
Documented in SPL1-FINDINGS.md. Will inform pipelining mechanism design.

---

## Process

### Lightweight PRINCE2 Provides Value

**From:** Product 2 execution
**Date Discovered:** 2025-11-08

**What we learned:**
Living artifacts approach (Daily Log, Risk Register, Lessons Learned) provides structure without bureaucracy. Successfully applied PRINCE2 + TDC without heaviness.

**Why it matters:**
Visibility and learning without overhead.

**Evidence:**
Project 01 executed successfully with lightweight approach. Risk R01 (methodology too complex) mitigated through practice.

**Application going forward:**
Use core PRINCE2 artifacts only, skip heavy ones.

**Foundation update:**
PRINCE2_WOW.md documents approach. Templates provided. Integration with TDC defined.

---

### Three-Tier Documentation Structure

**From:** Foundation validation (Product 1)
**Date Discovered:** 2025-11-08

**What we learned:**
Concise overview (PRINCIPLES.md 120 lines) + detailed explanations (PRINCIPLES_DETAILED.md) + project-specific (findings, lessons) provides good balance.

**Why it matters:**
Quick reference available, deep context when needed, project learnings preserved.

**Evidence:**
PRINCIPLES.md reduced from 288 → 120 lines. All 8 validation tests Green.

**Application going forward:**
Keep overview docs concise. Create _DETAILED versions when needed. Project-specific findings separate from principles.

**Foundation update:**
Restructured foundations to follow this pattern. Pattern documented in REQUIREMENTS.md.

---

## Summary

**What worked well:**
- Repository reviews with evidence-based findings (real data validates decisions)
- Living artifacts that evolved during project (DAILY_LOG, RISKS, this document)
- Bootstrap pattern discovery (don't create templates upfront)
- Foundation maintenance as project responsibility (not separate task)
- Lightweight PRINCE2 + TDC integration (structure without bureaucracy)
- Three-tier documentation (concise, detailed, project-specific)

**What didn't work:**
- Initial plan to create TDC templates upfront (pivoted to guidance + bootstrap)
- Global LESSONS_LEARNED.md in foundations/ (moved to project folders)

**What to change:**
- Continue bootstrap pattern for all methodology components
- Maintain foundation quality through project close process
- Develop evaluation techniques for "minimal and complete" (Risk R03)
- Apply exploration + evidence pillars systematically

**Key insights:**
- **Methodology evolves through practice, not planning** (bootstrap pattern discovered while creating TDC framework)
- **Evidence beats theory** (repository reviews provided concrete validation)
- **Foundations stay minimal by keeping detail in projects** (constraints + references pattern)
- **Project close maintains foundation quality** (re-validation required before close)

---

**Next project should benefit from:**
- Bootstrap pattern for creating workplan template
- Foundation update process proven
- Living artifacts approach validated
- Evidence-based decision making established
