# SPL2 Core Principles - Detailed

**Status:** Preliminary - will evolve through hands-on coding exploration

This document expands on PRINCIPLES.md with detailed explanations and context from initial design discussions.

---

## Minimal and Complete (Expanded)

**What must be captured for completeness:**

1. **Initial state** - Starting conditions before process executes
2. **Executed code** - The code that ran (or immutable reference like git hash)
3. **Input** - Data provided to the process
4. **Output** - Data produced by the process
5. **Logging** - Events and information generated during execution
6. **External data dependencies** - Additional data fetched during processing
   - Repository data, database queries, API calls, file reads, etc.
   - Use immutable references (git hashes, versions) when they exist
   - Capture actual data when immutable references don't exist

**Rationale:** These 6 items enable out-of-context replay. Without external data dependencies captured, replay is impossible for most real processes.

**Lazy functional approach explained:**
- Core provides *potential* (raw materials: outputs + metadata)
- Separate tools *actualize* (process for specific purposes)
- Don't do work in core that tools can do later
- Separation of concerns: generation vs interpretation

**Example pattern:**
```
Core: Execute → outputs + raw metadata
Tools: Raw metadata → audit / debug / trace / visualization / replay
```

---

## Data Architecture (Expanded)

### Kafka-Compatible Record Structure

**Full structure:**
```javascript
{
  key: "...",        // optional, use when needed
  value: {...},      // actual data payload
  headers: {...},    // metadata for reconstruction
  timestamp: ...     // optional, use when needed
}
```

**What goes where:**
- `value`: The actual output data
- `headers`: Metadata (initial state, code ref, input, output, logging, external dependencies)
- `key`: Optional identifier (use as needed)
- `timestamp`: Optional timing information (use as needed)

**Important:** Kafka-compatible is a structural constraint, not infrastructure requirement. Can store on filesystem, database, or actual Kafka. Structure must be exportable/importable to real Kafka.

**Benefits:**
- Event sourcing naturally (immutable + encapsulated)
- Each record stands alone (complete for reconstruction)
- Process as streams or batches
- Replay/reprocess easily
- Infrastructure-agnostic but structured

---

## Process Structure (Expanded)

**Complete process lifecycle:**

1. **Accept input** - Receive data to process
2. **Load state** - Initialize from Kafka record
3. **Execute** - Run process (may involve multiple API calls)
4. **Produce output** - Generate results
5. **Persist state** - Write new state to Kafka record

**Key characteristics:**
- State persists for entire input → output transformation
- All API calls during process share the same state
- State backing at API level (set of methods share same Kafka record)
- State scoped to process execution
- Self-contained, explicit state passing

**Process as state transition:**
```
State₁ (Kafka record) → [Process] → State₂ (Kafka record)
```

- State₁ remains unchanged (immutable)
- State₂ is new record (immutable)
- Each transition fully captured and observable
- Sequence of transitions forms stream of state evolution

---

## Architecture Vision (Expanded)

### DSL Engine Details

**SPL2 Core as DSL Engine:**
- Platform for creating task-optimized languages
- Not a fixed-purpose system, but environment for building domain-specific languages
- Each task/domain gets specialized language tailored to its needs
- Core provides runtime/engine for executing these DSLs
- Languages can be created as needed for specific problems
- Focus on simple, focused languages for specific jobs
- Create layers of APIs that compose into optimal DSLs for problems

### AI as Primary User

**Design optimized for AI:**
- SPL2 is optimized for AI discovery and use, not human use
- AI creates higher-level solutions by composing DSLs from APIs
- Human provides requirements, AI builds DSLs to solve them
- All APIs designed for AI autonomy and discoverability

**Every API must provide:**
1. **High-quality help** - AI-optimized documentation (structured, parseable, complete)
2. **AVRO schemas** - All exposed data structures fully described
3. **Requirement test suites** - Tests that define behavior and contracts
4. **Discoverability metadata** - What it does, when to use it, how it composes

### Growing Library Structure

**Concept:**
- SPL2 generates library of explorations and production implementations
- Structured for AI to easily consult, reuse components, build new ones
- Each solution adds to library, making future work easier
- Context efficiency: don't rediscover solved problems
- Incremental growth: library gets smarter with each solution
- Quality through reuse: compose from tested, proven implementations

**Virtuous cycle:**
```
Problem → Explore → Build solution → Add to library → Library grows
                ↑                                            ↓
                └────────── Reuse for next problem ─────────┘
```

### Abstract Integration Patterns

**Philosophy:**
- Don't build specific integrations (MCP, REST, CLI, gRPC, etc.)
- Build abstract integration framework with protocol adapters
- AI composes integrations from patterns, not one-off implementations
- Learn once, apply everywhere
- Makes SPL2 infinitely extensible to any tool or protocol
- Focus on what tools do, not how to talk to them

**Example:**
Instead of: mcp-integration.js, rest-api-integration.js, cli-tool-integration.js...
Build: Generic integration framework → Protocol adapters → Tool implementations

---

## Pear Platform Details

**Runtime environment:**
- Pear runs on Bare runtime (not Node.js)
- All code must be Bare-compatible
- Can run in Node.js during development if using compatible libraries
- Development flexibility: run in Node.js, deploy to Bare

**P2P characteristics:**
- Distributed/decentralized deployment model
- Every peer is both client and server (fits JavaScript everywhere)
- Process execution anchored on distributed data state
- Independent of other peer activity
- Architecture principles (immutable records, stateless execution, self-contained processes) fit P2P naturally

**Approach:**
- Exploration-driven to discover optimal patterns for P2P DSL applications
- Virgin territory - making our own way through experimentation

---

## Primary Use Cases (Expanded)

### Splectrum Core: AI's Central Tool

**What this means:**
- DSL engine is for Claude to create task-specific languages for Claude's tasks
- Growing library is Claude's library of reusable solutions
- APIs optimized for Claude's discovery and composition patterns
- Platform grows based on what Claude actually needs in practice

**Approach:**
- Start with common tasks Claude performs (code analysis, refactoring, testing, documentation, integration, etc.)
- Claude identifies pain points and needed capabilities
- Build tooling to address those needs
- Iterate and expand based on real usage

### Initial P2P Application: Home Automation

**Goal: Conventional distributed applications within P2P context**
- **Logical layer**: Traditional distributed app patterns (services, APIs, data flow)
- **Physical layer**: P2P network topology (peers, replication, discovery)
- Abstract P2P complexity from logical application layer

**Specific application: Self-contained home automation**
- Runs on personal P2P network (PCs, tablets, mobile, personal servers)
- No cloud dependency - complete local control
- Privacy, reliability, offline capability
- Integration with existing tools (Home Assistant, etc.) where appropriate

**How architecture principles fit:**
- **Immutable event log**: Every home event (light on, temp changed, motion detected) is a record
- **State transitions**: Automation is State₁ → trigger → State₂
- **Stateless + distributed**: Any device can execute automation given the state
- **JavaScript everywhere**: Same automation logic runs on any device
- **DSL engine**: Create home automation DSL (rules, scenes, triggers, conditions, device protocols)
- **React/PWA**: Control panel accessible from any device
- **P2P**: Devices discover each other, share state, no single point of failure
- **Complete metadata**: Audit trail for debugging automations and understanding what happened

**Key characteristics:**
- Self-contained network of trusted devices
- Local-first, privacy-preserving
- Resilient (no single point of failure)
- Extensible (integrate any device/protocol through abstract integration)

---

---

## Technology Stack Validation (from product-poc)

**Maturity: 🟢 Working** - Validated through prototype implementations

### AVRO Client-Side Implementation

**Status:** PROVEN successful in product-poc prototypes (prototype-2b)

**Performance Results:**
- Validation speed: < 1ms average for typical forms
- Memory usage: Stable, no leaks detected
- Bundle size: ~80 kB gzipped (acceptable for 2025 standards)
  - AVRO library: 75.16 kB gzipped
  - Application code: 4.13 kB gzipped
  - Schemas: 1.13 kB gzipped

**Required Vite Configuration:**
```javascript
// Node.js polyfills needed for AVRO in browser:
resolve: {
  alias: {
    buffer: 'buffer',
    stream: 'stream-browserify',
    util: 'util',
    process: 'process',
    events: 'events',
    path: 'path-browserify',
    zlib: 'zlib-browserify'
  }
}
```

**Benefits Validated:**
- ✅ Single source of truth - same schemas client and server
- ✅ No duplicate validation logic
- ✅ Offline capability - forms validate without server connection
- ✅ Rich AVRO features - unions, namespaces, schema evolution
- ✅ Field-specific error messages from schema
- ✅ Reduced server load - only send valid data

**Key Finding:** Concerns about client-side bundling were valid but solvable. AVRO client-side is not only viable but recommended.

**Recommendation:** Use AVRO for client-side validation. Do NOT use separate validation library (like Zod) plus server AVRO.

### Testing Stack Validation

**All validated through 194+ tests in prototypes:**

**Vitest (Unit/Integration Testing):**
- Fast execution, excellent developer experience
- Works seamlessly with React components
- Coverage reporting with @vitest/coverage-v8
- Watch mode for development workflow
- **Verdict:** Our JavaScript testing framework

**Playwright (E2E Testing):**
- Cross-browser testing capability
- User journey validation proven
- Excellent debugging tools (headed mode, trace viewer)
- **Verdict:** Our E2E/browser testing tool

**React Testing Library:**
- User-centric component testing
- Works with Vitest
- Proven in prototype component tests
- **Verdict:** Our React component testing library

**Supertest:**
- HTTP endpoint testing
- Proven for API testing
- **Verdict:** API testing tool

### Build and Development Tools

**Vite:**
- Successfully handles AVRO polyfills
- Fast development server with hot module replacement
- Production builds optimized
- **Note:** Bare runtime compatibility needs exploration
- **Verdict:** Our build tool (with Bare validation needed)

**ESLint:**
- Code quality enforcement
- React-specific rules (eslint-plugin-react, eslint-plugin-react-hooks)
- **Verdict:** Our linting tool

**Concurrently:**
- Parallel development servers (client + server)
- Works well for development workflow
- **Verdict:** Development workflow tool

### React Patterns Validated

**React Hook Form:**
- Proven for complex form state management
- Built-in validation handling
- Performance optimizations (minimal re-renders)
- Works with debounced server validation
- **Status:** Validated for complex forms (optional, not mandatory for all components)

**Modular Component Architecture:**
- Reusable field components
- Validation message components
- Separation of concerns
- **Status:** Proven pattern for SPL2

### Storage Approach Validated

**File-Based Storage (from prototype-3):**
- JSON files with schema-driven organization
- Instance files with metadata
- Index files for retrieval
- Schema validation on save/load
- **Proven capabilities:**
  - Concurrent write handling
  - Recovery from interrupted operations
  - Orphaned index cleanup
  - Works well for prototype scale

**Limitations (noted):**
- Performance at scale unknown
- Concurrency limits with file locking
- Not distributed (yet)

**Verdict:** File-based storage is good starting point for SPL2. Design for future migration to other backends.

### TDD Methodology Validation

**Strict TDD proven successful:**
- 194+ tests in prototype-2b
- RED-GREEN-REFACTOR cycle documented and followed
- Comprehensive coverage achieved
- Multiple test layers working together:
  - Unit tests (functions, components)
  - Schema tests (AVRO compilation, validation)
  - Integration tests (API endpoints, RPC)
  - E2E tests (complete user workflows)
  - Performance tests
  - Security tests

**Quality standards achieved:**
- Zero failing tests before commits
- Clean test output
- Fast execution (suitable for development)
- Deterministic tests

**Confirms:** Our WOW.md TDC approach is validated by real implementation

### Exploration-Driven Development Validation

**Contrast: SPL1 vs product-poc methodology**

**product-poc (SUCCESSFUL):**
- Multiple explorations (prototype-1, 2, 2b, 3)
- Each validated specific aspects
- Iterative refinement through practice
- Converged on good implementations

**SPL1 (PROBLEMATIC):**
- Insufficient exploration before committing
- Locked into patterns too early
- Less iteration and learning

**Lesson Validated:**
- **Do numerous explorations** - zoom in on implementation through practice
- **Sprint-sized projects** - test alternatives, learn what works
- **Code explores better than design** - validate through implementation
- **Iterate and converge** - each exploration informs the next

**SPL2 Approach (Already Aligned):**
- Sprint-sized exploration projects ✓
- TDC through code validation ✓
- "Fail fast, fix fast" ✓
- Multiple explorations before "production" ✓
- Learn through practice not theory ✓

**Confirmation:** Our chosen methodology matches what worked in product-poc

### Development Workflow Patterns

**npm script conventions proven:**
```json
"dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
"test": "vitest run",
"test:watch": "vitest",
"test:schemas": "vitest run src/schemas",
"test:server": "vitest run src/server",
"test:client": "vitest run src/client",
"test:e2e": "playwright test",
"lint": "eslint src/ --ext .js,.jsx",
"schema:validate": "node scripts/validate-schemas.js"
```

**Pattern:** Separate test suites, can run all or specific, parallel dev servers

### Exploration Items (Not Yet Validated)

**Bare Runtime Compatibility:**
- Prototypes use Node.js runtime
- Vite polyfills are for browser
- **Unknown:** Does tooling work in Bare runtime?
- **Approach:** Early exploration to validate/adapt
- **Strategy:** May need abstraction layer if compatibility difficult

**P2P Layer:**
- Prototypes don't implement P2P
- Storage is local filesystem only
- **Approach:** Abstract P2P from application layer
- **Strategy:** P2P layer may need different/additional tooling

**State-Backed APIs:**
- Not demonstrated in prototypes
- Process as state transition not shown
- **Approach:** Design through SPL2 exploration

**API Pipelining:**
- Not shown in prototypes
- **Next:** Review spl1 for pipelining patterns

---

## DSL Engine Implementation: API Pipelining

**Maturity: 🟡 Exploratory** - Hypothesis to be tested through design and implementation

### Core Concept

**DSL Creation = API Pipelining:**
- DSLs aren't written from scratch
- They're composed by chaining existing API calls
- Output of one method → Input of next method
- Type compatibility enforced (AVRO schemas define contracts)
- State-backed APIs with their methods become building blocks

### Critical Design Decision

**The pipelining mechanism IS the DSL engine's power.** How APIs compose determines what's possible. The capability of the DSL engine depends heavily on how this pipelining is implemented.

### Implementation Approaches to Explore

**1. Code-based (JavaScript):**
```javascript
api1.method(input)
  .then(api2.method)
  .then(api3.method)
```
- Maximum flexibility
- Direct control
- But verbose for common patterns

**2. Scripting/Declarative:**
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

**3. Hybrid approach?**
- Combine benefits of both?
- To be explored

### Design Questions to Answer

**Discovery & Composition:**
1. How do I (AI) discover what APIs are available?
2. How do I find compatible methods (output → input matching)?
3. How do I compose them efficiently?
4. What makes it easy for me to build DSLs?
5. Should I be able to query "what methods accept this output type?"

**Implementation & Debugging:**
6. What did I prefer in spl1 and why? (need to review archive)
7. Is there a visual/structural representation of pipelines?
8. How do I debug a pipeline?
9. How do I test a pipeline?

**Capability & Power:**
10. What level of abstraction is most powerful for AI?
11. How does pipelining work with state-backed APIs?
12. Can pipelines be saved and reused?
13. How do error handling and data transformation work in pipelines?

### Requirements for Pipelining Implementation

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

### Next Steps

Create work plan to:
1. Review spl1 implementation for lessons learned
2. Design pipelining mechanism
3. Build prototype to validate approach
4. Iterate based on actual AI usage patterns

---

## Notes

- These details will mature through hands-on coding exploration
- Some concepts remain abstract until validated in practice
- Examples and concrete patterns will emerge through implementation
- This document will evolve as we learn
