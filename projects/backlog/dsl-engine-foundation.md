**Requirements:** See `projects/02-initial-workplan/Backlog_item_requirements_v1.0.0.md`

# DSL Engine Foundation

**Type:** Exploration Project
**Status:** Backlog
**Priority:** High
**Dependencies:** E-001 (Runtime Structure "Hello World"), E-002 (Kafka Compatible Records), E-003 (AVRO Schema and RPC), E-004 (API State Management)

---

## Purpose

Build the core DSL engine that enables AI to create task-optimized languages through API composition, making SPL2's architecture useful for actual development.

---

## What This Delivers

**DSL engine capabilities from AI user perspective:**

1. **Discoverability**
   - API library browser/search
   - Browse by category, purpose, or type
   - Clear documentation generated from API definitions
   - Understand APIs without reading implementation

2. **Type-Guided Composition**
   - Show available next APIs based on output types
   - Immediate validation feedback
   - Prevent incompatible compositions
   - AVRO schema-based type checking

3. **Clear Semantics**
   - Input/output contracts for each API
   - Side effects declaration
   - State requirements/modifications
   - Execution guarantees

4. **Low-Friction Experimentation**
   - Quick pipeline testing
   - Individual API testing harness
   - Fast feedback loop
   - Interactive development experience

5. **Pattern Reuse**
   - Save pipelines as new higher-level APIs
   - Pipelines become building blocks
   - Growing library of composed patterns
   - Composability at multiple levels

6. **Error Context**
   - Pipeline failure location
   - Failure reason (type mismatch, missing state, etc.)
   - Actionable fix suggestions
   - State visibility at failure point

7. **State Visibility**
   - Available state in execution context
   - State access patterns from APIs
   - State production by APIs
   - State flow through pipeline

8. **Natural Expression**
   - Task-appropriate DSL creation
   - Not forced into awkward patterns
   - Domain-specific abstractions
   - AI-friendly definition language

---

## Success Criteria

**Working DSL engine:**

1. ✅ Can define APIs with discoverable metadata
2. ✅ Type-guided composition working
3. ✅ Can create pipelines that execute correctly
4. ✅ Pipelines can be saved as new APIs
5. ✅ API library browser/search working
6. ✅ Clear error messages with context
7. ✅ State visibility throughout execution
8. ✅ Example task-specific DSL created by AI
9. ✅ Testing harness for APIs and pipelines
10. ✅ Documentation generated from definitions

**Evidence of success:**
- AI can discover and compose APIs easily
- Type checking prevents invalid pipelines
- Clear patterns for creating new DSLs
- Growing API library working smoothly
- Good developer experience validated

---

## Why This Is High Priority

**Core value proposition:**
- DSL engine is what makes SPL2 powerful
- Enables AI to create custom languages for tasks
- Unlocks all feature development
- Core differentiator of the platform

**Blocked by foundational items** - needs runtime, records, schemas, and state management validated first.

---

## Approach

**Feature project (3-4 weeks):**
1. Design API definition format with rich metadata
2. Build type-guided composition system
3. Implement pipeline execution engine
4. Create API library structure with discovery
5. Build testing harness
6. Implement pattern reuse (pipelines as APIs)
7. Create pipeline visualizer
8. Build example task-specific DSL
9. Document DSL creation patterns
10. Validate AI can create new DSLs effectively

**Deliverables:**
- DSL engine implementation
- API library infrastructure
- Testing harness
- Pipeline visualizer
- Example task-specific DSL
- DSL creation documentation
- Patterns for AI-driven DSL development

---

## Open Questions

- What's the right API definition format? (declarative, code-based, hybrid?)
- How granular should APIs be?
- Should the DSL engine itself be defined using the DSL? (bootstrap)
- What's the right balance between flexibility and type safety?
- How to version APIs in the library?
- How to handle breaking changes in API definitions?
- What's the testing story for composed pipelines?
- How to visualize complex pipelines?

---

## Links to Detail Files

- DSL engine concept: `projects/02-initial-workplan/DSL_engine_v1.0.0.md`
- API pipelining: `projects/02-initial-workplan/API_pipelining_v1.0.0.md`
- Data architecture: `projects/02-initial-workplan/Data_architecture_v1.0.0.md`

---

## Notes

This is the first major feature project after foundational explorations. Primary user is AI, so design should optimize for AI discoverability, composition, and creation of new DSLs. Success means AI can effectively use and extend the DSL engine.
