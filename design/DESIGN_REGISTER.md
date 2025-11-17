# Design Register

**Purpose:** Registry of platform design elements - implementation templates for Splectrum
**Last Updated:** 2025-11-17
**Status:** Active - initialized with API design elements from Project 03

---

## What This Register Tracks

**Platform design elements:**
- Runtime architecture patterns
- Method execution models
- API structures and conventions
- State management patterns
- Component templates
- Implementation patterns for Splectrum platform

**NOT tracked here:**
- Methodology patterns (how we work - in WOW.md, project-types/)
- Project templates (PRINCE2 patterns)
- Partnership patterns (in PARTNERSHIP.md)

**The distinction:** Platform/product design (what we're building) vs. methodology (how we work)

---

## Registry Format

Each entry:
- **Element Name:** What it's called
- **Status:** Validated (proven), Draft (proposed), Evolving (being refined), Superseded (replaced)
- **Location:** Which design doc, which section
- **Template For:** What implementations use this pattern
- **Related:** Requirements, projects, CIPs that reference/validate

---

## Design Elements

### API as Elementary Building Block

**Status:** Validated (proven in Projects 03-04)
**Location:** API_DESIGN.md § "API as Elementary Building Block"
**Template For:** All API implementations in Splectrum platform
**Description:** API is smallest standalone deployable unit - addresses single concern, shares argument namespace, operates on shared state context
**Related:**
- Project 03: Runtime hello world validation
- Project 04: Bare runtime validation
- CIP-006: N-tier API hierarchy (future expansion)

---

### Three-Layer API Structure (MVP)

**Status:** Validated (proven pattern from spl1, validated in Projects 03-04)
**Location:** API_DESIGN.md § "API Structure (MVP)"
**Template For:** API organization - package/api/method hierarchy
**Description:** Three-layer structure `[package]/[api]/[method]` - package groups related APIs, API defines concern/namespace/deployment boundary, method is executable operation
**Related:**
- Proven in spl1
- Validated Project 03
- CIP-006: Future N-tier expansion

---

### Multi-Level Argument Passing

**Status:** Validated (Project 03)
**Location:** API_DESIGN.md § "Multi-Level Argument Passing"
**Template For:** CLI invocation patterns, argument scoping
**Description:** Arguments at package, API, and method levels - API-level arguments persist across method invocations within pipeline
**Related:** Project 03 CLI patterns

---

### State Backing Architecture

**Status:** Validated (Project 03 core pattern)
**Location:** API_DESIGN.md § "State Backing Architecture"
**Template For:** All stateless method implementations
**Description:** Stateless code with state backing - State₁ → Process → State₂ pattern, immutable state transitions, Kafka-compatible records
**Related:**
- Panta Rhei design philosophy
- Data_architecture_v1.0.0.md (Project 02)

---

### Context API Pattern

**Status:** Validated (Project 03)
**Location:** API_DESIGN.md § "State Access Abstraction - Context API Pattern"
**Template For:** Method implementations accessing nested state
**Description:** ctx object with getters/setters abstracts state structure - hides nesting complexity, enables evolution without breaking code
**Related:** Project 03 implementation

---

### Runtime State Stack Architecture

**Status:** Validated (Project 03)
**Location:** API_DESIGN.md § "Runtime State Stack Architecture"
**Template For:** Runtime context, execution context, pipeline API nesting
**Description:** Three-layer nested structure via Kafka record value properties - Runtime Context → Execution Context(s) → Pipeline API Records
**Related:** Project 03 implementation

---

### Kafka-Compatible Records

**Status:** Validated (Project 03)
**Location:** API_DESIGN.md § "Kafka-Compatible Records"
**Template For:** All state storage, record structure
**Description:** Key/headers/value record structure - headers for metadata, value for state data, immutable with complete metadata capture
**Related:**
- Stack_to_match_v1.0.0.md (Kafka-compatible records)
- CIP-009: splectrum-native repository model

---

### CLI-Callable Methods

**Status:** Validated (Projects 03-04)
**Location:** API_DESIGN.md § "CLI-Callable Methods and Invocation Patterns"
**Template For:** Method invocation design, composability patterns
**Description:** All methods CLI-callable - `[package]/[api]/[method]` syntax, chaining with `@@`, integrated help at all levels
**Related:**
- Project 03: Invocation patterns
- Project 04: Bare runtime CLI

---

### Integrated Help System

**Status:** Validated (design from spl1, to be implemented)
**Location:** API_DESIGN.md § "Integrated Help System"
**Template For:** Help artifacts at package/api/method levels
**Description:** Help at every hierarchy level - package `-h`, api `-h`, method `-h`, help as requirements/specification
**Related:** spl1 proven pattern

---

### Common Names Glossary Pattern

**Status:** Validated (Project 03)
**Location:** API_DESIGN.md § "Common Names Glossary"
**Template For:** Cross-API naming standards, vocabulary consistency
**Description:** Same thing = same name + same schema across all APIs - lightweight glossary documents standards, enforced through convention
**Related:**
- CIP-007: Glossary management tooling (future)
- DSL_GLOSSARY.md (vocabulary management)

---

### Method Signature Pattern

**Status:** Validated (Project 03)
**Location:** API_DESIGN.md § "Method Signatures and Type System"
**Template For:** Method implementation signatures
**Description:** `function methodName(state, input)` - stateless logic, returns new state, AVRO schemas for input/output/state validation
**Related:** AVRO integration (Stack_to_match_v1.0.0.md)

---

### Error as State Pattern

**Status:** Validated (Project 03)
**Location:** API_DESIGN.md § "Error Handling"
**Template For:** Error handling in all methods
**Description:** Errors are state transitions, not exceptions - captured in state, next method can inspect, pipeline decides handling
**Related:** Panta Rhei (state flow)

---

## Future Design Elements

### N-Tier Organizational Hierarchy

**Status:** Proposed (CIP-006)
**Location:** CIP-006 (when designed)
**Template For:** Flexible hierarchy above API level
**Description:** `[domain]/[subdomain]/.../[api]/[method]` - grow hierarchy as needed
**Related:** CIP-006

---

### Hierarchical APIs with State Scoping

**Status:** Proposed (CIP-006)
**Location:** CIP-006 (when designed)
**Template For:** Sub-API structures, state inheritance patterns
**Description:** APIs contain sub-APIs, child sees parent state, siblings isolated
**Related:** CIP-006

---

### GUID-Based Artifact Identification

**Status:** Proposed (CIP-005)
**Location:** CIP-005 (when designed)
**Template For:** Artifact identification and bug reproduction
**Description:** Unique GUID per artifact, resolves to requirements + version + hash
**Related:** CIP-005

---

### Script-to-API Compilation

**Status:** Proposed (captured in API_DESIGN.md)
**Location:** API_DESIGN.md § "API Compilation and Script Integration"
**Template For:** Two-level compilation (script → programmatic → optimized)
**Description:** Granular design, performant deployment, reversible for debugging
**Related:** Future CIP to be created

---

### Script Wrapping (JS/Bash)

**Status:** Proposed (captured in API_DESIGN.md)
**Location:** API_DESIGN.md § "JS/Bash Script Wrapping"
**Template For:** Integrating existing scripts as SPL2 API methods
**Description:** Wrap external scripts with AVRO schemas, state backing
**Related:** Future CIP to be created

---

## Design Documents

- **API_DESIGN.md** - Comprehensive API architecture and implementation patterns (from Project 03)

---

## Notes

**Evolution:**
- Register grows as new design elements emerge
- Status updates as elements validated/superseded
- New design docs added as complexity justifies

**Pattern:**
- Lightweight entries now
- Comprehensive when needed
- Evidence-based evolution

**See:** CIP-013 (Design Spot Setup), CIP-014 (Comprehensive API Design Phase)
