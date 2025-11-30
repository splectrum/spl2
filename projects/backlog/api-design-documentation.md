# API Design Documentation

**Priority:** High
**Dependencies:** Phase 1 complete (Dev Env v0 Bundle, spl/bug)
**Addons:** [Project 10 Design Docs Integration](project-10-design-docs-addon.md)
**CIP:** CIP-014 (Comprehensive API Design Phase)
**Type:** Documentation Project

---

## Purpose

Consolidate and structure all API design documentation created during Projects 07-09 into comprehensive, single-concern design docs. Transform the monolithic API_DESIGN.md and scattered exploration notes into a coherent design documentation system.

---

## Background

During Projects 07-09, substantial design thinking was captured in working documents:

**From Project 09 (Console v5 Stream Native):**

| Document | Key Concepts |
|----------|-------------|
| EXECUTION_EXPLORATION_NOTES.md | Batch pattern, execution mode, mutable vs immutable records, leaky bucket |
| API_ECOSYSTEM_NOTES.md | Wrapper vs DSL APIs, AVRO+Selfeval synergy, bidirectional validation |
| PIPELINE_DESIGN_NOTES.md | Fire-and-reference, three layers, data layer interfaces, value→result flow |
| OVERLAY_EXTRACTION_PATTERN.md | Multi-layer overlay, thin work modules, merge on extract |
| TYPE_HIERARCHY_OVERLAY_DESIGN.md | Type inheritance, declaration-driven, selectFile/collectAll, hierarchy map |
| PRACTICAL_PATTERNS.md | Bundle naming, dual naming strategy, version post-amble |
| DATA_VS_LANGUAGE.md | Mycelium (data) vs DSL (operators), panta rhei connection |
| EMERGING_PATTERNS.md | module_node, type hierarchy, selfeval naming, transfer block, node handler |
| LIB_RESOLUTION_PATTERN.md | Three-layer lib resolution, wrapper pattern, clean imports |

**From earlier projects:**
- API_DESIGN.md (design/ spot) - Monolithic, needs splitting
- DEV_ENVIRONMENT_DESIGN.md
- SELF_EVAL_DESIGN.md

---

## Scope

### Split API_DESIGN.md into Single-Concern Docs

Current API_DESIGN.md sections:
1. Core Architecture
2. Method Execution Model
3. State Management
4. Module Resolution
5. Platform Abstraction
6. (+ additions from Project 08)

Split into:
- EXECUTION_DESIGN.md - Method execution, handlers, completion
- STATE_DESIGN.md - State backing, API state, transfer block
- PIPELINE_DESIGN.md - Multi-step execution, event flow
- TYPE_SYSTEM_DESIGN.md - Type hierarchy, inheritance, overlay
- DATA_LAYER_DESIGN.md - Streaming vs mutable interfaces
- (others as needed)

### Integrate Project 09 Notes

Each exploration note feeds into appropriate design doc:
- EXECUTION_EXPLORATION_NOTES → EXECUTION_DESIGN.md
- PIPELINE_DESIGN_NOTES → PIPELINE_DESIGN.md
- TYPE_HIERARCHY_OVERLAY_DESIGN → TYPE_SYSTEM_DESIGN.md
- etc.

### Update DESIGN_REGISTER.md

Track all design elements with:
- Status (proposed, validated, stable)
- Source projects
- Related CIPs
- Relationships between elements

---

## Deliverables

1. **Split design docs** - Single-concern, well-structured
2. **Updated DESIGN_REGISTER.md** - Comprehensive element catalog
3. **Cross-references** - Clear links between related docs
4. **CHANGELOGs** - Track evolution of each design doc
5. **DSL glossary updates** - Terms emerging from design work

---

## Key Files (Project 09)

All in `projects/09-console-v5-stream-native/`:

- EXECUTION_EXPLORATION_NOTES.md
- API_ECOSYSTEM_NOTES.md
- PIPELINE_DESIGN_NOTES.md
- OVERLAY_EXTRACTION_PATTERN.md
- TYPE_HIERARCHY_OVERLAY_DESIGN.md
- PRACTICAL_PATTERNS.md
- DATA_VS_LANGUAGE.md
- EMERGING_PATTERNS.md
- LIB_RESOLUTION_PATTERN.md

---

## Success Criteria

- API_DESIGN.md split into focused docs
- All Project 09 design thinking incorporated
- All Project 10 design thinking incorporated (see addon)
- Single source of truth per concern
- Easy to find relevant design info
- Design docs support implementation work

---

## Notes

- This is documentation/organization work, not new design
- Design already exists in working docs - needs structure
- Enables better implementation: clear reference material
- Follows CIP-014 vision for comprehensive design documentation
