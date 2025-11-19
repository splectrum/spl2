# CIP-015: Cross-Cutting Layers Over Data Entities

**Type:** Architectural Pattern
**Status:** Proposed
**Priority:** High (foundational for howto glossary and similar patterns)
**Source:** Project 07 - Console API Exploration closure discussion
**Date Captured:** 2025-11-19

---

## Description

Define the architectural pattern for creating higher-level structures (integrator layers) over data layer entities (spots), with refs connecting them while preserving local rules apply.

---

## The Pattern

### Core Structure

```
Higher-level structure (integrator)
    ↓ refs
Data layer entities (spots)
    ↓ own
Local details (local rules apply)
```

### Characteristics

- **Integrator** holds the pattern/template
- **Entities** own their specifics
- **Refs** connect them
- Each layer has **single concern**

---

## Origin: Howto Glossary Design

### The Problem

How to create a howto glossary that captures procedures which span multiple spots?

### The Solution

**Central howto (glossary/HOWTO_GLOSSARY.md):**
- The procedure pattern/template
- When to use it
- General steps
- Refs to spot-specific details

**Spot-local howto (e.g., projects/HOWTO.md):**
- Spot-specific variations
- Local rules that apply
- Detailed steps for that context

### Example: create_project

**Central howto entry:**
```
create_project | Create new project from backlog |
  1. Select backlog item
  2. Create project folder
  3. Run spot-local setup
  4. Remove backlog item
  Ref: projects/HOWTO.md for local details
```

**Spot-local (projects/HOWTO.md):**
```
- PROJECT_BRIEF.md format
- RISKS.md template
- DAILY_LOG.md structure
- Naming convention (NN-name)
```

### The Mycelium Metaphor

- **Data entities are the trees** (visible, distinct spots)
- **Cross-cutting layers are the mycelium** (connecting network beneath)
- **Refs are the nutrient pathways** (information flow)

---

## Glossary Conceptual Territories

The pattern emerged from understanding four glossary territories:

| Glossary | Land | Focus |
|----------|------|-------|
| **Stepping stones** | Creator's land | Patterns, concepts, design decisions |
| **Howto** | User's land | Procedures, actions, execution |
| **DSL** | Language land | Vocabulary, API terms, runtime objects |
| **Spots** | Functional land | Repository structure, activity locations |

**The insight:** Same term can exist in multiple glossaries with context-specific meaning.

**Example: efficient_search**
- Stepping stone (creator's land): The *concept/pattern* - why glossary-first matters, when to apply it
- Howto (user's land): The *procedure* - step 1: read glossary, step 2: find req column, step 3: read req file

---

## General Applications

### Status Layer Over Projects

What we built in Project 07:

- **Integrator:** status/CURRENT.md (dashboard view)
- **Entities:** projects/, BACKLOG.md, INDEX.md (local details)
- **Pattern:** Status provides headlines, refs to local details

### Other Potential Applications

| Cross-cutting Layer | Over Entities | Purpose |
|--------------------|---------------|---------|
| **Validation layer** | APIs | Schema validation patterns |
| **Permissions layer** | Operations | Access control |
| **Audit layer** | Changes | Change tracking |
| **Discovery layer** | APIs/Methods | Discoverability |
| **Help layer** | All artifacts | Documentation |

---

## Architectural Benefits

### Single Concern Per Layer

- Integrator: aggregation, navigation, patterns
- Entities: local rules, specific details
- Clear responsibility boundaries

### Flexible Evolution

- Add new integrator layers without changing entities
- Update entity details without changing integrator pattern
- New patterns (create index, test, iterate, delete if not useful)

### Local Rules Apply

- Entities own their specifics
- Integrator doesn't override local rules
- Refs preserve autonomy

### Mycelium-Like Network

- Connects disparate entities
- Enables cross-cutting concerns
- Maintains entity independence

---

## Implementation Guidance

### Creating a New Cross-Cutting Layer

1. **Identify the concern** - What cross-cutting need exists?
2. **Create integrator** - Central glossary/index/dashboard
3. **Define pattern** - General steps/structure
4. **Add refs to entities** - Point to local details
5. **Create spot-local artifacts** - Entity-specific details

### Ref Structure

```
Integrator entry:
  - General pattern
  - When to use
  - Steps (high-level)
  - Ref: spot/local-artifact.md for details

Local artifact:
  - Spot-specific variations
  - Detailed steps
  - Examples
  - Templates
```

### Naming Conventions

- Central: `glossary/HOWTO_GLOSSARY.md`
- Local: `projects/HOWTO.md`, `cips/HOWTO.md`
- Consistent pattern across spots

---

## Connection to SPL2 Architecture

### Repository as Streaming System

This pattern aligns with CIP-009/CIP-011:
- **Entities** are the artifact streams
- **Integrators** are like indexes/projections
- **Refs** enable cross-stream queries

### DSL Engine

Pattern applies to API composition:
- **Methods** are entities (single concern)
- **Composition layers** are integrators (combine methods)
- **State flow** connects them

### Data Layer

Pattern is generalizable:
- **Tables** are entities
- **Views/Indexes** are integrators
- **Foreign keys** are refs

---

## Rationale

During Project 07 closure discussion about creating a howto glossary, realized the need for a pattern to create higher-level structures over spot-based entities while preserving local rules apply. The insight: central howto provides patterns, spots own specifics, refs connect them. This is a general architectural pattern applicable beyond howtos to any cross-cutting concern.

The pattern embodies the mycelium metaphor - a connecting network beneath visible structures that enables information flow while preserving entity autonomy.

---

## Processing Guidance

When processed:

1. **Document pattern** - Add to design/ or foundations
2. **Create howto glossary** - First application of pattern
3. **Add spot-local HOWTOs** - projects/HOWTO.md, cips/HOWTO.md, etc.
4. **Update glossary_v1.1.0.md** - Reference pattern
5. **Apply to other concerns** - As need arises

### Backlog Items to Create

- Howto Glossary Setup (applies this pattern)
- Spot-Local Howto Templates

### Design Updates

- Consider adding to DESIGN_REGISTER.md as pattern
- May warrant CROSS_CUTTING_LAYERS_DESIGN.md when more examples exist

---

## Next Steps

1. Validate pattern with howto glossary implementation
2. Observe pattern in status layer (already built)
3. Apply to next cross-cutting need
4. Formalize in design/ when proven

---

## Related

- **CIP-009:** splectrum-native repository model (stream-index duality)
- **CIP-011:** Dual representation and index architecture
- **glossary_v1.1.0.md:** Four glossary territories
- **status/:** First cross-cutting layer implemented

---

**Created:** 2025-11-19
**Source:** Project 07 - Console API Exploration closure
