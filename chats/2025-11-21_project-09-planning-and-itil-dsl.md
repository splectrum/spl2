# Project 09 Planning and ITIL/DSL Exploration

**Date:** 2025-11-21
**Type:** Planning chat

---

## Strategic Phasing

Agreed phasing for implementation pipeline:

**Phase 1: Implementation Pipeline**
1. `spl/execute` API - execution runtime (first stab)
2. `spl/bug` API - early bug report infrastructure
3. `spl/dev` API - complete remaining 6 methods (install, submit, cycle, status, extract, destroy)
4. Strengthen cycle - iterate spl/execute, upgrade spl/bug as needed

**Phase 2: Splectrum Service Design**
- Introduce ITIL with SPL2/DSL naming
- Define what tooling implementation needs
- Wrapper APIs + splectrum native services

**Phase 3: Full Implementation**
- DSL design + implementation sufficiently mature
- Implementation moves full steam ahead

---

## DSL Wrapping Pattern

**Thesis:** Use ITIL as test case for DSL vocabulary wrapping approach.

**What we're exploring:**
1. Take established external framework (ITIL - mature, complex, well-defined)
2. Wrap it in SPL2 vocabulary (our DSL approach)
3. Learn what works about vocabulary transformation
4. Apply learnings to other external tools/frameworks

**Prior art:** Already did this with PRINCE2 - adapted methodology, kept useful structure, shed ceremony, made it "ours" while preserving value.

**Early naming ideas (to brew):**

| ITIL Concept | Possible DSL Name | Rationale |
|--------------|-------------------|-----------|
| Service | Topic | What we're talking about |
| Service Catalog | Library / Index | Collection of topics |
| Process | Chapter | Coherent unit of narrative |
| Procedure | Section / Passage | Smaller executable unit |
| Incident | Issue / Typo | Something wrong |
| Problem | Plot hole | Underlying cause |
| Change | Edit / Revision | Modification |
| Configuration Item | Term / Entry | Defined element |
| SLA | Promise / Commitment | What we guarantee |

**Open questions:**
- Strictly linguistic metaphor (grammar, syntax, semantics)?
- Narrative metaphor (story, chapters, plot)?
- Publishing metaphor (editorial, drafts, editions)?

These need brewing - will emerge from use.

---

## Project 09

**Scope:** `spl/execute` API - first stab at execution runtime

**Rationale:**
- Execution is where bug reports naturally emerge from
- Gives concrete foundation while ITIL/DSL ideas brew
- Part of Phase 1 pipeline work

---

## Notes

- The meta-experiment matters: validating DSL wrapping on ITIL validates the approach for wrapping anything
- "Not just renaming things" - it's about whether vocabulary transformation creates genuine value
- Brewing is the point for naming - early ideas, let them percolate, see what emerges from actual use
