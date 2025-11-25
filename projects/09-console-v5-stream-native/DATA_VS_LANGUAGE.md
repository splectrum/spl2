# Data vs Language - Understanding the Split

**Context:** Foundational distinction emerging during v0 dev env work
**Status:** Developing understanding - will evolve as we explore

---

## The Core Distinction

### Mycelium: Data Structures & Data Change Events

**Mycelium deals with:**
- **Data structures** (state): `api_node`, `package`, `api`, `api_method`
- **Data change events (DCE)**: Events carrying state changes
- **Flow of data**: How state moves through the system
- **Persistence**: What gets stored/transmitted

**Characteristics:**
- Subject to change over time (events modify state)
- Passive - the "what" that exists
- Schemas, shapes, state definitions
- Event sourcing foundation

### DSL: Operators on Data Structures

**DSL deals with:**
- **Operators/methods** that act on data structures
- **APIs** that generate/process data change events
- **Functional elements**: The actions that cause state changes
- **Execution**: What runs/transforms

**Characteristics:**
- Active - the "how" that executes
- Methods that operate: `spl/api_node/validate()`, `spl/package/install()`
- Generators of DCEs
- Language vocabulary for expressing operations

---

## The Relationship

```
DSL (Language/Operators)
    ↓ operates on
Mycelium (Data Structures)
    ↓ generates
DCE (Data Change Events)
    ↓ flows through
Mycelium (Event Store)
```

**Example flow:**
```javascript
// Language: DSL method invocation
spl.api_node.resolve(myApiNode, 'path/to/resource')

// Operates on: Data structure (mycelium)
{
  type: 'api_node',
  name: 'spl/console',
  paths: { ... }
}

// Generates: Data change event (mycelium)
{
  type: 'dce',
  operation: 'resolve',
  result: 'resolved/path/to/resource',
  timestamp: '...'
}

// Flows through: Event store (mycelium)
// State evolves via event sourcing
```

---

## Naming Convention: Uniform Pattern

**Data structure = API name:**
- Data structure: `api_node`
- Associated API: `spl/api_node/`
- Single name for both aspects

**Why uniform:**
- Clear association: data structure has matching API
- Discoverable: know where to find operations
- Natural: `api_node` data is operated on by `spl/api_node/` methods

---

## DSL Glossary Contains Both

**DSL glossary entries include:**

1. **Data structure definitions**
   - Shape/schema of the data
   - State fields and types
   - What can be stored

2. **Functional vocabulary**
   - API methods available
   - Operations that can be performed
   - How to interact with data

**Both aspects:**
- Use underscore separator (`api_node`, not `api node`)
- Runtime vocabulary (exist at runtime, not just dev)
- Part of the domain-specific language

**Example DSL entry structure:**
```markdown
## api_node

**Data structure:**
- Shape: { type, name, _reqs, ... }
- Represents: A node in the API hierarchy

**API:** `spl/api_node/`
- Methods: validate(), resolve(), extend()
- Operates on: api_node instances
```

---

## Glossary Separation Rationale

### Stepping Stones (space separator)
- **Navigational concepts**: `dev modules`, `base module`
- **Methodology vocabulary**: How we organize/develop
- **Development-time**: Workflow and infrastructure
- **Not runtime entities**: Don't exist in running system

### DSL (underscore separator)
- **Data structures**: `api_node`, `package`
- **Functional elements**: `spl/api_node/`, `spl/package/`
- **Runtime vocabulary**: What exists/executes at runtime
- **Language elements**: Terms users interact with

### Test Question
"Does this exist at runtime or only during development?"
- Runtime → DSL
- Dev-only → Stepping stone

---

## Inheritance Pattern

**Data structures inherit:**
```
api_node (base data structure)
├── package (extends api_node)
├── api (extends api_node)
└── api_method (extends api_node)
```

**APIs inherit:**
```
An 'api' instance can call:
- spl/api/validate()         (api-specific)
- spl/api_node/resolve()     (inherited from base)
```

**Why this works:**
- Data structure hierarchy mirrors API hierarchy
- Derived types get parent functionality
- Natural object-oriented pattern
- Single name convention makes it clear

---

## Panta Rhei Connection

**"Everything flows":**
- Data structures are **state snapshots** in the flow
- DCEs are **the flow itself** (state transitions)
- Language provides **operations** that shape the flow
- Mycelium is **the river** that carries everything

**State flows through:**
```
[State A] --[DCE: operation]--> [State B] --[DCE: operation]--> [State C]
     ↑              ↑                  ↑              ↑
  Mycelium     Language           Mycelium       Language
   (data)      (operator)          (data)       (operator)
```

---

## Low Friction Prerequisites

**Clear understanding enables:**
1. **Consistent naming**: Know where data structures are, where methods are
2. **Predictable patterns**: Same pattern everywhere (name = data + API)
3. **Easy discovery**: `spl/api_node/` is obvious place for api_node operations
4. **Natural inheritance**: Extending data structure extends API access
5. **Separation of concerns**: Data (mycelium) vs Operations (DSL)

**Friction comes from:**
- Confusion between data and operations
- Unclear where functionality lives
- Inconsistent naming patterns
- Hidden inheritance

**Low friction achieved through:**
- Crystal clear distinction (mycelium vs DSL)
- Uniform naming convention
- Explicit inheritance chains
- Discoverable structure

---

## Working Hypotheses (To Explore)

1. **Mycelium = data + events only**
   - No logic, just state and transitions
   - Pure event sourcing

2. **DSL = operations only**
   - All logic lives here
   - Generates events, doesn't store them

3. **Clear boundary**
   - Mycelium doesn't know about DSL
   - DSL reads from and writes to mycelium
   - Clean separation

4. **Uniform pattern everywhere**
   - Every data structure has associated API
   - Same naming for both
   - Inheritance works predictably

**To validate as we build:**
- Does this separation hold in practice?
- Are there edge cases?
- Does it enable low friction?

---

## Questions for Exploration

1. **Where do schemas live?**
   - Mycelium (they describe data)?
   - DSL (they're used by operations)?
   - Both?

2. **What about pure functions?**
   - No state, no events
   - Still part of DSL?

3. **Validation logic?**
   - Operates on data (DSL)
   - But defines what valid data is (mycelium concern?)

4. **Event handlers?**
   - React to DCEs (mycelium)
   - Execute logic (DSL)
   - Bridge between the two?

**Note:** These questions will be answered through implementation and exploration.

---

## Summary

**Mycelium:**
- Data structures (shape/state)
- Data change events (flow)
- Passive, persistent
- The "what"

**DSL:**
- Operators/methods
- APIs that generate events
- Active, executable
- The "how"

**Pattern:**
- Single name for both (e.g., `api_node`)
- Data structure + associated API
- Inheritance works naturally
- Clear, discoverable, low friction

**Understanding this distinction is foundational to achieving low friction.**

---

**Version:** 1.0.0 (initial understanding, will evolve)
