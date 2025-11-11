# Daily Log: Runtime Structure "Hello World"

## 2025-11-10

### Project Initiated
**Decision:** Start Project 03 - Runtime Structure "Hello World" exploration
**Context:** Critical path project from backlog - validates core SPL2 architecture
**Rationale:** Everything downstream depends on proving execution model works

### Project Planning - Collaborative Approach
**Decision:** Plan project collaboratively rather than autonomous template execution
**Context:** Explorative project, early in SPL2 development, architecture validation
**Rationale:** Need both perspectives - human architectural intuition + AI implementation. This is too critical to run autonomously.

### Product Structure Defined - 4 Twin Pairs
**Decision:** 8 products in 4 twin pairs (implementation + template)
**Context:** Explorative project methodology - create and document patterns simultaneously

**Twin Pair 1: Development Setup**
- Product 1A: Node.js environment in `runtime-poc/` subfolder
- Product 1B: Development setup template

**Twin Pair 2: State-Backed API**
- Product 2A: State-backed API implementation (Kafka records, state transitions)
- Product 2B: API design template

**Twin Pair 3: Runtime State Stack**
- Product 3A: Runtime state stack implementation (layers, responsibilities, orchestration)
- Product 3B: Runtime structure template

**Twin Pair 4: Hello World Implementation**
- Product 4A: Working hello world code (full execution flow)
- Product 4B: Implementation templates

**Rationale:** Flow from setup → state/API design → runtime structure → full implementation. Each twin validates through use.

### Technical Decisions

**Decision:** No TypeScript
**Rationale:** Code units will be small, TypeScript adds complexity without proportional benefit at this stage

**Decision:** Use Vitest for testing
**Context:** Mentioned in backlog for Bare compatibility, worth validating now
**Rationale:** If we're targeting Bare eventually, test tooling compatibility matters

**Decision:** Node.js project within project folder (`projects/03-runtime-hello-world/runtime-poc/`)
**Rationale:** Self-contained, reference implementation stays with documentation, easy to find

### Process Decision

**Decision:** Follow PRINCE2 - plan first, execute second
**Context:** Started to initialize Node.js project before planning complete
**Rationale:** Need PROJECT_BRIEF with all products defined before execution. Discipline matters.

### Twin Pair 1: Requirements Creation

**Decision:** Create single requirements file for twin pair (both products), minimal one-pager capturing discussion
**Context:** Initially created 3 separate over-specified requirements files (R1-R8 style)
**Issue:** Over-engineering again (Risk R05) - went from "capture what we discussed" to "specify everything upfront"
**Resolution:** Replaced with single minimal `Twin_pair_1_requirements_v1.0.0.md` - one page capturing our agreement
**Rationale:** Minimal and complete, validate through use, discover additional needs during implementation

### Principle Discovered: "Local Rules Apply"

**Principle:** Projects satisfy their own requirements (current version at time of project). Deliverables are standalone with their own requirements. Requirements can evolve without retroactive burden on previous projects.

**Key Points:**
- No looking over shoulder for historical consistency
- Focus on what's needed NOW for current project
- Artifact-to-requirements pinning makes this work
- Previous projects remain valid (satisfied their requirements at time)
- Freedom to evolve based on evidence

**Implication:** Liberating approach - no anxiety about global completeness, just satisfy local requirements

**For Project Closure:** Consider adding to Philosophy (freedom to evolve principle) and/or TDC (how requirements work with artifacts)

### Lesson in Progress: Minimal Emphasis in "Minimal and Complete"

**Observation:** Tendency to over-specify toward "complete" rather than start truly minimal and validate through use

**Examples in Project 03:**
- Over-specified requirements (R1-R8 instead of one-pager)
- Risk R05 from Project 02 continues to manifest

**Working Approach:** When uncertain if requirements feel right, ask: "Am I comfortable with the way I am working to achieve my goal - minimal and complete?" If yes, proceed. If no, propose evidence-based change.

**For Project Closure:** Update Philosophy v1.2.0 to emphasize minimal over premature completeness, provide concrete guidance from Project 03 experience

### Twin Pair 1: Implementation - Deployment Scripts

**Decision:** No test framework (Vitest deferred)
**Context:** Initially planned to include Vitest for testing
**Rationale:** Validation scripts (self-contained Node.js scripts) sufficient for now. Test framework adds complexity without current benefit. CLI-callable validation proves environment works.

**Decision:** Validation via self-contained scripts
**Approach:** `scripts/validate.js` runs checks, outputs logging, exits 0/1 for success/failure
**Rationale:** Proves deployment worked without test framework dependency. Simple, clear, effective.

**Implementation Approach:**
- **Build:** Check Node.js version >= 18, install dependencies (npm install), output logging
- **Teardown:** Remove node_modules/ and package-lock.json, document full removal requires parent directory deletion
- **Validate:** Check Node.js version, file structure, package.json validity, module system

**Teardown Limitation Discovered:**
- Script can't delete its own directory (running from inside runtime-poc/)
- Solution: Remove artifacts it created, document full removal command
- Trade-off accepted: Good enough for requirements, simple implementation

**Testing:** Build/teardown/validate cycle tested successfully (2 cycles completed)

**Artifacts Created:**
- `runtime-poc/package.json` - Project manifest with npm scripts
- `runtime-poc/scripts/build.js` - Build from scratch script
- `runtime-poc/scripts/teardown.js` - Teardown script
- `runtime-poc/scripts/validate.js` - Validation script
- `runtime-poc/README.md` - Usage documentation
- `runtime-poc/src/` - Empty source directory (ready for Twin Pair 2-4)

**Architecture Insight:** API as Standalone Unit
**Context:** Discussed future vision - APIs are standalone units with multiple methods
**Understanding:** These deployment scripts represent what will become "Deployment Management API" pattern
- API = collection of related methods (build, teardown, validate)
- CLI-callable methods
- Requirements at API level
- Standalone, self-contained units
**Note:** Not implementing "API" structure yet (haven't defined how), but building concrete scripts that inform the pattern

### Twin Pair 1: Completion

**Status:** Complete - Both products delivered and validated

**Product 1A - Deployment Scripts:** ✅
- Build/teardown/validate cycle tested successfully (2+ cycles)
- All requirements met
- Artifacts: package.json, build.js, teardown.js, validate.js, README.md

**Product 1B - Deployment Template:** ✅
- DEPLOYMENT_TEMPLATE.md created
- Generalizable pattern documented
- Philosophy explained with rationale
- Validated through Product 1A implementation
- Ready for future use

**Requirements Validation:**
- Build from scratch works ✅
- Tear-down/rebuild cycle successful ✅
- Validation mechanism proves environment ready ✅
- Template generalizable and reusable ✅
- Immutable deployment philosophy embodied ✅

**Cross-Pollination Evidence:**
- Implementation informed template (discovered teardown limitation, documented in both)
- Template captures actual decisions made (not speculative)
- Both products improved through parallel creation

### Artifact Identification Discussion

**Context:** External-facing artifacts need unique identification for traceability and bug reproduction

**Use Case:** Extract package from environment containing exact code footprint to reproduce bugs - need to identify every artifact that executed with exact versions

**Options Considered:**

**Option 1: Requirement reference stamping (per file)**
- Simple header: `// Requirements: requirement_file_v1.0.0.md`
- Minimal overhead, manageable manually
- Traces to requirements but not unique artifact identifier
- Changes when requirements evolve (even if code unchanged)

**Option 2: GUID-based identification (per file)**
- Unique identifier for exact artifact
- Stable across requirement evolution
- Resolves to: requirements + version + hash + metadata
- Perfect for exact code footprint extraction
- Requires: GUID generation, resolution mechanism, registry
- High overhead without automation

**Decision:** Use requirement references NOW, move toward GUIDs when infrastructure exists

**Rationale:**
- GUID is architecturally superior for bug reproduction use case
- But GUID infrastructure premature - no automation, deployment, execution tracking yet
- Requirement references satisfy current needs with minimal overhead
- When automation exists (deployment, execution tracking, bug extraction), migrate to GUID

**Implementation:**
- Twin Pair 1 and subsequent work: requirement reference stamping in file headers
- Captures traceability, satisfies current quality assessment needs
- Simple enough to manage manually during exploration

**For Project Closure:**
- Create CIP for GUID-based artifact identification system
- Architectural vision captured, deferred until infrastructure capacity exists
- When we build execution tracking / bug extraction → implement GUIDs
- "Local rules apply" - future projects can adopt GUIDs, current work uses requirement references

### API Structure Discussion - MVP + End Vision

**Context:** Defining API as elementary building block - smallest standalone deployable unit

**API Characteristics:**
- Groups methods with single concern
- Defines argument namespace (same concept = same name across methods)
- API-level arguments persist for invocation context (e.g., configuration, base paths)
- State backing: state persists for duration of pipeline within which API is invoked

**Structure Options Discussed:**

**Three-level (spl1 proven):** `[package]/[api]/[method]`
- Simple, predictable depth
- Clear structure
- API = direct parent of methods

**N-tier hierarchy:** `[domain]/[subdomain]/.../[api]/[method]`
- Flexible organizational depth above API level
- API remains concern + namespace boundary
- Methods always leaves (endpoints)
- Grow hierarchy as needed based on evidence

**Hierarchical APIs (sophisticated):**
- APIs can contain sub-APIs
- State scoping: child sees parent state, siblings isolated
- Progressive context refinement down hierarchy
- Complex but powerful for large systems

**Decision: MVP + End Vision Pattern**

**MVP (Twin Pair 2):** Three-layer structure `[package]/[api]/[method]`
- Proven from spl1
- Simple, concrete
- State backing at API level (methods share API state)
- Single-layer API (no sub-APIs)

**End Vision (CIP for future):**
- N-tier organizational hierarchy (flexible depth above API)
- Hierarchical APIs with state scoping (parent/child visibility, sibling isolation)
- Implement when capacity and evidence support it
- Current design doesn't prevent future extension

**Pattern Identified: MVP + End Vision**
- Build practical MVP satisfying current needs
- Capture architectural end vision (informs design, prevents dead ends)
- Migrate when capacity/evidence exists
- Examples in Project 03: Requirements→GUIDs, Flat API→N-tier

**For Project Closure:**
- Create CIP for N-tier API hierarchy with hierarchical state scoping
- Add MVP+EndVision pattern to WOW (valuable working methodology)
- Pattern fits with: minimal and complete, evidence-based evolution, local rules apply

### API Design Documentation Created

**Decision:** Create comprehensive API design document capturing all architectural decisions

**Context:** APIs are the elementary building blocks of SPL2 - foundational architecture requiring thorough documentation

**Artifacts Created:**
- `API_DESIGN.md` - Comprehensive design document covering:
  - API as elementary building block (definition, characteristics)
  - Three-layer MVP structure (package/api/method)
  - Multi-level argument passing and persistence
  - State backing architecture (stateless code with state backing)
  - CLI-callable methods pattern
  - Artifact identification (requirement stamping → GUID vision)
  - Design patterns and principles
  - MVP vs End Vision roadmap
  - Implementation roadmap

**Purpose:**
- Central reference for API architecture
- Foundation for Twin Pair 2 implementation
- Guides all future API development
- Captures MVP scope and end vision together

**Status:** Design document complete, ready to inform Twin Pair 2 requirements and implementation

### CLI Invocation and Help System Discussion (from spl1)

**Context:** Exploring how APIs are invoked and discovered

**spl1 Command-Line Invocation Pattern:**
- Syntax: `[package]/[api]/[method] -arg value`
- Chaining: `method1 @@ method2 @@ method3` (state flows through)
- This IS the DSL - composition at command line, no separate syntax needed

**Integrated Help System:**
- Help at every level: `package -h`, `package/api -h`, `package/api/method -h`
- Self-documenting and discoverable
- **Help as requirements** - help artifacts stored alongside code, describe the contract
- Help IS the specification (unified documentation and requirements)

**Benefits for DSL Engine:**
- AI can discover operations via help system
- Type information enables intelligent composition
- Pattern recognition from descriptions
- Suggests next steps based on signatures
- Type-guided composition

**Programmatic API Equivalent (Future Vision):**
- Two equivalent syntaxes: CLI scripting + programmatic
- Same execution model, different expression
- CLI for interactive/testing, programmatic for complex logic
- Isomorphic - can mix both forms
- Implementation path: prove CLI first, add programmatic layer

**Decision:** Adopt spl1 patterns for spl2
- CLI invocation with `@@` chaining
- Help system at all levels (package/api/method)
- Help artifacts as requirements
- Programmatic API future enhancement

**Implementation in Project 03:**
- MVP: npm scripts (Twin Pair 1) ✅
- Near-term: CLI invocation + help system (Twin Pairs 2-4)
- Future: Full CLI parser + programmatic API (post-Project 03)

**Captured in:** API_DESIGN.md - CLI-Callable Methods and Invocation Patterns section

### AVRO Type System for API Methods

**Context:** Defining type system and validation approach for API methods

**Schema Requirements:**
Every API method has three AVRO schema components:
1. **Input schema** - Method input structure/types
2. **Output schema** - Method output structure/types
3. **Shared API state schema** - API-level state accessible to all methods

**Type Safety:**
- All data (input, output, state) managed via AVRO schemas
- Type-safe composition (output type → input type compatibility)
- Schema evolution support (versioned schemas)
- Validation at boundaries

**Execution Context Responsibility:**
- Manages output → input transfer between methods in pipeline
- Validates type compatibility before method invocation
- Handles type coercion/transformation if needed
- Enforces schema contracts

**Benefits:**
- Type-safe method composition (DSL engine can determine compatibility)
- Schema evolution (versioned, backward compatible)
- Validation automatic (schemas define contracts)
- Self-documenting (schemas show structure/types)

**Implementation:**
- MVP: May defer full AVRO integration (prove patterns first)
- Design methods with schemas in mind (structure for AVRO)
- Full AVRO integration when schema validation becomes critical
- Execution context validates composition

**Captured in:** API_DESIGN.md - Method Signatures and Type System section

### API Package Structure - Wholesome, Standalone, Complete

**Context:** Defining complete API package structure

**Key Principle:** Tests (representing API requirements) stored within same structure as code, help, AVRO definitions.

**API Package Contains:**
- `methods/` - Method implementations
- `schemas/` - AVRO input/output/state schemas
- `help/` - API and method help artifacts (help as requirements)
- `tests/` - Tests = executable requirements
- `requirements/` - Requirements reference documents
- `package.json` - Metadata, dependencies

**Tests as Requirements:**
- Tests stored alongside code (co-located)
- Tests represent what API must do (executable specification)
- Tests validate API contract
- Help describes, tests verify

**Makes API:**
- **Wholesome** - Everything needed to understand, use, validate
- **Standalone** - No external dependencies to understand/deploy
- **Complete** - Code + schemas + help + tests + requirements together

**Benefits:**
- Self-contained unit
- Discoverable (browse structure)
- Deployable (complete package)
- Verifiable (tests prove requirements)
- Documented (help explains)
- Typed (AVRO schemas)
- Traceable (requirements reference)

**Captured in:** API_DESIGN.md - API Package Structure section

**Status:** API architecture comprehensive - ready for Twin Pair 2 implementation

---
