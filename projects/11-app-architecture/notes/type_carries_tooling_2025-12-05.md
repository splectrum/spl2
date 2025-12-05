# Type Carries Tooling

**Date:** 2025-12-05
**Context:** Project 11, Item 3 - Development Experience discussion (continued)
**Builds on:** design_implementation_app_decisions_2025-12-04.md

---

## The Insight

Dev tools (create, update, inspect) aren't special standalone utilities. They're methods on types. Every structural unit inherits its type's API.

---

## Vocabulary Clarification

Two distinct concepts share "node" - needs separation:

| Term | Meaning |
|------|---------|
| **Folder node** | Structural unit in the module hierarchy - the self-contained package at any level |
| **Splectrum node** | The runtime installation (spl.mjs, apps/, runtime/, modules/) |

*TODO: Establish distinct vocabulary to avoid confusion.*

---

## Folder Node Structure

A folder node is the self-contained structural unit that repeats at every level:

```
any-folder/
  _reqs/          # requirements for this unit
  _schemas/       # schemas for this unit
  README.md       # narrative documentation
  README.json     # mycelium web links
  index.js        # (if executable)
  ...             # content specific to this level
```

**Self-similar pattern:**

```
modules/bm_spl/
  spl/                    # package - is a folder node
    project/              # api - is a folder node
      create/             # method - is a folder node
```

Every level has the same structural scaffolding.

---

## Type as API Carrier

Each type defines an API. Instances of that type inherit the API.

**Folder node type provides:**
- `create` - scaffold the structure
- `inspect` / `status` - show what's here
- `update` - modify structure
- Built-in help via PAC pattern

**Example - creating a folder node:**

```
$ spl node/create ./spl/project/archive

Will create folder node: ./spl/project/archive/
  Structure:
    - _reqs/
    - _schemas/
    - README.md
    - README.json

Proceed? [y/n]
```

Same PAC pattern as everything else. The confirmation IS the documentation.

---

## Module Layering Controls Availability

```
modules/
  bm_spl/       # base - runtime functionality
  type_spl/     # type module - create, update, inspect, etc.
  work_spl/     # work overlay - current implementation
```

| Environment | Layers Active | Result |
|-------------|---------------|--------|
| Development | bm + type + work | Full API including type operations |
| Production | bm only | No create/update tooling, just runtime |

The type module can be omitted - tooling disappears, runtime remains.

---

## Type Hierarchy

Types carry their own tooling:

| Type | API Methods |
|------|-------------|
| folder-node | create, inspect, update, whoami |
| method | (inherits folder-node) + invoke, test |
| api | (inherits folder-node) + list-methods |
| package | (inherits folder-node) + list-apis |

Each level adds its specific operations on top of the base folder-node operations.

---

## whoami - Structural Introspection

Every folder node can answer "what am I?" - full structural self-awareness.

**At method level:**

```
$ spl spl/project/create/whoami

I am: spl/project/create
Type: method
Path: modules/bm_spl/spl/project/create/

Parent: spl/project (api)
Siblings: plan, run, close
Children: none (leaf node)

Structure:
  _reqs/          ✓ 2 files
  _schemas/       ✓ 1 file
  README.md       ✓
  README.json     ✓
  index.js        ✓

Inherits from: folder-node, method
Available API: invoke, test, inspect, update
```

**At api level:**

```
$ spl spl/project/whoami

I am: spl/project
Type: api
Path: modules/bm_spl/spl/project/

Parent: spl (package)
Siblings: dev, cli-static, app
Children: create, plan, run, close (4 methods)

Structure:
  _reqs/          ✓ 1 file
  _schemas/       ✗ missing
  README.md       ✓
  README.json     ✓
  _lib/           ✓ shared utilities

Inherits from: folder-node, api
Available API: list-methods, inspect, update
```

**Why whoami works:**

| Aspect | Benefit |
|--------|---------|
| Lives on folder-node | Available at every level |
| Self-contained | Reads from local structure only |
| No PAC needed | Read-only introspection |
| Navigational | Shows context (parent/siblings/children) |
| Diagnostic | Shows structure completeness |

It's the structural equivalent of "where am I and what can I do here?"

---

## select - XPath-Style Structural Query

The folder hierarchy IS a document tree. XPath semantics apply directly:

| Concept | XPath | Module Hierarchy |
|---------|-------|------------------|
| Node | element | folder |
| Attribute | @attr | file or subfolder |
| Children | child elements | subfolders |
| Path | /a/b/c | folder path |

**XPath mapping:**

| XPath Syntax | Meaning |
|--------------|---------|
| `/spl/project/create` | Path to specific folder node |
| `//create` | Any folder named 'create' at any depth |
| `/spl/project/*` | All children of project |
| `@index.js` | File 'attribute' exists |
| `@_reqs` | Subfolder 'attribute' exists |
| `[predicate]` | Filter condition |
| `not()` | Absence test |

**Examples:**

```
# All executable children of any 'project' folder
$ spl select "//project/*[@index.js]"

# Under spl: nodes with reqs but missing schemas
$ spl select "/spl//*[@_reqs and not(@_schemas)]"

# All methods that have selfevals
$ spl select "//method[@_selfevals]"

# Find incomplete methods (missing reqs)
$ spl select "//method[not(@_reqs)]"

# APIs that have shared libs
$ spl select "//api[@_lib]"
```

**Why XPath fits:**

| Aspect | Benefit |
|--------|---------|
| No new concepts | Filesystem already IS a tree |
| Compact expression | Complex queries in one line |
| Structural awareness | Understands types, not just files |
| Diagnostic | Find incomplete/inconsistent structures |
| AI-friendly | Express navigation intent directly |

**Complements whoami:**

| Method | Question |
|--------|----------|
| whoami | "I'm here - what is this?" |
| select | "From here - find me things matching X" |

This is the actual navigation pattern expressed directly, instead of through glob + read cycles.

### Content-Aware Predicates

Files are attributes - and attributes have content. Extend predicates to query inside files:

| Syntax | Meaning |
|--------|---------|
| `@file` | File exists |
| `@file contains 'x'` | File contains text |
| `@file matches 'regex'` | File matches pattern |
| `@file like '*glob*'` | Glob-style matching |

**Examples:**

```
# Find projects mentioning "mycelium"
$ spl select "//projects/*[@README.md contains 'mycelium']"

# Methods with selfevals that test 'error handling'
$ spl select "//method[@_selfevals/* contains 'error']"

# Reqs that reference a specific CIP
$ spl select "//*[@_reqs/* contains 'CIP-003']"

# All methods that import a specific lib
$ spl select "//method[@index.js contains \"requireSpl('lib/\"]"

# Find TODOs across the repo
$ spl select "//*[@*.md contains 'TODO']"

# Find where a concept is discussed
$ spl select "//*[@ contains 'folder-node']"
```

This is grep + structure awareness + xpath in one expression.

### Universal Applicability

The repo has the same structure - folder nodes all the way down:

```
spl2/                           # repo root - folder node
  projects/                     # folder node
    11-app-architecture/        # folder node
      notes/                    # folder node
      reqs/                     # folder node
  foundations/                  # folder node
  glossary/                     # folder node
  splectrum/                    # splectrum node - also folder node
    modules/bm_spl/spl/         # package - folder node
      project/                  # api - folder node
        create/                 # method - folder node
```

**Same tools work everywhere:**

```
# Find all projects with LESSONS_LEARNED
$ spl select "//projects/*[@LESSONS_LEARNED.md]"

# Glossaries missing CHANGELOGs
$ spl select "//glossary/*[not(@CHANGELOG.md)]"

# Foundation docs with mycelium links
$ spl select "//foundations/*[@README.json]"
```

**One toolset for:**
- Module hierarchy (code)
- Repo structure (docs)
- Mycelium navigation (links)

The README.json files ARE the web links. `select` finds nodes, then spider via README.json to related nodes.

---

## Refined Folder-Node API

| Method | Purpose |
|--------|---------|
| `create` | Scaffold new structure (PAC) |
| `whoami` | Structural introspection |
| `select` | XPath-style structural + content queries |

**No structural `update` method** - Write/Edit + selfevals handles modifications. The safety net is validation via selfevals, not gatekeeping in the tool.

**`select` as condensed power:**

```
# Instead of: Glob → filter → Read each → check structure → Grep content
# Just:
select "//method[@_reqs contains 'CIP-003']"
```

Same power, denser expression. One line captures intent.

---

## Implications

1. **No separate "dev tools"** - they're just type methods
2. **Self-documenting** - PAC pattern provides functional help
3. **Consistent** - same invocation pattern for everything
4. **Layered** - type module present = tooling available
5. **Self-contained** - each folder node carries everything needed to understand it
6. **Lean tooling** - build what's needed, validate via selfevals

---

## Resolution Approach

**Runtime layer resolution with inheritance:**

```
Request: spl/project/whoami
  → Check spl/project/whoami/ folder → not found
  → Check type chain: project → api → container
  → Find whoami in container lib
  → Wrap and return
```

**How it works:**
- Folder exists → load index.js → wrap function → return `{ invoke() }`
- No folder → walk type chain → find function in type lib → wrap → return
- Same wrapping mechanism for both paths

**Inherited API as lib:**
```js
// _lib/container.js
module.exports = {
  create(record, { requireSpl }) {
    return {
      async whoami() { ... },
      async select() { ... },
      async create() { ... }
    }
  }
}
```

**Type chain extension:**
```js
// Container provides base: { whoami, select, create }
// API extends container: { ...container, listMethods }
// Method extends container: { ...container, invoke, test }
```

**Dev vs Prod:**

| Mode | Resolution | Why |
|------|------------|-----|
| Dev | Runtime chain walk | Flexible, no install step |
| Prod (now) | Same as dev | Works, no premature optimization |
| Prod (later) | Map lookup | Optional optimization if needed |

Mapping generation can be added at install time later - resolver uses map for fast lookup. For now, runtime resolution for both.

**Simplified method pattern (to test):**

Current methods have create/invoke boilerplate. Potentially simplify to just the function, let resolver wrap. Needs testing to confirm what can be simplified.

---

## Types as APIs

Types are APIs - they live in the module hierarchy like any other API:

```
modules/bm_spl/
  spl/
    container/              # type as API
      whoami/
      select/
      create/
    api/                    # type as API (extends container)
      list-methods/
    method/                 # type as API (extends container)
      invoke/
      test/
    project/                # regular API (extends api)
      create/
      plan/
```

**Not special, not separate.** Types are just APIs that other things inherit from.

**Type chain = API inheritance:**
- `spl/project` extends `spl/api`
- `spl/api` extends `spl/container`
- `spl/container` is base

Resolution walks the extends chain to find inherited methods.

### Type Module Disappears

By moving types to standard package structure, the separate type module concept dissolves:

**Before (conceptual):**
```
modules/
  bm_spl/       # base module
  type_spl/     # type module (separate)
  work_spl/     # work overlay
```

**After:**
```
modules/
  bm_spl/       # base module - includes container, api, method types
  work_spl/     # work overlay
```

Container and derived types become part of core `spl` package.

**Implementation approach:**
1. Implement in work module (`work_spl/`)
2. On completion, add to base module (`bm_spl/spl/`)
3. Gradually clean up existing spl module
4. Keep type module in place until useful stuff extracted into spl

**Overlay resolution impact (eventual):**
- No separate type layer to resolve
- Types are just APIs in spl package
- Inheritance via extends chain, not module layering
- Simpler resolution: work → base (two layers, not three)

*Note: Type module stays until migration complete - don't remove prematurely.*

### Data Structure and API Relationship

**One-to-one:** Named data structure ↔ API
- Each named data structure has exactly one API
- The API defines operations on that named structure

**One-to-many:** Actual data structure → APIs
- The same actual data structure can be named multiple times
- Each naming creates a distinct API

**Example:**
```
Actual structure: { inbox/, outbox/, state/ }

Named as "session"    → spl/session API
Named as "processor"  → spl/processor API
Named as "pipeline"   → spl/pipeline API
```

Same underlying shape, different APIs depending on how it's named/used.

---

## Container Structure

Standard container folder structure:

```
spl/container/
  _lib/
    lib.json            # task entrypoint
  _reqs/
    reqs.json           # task entrypoint
  _schemas/
    schemas.json        # task entrypoint
  _selfevals/
    selfevals.json      # task entrypoint
  _tests/
    tests.json          # task entrypoint
  README.md             # narrative documentation
  README.json           # mycelium web links (spiders all, including internal)
  index.js              # implementation
```

### Folder Naming Conventions

**Visible folders** - no underscore prefix
- Have README.md + README.json
- Human and AI readable
- Part of the navigable structure

**Internal folders** - underscore prefix (`_`)
- No README files
- Have task-specific entrypoint: `<foldername>.json` (without underscore)
- Machine-oriented, task-specific

### Two Entry Paths

| Mode | Entry Point | Purpose |
|------|-------------|---------|
| Explore | README.md / README.json | "I'm exploring, what is this?" |
| Execute | Task entrypoint (e.g., selfevals.json) | "I know what to do" |

No need to spider through README when you already know the task.

### README.json and whoami

README.json feeds directly into `whoami`:

**README.json provides (self):**
- What I am (type, purpose)
- My children (internal folders, methods)
- My links (mycelium web)

**whoami adds (context):**
- Parent (from path)
- Siblings (from parent's README.json or folder scan)
- Type chain (inheritance)

One source, no duplication. README.json is self-description, whoami combines with neighbourhood.

### Self-Similar Recursion

`spl/container/whoami` is a method - and as a method, it's also a container:

```
spl/container/whoami/
  _reqs/
  _selfevals/
  README.md
  README.json      ← describes whoami method
  index.js         ← implements whoami
```

Calling `spl/container/whoami/whoami` describes the whoami method itself. The method reads its own README.json the same way it reads anyone else's.

Turtles all the way down - self-similar structure just works.

---

## Req Decisions

### Plain Req v1.1.0

Updated plain req structure (projects/11-app-architecture/reqs/plain_req_v1.1.0.md):
- Type
- Extends (optional)
- Version (in preamble, not just filename)
- Spec
- Self-eval
- Comments (optional)
- Models (optional - populated at project closure)

Project is the transaction: req version becomes immutable at project closure. Model examples emerge from project work itself.

### Container Reqs Strategy

**One container req:** `container_v1.0.0.md` covers the full foundation (structure, conventions, patterns). The base carries the weight - derived types add fewer items.

**Method reqs:** Each method is its own container with its own req. Written as methods are implemented.

**API groupings:** Organizational only - goes in README.json. Lists which methods belong to which group (crud, types, xpath). Doesn't duplicate method details.

| Group | Methods |
|-------|---------|
| CRUD | create, delete |
| Types | isType, types, whoami |
| XPath | select, descendants, ancestors |

Grouping detail is API's concern. Member detail is member's concern.

---

## Work Items

1. **Session implementation change:**
   - Remove `spl.complete()` function - unnecessary
   - Rename `processing` folder to `processed`
   - Request processing completes in one go
   - Session handler decides on `processed` notification:
     - Push result to outbox, OR
     - Invoke another method (pipelining)
   - Decouples handler from request processing (spl1 had them integrated)
   - Enables more open approach to handlers

---

## Open Questions

1. Vocabulary: "container" for structural unit? (vs splectrum node)
2. Vocabulary: "event record" vs "state record"?
3. Exact type hierarchy - what inherits from what?
4. Where do type libs live in the structure?
5. Simplified method pattern - test and validate

---

## Origin

Emerged from discussion about how dev tools (create, update) should work. User insight: "mount the change tools on the types" - the type carries the API, instances inherit it. Combined with module layering, tooling can be present in dev but omitted in production.
