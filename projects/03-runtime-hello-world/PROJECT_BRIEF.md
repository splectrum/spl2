Requirements: ../project-types/Explorative_project_requirements_v1.0.0.md
Requirements: projects/03-runtime-hello-world/PRINCE2_operational_v1.2.0.md

# Project Brief: Runtime Structure "Hello World"

**Project Code:** 03-runtime-hello-world
**Project Type:** Explorative Project
**Start Date:** 2025-11-10
**Status:** Initiated

---

## Project Definition

### Background

Projects 01-02 established validated foundations, methodology (PRINCE2+TDC), and project backlog. The next critical step is validating whether SPL2's core architecture actually works.

This is the **highest priority, highest risk project** - everything downstream depends on proving the execution model is viable:
- Invocation → Context → Pipeline → Execution
- State-backed APIs (Kafka records → state → new records)
- API composition and chaining
- Bare platform compatibility

If this architectural model doesn't work, we need to know now before building on faulty foundations.

### Project Objective

Validate SPL2's core runtime execution model through minimal "hello world" implementation that proves the fundamental architecture works, while establishing templates for development setup, API design, runtime structure, and implementation patterns.

### Business Justification

**Without this validation:**
- Unknown if core execution model is viable
- Highest architectural risk unresolved
- Cannot proceed with DSL engine or features
- Could build on fundamentally flawed architecture

**With validation complete:**
- Core architecture proven or pivoted
- Clear patterns for API design and runtime structure
- Development setup established for future work
- Confidence to build downstream features
- Templates for repeating these patterns

### Project Type: Explorative Project

This is an **Explorative Project** - architectural validation through building concrete implementation alongside reusable templates.

**Methodology:**
- Create concrete implementations (instances)
- Simultaneously create templates (patterns)
- Cross-pollination: concrete problems inform templates, templates guide structure
- Both implementation and template are products
- Templates validate through actual use during creation

**Structure:** 8 products in 4 twin pairs (implementation + template created in parallel)

**Scope may adapt:** If we discover twin pairs are unnecessary or additional ones are needed, we adjust (explorative methodology)

---

## Products to be Delivered

### Twin Pair 1: Development Setup

#### Product 1A: Node.js Development Environment

**Description:** Working Node.js development environment in `runtime-poc/` subfolder with tooling configured

**What we'll do:**
- Initialize Node.js project in `projects/03-runtime-hello-world/runtime-poc/`
- Configure Vitest for testing
- Set up folder structure (src/, tests/)
- Validate with simple test
- No TypeScript (small code units, keep simple)

**Quality Criteria (TDC Validation):**
- Node.js project initializes successfully
- Vitest runs and executes tests
- Folder structure clear and logical
- Can write and run simple test
- Setup documented in project

**Completion Evidence:**
- `package.json` with dependencies
- Working test that passes
- Clear folder structure

---

#### Product 1B: Development Setup Template

**Description:** Reusable template for setting up Node.js development environments in future SPL2 projects

**What we'll do:**
- Document setup steps and rationale
- Tooling choices and why
- Folder structure pattern
- Testing setup approach
- What to include/exclude

**Quality Criteria (TDC Validation):**
- Template generalizable (not specific to this project)
- Clear step-by-step guidance
- Rationale for choices documented
- Reusable for future projects
- Examples from this project included

**Completion Evidence:**
- Template document created
- Validated through use in this project
- Could guide future setup without additional context

---

### Twin Pair 2: State-Backed API Implementation

#### Product 2A: State-Backed API Design & Implementation

**Description:** Working state-backed API demonstrating Kafka record structure, state transitions, and stateless code pattern

**What we'll do:**
- Design minimal Kafka record structure (immutable, metadata)
- Define state transition pattern (State₁ → Process → State₂)
- Implement sample API using state backing
- Demonstrate stateless code with state parameter
- Validate immutability and metadata capture

**Quality Criteria (TDC Validation):**
- Kafka record structure minimal & complete
- State transitions work as designed
- API implementation stateless (pure functions with state)
- Immutability enforced
- Metadata captured appropriately
- Working code with tests

**Completion Evidence:**
- Record structure defined and implemented
- Working API using state backing
- Tests proving state transitions
- Pattern clear and reusable

---

#### Product 2B: API Design Template

**Description:** Template for designing and implementing state-backed APIs in SPL2

**What we'll do:**
- Document state-backed API pattern
- Kafka record structure guidance
- State transition design approach
- API implementation guidelines
- Testing strategy for state-backed APIs

**Quality Criteria (TDC Validation):**
- Pattern clearly documented
- Generalizable for different API types
- Includes concrete examples from 2A
- Guidance on state structure design
- Reusable for future API development

**Completion Evidence:**
- Template document created
- Validated through Product 2A implementation
- Clear enough for future API creation

---

### Twin Pair 3: Runtime State Stack

#### Product 3A: Runtime State Stack Implementation

**Description:** Runtime structure with state stack, layer responsibilities, and pipeline definition working

**What we'll do:**
- Design state stack layers (execution context structure)
- Define layer responsibilities (what each layer does)
- Design pipeline definition structure
- Implement orchestration (invocation → context → pipeline → execution)
- Show how layers interact

**Quality Criteria (TDC Validation):**
- State stack layers clearly defined
- Responsibilities unambiguous
- Pipeline definition structure practical
- Orchestration mechanism works
- Layer interactions clear
- Working code with tests

**Completion Evidence:**
- State stack implemented and working
- Pipeline can be defined and executed
- Tests proving orchestration works
- Clear layer boundaries

---

#### Product 3B: Runtime Structure Template

**Description:** Template for designing runtime structures, state stacks, and orchestration patterns

**What we'll do:**
- Document runtime structure pattern
- State stack design guidance
- Layer responsibility guidelines
- Pipeline definition approach
- Orchestration patterns

**Quality Criteria (TDC Validation):**
- Pattern applicable to different runtime scenarios
- Clear guidance on layer design
- Pipeline definition structure reusable
- Validated through Product 3A
- Supports future runtime evolution

**Completion Evidence:**
- Template document created
- Pattern proven in Product 3A
- Generalizable for future runtime work

---

### Twin Pair 4: Hello World Implementation

#### Product 4A: Working Hello World Code

**Description:** Complete working "hello world" demonstrating full execution flow with 2+ chained APIs

**What we'll do:**
- Implement full example using Products 2A + 3A
- Chain 2+ APIs in pipeline
- Demonstrate state transitions through execution
- Capture complete metadata
- Validate entire execution model works
- Prove minimal & complete pattern

**Quality Criteria (TDC Validation):**
- Full execution flow works (invocation → context → pipeline → execution)
- APIs chain correctly (output → input)
- State transitions correctly (State₁ → Process → State₂)
- Metadata captured (minimal & complete)
- Code clear and understandable
- Tests prove all aspects work

**Completion Evidence:**
- Working hello world that runs
- All execution stages demonstrated
- State transitions proven
- Clear validation of architecture

---

#### Product 4B: Implementation Templates

**Description:** Templates for implementing runtime concepts in code (APIs, pipelines, execution)

**What we'll do:**
- Document implementation patterns from 4A
- Code structure templates
- API implementation examples
- Pipeline setup patterns
- Testing approach for full integration

**Quality Criteria (TDC Validation):**
- Patterns clear and reusable
- Code examples concrete
- Generalizable to different implementations
- Validated through Product 4A
- Supports future feature development

**Completion Evidence:**
- Template documents created
- Proven through working hello world
- Ready for future implementation work

---

## Success Criteria

**Architecture Validation:**
- ✅ Core execution model proven viable
- ✅ State-backed APIs work as designed
- ✅ Pipeline composition practical
- ✅ State transitions work correctly
- ✅ Metadata capture minimal & complete

**Deliverables:**
- ✅ Working hello world demonstrating full flow
- ✅ 4 templates ready for future use
- ✅ Clear understanding of what works and what doesn't
- ✅ Development environment established

**Knowledge:**
- ✅ Execution model validated or pivot identified
- ✅ Patterns documented and reusable
- ✅ Open questions answered or clarified
- ✅ Confidence in architectural direction

**Risk Reduction:**
- ✅ Highest architectural risk addressed
- ✅ Bare compatibility path understood
- ✅ Foundation for downstream work established

---

## Scope

### In Scope
- Node.js implementation (Phase 1 Dev Setup)
- Minimal hello world proving concepts
- Core execution model validation
- Template creation alongside implementation
- Basic Bare compatibility assessment

### Out of Scope
- Full Bare runtime implementation (separate project: Bare Runtime Hello World)
- AVRO schema integration (separate project)
- Complete DSL engine (separate project)
- Production-ready implementation
- Performance optimization
- UI or visual tooling

### Open Questions (to be answered during exploration)
- What's the right abstraction for execution context?
- How should pipelines be expressed? (code-based, declarative, hybrid?)
- What's the minimal Kafka record structure?
- Does AVRO type checking work for pipeline composition?
- Are there Bare compatibility blockers?

---

## Approach

**Explorative with twin pair methodology:**
1. Twin Pair 1: Set up development environment + setup template
2. Twin Pair 2: Design and implement state-backed APIs + API template
3. Twin Pair 3: Implement runtime state stack + runtime template
4. Twin Pair 4: Build hello world + implementation templates

**Each twin pair:**
- Build concrete implementation (learn by doing)
- Create template simultaneously (capture pattern)
- Cross-pollinate (problems inform templates, templates guide work)
- Validate through actual use

**Timeline:** 1-2 weeks (sprint-sized)

**Adaptive:** Skip twin pairs if discovered unnecessary, add if needed

---

## Constraints

From foundations (see `foundations/WOW.md` and `foundations/PRINCIPLES.md` for references to detail):

**Minimal & Complete:**
- Start minimal, add based on evidence
- Question every addition: needed NOW?
- Avoid over-engineering (Risk R07 from Project 02)

**Evidence-Based:**
- Build to learn, not to spec
- Let problems inform solutions
- Validate through working code

**Living Artifacts:**
- Templates evolve through use
- Document what we learn
- Feed lessons back to foundations

**PRINCE2 + TDC:**
- Use DAILY_LOG.md throughout
- TDC validation for each product
- Synthesize LESSONS_LEARNED.md at close

---

## Dependencies

**Depends on:**
- Project 01: Foundations and methodology ✅
- Project 02: Project backlog and structure ✅

**Unlocks:**
- Bare Runtime Hello World (validates on target platform)
- Kafka Compatible Records (detailed record implementation)
- AVRO Schema and RPC (type system integration)
- API State Management (advanced state patterns)
- DSL Engine Foundation (depends on proven runtime)
- All downstream SPL2 development

---

## Initial Assessment

**Complexity:** High (architectural validation, interconnected concepts)
**Risk:** High (core architecture might not work)
**Priority:** Critical (unlocks everything)
**Duration:** 1-2 weeks

This is the most important project in the backlog - validates whether SPL2's vision is technically viable.
