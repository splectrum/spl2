**Requirements:** See `projects/02-initial-workplan/Backlog_item_requirements_v1.0.0.md`

# Spots Housekeeping Requirements

**Type:** Addon (added to Glossary Term Requirements project)
**Status:** Backlog
**Priority:** High
**Dependencies:** Glossaries exist (DSL, Stepping Stones, Spots)

---

## Purpose

Define housekeeping concept for mutable spots and create requirements for spot management and maintenance activities.

---

## What This Addon Delivers

**1. Spots Requirements Document:**
- Define what a spot is (organizational unit, activity location)
- Classify spot types (mutable vs immutable, mixed)
- Establish spot structure requirements
- Create Spots_requirements document

**2. Housekeeping Concept:**
- Define housekeeping as optional closure activity
- Specify when housekeeping applies (mutable spots only)
- Establish housekeeping as friction-reduction pattern (details in spot requirements, not project requirements)

**3. Housekeeping Activities per Spot Type:**

**Foundations housekeeping:**
- Update foundation documents (small updates)
- Update CHANGELOGs
- Re-validate if needed
- Partnership Reflection (regular reflections as part of foundations maintenance)

**Glossaries housekeeping:**
- Add/update terms discovered during project
- Update glossary CHANGELOGs
- Update Current Requirements pointers
- Term validation

**CIP Register housekeeping:**
- Add new CIPs discovered
- Process CIPs if capacity allows (Accept/Defer/Reject)
- Update CIP statuses

**Backlog housekeeping:**
- Add new backlog items discovered
- Review priorities/dependencies
- Remove obsolete items
- Keep backlog focused (8-10 items ideal)

**4. Backlog Restructuring:**
- Move `projects/BACKLOG.md` → `backlog/BACKLOG.md`
- Move `projects/backlog/` → `backlog/`
- Update all references to backlog location
- Establish backlog/ as independent spot (not subordinate to projects/)
- Document backlog spot as mixed (mutable register + immutable items)

**5. Integration with Project Requirements:**
- Update Project_requirements Close stage to reference Spots housekeeping
- Remove detailed housekeeping from project requirements (friction reduction)
- Housekeeping becomes "see Spots requirements for details"

---

## Why This Is High Priority

**Reduces friction:**
- Project requirements don't detail every housekeeping activity
- Spot requirements own their maintenance patterns
- Clear separation of concerns

**Establishes spot infrastructure:**
- Spots are fundamental organizational units
- Requirements enable quality assessment of spots
- Foundation for spot-specific tooling

**Corrects structure:**
- Backlog as independent spot (not under projects/)
- Clear spot boundaries and responsibilities
- Consistent spot organization

**Enables housekeeping evolution:**
- Each spot can evolve housekeeping independently
- Don't update project requirements every time housekeeping changes
- Spot requirements track their own maintenance needs

---

## Approach

**Addon to Glossary Term Requirements project:**
- Integrate with glossary work (both touching spots)
- Create Spots_requirements document
- Define housekeeping patterns
- Execute backlog restructuring
- Update Project_requirements v1.3.0 reference

**Deliverables:**
- Spots_requirements_v1.0.0.md
- Backlog restructuring (physical move + reference updates)
- Updated Project_requirements (housekeeping reference)
- SPOTS_GLOSSARY.md updated with housekeeping terms

---

## Success Criteria

**Spots requirements complete:**
- ✅ Spots defined with classification
- ✅ Housekeeping concept documented
- ✅ Activities specified per spot type
- ✅ Partnership Reflection integrated

**Backlog restructured:**
- ✅ backlog/ spot exists at root level
- ✅ BACKLOG.md and items moved
- ✅ All references updated

**Integration complete:**
- ✅ Project_requirements references Spots housekeeping
- ✅ Friction reduced (details not in Project requirements)

---

## Notes

**Spot classification:**
- **Immutable spots:** chats/immutables/, projects/XX-name/ (no housekeeping)
- **Mutable spots:** foundations/, glossary/ (housekeeping applies)
- **Mixed spots:** backlog/ (mutable register + immutable items), chats/ (mutable captures + immutable artifacts)

**Housekeeping philosophy:**
- Optional at project closure (may have nothing to do)
- Defined in spot requirements (not project requirements)
- Spot-specific patterns (foundations ≠ glossaries ≠ backlog)
- Low friction (don't force when unnecessary)

**Backlog as spot:**
- Work queue management is its own activity
- Feeds projects (not subordinate to them)
- Mixed mutable/immutable like chats/ spot
- Independent lifecycle and maintenance

---

**This addon establishes spot infrastructure and housekeeping patterns while correcting backlog organizational structure.**
