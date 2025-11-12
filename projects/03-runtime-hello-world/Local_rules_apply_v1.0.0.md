# Local Rules Apply

**Version:** 1.0.0
**Created:** 2025-11-12 (Project 03)
**Status:** Foundation Principle

---

## Principle

**Artifacts satisfy their own requirements (version at time of creation). No retroactive burden when requirements evolve.**

---

## Key Concepts

**Artifact-to-requirements pinning:**
- Each artifact references specific version of its requirements (first line)
- Artifact satisfied those requirements at time of creation
- Artifact remains valid even if requirements evolve later

**No retroactive compliance:**
- When requirements change, previous artifacts don't need updating
- Previous work satisfied its requirements at the time
- New work uses new requirements, old work stays valid

**Freedom to evolve:**
- Requirements can improve based on evidence
- No anxiety about breaking previous work
- Focus on what's needed NOW, not historical consistency

---

## Pattern: General → Specific → Local

**Three-tier structure:**

1. **General (Top):** Foundations - WOW, Philosophy, TDC
   - Broad principles that rarely change
   - Reference detailed implementations

2. **Specific (Middle):** Requirements documents - Project types, product types, templates
   - Define expectations for categories of work
   - Versioned, can evolve based on evidence
   - Contain WOW guidance for their domain

3. **Local (Bottom):** Artifacts - Projects, deliverables, code
   - Reference specific requirement versions
   - Satisfy those requirements
   - Remain valid when requirements evolve

**Example from Project 03:**
```
WOW.md (general)
  ↓ references
Explorative_project_requirements_v1.0.0.md (specific)
  ↓ referenced by
PROJECT_BRIEF.md (local)
```

---

## Benefits

**For creators:**
- Clear expectations (reference tells you exactly what to satisfy)
- No looking over shoulder for historical consistency
- Freedom to improve patterns based on learning

**For consumers:**
- Clear understanding of what artifact satisfied
- Can assess if artifact meets current needs
- Explicit upgrade path if requirements changed

**For evolution:**
- Requirements improve through evidence
- New projects benefit from improved patterns
- Old projects remain valid (no forced upgrades)
- "Minimal and complete" applies - evolve when evidence shows need

---

## Application

**When creating any artifact:**
1. Identify what type of artifact (project, product, deliverable)
2. Find appropriate requirements document
3. Reference it (first line, specific version)
4. Satisfy those requirements
5. Done - no need to check historical consistency

**When requirements evolve:**
1. Create new version of requirements (evidence-based)
2. New work references new version
3. Old work keeps old references
4. No retroactive updates needed

**When assessing artifact:**
1. Check referenced requirements version
2. Evaluate if artifact satisfied those requirements
3. If using artifact now, assess if it meets current needs
4. Upgrade if needed, but not required

---

## Related Principles

- **Minimal and complete:** Start minimal, evolve based on evidence (not speculation)
- **Artifact-to-requirements pinning:** Technical implementation enabling this principle
- **Evidence-based evolution:** Requirements improve through doing, not planning

---

## Examples

**Project types:**
- Project 02 used Explorative_project_requirements_v1.0.0.md
- Project 03 uses same version
- Future projects might use v2.0.0 with different patterns
- Projects 02 and 03 remain valid (satisfied v1.0.0)

**Code artifacts:**
- Method created referencing Requirements_v1.0.0.md
- Requirements_v2.0.0.md adds new validation rules
- Method still valid (satisfied v1.0.0 requirements)
- New methods use v2.0.0, old method no forced upgrade

**Documentation:**
- README.md references Documentation_requirements_v1.0.0.md
- v2.0.0 adds examples section (evidence showed confusion)
- README.md still valid (v1.0.0 didn't require examples)
- New READMEs include examples (v2.0.0)

---

*This principle liberates creation: focus on satisfying current requirements, not achieving historical perfection. Evolution happens naturally through evidence, not retroactive compliance burdens.*
