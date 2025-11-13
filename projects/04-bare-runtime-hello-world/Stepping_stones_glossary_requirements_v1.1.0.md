# Stepping Stones Glossary Requirements v1.1.0

**Created:** 2025-11-13 (Project 04)
**Extends:** chats/immutables/glossary_requirements_v1.0.0.md
**Status:** Active
**Applies to:** glossary/STEPPING_STONES_GLOSSARY.md

Requirements specific to Stepping Stones glossary, extending base glossary requirements.

---

## Purpose

Stepping Stones glossary serves dual purpose:
1. **Vocabulary:** Define foundational navigational concepts, patterns, methodologies
2. **Requirements register:** Track current requirements versions for foundation concepts

This dual function provides single source of truth for both concept definitions and operational requirements.

---

## Requirements (Extending Base)

### R8: Term Structure Validation

Terms with local scope MUST include scope suffix. Terms with global scope have no suffix.

**Structure pattern:** `[Modifier] [Scope]`

Examples:
- **Local scope:** "Exploration Project" (local to Project scope)
- **Local scope:** "Adhoc Activity" (local to Activity scope)
- **Global scope:** "Stepping Stones" (foundational concept, no suffix)

**Validation rule:**
- IF description indicates local context/scope → term MUST have scope suffix
- IF scope is global → no suffix needed
- Description must be clear about scope (local vs global)

**Rationale:**
- Scope suffix creates natural grouping and inheritance clarity
- "Project" has base requirements, "Exploration Project" extends them
- Discoverability: all terms with same scope cluster together
- Requirements register: scope maps to base requirements, modifiers to extensions

**Success Criteria:**
- Every term with local scope has explicit scope suffix
- Terms without suffix are clearly global concepts
- Description field clarifies scope (local or global)

**Example validation:**
- ✅ "Exploration Project" - description says "Type of project" (local to Project)
- ✅ "Twin-Pair Methodology" - description says "Type of methodology" (local to Methodology)
- ✅ "Stepping Stones" - description says "Foundational concept" (global)
- ❌ "Explorative" without "Project" suffix when description says "project type"

### R9: Requirements Register Function

Stepping Stones glossary serves as requirements register for foundation concepts.

**Structure requirement:**

Each glossary entry must include "Current Requirements" field specifying versioned requirements.

**Format:**
- **Term:** Concept name (with scope suffix if local)
- **Description:** What it is, scope (local/global)
- **When to Use:** Usage guidance
- **Current Requirements:** Path to current requirements version
- **Related Detail Files:** Additional context files

**Examples:**

**Project:**
- Description: Formal work unit with defined products, quality criteria, closure process (global scope)
- Current Requirements: `projects/04-bare-runtime-hello-world/PRINCE2_operational_v1.2.0.md`

**Exploration Project:**
- Description: Type of project for architecture discovery through twin pair methodology (local to Project scope)
- Current Requirements: `projects/project-types/Explorative_project_requirements_v1.0.0.md` (extends PRINCE2_operational)

**Backlog:**
- Description: Work queue of projects in execution order (global scope)
- Current Requirements: `projects/04-bare-runtime-hello-world/Backlog_register_requirements_v1.1.0.md`

**Rationale:**
- Single source of truth for current requirements versions
- Avoid hardcoding versions throughout codebase
- Mutable entry point (glossary) to immutable artifacts (requirements)
- Fits mutable-immutable dualism pattern

**Success Criteria:**
- Foundation concepts with requirements have "Current Requirements" field
- Field points to specific versioned file
- Field updated when requirements evolve
- Terms without requirements leave field empty (not all terms need requirements)

**Validation rule:**
- IF concept has formal requirements → Current Requirements field MUST be populated
- IF concept is purely descriptive → Current Requirements field empty

### R10: Alphabetical Organization

Glossary entries organized alphabetically by term name.

**Rationale:**
- Scope suffix ensures related terms cluster together naturally
- "Exploration Project" and "Template-Based Project" both appear under "P"
- Easy lookup without needing to know structure
- No need for explicit grouping by scope

**Success Criteria:**
- Entries in strict alphabetical order by term
- No scope-based sections or grouping

### R11: CHANGELOG Requirement

Stepping Stones glossary is mutable document protected by CHANGELOG.

**Maintenance:**
- Add/update entries inline (glossary file itself updated)
- Document all changes in STEPPING_STONES_CHANGELOG.md
- CHANGELOG entries capture: date, what changed, why, reference (project/chat)

**Format:**
```markdown
## 2025-11-13 (Project 04)
- Added "Exploration Project" entry with requirements reference
- Added "Current Requirements" column to all entries
- Rationale: Requirements register function established
```

**Success Criteria:**
- Every glossary change has corresponding CHANGELOG entry
- CHANGELOG provides audit trail for glossary evolution
- Changes reference source (project or chat where change originated)

---

## Entry Structure (Stepping Stones Specific)

**Required fields:**
1. **Term:** Concept name (with scope suffix if local scope)
2. **Description:** Definition, scope clarification (local/global)
3. **When to Use:** Usage guidance
4. **Current Requirements:** Path to requirements version (if applicable)
5. **Related Detail Files:** Additional context (if applicable)

**Optional fields:**
- Examples (if helpful for clarity)
- Notes (additional context)

**Format:** Markdown table with columns for each field

---

## Usage Pattern: Initiating Projects

When initiating project from backlog:

1. **Check backlog item detail** for project type (e.g., "Exploration Project")
2. **Look up term in STEPPING_STONES_GLOSSARY.md**
3. **Get "Current Requirements" value** (e.g., `Explorative_project_requirements_v1.0.0.md`)
4. **Look up base scope** (e.g., "Project" entry) for base requirements
5. **Create PROJECT_BRIEF.md** with both requirement references:
   - Line 1: Project type requirements
   - Line 2: Base PRINCE2_operational requirements

This pattern provides single source of truth for requirements versions.

---

## Changes from Base Requirements

**v1.1.0 additions to base glossary requirements:**
- R8: Term structure validation (scope suffix for local terms)
- R9: Requirements register function (Current Requirements field)
- R10: Alphabetical organization (explicit requirement)
- R11: CHANGELOG requirement (mutable document protection)
- Entry structure specific to Stepping Stones context
- Usage pattern for project initiation

**Relationship to base:**
- All base requirements (R1-R7) still apply
- These additions extend base for Stepping Stones specific needs
- Other glossaries (DSL, Spots) may have different extensions

---

## Validation Tests

### Term Structure Test
For each entry:
- IF description says local scope → term MUST have scope suffix → Pass/Fail
- IF description says global scope → term has no suffix → Pass/Fail

### Requirements Register Test
For each entry representing formal concept:
- IF concept has requirements → Current Requirements field populated → Pass/Fail
- Path in Current Requirements field must exist → Pass/Fail

### Alphabetical Order Test
- Entries sorted alphabetically by term → Pass/Fail

### CHANGELOG Test
- Recent glossary changes have CHANGELOG entries → Pass/Fail
- CHANGELOG entries have date, what, why, reference → Pass/Fail

---

## Quality Standard

Stepping Stones glossary meets requirements when:
1. All terms follow structure validation (scope suffix if local)
2. Foundation concepts have current requirements versions
3. Entries alphabetically ordered
4. CHANGELOG tracks all changes
5. Serves both vocabulary and requirements register functions
6. Maintained with minimal friction during work

---

**This requirements document enables Stepping Stones glossary to function as both vocabulary and requirements register, providing single source of truth for foundation concepts and their operational requirements.**
