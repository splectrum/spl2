# SPL2 Core Principles

## What is Splectrum/SPL2?

**Splectrum (SPL2)** is Claude's central tooling platform - a DSL engine for creating task-optimized languages and tools. It enables building P2P applications using AI-friendly, composable APIs with complete audit trails.

**Core concept:** Platform for creating layers of APIs that compose into optimal DSLs for solving problems.

## Primary Goals

1. **Simplest Implementation** - No unnecessary complexity, clear straightforward code
2. **Complete Output** - All data and metadata captured in raw form, fully accessible
3. **AI-Friendly Design** - Maximum implementation freedom, optimized for AI discovery and use

## Core Principles

**Minimal and Complete:**
- Code is simplest implementation that passes tests
- Captures sufficient metadata to reconstruct what happened (initial state, executed code, input, output, logging, external dependencies)
- Core provides raw materials, separate tools process them (lazy functional approach)

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

## Technology Stack

**Data & Schema:**
- Kafka-compatible record format (all data follows this structure)
- AVRO defines all schemas (client and server)
- Immutable records (write once, never modify)
- Streaming architecture at heart

**Code & Runtime:**
- JavaScript everywhere (isomorphic - runs client and server)
- Bare runtime for P2P (Pear platform)
- Can develop in Node.js if Bare-compatible

**UI:**
- React for all interfaces
- PWA for mobile support
- Stateless components, immutable data flow

**Communication:**
- AVRO RPC for client-server communication
- Abstract integration patterns (not tool-specific)

**AI Freedom:**
- AI decides what runs where (client vs server)
- AI chooses implementation approaches within constraints

## Primary Use Cases

**Splectrum Core: AI Tooling**
- Platform for Claude's task automation and problem-solving
- Claude decides what tooling is needed
- Growing library of reusable components
- DSL creation for task-specific languages

**Initial P2P Application: Home Automation**
- Self-contained P2P network (PCs, tablets, mobile, servers)
- Local-first, no cloud dependency
- Conventional distributed apps on P2P infrastructure
- Integration with existing tools (Home Assistant, etc.)

## Design Philosophy

**Do:**
- Start from scratch, design for the goal
- Choose simplest approach that works
- Complete over clever
- Explore and validate with code

**Don't:**
- Over-engineer or optimize prematurely
- Add features not in requirements
- Carry over unnecessary complexity
- Create documentation without code validation

## Tooling Decisions Needed

**Categories where early technology choices enable rather than constrain:**

**Testing:**
- JS/Node testing framework
- React component testing
- Browser/E2E testing
- Test runners and utilities

**Development:**
- Build/bundling tools (considering Bare/Pear compatibility)
- Linting and code quality
- Code formatting
- Development server/hot reload

**Debugging:**
- Browser debugging tools
- Node/Bare debugging approach
- State inspection tools

**Schema/Type tooling:**
- AVRO schema tooling for JavaScript
- Schema validation utilities
- Type checking (if appropriate)

**Note:** Prototype exists with React + AVRO in browser. Work plan will include evaluating those tool choices.

## Quality Standard

"Good enough" (PRINCE2) - fit for purpose, enables work, can improve through usage.
