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

## 2025-12-06

### Elevator Pitch Work (Item 4)

Substantial progress on elevator pitch preparation for Pear/Bare conversation.

**Created `elevator-pitch/` folder with:**

**Main document: `CONVERSATION_2025-12-06.md`**
- The Triangle diagram: Splectrum (Functionality) / HAICC (Methodology) / Mycelium (Data Layer)
- One-liner: "AI-first integration platform for P2P ecosystem"
- Stack diagram with deep penetration between Splectrum and Mycelium
- HAICC section: Thriving on Creative vs Formal Tension
- DSL Engine: triangle of modes, language evolution as capability driver
- Mycelium: P2P fit through familiar patterns
- Enabler platform: toolbox for integration and management

**Supporting block files:**
- `HAICC_BLOCK.md` - expanding spectrum, autonomy test, formalisation flow
- `DSL_ENGINE_BLOCK.md` - triangle, vertical/horizontal structure
- `MYCELIUM_BLOCK.md` - physical layer, P2P fit, integration fabric
- `STACK_BLOCK.md` - vertical layers, interpenetration
- `INTEGRATION_BLOCK.md` - AI-first enabler platform positioning

**Key clarifications emerged:**

1. **HAICC expanding spectrum:**
   ```
   ◄── Expanding Creativeness       Increased Formal Implementation ──►
            Human+AI ─────── AI ─────── Agents
   ```
   - Both ends grow outward as system matures
   - Self-contained reqs enable autonomy (no orchestration)

2. **The Autonomy Test:**
   - Complete requirements = AI Autonomy
   - Incomplete requirements = Equal Human-AI Collaborative Partnership
   - Human paradox: "Be more creative by trying to make yourself redundant"

3. **Freestyle ↔ Formal dualism runs through all layers:**
   - HAICC: Natural language reqs ↔ Complete spec reqs
   - DSL Engine: Free scripting ↔ API formalism
   - Mycelium: Self-contained units ↔ Full repo structure

4. **AI-first with human as enabler of autonomy** - platform shaped for AI, human enables AI to not need human

5. **Splectrum as toolbox:**
   - Focus on integration and management of solutions
   - Tools to create solutions natively
   - Wraps external applications into the language engine

6. **Mycelium multimodal DL APIs:** streaming, document, transactional, native

7. **Language evolution is primary driver of increased capabilities**

**New insight - shift left / shift right dynamic:**
- Shift left: Human+AI tackles new ground (creative)
- Shift right: Mature work formalises, delegates to agents
- Capacity freed on right returns to tackle new ground on left

**The Triangle as visual anchor:**
- Splectrum (Functionality) at apex
- HAICC (Methodology) and Mycelium (Data Layer) at base
- Deep interconnection between all three
- "A functionality platform, strongly underpinned by a methodology and appropriate data layer"

---

## 2025-12-07

### Container Implementation - whoami method working

**Major implementation milestone:** First formal method (`spl/container/whoami`) executing through full pipeline.

**Container reqs created (16 files):**
- `spl/container/_reqs/` - type/instance pairs for container, readme, index, lib, reqs, schemas, selfevals, tests
- Naming convention: `<thing>_type_v1.0.0.md` (structural) and `<thing>_instance_v1.0.0.md` (content)

**Type hierarchy containers created:**
- `spl/api` - API type (extends spl/container)
- `spl/method` - method type (extends spl/container)
- `spl/package` - package type (skeleton)
- `spl/module` - module type (skeleton)
- `spl/modules` - modules spot type (skeleton)

**whoami method implemented:**
- Location: `apps/cli-static/modules/work_module/spl/container/whoami/`
- Shows container type, purpose, extends/implements, API facets
- Works via inheritance: `spl/api/whoami` resolves to `spl/container/whoami`

**Key implementation changes:**

1. **Simplified method pattern:**
   ```js
   export default async function(record, requireSpl, resolveSpl) {
     // implementation
   }
   ```
   No create/invoke wrapper for methods. Libs still use `create()`.

2. **Output pair pattern:**
   - `spl.output(meta, data)` - always two args
   - `spl.extractOutput(sourceRecord)` - lifts output pair between records
   - CLI prints metaoutput as text, output as JSON (if present)

3. **resolveSpl added:**
   - Companion to requireSpl (resolve without instantiate)
   - Used to find container paths for whoami

4. **Overlay resolution with inheritance:**
   - Checks `implements` first (instance → type)
   - Then follows `extends` chain (type → parent type)
   - README.json carries `extends` and `implements` properties

5. **App overlay support:**
   - `apps/cli-static/modules/hierarchy.json` - app layer configuration
   - `enableAppOverlay` flag in app state toggles app modules
   - App layers checked first, then splectrum layers

6. **Session error handling:**
   - Errors now return gracefully in metaoutput
   - No more hanging on method resolution failures

**Vocabulary decisions:**
- `apiFacet` - organizational grouping of methods within an API
- Switched to camelCase for DSL glossary terms

**Files modified:**
- `splectrum/lib/moduleBootstrap.js` - overlay resolution with inheritance, resolveSpl
- `splectrum/modules/bm_spl/spl/_lib/spl.js` - output(meta, data), extractOutput()
- `splectrum/modules/bm_spl/spl/cli-static-session/start/index.js` - error handling
- `splectrum/spl.mjs` - CLI output handling
- `splectrum/apps/cli-static/state/0000000000000.json` - enableAppOverlay flag
- `splectrum/apps/cli-static/modules/hierarchy.json` - created

### Module Lib Design Discussion

Identified inconsistency in interfaces across execution contexts (scripts get spl, methods get requireSpl, libs get requireNonSpl). Proposed unified `module` interface:

- Single universal lib all contexts receive
- Contains all core utilities: input, output, require, resolve, faf, consumeLatest, runtime access
- Additional libs only for specialized domain concerns

Bootstrap sequence:
1. Raw bootstrap (platform-independent overlay logic)
2. Load module.js - **app modules first, then splectrum** (allows boot/system app isolation)
3. Instantiate module bound to record
4. All execution uses module interface

See `notes/module_lib_bootstrap_2025-12-07.md` for full design.

### PAC Handler Design

Key insight: PAC is a handler concern, not a method concern. In spl1, execution handling was internal. In spl2, we opened up the design - handlers orchestrate the confirmation flow.

**Universal method flags:**
- `--dry-run` - preview only, no action
- `--silent` - omit narrative (data only)

**PAC flow:**
1. Handler sees `--pac`, runs method with `--dry-run`
2. Outbox handler prompts for confirmation (handler-specific UX)
3. On confirm, re-submits with `--silent` (no `--dry-run`)

**Handler implementations vary:**
- CLI: terminal prompt
- Browser: dialog/modal
- AI agent: autonomous decision within bounds

Methods stay pure. Handler is pluggable. Same method works across all contexts.

See `notes/pac_handler_design_2025-12-07.md` for full design.

### Implementation Plan (from design discussion)

1. **Create spl/module type** - DONE
2. **Create work_module as instance** - next
3. **Create `_lib/module.js`** - full interface with all utilities
4. **Update invocation signatures** - all contexts receive `module` only
5. **Update moduleBootstrap.js** - app-first module.js resolution (simplified overlay just to find module.js)
6. **Add `--dry-run` and `--silent`** - to whoami as reference implementation
7. **PAC at handler level** - outbox handler intercepts `--pac`, orchestrates confirmation flow

### Terminology Fix

Changed `implements` to `instantiates` throughout:
- `instantiates` = instance → type (whoami instantiates spl/method)
- `extends` = type → parent type (spl/method extends spl/container)

### Key Principle (from this session)

**No reqs = collaborative mode.** Don't run ahead implementing. Discuss first.

### Current State

- spl/module type created (instantiates spl/api, extends spl/container)
- module.js skeleton exists at `modules/_lib/module.js` (needs full implementation)
- Terminology fixed in moduleBootstrap.js and whoami

### Other TODOs

- Update spl/app state.avsc schema (base extended by spl/cli-static)
- Better error handling (resolve and method internal)

---

## 2025-12-07 (Evening Session)

### Module.js Implementation Complete (Items 1-4)

Major refactoring session - universal module interface now working through full pipeline.

**Item 1: Instance structures**
- `work_module/README.json` → `{"instantiates": "spl/module"}`
- `work_module/spl/README.json` → `{"instantiates": "spl/package"}`

**Item 2: module.js created**

Location: `apps/cli-static/modules/work_module/_lib/module.js`

Platform bootstrap pattern:
1. Adhoc Node/Bare switch loads fs/path first
2. Load `platform-modules.json` mapping file
3. `requirePlatform()` uses mapping for all other modules

Interface implemented:
- `module.input()` / `module.output(meta, data)` / `module.extractOutput()`
- `module.require(uri)` - handles platform modules, libs, commands, scripts
- `module.resolve(nodePath, filename)` - overlay resolution
- `module.faf()` / `module.consumeLatest()`
- `module.getNodeRoot()` / `module.getAppAPI()` / `module.getRecordId()` / `module.getMethod()`
- `module.raiseError()` / `module.raiseAsyncError()` / `module.completeRequest()`

Key design: Dynamic getters read from record each time (not captured at creation). This allows record to be mutated after module creation (needed for CLI setup).

**Item 3: Invocation signatures updated**

All methods now receive single `module` arg:
- `export default async function(module)` - methods
- CLI lib special case: `create(module, record)` - needs raw record for setup

Files updated:
- `spl/container/whoami/index.js`
- `spl/cli-static/execute/index.js`
- `spl/cli-static-session/start/index.js`
- `spl/cli/_lib/cli.js`

**Item 4: moduleBootstrap.js simplified**

From ~440 lines to ~80 lines. Single responsibility:
- Adhoc platform bootstrap (fs, path, url)
- `loadModule(appName?)` - finds module.js via hierarchy (app-first, then splectrum)

**spl.mjs changes:**
- Uses `loadModule('cli-static')`
- Sets app context on record after CLI processing (appAPI, enableAppOverlay)
- Uses `module.require()` for app execution

**Testing:**
```
$ spl spl/container/whoami
Container: spl/container
Type: api
Purpose: Container type definition...
```

Full pipeline working: CLI → execute → session → whoami → output

### Files Created/Modified

New:
- `apps/cli-static/modules/work_module/_lib/module.js`
- `apps/cli-static/modules/work_module/_lib/platform-modules.json`
- `apps/cli-static/modules/work_module/README.json`
- `apps/cli-static/modules/work_module/spl/README.json`
- `modules/bm_spl/_lib/module.js` (copy for fallback)
- `modules/bm_spl/_lib/platform-modules.json` (copy for fallback)

Modified:
- `lib/moduleBootstrap.js` - simplified
- `spl.mjs` - new module pattern
- `modules/bm_spl/spl/cli/_lib/cli.js` - new signature
- `modules/bm_spl/spl/cli-static/execute/index.js` - new signature
- `modules/bm_spl/spl/cli-static-session/start/index.js` - new signature
- `apps/cli-static/modules/work_module/spl/container/whoami/index.js` - new signature

---

## 2025-12-07 (Night Session)

### Items 5-6 Complete: Flags and PAC

**Item 5: --dry-run and --silent flags**

Schema-first approach at container level:

**Base schemas created (`spl/container/_schemas/`):**
- `input.avsc` - universal handler flags: `dryRun`, `silent`
- `metaoutput.avsc` - natural language output: `freetext` (string array)

**Schema naming convention:**
- Name carries full path: `spl.container.input`, `spl.container.whoami.output`
- Namespace reserved for future hive isolation (versioning, multi-tenant)
- Derived schemas only created when extending (no copy if identical to base)
- Compatibility checking validates "inheritance" contract

**CLI normalization:**
- `--dry-run` → `dryRun` (kebab to camelCase in cli.js)

**module.output() respects flags:**
- `silent`: skips metaoutput
- `dryRun`: skips data output

**Item 6: PAC at handler level**

PAC (Prompt for Action Confirmation) implemented in `spl/cli-static/execute`:

**Flow:**
1. `--pac` detected in input
2. Start session, set `dryRun`, execute
3. Show preview (metaoutput from dry-run)
4. Prompt: "Proceed? [y/N]"
5. If confirmed: restore original, set `silent`, restart session, execute
6. If cancelled: output "Cancelled."

**New module methods:**
- `setInputFlag(key, value)` - modify input flags
- `snapshotRecord()` / `restoreRecord(snapshot)` - save/restore record state

**Key insight:** Must snapshot record before sessionStart.invoke() pollutes it. Restore before each FAF to ensure clean state.

**Testing:**
```
$ spl spl/container/whoami --pac
--- Preview ---
Container: spl/container
...
---------------
Proceed? [y/N] y
(silent execution, no duplicate output)
```

### Schema Design Decisions

**Metaoutput structure:**
- `freetext`: array of strings (not single string)
- Easy to build up incrementally
- Handler decides rendering (CLI joins with newlines, browser might use paragraphs)
- Doc: "Natural language output" (human + AI readable)

**No inheritance in Avro - compatibility checking instead:**
- Base schema defines common fields
- Derived can be checked for compatibility with base
- If compatible, data valid for derived is also valid for base
- Naming convention signals relationship, compatibility check verifies

**When to create derived schema:**
- Only if adding fields beyond base
- Otherwise, resolution picks up base schema
- Reduces maintenance burden

### Files Modified

**New:**
- `spl/container/_schemas/input.avsc`
- `spl/container/_schemas/metaoutput.avsc`
- `spl/container/whoami/_schemas/schemas.json`

**Modified:**
- `apps/cli-static/modules/work_module/_lib/module.js` - setInputFlag, snapshotRecord, restoreRecord, output respects flags
- `modules/bm_spl/spl/cli/_lib/cli.js` - kebabToCamel normalization
- `modules/bm_spl/spl/cli-static/execute/index.js` - PAC flow with session restart

**Deleted:**
- `spl/container/whoami/_schemas/input.avsc` - uses base
- `spl/container/whoami/_schemas/output.avsc` - whoami is metadata function, uses metaoutput
- `spl/container/whoami/_schemas/metaoutput.avsc` - uses base

### Work Item Status

Items 1-6 of "App-based design experience" complete. Ready for practical use.

---

## 2025-12-07 (Late Night Session)

### Import Maps Simplification

Discovered Bare uses import maps in package.json for Node.js compatibility. Tested and confirmed it works in Node too.

**Before:** Manual platform detection + platform-modules.json mapping file
**After:** Declarative import maps in package.json

**package.json imports added:**
```json
{
  "imports": {
    "fs": { "bare": "bare-fs", "default": "fs" },
    "path": { "bare": "bare-path", "default": "path" },
    "os": { "bare": "bare-os", "default": "os" },
    "url": { "bare": "bare-url", "default": "url" }
  }
}
```

**module.js simplified:**
- Removed `isNode`, `isBare` detection
- Removed `requirePlatform()` function
- Removed `platform-modules.json` loading
- Now uses simple `await import('fs')` - runtime resolves via import maps

**Files removed:**
- `apps/cli-static/modules/work_module/_lib/platform-modules.json`
- `modules/bm_spl/_lib/platform-modules.json`

**Result:** ~40 lines removed, platform switching is now declarative. Same code runs on Node and Bare.

### Next Steps

- Selfevals implementation (schema validation, container structure)
- Container methods: `select`, `create`

---

## 2025-12-08

### Selfeval Method Implementation

Implemented `spl/container/selfeval` - first full introspection method following all established patterns.

**API facet renamed:** "types" → "introspection"
- `whoami` - "What am I?"
- `typeof` - "What type am I?"
- `selfeval` - "Am I valid?"

**Method structure:**
```
spl/container/selfeval/
  _lib/
    selfeval.js       # main lib with runners
  _reqs/
    selfeval_method_v1.0.0.md
  _selfevals/
    selfevals.json
    selfeval_structure.json
  index.js            # clean flow, spl imports only
  README.md
  README.json
```

**Flags implemented:**
- `--facet=<name>` - run specific facet (default: all)
- `--dry-run` - list facets without executing
- `--fail-fast` - quiet mode, stop on first failure
- `--report` - structured JSON only
- `--verbose` - both freetext and JSON

**Output modes (graduated disclosure):**
```bash
spl spl/container/selfeval               # full detail
spl spl/container/selfeval --fail-fast   # "[structure] OK" or stop on failure
spl spl/container/selfeval --report      # JSON only
spl spl/container/selfeval --verbose     # text + JSON
```

### Code Organization Patterns

**index.js pattern refined:**
- Only spl lib imports (`module.require('lib/...')`)
- Flow reflects spec from req
- Comments explain each step
- Clean, readable as documentation

**Lib pattern refined:**
- Main lib: meaningful implementation steps, header docs
- Auxiliary libs: `.js` suffix, for facets/helpers
- Resolution: `lib/x/y` → main, `lib/x/y/z.js` → auxiliary

### Requirements Updated

**index_type_v1.0.0.md:**
- Updated to `(module)` signature
- Only spl lib imports required
- Flow must reflect spec
- Header comment + step comments

**lib_type_v1.0.0.md:**
- Main/auxiliary lib convention documented
- Main libs: meaningful steps, header docs, clean structure
- Auxiliary libs: facets, helpers, split when large
- Future: AI agent code quality checks

### Bug Fixed

**module.js lib resolution:** Was using undefined `modulesDir`, changed to `getModulesDir()`. Also updated to use overlay resolution instead of hardcoded `bm_spl` path.

### Files Created

- `spl/container/selfeval/` - complete method container
- `spl/container/_selfevals/selfeval_structure.json` - container structure constraints
- `projects/11-app-architecture/notes/selfeval_design_2025-12-08.md` - design notes

### Files Modified

- `spl/container/README.json` - "types" → "introspection", added "selfeval"
- `spl/container/_selfevals/selfevals.json` - updated format
- `spl/container/_reqs/index_type_v1.0.0.md` - new module signature, constraints
- `spl/container/_reqs/lib_type_v1.0.0.md` - main/auxiliary pattern, quality guidance
- `apps/cli-static/modules/work_module/_lib/module.js` - fixed lib resolution

### Next Steps

- Split selfeval lib when runners grow (structure.js, schemas.js as auxiliaries)
- Implement schemas runner
- Update whoami with same patterns (--report, --verbose, --fail-fast)
- Container methods: `select`, `create`

---

## 2025-12-08 (continued)

### Graded Output Pattern

Discussed output handling across introspection methods. Key insight: separate execution flags from output flags.

**Lib produces graded chunks:**
```js
return {
  data: { /* structured result */ },
  output: {
    topline: "Container valid: 3 facets",
    overview: ["Container valid: 3 facets", "  methods: 2", ...],
    detail: ["Container valid: 3 facets", "Methods:", "  selfeval ✓", ...]
  }
}
```

**Module.output() selects level:**
- `--silent` → topline
- (default) → overview
- `--verbose` → detail + JSON
- `--report` → JSON only

**Separation of concerns:**
- Lib owns domain knowledge (what to say at each level)
- Module owns presentation (which level to show, how to format)

Pattern captured in `work_module/_reqs/module_instance_v1.0.0.md`.

### Design & Implementation Experience

**Common sense, low friction approach:**

At functional implementation time, do the minimum to reach autonomy. Once autonomous, AI agents handle formal implementation work in batches.

- Don't over-formalize req structure now
- Reqs can spider out to more detail later (or not)
- Capture design decisions, let structure evolve
- Selfevals accompany reqs - AI agents complete the formal work
- Root node naming exception: `module_instance` not `work_module_instance` (contents will move)

**Key principle:** Minimal and complete at each stage. Formalization is work for later batches.

### gradedOutput Refinements

Refined the graded output design through discussion:

**Four levels with flag mapping:**
| Flag | Level |
|------|-------|
| --silent | topline |
| (default) | summary |
| --verbose | detail |
| --debug | debug |

**Two orthogonal axes:**
- Text level (metaoutput): controlled by silent/verbose/debug
- Data level (output): controlled by --report[=level]

**requiredLevel() helper:** Returns max of text and data levels. Methods use this to know what depth of content to produce.

**Key refinements:**
- --silent means topline (minimal), not none
- Most verbose wins if multiple flags
- --report is orthogonal, not exclusive
- DSL glossary integration at debug level for horizontal language consistency

### whoami v2 Design

Comprehensive container introspection with three orthogonal dimensions:

1. **Chain depth** (--levels): 0, 1, 2, ... full
2. **Facet filter** (--facet): reqs, lib, methods, selfevals, schemas, tests
3. **Detail level**: graded output flags

**Facet grading (schemas example):**
| Level | Output |
|-------|--------|
| topline | `schemas - input.avsc, metaoutput.avsc` |
| summary | entries with descriptions |
| detail | + field details from .avsc files |
| debug | + DSL glossary meanings |

**Key insight:** At debug level, whoami replaces ad-hoc file scanning. One call = complete understanding.

### whoami Implementation (schemas facet)

Implemented first facet following established patterns:

```bash
spl spl/container/whoami --silent    # topline
spl spl/container/whoami             # summary
spl spl/container/whoami --verbose   # detail
spl spl/container/whoami --debug     # debug + DSL
spl spl/container/whoami --facet=schemas --report  # with data
```

**Files created:**
- `whoami/_lib/whoami.js` - lib with loadSchemasFacet, outputSchemasFacet
- `whoami/_reqs/spl_container_whoami_v2.0.0.md` - comprehensive spec

**Other facets:** Placeholder "not implemented" messages.

### Test Coverage

19/19 tests passing for gradedOutput and requiredLevel.

---

## 2025-12-11

### Selfeval Levels Support Complete

Continued from previous session - selfevals now support `--levels` flag same as whoami.

**Completed:**
- Selfeval method with levels support (type stack traversal)
- Dual runner categories: `runners` (all levels) and `instanceRunners` (level 1 only)
- Children runner (`selfeval_children.js`) - validates child container types
- Final runner (`selfeval_final.js`) - detects overlap in final resources
- spl/module type setup with _lib/module.js
- Fixed extractExports in selfeval_lib.js (keyword exclusion, factory pattern fallback)

**Current state:**
```bash
./spl spl/container/selfeval          # PASS - 6/6 runners
./spl spl/module/selfeval --levels=all  # PASS - 3/3 levels
```

### module.js Pattern Discussion

Identified inconsistency: module.js uses forward reference pattern (`let moduleRef = null; getModuleRef()`) while other libs use direct `return { }`.

**Reason:** Inner functions (`internalRequire`, `createScriptExecutable`) need to pass `module` to loaded libs/methods before the module object exists.

**Solution identified:** Use `this` in method shorthand - binds to containing object at call time:
```javascript
return {
  async require(uri) {
    return lib.create(this)  // 'this' is the module
  }
}
```

**Decision:** Document and schedule for later. Current solution works, selfevals pass.

See: `notes/module_js_this_refactor.md`

### spl/module type complete

- work_module/index.json created (instance identity)
- selfeval_module.js runner validates 20 instance methods
- Lib manifest `exports` documents instance API, not module exports
- All selfevals pass

### spl/package type started

- index.json created (extends spl/container, instantiates spl/api)
- _reqs/index.json with type/instance requirements
- _selfevals/index.json with instanceRunners for children (spl/api)

### README.json → index.json migration (IN PROGRESS)

Phasing out README.json - index.json is the source of truth for container identity.

**Done:**
- module.js updated: `readContainerReadme` → `readContainerIdentity` (reads index.json)
- Removed README.json from: spl/module, spl/modules, spl, spl/container/selfeval, spl/container/whoami, spl/method, spl/api, spl/package

**Still needed:**
- spl/container needs index.json (currently missing - breaks inheritance chain)
- Test spl/package/selfeval resolves via inheritance
- Verify all existing selfevals still pass

### Vibe Engineering comparison

Added `elevator-pitch/VIBE_ENGINEERING_COMPARISON.md` - positions HAICC against mainstream "vibe engineering" trend. Key USPs:
1. Dynamic autonomy (emerges from formalization)
2. Embedded tooling (types carry tools)
3. Mycelium context (containers as semantic chunks, not RAG fragments)
4. Bi-directional growth (shift-left creative, shift-right formal)
5. Freestyle ↔ Formal as feature

---

## 2025-12-12

### Type Stack and Selfeval Architecture Complete

Major session recovering from Windows reboot. Completed type stack algorithm and selfeval infrastructure.

**Type stack algorithm fixed:**

1. **Extends chain first (type layer)**, then **instantiates chain (instance layer)**
2. Dynamic `instanceLevel` - not hardcoded to level 2
3. Bootstrap case handled: when `instantiates` points to self or ancestor, instanceLevel points to existing position

**Stack examples after fix:**
- `spl`: `[spl, spl/package, spl/container]`, instanceLevel: 2
- `spl/package`: `[spl/package, spl/container, spl/api]`, instanceLevel: 3
- `spl/container`: `[spl/container, spl/api]`, instanceLevel: 2
- `spl/api`: `[spl/api, spl/container]`, instanceLevel: 1 (bootstrap - instantiates itself)
- `spl/method`: `[spl/method, spl/container, spl/api]`, instanceLevel: 3

**Instance vs Type distinction clarified:**
- `instantiates` = structural relationship (what container shape)
- `type` field = content classification (what it defines)
- Example: `spl/api` is an instance of `spl/api` (structurally) that defines what `spl/api` means (type: "Type")

**Runner placement fixed:**
- Type runners on `spl/container`: lib, schemas, handler, reqs, final
- Instance runners on specific types:
  - `spl/api`: api runner (validates methods match api declaration)
  - `spl/package`: children runner (validates children match instanceChildren)

**selfeval_children.js fixed:**
- Now checks `instantiates` (structural type), not `extends`

**selfeval_handler.js fixed:**
- Now uses `module.resolve()` for overlay inheritance (finds parent type's handler)

**SKIP → EMPTY naming:**
- Changed throughout - "nothing to validate" not "skipped"

**Empty manifests pattern:**
- Explicit `index.json` with empty arrays/objects rather than absent folders
- Created for `spl/_lib`, `spl/_reqs`, `spl/_schemas`

**Type hierarchy fixes:**
- `spl/api`: added `extends: spl/container`
- `spl/method`: added `extends: spl/container`
- `spl/api`, `spl/method`: added `instantiates: spl/api`
- Moved `api` runner from `spl/container` to `spl/api/_selfevals` as instanceRunner

**Working document created:**
- `notes/type_stack_and_selfeval_architecture.md` - captures all design decisions

**All selfevals passing:**
```bash
./spl spl/selfeval --levels=all          # PASS 3/3 levels
./spl spl/container/selfeval --levels=all # PASS 2/2 levels
./spl spl/package/selfeval --levels=all   # PASS 3/3 levels
./spl spl/api/selfeval --levels=all       # PASS 2/2 levels
./spl spl/method/selfeval --levels=all    # PASS 3/3 levels
```

### Next Steps (consolidated)

**Foundation work:**
1. Add empty manifest folders to remaining types (`spl/api`, `spl/method`)
2. Test method instances (e.g., `spl/container/whoami/selfeval`)

**Type completion:**
3. `spl/api` - add _selfevals for instances (method children validation?)
4. `spl/method` - add instanceRunner if needed

**New container creation:**
5. Methods - create new method instances
6. APIs - create new API containers
7. Packages - create package instances
8. Modules - create module instances

**Documentation:**
9. Update relevant _reqs with design decisions from working document

---

## 2025-12-12

### module.js Bootstrap Refactor

Completed refactor of module.js to use standard lib signature `create(module)` instead of special-case `create(record)`.

**Changes:**
- moduleBootstrap.js creates minimal bootstrap module (nodeRoot, modulesDir, platform require)
- module.js receives bootstrap via standard `create(module)` pattern
- New methods: `init()`, `bindRecord()`, `createForRecord()`
- Platform modules via direct `import()` (package.json handles Node/Bare mapping)
- Updated cli-static-session/start to use `createForRecord()`

All selfevals pass.

### Container Lifecycle Design

Designed the full container lifecycle: create, lift, delete.

**create** - establish identity only:
- Creates folder + index.json in work_module
- Overlay provides everything else (handler, libs, schemas inherit from type)

**lift** - materialize resources from overlay:
- `--resource=index.js` - single resource for editing
- `--all` - standalone container (all resources, portable)
- Uses overlay to find correct resource instance
- Enables editing via standard Write/Edit tools

**delete** - remove + overlay directive:
- Removes from work_module
- Acts as overlay stop marker

Key insight: lift exists because overlay encapsulates complexity of finding the right resource through layers and type chains.

### Terminology: Resource vs File

Decision to use "resource" instead of "file" throughout:
- Abstract - doesn't imply filesystem
- Future-proof - works for Kafka topics, databases, etc.
- Consistent with how we talk about `_lib/`, `_reqs/`, `_schemas/` as resource categories

**TODO:** Update existing documentation to use "resource" instead of "file" where appropriate.

### Container Lifecycle Implementation

Implemented all three container lifecycle methods:

**spl/container/create:**
- Validates child expected by parent (in api field)
- Resolves type via parent's instanceType → instanceChildren
- Creates folder + index.json in work_module
- Flags: `--dryRun`, `--purpose`

**spl/container/lift:**
- Resolves resource through overlay (type stack)
- Copies to work_module for editing
- Flags: `--resource`, `--dryRun`, `--all` (future)

**spl/container/delete:**
- Removes all files except `_reqs/` (immutables preserved)
- Removes folder if empty
- Flags: `--dryRun`

All tested and working.

### Requirements Documentation

Added missing _reqs:
- `spl/_reqs/spl_package_v1.0.0.md` - SPL package contents
- `spl/container/create/_reqs/Create_v1.0.0.md`
- `spl/container/delete/_reqs/Delete_v1.0.0.md`
- `spl/container/lift/_reqs/index.json` (was missing)

Fixed _reqs/index.json format - requires objects with `name`, `description`, `file` fields, not just filename strings.

Removed `spl/newType` test container and cleaned up spl/index.json api reference.

### whoami Reqs Enhancement

Fixed `buildReqs` in report.js:
- Was looking for `manifest.files`, now uses `manifest.requirements`
- Added detail levels: summary (purpose), detail (req list), enriched (file contents)

Updated whoami lib to read req file contents at enriched level.

`--meta=enriched` now shows actual req file contents alongside handler code.

### Project Ready for Closure

All work items complete:
1. Backlog and CIP Consolidation ✓
2. Splectrum node cleanup ✓
3. App-based design and implementation experience ✓
4. Elevator pitch for Pear/Bare ✓
5. Splectrum node install (carry forward)

---

*Log entries added as work progresses.*
