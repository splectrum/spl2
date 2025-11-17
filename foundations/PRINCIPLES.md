**Requirements:** See `projects/01-preliminary-to-workplan/Principles_requirements_v1.0.0.md`

# SPL2 Core Principles

## The Three Pillars

**Splectrum rests on three foundational pillars - data, language, and creation.**

**See:** Three_pillars_v1.0.0.md (projects/05-foundation-update-documentation-templates/)

**The triad:**
- **Mycelium** - The web of data (distributed repository layer, network beneath)
- **Splectrum** - Language fluence (DSL platform, expression and execution)
- **HAICC** - The art of creation (human-AI partnership methodology)

**Why three pillars:**
- Each necessary, none sufficient alone
- Data without language is inert, language without creation is sterile, creation without data has no foundation
- Together form complete system: substrate + medium + process

**Design coherence across pillars:**
- Distributed over centralized
- Immutable with evolution
- Simplicity enabling complexity
- AI-native design
- Evidence-based

## Mycelium: The Web of Data

**The network beneath - distributed repository layer connecting, storing, flowing.**

**See stepping stone:** Mycelium
**See:** Three_pillars_v1.0.0.md (Mycelium section)

**What it is:**
- Logical data repository layer abstracting physical storage
- Multi-repository support (Git, Fossil, Pijul, custom)
- The underground network (mycelium) beneath the visible platform (splectrum)

**Key characteristics:**
- Repository-agnostic, distributed by nature
- Event-sourced with immutable history
- Connection-oriented (relationships matter)
- Enables P2P, offline-first, data sovereignty

**Current maturity:** Conceptual - architecture vision defined, not yet implemented, informs design decisions

## Splectrum: Language Fluence

**Expression and execution - DSL platform for AI collaboration and P2P applications.**

**See stepping stone:** Splectrum
**See:** Three_pillars_v1.0.0.md (Splectrum section)

**What it is:**
- Platform for building P2P applications with AI
- DSL engine for creating task-optimized languages
- Composable APIs, AI-friendly design
- Built on Mycelium data layer (conceptually)

**Language fluence:**
- Not one language, but language creation capability
- Task-optimized DSLs emerge as needed
- Composable, evolvable, AI-accessible
- Fluent = flowing, changeable, expressive

**Design philosophy:**
- Simplest implementation, complete output
- AI as first-class creator
- Stateless execution with state backing
- Validate through code, iterate based on evidence

**Current maturity:** Emerging - core concepts validated (Projects 03-04), runtime structure proven, building toward platform

## HAICC: The Art of Creation

**Human-AI collaborative creativity - partnership methodology where each brings unique strengths.**

**See stepping stone:** HAICC
**See:** WOW.md (Human-AI Collaboration block), Three_pillars_v1.0.0.md (HAICC section)

**What it is:**
- Methodology for equal human-AI partnership
- Not replacement or direction, but collaborative creativity
- Produces what neither could create alone
- The "art" - practiced, refined, emergent

**Core insight:**
- Human: Vision, intuition, domain insight, strategic direction
- AI: Formalization, research, documentation, tireless iteration
- Together: Emergent insights, linguistic co-evolution, architectural clarity

**Key patterns:**
- Partnership in trust (equal collaboration)
- Autonomy guided by requirements (boundary expands)
- Evidence-based evolution (friction drives improvement)
- Continuous reflection (learning from practice)

**Current maturity:** Active practice - operational methodology, continuous refinement, proven through building Splectrum, evolving based on evidence

## Panta Rhei: It All Just Flows

**You never step in the same river twice - but we trace every drop.**

**See:** Panta_rhei_v1.0.0.md (projects/05-foundation-update-documentation-templates/)

**Everything flows:**
- State flows like a river (constantly changing, never the same)
- Code is stateless (pure functions, no internal state)
- Immutable records preserve each moment (every drop traced)
- Processes transform state (State₁ → Process → State₂)
- History complete (we never lose the past)
- Event sourcing emerges naturally (the flow IS the system)

**Low friction by design:**
- Simple architecture → complex emergent behavior
- Natural patterns, not forced constructs
- Flow encounters minimal resistance
- Let it flow, don't dam it up

**Key principles:**
- Stateless code, state from external records (any device can execute)
- Processes as visible state transitions (traceable, replayable)
- Immutable records (write once, history preserved)
- Complete reconstruction possible (from records, rebuild everything)

**Integration with pillars:**
- Mycelium IS flow (network carries state transformations)
- Splectrum expresses flow (DSLs describe state transitions)
- HAICC creates flowing systems (partnership builds architecture)

## The Stack to Match

**Technology choices that match the architecture and reduce friction.**

**See:** Stack_to_match_v1.0.0.md (projects/05-foundation-update-documentation-templates/)

**Core technologies (validated):**
- **Streaming:** Kafka-compatible records, immutable, event sourcing natural
- **Schema:** AVRO for all schemas and RPC, client-side proven (~80 kB bundle)
- **Runtime:** JavaScript everywhere, Bare for P2P, isomorphic execution
- **UI:** React components, PWA support, stateless patterns

**Tooling ecosystem (proven):**
- **Testing:** Vitest (194+ tests), React Testing Library, Playwright, Supertest
- **Development:** Vite (fast builds, HMR), ESLint (quality), Concurrently (parallel workflow)
- **Integration:** Tools work together smoothly, low friction development

**Evidence sources:**
- product-poc prototypes (Technology_validation_v1.0.0.md)
- Projects 03-04 (Bare runtime validation, API design exploration)
- Actual code, actual tests, actual measurements

**Constraints guide decisions:**
- Bare runtime compatible (P2P-first, offline-capable, minimal)
- Bundle size conscious (measure, don't assume)
- P2P architecture (no central server, distributed by default)

**Evolution through evidence:**
- What we know: Vitest excellent, AVRO works client-side, React solid, Bare validated
- What we're exploring: Bare tooling integration, P2P layer specifics
- What will change: Evidence drives evolution, local rules apply
