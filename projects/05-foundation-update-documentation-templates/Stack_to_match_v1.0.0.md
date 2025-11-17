**Requirements:** (To be defined in glossary project)

# The Stack to Match v1.0.0

**Created:** Project 05, 2025-11-16
**Context:** Technology choices that match architecture and reduce friction
**Status:** Active - coherent selections, will evolve based on friction signals

---

## Technologies That Match

**Stack chosen to match the architecture - coherence, not arbitrariness.**

**Matches Panta Rhei:**
- Streaming architecture (flow-native)
- Immutable records (preserve every drop)
- Stateless execution (pure functions)
- Low friction design

**Matches Three Pillars:**
- Mycelium: Kafka-compatible records ready, streaming native
- Splectrum: JavaScript/AVRO enable DSLs, React for expression
- HAICC: AI-friendly stack, clear structure, testable

**Validated through friction signals:**
- Low friction = flows smoothly (keep it)
- High friction = creates resistance (change it)
- Prototypes reveal friction (194+ tests, bundle measurements)
- Iterate when friction appears

**See:** Technology_validation_v1.0.0.md (projects/02-initial-workplan/), Projects 03-04

**See stepping stones:** Panta Rhei, The Magic of Friction

---

## Core Technologies

### Streaming Architecture

**Kafka-compatible records at foundation:**

**What this means:**
- All data follows Kafka record format
- Immutable records (write once, never modify)
- Streaming architecture at heart
- Event sourcing naturally

**Why Kafka-compatible:**
- Industry-proven pattern
- Scales from local to distributed
- Rich ecosystem of tools
- AI can reason about structure

**Record structure:**
- Headers (metadata, routing)
- Key (identity, partitioning)
- Value (state payload)
- Timestamp (temporal ordering)

**Integration with Panta Rhei:**
- Records are the flowing state
- Immutable = river preserves every drop
- Streaming = continuous flow
- Architecture coherence

**See:** Data_architecture_v1.0.0.md (projects/02-initial-workplan/), Panta Rhei principles

### AVRO for Schema and RPC

**AVRO defines all schemas:**

**What it provides:**
- Schema definition (client and server)
- AVRO RPC for client-server communication
- Schema evolution (forward/backward compatibility)
- Compact binary encoding

**Why AVRO:**
- Strong typing (AI-friendly structure)
- Schema registry (single source of truth)
- RPC built-in (client-server symmetry)
- Battle-tested (Kafka ecosystem)

**Validation from product-poc:**
- Works client-side (browser + polyfills)
- Bundle impact measured (~80 kB gzipped)
- Acceptable for functionality provided
- Single schema across full stack

**Polyfills needed for browser:**
- buffer, stream, util, process
- events, path, zlib
- Vite handles this (proven)

**Client-side AVRO validated:**
- Same schemas client and server
- Type safety across network boundary
- Generate types from schemas
- Reduce human-AI friction

**See:** Technology_validation_v1.0.0.md for bundle analysis

### JavaScript Everywhere

**Isomorphic execution:**

**JavaScript runs:**
- Client-side (browser)
- Server-side (Node.js, Bare)
- Build tools (Vite, ESLint)
- Test environment (Vitest)

**Why JavaScript:**
- One language across stack
- AI excellent at JavaScript
- Rich ecosystem
- Runs in Bare runtime (P2P)

**Bare runtime for P2P:**
- Minimal JavaScript runtime
- P2P native (Pear platform)
- Offline-first architecture
- No central server needed

**Development flexibility:**
- Can develop in Node.js
- If Bare-compatible (most is)
- Deploy to Bare for P2P
- Validate compatibility through testing

**Exploration status:**
- Bare runtime validated (Projects 03-04)
- Hello world proven
- Tooling compatibility being explored
- Path forward clear

**See:** Pear_platform_v1.0.0.md (projects/02-initial-workplan/), Projects 03-04 DAILY_LOG

### React for UI

**All interfaces use React:**

**What we validated:**
- Component architecture (modular, reusable)
- Stateless components (Panta Rhei principles)
- Immutable data flow (Redux pattern without Redux)
- React Testing Library (user-centric testing)

**Why React:**
- Declarative (AI-friendly)
- Component composition (modular)
- Rich ecosystem (tools, libraries)
- PWA support (mobile)

**Stateless components:**
- Props in → render → UI out
- No internal state (lift to records)
- Pure functions for UI
- Panta Rhei in components

**PWA for mobile:**
- Progressive Web App
- Installable, offline-capable
- No app store needed
- Works across devices

**React ecosystem validated:**
- React Hook Form (complex forms, optional)
- Component patterns proven
- Testing approach validated
- Vitest + React Testing Library works

---

## Tooling Ecosystem

### Testing - Proven Through Use

**194+ tests validate the approach:**

**Unit/Integration: Vitest**
- Fast (milliseconds per test)
- Excellent developer experience
- ESM native (modern JavaScript)
- Proven in product-poc

**Component Testing: React Testing Library**
- User-centric (test behavior, not implementation)
- Works seamlessly with Vitest
- Encourages good patterns
- Validated through prototypes

**E2E/Browser: Playwright**
- Cross-browser testing
- Excellent debugging tools
- Reliable (reduces flaky tests)
- Standard for end-to-end

**API Testing: Supertest**
- HTTP endpoint testing
- Simple, effective
- Integrates with test runners
- Proven approach

**Coverage: @vitest/coverage-v8**
- Code coverage tracking
- Built into Vitest
- Fast, accurate
- Visibility into testing gaps

**Low friction testing:**
- Fast feedback (milliseconds per test)
- Clear errors (know what broke)
- Confidence to change (safety net)
- Smooth workflow (tests don't slow you down)

**See stepping stone:** Why Self-Evaluation Matters (testing enables self-validation)

### Development Workflow

**Vite for building:**
- Lightning-fast dev server
- Hot module replacement
- Optimized production builds
- Handles AVRO polyfills (proven)

**Bare compatibility:**
- Exploration needed
- May need adaptation/abstraction
- Path forward clear
- Evidence will guide

**ESLint for quality:**
- Code quality checks
- React-specific rules
- Consistent style
- Catches common issues

**Concurrently for parallel work:**
- Client and server simultaneously
- Single command starts both
- Simplified development
- Low friction workflow

**Code formatting:**
- To be decided
- Prettier not in prototypes (not needed yet)
- Evidence-based addition
- When friction shows need

**See stepping stone:** The Magic of Friction (add when friction shows need)

### Integration Points

**How tools work together:**

**Development loop:**
1. Write code (JavaScript, React)
2. Vite builds (fast, HMR)
3. Vitest tests (unit, component)
4. ESLint checks (quality)
5. Iterate quickly

**Validation loop:**
1. Unit tests (Vitest)
2. Component tests (React Testing Library)
3. API tests (Supertest)
4. E2E tests (Playwright)
5. Coverage report (@vitest/coverage-v8)

**Low friction:**
- Tools integrate smoothly
- Fast feedback
- Clear errors
- Good developer experience

---

## Technology Constraints

**Constraints guide decisions:**

### Bare Runtime Constraints

**Must be Bare-compatible:**
- No Node.js-specific APIs (unless abstracted)
- Consider bundle size (Bare is minimal)
- P2P-first thinking (no central server assumptions)
- Offline-capable (local-first)

**Exploration items:**
- Tooling adaptation for Bare
- Vite compatibility with Bare
- Build process adjustments
- Testing in Bare environment

**Status:** Path forward clear, details being explored

### Bundle Size Consciousness

**Client-side matters:**
- AVRO polyfills ~80 kB (measured, acceptable)
- React bundle size (reasonable for value)
- Each addition justified by evidence
- Measure, don't assume

**Trade-offs:**
- Functionality vs. size
- Developer experience vs. bundle impact
- Pragmatic decisions based on evidence

**See stepping stone:** Pragmatism (usability test determines "good enough")

### P2P Architecture Constraints

**No central server assumptions:**
- Code must work offline
- State local-first, sync later
- Any peer can execute
- Distributed by default

**This simplifies:**
- No server infrastructure
- No deployment complexity
- User owns their data
- Resilient by nature

**Integration with pillars:**
- Mycelium enables distribution
- Panta Rhei enables any-device execution
- Architecture coherence

---

## Evolution Through Evidence

### What We Know

**Validated through building:**
- Vitest excellent for testing (194+ tests prove it)
- AVRO works client-side (~80 kB bundle, acceptable)
- React architecture solid (component patterns proven)
- Vite handles polyfills (AVRO browser compatibility)
- Bare runtime works (hello world validated)

**Evidence sources:**
- product-poc prototypes (Technology_validation_v1.0.0.md)
- Projects 03-04 (runtime exploration, API design)
- Actual code, actual tests, actual measurements
- Not theory, but practice

### What We're Exploring

**Active exploration:**
- Bare runtime tooling compatibility
- Vite + Bare integration
- P2P layer tooling (may differ from app layer)
- Code formatting standards (when friction shows need)

**Approach:**
- Build, measure, decide
- Evidence before commitment
- Iterate when friction appears
- Trust the process

**See stepping stones:** Evidence-based evolution, The Magic of Friction

### What Will Change

**Expect evolution:**
- New tools discovered
- Better approaches proven
- Friction reveals issues
- Evidence drives change

**Local rules apply:**
- Code satisfies requirements at time written
- Tooling choices validated when made
- No retroactive burden
- Deliberate upgrades based on evidence

**Maturity increases:**
- More validation → more confidence
- More evidence → better decisions
- More use → clearer patterns
- Continuous improvement

**See stepping stones:** Local Rules, Maturity, Evidence-based evolution

---

## Integration with Principles

### Supports Three Pillars

**Mycelium (future):**
- Kafka-compatible records ready
- Streaming architecture native
- Multi-repository support possible
- Foundation prepared

**Splectrum (building):**
- JavaScript everywhere (DSL execution)
- AVRO for schemas (type-safe DSLs)
- React for expression (UI DSLs)
- Platform emerging

**HAICC (active):**
- AI-friendly stack (JavaScript, AVRO, React)
- Clear structure (AI can reason about)
- Testable (AI can validate)
- Evidence-based (methodology matches tooling)

### Embodies Panta Rhei

**Technology flows:**
- Streaming architecture (flow-native)
- Immutable records (river preserves drops)
- Stateless execution (pure functions)
- Event sourcing (flow IS system)

**Low friction:**
- Simple stack (few core technologies)
- Proven tools (reduced surprises)
- Good integration (tools work together)
- Fast iteration (Vite, Vitest)

---

## Anti-Patterns

### Technology for Technology's Sake

**DON'T:**
- Add cool tech without validation
- Assume latest = best
- Speculate on future needs
- Build for imagined scale

**DO:**
- Validate through building
- Measure actual impact
- Respond to real friction
- Scale when evidence shows need

### Premature Optimization

**DON'T:**
- Optimize before measuring
- Assume performance problems
- Add complexity for imagined load
- Tool sprawl without evidence

**DO:**
- Simple first, optimize later
- Measure actual performance
- Add tools when friction appears
- Evidence-based additions

### Tool Lock-In

**DON'T:**
- Depend on proprietary tools
- Assume tools won't change
- Tight coupling to specific versions
- Fear of evolution

**DO:**
- Open standards (Kafka, AVRO)
- Abstract where sensible
- Local rules (upgrade deliberately)
- Evidence drives change

---

**Summary: Technology choices validated through building, not theory. Core stack: Kafka-compatible records, AVRO schemas, JavaScript everywhere, React for UI. Tooling proven: Vitest (194+ tests), Vite (fast builds), Playwright (E2E), ESLint (quality). Constraints guide: Bare runtime compatibility, bundle size consciousness, P2P architecture. Evidence-based evolution: validate through code, measure impact, iterate based on friction. Stack supports three pillars (Mycelium prepared, Splectrum emerging, HAICC active) and embodies Panta Rhei (streaming, immutable, stateless, low friction). Not locked-in - will evolve based on evidence.**
