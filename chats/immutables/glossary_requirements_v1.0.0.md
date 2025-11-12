# Glossary Requirements v1.0.0

**Created:** 2025-11-13
**Status:** Active
**Based on:** projects/03-runtime-hello-world/glossary_requirements_v1.0.0.md (adapted for general use)

## Purpose

Glossaries establish consistent, context-specific vocabularies for SPL2 work. They ensure semantic consistency, enable clear communication, and provide shared understanding across different contexts (DSL, foundations, repository structure, etc.).

## Requirements

### R1: Context-Specific Scope
Each glossary must define vocabulary for a specific context with clear scope.

**Contexts:**
- **DSL:** Runtime, APIs, methods, properties, technical implementation vocabulary
- **Stepping Stones:** Foundational navigational concepts, patterns, methodologies
- **Spots:** Repository structure, activity locations, organizational units
- **Future contexts as needed**

**Rationale:** Different contexts need different vocabularies. One term may mean different things in different contexts (that's OK if contexts are clear).

**Success Criteria:**
- Each glossary clearly states its context
- Terms are relevant to their context
- Cross-context references are explicit when needed

### R2: Simplicity and Clarity
Terms and definitions must be simple, clear, and accessible.

**Rationale:** Glossaries enable communication. Overly complex definitions defeat the purpose. Minimal and complete applies.

**Success Criteria:**
- Definitions are concise and understandable
- Informal language acceptable where appropriate
- Technical precision balanced with accessibility

### R3: Living Documents
Glossaries evolve through use. New terms added as work progresses, definitions refined based on evidence.

**Rationale:** Glossaries can't be complete upfront. They grow organically through work. This is normal and expected.

**Success Criteria:**
- Glossaries marked as "embryonic" when new, "active" when established
- Terms added before or during work (not deferred)
- Evolution tracked through versioning (x.y.z)

### R4: Structured Entry Format
Each glossary defines its own entry structure appropriate to its context.

**Examples:**
- **DSL:** Term | Type | Schema | Description | Requirement (formal, precise)
- **Stepping Stones:** Term | Description | When to Use | Related Detail Files (practical, navigational)
- **Spots:** Spot | Activity | Contents | Pattern/Notes (activity-based, informal)

**Rationale:** Different contexts need different structures. Don't force one format on all glossaries.

**Success Criteria:**
- Each glossary has consistent structure within itself
- Structure serves the glossary's purpose
- Format documented in glossary header or notes

### R5: One Term, One Meaning (Within Context)
Within a single glossary/context, each term has one meaning. Same concept = same term.

**Rationale:** Prevents confusion, enables consistent communication within the context.

**Success Criteria:**
- No term appears with conflicting meanings in same glossary
- Related terms have clear distinctions
- Near-synonyms avoided or explicitly differentiated

**Note:** Same term CAN mean different things in different contexts (DSL vs Stepping Stones). Context boundaries make this clear.

### R6: Maintenance Process
Glossaries maintained as work progresses. Add terms when needed, update when understanding changes.

**Process:**
1. When creating new concept/pattern/structure, check relevant glossary
2. If term exists, use existing definition
3. If term is new, add entry
4. If term conflicts or needs refinement, update glossary
5. Don't defer glossary updates - do them when relevant

**Rationale:** Glossaries only valuable if maintained. Low-friction updates ensure they stay current.

**Success Criteria:**
- Glossaries updated during work, not batch-updated later
- No orphaned terms (in glossary but never used)
- No missing terms (used in work but not in glossary)

### R7: Manual Management (Current)
Glossaries manually maintained without automated tooling for now.

**Rationale:** Prove the pattern first, understand tooling needs through use.

**Success Criteria:**
- Manual process remains low-friction
- Pain points documented for future tooling
- Glossaries provide value despite manual overhead

**Note:** Tooling CIP exists from Project 03 for future automated glossary management.

## Non-Requirements

### Rigid Standardization
Not all glossaries need the same structure or format. Let each context define what works.

### Complete Coverage Upfront
Glossaries start embryonic and grow. Don't delay work trying to create "complete" glossaries.

### Cross-Glossary Unification
Terms can mean different things in different contexts. That's OK. Don't force unified definitions across all glossaries if contexts differ.

## Success Criteria

Glossary requirements satisfied when:
1. Each context has appropriate glossary (DSL, Stepping Stones, Spots, future contexts)
2. Glossaries have consistent structure within themselves
3. Terms are clear, accessible, and maintained
4. Glossaries evolve through use with minimal friction
5. Manual maintenance overhead acceptable
6. Glossaries enable better communication and shared understanding

## Quality Assessment

This requirements document assessed against:
- **Minimal and complete:** Captures essentials without over-specification?
- **Clarity:** Requirements unambiguous and actionable?
- **Flexibility:** Supports different glossary contexts and structures?
- **Usability:** Enables teams to maintain glossaries effectively?
