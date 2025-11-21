# ITIL Introduction

**Priority:** High
**Type:** Foundation Project
**Dependencies:** spl/execute API, spl/bug API, spl/dev API (Phase 1 complete)
**Phase:** 2 - Splectrum Service Design

---

## Overview

Introduce ITIL service management concepts wrapped in SPL2/DSL vocabulary. Use ITIL as test case for the DSL vocabulary wrapping pattern.

---

## Scope

### Core Work

| Component | Description |
|-----------|-------------|
| **ITIL concept mapping** | Map relevant ITIL concepts to SPL2 vocabulary |
| **DSL naming** | Language-centric names (Topic, Chapter, etc.) |
| **Service catalog** | Define what "services" SPL2 offers |
| **Early API requirements** | Requirements for service-level APIs |

### Vocabulary Exploration

Map ITIL to language/narrative metaphors:

| ITIL Concept | Candidate Names | Notes |
|--------------|-----------------|-------|
| Service | Topic | What we're talking about |
| Service Catalog | Library / Index | Collection of topics |
| Process | Chapter | Coherent unit |
| Procedure | Section / Passage | Smaller unit |
| Incident | Issue / Typo | Something wrong |
| Problem | Plot hole | Root cause |
| Change | Edit / Revision | Modification |
| Configuration Item | Term / Entry | Defined element |
| SLA | Promise / Commitment | Guarantees |

### Metaphor Questions

- Strictly linguistic (grammar, syntax, semantics)?
- Narrative (story, chapters, plot)?
- Publishing (editorial, drafts, editions)?
- Let emerge from use

---

## Why This Project

1. **Validates DSL wrapping pattern** - ITIL is mature, complex, well-defined test case
2. **Prior art with PRINCE2** - already did vocabulary wrapping successfully
3. **Service thinking** - ITIL brings discipline to how we think about APIs as services
4. **Vocabulary alignment** - spl/bug naming decision lives here

---

## Expected Products

1. ITIL-to-SPL2 vocabulary mapping
2. Service catalog design
3. Service-level API requirements template
4. Vocabulary decision for spl/bug (keep or rename)
5. Foundation for Phase 3 full implementation

---

## Success Criteria

1. Clear vocabulary mapping from ITIL to SPL2
2. Vocabulary feels natural, not forced
3. Service catalog captures what SPL2 offers
4. Pattern reusable for other external framework wrapping

---

## Notes

- "Not just renaming things" - vocabulary transformation should create genuine value
- Let naming brew - early ideas, percolate, emerge from use
- PRINCE2 precedent: kept useful structure, shed ceremony, made it "ours"

---

**Created:** 2025-11-21
**Source:** Project 09 planning chat
