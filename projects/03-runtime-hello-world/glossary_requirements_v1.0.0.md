# Glossary Requirements v1.0.0

**Created:** 2025-11-11
**Project:** 03 - Runtime Structure "Hello World"
**Status:** Active

## Purpose

The glossary establishes a consistent, global vocabulary for SPL2 development. It ensures semantic consistency across all APIs, methods, and properties, enabling compositional reasoning, type safety, and automated requirement generation.

## Requirements

### R1: Global Scope
The glossary must define vocabulary with global scope - one term has one meaning throughout SPL2.

**Rationale:** Prevents vocabulary drift, duplicate terms with different meanings, and ambiguity in composition.

**Success Criteria:**
- No term appears with multiple conflicting meanings
- Same concept always uses same term across all APIs
- Clear guidance when terms are proposed that conflict with existing entries

### R2: Structured Entry Format
Each glossary entry must contain:
1. **Term** - The vocabulary word
2. **Type** - Category (Package name | API name | Method name | Property name | Value type | Concept)
3. **Description** - Semantic definition of what the term means
4. **Requirement** - Behavioral contract describing what the term must do or be

**Rationale:** Structured format enables both human understanding and potential automation.

**Success Criteria:**
- All entries follow the four-column structure
- Descriptions are clear and unambiguous
- Requirements are actionable and verifiable

### R3: Type Classification
Terms must be classified by type to indicate their role in the system.

**Types:**
- **Package name** - Top-level organizational unit
- **API name** - Elementary building block (standalone deployable unit)
- **Method name** - Executable operation within an API
- **Property name** - Named value in headers/value/arguments
- **Value type** - Data structure or primitive type
- **Concept** - Architectural pattern or abstract idea

**Rationale:** Type classification enables requirement generation and compositional validation.

**Success Criteria:**
- Every entry has a type classification
- Type accurately reflects the term's role
- Consistent typing enables automated processing

### R4: Semantic Consistency
Terms with related meanings must be clearly distinguished. Similar concepts must either use the same term (if truly identical) or distinct terms with clear differentiation.

**Rationale:** Prevents confusion and enables accurate composition.

**Success Criteria:**
- Related terms have clear distinction in descriptions
- No near-synonyms with ambiguous boundaries
- Relationships between terms are explicit

### R5: Requirement Integration
Each term's requirement must provide a natural language contract that can be composed into higher-level requirements.

**Rationale:** Enables partial requirement generation from vocabulary alone (package + API + method names generate baseline requirement).

**Success Criteria:**
- Requirements are composable (can be combined into larger requirements)
- Requirements are specific enough to be verifiable
- Requirements link vocabulary to behavior

### R6: Schema Alignment (Future)
When AVRO schemas exist, glossary terms representing data structures should reference their canonical schema.

**Rationale:** Type safety foundation - ensures same term = same schema everywhere.

**Success Criteria:**
- Property names reference AVRO schemas when available
- Value types link to schema definitions
- Schema evolution tracked through glossary

**Note:** Deferred to future tooling. Manual glossary may include schema references inline in descriptions when helpful.

### R7: Maintenance Process
Glossary entries must be added/updated as new vocabulary is introduced during development.

**Process:**
1. When creating new package/API/method/property, check glossary first
2. If term exists, use existing definition and requirement
3. If term is new, add entry with four required columns
4. If term conflicts, resolve before proceeding with implementation
5. Review glossary during code reviews for consistency

**Rationale:** Glossary is only valuable if maintained consistently.

**Success Criteria:**
- All code vocabulary appears in glossary
- Glossary updated before or during implementation (not after)
- No orphaned terms (glossary entries without usage) or missing terms (code vocabulary without entries)

### R8: Manual Management (MVP)
For Project 03, glossary is manually maintained without automated tooling.

**Rationale:** Prove the pattern, capture tooling requirements through use.

**Success Criteria:**
- Glossary remains usable and valuable despite manual process
- Pain points documented for future tooling requirements
- Manual overhead is acceptable (doesn't block development)

**Note:** High-priority CIP for glossary tooling to be created at project closure.

## Non-Requirements (Deferred)

### Schema Reference Column
Not included in MVP. Many terms won't have schemas yet. Can be added inline in descriptions when helpful, or added as column when schemas are pervasive.

### Examples Column
Not included in MVP. Examples valuable but optional. Can be added inline in descriptions when helpful, or added as column if evidence shows need.

## Success Criteria

The glossary requirements are satisfied when:
1. GLOSSARY.md exists with all current SPL2 vocabulary
2. All entries follow four-column structure (Term | Type | Description | Requirement)
3. No vocabulary conflicts or ambiguities
4. Glossary is consulted and updated during development
5. Requirements are composable and actionable
6. Manual maintenance overhead is acceptable

## Quality Assessment

This requirements document will be assessed against:
- Completeness: Does it define what the glossary must do?
- Clarity: Are requirements unambiguous and verifiable?
- Minimal and complete: Does it capture essentials without over-specification?
- Usability: Can developers use this to maintain the glossary?
