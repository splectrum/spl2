**Requirements:** ../04-bare-runtime-hello-world/Exploration_project_requirements_v1.1.0.md
**Requirements:** ../05-foundation-update-documentation-templates/PRINCE2_operational_v1.2.0.md

# Project 07: Console API - AI-Primary Execution Model

**Type:** Exploration Project
**Priority:** High
**Dependencies:** Project 05 (Foundation Update & Documentation Templates)

---

## Purpose

Prove AI-primary execution model through implementing SPL2 Console API. Validates that AI can discover, inspect, call, and compose SPL2 methods with minimal friction. Establishes patterns for all future API development.

---

## Context

**Current situation:**
- API design comprehensively documented (design/API_DESIGN.md - 13 design elements)
- Patterns validated in Projects 03-04 at conceptual level
- But no working implementation of AI-primary invocation model
- Need to prove: AVRO-driven contracts, programmatic calls, discovery, composition

**Problem:**
- How do AI and humans invoke SPL2 methods with minimal friction?
- Should AI generate CLI strings or call JavaScript functions?
- How does AVRO schema validation integrate transparently?
- How does discovery/introspection work in practice?

**Solution:**
- AI-primary: Native JavaScript function calls with object arguments
- AVRO validates transparently inside each function
- Discovery API provides schema introspection
- CLI wrapper is thin layer for human convenience (secondary)
- Console API proves pattern with familiar, useful domain

**Why console API:**
- Familiar domain (everyone knows logging)
- Real utility (SPL2 needs logging, will actually use this)
- Not trivial (has state, multiple methods, types, composition)
- Not complex (won't distract from proving architecture)
- Easy Bare compatibility (console exists everywhere)
- Demonstrates all patterns (state backing, AVRO, discovery, CLI wrapper)

---

## Objectives

**Primary:**
1. **Prove AI-primary invocation** - Can AI call SPL2 methods as naturally as any JS library?
2. **Validate AVRO integration** - Does transparent validation work without friction?
3. **Establish discovery pattern** - Can AI introspect available methods/contracts?
4. **Enable type-guided composition** - Can AI chain methods based on type compatibility?
5. **Create reusable patterns** - Establish templates for all future APIs

**Secondary:**
1. **Deliver useful artifact** - Working console API SPL2 will actually use
2. **Validate CLI wrapper** - Thin layer for human exploration works
3. **Measure friction** - Evidence on what works vs what creates resistance

---

## Products (Twin Pair)

### Product 1: Design Document

AI-primary execution model architecture:
- Module structure and export patterns
- Schema embedding approach (co-located with code)
- Discovery API design (how to query methods/schemas)
- Validation flow (where/how AVRO validation happens)
- Composition patterns (type-guided method chaining)
- CLI wrapper architecture (thin layer for humans)
- State backing implementation
- Error handling patterns
- Template for future APIs

### Product 2: Console API Implementation

Working implementation demonstrating all patterns:
- Console API with 5 methods:
  - `configure(config)` - Set log level, format, output destination
  - `log(state, {level, message, data})` - Primary logging
  - `error(state, {message, data})` - Error logging
  - `warn(state, {message, data})` - Warning logging
  - `flush(state)` - Flush buffers
- AVRO schemas for all inputs/outputs/state
- Discovery API implementation
- Validation integration
- CLI wrapper (human convenience)
- Tests proving AI usage patterns
- Bundle size measurement

---

## Evidence Gathering

**Friction measurements:**
- Can AI discover methods? (friction level)
- Can AI inspect contracts? (friction level)
- Can AI call methods naturally? (friction level)
- Does AVRO validation work transparently? (friction level)
- Can AI compose methods type-safely? (friction level)

**Technical measurements:**
- Bundle size impact
- CLI wrapper code size (target: 50-100 lines)
- Pattern scalability to other APIs

---

## Scope

### In Scope

- Design document with execution model architecture
- Console API implementation (5 methods)
- AVRO schemas for all contracts
- Discovery API
- CLI wrapper
- Tests demonstrating AI usage
- Bundle size measurement
- Pattern documentation for reuse

### Out of Scope

- Production-ready logging features (advanced formatters, transports)
- Performance optimization
- Comprehensive error handling (prove pattern suffices)
- Multiple output destinations (file system sufficient for MVP)
- Log rotation, buffering strategies (beyond basic flush)
- Integration with external logging services

**Deferred to future:**
- Applying pattern to other APIs (after proven here)
- CLI parser enhancements (keep minimal)
- Schema registry/management
- Advanced composition patterns

---

## Success Criteria

**Must achieve:**
1. AI can discover methods - Query interface returns available methods and contracts
2. AI can inspect contracts - AVRO schemas accessible programmatically
3. AI can call methods naturally - Import and call with zero friction
4. AVRO validation works - Invalid calls caught before execution, clear error messages
5. Composition works - Can chain configure → log → flush based on types
6. CLI wrapper works - Humans can call same methods via command line
7. Pattern documented - Design doc provides template for future APIs
8. Evidence captured - Friction levels measured, bundle size known

**Quality indicators:**
- Calling console API feels no different than calling any JavaScript library
- AVRO validation is transparent (don't think about it unless error)
- Discovery is intuitive (obvious how to find methods)
- CLI wrapper adds minimal code
- Bundle size acceptable for Bare runtime
- Pattern clear enough for next API to follow

---

## Approach

**Exploration process:**
1. Design execution model
2. Implement first method (configure) - prove basic pattern
3. Add second method (log) - prove state backing
4. Add remaining methods - prove composition
5. Implement discovery API - prove introspection
6. Add CLI wrapper - prove human convenience
7. Measure friction throughout
8. Document patterns for reuse

---

## Risks

**R01: AVRO integration complexity**
- Risk: AVRO validation might be too complex/heavyweight
- Mitigation: Measure bundle size, test in Bare, fall back to simpler validation if needed
- Likelihood: Low (AVRO already validated in product-poc)

**R02: Discovery API design unclear**
- Risk: Not obvious how AI should query schemas
- Mitigation: Try multiple approaches, measure friction, let evidence decide
- Likelihood: Medium (unexplored territory)

**R03: Pattern doesn't scale**
- Risk: Works for console API but not for complex APIs
- Mitigation: Exploration project goal is to find this out, adjust pattern if needed
- Likelihood: Low (architecture already thought through)

**R04: CLI wrapper adds too much code**
- Risk: Generic CLI parsing more complex than expected
- Mitigation: Use minimist or similar (battle-tested, tiny), keep wrapper minimal
- Likelihood: Low (CLI is secondary concern)

---

## Dependencies

**Requires:**
- Project 05: Foundation Update & Documentation Templates (complete)
- design/API_DESIGN.md (architectural patterns defined)
- AVRO library decision (or build minimal wrapper)

**Enables:**
- All future API implementations (pattern proven, template available)
- Bare Runtime Compatibility (console API works on Bare)
- DSL Engine Foundation (AI invocation model validated)
- API State Management (state backing pattern proven)

---

## Related Work

**Foundation documents:**
- design/API_DESIGN.md - Comprehensive API architecture
- design/DESIGN_REGISTER.md - 13 validated design elements

**Projects:**
- Project 03: Runtime Structure Hello World (conceptual validation)
- Project 04: Bare Runtime Hello World (runtime validation)

---

**Created:** 2025-11-18
