**Requirements:** See `projects/02-initial-workplan/Backlog_item_requirements_v1.0.0.md`

# Foundation Update & Documentation Templates

**Type:** Explorative Project
**Status:** Backlog
**Priority:** Highest (Critical)
**Dependencies:** Runtime Structure "Hello World" (Project 03)

---

## Purpose

Restructure foundations based on Project 03 discoveries, create catch phrase glossaries for discoverability, and establish templates/requirements for documentation work. Captures methodology learning while fresh, establishes patterns for all future projects.

---

## Background

Project 03 (Runtime Structure Hello World) validated core SPL2 architecture and discovered critical patterns:
- **Local Rules Apply** is more general than recognized (fundamental TDC principle for ALL artifacts)
- **MVP + End Vision** pattern for balancing pragmatism with architectural integrity
- **Embryonic → Transitional → Mature** evolution pattern for systems
- **Glossary is foundational** - two separate glossaries needed (methodology concepts + API vocabulary)
- **API architecture comprehensive** - needs to be discoverable from foundations

LESSONS_LEARNED.md documents extensive foundation updates needed. Creating separate project enables:
- Twin pair methodology (do work + create templates)
- Clean Project 03 closure
- Focused documentation exploration
- Pattern establishment for future documentation work

---

## What This Explores

**Foundation restructuring:**

1. **Catch Phrase Extraction**
   - Extract catch phrases from Philosophy_v1.1.0.md
   - Identify headline concepts (minimal and complete, evidence-based evolution, etc.)
   - Create individual requirement files for each catch phrase
   - Discover which concepts warrant separate detail files

2. **Foundation Format Evolution**
   - Restructure WOW.md: catch phrase + reference format
   - Restructure PRINCIPLES.md: catch phrase + reference format
   - Emphasize Local Rules Apply generality (ALL artifacts, fundamental TDC principle)
   - Add MVP + End Vision pattern to WOW
   - Add Embryonic → Transitional → Mature pattern to WOW

3. **Glossary Creation**
   - Create foundations/GLOSSARY.md (methodology/principles concepts glossary)
   - Create GLOSSARY_vocabulary_v1.0.0.md in Project 03 (API vocabulary glossary)
   - Define glossary structure and purpose
   - Populate with initial entries
   - Establish glossary maintenance patterns

4. **Technical Documentation**
   - Enhance API_DESIGN.md: folder structure, naming conventions, method execution model, logging strategy, platform abstraction
   - Create Repo_Design_v1.0.0.md (repository management strategy: embryonic → mature)
   - Create GLOSSARY_vocabulary requirements and templates

5. **Navigation Updates**
   - Update CLAUDE.md to reference glossaries
   - Ensure discoverability of all documentation
   - Clear entry points for different use cases

**Template/Requirements Creation:**

6. **Documentation Templates**
   - Template for catch phrase extraction
   - Template for glossary creation
   - Template for technical design documents
   - Guidance on when to create separate detail files

7. **Documentation Requirements**
   - Requirements for glossary artifacts
   - Requirements for technical design documents
   - Requirements for foundation restructuring
   - Quality criteria for documentation work

---

## Success Criteria

**Foundation updates complete:**

1. ✅ WOW.md restructured with catch phrase + reference format
2. ✅ PRINCIPLES.md restructured with catch phrase + reference format
3. ✅ Local Rules Apply emphasized as fundamental TDC principle (ALL artifacts)
4. ✅ MVP + End Vision pattern documented in WOW
5. ✅ Embryonic → Mature pattern documented in WOW
6. ✅ foundations/GLOSSARY.md created and populated
7. ✅ API_DESIGN.md enhanced with missing sections
8. ✅ Repo_Design_v1.0.0.md created
9. ✅ GLOSSARY_vocabulary_v1.0.0.md created with Project 03 entries
10. ✅ CLAUDE.md updated for discoverability
11. ✅ All new documents validated (readable, accurate, useful)

**Templates/requirements created:**

12. ✅ Catch phrase extraction template + requirements
13. ✅ Glossary template + requirements
14. ✅ Technical design document template + requirements
15. ✅ Foundation restructuring guidance documented
16. ✅ Documentation work patterns established for future use

**Evidence of success:**
- Foundations clear and navigable
- Documentation discoverable from entry points
- Templates validated through actual use during project
- Patterns ready for future documentation work
- Project 03 learning captured and integrated

---

## Why This Is Highest Priority

**High leverage work:**
- Affects all future projects (foundation patterns established)
- Captures Project 03 learning while context fresh
- Establishes documentation methodology (no templates exist yet)
- Enables future explorative projects to document discoveries systematically

**Unlocks:**
- Clear foundation navigation for all future work
- Glossary-based discoverability (methodology + API vocabulary)
- Documentation patterns for future projects
- Foundation evolution methodology (how to update based on evidence)

**Timing critical:**
- Project 03 context fresh now
- Catch phrase extraction requires deep Philosophy understanding
- Delaying risks losing context and requiring re-analysis

---

## Approach

**Explorative project (1 week estimate):**

**Phase 1: Catch Phrase Extraction + Template**
- Twin Pair: Extract catch phrases from Philosophy + Create extraction template
- Identify headline concepts requiring detail files
- Create individual requirement files for catch phrases
- Validate template through use

**Phase 2: Glossary Creation + Requirements**
- Twin Pair: Create both glossaries + Create glossary requirements/templates
- foundations/GLOSSARY.md (methodology concepts)
- GLOSSARY_vocabulary_v1.0.0.md (API vocabulary from Project 03)
- Define structure, purpose, maintenance patterns

**Phase 3: Foundation Restructuring + Guidance**
- Twin Pair: Restructure WOW/PRINCIPLES + Document restructuring pattern
- Apply catch phrase + reference format
- Add new patterns (MVP+End Vision, Embryonic→Mature)
- Emphasize Local Rules Apply generality
- Create restructuring guidance for future foundation updates

**Phase 4: Technical Documentation + Templates**
- Twin Pair: Create/enhance technical docs + Create documentation templates
- Enhance API_DESIGN.md (5 missing sections from Project 03)
- Create Repo_Design_v1.0.0.md
- Create GLOSSARY_vocabulary requirements
- Document technical documentation patterns

**Phase 5: Navigation & Validation**
- Update CLAUDE.md for discoverability
- Validate all documentation (readability, accuracy, usefulness)
- Ensure clear navigation paths
- Synthesize lessons learned

**Deliverables:**
- Restructured foundations (WOW.md, PRINCIPLES.md)
- Two glossaries (methodology + API vocabulary)
- Enhanced/new technical documents (API_DESIGN.md, Repo_Design, GLOSSARY_vocabulary)
- 4 template/requirement sets for documentation work
- Updated CLAUDE.md navigation
- LESSONS_LEARNED.md for documentation methodology

---

## Detailed Work Items from Project 03

**API_DESIGN.md enhancements** (5 sections):
1. Folder structure details (underscore prefix, auxiliary folders, camelCase, requirements at all levels)
2. Naming conventions (full names over abbreviations, self-documenting philosophy)
3. Method execution model (single parameter signature, context structure, access rules, hierarchical Kafka records)
4. Logging strategy (silent production, verbose evaluation, reconstruction-based approach)
5. Platform abstraction pattern (pure methods, auxiliary libraries, auto-detection)

**Repo_Design_v1.0.0.md** (repository management):
- Embryonic development (single repo, fast iteration)
- Transitional stage (extract proven APIs)
- Mature diversification (one API per repo with automation)
- Guidance on when to transition between stages

**GLOSSARY_vocabulary_v1.0.0.md** (API vocabulary):
- 4-column structure: Term, Type, Description, Requirement
- Initial entries from Project 03 (packages, APIs, methods, properties)
- Purpose: semantic consistency, compositional reasoning, partial requirements generation
- Deferred columns: Schema reference, Examples (assess based on evidence)

**foundations/GLOSSARY.md** (methodology concepts):
- Catch phrases from Philosophy, PRINCE2, TDC
- Format: Catch phrase + brief definition + reference to detail file
- Purpose: Quick reference, discoverability, navigation

**WOW.md updates:**
- MVP + End Vision pattern section
- Embryonic → Transitional → Mature pattern section
- Emphasize Local Rules Apply (ALL artifacts - fundamental TDC)
- Reference API_DESIGN.md for discoverability
- Restructure to catch phrase + reference format

**PRINCIPLES.md updates:**
- Restructure to catch phrase + reference format
- Ensure catch phrases from technology side captured

---

## Twin Pairs (Proposed)

**Twin Pair 1: Catch Phrase Extraction + Template**
- Product 1A: Extracted catch phrases with individual requirement files
- Product 1B: Catch phrase extraction template/requirements

**Twin Pair 2: Glossary Creation + Requirements**
- Product 2A: Both glossaries created and populated
- Product 2B: Glossary templates and requirements documents

**Twin Pair 3: Foundation Restructuring + Guidance**
- Product 3A: WOW.md and PRINCIPLES.md restructured
- Product 3B: Foundation restructuring methodology document

**Twin Pair 4: Technical Documentation + Templates**
- Product 4A: Enhanced/created technical documents
- Product 4B: Technical documentation templates/requirements

**Note:** Twin pair structure may adjust during exploration (explorative methodology).

---

## Open Questions

- Which Philosophy concepts warrant separate detail files vs inline in foundations?
- Should GLOSSARY.md have structured format or simple list?
- How much detail in catch phrases vs references?
- Glossary maintenance: manual vs tooled (CIP-007 addresses tooling, but manual patterns first)?
- Documentation quality: How to validate "useful" and "clear"?
- Navigation: What are the primary entry point use cases?

---

## Dependencies

**Requires:**
- Project 03 complete (LESSONS_LEARNED.md documents foundation update needs)

**Unlocks:**
- Clear foundation structure for all future work
- Documentation methodology established
- Discoverability via glossaries
- Systematic capture of future project learning

---

## Notes

**Explorative methodology:**
- Twin pairs validate templates through use
- May discover additional documentation needs during work
- Pattern: Do the work + capture the pattern = validated templates

**High leverage:**
- Foundation work affects everything
- Documentation patterns reused across all projects
- Glossaries become central navigation mechanism

**Timing:**
- Do while Project 03 context fresh
- Philosophy understanding required for catch phrase extraction
- Establishes patterns before too many projects accumulate

**Connection to Project 03:**
- Completes Project 03 handoff (learning → foundation integration)
- Validates twin pair methodology through documentation domain
- Tests explorative project approach on non-code deliverables
