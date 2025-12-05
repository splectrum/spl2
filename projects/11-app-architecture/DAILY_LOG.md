# Daily Log

## 2025-11-30

### Project Created

Project 11 initiated from backlog item "Dev Env Pipeline Completion", incorporating the repo/node/app architecture design from post-Project 10 discussions.

**Design references:**
- Repo/Node/App Design (chats/immutables/)
- App Unification Discussion (chats/immutables/)

**Key vision:**
- Node as seat serving repo
- Spot apps (name = spot folder)
- System apps (underscore prefix)
- Location-aware routing
- Freestyle + formal in same app

**Products defined:**
1. App Architecture Core
2. _cli (evolved from cli-static)
3. _dev (dev bundle as app)
4. _ops (ops sidecar as app)
5. projects spot app
6. Single node consolidation

### Project Plan Discussion

**Backlog and CIP consolidation first:**
- App architecture vision changes things significantly
- Some backlog items may be redundant, need updating, or misaligned
- CIP register also needs review - recent work may have addressed items
- Combined cleanup gives complete picture of outstanding work
- Clean slate before diving into implementation

**_boot deferred:**
- Node install from scratch is not a priority
- Working node exists - copy and amend is sufficient
- May carry over to future project

**Dropped _cli, _dev, _ops:**
- App thinking hasn't crystallized into practical node-wide plan
- Need to solve app lifecycle first (install, start, manage)
- These migrations come later once lifecycle is understood

**Splectrum node cleanup added at #2:**
- We're already working in one node de facto
- Ops sidecar folder still exists - needs cleanup
- Mothball functionality from ops/dev bundle not yet in splectrum node
- Clean foundation before building app architecture

**Final work item order:**
1. Backlog and CIP Consolidation
2. Splectrum node cleanup
3. App-based design and implementation experience (core product)
4. Elevator pitch for Pear/Bare
5. Splectrum node install (may emerge from item 3)

Dropped: _cli, _dev, _ops, projects spot app - will emerge from experience work.

**Elevator pitch added (item 4):**
- Audience: Pear/Bare builders looking to support ecosystem projects
- Angle: Researcher, not businessman
- Focus: AI collaboration and autonomy in decentralized setting
- Open source (MIT), happy to be "researcher" in any initiative
- Fellow builder contribution, not business pitch

### Experience Product Discussion

**Main product clarified:** App-based streamlined design and implementation experience

**The fixtures we have:**
- Req design with selfevals (specification and validation)
- Work module (packaging work)
- Formal implementation (module structure, hierarchy)
- Free scripting (fast iteration, exploration)
- Unified execution pathways (same interface for command/library/inline)
- Self-contained app (boundary and structure)
- Mycelium web pattern (self-similar at every level)

**Not orchestration - pattern driven:**
- No central conductor coordinating pieces
- Things happen as consequence of data patterns
- A data change creates a key that unlocks a door
- Local rules apply in layered contexts

**Mycelium web flow:**
- Links entrypoints, never directly to internals
- Flow: entrypoint → context internal → other context entrypoint
- Each context is self-contained domain with own local rules
- Always through doors, never through walls

**The full architecture:**
```
Explore in scripts (the sea)
        ↓
Functional patterns emerge
        ↓
Crystallize into APIs (islands)
        ↓
As consequence → data structures crystallize
(where 'local rules apply' can be expressed)
        ↓
DSL vocabulary connects islands into continent
(common understanding, not separate islands)
```

**Key relationships:**
- Data patterns are keys that unlock doors
- APIs are functional constructs that sit on patterns
- Free scripting is the flux zone between formal constructs
- DSL glossary is common language binding it all
- Data structures emerge FROM APIs crystallizing (not separate)

**The experience:**
- Explore in scripts (flux)
- Functional patterns emerge
- Crystallize into APIs
- Data structures follow as consequence
- DSL vocabulary connects into coherent whole

---

## 2025-12-01

### Backlog Cleanup

Removed 8 items from backlog:
- Dev Environment API (addressed in Project 10)
- CIP Processing (now Project 11 work item 1)
- Kafka Compatible Records, AVRO Schema and RPC, API State Management, DSL Engine Foundation (superseded by experience-driven approach)
- Development Environment Setup (reference doc, products distributed)
- spl/bug v2 (redundant)

Cleaned stale dependencies throughout.

### Observations on Remaining Items

**API Design Documentation:**
- Bottom-up approach: info goes into correct reqs first
- Mycelium web connects them
- Higher-level overview distills out from connected reqs
- Not top-down documentation

**ITIL Introduction:**
- Continuation of experience work from this project
- Current project reveals what higher-level structures need to look like
- Approach becomes clear after Project 11 completes
- Don't plan in isolation - emerges from the work

*Review at project closure.*

### CIP Cleanup

Removed 8 CIPs:
- CIP-000 (Document CIP Register) - will redefine CIPs from current work
- CIP-001 (Product Register) - superseded, too bureaucratic
- CIP-004 (AI Tooling Platform) - being blended in seamlessly
- CIP-006 (N-Tier API Hierarchy) - will be done organically
- CIP-007 (Glossary Tooling) - will be done organically
- CIP-008 (App Overlay Pattern) - done/absorbed
- CIP-013 (Design Spot Setup) - done/absorbed
- CIP-015 (Cross-Cutting Layers) - done/absorbed

8 CIPs remain: 002, 003, 005, 009-012, 014

### Splectrum Node Cleanup

**Removed:**
- ops/ sidecar folder (ops functionality will come through app management/routing)
- lib/overlay.js broken symlink
- modules/bm_spl symlink → direct folder
- modules/versions/ folder (old bundle manager pattern)

**Discovered issue - Overlay not wired into execution:**
- Overlay infrastructure exists (createOverlay, loadOverlay, hierarchy.json)
- Currently only used for selfeval collection in spl/dev/test
- NOT used for module/lib resolution during execution
- requireSpl() bypasses overlay - hardcoded to modules/bm_spl/

**Fix required (add to project work):**
- Overlay for app should be active for code running within app AND within app's session
- Original intent: sandwich node modules between app modules
- Got disconnected during overlay work

### Documentation Setup - Req Versioning Decision

**Context:** Node structural items need requirement docs. Where do they live and how are they versioned?

**Decision - Transitionary Approach:**

| Location | Contains | Purpose |
|----------|----------|---------|
| Splectrum node `_reqs/` | Latest version | Self-contained, current truth |
| DSL_GLOSSARY | Reference to node's latest | Index/lookup |
| Active project | Previous version (if changed) | History/traceability |

**Rationale:**
- Node is self-contained (has its own docs)
- Glossary stays simple (always points to current)
- Projects capture when/why changes happened
- No version clutter in node

**Why transitionary:**
- Current: splectrum node in repo is the "master" (single working node)
- Future: distributable install packages (node, module, app packages)
- Then: splectrum root becomes just one instance, not the master

**Future approach (distributable packages):**
- Reqs created in usual way: immutables within immutable repo container
- Packages are frozen artifacts with frozen docs
- Node is where we work; packages are what we ship

### Node Documentation Created

**Root level:**
- README.json (mycelium web - spiders to children)
- README.md (narrative)
- _reqs/splectrum_node.md (spec)

**Folder documentation completed:**
- apps/ - Root node of apps structure, activity center
- lib/ - Bootstrapping and dual entrypoint management, API library resolution
- modules/ - Formal module bundles, package/api/method hierarchy
- runtime/ - Internal processing engine with managed sessions
- scripts/ - Freestyle exploration and utilities

**Still to complete:**
- docs/ folder documentation

**Key patterns established:**
- README.json links to children (mycelium web)
- spl.mjs as entrypoint pattern (dual mode: CLI + programmatic)
- Visible folders vs auxiliary (_reqs, _lib, _schemas)
- One-to-one: apps/X ↔ runtime/X

### requireSpl Pattern Implementation

**Problem identified:**
- Overlay infrastructure existed but wasn't wired into execution
- `requireSpl()` hardcoded paths to `modules/bm_spl/`
- Separate execute functions (executeScript, executeInline, executeMethod) with duplicated logic
- Inconsistent patterns between libs and methods

**Solution - Unified requireSpl:**

Single entry point handling four URI patterns:
1. `lib/...` → libs (bound utility object)
2. `pkg/api/method` → methods via overlay (`{ invoke() }`)
3. `/absolute/path` → script files (`{ invoke() }`)
4. `spl/script/inline` → inline scripts (`{ invoke() }`)

**Two create() signatures established:**

| Type | Signature | Returns |
|------|-----------|---------|
| Libs | `create(record, { requireNonSpl })` | Utility object with methods |
| Methods | `create(record, { requireSpl })` | `{ invoke() }` |

**Key design decisions:**
- Methods only get `requireSpl` - must use libs, no direct platform access
- Libs only get `requireNonSpl` - wrap platform specifics
- Consistent pattern = fast comprehension
- Meaningful lib calls, not raw fs/path operations

**Implementation:**
- Created `modules/hierarchy.json` - layer configuration for overlay
- Updated `moduleBootstrap.js` - unified requireSpl with overlay resolution
- Simplified `app.mjs` from ~135 lines to ~70 lines
- Simplified `session.mjs` - removed all execute* functions
- Converted `pr09/console/hello` as reference implementation

**Archived:**
- `spl/dev` API moved to `archive/spl-dev-api/` - superseded by app-based approach

**Documentation:**
- Created `reqs/requireSpl_pattern_v1.0.0.md` - working document for the pattern

**App handler now:**
```js
const executable = await requireSpl(method, record)
await executable.invoke()
```

Two lines. Clean. Uniform.

---

## 2025-12-05

### Development Experience Design (continued from Dec 4)

Session recovered design discussion from interrupted Dec 4 session. Key documents from that session:
- `notes/cli_namespacing_and_context_2025-12-04.md`
- `notes/natural_language_bridge_2025-12-04.md`
- `notes/design_implementation_app_decisions_2025-12-04.md`

### Type Carries Tooling

Major design direction: dev tools (create, update, inspect) aren't standalone - they're methods on types. Every structural unit inherits its type's API.

**Key concepts:**
- Container: universal structural unit (folder node)
- Types are APIs in the normal hierarchy
- Type chain = API inheritance chain
- Module layering enables/disables tooling (type module present = tooling available)

**Container API:**
- `whoami` - structural introspection at any level
- `select` - XPath-style queries with content predicates
- `create` - scaffold new container structure (PAC)

**XPath for folder structure:**
- Node = folder, Attribute = file
- `select "//method[@_reqs contains 'CIP-003']"` - structure + content query
- Universal applicability: modules, repo, docs, mycelium web

### Resolution Approach

Runtime layer resolution with inheritance:
1. Check folder exists → load index.js → wrap → return
2. No folder → walk type chain → find in type lib → wrap → return

Simplified method pattern under consideration: methods as plain functions, resolver provides wrapper.

### Container Structure Established

Set up work module at `splectrum/apps/cli-static/modules/work_module/spl/container/`:

```
spl/container/
  _lib/lib.json
  _reqs/reqs.json
  _schemas/schemas.json
  _selfevals/selfevals.json
  _tests/tests.json
  README.md
  README.json
  index.js
```

**Naming conventions:**
- Visible folders: README.md + README.json
- Internal folders (`_*`): task-specific entrypoint `<foldername>.json`

**Spider principle:** Each folder with entrypoint describes its own contents. Parent just links, doesn't duplicate.

### Req Structure Discussion

Preparing to write container reqs. Reviewed existing `reqs_v1.0.0.md` for pattern.

**Plain req structure:**
- Type: plain req
- Extends: (if applicable)
- Version:
- Spec
- Self-eval
- Comments: (optional)
- Models: (populated at project closure)

**Project as transaction:** Req version becomes immutable at project closure. Model examples emerge from the project work itself.

### Vocabulary Decisions

- **Container:** structural unit (folder node) - distinct from splectrum node
- Event record vs State record: under consideration for faf/consumeLatest semantics

### Work Items Identified

1. Session implementation change (for later):
   - Don't delete from processing (preserve history)
   - Full record of processing steps

2. Type module migration:
   - Keep type module until useful stuff extracted into spl package
   - Types become APIs in normal spl hierarchy

---

*Log entries added as work progresses.*
