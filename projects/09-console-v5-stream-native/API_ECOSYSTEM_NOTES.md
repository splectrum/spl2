# API Ecosystem and Validation Notes

**Date:** 2025-11-23
**Context:** Product Twin 1 - Building Blocks Exploration

---

## API Type Taxonomy

### Three Top-Level API Types

1. **Wrapper APIs**
   - Wrap external functionality (Node.js, Bare, Browser APIs)
   - Naming: single underscore `_`
   - Example: `spl/console` wraps console.log/error/warn/etc.

2. **DSL APIs**
   - Native SPL2 vocabulary
   - Naming: double underscore `__` (when needed)
   - Two major subtypes (so far)

3. **[Future API types TBD]**

---

## DSL API Subtypes

### DSL/Execution APIs

**Common feature:** Library of API states stored in `value` property (data part)

All DSL/Execution APIs share the pattern of maintaining a library of API states that accumulates through execution.

#### DSL/Execution/Runtime

**Base execution context:**
- Platform, environment, configuration
- API states library (canonical location)
- No flow management - just context/properties
- Free scripted handlers

**Structure:**
```javascript
runtime: {
  value: {
    // Library of API states (canonical)
    console: { lastLevel: "info", outputCount: 5, ... },
    dev: { currentEnv: "test", lastCreate: {...}, ... },
    pipeline: { ... },
    // etc - all API states accumulate here
  },
  platform: "node",
  environment: {...},
  config: {...}
}
```

#### DSL/Execution/Error

**Error flow management (extends runtime):**
- Inherits/builds on runtime foundation
- Adds error-specific flow patterns
- Error handling = mode switch

**Structure:**
```javascript
error: {
  value: null,  // or { type, message, stack, context, ... }
  // Extends runtime - has access to runtime.value API states library
}
```

#### DSL/Execution/Pipeline

**Rigid pipeline flow management:**
- Sequential, parallel, conditional, adaptive flows
- Pipeline type identification
- Step tracking and progression

**Structure:**
```javascript
pipeline: {
  value: {
    // Pipeline-specific state? Or reference to runtime.value?
    // TBD through prototyping
  },
  pipelineType: "spl/console",
  mode: "sequential",
  stepIndex: 2,
  steps: [...]  // or dynamically expanded
}
```

### DSL/[Other] APIs

Non-execution DSL APIs - TBD as we discover them.

---

## Validation Pattern: AVRO + Selfeval Synergy

### Two-Layer Validation

**AVRO Schema:**
- Structure compliance (shape, types, required fields)
- Fast structural filtering
- Serialization/deserialization
- Machine-readable spec

**Selfeval:**
- Semantic compliance (invariants, relationships, business rules)
- Deep logic validation
- Executable spec
- Human-readable through code

**Together:** Complete specification (structure + meaning)

### Example: DSL/Execution/Runtime/Value

**AVRO Schema:**
```json
{
  "type": "record",
  "name": "DSL_Execution_Runtime_Value",
  "namespace": "spl.dsl.execution.runtime",
  "fields": [
    {
      "name": "apiStates",
      "type": {
        "type": "map",
        "values": "APIState"
      }
    }
  ]
}
```

**Selfeval:**
```javascript
// reqs/dsl_execution_runtime_value_v1.0.0_selfeval.js
module.exports = function(record) {
  // Schema ensures apiStates exists and is a map

  // Selfeval ensures semantics:
  // - API states are internally consistent
  // - Required APIs present for execution context
  // - State transitions are valid
  // - No orphaned references

  const { apiStates } = record.execution.runtime.value

  // Validation logic...

  return { pass: true/false, details: {...} }
}
```

---

## Bidirectional Validation Use Cases

### 1. Compliance Testing (Known API → Validate Record)

**Given:**
- Execution record
- Known API type (e.g., "DSL/Execution/Pipeline")

**Process:**
1. Run AVRO schema validation (fast structural check)
2. Run all selfevals for that API type
3. Return pass/fail with details

**Use case:** Validate handler output before writing to queue

```javascript
const isCompliant = await validateRecord(record, "DSL/Execution/Pipeline")
// true/false + validation details
```

### 2. Discovery Testing (Unknown Record → Find Compatible APIs)

**Given:**
- Execution record of unknown/uncertain type
- Library of candidate APIs

**Process:**
1. Filter candidates via AVRO schema (structural compatibility)
2. Run selfevals on survivors (semantic compatibility)
3. Return list of compatible APIs

**Use case:** Determine what APIs a captured event stream is compatible with

```javascript
const compatibleAPIs = await discoverAPIs(record)
// ["DSL/Execution/Runtime", "DSL/Execution/Error", ...]
```

**Migration detection:**
- Which APIs can this record work with?
- What's the migration path from v1 to v2?
- Can this legacy record run on new handlers?

---

## Local Rules Apply: Complexity → Low Friction

### The Pattern

**Complex system** = Many small, simple, local rules

Instead of:
- One giant spec document
- Complex validation logic
- Monolithic schema

Build:
- Many small req files (one concern each)
- Many small selfevals (one invariant each)
- Composable AVRO schemas (reusable types)

### Example Decomposition

**API States Library** breaks into:

1. `dsl_execution_runtime_value_v1.0.0.md`
   - Spec: Runtime must have value property containing API states map
   - Selfeval: Validates map structure exists

2. `dsl_execution_runtime_value_api_state_consistency_v1.0.0.md`
   - Spec: Each API state must be internally consistent
   - Selfeval: Validates individual API state invariants

3. `dsl_execution_runtime_value_required_apis_v1.0.0.md`
   - Spec: Required APIs must be present for execution context
   - Selfeval: Validates required APIs exist for given platform/mode

4. `dsl_execution_runtime_value_state_transitions_v1.0.0.md`
   - Spec: State transitions must be valid
   - Selfeval: Validates before/after state pairs are legal

Each req:
- Single concern
- Clear selfeval
- Composable with others
- Local rules apply

**Result:**
- Easy to understand (one thing at a time)
- Easy to test (run one selfeval)
- Easy to evolve (change one req)
- Low friction through decomposition

---

## Key Insights

1. **Execution = API type, not instance** - Reserve "execution" as descriptor for API category
2. **Runtime nested under execution** - `execution.runtime`, not peer
3. **Error extends runtime** - Inheritance/extension pattern in API types
4. **Value property pattern** - All DSL/Execution APIs maintain state in `value`
5. **API states library canonical in runtime.value** - Single source of truth
6. **AVRO + Selfeval = Complete spec** - Structure + semantics together
7. **Bidirectional validation** - Compliance and discovery both possible
8. **Local rules apply to specs** - Decompose complexity into many small reqs
9. **Trial and error discovery** - Run selfevals to find compatible APIs
10. **Migration path detection** - Discover what APIs a record can work with

---

## Next: Prototype

With this understanding, we can now prototype:
- Event structure with execution.runtime.value pattern
- Simple handler that validates via AVRO + selfeval
- Discovery mechanism (trial and error selfeval testing)
- First req + selfeval pair for DSL/Execution/Runtime

**Approach:** Build minimal prototype that validates the pattern, discover gaps through use.

---

**These explorations inform Product Twin 1 event structure and validation design.**
