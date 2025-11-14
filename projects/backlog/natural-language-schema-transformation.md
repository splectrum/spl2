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

---

## Appendix: Post-Closure Design Discussion

**Date:** 2025-11-14 (Project 04 closure complete)

This appendix captures additional design insights discovered during collaborative discussion after project closure. These insights refine and extend the core addon concept.

---

### Layered Schema Architecture

**Discovery:** Repository should have layered schema architecture to balance flexibility and rigor.

**Three layers:**

```
Layer 3: Document Schema Layer
├─ Markdown schema (CommonMark dialect, version)
├─ Natural language requirements schema
├─ JSON document schema
├─ YAML document schema
└─ [extensible - add new document types]

Layer 2: Base AVRO Schema Layer
├─ All documents are type: "string"
├─ Traditional types: string, int, enum, boolean, timestamp
├─ Records, arrays, unions
└─ Standard AVRO validation

Layer 1: Storage Layer
├─ Immutable tables (insert-only streams)
├─ Mutable indexes (CSV/structured)
└─ Files on disk / Kafka topics
```

**Rationale:**

**Layer 1 (Storage):**
- Physical representation
- Streaming semantics (append-only, changelog)
- No schema enforcement at this level

**Layer 2 (Base Schema):**
- Universal, stable, simple
- Traditional AVRO types only
- Documents stored as `type: "string"`
- Metadata: `content_type`, `version`, `created`, etc.
- Tools that only understand base layer still work

**Layer 3 (Document Schema):**
- Extensible, domain-specific
- `content_type` field discriminates document type
- If `content_type == "markdown"` → validate against markdown schema
- If `content_type == "natural_language_requirement"` → validate against NL req schema
- Advanced tools understand document layer, others treat as string

**Benefits:**

1. **Clean separation:** Base layer universal, document layer specialized
2. **Backward compatibility:** Base schema changes don't break document schemas
3. **Incremental adoption:** Add document schemas progressively
4. **Extensibility:** New document types without changing base schema
5. **Natural language fits perfectly:** NL requirements become a document type

**Example base schema for requirement entry:**
```json
{
  "type": "record",
  "name": "RequirementEntry",
  "fields": [
    {"name": "id", "type": "string"},
    {"name": "version", "type": "string"},
    {"name": "category", "type": "string"},
    {"name": "content", "type": "string"},  // ← Just string at base layer
    {"name": "content_type", "type": "string"},  // "markdown", "nl_requirement", etc.
    {"name": "created", "type": "long", "logicalType": "timestamp-millis"}
  ]
}
```

**Validation workflow:**
```python
# Layer 2: Base schema validation (always)
avro.validate(entry, base_schema)

# Layer 3: Document schema validation (if type known)
if entry.content_type == "markdown":
    markdown.validate(entry.content, markdown_schema)
elif entry.content_type == "natural_language_requirement":
    nl_req.validate(entry.content, nl_req_schema)
```

---

### Index Format: CSV for Compact Mutable Lookups

**Discovery:** Indexes should use CSV/table format, not markdown tables.

**Rationale:**

**Current approach (markdown tables):**
- Human-readable in raw form
- But harder to parse than CSV
- Larger file size (markdown overhead)
- Tools render markdown anyway (raw readability less important)

**Proposed approach (CSV):**
```csv
term,detail_ref,requirements_ref,scope,status
"Collaboration","projects/05-.../Collaboration_detail_v1.0.0.md","projects/05-.../Collaboration_reqs_v1.0.0.md","global","active"
"Backlog","projects/BACKLOG.md","projects/04-.../Backlog_register_reqs_v1.1.0.md","global","active"
```

**Advantages:**
- ✅ Extremely compact (no markdown overhead)
- ✅ Machine-readable (trivial to parse)
- ✅ Tooling-friendly (every language has CSV libraries)
- ✅ Fast scanning (structured data)
- ✅ Easy regeneration (simple to rebuild from tables)
- ✅ Diff-friendly (line-by-line changes in git)
- ✅ Spreadsheet compatible (Excel/Sheets for manual edits if needed)

**For AI efficiency:**
- Compact = less context consumed = more efficient
- Structured = easier parsing
- Index optimized for machine lookup (primary use case)

**Pattern:**
- **Indexes (CSV):** Machine-optimized navigation
- **README.md (in same folder):** Human-oriented overview
- Best of both worlds

---

### Schema-Agnostic References, Schemafull Data

**Discovery:** Index references should be schema-agnostic, but referenced data is well-defined.

**Key insight:**

**Index references are schema-agnostic:**
```csv
term,detail_ref
"Collaboration","projects/05-.../Collaboration_detail_v1.0.0.md"
"Bug Report","projects/backlog/bug-report.md"
```

Same column type (`detail_ref`) can point to:
- Markdown documents
- JSON documents
- YAML documents
- Any document type

**Index doesn't care what schema the document has.**

**But documents themselves are NOT schemaless:**
- `Collaboration_detail_v1.0.0.md` → markdown schema (CommonMark 0.30)
- `bug-report.md` → backlog item schema (specific structure)
- Other entries → JSON schema, YAML schema, etc.

**The brilliance:**

- **Schemaless reference** = flexibility (index can point anywhere)
- **Schemafull data** = rigor (documents validated against their schemas)

**Index says:** "Here's where to find it"
**Document schema says:** "Here's how to interpret it"

**Like duck typing with explicit schema declarations:**
- Reference type is universal (just a path)
- But what's AT that path is well-defined
- Best of both worlds

---

### Extended Compatibility: AVRO Rules Apply to Document Schemas

**Discovery:** AVRO schema compatibility rules extend naturally to document schemas once NL transformation exists.

**Traditional AVRO compatibility (already exists):**
```
Index_v1.0.0 → Index_v1.1.0
- Added optional column: backward compatible ✓
- Removed required column: breaking change ✗
- Changed column type: breaking change ✗
```

**Extended: Document schema compatibility (with NL transformation):**
```
Requirements_v1.2.0 → Requirements_v1.3.0

Natural language level:
- "Added optional step 4.3: Review and Act on Learnings"

Transform to rigid schema:
- Added optional field: "review_learnings"
- Type: object
- Required: false

Apply AVRO compatibility rules:
- Optional field addition = backward compatible ✓
```

**Workflow:**
```
1. Transform NL requirements to rigid schemas:
   Requirements_v1.2.0.md → requirements_v1.2.0.avsc
   Requirements_v1.3.0.md → requirements_v1.3.0.avsc

2. Apply AVRO compatibility checker:
   avro.compatibility.check(v1.2.0, v1.3.0)

3. Result: Formal compatibility determination
   "v1.3.0 is backward compatible with v1.2.0"
```

**Benefits:**

- **Automated:** Tools check compatibility, not human judgment
- **Formal:** Schema evolution rules, not subjective
- **Strict:** Breaking changes explicitly identified
- **Tooling:** Existing AVRO compatibility checkers work

**Compatibility types:**

- **Backward compatible:** New version reads old artifacts (added optional fields)
- **Forward compatible:** Old version reads new artifacts (rare for requirements)
- **Full compatible:** Bidirectional (gold standard)
- **Breaking:** Removed required sections, stricter validation

**Example:**
```
Project_requirements_v1.2.0 → v1.3.0

Natural language changes:
- Added "4.3 Review and Act on Learnings"
- Renamed "Foundation Maintenance" to "Housekeeping"

Transform → compare:
- Added optional field: backward compatible ✓
- Renamed with alias: backward compatible ✓

Verdict: v1.3.0 backward compatible with v1.2.0
Artifacts pinned to v1.2.0 don't need immediate update
```

---

### Cross-Representation Compatibility (HUGE!)

**Discovery:** Formal compatibility checking **across representations** - natural language ↔ traditional schema.

**The unlock:**

Natural language and traditional schemas can evolve **independently**, with formal compatibility checking between them.

**Scenario:**

```
Natural Language Requirements_v1.0.0 ↔ Traditional Schema_v1.0.0

Question: Are they compatible representations of the same thing?

Formal answer possible!
```

**Bidirectional evolution:**

**1. Natural language evolves (human-optimized):**
- Requirements_NL_v1.0.0.md
- Requirements_NL_v1.1.0.md
- Human writes, refines, adds context, clarifies

**2. Traditional schema evolves (tool-optimized):**
- requirements_v1.0.0.avsc
- requirements_v1.1.0.avsc
- Tools generate, optimize, add validation, strictify

**3. Compatibility check across representations:**
```
Is Requirements_NL_v1.1.0 compatible with requirements_v1.0.0.avsc?

Transform NL v1.1.0 → rigid schema
Compare with traditional schema v1.0.0
Apply AVRO compatibility rules
Result: Compatible ✓ or Breaking ✗
```

**What this enables:**

**1. Best tool for each purpose:**
- IDE: Uses traditional schema (fast validation, autocomplete)
- Human: Reads natural language (understanding, context)
- Compatibility check: Ensures equivalence
- No forced choice between human or machine optimization

**2. Cross-representation validation:**
- "Does this NL requirement match this AVRO schema?"
- "Can artifacts validated against NL also pass AVRO validation?"
- Formal answer, not subjective

**3. Migration paths:**
```
Start:   Natural language only
Add:     Traditional schema (transformed)
Validate: Compatibility maintained
Evolve:  Both representations independently
Check:   Periodic compatibility validation
```

**4. Tooling integration:**
- CI/CD uses traditional schema (fast, automated)
- Documentation shows natural language (human-readable)
- Both guaranteed compatible
- Update either, verify compatibility

**Example:**

```
Natural Language (human-optimized):
────────────────────────────────────────────────────
"Step 4.3: Review LESSONS_LEARNED.md collaboratively.
Identify actionable items: CIPs, backlog items,
stepping stones work. Create identified items."

Traditional Schema (tool-optimized):
────────────────────────────────────────────────────
{
  "step": "4.3",
  "name": "review_learnings",
  "required": true,
  "inputs": ["LESSONS_LEARNED.md"],
  "outputs": {
    "type": "array",
    "items": {
      "oneOf": [
        {"$ref": "#/definitions/CIP"},
        {"$ref": "#/definitions/BacklogItem"},
        {"$ref": "#/definitions/SteppingStone"}
      ]
    }
  },
  "collaboration": true
}

Compatibility Check:
────────────────────────────────────────────────────
Transform NL → rigid schema
Compare with traditional schema
Verdict: Compatible ✓ (semantic equivalence verified)
```

**Why this is HUGE:**

**Solves the human vs machine tension:**
- Humans want: Natural language (expressive, flexible, contextual)
- Machines want: Rigid schemas (validatable, precise, automatable)
- Currently: Choose one OR maintain both manually (drift risk)
- **With formal compatibility:** Have both, verify equivalence automatically

**The innovation:**
Not just transformation (NL → schema), but **formal compatibility checking across representations** using schema evolution rules.

**Makes natural language a first-class schema representation** with all the rigor of traditional schemas!

**Strategic impact:**

This enables:
- Human flexibility + machine automation (simultaneously)
- Independent evolution of human and tool representations
- Formal verification of equivalence
- Best-in-class tooling without sacrificing human understanding

**For TDC methodology:**
- Humans work in natural language (low friction)
- Tools validate against rigid schemas (automated quality)
- AI bridges representations (transformation + compatibility)
- Both evolve, compatibility verified automatically

**This is the unlock for methodology at scale.**

---

### Hybrid Repository Architecture

**Summary of complete architecture:**

**Four integrated layers:**

**1. Streaming Layer:**
- Append-only changelog streams (Kafka-style)
- Tables = streams of entries
- CHANGELOG files = stream metadata/audit trail
- Temporal semantics, event sourcing

**2. Schemaless Layer:**
- Tables accept heterogeneous entries (project folders, chats)
- Freedom to add new artifact types
- Flexibility for exploration and emergence
- No enforced structure at storage level

**3. Schemafull Layer:**
- Requirements as schemas (NL → rigid transformation)
- Artifact-to-requirements pinning (first line reference)
- Versioned schemas enable evolution
- Validation against schemas (automated where possible)
- Document schemas at Layer 3 (markdown, NL reqs, JSON, YAML)

**4. Relational Database Layer:**
- Compact indexes in CSV/table format (mutable lookups)
- Cross-table references (indexes span multiple streams)
- Query optimization (find term → direct to entry)
- Indexes regeneratable from immutable tables
- Traditional AVRO schemas for indexes

**All four together:**
- **Streaming** = temporal semantics, audit trail, event sourcing
- **Schemaless** = flexibility, emergence, heterogeneous data
- **Schemafull** = validation, quality, compatibility checking
- **RDB** = efficient lookup, cross-references, navigation

**It's not either/or, it's all four working together!**

Natural language schema transformation is the bridge that lets structured (RDB/streaming) and unstructured (schemaless) coexist while maintaining rigor.

**This combination appears to be genuinely novel.**

---

### Requirements Format Evolution

**Discovery:** Once requirements have strict schema, traditional table format (one column per line) is better than markdown.

**Proposed format (YAML or JSON):**

```yaml
id: REQ-PROJ-CREATE-001
type: functional
category: project_lifecycle
version: 1.3.0
status: active
title: Project folder structure
description: |
  Folder created with required artifacts at project initiation.
  Provides operational definition of project existence.
rationale: |
  Clear structure enables tooling and automation.
  Operational definition prevents ambiguity.
validation:
  - Directory exists at projects/XX-project-name/
  - Contains PROJECT_BRIEF.md
  - Contains PROJECT_PLAN.md
  - Contains DAILY_LOG.md
  - Contains RISKS.md
related:
  - REQ-PROJ-CREATE-002
  - REQ-PROJ-INIT-001
```

**Why traditional table format over markdown:**

**1. Machine-parseable by design:**
- Key-value pairs trivial to parse
- No markdown parsing complexity
- Every language has parsers (JSON, YAML, TOML)

**2. Strict schema enforceable:**
- Required fields defined in schema
- Type checking possible
- Validation automated
- Missing fields immediately obvious

**3. Tooling-friendly:**
- Query by field (show all functional requirements)
- Filter by category, status, version
- Aggregate/analyze programmatically
- Generate documentation from structured data

**4. Compact and efficient:**
- No markdown overhead
- Dense information
- Less context consumed for AI

**5. Transformation-ready:**
- Structured format → rigid schema (AVRO/JSON Schema) = straightforward
- Markdown → rigid schema = parsing complexity
- Format IS already semi-structured

**Format preference:**
- **YAML** if human editing expected (readable, supports multiline)
- **JSON** if primarily tool-generated (strict, better validation)

**Key insight:**
Once we have rigid schemas (via NL transformation), **storage format should match schema structure**. Markdown is for human-oriented documents. Requirements are structured data. Store as structured data.

**Individual files or aggregated:**
- Individual requirement files: `requirements/REQ-PROJ-CREATE-001.yaml`
- Or aggregated by category: `requirements/project_lifecycle.yaml`
- Index points to either
- Both approaches compatible with schema-agnostic references

---

### Scope Updates

**Additional scope based on design discussion:**

**In scope (exploration) - ADDED:**
- Layered schema architecture validation (3 layers)
- Index format comparison (CSV vs markdown, measure efficiency)
- Cross-representation compatibility checking (NL ↔ traditional schema)
- Requirements format exploration (YAML/JSON vs markdown)
- Schema-agnostic reference pattern validation

**Out of scope (exploration) - CONFIRMED:**
- Full repository migration to new architecture
- Production CSV index generation tooling
- Complete requirements format conversion

**Future work (post-exploration) - ADDED:**
- Hybrid repository implementation (4 layers)
- CSV index tooling (generation, validation, querying)
- Requirements format migration (markdown → YAML/JSON)
- Cross-representation compatibility tooling

---

### Updated Success Criteria

**Additional criteria based on design insights:**

**Layered architecture:**
- ✅ 3-layer schema architecture validated (storage, base AVRO, document)
- ✅ Document type discrimination working (content_type field)
- ✅ Base schema + document schema validation demonstrated

**Index efficiency:**
- ✅ CSV index format proven more efficient than markdown (context cost measured)
- ✅ Schema-agnostic references validated (same ref type, different document schemas)

**Cross-representation compatibility:**
- ✅ Formal compatibility checking across NL ↔ traditional schema demonstrated
- ✅ Independent evolution of both representations validated
- ✅ Equivalence verification automated

**Requirements format:**
- ✅ Structured format (YAML/JSON) proven superior to markdown for requirements
- ✅ Transformation from structured to rigid schema demonstrated

---

### Strategic Impact (Updated)

**Original strategic impact:**
TDC becomes the methodology for AI-augmented work across all domains.

**Enhanced strategic impact (with design insights):**

**1. Hybrid repository architecture:**
- Combines streaming + schemaless + schemafull + RDB
- Novel architecture pattern (not documented elsewhere)
- Optimizes for both human and AI use simultaneously

**2. Cross-representation compatibility:**
- Natural language and traditional schemas both first-class
- Independent evolution with formal compatibility checking
- Solves human vs machine tension permanently

**3. Layered schema approach:**
- Universal base layer (simple, stable)
- Extensible document layer (rich, domain-specific)
- Clean separation enables innovation without breaking changes

**4. AI-native methodology:**
- AI bridges natural language ↔ rigid schemas
- Automated validation, compatibility checking
- Human flexibility preserved, machine rigor added

**If this exploration succeeds:**
- Repository architecture becomes reference implementation
- Cross-representation compatibility becomes methodology standard
- TDC demonstrates AI-native approach at scale
- Pattern replicable across domains

**This could establish TDC as the foundational methodology for the AI era.**

---

---

### Transaction Semantics and "Local Rules Apply"

**Discovery:** Project folders are transaction boundaries. "Local rules apply" = local transaction context.

**Key insight:**

Artifacts have different mutability depending on **transaction state**:

```
Project Active (uncommitted transaction):
├─ Artifacts MUTABLE (to project owner)
├─ Outside reads are "dirty reads" (may change)
├─ No guarantee of stability for external references
└─ Owner can modify freely

Project Closed (committed transaction):
├─ Artifacts IMMUTABLE (to everyone, including owner)
├─ Outside reads are "clean reads" (stable)
├─ External references guaranteed valid
└─ No further modification allowed
```

**Database transaction parallel:**

**Dirty read:**
- Project active → Owner creating/modifying artifacts
- External project references those artifacts
- External reads "uncommitted data" (may still change)
- Risk: Artifact might change before project closes

**Committed read:**
- Project closed → All artifacts committed (immutable)
- External project references artifacts
- External reads "committed data" (guaranteed stable)
- Safe: Artifacts won't change, references remain valid

**"Local Rules Apply" = Transaction Boundary**

```
Project folder (local context):
├─ Transaction scope
├─ Local rules govern mutability
├─ Owner has write access during Active
├─ Artifacts in transaction are mutable
└─ Commit (project close) → immutable forever

Outside project folder:
├─ Different transaction scope
├─ Can only read (not write)
├─ Dirty reads if project Active
└─ Clean reads if project Closed
```

**The local context bag IS the transaction context:**

**Context Active (transaction open):**
- Project status: Active (DAILY_LOG doesn't show "Project Completed")
- Artifacts: Mutable within context
- Owner: Has write access
- External access: Can read (dirty) but not write
- Transaction state: Uncommitted

**Context Closed (transaction committed):**
- Project status: Completed (DAILY_LOG shows "Project Completed")
- Artifacts: Immutable to everyone (including owner)
- Owner: Read-only now
- External access: Can read (clean)
- Transaction state: Committed

**"Local rules apply" means:**

1. **Transaction boundary:** This folder is a transaction scope
2. **Local governance:** Rules inside folder govern mutability
3. **Owner control:** Project owner controls artifact lifecycle
4. **External visibility:** Outside sees as read-only (or dirty read if active)
5. **Commit semantics:** Project closure commits transaction

**Artifact Lifecycle States:**

```
Draft → Active → Committed → (optional) Archived

Draft:     Being created within project (not yet visible externally)
Active:    Project active, artifact visible but mutable (dirty reads possible)
Committed: Project closed, artifact immutable (clean reads guaranteed)
Archived:  Old version, superseded but preserved (referenced by version)
```

**Reference Safety Rules:**

**Intra-project references:**
- Always safe (same transaction)
- Project references its own artifacts
- No isolation needed

**Inter-project references to committed:**
- Safe (clean read)
- Referenced project closed
- Artifacts guaranteed immutable

**Inter-project references to active:**
- Dirty read (caveat emptor)
- Referenced project still active
- Artifacts may change before commit
- Accept risk or wait for commit

**Current SPL2 behavior:**

We DO reference active project artifacts:
- Example: Foundation Update references backlog items created in Project 04 (while Project 04 active)
- Dirty read accepted
- Works because:
  - Single-threaded (one project at a time)
  - Collaborative (we know what's changing)
  - Low risk in practice

**Transaction Commit Trigger:**

```
Project closure = Transaction commit

DAILY_LOG entry:
"Project Completed: 2025-11-14"

Effect:
- All project artifacts transition: mutable → immutable
- Transaction state: Active → Committed
- External references now safe (clean reads)
- Owner loses write access (immutable to everyone)
```

**ACID Properties from Organizational Patterns:**

**Atomicity:**
- Project completes or doesn't (all-or-nothing)
- Partial completion = project aborted (still preserves artifacts)
- Commit = all artifacts finalized together

**Consistency:**
- Requirements evaluation ensures valid final state
- Artifacts meet quality criteria before commit
- Invalid state = evaluation fails, issues documented

**Isolation:**
- Project folder = isolated transaction scope
- Multiple projects possible (different folders = different transactions)
- Currently: serial execution (one active project at a time)
- Future: concurrent projects isolated by folder boundaries

**Durability:**
- Committed artifacts never change (immutable)
- Git preserves all versions
- GitHub backup ensures durability

**The Beauty:**

**No transactional infrastructure needed:**
- File system boundaries = transaction boundaries
- Project ownership = transaction ownership
- Project status (DAILY_LOG) = transaction state
- Simple, self-evident, no database required

**Transactional semantics without transactional infrastructure!**

**Folder = Transaction**
**Owner = Transaction manager**
**Project closure = Commit**
**Local rules apply = Local transaction context**

**Benefits:**

1. **Simple:** No complex transaction manager needed
2. **Natural:** Follows existing organizational patterns
3. **Visible:** Transaction state obvious (project status)
4. **Scalable:** Concurrent transactions via folder isolation
5. **Durable:** Git + immutability ensures ACID properties

**For Repository Streaming Structure:**

This transaction model integrates perfectly:

**Streaming layer:**
- Tables = transaction logs (append-only)
- Each entry = committed transaction artifact
- CHANGELOG = transaction history

**Schemaless layer:**
- Flexibility within transaction (any artifact type)
- Commit enforces schema compliance (requirements evaluation)

**Schemafull layer:**
- Requirements = transaction validity rules
- Evaluation = pre-commit validation
- Schemas ensure consistent committed state

**RDB layer:**
- Indexes reference committed transactions only (clean reads)
- Or accept dirty reads with awareness (active projects)

**Transaction semantics make the hybrid repository coherent!**

Each layer respects transaction boundaries. Project folder isolation provides transaction isolation. Project closure provides commit semantics. Requirements provide consistency guarantees.

**ACID properties emerge from organizational patterns + streaming + immutability.**

---

**End of Appendix**

**Note:** This appendix represents collaborative design thinking that occurred after Project 04 closure. Insights here refine and extend the core addon concept, establishing clearer architecture and validating strategic direction. These insights will inform exploration when Repository Streaming Structure project initiates.
