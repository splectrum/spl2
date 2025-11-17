# CIP-013: Design Spot Setup

**Type:** Infrastructure/Documentation
**Status:** Proposed
**Priority:** High (enables design documentation pattern)
**Source:** Project 05 - API_DESIGN.md enhancement discussion
**Date Captured:** 2025-11-17

---

## Description

Create **design/** spot as structured location for platform design documentation following established patterns (glossary/, cips/, projects/).

**Structure:**
```
design/
├── DESIGN_REGISTER.md          # Mutable register tracking platform design elements
├── DESIGN_REGISTER_CHANGELOG.md # Track register evolution
├── API_DESIGN.md                # Mutable design doc (always current)
├── API_DESIGN_CHANGELOG.md      # Track API design evolution
└── (future design docs as needed)
```

**Design spot characteristics:**
- **Mutable entry points with CHANGELOGs** (like glossary/, not versioned immutables)
- **Registry pattern** (DESIGN_REGISTER.md tracks all platform design elements)
- **Living documents** (evolve based on evidence from building)
- **Referenced by requirements** (requirements docs pin to design docs for context)

---

## What is design/?

**Purpose:** Structured workspace and archive for platform design elements

**Platform design elements are:**
- Runtime architecture patterns
- Method execution models
- API structures and conventions
- State management patterns
- Component templates
- Implementation patterns for Splectrum platform

**NOT in design/:**
- Methodology patterns (how we work - stays in WOW.md)
- Project templates (PRINCE2 patterns - stays in project-types/)
- Partnership patterns (how we collaborate - stays in PARTNERSHIP.md)

**The distinction:** Platform/product design (what we're building) vs. methodology (how we work)

**Note:** Methodology may *eventually* become platform features (project management as Splectrum capability), at which point methodology requirements → design specs → implementation. But initially, only direct platform elements in design/.

---

## DESIGN_REGISTER.md

**Purpose:** Registry of all platform design elements - living catalog of implementation templates

**Tracks:**
- Element name
- Current status (validated, draft, evolving, superseded)
- Location (which design doc, which section)
- What it's a template for
- Related requirements/projects

**Example entries:**
- Method execution context structure (validated, API_DESIGN.md, template for method implementations)
- Runtime state initialization pattern (validated, API_DESIGN.md, template for API state backing)
- Three-layer API structure (validated, API_DESIGN.md, template for API organization)

**Mutable with CHANGELOG:**
- Register evolves as new design elements created
- CHANGELOG tracks what was added/changed/removed when
- Always represents current state of platform design

---

## Design Documents (API_DESIGN.md, etc.)

**Characteristics:**
- **Mutable** (always current, not versioned)
- **Protected by CHANGELOG** (track evolution)
- **Detail design elements** listed in register
- **Referenced by requirements** (provide broader design context)

**Evolution pattern:**
- Design emerges through building (Projects 03-04 established patterns)
- Validated patterns → documented in design docs
- Design docs evolve based on evidence
- CHANGELOG tracks when/why changes made

**Relationship to requirements:**
- Requirements docs (versioned immutables) REFERENCE design docs
- "See design/API_DESIGN.md for runtime architecture context"
- Requirements specific and time-bound, design broader and evolving

---

## Integration with Foundations

**PRINCIPLES.md references design/:**
- Add headline block(s) referencing key design elements
- High-level design philosophy in principles
- Detail in design docs

**Requirements reference design/:**
- Implementation requirements reference design templates
- "Follow pattern in design/API_DESIGN.md section X"
- Design provides context, requirements provide validation criteria

**CIPs may use design/:**
- CIP working on design creates/updates design docs
- Design work happens in design/ spot
- When mature → requirements with validation criteria

---

## Implementation (Lightweight)

**For Project 05:**
1. Create design/ folder
2. Create DESIGN_REGISTER.md (basic structure, can grow)
3. Bring Project 03 API_DESIGN.md content into design/API_DESIGN.md
4. Create API_DESIGN_CHANGELOG.md (initial entry: "Created from Project 03")
5. Populate register with design elements from API_DESIGN.md
6. Add lightweight PRINCIPLES.md headline block(s) referencing design

**Establish pattern, prove concept, keep it minimal for now.**

---

## Future Evolution

**As platform grows:**
- New design docs as needed (STATE_DESIGN.md, P2P_DESIGN.md, etc.)
- Register grows to track all elements
- Design docs evolve based on building evidence
- CHANGELOGs preserve evolution history

**Comprehensive design work (CIP-014):**
- Detailed design requirements
- Design methodology
- Expansion and formalization
- When complexity justifies it

---

## Rationale

Need structured location for platform design documentation that:
- Is discoverable (design/ spot, DESIGN_REGISTER.md)
- Evolves naturally (mutable docs with CHANGELOGs)
- Provides implementation templates (register catalogs elements)
- Integrates with existing patterns (like glossary/, cips/)
- Supports requirements without duplicating (requirements reference design)

During Project 05 discussion, realized API_DESIGN.md from Project 03 has dual nature: some belongs in PRINCIPLES.md headlines, rest needs home as living design documentation. Design spot solves this cleanly.

---

## Success Criteria

**Pattern established:**
- design/ spot exists with clear structure
- DESIGN_REGISTER.md tracks platform design elements
- API_DESIGN.md documented with CHANGELOG
- Referenced from PRINCIPLES.md appropriately
- Clear distinction: platform design vs. methodology

**Usable for future work:**
- Next implementation work can reference design templates
- New design elements can be added easily
- Pattern proven through use
- Low friction for design documentation

---

## Next Steps

1. Implement lightweight version in Project 05 (Product 2)
2. Validate pattern through use
3. Create CIP-014 for comprehensive design phase (future work)
4. Let pattern mature through evidence

---

**Related:**
- CIP-014: Comprehensive API Design Phase (future deep work)
- Project 03: API_DESIGN.md (source material)
- Project 05: Foundation updates (implementation context)
