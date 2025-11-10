**Requirements:** See `projects/01-preliminary-to-workplan/Principles_requirements_v1.0.0.md`

# SPL2 Core Principles

## What is Splectrum?

**Splectrum (SPL2)** is a platform that allows AI to create and manage software solutions with a focus on P2P applications.

**Architecture:** DSL engine for creating task-optimized languages and composable APIs.

**Goals:** Simplest implementation, complete output, AI-friendly design.

**Approach:** Start simple, validate with code, iterate based on evidence.

**Detail emerges through exploration** - see individual exploration project findings.

## Design Principles

**Stateless with State Backing:**
- Code itself is stateless (no internal state)
- State comes from Kafka records
- State initialized at process start, persists through execution
- Any device can execute any process given the state

**Processes as State Transitions:**
- Process = visible transition: State₁ → Process → State₂
- Each state is immutable Kafka record
- Complete history preserved, transitions replayable
- Event sourcing naturally

**Detail:** See `projects/02-initial-workplan/Data_architecture_v1.0.0.md` for Kafka-compatible records, process structure, and lazy functional approach

**DSL Engine & API Pipelining:** See `projects/02-initial-workplan/DSL_engine_v1.0.0.md` and `projects/02-initial-workplan/API_pipelining_v1.0.0.md` for architecture vision

## Technology Stack

**Kafka Compatibility / Streaming Architecture:**
- Kafka-compatible record format (all data follows this structure)
- Immutable records (write once, never modify)
- Streaming architecture at heart

**AVRO for Schema and RPC:**
- AVRO defines all schemas (client and server)
- AVRO RPC for client-server communication

**Code & Runtime:**
- JavaScript everywhere (isomorphic - runs client and server)
- Bare runtime for P2P (Pear platform)
- Can develop in Node.js if Bare-compatible

**Detail:** See `projects/02-initial-workplan/Pear_platform_v1.0.0.md` for Bare runtime and P2P characteristics

**UI:**
- React for all interfaces
- PWA for mobile support
- Stateless components, immutable data flow

## Technology Constraints - Tooling Stack (Validated)

**Testing - PROVEN in product-poc prototypes:**
- **Unit/Integration:** Vitest (fast, excellent DX, 194+ tests validated)
- **Component Testing:** React Testing Library (user-centric, proven with Vitest)
- **E2E/Browser:** Playwright (cross-browser, excellent debugging)
- **API Testing:** Supertest (HTTP endpoint testing)
- **Coverage:** @vitest/coverage-v8

**Development - VALIDATED:**
- **Build:** Vite (proven with AVRO polyfills - Bare compatibility to be explored)
- **Linting:** ESLint (with React plugins)
- **Dev Workflow:** Concurrently (parallel client/server development)
- **Code Formatting:** To be decided (Prettier not in prototypes)

**AVRO Tooling - PROVEN:**
- **Library:** avsc (works client + server)
- **Browser Polyfills:** buffer, stream, util, process, events, path, zlib
- **Bundle Impact:** ~80 kB gzipped (acceptable for functionality)
- **Client-side AVRO validated:** Single source of truth across stack

**React Ecosystem - VALIDATED:**
- **React Hook Form:** Proven for complex forms (optional, not mandatory)
- **Modular Components:** Component architecture validated

**Exploration Items:**
- Bare runtime compatibility (tooling may need adaptation/abstraction)
- P2P layer tooling (may differ from application layer)
- Code formatting standards

**Detail:** See `projects/02-initial-workplan/Technology_validation_v1.0.0.md` for full validation results from product-poc prototypes
