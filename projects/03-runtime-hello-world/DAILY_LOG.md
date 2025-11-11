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

## 2025-11-11

### Twin Pair 4: Implementation Planning Initiated

**Decision:** Begin Twin Pair 4 (Hello World Implementation + Implementation Templates)
**Context:** Twin Pairs 1-3 complete (deployment scripts, API design comprehensive documentation, runtime state stack design)
**Approach:** Collaborative discussion-first to define execution model before implementation

### Code Organization - Folder Structure

**Decision:** Keep spl1's proven `[package]/[api]/[method]` hierarchy
**Context:** Evaluating spl1 structure for spl2 - what to keep, what to improve
**Rationale:** Three-level hierarchy proven, clean, predictable

**Decision:** Use `_` prefix for auxiliary folders (not in method path)
**Examples:** `_schemas/`, `_tests/`, `_help/`, `_lib/`
**Rationale:** Clear separation - path items are invokable, `_` folders are resources

**Decision:** camelCase for multi-word names (if needed)
**Context:** `_` already used for `/` replacement in scripting contexts
**Rationale:** Avoids ambiguity, AI-friendly for DSL generation, JavaScript standard
**For Project 03:** Keep single words (`hello` not `helloWorld`) - simplicity

**Decision:** Requirements at all levels (package/API/method)
**Context:** Initially considered API-level only, recognized need for granularity
**Rationale:** Single concern - each level has focused requirements, associated test suites at same level
**Structure:** `requirements_v1.0.0.md` at package/, api/, and method/ levels
**Code references:** `// Requirements: requirements_v1.0.0.md` (same folder)

**Decision:** Auxiliary folders created as needed (minimal approach)
**Rationale:** Start minimal, add structure when required during implementation
**Pattern documented:** Full structure known, applied incrementally

### API Structure and Naming

**Decision:** Three APIs for hello world demonstration
**APIs:**
1. `spl/runtime` - Runtime Context API (infrastructure, will be deployed)
2. `spl/execution` - Execution Context API (infrastructure, will be deployed)
3. `pr03/hello` - Hello World API (internal evaluation only)

**Decision:** `spl` package for core Splectrum infrastructure
**Rationale:** Runtime and execution context are foundational infrastructure APIs

**Decision:** `pr03` package for Project 03 evaluation code
**Rationale:** Clear traceability - package tied to project that created it
**Note:** Proper external-facing apps would use different package naming

**Decision:** Full names over abbreviations (`runtime` not `rtctx`, `execution` not `exctx`)
**Rationale:** Self-documenting, clear, emphasizes design over brevity

**Method naming:**
- `spl/runtime/run` - Initialize and run runtime context
- `spl/execution/invoke` - Invoke a single method with context
- `pr03/hello/greet` - Output hello world greeting

### Method Execution Model Design - Refined to Single Parameter

**Decision:** Single parameter signature with unified context object
**Signature:**
```javascript
function method(context) {
  return outputBag;
}
```

**Evolution:** Started with three parameters (apiState, inputBag, context), refined to single context parameter for simplicity and extensibility

**Context Structure:**
```javascript
context = {
  apiState: {
    get(path),      // Navigate hierarchical Kafka record with dot notation
    set(path, value),
    getKey(),
    setKey(key),
    getValue(),
    setValue(data)
  },
  args: {
    get(key)        // Access flat method arguments
  },
  runtime: {
    get(path)       // Read-only hierarchical access to runtime state
  },
  execution: {
    get(path)       // Read-only hierarchical access to execution state
  }
  // Future: data, security, logging, etc. - infinitely extensible
}
```

**Key Design Decisions:**

**Hierarchical Kafka Records:**
- Full hierarchical structure for key/headers/value (not flat with dotted keys)
- Headers stored as nested objects: `{ spl: { runtime: { version: "0.1.0" } } }`
- Dot notation navigation: `get('spl.runtime.version')` returns `"0.1.0"`
- Subtree access: `get('spl.runtime')` returns `{ version: "0.1.0", nodeVersion: "..." }`
- AVRO/Kafka compatible (nested schemas supported)
- Can transform to flat if needed, but hierarchy is native format

**Generic Hierarchical Getter/Setter:**
- One implementation works on any nested structure
- Navigates object trees using dot notation
- Filters by returning subtrees
- Minimal overhead (function wrappers around record manipulation)

**context.apiState (read/write):**
- Full access to own API state Kafka record
- Methods can get/set headers hierarchically
- Can modify value, key as needed
- Direct manipulation through generic accessor

**context.args (read-only, flat):**
- Method arguments from CLI or previous output
- Flat JSON object: `{ version: '0.1.0', name: 'hello' }`
- Access via `context.args.get('version')`
- Simple key-value lookup

**context.runtime / context.execution (read-only, hierarchical):**
- Parent context state access
- Hierarchical navigation like apiState
- Read-only through getter interface
- Controlled partial access (not full record exposure)

**Access rules (critical architectural decision):**
- **Own API state:** Full read/write via context.apiState getter/setter
- **Parent contexts:** Read-only via context.runtime / context.execution getters
- **Arguments:** Read-only via context.args getter
- **Data layer:** Through dedicated API (future) for persistence abstraction

**Benefits of Single Parameter:**
- Ultimate simplicity - one parameter to pass
- Uniform interface - everything accessed via get/set pattern
- Infinitely extensible - add context.data, context.security without signature changes
- Consistent semantics - clear read/write vs read-only boundaries
- Clean for DSL generation - predictable access patterns

**Rationale for no change archiving:**
- During execution: Only keep what's needed for output (no history tracking)
- On failure: Extract complete footprint (code + input + data + config) for reconstruction
- Reconstruction: Replay request from scratch to see all intermediate states
- Benefits: Simple, fast, complete when needed, clear boundaries

**Data Layer API:**
- Separate abstraction for persistence (Kafka-like: publish/consume + conventional methods)
- MVP: Simple filesystem implementation
- Future: Seamless access across different repositories (DB, cloud, etc.)
- Not needed for hello world (deferred)

**Execution Context Responsibilities:**
- Store previous method output
- Retrieve as input for next method
- Merge with method-specific arguments
- Validate type compatibility (AVRO schemas - future)
- Provide ctx getter/setter abstractions
- Orchestrate pipeline execution

### Implementation Strategy - Three Steps

**Decision:** Incremental validation approach
**Context:** Prove execution model works through progressive complexity

**Step 1: Runtime context only**
- Standalone `spl/runtime/run` method
- Create runtime record, initialize properties
- Validate runtime structure works

**Step 2: Runtime + execution context**
- Add `spl/execution/invoke` method
- Runtime invokes execution context
- Prove nested structure (execution context record inside runtime value)
- Validate two-layer stack

**Step 3: Runtime + execution + hello world**
- Add `pr03/hello/greet` method
- Full three-layer pipeline
- Execution context invokes application logic
- Validate complete stack with cross-API flow

**Rationale:** Minimal and complete - build complexity incrementally, validate at each step

### Repo Management Strategy

**Decision:** Embryonic development → single repo transition → full diversification

**Current (Project 03):**
- All APIs stay in spl2 repo within `runtime-poc/src/modules/`
- Collaborative development space with cross-pollination
- Fast iteration, evidence gathering

**Future (explorative project):**
- Single repo transition - extract proven APIs

**Further future:**
- Full diversification - each API in own repo
- Template + tooling for API management
- AI-managed automation
- Single concern per repo

**Rationale:**
- APIs are elementary building blocks (standalone, independently managed)
- Number of repos not a problem with automation
- But prove patterns first before diversification complexity

### Glossary Discovery - Critical Insight

**Discovery:** Consistent vocabulary is foundational, not a future enhancement
**Context:** Discussing common names across APIs, realized full architectural importance

**Why Glossary is Critical:**
1. **Semantic consistency** - Same concept = same name + same schema everywhere (e.g., "dir" always means directory)
2. **Compositional reasoning** - AI/humans understand `tools/git/add` from vocabulary alone
3. **Partial requirements generation** - Package + API + method names with glossary = baseline requirement automatically
4. **Type safety foundation** - Glossary defines canonical schemas for composition validation
5. **Day one critical** - Establishing vocabulary NOW prevents expensive renaming/migration later

**Implication:** Glossary is high priority infrastructure, not nice-to-have

**Decision:** Start manually managed glossary in Project 03
- Manual maintenance for MVP (prove pattern)
- Document glossary entries as we create APIs/methods/properties
- Capture tooling requirements during use

**Glossary Structure (4 columns):**
1. **Term** - The vocabulary word
2. **Type** - Package name | API name | Method name | Property name | Value type | Concept
3. **Description** - What it means (semantic definition)
4. **Requirement** - What it must do/be (behavioral contract)

**Deferred columns (add at project closure if needed):**
- **Schema reference** - Link to AVRO schema
  - Reason: Many terms won't have schemas yet, creates placeholder maintenance overhead
  - When: Add when schemas exist and pain points show need
- **Examples** - Usage examples for clarity
  - Reason: Valuable but optional, can add inline in description for now
  - When: Add if evidence shows examples reduce confusion/errors

**For Project Closure:**
- Create high-priority CIP for glossary management tooling
- Requirements: Validation, enforcement, schema integration, requirement generation
- Assess deferred columns: Do we need schema references? Examples? Based on manual experience
- Pattern: Prove manually, automate when proven valuable

**Risk:** See R09 - Lack of glossary tooling during development

### Skeleton Structure Created

**Artifacts Created:**
- Full `[package]/[api]/[method]` folder hierarchy
- Package index.js at each level (spl, runtime, execution, pr03, hello)
- Method implementations with standardized signature
- Placeholder requirement references

**Structure:**
```
modules/
  spl/
    index.js (package description)
    runtime/
      index.js (API description)
      run/
        index.js (method with signature)
    execution/
      index.js (API description)
      invoke/
        index.js (method with signature)
  pr03/
    index.js (package description)
    hello/
      index.js (API description)
      greet/
        index.js (method with signature)
```

**Amendment:** Method naming clarified
- Changed `spl/execution/next` to `spl/execution/invoke`
- Rationale: We're invoking a single method, not stepping through a pipeline
- "invoke" is clearer and more accurate for MVP scope
- Pipeline orchestration ("next") is future enhancement

### Production Code Logging Strategy

**Decision:** Only log what could lead to runtime action
**Context:** Reconstruction capability means we don't need verbose execution logging

**Production methods:**
- Silent unless error (no console.log for normal operation)
- Only throw/log actual errors with useful detail
- No anticipation of future logging needs
- Add logging when evidence shows need

**MVP error handling:**
- Bomb out with error details (throw immediately)
- No try/catch sophistication, no error recovery, no error routing
- Let errors propagate and kill execution
- Error message contains useful detail

**Evaluation scripts (separate from production):**
- Verbose console.log to prove execution and show state
- Not production code - validation only

**Rationale:** Minimal and complete - state captured in records for reconstruction, only log actionable information

### Bug Report Infrastructure - Critical Gap Identified

**Discovery:** On error, need automated bug report generation with complete footprint
**Context:** Architecture relies on reconstruction rather than archiving during execution

**Bug report must capture:**
- Exact code footprint (all artifact versions/GUIDs that executed)
- Complete input (all arguments, previous output)
- Full state (runtime/execution/API records at failure point)
- Environment (Node version, system info)
- Error details (stack trace, error message)
- Enables: Exact reproduction of failure scenario

**Decision:** High-priority infrastructure deliverable
- Critical for architecture to work (without archiving, need reconstruction)
- Enables debugging via replay instead of log mining
- Required before production use

**For Project Closure:**
- Create high-priority backlog item or CIP for bug report infrastructure
- Requirements: Automatic capture on error, complete footprint extraction, reproduction package generation
- This is foundational - not optional enhancement

### Module Resolution - Convention-Based Dynamic Loading

**Decision:** Implement simple module resolver based on spl1 pattern
**Context:** execution/invoke needs to dynamically load and call methods by path

**SPL2 Module Resolver:**
- Convention-based: `modulePath` → `{modulesBasePath}/{package}/{api}/{method}/index.js`
- Example: "spl/runtime/run" → "{basePath}/spl/runtime/run/index.js"
- Dynamic ES module import with path validation
- Returns resolution metadata (path, module, error)
- `invokeMethod(methodPath, context, modulesBasePath)` - resolve and invoke in one call

**modulesBasePath Bootstrap:**
- Passed at initialization (can't rely on runtime context - chicken/egg problem)
- Evaluation scripts construct basePath from their location
- Execution context receives basePath at creation

**MVP Scope:**
- Single resolution path: global modules folder only
- No app overlay yet (future enhancement)

**App Overlay Pattern (Deferred):**
From spl1 - valuable pattern for future implementation:
- Resolution order: Try `apps/{app}/modules/` first, then global `modules/`
- App overlay purpose:
  - Work on modules in app context without touching global install
  - Selective override for debugging (app-specific version shadows global)
  - Development workflow: Standard install + work-in-progress in app overlay
- Context switching: Modules in global folder run in install context, app folder run in app context
- Benefits: Safe experimentation, module development without install disruption

**For Project Closure:**
- Create CIP for app overlay implementation
- Requirements: Two-tier resolution (app → global), context determination, development workflow support

**Next:** Define glossary entries, implement Step 1 (runtime/run)

---
