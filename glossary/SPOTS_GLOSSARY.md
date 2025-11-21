# Spots Glossary

**Requirements:** chats/immutables/glossary_requirements_v1.0.0.md
**Status:** Embryonic - will evolve through use
**Context:** Repository structure - the spots where different activities happen

This glossary defines the top-level repository structure using the "spots" metaphor. Each spot is an activity-based location - not just a folder, but a place where specific work happens. "Know a leopard by its spots" - what we put in place defines the project.

---

## Terms

| Term | Description | Req |
|------|-------------|-----|
| spots glossary | Registry of spots terms with associated reqs; context: repository structure - activity-based locations | projects/06-glossary-term-requirements/reqs/spots_glossary_v1.0.0.md |
| spot | Activity-based location in repository; like rooms in a house, defined by what you do there, not just contents | projects/06-glossary-term-requirements/reqs/spot_v1.0.0.md |
| archive/ | **spot** - Look up historical reference materials; legacy spl1 materials; reference-only, not for active work | projects/06-glossary-term-requirements/reqs/archive_v1.0.0.md |
| chats/ | **spot** - Have informal collaborative conversations; captured discussions, insights, decisions; fire and forget capture | projects/06-glossary-term-requirements/reqs/chats_v1.0.0.md |
| cips/ | **spot** - Propose and track continual improvements; CIP_REGISTER.md (living) + individual CIPs (immutable); ITIL practice | projects/06-glossary-term-requirements/reqs/cips_v1.0.0.md |
| foundations/ | **spot** - Reference foundational principles; WOW.md, PRINCIPLES.md, PARTNERSHIP.md; headlines referencing versioned details | projects/06-glossary-term-requirements/reqs/foundations_v1.0.0.md |
| glossary/ | **spot** - Define and clarify language for different contexts; DSL, Stepping Stones, Spots glossaries; terms with reqs | projects/06-glossary-term-requirements/reqs/glossary_spot_v1.0.0.md |
| projects/ | **spot** - Do formal work through structured projects; project folders, INDEX.md, BACKLOG.md; manufacturing with PRINCE2 structure | projects/06-glossary-term-requirements/reqs/projects_v1.0.0.md |
| status/ | **spot** - Check current state of repository; active work, recent context, session entry point; reduces dynamic update load | projects/07-console-api-exploration/status_v1.0.0.md |

---

## Rooms Metaphor

**Activity-based, not artifact-based:** Like rooms in a house (kitchen, library, bedroom), spots are defined by what you **do** there, not just what they contain.

**Manufacturing vs House structure:**
- **Manufacturing:** Happens in projects/ - work-in-progress, local deliverables, experimentation
- **House spots:** Top-level folders - externalized, productized, "ready for collection"
- **Pattern:** Not everything manufactured needs externalization (immediately or ever)

**Navigation:** Spots are stable landmarks you return to for different activities. They define the project's structure and workflow.

---

## Notes

- **Informal terminology:** "Spots" chosen for casual, accessible feel while maintaining clear structure underneath
- **Minimal and complete applies:** This glossary starts minimal. Will grow as repository evolves and new spots emerge (if needed)
- **Living document:** Spots and their purposes may evolve through use; capture changes here

---

**Created:** 2025-11-13
**Evolution:** Will be updated as repository structure evolves or new spots are added
