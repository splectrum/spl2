**Requirements:** See `projects/project-types/Exploration_project_requirements_v1.0.0.md`
**Requirements:** See `projects/04-bare-runtime-hello-world/Project_requirements_v1.3.0.md`

# Natural Language Schema Transformation

**Project Type:** Addon (to Repository Streaming Structure)
**Priority:** High
**Status:** Backlog

---

## Background

During Project 04 closure, discovered that the repository streaming structure pattern (tables + indexes) has a deeper foundation: **artifact-to-requirements pinning is essentially schema referencing**.

**Key insight:**
- Project folders are schemaless tables (accept all sorts: guides, requirements, examples, code)
- What makes entries "belong" to a table? **First line requirement reference**
- Requirements ARE the schema definition (in natural language)
- Requirements versioning IS schema evolution

**Example:**
```markdown
Requirements: projects/04-.../Bare_platform_requirements_v1.0.0.md
```

This reference says: "This artifact conforms to schema version 1.0.0"

---

## The Critical Unlock

**For TDC to evolve into a general AI methodology, we need bidirectional transformation:**

```
Natural Language Requirements ↔ Rigid Schema (AVRO/JSON Schema)
```

**Why this matters:**

### 1. Best of Both Worlds
- **Humans work in natural language:** Low friction, expressive, flexible, easy to write
- **Tools work with rigid schemas:** Validatable, tool-compatible, evolvable, automatable
- **AI bridges the gap:** Transforms between representations, maintains consistency

### 2. Formal Compatibility Checking
- "Is Project_requirements_v1.3.0 compatible with v1.2.0?"
- AI compares rigid schemas, identifies breaking changes
- Same techniques as AVRO schema evolution (backward/forward compatibility)
- Automated compatibility validation without manual analysis

### 3. Cross-Domain Methodology
- Natural language requirements for ANY domain
- Transform to domain-appropriate rigid schema
- Same methodology pattern, different schemas
- TDC becomes truly general (not just software development)

### 4. Tooling Ecosystem
- IDEs validate artifacts against schemas in real-time
- CI/CD checks requirement compliance automatically
- Schema registries for requirement version management
- All the Kafka/AVRO/Confluent tooling becomes applicable to methodology
- Automated quality assessment

---

## The Innovation

**What already exists:**
- ✓ Rigid schemas (AVRO, JSON Schema, XML Schema, etc.)
- ✓ Natural language requirements (everywhere)
- ✓ Manual transformation (humans write both)

**What's novel:**
- ✗ **Rigorous bidirectional transformation between them**
- ✗ **AI-powered, automated, compatibility-aware**
- ✗ **Natural language as first-class schema representation**

**The transformation is the innovation**, not the endpoints.

---

## Schemaless Tables with Schema References

**Current SPL2 pattern:**
- Project folder (table) accepts heterogeneous entries
- Each entry pins to requirements (schema) via first-line reference
- Requirements define: structure, quality criteria, validation rules
- Versioned requirements enable schema evolution

**AVRO parallel:**

| AVRO | SPL2 |
|------|------|
| Binary data + schema reference (by ID) | Artifact + requirements reference (by path/version) |
| Schema defines structure and types | Requirements define structure and semantics |
| Schema evolution (backward/forward compatible) | Requirements versioning (artifact-to-requirements pinning) |
| Rigid, machine-readable | Natural language, human-readable |
| Automated validation | Manual validation (currently) |

**Hybrid approach:**

**Structured metadata:**
- Artifact type, version, dependencies, status
- Machine-readable, automatable
- Maps to AVRO/JSON Schema perfectly

**Natural language semantics:**
- What makes artifact "good enough"
- Quality criteria, purpose, intent
- Human judgment, contextual understanding

**Validation rules:**
- Checkable conditions (automated: "has section X", "references file Y")
- Human-judgment criteria ("clear and understandable", "sufficient detail")
- Both expressed in natural language, transformable to rigid checks where possible

---

## What This Enables

### For AI Methodology (TDC Evolution)

**1. Automated quality assessment:**
- AI validates artifacts against schema automatically
- "Does this PRODUCT_EVALUATION.md meet Product_evaluation_requirements_v1.0.0?"
- Continuous validation during artifact creation

**2. Schema-guided artifact generation:**
- AI knows what to include (schema defines required sections, quality criteria)
- Generates artifacts that conform to schema by construction
- Reduces iteration cycles

**3. Schema evolution based on pattern discovery:**
- AI observes recurring patterns in artifacts
- Proposes schema updates to capture best practices
- Community-driven schema evolution

**4. Schema compatibility reasoning:**
- AI determines if artifact created with v1.0 schema still valid under v1.1
- Automated migration suggestions
- Breaking change detection

### For Methodology Generalization

**1. Domain-agnostic pattern:**
- Same methodology applies to: software, hardware, research, operations, any domain
- Domain-specific schemas, universal methodology
- Scalability across contexts

**2. Schema becomes the contract:**
- Between creator and validator
- Between team members
- Between projects
- Clear expectations, measurable compliance

**3. Methodology export:**
- Other teams/orgs can adopt SPL2 schemas
- Customize for their domain
- Same tooling, different content

**4. Cross-project schema reuse:**
- Common patterns become reusable schemas
- Build library of proven schemas
- Accelerate new project setup

### For Repository Streaming Architecture

**1. Schema as stream metadata:**
- Each table (stream) has associated schema stream
- Schema versions tracked in changelog
- Compatibility enforced at stream level

**2. Cross-table indexes with schema awareness:**
- Index knows schema of referenced entries
- Can validate cross-references
- Schema compatibility checked at index time

**3. Schema registry integration:**
- Kafka Schema Registry pattern applies
- Central registry of requirement versions
- Compatibility rules enforced

**4. Streaming validation:**
- Artifacts validated as they're added to table (stream)
- Invalid entries rejected or flagged
- Quality gates in streaming pipeline

---

## Exploration Objectives

**Primary goal:** Prove that rigorous bidirectional transformation between natural language requirements and rigid schemas is feasible and valuable.

**Specific objectives:**

1. **Transform existing requirement:**
   - Take Project_requirements_v1.3.0.md (natural language)
   - Generate equivalent AVRO/JSON Schema (rigid)
   - Validate artifacts against both representations
   - Prove equivalence

2. **Compatibility checking:**
   - Compare Project_requirements_v1.2.0 vs v1.3.0
   - Identify breaking vs non-breaking changes using rigid schemas
   - Automated compatibility determination

3. **Artifact validation:**
   - Validate PROJECT_BRIEF.md against Project_requirements schema
   - Automated checks (structure, required sections)
   - Human-judgment criteria (how to represent/validate?)

4. **Round-trip transformation:**
   - Natural language → Rigid schema → Natural language
   - Does it preserve semantics?
   - What's lost/gained in transformation?

5. **Hybrid representation:**
   - Design schema that combines structured metadata + natural language semantics
   - Best of both worlds
   - Validate approach with sample requirements

---

## Success Criteria

**Proof of concept:**
- ✅ At least one SPL2 requirement successfully transformed to rigid schema
- ✅ Artifacts validated against rigid schema (automated)
- ✅ Schema compatibility checking demonstrated (v1.2.0 vs v1.3.0)
- ✅ Round-trip transformation preserves essential semantics

**Pattern validation:**
- ✅ Hybrid representation defined (structured + natural language)
- ✅ Transformation rules documented
- ✅ Limitations and trade-offs understood
- ✅ Requirements extracted for production implementation

**Strategic validation:**
- ✅ TDC methodology generalization path clear
- ✅ Tooling ecosystem integration feasible
- ✅ Cross-domain applicability demonstrated

---

## Open Questions

### Transformation Challenges

1. **How to represent human-judgment criteria in rigid schema?**
   - "Clear and understandable" vs "Has section X"
   - Natural language annotations in schema?
   - Separate validation tiers (automated + human)?

2. **What's lost in transformation?**
   - Nuance, context, intent
   - Can we preserve in annotations/comments?
   - Acceptable loss vs critical preservation?

3. **Round-trip fidelity:**
   - Natural → Rigid → Natural = Original?
   - Or Natural → Rigid → Natural = Equivalent?
   - What does "equivalent" mean?

### Schema Evolution

4. **Compatibility rules for natural language schemas?**
   - Adding optional section = backward compatible?
   - Changing quality criteria = breaking change?
   - How to formalize?

5. **Schema registry for natural language requirements?**
   - Central registry of all requirement versions
   - How to index/search?
   - Versioning scheme?

### Practical Implementation

6. **Tooling requirements:**
   - What tools needed for transformation?
   - IDE integration feasible?
   - CI/CD pipeline integration?

7. **Performance:**
   - Real-time validation during artifact creation?
   - Or batch validation at milestones?
   - Latency acceptable?

8. **Human in the loop:**
   - Full automation or human review required?
   - Where does human judgment stay essential?
   - AI-assisted vs AI-automated?

### Methodology Impact

9. **Backwards compatibility:**
   - Can existing SPL2 artifacts adopt this pattern?
   - Migration path from current approach?
   - Incremental adoption or all-at-once?

10. **Learning curve:**
    - Does this add complexity for users?
    - Or does tooling hide complexity?
    - Training requirements?

---

## Relationship to Other Projects

### Repository Streaming Structure (parent project)

This addon **extends** the streaming repository concept with schema awareness:

- **Tables** hold artifacts (schemaless storage)
- **Indexes** point to artifacts (mutable lookups)
- **Schemas** define artifact validity (versioned requirements)
- **Schema streams** track schema evolution (changelog)

The parent project establishes the infrastructure, this addon adds semantic layer.

### AVRO Schema and RPC (parallel project)

**Synergy:**
- AVRO project focuses on structured data schemas
- This project focuses on natural language requirement schemas
- Same schema evolution principles
- Shared tooling (schema registry, compatibility checking)

**Integration point:**
Natural language requirements could reference AVRO schemas for structured metadata portions.

### Glossary Term Requirements (related project)

**Connection:**
- Glossary terms need requirements (schemas)
- Conceptual patterns vs technical artifacts
- Perfect test case for natural language schema transformation

**Validation:**
If we can transform "stepping stone" requirements to rigid schema, methodology is proven.

---

## Initial Risks

**R01: Semantic loss in transformation**
- **Description:** Natural language → rigid schema loses essential meaning/context
- **Impact:** Schemas don't capture what makes artifact "good"
- **Mitigation:** Hybrid approach (structured + natural language annotations)
- **Exploration validates:** What's acceptable loss vs critical preservation

**R02: Complexity explosion**
- **Description:** Transformation rules become too complex to maintain
- **Impact:** Pattern doesn't scale, maintenance burden too high
- **Mitigation:** Start simple, add complexity only where proven valuable
- **Exploration discovers:** Minimal viable transformation rules

**R03: Tooling dependency**
- **Description:** Pattern requires sophisticated tooling to be practical
- **Impact:** High barrier to adoption, vendor lock-in risk
- **Mitigation:** Design for manual use, tooling as enhancement not requirement
- **Exploration proves:** Manual feasibility before automation

**R04: Schema rigidity vs methodology flexibility**
- **Description:** Rigid schemas constrain beneficial methodology evolution
- **Impact:** TDC loses adaptability, becomes bureaucratic
- **Mitigation:** Schema evolution must be low-friction, versioning enables coexistence
- **Exploration validates:** Flexibility preservation mechanisms

---

## Notes

**Origin:** Discovered during Project 04 closure while repairing backlog

**Discovery context:**
- Backlog (index) corrupted when new items inserted at top
- Easy repair: rebuild index from backlog item files (tables)
- Realization: backlog items reference requirements (schemas)
- Tables are schemaless, schema comes from requirement reference

**Key quote from discovery:**
"And our tables are schemaless, they accept entries of all sorts (look what we throw into a project). It is the req reference that makes them belong to (what in a traditional RDB would be) a table. Even stronger, we have versions of the reqs/schemas of some sort. I wonder if we could tie this in with AVRO (although these are not rigid schemas, but 'natural language' schemas)."

**Strategic importance:**
If SPL2 can prove bidirectional natural language ↔ rigid schema transformation, TDC becomes **the methodology for AI-augmented work across all domains**.

The transformation is the innovation. This is the unlock for methodology generalization.

**Connection to TDC vision:**
TDC aims to be general AI methodology. Currently demonstrated in software development. Natural language schema transformation enables cross-domain generalization while maintaining rigor.

---

## Scope

**In scope (exploration):**
- Proof of concept: transform one SPL2 requirement to rigid schema
- Validate artifacts against rigid schema (automated checks)
- Schema compatibility checking (version comparison)
- Round-trip transformation (preserve semantics?)
- Hybrid representation design (structured + natural language)
- Requirements extraction for production implementation

**Out of scope (exploration):**
- Production tooling implementation
- Complete transformation of all SPL2 requirements
- Schema registry infrastructure
- IDE/CI/CD integration
- Cross-domain demonstration (validate pattern in software first)

**Future work (post-exploration):**
- Production transformation tooling
- Schema registry for SPL2 requirements
- Automated validation in development workflow
- Cross-domain methodology application
- Community schema library

---

**Addon to:** Repository Streaming Structure project

**Status:** Ready for inclusion when parent project initiates

---

**This exploration could be the key differentiator for TDC as general AI methodology.**

The innovation is not in rigid schemas (exist) or natural language requirements (exist), but in the **rigorous bidirectional transformation between them**, powered by AI, maintaining compatibility, enabling both human flexibility and tool automation.

If we can schemafy natural language requirements, we're close to formal natural language ↔ strict/rigid schema transformation and compatibility checking. That's the unlock for methodology generalization and tooling ecosystem integration.
