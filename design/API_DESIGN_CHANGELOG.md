# API_DESIGN.md Changelog

**Purpose:** Track evolution of API design documentation
**Pattern:** Mutable design doc with CHANGELOG (like glossary/ pattern)

---

## 2025-11-20

**Version:** v0.4.0 (Module structure, executable selfevals, native vs wrapper APIs)
**Changes:**
- **New section:** Module Structure (Project 08)
  - Four-level hierarchy (Module → Package → API → Method)
  - Standalone work modules with version-stamped inheritance
  - README.md as mutable entry point at each level
- **New section:** Executable Selfeval Pattern (Project 08)
  - File naming: `{req_name}_selfeval*.js` with optional data files
  - Single concern principle (one test per script)
  - Local rules apply (each node tests only itself)
  - Test runner for cascading execution
- **New section:** API Invocation Model (Project 08)
  - Stateful API, stateless methods
  - Three-layer sandwich (API state → previous output → method input)
  - API invocation schema (envRoot, setupRoot, defaults, batch)
- **New section:** Native vs Wrapper APIs (Project 08)
  - Decision criterion: does external vocabulary fit DSL?
  - Underscore namespace convention: `_` splectrum internal, `__` wrapper internal
  - Work module discipline: wrapper alone is incomplete, must include native API
- **New section:** Work Package Pattern (Project 08)
  - Self-contained structure with spec, selfevals, schemas
  - Handoff pattern for delegation
  - Setup folder pattern for accumulating completed work
- **New section:** Fluency and Friction Metrics (Project 08)
  - Fluency as implementation smoothness measure
  - Friction as partnership signal (not capability gap)

**Context:** Project 08 - Dev Environment API
**Reason:** Capture patterns from building dev environment infrastructure. Module structure, executable selfevals, and work packages enable autonomous/delegated development. Native vs wrapper API distinction with underscore convention clarifies API architecture.

---

## 2025-11-19

**Version:** v0.3.0 (Console API patterns, schema-driven merge)
**Changes:**
- **New section:** Invocation Levels and API Types
  - Invocation at any level (package/API/method)
  - API input structure (method defaults + batch + API-specific)
  - Schema-driven property selection for three-layer merge
  - Wrapper APIs vs DSL APIs distinction
  - Package types (core, tools, api)
- **New section:** Boundary Validation Model
  - "Code dangerously with external safeguards" pattern
  - Self-evaluation development model
  - Method requirements with self-eval spec
- **New section:** Runtime and Execution Responsibilities
  - Runtime context (read-only environment properties)
  - Execution context (state management, invocation coordination)
  - "Free scripting → API wrapping" pattern
  - Context structure (data/metadata/args)
- **Updated:** API Package Structure
  - Method folders with index.js pattern
  - Underscore prefix for auxiliary folders (_schemas/, _help/, etc.)
  - Naming conventions documented
- **Updated:** Glossary term bolding for cross-references

**Context:** Project 07 - Console API Exploration v7
**Reason:** Capture practical implementation patterns from first complete wrapper API. Document runtime/execution responsibilities discovered during dev environment work. Establish conventions (underscore prefix, method folders) that emerged from implementation.

---

## 2025-11-18

**Version:** v0.2.0 (AI-primary paradigm shift)
**Changes:**
- **Major paradigm shift:** CLI primary → JS primary invocation
- AI writes JavaScript functions, CLI is secondary wrapper for "AI absent" mode
- AVRO schemas as single source of truth (types, validation, help generated)
- TypeScript types generated from AVRO for IDE support and type safety
- Squash pattern for argument/context layering (framework handles complexity)
- Optional chaining (`?.`) for flat ctx access
- No camelCase transformation - lowercase naming throughout
- No string-based invocation or property access in AI code
- Simplified naming: two representations only (JS objects, URN identification)
- Updated sections:
  - Method Invocation Patterns (was CLI-Callable Methods)
  - Argument Passing and Context (was Multi-Level Argument Passing)
  - State Access - Flat Context with Optional Chaining
  - Discovery and Help System (AVRO is specification)
  - JavaScript API (Primary) (was Programmatic API Future)
  - Dynamic Composition (was Batch Execution Pattern)
  - Implementation Approach
  - MVP vs End Vision
  - Design Principles Summary
- **New section:** Scripting-to-API Promotion Pattern
  - Prerequisites for autonomy (requirements + self-evaluation tools)
  - Free scripting with full internal access
  - Filing decision as navigation (structure guides)
  - Vocabulary extension through use
  - Frictionless promotion path

**Context:** Partnership reflection discussion on AI-primary execution model
**Reason:** AI is primary user of Splectrum APIs (writes code, calls functions, needs help, executes). CLI is convenience wrapper for humans operating without AI collaboration. Scripting-to-API promotion enables path to autonomous API creation with discipline (requirements/self-evaluation before autonomy).

---

## 2025-11-17

**Version:** v0.1.0 (moved to design/ spot)
**Changes:**
- Moved from projects/03-runtime-hello-world/API_DESIGN.md to design/API_DESIGN.md
- Changed status from "Design in progress" to "Active - validated patterns"
- Added mutable design document metadata (changelog reference, register reference)
- Established as foundational platform design documentation
- Elements cataloged in DESIGN_REGISTER.md

**Context:** Project 05 - implementing CIP-013 (Design Spot Setup)
**Reason:** Establish design/ spot for platform design documentation following established patterns (glossary/, cips/)

---

## 2025-11-10 (Project 03)

**Version:** v0.1.0 (initial)
**Changes:**
- Initial comprehensive design document created during Project 03
- Captured decisions from Twin Pair 1 and Twin Pair 2 planning
- Defined MVP scope and end vision
- 13 major sections covering API architecture end-to-end:
  1. API as Elementary Building Block
  2. API Structure (MVP)
  3. Multi-Level Argument Passing
  4. State Backing Architecture
  5. Runtime State Stack Architecture
  6. CLI-Callable Methods and Invocation Patterns
  7. API Compilation and Script Integration (Future)
  8. Artifact Identification
  9. Common Names Glossary
  10. API Design Patterns
  11. MVP vs End Vision
  12. Design Principles Summary
  13. Implementation Roadmap

**Context:** Project 03 - Runtime Structure "Hello World"
**Validation:** Proven through Twin Pair implementations in Project 03, Bare runtime validation in Project 04

---

## Future Changes

**Expected evolution:**
- Pattern refinements based on implementation evidence
- Additional design elements as complexity justifies
- Integration with DSL engine design (when developed)
- P2P layer coordination patterns (when implemented)
- CIP-014 comprehensive design work (when triggered)

**Changelog maintenance:**
- Document significant changes with date, version, context
- Reference projects/CIPs that drove changes
- Preserve rationale for design decisions
- Track what was added/changed/removed and why
