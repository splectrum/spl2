Requirements: ../project-types/Explorative_project_requirements_v1.0.0.md

# Lessons Learned: Runtime Structure "Hello World"

**Project:** 03-runtime-hello-world
**Type:** Explorative Project
**Date:** 2025-11-12
**Status:** Project Closure

---

## Executive Summary

Project 03 validated SPL2's core runtime execution model while establishing foundational patterns for API development. Key achievements: proven single-parameter method signature with hierarchical context, platform abstraction pattern enabling Bare compatibility, and discovery that glossary management is critical infrastructure rather than future enhancement.

Critical architectural decisions: reconstruction-over-archiving approach (requiring bug report infrastructure), MVP + End Vision pattern for balancing pragmatism with architectural integrity, and Local Rules Apply principle proven more general than initially recognized (fundamental TDC principle for ALL artifacts).

---

## Methodology & Process Lessons

### L01: Collaborative Mode Essential for Explorative Projects

**Lesson:** Critical architectural work requires human + AI collaboration throughout - too important to run autonomously.

**Context:** Project 03 validates core SPL2 architecture. Everything downstream depends on these decisions.

**Evidence:**
- Planning phase benefited from human architectural intuition + AI implementation knowledge
- Architectural decisions discussed before committing (API structure, method signatures, platform abstraction)
- Regular check-ins prevented dead ends and caught over-engineering early

**Application:** Future explorative projects should explicitly use collaborative mode. Template-based projects with established patterns can be more autonomous.

**Related:** Explorative_project_requirements_v1.0.0.md already documents this pattern.

---

### L02: PRINCE2 Discipline - Plan First, Execute Second

**Lesson:** Starting implementation before planning is complete leads to rework and missed considerations.

**Context:** Initially started Node.js initialization before PROJECT_BRIEF was complete.

**Evidence:**
- Caught myself beginning execution before all products defined
- Stopped, completed PROJECT_BRIEF with all twin pairs
- Subsequent execution smoother with clear roadmap

**Application:** Discipline matters even in explorative projects. Complete project brief before execution, even if brief evolves during exploration.

**Impact:** Reinforces PRINCE2 methodology already established.

---

### L03: Local Rules Apply - More General Than Initially Recognized

**Lesson:** "Local Rules Apply" is not project-specific - it's a fundamental TDC principle applying to ALL artifact creation.

**Context:** Initially documented as project-level principle, realized during Project 03 it applies universally.

**Evidence:**
- Artifact-to-requirements pinning works for ANY artifact (code files, documentation, APIs, projects)
- Same pattern: reference requirement version, satisfy those requirements, remain valid when requirements evolve
- Freedom to evolve applies broadly: code artifacts, documentation, project structures, methodologies

**Application:**
- ALL artifacts should reference their requirements (first line)
- Quality assessment based on referenced requirements, not current ones
- No retroactive compliance burden when requirements improve

**Impact:** Fundamental TDC principle requiring emphasis in foundations. Not just nice-to-have, architecturally critical.

---

### L04: Minimal and Complete - Emphasis on "Minimal"

**Lesson:** Ongoing tendency to over-specify toward "complete" rather than start truly minimal and validate through use.

**Context:** Risk R05 from Project 02 continues to manifest in new forms.

**Evidence:**
- Over-specified requirements: Created R1-R8 detailed requirements when simple one-pager sufficient
- Successfully practiced minimal: Deferred Vitest when validation scripts proved adequate
- Pattern: Initial impulse toward comprehensive specification, caught and corrected

**Working Approach:** Ask "Am I comfortable with the way I am working to achieve my goal - minimal and complete?" If no, propose evidence-based change.

**Application:**
- Question every addition: needed NOW or nice-to-have?
- Start truly minimal, add only when evidence shows need
- Catch over-engineering impulses early

**Impact:** Ongoing vigilance required. Update Philosophy to emphasize "minimal" over premature "complete."

---

### L05: MVP + End Vision Pattern

**Lesson:** Build practical MVP satisfying current needs while capturing architectural end vision to prevent dead ends and inform design. Migrate when capacity/evidence exists.

**Context:** Recurring pattern discovered across multiple architectural decisions in Project 03.

**Examples:**
- **Artifact identification:** Requirement references (MVP) → GUIDs (end vision when infrastructure exists)
- **API structure:** Three-layer flat (MVP) → N-tier hierarchy with sub-APIs (end vision)
- **Module resolution:** Single path (MVP) → App overlay pattern (end vision)

**Benefits:**
- Delivers working solution now (pragmatic)
- Captures architectural direction (prevents painting into corners)
- Defers complexity until capacity/evidence supports it (evidence-based)
- Allows informed decision making (vision informs MVP design)

**Application:**
- When architectural decision has simple and sophisticated options, build simple MVP first
- Document end vision explicitly (CIP, design document, architecture notes)
- Design MVP so it doesn't prevent future migration
- Migrate when capacity (infrastructure, automation) and evidence (pain points, use cases) align

**Pattern Fit:** Aligns with minimal and complete, evidence-based evolution, and local rules apply principles.

**Impact:** Add to WOW as valuable working methodology pattern.

---

### L06: Embryonic → Transitional → Mature Pattern

**Lesson:** Systems evolve through stages - embryonic (exploration), transitional (proven pattern extraction), mature (full diversification). Match structure to maturity level.

**Context:** Repo management strategy discussion revealed evolution pattern with broad applicability.

**Stages:**
1. **Embryonic:** Single repo, fast iteration, cross-pollination, collaborative development space
2. **Transitional:** Extract proven APIs/components, establish boundaries, maintain some shared infrastructure
3. **Mature:** Full diversification (one repo per API), templates + automation, independent management

**Examples:**
- **Project 03 APIs:** All in runtime-poc (embryonic) → Extract spl/runtime and spl/execution (transitional) → Each API own repo (mature)
- **Glossary:** Manual management (embryonic) → Semi-automated tooling (transitional) → Full automation with validation (mature)

**Anti-Pattern:** Jumping to mature structure prematurely adds complexity without benefit.

**Application:**
- Recognize current maturity stage
- Resist premature sophistication
- Transition when evidence shows structure insufficient
- Prove patterns at each stage before advancing

**Impact:** Add to WOW as evolution guidance pattern.

---

### L07: Twin Pair Methodology - Maturity Insight

**Lesson:** Not yet mature enough to define twin pairs clearly upfront. Need flexibility to modify during execution as discovery reveals what's actually needed.

**Context:** Project 03 twin pair structure evolved during work. Project 02 skipped twin pairs 2 & 4 based on discovery.

**Evidence:**
- Initially planned 4 twin pairs, structure held but understanding evolved
- Twin Pair 2-3 merged conceptually (API design + runtime both documented before implementation)
- Explorative methodology working as intended (adjust based on evidence)

**Application:**
- Define twin pairs as working hypothesis, not rigid plan
- Modify during execution when discovery shows need
- Skip twin pairs if unnecessary (Project 02 pattern)
- Flexibility is feature, not bug

**Related:** Explorative project methodology already accommodates this (adaptive approach).

---

### L08: Evidence-Based Decision Making Over Speculation

**Lesson:** When uncertain between approaches, implement both in different contexts and compare based on real-world evidence rather than speculative analysis.

**Context:** Import resolution - two viable approaches (package aliases vs importModule function).

**Approach:**
- runtime-poc: Package aliases (build-time resolution)
- Bare project: importModule function (runtime resolution)
- Compare both in actual use
- Decide standardization based on evidence

**Benefits:**
- Real-world data over theoretical analysis
- Practical pain points revealed through use
- Informed decision after trying both approaches
- No premature standardization

**Application:** When facing architectural choice with reasonable alternatives and capacity to explore both, defer standardization until evidence guides decision.

**Pattern:** Explorative methodology in action.

---

## Architectural & Design Lessons

### L09: Glossary is Foundational Infrastructure, Not Future Enhancement

**Lesson:** Consistent vocabulary is critical from day one - establishing glossary NOW prevents expensive renaming/migration later.

**Context:** Realized during API naming discussion that glossary isn't nice-to-have, it's architectural foundation.

**Why Critical:**
1. **Semantic consistency:** Same concept = same name + same schema everywhere (e.g., "dir" always means directory path)
2. **Compositional reasoning:** AI/humans understand `tools/git/add` from vocabulary alone
3. **Partial requirements generation:** Package + API + method names with glossary definitions = baseline requirement automatically
4. **Type safety foundation:** Glossary defines canonical schemas for composition validation
5. **Day one impact:** Late glossary means expensive renaming across APIs, docs, tests, schemas

**Two Separate Glossaries Needed:**
1. **Catch phrase glossary:** Methodology and principles concepts (foundations/methodology vocabulary)
2. **API vocabulary glossary:** Technical terms used in API development (packages, APIs, methods, properties, value types)

**MVP Approach:**
- Manual glossary management in Project 03 (prove pattern)
- 4-column structure: Term, Type, Description, Requirement
- Deferred columns: Schema reference, Examples (add based on evidence)
- Document entries as APIs/methods/properties created

**Future:** High-priority tooling for validation, enforcement, schema integration, requirement generation.

**Impact:** Create GLOSSARY_vocabulary_v1.0.0.md and CIP-007 for tooling. Create catch phrase GLOSSARY.md for foundations.

---

### L10: Platform Abstraction from Start Enables Portability

**Lesson:** Methods must be platform-agnostic (pure) from the beginning - auxiliary libraries handle all platform-specific code.

**Context:** Preparing for Bare compatibility exploration, refactored all methods to zero platform imports.

**Pattern:**
- Methods are pure: only import from SPL auxiliary libraries
- Never import directly from platform (node:crypto, Date, etc.)
- Auxiliary libraries (`spl/_utils`) handle platform detection and abstraction
- Platform-specific imports conditional at module load (top-level await)

**Benefits:**
- Easy platform porting (Node → Bare)
- Clear surface area for platform dependencies
- Methods unchanged when adding platform support
- Automatic platform switching via auxiliary libraries

**Implementation (Project 03):**
- Created `spl/_utils` with: `generateUUID()`, `getCurrentTimestamp()`, `getPlatformVersion()`, `getPlatformName()`
- All methods refactored to use utils, not platform APIs directly
- Platform detection automatic

**Application:** Establish platform abstraction pattern early. All production methods should be platform-agnostic from creation.

**Impact:** Add to API_DESIGN.md as implementation pattern. Proven from spl1, validated in spl2.

---

### L11: Artifact Identification - Pragmatic Evolution Path

**Lesson:** Use simple approach (requirement references) now, upgrade to sophisticated approach (GUIDs) when infrastructure exists to support it.

**Context:** External-facing artifacts need traceability for bug reproduction.

**Options:**
- **Requirement references (MVP):** Simple header `// Requirements: requirement_file_v1.0.0.md`
  - Minimal overhead, manageable manually
  - Traces to requirements
  - Changes when requirements evolve (even if code unchanged)

- **GUIDs (End Vision):** Unique identifier per artifact
  - Stable across requirement evolution
  - Resolves to: requirements + version + hash + metadata
  - Perfect for exact code footprint extraction
  - Requires: GUID generation, resolution mechanism, registry
  - Premature without automation infrastructure

**Decision:** Requirement references for Project 03, GUIDs when execution tracking and bug extraction infrastructure exists.

**Rationale:** GUID architecturally superior for bug reproduction use case, but implementation premature. Requirement references satisfy current needs with minimal overhead.

**Application:** MVP + End Vision pattern in action. Use simple, upgrade when capacity exists.

**Impact:** CIP-005 captures GUID vision for future implementation.

---

### L12: API as Elementary Building Block - Three-Layer MVP

**Lesson:** APIs are smallest standalone deployable units. Three-layer hierarchy `[package]/[api]/[method]` proven and sufficient for MVP.

**Context:** Defining API architecture for SPL2, evaluating spl1 patterns.

**API Characteristics:**
- Groups methods with single concern
- Defines argument namespace (same concept = same name across methods)
- API-level arguments persist for invocation context
- State backing: state persists for pipeline duration

**MVP Structure:** Three layers (proven from spl1)
- `[package]/[api]/[method]` - simple, predictable depth
- State backing at API level (methods share API state)
- Single-layer API (no sub-APIs)
- Clear, concrete, sufficient for validation

**End Vision (Deferred):**
- **N-tier organizational hierarchy:** Flexible depth above API (`[domain]/[subdomain]/.../[api]/[method]`)
- **Hierarchical APIs:** APIs can contain sub-APIs with state scoping (child sees parent state, siblings isolated)
- Implement when complexity justifies it (evidence-based)

**Application:** Use three-layer MVP for current development. N-tier and hierarchical APIs when system scale demands it.

**Impact:** CIP-006 captures end vision. API_DESIGN.md documents MVP thoroughly.

---

### L13: Single Parameter Method Signature - Ultimate Simplicity

**Lesson:** Single unified context parameter provides ultimate simplicity, uniform interface, and infinite extensibility without signature changes.

**Context:** Method signature design evolved from three parameters to one during discussion.

**Evolution:** Started with `method(apiState, inputBag, context)`, refined to `method(context)`.

**Context Structure:**
```javascript
context = {
  apiState: { get(path), set(path, value), getKey(), setKey(key), getValue(), setValue(data) },
  args: { get(key) },
  runtime: { get(path) },    // read-only
  execution: { get(path) }    // read-only
  // Future: data, security, logging - infinitely extensible
}
```

**Access Rules (Critical):**
- **Own API state:** Full read/write via context.apiState getter/setter
- **Parent contexts:** Read-only via context.runtime / context.execution getters
- **Arguments:** Read-only via context.args getter
- **Data layer:** Through dedicated API (future) for persistence abstraction

**Benefits:**
- Ultimate simplicity - one parameter to pass
- Uniform interface - everything accessed via get/set pattern
- Infinitely extensible - add context.data, context.security without signature changes
- Consistent semantics - clear read/write vs read-only boundaries
- Clean for DSL generation - predictable access patterns

**Application:** All SPL2 methods use single parameter signature. Standard across platform.

**Impact:** Add to API_DESIGN.md with comprehensive detail.

---

### L14: Hierarchical Kafka Records - Native Structure

**Lesson:** Use full hierarchical structure (nested objects) for Kafka records, not flat with dotted keys. Dot notation for navigation convenience.

**Context:** Designing state structure for API state backing.

**Structure:**
- Headers stored as nested objects: `{ spl: { runtime: { version: "0.1.0" } } }`
- Dot notation navigation: `get('spl.runtime.version')` returns `"0.1.0"`
- Subtree access: `get('spl.runtime')` returns `{ version: "0.1.0", nodeVersion: "..." }`

**Benefits:**
- AVRO/Kafka compatible (nested schemas supported)
- Can transform to flat if needed, but hierarchy is native format
- Generic hierarchical getter/setter works on any nested structure
- Filters by returning subtrees
- Minimal overhead (function wrappers around record manipulation)

**Application:** All Kafka records use hierarchical structure. Generic accessor pattern reusable across contexts.

**Impact:** Add to API_DESIGN.md as method execution model detail.

---

### L15: Reconstruction Over Archiving - Simplicity with Bug Report Requirement

**Lesson:** Don't archive changes during execution - keep only what's needed for output. On failure, extract complete footprint for reconstruction. Requires bug report infrastructure.

**Context:** Discussed whether to log all intermediate states during execution.

**Approach:**
- **During execution:** Only keep what's needed for output (no history tracking)
- **On failure:** Extract complete footprint (code + input + data + config) for reconstruction
- **Reconstruction:** Replay request from scratch to see all intermediate states

**Benefits:**
- Simple, fast execution (no archiving overhead)
- Complete debugging when needed (exact reproduction)
- Clear boundaries (what to keep vs reconstruct)

**Requirement:** Bug report infrastructure must capture:
- Exact code footprint (all artifact versions/GUIDs that executed)
- Complete input (all arguments, previous output)
- Full state (runtime/execution/API records at failure point)
- Environment (Node version, system info)
- Error details (stack trace, error message)

**Impact:** Critical gap identified. Bug report infrastructure high-priority backlog item (foundational, not optional).

---

### L16: Tests as Requirements - Wholesome, Standalone, Complete

**Lesson:** Tests stored alongside code in API package structure makes APIs self-contained, standalone units.

**Context:** Defining complete API package structure.

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

**Application:** Standard API package structure. All APIs follow this pattern.

**Impact:** Already captured in API_DESIGN.md. Proven pattern from spl1.

---

## Technical Implementation Lessons

### L17: Incremental Validation Strategy - Build Complexity Progressively

**Lesson:** Prove execution model works through progressive complexity - validate at each step before adding next layer.

**Context:** Three-step implementation strategy for hello world.

**Steps:**
1. **Runtime context only:** Standalone `spl/runtime/run`, validate runtime structure works
2. **Runtime + execution context:** Add `spl/execution/init`, prove two-layer stack
3. **Runtime + execution + hello world:** Add `pr03/hello/greet`, validate complete stack with cross-API flow

**Benefits:**
- Minimal and complete in action
- Early detection of issues (isolated layer testing)
- Confidence building (each step proves next layer possible)
- Clear validation points

**Application:** When building complex systems, decompose into incremental validation steps rather than big-bang integration.

**Pattern:** Standard practice, reinforced through execution.

---

### L18: Immutable Deployment Philosophy - Build from Scratch

**Lesson:** Build from scratch, validate, teardown - no incremental updates. Validation scripts prove environment ready. Accept trade-offs.

**Context:** Twin Pair 1 deployment scripts.

**Approach:**
- **Build:** Check Node.js version >= 18, install dependencies (npm install), output logging
- **Teardown:** Remove node_modules/ and package-lock.json, document full removal
- **Validate:** Check Node.js version, file structure, package.json validity, module system

**Discovered Trade-off:**
- Teardown script can't delete its own directory (running from inside runtime-poc/)
- Solution: Remove artifacts created, document full removal command
- Acceptable limitation: Good enough for requirements, simple implementation

**Benefits:**
- Reproducible (always start from known state)
- Validation proves deployment worked
- Simple, clear, effective
- CLI-callable scripts (no test framework dependency)

**Application:** Immutable deployment pattern for all SPL2 deployments. Template created (DEPLOYMENT_TEMPLATE.md).

---

### L19: Folder Structure Conventions - Clear Separation

**Lesson:** Use `_` prefix for auxiliary folders (not in method path), requirements at all levels (package/API/method), create structure as needed (minimal approach).

**Context:** Organizing code within `[package]/[api]/[method]` hierarchy.

**Conventions:**
- **`_` prefix for auxiliary folders:** `_schemas/`, `_tests/`, `_help/`, `_lib/`
  - Clear separation: path items are invokable, `_` folders are resources
  - Not in method path

- **camelCase for multi-word names:** Avoid `_` ambiguity (already used for `/` replacement in scripting)
  - AI-friendly for DSL generation
  - JavaScript standard
  - Project 03: Kept single words (simplicity)

- **Requirements at all levels:** package/, api/, method/
  - Single concern - each level has focused requirements
  - Associated test suites at same level
  - File: `requirements_v1.0.0.md` (same folder)
  - Code reference: `// Requirements: requirements_v1.0.0.md`

- **Create auxiliary folders as needed:** Minimal approach, add structure when required

**Application:** Standard folder structure pattern. All APIs follow these conventions.

**Impact:** Add to API_DESIGN.md with comprehensive detail.

---

### L20: Naming Philosophy - Full Names, Self-Documenting

**Lesson:** Use full names over abbreviations. Self-documenting code emphasizes design over brevity.

**Context:** API and method naming decisions.

**Examples:**
- `runtime` not `rtctx` (runtime context)
- `execution` not `exctx` (execution context)
- `invoke` not `next` (clearer, more accurate)

**Rationale:**
- Self-documenting
- Clear to readers (humans and AI)
- Emphasizes design over brevity
- Glossary ensures consistency across APIs

**Application:** Naming standard for all SPL2 APIs and methods. Glossary captures vocabulary with definitions.

**Impact:** Add to API_DESIGN.md. Reinforces glossary importance.

---

### L21: Production Code Logging - Silent Unless Error

**Lesson:** Only log what could lead to runtime action. Reconstruction capability means verbose execution logging unnecessary.

**Context:** Determining logging strategy for production methods.

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

**Rationale:** Minimal and complete - state captured in records for reconstruction, only log actionable information.

**Application:** Logging standard for SPL2 production code. Evaluation scripts separate concern.

**Impact:** Add to API_DESIGN.md as implementation guidance.

---

### L22: Module Resolution - Convention-Based Dynamic Loading

**Lesson:** Simple module resolver based on convention enables dynamic method loading. App overlay pattern deferred (proven valuable but not needed for MVP).

**Context:** execution/invoke needs to dynamically load and call methods by path.

**SPL2 Module Resolver (MVP):**
- Convention-based: `modulePath` → `{modulesBasePath}/{package}/{api}/{method}/index.js`
- Example: "spl/runtime/run" → "{basePath}/spl/runtime/run/index.js"
- Dynamic ES module import with path validation
- Returns resolution metadata (path, module, error)
- `invokeMethod(methodPath, context, modulesBasePath)` - resolve and invoke in one call

**modulesBasePath Bootstrap:**
- Passed at initialization (can't rely on runtime context - chicken/egg problem)
- Evaluation scripts construct basePath from their location
- Execution context receives basePath at creation

**MVP Scope:** Single resolution path (global modules folder only)

**App Overlay Pattern (Deferred to CIP-008):**
From spl1 - valuable pattern for future:
- Resolution order: Try `apps/{app}/modules/` first, then global `modules/`
- Purpose: Work on modules in app context without touching global install
- Benefits: Safe experimentation, selective override for debugging, development workflow support

**Application:** Module resolution implemented in `spl/execution`. App overlay when development workflow demands it.

**Impact:** CIP-008 captures app overlay pattern for future implementation.

---

## Risk Management & Gap Identification

### L23: Bug Report Infrastructure - Critical Gap Identified

**Lesson:** Reconstruction-based architecture requires automated bug report generation with complete footprint. Not optional - foundational requirement.

**Context:** Architecture relies on reconstruction rather than archiving during execution.

**Bug Report Must Capture:**
- Exact code footprint (all artifact versions/GUIDs that executed)
- Complete input (all arguments, previous output)
- Full state (runtime/execution/API records at failure point)
- Environment (Node version, system info)
- Error details (stack trace, error message)
- Enables: Exact reproduction of failure scenario

**Why Critical:**
- Without this, reconstruction approach doesn't work
- Enables debugging via replay instead of log mining
- Required before production use

**Impact:** High-priority explorative project for backlog. Bug Report Infrastructure implementation.

---

### L24: Glossary Tooling - High Priority Infrastructure

**Lesson:** Manual glossary management proves pattern, but automation needed for validation, enforcement, schema integration, requirement generation.

**Context:** Manual glossary created in Project 03, captured pain points and tooling requirements.

**Tooling Requirements:**
- Validate glossary compliance during development
- Enforce vocabulary rules (prevent non-glossary terms)
- Auto-link to AVRO schemas
- Generate baseline requirements from method signatures
- Integration with IDE/linting

**MVP Approach (Project 03):**
- Prove manual pattern first
- Capture pain points during manual use
- Assess deferred columns (schema refs, examples) based on experience
- Build tooling when manual maintenance becomes burden

**Impact:** High-priority CIP-007 for glossary tooling. Affects all future API development.

---

### L25: Import Resolution Experiment - Two Approaches to Compare

**Lesson:** Two viable import resolution approaches (package aliases vs importModule function). Implement both, compare based on evidence.

**Context:** Methods importing auxiliary libraries with relative paths ugly and fragile.

**Approach 1: Package aliases (runtime-poc):**
- Build script creates package directories in `node_modules/`
- Clean imports: `import { generateUUID } from 'spl_utils'`
- Overhead: Build step, package files to maintain
- Benefit: Clean readable imports

**Approach 2: Dynamic importModule function (proposed for Bare project):**
- Auxiliary function: `importModule(modulePath)` resolves and imports
- Usage: `const { generateUUID } = await importModule('spl/_utils')`
- Zero overhead: No build step, no extra files
- Centralized resolution logic

**Decision:** Implement both in different contexts, compare, standardize based on evidence.

**Impact:** Backlog Project Addon for Bare Runtime Hello World project - Import Resolution Experiment.

---

## Cross-Cutting Themes

### L26: Over-Engineering Awareness - Ongoing Vigilance Required

**Lesson:** Risk R05 (over-engineering tendency) continues from Project 02 in new forms. Successfully caught and corrected multiple times, but requires ongoing vigilance.

**Manifestations in Project 03:**
- Over-specified requirements (R1-R8 instead of one-pager)
- Vitest planned upfront (deferred when validation scripts sufficient)
- Impulse toward comprehensive specification before evidence

**Successful Corrections:**
- Replaced detailed requirements with minimal one-pager
- Deferred test framework when simpler solution adequate
- Asked "Am I comfortable working minimal and complete?" before proceeding

**Pattern:** Initial impulse toward comprehensiveness, caught through conscious checking.

**Application:**
- Maintain awareness of tendency
- Question additions actively
- Use "minimal and complete" check before decisions
- Philosophy update to emphasize "minimal" over premature "complete"

**Impact:** Risk management ongoing. Update Philosophy v1.2.0 with concrete guidance from Project 03 experience.

---

### L27: Documentation as Foundation - Living Architecture Reference

**Lesson:** Comprehensive design documents capturing MVP and end vision together become foundational references guiding all future development.

**Context:** API_DESIGN.md created during Project 03.

**Content:**
- API as elementary building block (definition, characteristics)
- Three-layer MVP structure
- Method execution model (single parameter, context structure, access rules)
- State backing architecture
- Platform abstraction pattern
- CLI-callable methods
- Artifact identification
- MVP vs End Vision roadmap

**Benefits:**
- Central reference for API architecture
- Foundation for all API development
- Captures decisions with rationale
- Guides implementation work
- Living document (evolves with evidence)

**Application:** Create comprehensive design documents for foundational architecture. Reference from foundations for discoverability.

**Impact:** Add API_DESIGN.md reference to appropriate foundation docs. Pattern for future architectural documentation.

---

### L28: spl1 Patterns Validation - Proven Approaches

**Lesson:** Many spl1 patterns proven valuable - adopt them while refining. Clean restart but informed by experience.

**Proven Patterns Adopted:**
- CLI invocation with `@@` chaining
- Help system at all levels (package/api/method)
- Platform abstraction (pure methods, auxiliary libraries)
- App overlay pattern (deferred but captured)
- Three-layer API hierarchy
- Module resolution (convention-based)

**Benefits:**
- Leverage proven solutions (no reinvention)
- Validate patterns through new implementation
- Refine where improvement opportunities exist
- Confidence from prior success

**Application:** Reference spl1 for proven patterns, but evaluate each for spl2 fit. Adopt, adapt, or replace based on evidence.

**Impact:** Reinforces value of prior work while enabling fresh perspective.

---

## Recommendations for Future Projects

### For Foundations Update:

1. **Emphasize "Local Rules Apply" generality** - fundamental TDC principle for ALL artifacts, not just projects
2. **Add "MVP + End Vision" pattern to WOW** - valuable working methodology
3. **Add "Embryonic → Transitional → Mature" evolution pattern to WOW** - guides system evolution
4. **Update Philosophy v1.2.0** - emphasize "minimal" over premature "complete" with Project 03 examples
5. **Reference API_DESIGN.md** in appropriate foundation docs for discoverability
6. **Create catch phrase GLOSSARY.md** for foundations/methodology concepts

### For API Development:

7. **Add to API_DESIGN.md:** Folder structure details, naming conventions, method execution model, logging strategy, platform abstraction pattern
8. **Create GLOSSARY_vocabulary_v1.0.0.md** with manual entries from Project 03
9. **Create Repo_Design_v1.0.0.md** documenting repository evolution strategy

### For Backlog:

10. **Bug Report Infrastructure** - explorative project (high priority, foundational)
11. **Import Resolution Experiment** - Project Addon for Bare Runtime Hello World project

### For CIP Register:

12. **CIP-005:** GUID-Based Artifact Identification System (deferred until execution tracking infrastructure exists)
13. **CIP-006:** N-Tier API Hierarchy with Hierarchical State Scoping (deferred until system scale demands it)
14. **CIP-007:** Glossary Management Tooling (high priority, affects all API development)
15. **CIP-008:** App Overlay Pattern for Module Resolution (deferred until development workflow demands it)

---

## Conclusion

Project 03 successfully validated SPL2's core runtime execution model while discovering critical patterns and infrastructure needs. The single-parameter method signature with hierarchical context, platform abstraction pattern, and reconstruction-over-archiving approach form a solid architectural foundation.

Key insights: glossary management is critical from day one, bug report infrastructure is foundational (not optional), and Local Rules Apply principle is more general than initially recognized (fundamental to all artifact creation).

The MVP + End Vision and Embryonic → Mature patterns provide valuable methodology for balancing pragmatism with architectural integrity. Ongoing vigilance required for over-engineering tendency (Risk R05), but successfully managed through conscious checking.

Foundations established. Runtime proven. Ready for downstream work.

---

**Project Status:** Complete
**Architecture Status:** Validated
**Next Steps:** Update foundations, create documentation artifacts, proceed with Bare Runtime Hello World (Project 04)
