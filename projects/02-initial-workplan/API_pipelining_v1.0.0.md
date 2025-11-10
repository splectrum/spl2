# API Pipelining v1.0.0

**Created:** Project 02 (initial-workplan)
**Version:** 1.0.0
**Status:** Exploratory - Hypothesis to be tested through design and implementation
**Maturity:** 🟡 Exploratory

Extracted from PRINCIPLES_DETAILED.md for better organization.

---

## Core Concept

**DSL Creation = API Pipelining:**
- DSLs aren't written from scratch
- They're composed by chaining existing API calls
- Output of one method → Input of next method
- Type compatibility enforced (AVRO schemas define contracts)
- State-backed APIs with their methods become building blocks

---

## Critical Design Decision

**The pipelining mechanism IS the DSL engine's power.** How APIs compose determines what's possible. The capability of the DSL engine depends heavily on how this pipelining is implemented.

---

## Implementation Approaches to Explore

### 1. Code-based (JavaScript)
```javascript
api1.method(input)
  .then(api2.method)
  .then(api3.method)
```
- Maximum flexibility
- Direct control
- But verbose for common patterns

### 2. Scripting/Declarative
```javascript
pipeline([
  [api1, 'method', params],
  [api2, 'method'],
  [api3, 'method']
])
```
- Concise for common patterns
- Discoverable, composable
- But less flexible

### 3. Hybrid approach?
- Combine benefits of both?
- To be explored

---

## Design Questions to Answer

### Discovery & Composition
1. How do I (AI) discover what APIs are available?
2. How do I find compatible methods (output → input matching)?
3. How do I compose them efficiently?
4. What makes it easy for me to build DSLs?
5. Should I be able to query "what methods accept this output type?"

### Implementation & Debugging
6. What did I prefer in spl1 and why? (need to review archive)
7. Is there a visual/structural representation of pipelines?
8. How do I debug a pipeline?
9. How do I test a pipeline?

### Capability & Power
10. What level of abstraction is most powerful for AI?
11. How does pipelining work with state-backed APIs?
12. Can pipelines be saved and reused?
13. How do error handling and data transformation work in pipelines?

---

## Requirements for Pipelining Implementation

**Must enable:**
- Type-safe composition (AVRO schema validation)
- Discoverable APIs and methods
- Easy for AI to compose and understand
- Debugging and validation
- State management through pipeline

**Implementation should be:**
- Most suitable/powerful for AI way of working
- Optimized for how AI discovers and composes
- Simple for common cases, flexible for complex ones

---

## Next Steps

Create work plan to:
1. Review spl1 implementation for lessons learned
2. Design pipelining mechanism
3. Build prototype to validate approach
4. Iterate based on actual AI usage patterns
