# API_DESIGN.md Changelog

**Purpose:** Track evolution of API design documentation
**Pattern:** Mutable design doc with CHANGELOG (like glossary/ pattern)

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
