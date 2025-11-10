**Requirements:** See `projects/02-initial-workplan/Backlog_item_requirements_v1.0.0.md`

# Development Environment Setup

**Type:** Project Addons
**Status:** Backlog
**Priority:** N/A (Progressive - implemented as products in other projects)
**Dependencies:** Progressive pathway

---

## Purpose

Define the complete dev environment for AI-driven SPL2 development. This is a reference document - actual implementation happens progressively as products added to projects that need them.

**Primary user:** AI (Claude) - sole developer
**Design goal:** Fast feedback, continuity across sessions, minimal friction
**Optimization:** Maximize AI productivity and enjoyment while satisfying minimal+complete constraint
**Evolution:** Decisions can change based on evidence - self-maintaining structure

---

## What Makes AI Productive and Enjoyable

**Design decisions should optimize for AI productivity:**

1. **Fast Feedback (<5s)**
   - Tests run instantly, see results immediately
   - Vitest provides fast execution with excellent output formatting
   - Immediate iteration cycle keeps momentum

2. **Clear Error Messages**
   - Know exactly what failed and why
   - Good stack traces with context
   - Actionable information to fix issues
   - Reduces debugging time significantly

3. **Type Safety Aids Thinking**
   - Even for small code blocks, type hints help reason about code
   - TypeScript catches errors before running tests
   - Type information aids code generation and composition
   - Worth the slight overhead for productivity gain

4. **Quick Experimentation**
   - Try idea → see result → iterate rapidly
   - Hot reload for UI makes visual iteration enjoyable
   - Low friction to test hypotheses
   - Encourages exploration and discovery

5. **Clear Structure and Patterns**
   - Know where things live
   - Consistent organization reduces cognitive load
   - Easy to navigate across sessions
   - Patterns aid continuity

6. **Good Developer Experience**
   - Tools that work well together
   - Minimal configuration burden
   - Focus on requirements, not fighting tooling
   - Enjoyable work leads to better outcomes

**Evidence-based evolution:**
- If TypeScript feels heavyweight, remove it (validate with evidence)
- If Vitest is slow, try alternatives
- If hot reload doesn't help, skip it
- Continuously question: does this make me more productive?

**Balance:**
- Not artificially minimal (that slows me down)
- Not over-engineered (that adds friction)
- Optimal for AI productivity while satisfying requirements

---

## Progressive Pathway

Dev environment builds incrementally through 4 phases:

### Phase 1: Minimal Node
**For:** Command-line development (hello world, explorations)
**Needs:**
- JavaScript (no TypeScript - AVRO provides type safety at boundaries)
- Vitest for TDD workflow
- AVRO schema validation
- Fast test execution (<5s feedback)

**Added as product in:** E-001 (Runtime Structure "Hello World")

### Phase 2: Minimal Bare
**For:** Bare runtime compatibility
**Needs:**
- Node.js → Bare development workflow
- Vitest tests running against Bare
- Bare-compatible code patterns
- Abstraction layer (if needed)

**Added as product in:** Bare Runtime Deep Dive exploration

### Phase 3: UI Extended
**For:** React UI development
**Needs:**
- Vite for React builds
- React framework
- Vitest browser mode (same test suites in component testing AND browser)
- Hot reload for fast iteration

**Added as product in:** First UI feature project

### Phase 4: Pear Compatible
**For:** P2P development with Pear platform
**Needs:**
- Pear dev tooling integration
- P2P testing patterns
- Bare + Pear workflow
- Device simulation/testing

**Added as product in:** First P2P feature project

---

## What AI Needs from Dev Environment

**1. Fast Feedback Loop**
- Tests run quickly (<5s)
- Immediate pass/fail visibility
- Clear error messages
- No waiting for compilation

**2. Type Safety via AVRO**
- Small code blocks between AVRO-managed schema boundaries
- AVRO validates composition at pipeline level
- No TypeScript needed (code blocks are small)
- Schema enforcement ensures correctness

**3. Testing for Confidence**
- TDD workflow: write test → fail → pass
- Quick test execution
- AVRO schema validation in tests
- Browser testing with same test suites (UI)

**4. Continuity Across Sessions**
- Clear project structure to navigate
- Consistent patterns
- Separation of concerns
- Documented choices become foundation principles

**5. Minimal Friction**
- Simple setup
- No unnecessary tooling
- Fast iteration
- Focus on requirements, not code quality for its own sake

---

## What AI Does NOT Need

- TypeScript (AVRO provides type safety)
- Code formatting/linting (unless catches actual errors)
- Pre-commit hooks (AI is sole developer)
- Documentation for human developers
- Contribution guidelines
- CI/CD (human sets reporting requirements)
- Complex build optimization

---

## Success Criteria

**Phase 1 (Minimal Node):**
1. ✅ JavaScript + Vitest working
2. ✅ Tests run in <5s
3. ✅ AVRO schema validation integrated
4. ✅ TDD workflow smooth

**Phase 2 (Minimal Bare):**
1. ✅ Can develop in Node.js, deploy to Bare
2. ✅ Tests validate Bare compatibility
3. ✅ Clear workflow documented

**Phase 3 (UI Extended):**
1. ✅ Vite builds React apps
2. ✅ Same test suites run as component tests AND in browser
3. ✅ Hot reload working
4. ✅ Fast iteration cycle

**Phase 4 (Pear Compatible):**
1. ✅ P2P development workflow working
2. ✅ Pear tooling integrated
3. ✅ Can test P2P features locally

---

## Implementation Strategy

**NOT a standalone project** - this backlog item is reference/overview only.

**Implementation:**
Each phase is added as a product to the project that first needs it:
- E-001 includes "Phase 1: Minimal Node Setup" as a product
- Bare exploration includes "Phase 2: Bare Compatibility" as a product
- First UI project includes "Phase 3: UI Dev Setup" as a product
- First P2P project includes "Phase 4: Pear Integration" as a product

**Choices become principles:**
Dev environment decisions get documented in foundations as methodology evolves. Continuity for AI across sessions.

---

## Open Questions

**Phase 1:**
- What test patterns work best for state-backed APIs?
- How to test DSL engine composition?
- Project structure for clear navigation?

**Phase 2:**
- Can Vitest run tests against Bare?
- What abstraction layer needed between Node.js and Bare?
- Performance differences?

**Phase 3:**
- Vitest browser mode configuration?
- How to share test suites between component and browser?
- Hot reload with state-backed components?

**Phase 4:**
- Pear dev tooling capabilities?
- How to test P2P locally (device simulation)?
- Integration with Bare workflow?

---

## Links to Detail Files

- Technology validation: `projects/02-initial-workplan/Technology_validation_v1.0.0.md`
- Bare platform: `projects/02-initial-workplan/Pear_platform_v1.0.0.md`

---

## Notes

This is a living reference document. As each phase is implemented, findings and patterns get documented here and in foundations. Dev environment evolves based on what AI actually needs for productive work, not what human developers traditionally use.
