# SPL2 API Design and Implementation

**Location:** design/ spot - mutable design documentation
**Source:** Projects 03-08
**Current Version:** v0.4.0 (Module structure, executable selfevals, native vs wrapper APIs)
**Last Updated:** 2025-11-20 (Project 08 patterns: module structure, executable selfeval, API invocation model, native vs wrapper APIs with underscore convention)
**Status:** Active - accumulating detail from implementation, pre-rationalization phase
**Changelog:** See API_DESIGN_CHANGELOG.md

**Glossary References:** Terms in **bold** reference DSL_GLOSSARY.md or STEPPING_STONES_GLOSSARY.md

---

## Purpose

This document defines the architecture, design, and implementation approach for SPL2 APIs - the elementary building blocks of the Splectrum platform.

**Mutable design document:**
- Always represents current state of API design
- Protected by CHANGELOG tracking evolution
- Referenced by PRINCIPLES.md (foundations)
- Referenced by requirements documents (for broader context)
- Elements cataloged in DESIGN_REGISTER.md

---

## API as Elementary Building Block

### Definition

**API is the smallest standalone deployable unit in SPL2.**

An API is a collection of related methods that:
- Address a **single concern**
- Share a **common argument namespace**
- Operate on **shared state context**
- Deploy as a **single unit**
- Are **wholesome, standalone, and complete**

### API Package Structure

**Everything needed for an **api_node** in one package:**

```
[package]/[api]/
├── method1/
│   └── index.js                # Method implementation
├── method2/
│   └── index.js                # Method implementation
├── method3/
│   └── index.js                # Method implementation
├── _schemas/                   # Underscore prefix for auxiliary folders
│   ├── method1-input.avsc      # AVRO input schema
│   ├── method1-output.avsc     # AVRO output schema
│   ├── method2-input.avsc      # AVRO input schema
│   ├── method2-output.avsc     # AVRO output schema
│   └── api-state.avsc          # Shared API state schema
├── _help/                      # Underscore prefix for auxiliary
│   ├── api-help.md             # API-level help
│   ├── method1-help.md         # Method help
│   └── method2-help.md         # Method help
├── _tests/                     # Underscore prefix for auxiliary
│   ├── method1.test.js         # Tests = requirements
│   ├── method2.test.js         # Tests = requirements
│   └── api-integration.test.js # API-level integration tests
├── _requirements/              # Underscore prefix for auxiliary
│   └── api-requirements.md     # Requirements reference
└── package.json                # API metadata, dependencies
```

**Naming conventions:**
- **Method folders:** Named after method (e.g., `log/`, `error/`)
- **Method implementation:** Always `index.js` inside method folder
- **Auxiliary folders:** Underscore prefix (`_schemas/`, `_help/`, `_tests/`)
- **Schema files:** `{method}-input.avsc`, `{method}-output.avsc`
- **State schema:** `{api}-state.avsc`

**Co-located artifacts make API:**
- **Wholesome** - Everything needed to understand, use, validate API
- **Standalone** - No external dependencies to understand/deploy
- **Complete** - Code + schemas + help + tests + requirements together

**Tests as requirements:**
- Tests stored alongside code (not separate)
- Tests represent API requirements (what it must do)
- Tests validate API contract
- Tests = executable specification
- Help describes, tests verify

**Benefits:**
1. **Self-contained** - Everything in one place
2. **Discoverable** - Browse structure, find everything
3. **Deployable** - Package contains complete unit
4. **Verifiable** - Tests prove requirements met
5. **Documented** - Help artifacts explain usage
6. **Typed** - AVRO schemas define contracts
7. **Traceable** - Requirements reference for quality assessment

### Key Characteristics

1. **Single Concern**
   - Each API addresses one cohesive area of functionality
   - Methods within API are related by domain/purpose
   - If methods serve different concerns → separate APIs

2. **Argument Namespace Boundary**
   - API defines the namespace for arguments
   - Same concept = same name across all methods in the API
   - Consistency enforced at API level
   - Methods inherit API's namespace conventions

3. **State Context Scope**
   - API-level state shared by all methods
   - State persists for duration of pipeline invocation
   - Methods operate on shared state context
   - Stateless code with state backing pattern

4. **Deployment Unit**
   - API deploys as complete unit (all methods together)
   - Cannot deploy individual methods separately
   - External-facing artifacts carry requirement references
   - Version tracking at API level

---

## API Structure (MVP)

### Three-Layer Hierarchy

**MVP implements proven three-layer structure from spl1:**

```
[package]/[api]/[method]
```

**Example:**
```
deployment-mgmt/deploymentapi/build()
deployment-mgmt/deploymentapi/teardown()
deployment-mgmt/deploymentapi/validate()

state-mgmt/stateapi/transition()
state-mgmt/stateapi/snapshot()
```

### Layer Definitions

#### Package Level
- **Purpose:** Organizational grouping of related APIs
- **Contains:** Multiple APIs addressing related concerns
- **Example:** `deployment-mgmt` package contains deployment-related APIs

#### API Level
- **Purpose:** Concern boundary, namespace boundary, deployment unit
- **Contains:** Methods addressing single concern
- **Defines:** Argument namespace for all methods
- **State:** API-level state shared across methods
- **Example:** `deploymentapi` contains build, teardown, validate methods

#### Method Level
- **Purpose:** Individual operations (leaves/endpoints)
- **Contains:** Executable code implementing specific operation
- **Inherits:** API namespace, API state context
- **Callable:** Via CLI with arguments
- **Example:** `build()` method performs deployment build operation

---

## Argument Passing and Context

### Squash Pattern

**Design principle:** Arguments from multiple sources are squashed into a single flat ctx before method execution.

**Sources (in precedence order, later overrides earlier):**
1. Schema defaults
2. Package-level configuration
3. API-level configuration
4. Previous method output
5. Invocation arguments

**Framework squashes layers:**
```javascript
// Framework handles this (fire and forget)
const ctx = squash(schemaDefaults, packageConfig, apiConfig, previousOutput, invocationArgs);
```

**Method receives flat ctx:**
```javascript
async function processData(ctx) {
  const dataroot = ctx.dataroot;  // resolved from layers
  const filepath = ctx.filepath;  // resolved from layers
  // ... business logic
}
```

### JavaScript Access Pattern (Primary)

**Arguments accessed through ctx with optional chaining:**
```javascript
const dataroot = ctx?.dataroot;
const target = ctx?.deployment?.target;
const clean = ctx?.build?.clean;
```

**Override when needed:**
```javascript
// All input through ctx (preferred)
await deployment.buildapi.build(ctx);

// Explicit override
await deployment.buildapi.build(ctx, { clean: true });
```

### CLI Argument Mapping (Secondary)

**For CLI wrapper, multi-level syntax maps to ctx:**
```bash
# CLI syntax
deployment -workdir /project buildapi -target production build -clean true
```

**Maps to ctx:**
```javascript
{
  workdir: '/project',      // package-level
  target: 'production',     // api-level
  clean: true               // method-level
}
```

### Rationale

**Squash pattern enables:**
- Single access pattern (flat ctx with `?.`)
- Clear precedence (later overrides earlier)
- Framework handles complexity (fire and forget)
- Simpler data structures than spl1
- Defaults resolved at squash time, not scattered through access

---

## Invocation Levels and API Types (Project 07)

### Invocation at Any Level

**Invocation can occur at package, API, or method level:**

| Path | Level | Purpose |
|------|-------|---------|
| `spl` | Package | Package-level args (future) |
| `spl/console` | API | API-level args + state shaping |
| `spl/console/log` | Method | Method execution |

**Path depth determines invocation type:**
- 1 part: Package invocation
- 2 parts: API invocation
- 3 parts: Method invocation

**API-level invocation responsibilities:**
1. Set default arguments (baseline for all methods)
2. State shaping/maintenance (init, reset, cleanup)
3. Batch execution mode
4. Caretaker of API state (data/metadata)

**Method invocation responsibilities:**
1. Business logic execution
2. Input→output transformation
3. State updates as side effect

### API Input Structure

**API-level invocation input is composite:**

```javascript
await invoke('spl/console', {
  // Method defaults (known from method schemas)
  level: 'info',
  format: 'text',

  // Execution directive (transient, not stored)
  batch: [
    ['log', { message: 'Hello' }],
    ['error', { message: 'Oops' }]
  ],

  // API-specific (everything else)
  bufferSize: 1000
});
```

**Parsing logic:**
1. **Known method properties** → API defaults (flow to methods via merge)
2. **`batch`** → Execution directive (transient, not stored)
3. **Everything else** → API-specific (internal state management)

**Batch execution:**
- Transient - executed and gone, not stored in state
- Executes methods in sequence within API context
- Each batch item: `[methodName, methodArgs]`

### Schema-Driven Property Selection

**Method input schema defines which properties to merge:**

```javascript
// Method schema defines: { level, message, format, data }

// Merge picks only those properties from each layer:
const mergedInput = {};
for (const prop of methodSchema.fields) {
  // 1. API defaults (lowest)
  if (apiState.args[prop] !== undefined)
    mergedInput[prop] = apiState.args[prop];

  // 2. Output flow (middle)
  if (previousOutput?.[prop] !== undefined)
    mergedInput[prop] = previousOutput[prop];

  // 3. Method args (highest)
  if (args[prop] !== undefined)
    mergedInput[prop] = args[prop];
}
```

**Benefits:**
- Clean separation - API-specific properties never leak to methods
- No ambiguity about what gets merged
- Schema is single source of truth for method interface
- AVRO already has the field list

### Wrapper APIs vs DSL APIs

**Two API layers serve different purposes:**

| Layer | Purpose | Example |
|-------|---------|---------|
| **Wrapper API** | Thin pass-through to native objects | `spl/console/log` → `console.log()` |
| **DSL API** | Shaped for how we want to work | Higher-level abstractions, composition |

**Characteristics:**

**Wrapper APIs:**
- Mechanical 1:1 mapping to native
- Easy to generate, predictable
- Complete coverage of native surface
- Handle native quirks

**DSL APIs:**
- Reflect our patterns and workflow
- May combine multiple wrapper calls
- Designed for composition model
- Clear provenance to wrappers used

### Package Types

**Packages categorized by dependency profile:**

| Package Type | Dependencies | Purpose |
|--------------|--------------|---------|
| **core** | None (zero dependencies) | Essential for splectrum to run |
| **tools** | May depend on core | Utility wrappers |
| **api** | May depend on core, tools | Mixed wrapper + DSL APIs |

**Package type is metadata** - not part of invocation path. The path `spl/console/log` doesn't include package type; that's configuration.

---

## Boundary Validation Model (Project 07)

### Code Dangerously with External Safeguards

**Pattern:** Full internal access with quality control at boundaries only.

**How it works:**
1. **Boundary IN:** Validate input against schema at method entry
2. **Internal:** No validation - pure business logic, full access
3. **Boundary OUT:** Validate output against schema at method exit
4. **Quality Control:** Full state validation at pipeline end

**Why this works:**
- Methods become pure business logic (simpler, smaller)
- Trust the writer, verify the output
- Aligns with **autonomy** pattern: requirements stated → self-eval defined → freedom granted
- Opposite of defensive programming

**Example - method implementation:**
```javascript
// spl/console/log - Pure business logic, no validation
export default async function log(ctx, input) {
  // Input already validated at boundary
  const message = input.message;
  const format = input.format;

  // Business logic - no defensive checks needed
  let output;
  if (format === 'json') {
    output = JSON.stringify({ level: 'log', message });
  } else {
    output = `[LOG] ${message}`;
  }

  console.log(output);

  // Return result - validated at boundary
  return {
    output: { logged: true, level: 'log', message },
    console: { /* state updates */ }
  };
}
```

### Self-Evaluation Development Model

**Development harness with configurable self-eval:**

**Self-eval types:**
- **logic:** Business logic tests
- **safety:** Compliance (didn't modify runtime/execution)
- **qc:** Schema validation
- **codingStandards:** Structure, naming, patterns
- **performance:** Timing, resource usage
- **bugs:** Specific bug fix tests

**Single development routine for all work:**
1. Prime harness with requirement's self-eval content
2. Code
3. Trigger self-eval
4. Digest report
5. Fix issues
6. Repeat until all clear
7. Done

**Method requirements include self-eval spec:**
```javascript
{
  name: 'log',
  input: 'log-input.avsc',
  output: 'log-output.avsc',
  selfEval: ['logic', 'safety', 'qc']
}
```

**"Dumb execution, smart definition"** - define the requirement well, let execution run autonomously.

---

## Runtime and Execution Responsibilities (Project 07)

### Runtime Context

**Runtime provides environment context - read-only metadata for methods:**

```javascript
const runtime = {
  runtimeId: randomUUID(),
  startTime: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform
};
```

**Characteristics:**
- Created once at startup
- Read-only for all methods
- Environment properties, not business state
- Safety self-eval verifies not modified

### Execution Context

**Execution manages state and invocations:**

**Current responsibilities (v7):**
- Method invocation with common tasks (guid, timing)
- API state management across pipeline
- Schema-driven property selection for merge
- Self-eval coordination
- Output flow between methods (previousOutput)

**Future responsibilities:**
- Child request spawning (fresh/modified states)
- Bug report package on failure
- Data layer interface (mycelium)

**Pattern: Free scripting → API wrapping**

Runtime and execution are **utilities now**, formal **APIs later**:
- Don't force into API structure prematurely
- They have significant responsibilities that need more exploration
- Can iterate on patterns before committing to API structure
- Same approach as AVRO (use directly, wrap later)

### Context Structure

**ctx passed to methods:**

```javascript
ctx = {
  runtime: { runtimeId, startTime, nodeVersion, platform },
  execution: { executionId, invocationId, verbosity },
  [apiName]: {           // API's own state
    data: { ... },       // Business data
    metadata: { ... },   // Operational metadata
    args: { ... }        // API-level default arguments
  }
}
```

**API state structure (data/metadata/args):**
- **data:** Business state (invocationCount, bytesOutput)
- **metadata:** Operational info (lastOutputAt, configuredAt)
- **args:** API-level default arguments (format, level)

This aligns with Kafka record structure (value/headers).

---

## State Backing Architecture

### Principle: Stateless Code with State Backing

**Core concept:** Code is stateless, state is external and explicit.

```
State₁ → Process (stateless code) → State₂
```

### State Access - Flat Context with Optional Chaining

**Key insight:** Framework squashes layers into flat ctx. AI code accesses with optional chaining.

**The pattern:**
```javascript
// Access flat ctx with optional chaining
const dataroot = ctx?.dataroot;
const filepath = ctx?.runtime?.contextapi?.filepath;
const input = ctx?.input;
```

**Why optional chaining:**
- Minimal and complete data structures (absent property = doesn't exist)
- No empty scaffolding (wasteful chatter)
- Verbosity expresses real uncertainty (semantically correct)
- Native JS, TypeScript alignment

**Example - Pipeline method:**
```javascript
async function processPipeline(ctx) {
  // ctx = flat context (squashed by framework)

  const dataroot = ctx?.dataroot;
  const input = ctx?.input;

  // Business logic (stateless)
  const result = process(input);

  // Return new state (framework handles persistence)
  return {
    ...ctx,
    result,
    status: 'success'
  };
}
```

**Benefits:**
- **Simplicity:** Flat access, no getters/setters needed
- **Clarity:** Optional chaining shows uncertainty explicitly
- **Framework handles complexity:** Squash, persistence, state transitions
- **TypeScript support:** Types from AVRO schemas, IDE autocomplete

**Three-layer invocation architecture:**
```
Runtime API (method with state)
  ├─ State: runtime configuration, lifecycle
  │
  └─ Execution Context API (method with state)
      ├─ State: pipeline orchestration, context
      ├─ Provides: ctx object with getters/setters
      │
      └─ Pipeline API (method with state - single request)
          ├─ State: request-specific data
          └─ Uses: ctx to access/update state
```

**State nesting:**
```javascript
{
  runtime: {
    // runtime state
    version: "0.1.0",
    starttime: timestamp,

    executioncontext: {
      // execution context state
      pipelineid: "abc-123",
      dataroot: "/data",

      pipeline: {
        // pipeline/request state
        input: {...},
        result: {...},
        status: "processing"
      }
    }
  }
}
```

**Implementation pattern:**
- Runtime Context API implements `ctx` object
- Getters navigate nested structure: `ctx.getInput()` → `state.runtime.executioncontext.pipeline.input`
- Setters create new immutable state tree with updated value
- Pipeline methods receive `ctx`, use getters/setters, never touch structure directly

### State Context

**API-level state:**
- State backing occurs at API level
- All methods in API share state context
- State represented by Kafka records (immutable)
- State persists for pipeline duration

**State transitions:**
- Each method invocation: State_in → Method → State_out
- Immutable transitions (State_in unchanged)
- Complete metadata captured
- Audit trail of all state changes

### Implementation Pattern

**Methods receive state as parameter:**
```javascript
// Method signature pattern
function methodName(state, arguments) {
  // Stateless logic
  // Operate on state (read only)
  // Return new state
  return newstate;
}
```

**State object structure:**
- Current state (from Kafka record)
- API-level arguments (persisted context)
- Method-level arguments
- Metadata (timestamp, version, etc.)

### Kafka-Compatible Records

**State storage:**
- State backed by Kafka-compatible records
- Immutable record structure
- Complete metadata capture
- File-based storage initially (Kafka protocol later)

**Record Structure:**

```json
{
  "key": "record-identifier",
  "value": {
    // Data payload (state)
    // AVRO-serialized or JSON
  },
  "headers": [
    {
      "key": "package.api.method.propertyName",
      "value": "metadata-value"
    }
  ],
  "timestamp": 1699564800000,
  "offset": 12345  // (for Kafka compatibility)
}
```

**Component Usage:**

**Key:**
- Primary key for record identification
- On filesystem: folder structure can serve as PK
- Enables record lookup/retrieval

**Value:**
- Data payload (the actual state)
- AVRO-serialized (future) or JSON (MVP)
- Contains state data only, not metadata
- Substantive content being managed

**Headers:**
- Metadata only (not state data)
- Accessible without deserializing value
- Namespaced property names
- Operational information (input/output/execution metadata)

### API State Records (Not Simple Data Records)

**Key architectural insight:** These are API state records, not simple data records.

**Input/Output as Metadata:**

**Input data structure = metadata (in headers)**
- Method arguments passed as headers
- Overlay onto API record headers structure
- Example: `runtime.contextapi.filepath="/tmp/file.txt"`

**Output data structure = metadata (in headers)**
- Method results stored as headers
- Becomes input to next method (stays in headers)
- Example: `runtime.contextapi.status="success"`, `runtime.contextapi.rowcount="100"`

**Data = State (in value)**
- Actual content being managed
- Promoted from metadata when it becomes part of state
- Example: `parseddata`, `processedContent` in value

**Why this makes sense:**

1. **Input/output are operational** - Instructions, results, execution metadata
2. **State is substantive** - The actual content/data being managed
3. **Headers = metadata layer** - Accessible without deserializing value (Kafka philosophy)
4. **Value = data layer** - The payload, the state itself
5. **Metadata can be promoted to data** - When operational metadata becomes state

**Example flow:**

```javascript
// Method: processFile
// Input (metadata in headers):
//   runtime.contextapi.filepath = "/tmp/file.txt"
//   runtime.contextapi.operation = "parse"

// Process:
//   - Read file from filepath
//   - Parse content
//   - Generate result

// Output (metadata in headers):
//   runtime.contextapi.status = "success"
//   runtime.contextapi.rowcount = 100

// Promote to data (add to value):
{
  "value": {
    "parseddata": [...],  // Promoted - now part of state
    "sourcefile": "/tmp/file.txt"  // Promoted - tracking state origin
  }
}
```

**Metadata overlay pattern:**

Input structure overlays onto API record headers:
```javascript
// Input args (method invocation)
{ filepath: "/tmp/file.txt", operation: "parse" }

// Overlays as headers
[
  { key: "runtime.contextapi.filepath", value: "/tmp/file.txt" },
  { key: "runtime.contextapi.operation", value: "parse" }
]

// Next method sees these in headers (input to next operation)
```

**Benefits:**

1. **Headers stay lightweight** - Routing, filtering, inspection without deserializing
2. **Value contains state** - Rich data payload
3. **Clear separation** - Operational metadata vs substantive data
4. **Composability** - Output headers become input headers for next method
5. **Flexibility** - Metadata can be promoted to data when needed
6. **Kafka-compatible** - Uses Kafka patterns correctly

### Data Payload in Metadata (Design Pattern)

**Key insight:** Input/output metadata can contain the actual data payload (fully or partially).

**Pattern:** Data flows through headers for composability, accumulates in value for state.

**Example: File API**

```javascript
// File API manages file state
// File contents in value, operations through metadata

// write() method
{
  "key": "file-123",
  "headers": [
    {"key": "file.api.filepath", "value": "/tmp/myfile.txt"},
    {"key": "file.api.operation", "value": "write"},
    {"key": "file.api.content", "value": "Hello World"},  // Data payload in metadata!
    {"key": "file.api.timestamp", "value": "1699564800000"}
  ],
  "value": {
    "filecontents": "Hello World",  // Promoted from metadata to state
    "encoding": "utf-8",
    "size": 11
  }
}

// read() method - output
// Output metadata contains data for next method:
{
  "headers": [
    {"key": "file.api.operation", "value": "read"},
    {"key": "file.api.content", "value": "Hello World"},  // Data flowing to next method
    {"key": "file.api.status", "value": "success"}
  ]
}
```

**Flow:**

1. **Create/Update operations** - Data payload in input metadata
   - Input: `content="Hello World"` (in headers)
   - Process: Store in state
   - Promote: content → value.filecontents

2. **Read operations** - Data payload in output metadata
   - Process: Retrieve from value.filecontents
   - Output: `content="Hello World"` (in headers, passed to next method)

3. **Transform operations** - Data in both input and output metadata
   - Input: `content="raw data"` (in headers)
   - Process: Transform
   - Output: `content="transformed data"` (in headers, passed to next)

**Why this works:**

- **Composability** - Data flows through headers for method chaining
- **State persistence** - Data promoted to value for long-term state
- **Flexibility** - Data can flow through without being stored (transient)
- **Inspectability** - Headers accessible without deserializing value

**Glossary requirement:**

Common name needed for "data payload in metadata" - candidates:
- **content** - Generic, widely understood
- **value** - Aligns with key/value semantics
- **payload** - Explicit about purpose
- **data** - Simple and clear

**Recommended:** Use **content** as common name for data payload in metadata across all APIs.

**Glossary entry example:**

```markdown
## content
**Represents:** Data payload being passed/transformed
**Type:** Any (string, object, array - context dependent)
**AVRO Schema:** Varies by API (but name consistent)
**Used by:** All data-handling APIs (file, data-processing, transform, etc.)
**Context:** Used in input/output metadata (headers) to pass data between methods
**Example:**
  - Text: "Hello World"
  - JSON: {"key": "value"}
  - Binary: [base64 encoded]
**Notes:**
  - Different from operational metadata (status, timestamp)
  - Can be promoted to state (value property)
  - Schema/type varies by API, but name consistent
```

**Design implications:**

1. **APIs managing data structures** - Must handle content in metadata
2. **AVRO schemas** - Define schema for content appropriate to API
3. **Method signatures** - Accept content in input, provide content in output
4. **State management** - Decide when content promotes to value vs stays transient
5. **Type safety** - Content schema varies, but name consistent

**Examples of APIs using content:**

- **file.api** - content = file contents (string/binary)
- **json.api** - content = JSON object
- **transform.api** - content = data being transformed
- **parser.api** - content = raw input / parsed output
- **validation.api** - content = data being validated

**Record Scope:**
- One record per API invocation (API-level scope)
- Not per method - methods within API share the record
- API execution creates/updates record
- State flows through methods within same API record

**Header Namespacing:**

**spl2 approach (differs from spl1):**
- Property naming at API level (not method level)
- Methods use API-namespaced properties
- API record can have default property values
- Method input provides values; if not provided, uses API default

**Pattern options under discussion:**

**Option 1: AVRO convention style**
```
com.splectrum.runtime.contextapi.timestamp
com.splectrum.runtime.contextapi.version
com.splectrum.pipeline.processapi.duration
```

**Option 2: Simplified (package.api.property)**
```
runtime.contextapi.timestamp
runtime.contextapi.version
pipeline.processapi.duration
```

**Key difference from spl1:**
- spl1: `package.api.method.property` (method-level namespacing, shared metadata storage)
- spl2: `package.api.property` (API-level namespacing, API-scoped records)

**Rationale for API-level property naming:**
- API is the namespace boundary (consistent with design)
- All methods in API share property namespace
- Simplifies composition (same property name across methods)
- API record provides defaults, method input overrides

**Shared Namespace: Methods and Properties**

**Decision:** Methods and properties share the same namespace within an API.

**Example:**
```
runtime.contextapi.init          // method
runtime.contextapi.getstate      // method
runtime.contextapi.timestamp     // property
runtime.contextapi.dataroot      // property
runtime.contextapi.version       // property
```

All share namespace: `runtime.contextapi.*`

**Rationale:**
1. **Consistency** - API is the namespace boundary for everything
2. **Forces good naming** - Collisions (method and property with same name) force clearer names
3. **Programming semantics** - Like code: can't have function and variable with same name in scope
4. **Simpler mental model** - One flat namespace per API, not separate sub-namespaces
5. **Natural discoverability** - `runtime.contextapi -h` shows both methods AND properties

**Handling collisions:**
- If collision occurs, it's a naming problem - choose clearer names
- Examples:
  - `configure()` method + `config` property
  - `setConfig()` method + `currentConfig` property
- Benefit: Forces intentional, clear naming from the start

**What appears in namespace:**
- All methods (operations)
- All properties (configuration/state)
- Help accessible at API level shows both

**Benefits of namespacing:**
- Aligns with AVRO schema namespacing conventions
- Clear provenance (which API/package)
- Prevents collisions across packages/APIs
- Compatibility (multiple versions can coexist)
- Discoverability (filter by package/API)

**Metadata examples:**
- Timestamps (when method executed)
- Version information (schema version, API version)
- Execution status (success, error)
- Duration/performance metrics
- Correlation/tracing IDs
- User/system context
- State transition information

**Record characteristics:**
- Immutability enforced (records never modified, only new records created)
- Versioned schema (AVRO - future)
- Complete audit trail (timestamps, provenance in headers)
- Enables state reconstruction (replay records)

**File-based storage (MVP):**
- Records stored as JSON files
- Folder structure for keys/topics
- Compatible with Kafka structure
- Can migrate to actual Kafka later

### Filesystem as Kafka Storage (Implementation Detail)

**Key insight:** When storing Kafka-compatible records on filesystem, the file IS the Kafka record.

**The Inversion:**

Traditional file storage:
```
/data/myfile.txt
Contents: "Hello World"
```

Kafka-compatible storage:
```
/data/myfile.json  ← This file IS the Kafka record

Contents of /data/myfile.json:
{
  "key": "file-123",
  "headers": [
    {"key": "file.api.filepath", "value": "/original/path/myfile.txt"},
    {"key": "file.api.timestamp", "value": "1699564800000"},
    {"key": "file.api.encoding", "value": "utf-8"},
    {"key": "file.api.operation", "value": "write"}
  ],
  "value": {
    "filecontents": "Hello World"  ← Original file contents here
  }
}
```

**What this means:**

The original file's contents become the `value` property of the Kafka record. The filesystem file stores the entire Kafka record (headers + value), not just the original file contents.

**Example - Managing a text file:**

```javascript
// Original file: /tmp/data.txt containing "Hello World"

// SPL2 representation on filesystem: /storage/data-txt.json
{
  "key": "data-txt",
  "timestamp": 1699564800000,
  "headers": [
    {"key": "file.api.filepath", "value": "/tmp/data.txt"},
    {"key": "file.api.size", "value": "11"},
    {"key": "file.api.encoding", "value": "utf-8"},
    {"key": "file.api.lastmodified", "value": "1699564800000"}
  ],
  "value": {
    "filecontents": "Hello World",
    "originalpath": "/tmp/data.txt"
  }
}
```

**Benefits:**

1. **Everything is a Kafka record** - Uniform storage model across system
2. **Filesystem becomes Kafka topic** - Files are records, directories are topics/partitions
3. **Metadata travels with data** - Headers + value always together
4. **Immutability** - Records immutable, create new file for changes (append-only semantics)
5. **Audit trail** - All metadata preserved (who, when, what, why)
6. **Replay-able** - Can reconstruct state from records
7. **Migration path** - Move from filesystem to actual Kafka without changing model

**Storage patterns:**

**Folder structure as topics/partitions:**
```
/storage/
├── file-topic/
│   ├── partition-0/
│   │   ├── 00000000000000000000.json  (offset 0)
│   │   ├── 00000000000000000001.json  (offset 1)
│   │   └── 00000000000000000002.json  (offset 2)
│   └── partition-1/
│       └── 00000000000000000000.json
└── data-topic/
    └── partition-0/
        └── 00000000000000000000.json
```

**Key as folder (alternative):**
```
/storage/
├── by-key/
│   ├── file-123.json  (key = file-123)
│   ├── file-456.json  (key = file-456)
│   └── data-abc.json  (key = data-abc)
```

**Implications for API design:**

1. **File APIs don't manage files directly** - They manage Kafka records that represent files
2. **Reading a file** - Deserialize record, extract value.filecontents
3. **Writing a file** - Create new record with content in value
4. **File metadata** - Stored in headers (accessible without deserializing)
5. **Immutability** - New version = new record (append-only)

**Example API methods:**

```javascript
// file.api.write()
// Input: filepath="/tmp/data.txt", content="Hello World"
// Creates Kafka record on filesystem with content in value

// file.api.read()
// Input: filepath="/tmp/data.txt"
// Reads Kafka record from filesystem, returns value.filecontents in output metadata

// file.api.append()
// Input: filepath="/tmp/data.txt", content=" More text"
// Creates new Kafka record with updated content in value
```

**Why this approach:**

- **Uniform data model** - Everything is a Kafka record (files, state, data)
- **Rich metadata** - Files carry execution context, provenance
- **Composability** - Files can be inputs/outputs in pipelines like any other record
- **Immutability** - Files become immutable records (versioned, auditable)
- **Kafka compatibility** - Seamless migration to actual Kafka when needed

---

## Runtime State Stack Architecture

### Three-Layer Nested Structure

**Architecture:** State nesting through Kafka record value properties.

**Layers:**
1. **Runtime Context** (top level)
2. **Execution Context(s)** (nested in runtime value)
3. **Pipeline API Records** (nested in execution context value)

### Structure Design

**Runtime Context Record:**
```json
{
  "key": "runtime-123",
  "timestamp": 1699564800000,
  "headers": [
    // Runtime properties in headers (metadata/configuration)
    {"key": "runtime.context.version", "value": "0.1.0"},
    {"key": "runtime.context.starttime", "value": "1699564800000"},
    {"key": "runtime.context.maxcontexts", "value": "10"},
    {"key": "runtime.context.config.loglevel", "value": "info"}
    // Shared configuration, resource info, etc.
  ],
  "value": {
    // Execution contexts directly in value (numbered keys)
    "1": {
      // Execution Context RECORD (full Kafka record)
      "key": "exec-123",
      "timestamp": 1699564800500,
      "headers": [
        {"key": "runtime.executioncontext.dataroot", "value": "/tmp"},
        {"key": "runtime.executioncontext.requestid", "value": "req-abc"}
      ],
      "value": {
        // Pipeline API state records (namespaced by package.api)
        "tools.git": {
          // Git API state RECORD (full Kafka record)
          "key": "git-op-123",
          "timestamp": 1699564800600,
          "headers": [
            {"key": "tools.git.operation", "value": "clone"},
            {"key": "tools.git.repo", "value": "github.com/user/repo"},
            {"key": "tools.git.status", "value": "success"}
          ],
          "value": {
            // Git API state data
            "clonepath": "/tmp/repo",
            "commithash": "abc123"
          }
        },
        "tools.7zip": {
          // 7zip API state RECORD
          "key": "7zip-op-456",
          "headers": [
            {"key": "tools.7zip.operation", "value": "compress"},
            {"key": "tools.7zip.format", "value": "7z"}
          ],
          "value": {
            "archivepath": "/tmp/archive.7z",
            "compressedsize": 1024
          }
        },
        "spl.parser": {
          // Parser API state RECORD
          "key": "parser-op-789",
          "headers": [
            {"key": "spl.parser.format", "value": "json"},
            {"key": "spl.parser.status", "value": "success"}
          ],
          "value": {
            "parseddata": { /* parsed content */ }
          }
        }
      }
    }
    // Future: "2", "3", etc. for parallel execution
  }
}
```

**Structure summary:**

**Runtime Context Record:**
- **Headers:** Runtime properties (version, config, resource info) - metadata
- **Value:** Execution contexts (numbered "1", "2", "3"...) - state

**Execution Context Record (nested in runtime value):**
- **Headers:** Execution context properties (dataroot, requestid) - metadata
- **Value:** Pipeline API records (namespaced by package.api) - state

**Pipeline API Record (nested in execution context value):**
- **Headers:** API method inputs/outputs, operational metadata
- **Value:** API state data
- **Namespace:** `[package].[api]` format (tools.git, tools.7zip, spl.parser)

**Nesting pattern:**
- Runtime value contains execution context records (numbered keys)
- Execution context value contains pipeline API records (namespaced by package.api)
- Each layer is a full Kafka record (key/headers/value)
- Headers = metadata at each level, Value = state at each level

### Numbered Execution Contexts

**Pattern:** Map with string number keys ("1", "2", "3"...)

**MVP Constraint:** Only key "1" exists (single execution context)

**AVRO Schema:**
```json
{
  "type": "record",
  "name": "RuntimeContext",
  "fields": [
    {
      "name": "value",
      "type": {
        "type": "map",
        "values": "ExecutionContext"  // Map<String, ExecutionContext>
      }
    }
  ]
}
```

**Why numbered keys directly in value:**

1. **Array-equivalent** - `value["1"]` mirrors JS array semantics
2. **Clean separation** - Runtime properties in headers, contexts in value
3. **No extra nesting** - Simpler structure, direct access
4. **Clear sequencing** - Numbers indicate order/thread ID
5. **Future growth** - Add more contexts = more parallelism
6. **No breaking change** - MVP (just "1") to multi-context (add "2", "3"...) is additive
7. **Consistent pattern** - Headers=metadata, value=state at every level

### Multi-Threading via Numbered Contexts

**Primary use case:** Parallel request processing from queues.

**Architecture:**
```
Request Queue (AVRO RPC or Folder Queue)
     ↓
Runtime Context (shared across threads)
     ├─ Execution Context "1" (worker thread 1) → processing request A
     ├─ Execution Context "2" (worker thread 2) → processing request B
     ├─ Execution Context "3" (worker thread 3) → processing request C
     └─ Execution Context "4" (worker thread 4) → idle/ready
```

**How it works:**

1. **Request arrives** - Added to queue (AVRO RPC or folder-based)
2. **Worker available** - Execution context "N" picks up request
3. **Isolated execution** - Request processes in its own execution context
4. **Shared resources** - All workers share runtime (connection pools, config, caches)
5. **Complete** - Context ready for next request
6. **Thread safety** - Each context isolated, no cross-contamination

**Benefits:**

- **Natural concurrency** - Numbered contexts = concurrent workers
- **Thread isolation** - Each execution context owned by one thread
- **Shared runtime** - Common resources, configuration at runtime level
- **No locking on execution contexts** - Each thread owns its context
- **Scalability** - Add contexts = add parallelism
- **Clean boundaries** - Thread-local (execution context) vs shared (runtime)

**Queue types:**

**AVRO RPC Request Queue:**
- Requests arrive via AVRO RPC
- Queue distributes to available execution contexts
- Each request processes in isolated context
- Response sent back via RPC channel

**Folder Queue:**
- Files dropped in folder represent queued requests
- File watcher feeds to available execution contexts
- Each file processed in isolated context
- Results written to output folder

**MVP to Production path:**

- **MVP (Project 03):** Single context "1" (sequential execution, prove pattern)
- **Production:** Multiple contexts "1"-"N" (parallel execution, handle load)
- **No breaking change:** Structure supports both, just add more numbered contexts

### Shared vs Isolated Concerns

**Runtime Context (shared across threads):**
- Configuration (common settings)
- Resources (connection pools, caches)
- Resource limits (max threads, memory)
- Lifecycle management (startup, shutdown)
- Monitoring/metrics aggregation

**Execution Context (isolated per thread):**
- Request-specific data (dataroot, inputs)
- Pipeline state (API records)
- Execution metadata (timing, status)
- Thread-local state
- No sharing between contexts (thread-safe by isolation)

**Pipeline API Records (isolated within execution context):**
- API-specific state
- Method inputs/outputs (in headers)
- Data payload (in value)
- Namespaced by package.api

### State Flow Through Layers

**Framework handles internal structure. AI code accesses flat ctx.**

**Internal structure (framework manages):**
```javascript
// Runtime state with nested execution contexts
// AI code never navigates this directly
{
  runtime: {
    version: "0.1.0",
    executioncontext: {
      "1": {
        dataroot: "/tmp",
        pipeline: { /* API records */ }
      }
    }
  }
}
```

**AI code uses flat ctx with optional chaining:**
```javascript
// Framework squashes layers into flat ctx
const version = ctx?.version;
const dataroot = ctx?.dataroot;
const filepath = ctx?.filepath;
const operation = ctx?.git?.operation;

// Return new state (framework handles persistence)
return {
  ...ctx,
  result: processedData,
  status: 'success'
};
```

**Framework responsibilities:**
- Squash layers into flat ctx before method runs
- Persist state changes after method returns
- Manage nested structure internally
- Handle execution context isolation

### MVP Implementation (Project 03)

**For hello world:**
- Single runtime context
- Single execution context (key "1")
- 2-3 pipeline APIs demonstrating pattern
- Sequential execution (prove structure works)
- ctx object with basic getters/setters

**Structure proven, parallelism deferred:**
- Structure supports multi-threading
- Implementation remains sequential for MVP
- Future: add more contexts + thread pool + queue processing

---

## Method Invocation Patterns

### JS-Callable Primary, CLI Secondary

**Design principle:** All API methods are JavaScript functions. CLI is a secondary wrapper for human convenience ("AI absent" mode).

**Primary invocation (AI writes code):**
```javascript
await runtime.contextapi.init(ctx);
await pipeline.processapi.execute(ctx);
await pipeline.validateapi.check(ctx);
```

**Secondary invocation (CLI wrapper for humans):**
```bash
runtime/contextapi/init -dataroot /tmp
```

**Benefits of JS-primary:**
1. Type safety - TypeScript types from AVRO schemas
2. IDE support - autocomplete, refactoring, static analysis
3. Full language - conditionals, loops, error handling
4. No strings - typed function calls
5. Composability - JS is the composition language

### JavaScript Composition (Primary)

**Simple pipeline:**
```javascript
async function processWorkflow(ctx) {
  await runtime.contextapi.init(ctx);
  await pipeline.processapi.execute(ctx);
  await pipeline.validateapi.check(ctx);
}
```

**Conditional logic:**
```javascript
const result = await pipeline.processapi.execute(ctx);
if (result.status === 'error') {
  await pipeline.errorapi.handle(ctx);
} else {
  await pipeline.validateapi.check(ctx);
}
```

**Loops:**
```javascript
for (const item of items) {
  await pipeline.processapi.execute(ctx, { input: item });
}
```

**How composition works:**
- State flows through ctx (mutated or replaced by framework)
- JS provides all control flow (no separate DSL needed)
- Methods are async functions, composition is await chains
- Framework handles squashing layers into ctx before code runs

### CLI Invocation (Secondary - "AI Absent" Mode)

**For humans operating without AI collaboration:**
```bash
runtime/contextapi/init -dataroot /tmp
pipeline/processapi/execute -input data.json
```

**Chaining with `@@` operator:**
```bash
runtime/contextapi/init -dataroot /tmp @@ \
pipeline/processapi/execute -input data.json @@ \
pipeline/validateapi/check
```

**CLI is wrapper over JS:**
- Parses arguments, builds ctx
- Calls underlying JS function
- Help generated from AVRO schemas

### Dynamic Composition

**With JS as primary, dynamic composition is just JavaScript:**

```javascript
// Dynamic method sequences
const methods = ['init', 'process', 'validate'];
for (const method of methods) {
  await api[method](ctx);
}

// Parameterized composition
async function runWorkflow(ctx, config) {
  await runtime.contextapi.init(ctx);

  for (const step of config.steps) {
    await pipeline[step.api][step.method](ctx, step.args);
  }
}

// Conditional flows
if (ctx?.mode === 'production') {
  await pipeline.validateapi.strict(ctx);
} else {
  await pipeline.validateapi.basic(ctx);
}
```

**No special batch syntax needed:**
- JS provides loops, conditionals, dynamic property access
- Full language power for composition
- Type safety maintained with TypeScript
- Error handling with try/catch

---

## Scripting-to-API Promotion Pattern

### Prerequisites for Autonomy

**HAICC requires before availing of autonomy:**
1. Requirements stated (what am I trying to achieve?)
2. Self-evaluation tools defined (how will I verify?)

**Then free scripting is granted** - full internal access, no artificial constraints.

### Free Scripting with Full Internal Access

**AI can script freely with full access to internal structures:**

```javascript
// Free scripting - direct access to metadata and data
const records = ctx?.mycelium?.topic?.records;
const metadata = records?.map(r => r.headers);
const transformed = customLogic(metadata, records);
```

**Why this is powerful:**
- No artificial constraints during exploration
- Full metadata/data access when needed
- Natural experimentation without penalty
- Internal access becomes "legal" once wrapped in API method

### Requirements, Scripting, and Self-Evaluation

**The complete workflow:**

```javascript
// REQUIREMENTS:
// - Transform mycelium records by extracting timestamp metadata
// - Filter records older than threshold
// - Return filtered set with computed age field

// SELF-EVALUATION TOOLS:
// - Check timestamp extraction from headers
// - Verify threshold filtering (default and custom)
// - Confirm computed age field present
// - Test optional chaining for missing data

// SCRIPT:
async function filterOldRecords(ctx) {
  const threshold = ctx?.threshold ?? 86400000; // default 24h
  const records = ctx?.mycelium?.topic?.records;

  return records
    ?.filter(r => r.headers?.timestamp < Date.now() - threshold)
    ?.map(r => ({
      ...r,
      computed: { age: Date.now() - r.headers?.timestamp }
    }));
}

// SELF-EVALUATION:
// ✓ Extracts timestamp from metadata (headers)
// ✓ Filters by threshold (configurable, with default)
// ✓ Computes age field
// ✓ Handles missing data with optional chaining
// → Ready for filing decision
```

### Filing Decision - Navigation Not Design

**After successful self-evaluation, determine where to file.**

**The structure guides the filing:**
- Package structure shows organizational groupings
- Existing APIs show which concerns live where
- API glossary defines naming conventions
- AVRO schemas define data structures each API owns

**Filing is pattern matching:**

```javascript
// FILING DECISION:

// 1. Which package?
//    Look at existing: runtime/, data/, tools/, pipeline/
//    This filters records → runtime infrastructure
//    → Package: runtime

// 2. Which API?
//    Look at runtime/ APIs: contextapi, filterapi, lifecycleapi
//    My code filters records → filterapi exists
//    → API: filterapi

// 3. What method name?
//    Look at filterapi methods: bytype, bystatus, bydate...
//    My code filters by age → follows "by___" pattern
//    → Method: byage

// FILING: runtime/filterapi/byage
```

**Self-evaluate the filing:**
- ✓ Package aligns with concern (infrastructure)
- ✓ API owns this data structure (filter operations)
- ✓ Method name follows glossary pattern
- → File it

### Vocabulary Extension

**When filing reveals vocabulary gap:**

```javascript
// FILING DECISION:
// → This manages P2P peer connections
// → No existing package fits
// → No existing API addresses this concern

// PROPOSAL: New vocabulary needed
// - Package: p2p (new - follows pattern: lowercase, domain)
// - API: peerapi (new - follows pattern: concern + api)
// - Method: connect (follows pattern: verb for operations)

// SELF-EVALUATE PROPOSAL:
// ✓ Package name follows existing patterns
// ✓ API name follows existing patterns
// ✓ Method name aligns with glossary conventions
// → Propose addition to API glossary
```

**Glossary grows through use:**
- Scripting creates new capability
- Filing reveals vocabulary gap
- Propose addition following established patterns
- Self-evaluate the proposal
- Glossary extends (not speculative, evidence-based)

### Promotion to API Method

**File the script in the determined location:**

```
Script with successful self-evaluation
    ↓
Filing decision (navigate structure)
    ↓
Place in [package]/[api]/methods/
    ↓
Add AVRO schemas (input/output)
    ↓
Now it's an API method
```

**External callers see clean interface:**
```javascript
await runtime.filterapi.byage(ctx);
```

**Internal complexity hidden.** The full metadata/data access that was "free scripting" is now encapsulated inside the API boundary.

### Why This Works

**Frictionless transition:**
- Same code, different location
- Structure guides filing (navigation, not design)
- Fire and forget - write it, file it, it's an API

**Trust through discipline:**
- Requirements + self-evaluation tools before scripting
- Honest self-assessment after
- Filing decision self-evaluated
- Accurate self-evaluation expands autonomy over time

**Structure provides guardrails:**
- Packages show where concerns live
- APIs show data structure ownership
- Glossary ensures naming consistency
- Filing becomes pattern matching

---

## API Compilation and Script Integration (Future Enhancement)

### Script-to-API Compilation (Two-Level Strategy)

**Concept:** Two-level compilation enables granular design with performant deployment.

**Level 1: Script → Programmatic Pipeline Structure**
```bash
# Input: Command-line script
runtime/contextapi/init -dataroot /tmp @@ \
pipeline/processapi/execute -input data.json @@ \
pipeline/validateapi/check

# Level 1 compilation: Programmatic structure (preserves granularity)
compiler-api/compile-script -level 1 \
  -script "..." \
  -output workflow-api/process-and-validate
```

**Level 1 output (programmatic, granular):**
```javascript
// workflow-api/process-and-validate.js (Level 1)
async function processAndValidate(ctx, input) {
  let state = await runtime.contextapi.init(ctx, { dataroot: '/tmp' });
  state = await pipeline.processapi.execute(state, { input });
  state = await pipeline.validateapi.check(state);
  return state;
}
```

**Characteristics:**
- Preserves granular method calls
- Human-readable structure
- Easy to debug/modify
- Each method call visible
- Useful for development and debugging

**Level 2: Programmatic Pipeline → Single Compiled Method (Optimized)**
```bash
# Level 2 compilation: Optimize to single method
compiler-api/compile-script -level 2 \
  -input workflow-api/process-and-validate.js \
  -output workflow-api/process-and-validate-optimized
```

**Level 2 output (compiled, optimized):**
```javascript
// workflow-api/process-and-validate-optimized.js (Level 2)
// Inlined, optimized single method
// (implementation details abstracted away for performance)
async function processAndValidateOptimized(ctx, input) {
  // Compiled/inlined version
  // - Method calls inlined
  // - Intermediate state transitions optimized
  // - Single execution path
  // - Production-ready performance
}
```

**Characteristics:**
- Performant single method call
- Optimized execution
- Inlined operations
- Production deployment target
- Reduced overhead

**Reversibility for Debugging:**

**Decompose compiled method back to granular:**
```bash
# Bug found in production (Level 2 optimized version)
# Decompose back to Level 1 for inspection
compiler-api/decompile \
  -method workflow-api/process-and-validate-optimized \
  -output workflow-api/process-and-validate-debug
```

**This enables:**
1. **Design at granular level** - Small, composable methods (Level 1)
2. **Deploy optimized** - Performant single method (Level 2)
3. **Debug at granular level** - Decompose for inspection
4. **Iteration cycle** - Granular → Optimize → Deploy → Debug → Granular

**Benefits:**
1. **Design flexibility** - Work at method level, don't worry about performance
2. **Production performance** - Deployed code is optimized
3. **Debuggability** - Decompose compiled code back to understandable structure
4. **Best of both worlds** - Composability + performance
5. **Iterative refinement** - Design, optimize, test, refine

**Compilation metadata:**
- Level 2 methods include metadata linking back to Level 1 source
- Source maps for compiled methods (like JavaScript source maps)
- Decompi preserved composition structure
- Version tracking (which Level 1 produced this Level 2?)

### JS/Bash Script Wrapping

**Concept:** API that wraps existing scripts into SPL2 API methods.

**JavaScript wrapping:**
```bash
# Wrap existing JS script
wrapper-api/wrap-js \
  -script /path/to/existing-script.js \
  -input-schema input.avsc \
  -output-schema output.avsc \
  -api mytools-api \
  -method process-data
```

**Bash wrapping:**
```bash
# Wrap existing bash script
wrapper-api/wrap-bash \
  -script /path/to/deploy.sh \
  -input-schema input.avsc \
  -output-schema output.avsc \
  -api deployment-tools-api \
  -method legacy-deploy
```

**Benefits:**
1. **Integration** - Bring existing tools into SPL2 ecosystem
2. **Gradual migration** - Don't rewrite everything, wrap and integrate
3. **Leverage existing** - Use proven scripts with SPL2 benefits
4. **State backing** - Existing scripts get state management, composition
5. **Type safety** - AVRO schemas wrap untyped scripts

**Wrapping requirements:**
- Define input/output AVRO schemas for wrapped script
- State adapter (how does script access/update state?)
- Error handling (convert script errors to state transitions)
- Help generation (auto-generate from script or manual definition)

**Implementation considerations:**
- **Input/output mapping** - How to map AVRO to script arguments/results?
- **State access** - Wrapped script needs ctx access (inject as environment? JSON file?)
- **Execution isolation** - Sandboxing, resource limits
- **Error propagation** - Script failures become error states
- **Performance** - Process spawning overhead vs native API methods

### Meta-Level Architecture

**APIs that create APIs:**
- `compiler-api` - Compiles scripts to API methods
- `wrapper-api` - Wraps JS/Bash scripts as API methods
- `generator-api` - Generates API scaffolding (future)
- `schema-api` - Manages AVRO schemas (future)

**This enables:**
- **Extensibility** - System can grow through composition and compilation
- **Integration** - Existing tools become first-class citizens
- **Evolution** - Ad-hoc work graduates to formal APIs
- **AI assistance** - Generate APIs from descriptions (future with DSL engine)

**Status:** Future enhancement - capture in CIP during project closure

**When to implement:**
- After core execution model proven (Twin Pairs 2-4)
- After AVRO schema system operational
- When integration needs emerge
- With proper sandboxing/isolation infrastructure

### Discovery and Help System

**AVRO is the specification. Help is generated from AVRO.**

**AI discovery (primary):**
```javascript
// Import TypeScript types generated from AVRO
import { InitInput, InitOutput } from 'runtime/contextapi/schemas';

// IDE provides autocomplete, type checking
const input: InitInput = { dataroot: '/tmp' };
```

**AI reads AVRO schemas directly:**
- Full type information
- Field descriptions, defaults, constraints
- Schema evolution history
- No separate help artifacts needed

**CLI help (secondary - for humans):**
```bash
runtime/contextapi -h
# Output generated from AVRO:
#   Available methods in contextapi
#   - init: Initialize execution context
#   - getstate: Retrieve current state

runtime/contextapi/init -h
# Output generated from AVRO:
#   Arguments:
#     -dataroot <path>: Root directory for data (required)
#     -config <file>: Configuration file (optional)
```

**AVRO as single source:**
- Schemas define the contract (types, constraints, descriptions)
- TypeScript types generated for AI code
- CLI help generated for human convenience
- Tests validate the contract (tests as requirements)
- No separate help artifacts to maintain

**Benefits:**
- Single source of truth (AVRO schemas)
- AI gets full type support (TypeScript)
- Humans get CLI help (generated)
- No documentation drift

### JavaScript API (Primary)

**JS is the primary invocation method. CLI is secondary wrapper.**

**Primary - AI writes JavaScript:**
```javascript
async function workflow(ctx) {
  await runtime.contextapi.init(ctx);
  await pipeline.processapi.execute(ctx);
  await pipeline.validateapi.check(ctx);
}
```

**With TypeScript types from AVRO:**
```typescript
import { InitInput } from 'runtime/contextapi/schemas';

async function workflow(ctx: Context) {
  const input: InitInput = { dataroot: '/tmp' };
  await runtime.contextapi.init(ctx, input);
  // ...
}
```

**Secondary - CLI for humans ("AI absent" mode):**
```bash
runtime/contextapi/init -dataroot /tmp @@ \
pipeline/processapi/execute -input data.json @@ \
pipeline/validateapi/check
```

**Why JS primary:**
1. **AI's natural invocation** - writes code, calls functions
2. **Type safety** - TypeScript from AVRO schemas
3. **Full language** - conditionals, loops, error handling
4. **IDE support** - autocomplete, refactoring, static analysis
5. **No strings** - typed function calls

**CLI as wrapper:**
- Parses arguments, builds ctx
- Calls underlying JS functions
- Help generated from AVRO
- For humans operating without AI collaboration

**Implementation:**
- JS functions are the methods
- CLI wrapper calls JS functions
- Same execution, different entry point

### Implementation Approach

**MVP:**
- JS functions as methods (primary invocation)
- TypeScript types generated from AVRO schemas
- Direct imports for type safety and IDE support
- Framework handles ctx squashing and state persistence
- npm scripts for convenience: `npm run build`, `npm run validate`

**Near-term:**
- Console API exploration validates patterns
- AVRO schema definitions for core APIs
- TypeScript type generation pipeline
- Squash pattern implementation
- Basic CLI wrapper for "AI absent" mode

**Future:**
- Full CLI wrapper with help generation from AVRO
- Advanced state persistence (Kafka integration)
- Schema evolution tooling
- Performance optimization

### Validation Pattern

**No traditional unit tests initially:**
- Validation scripts instead of test framework
- Self-contained scripts validate functionality
- CLI-callable validation proves deployment
- Test framework deferred until needed

**Rationale:**
- Methods already CLI-callable
- Validation scripts simpler than test infrastructure
- Sufficient for MVP
- Test framework when evidence shows need

---

## Artifact Identification

### Current: Requirement Reference Stamping

**Every code file includes requirement reference header:**

```javascript
// Requirements: ../Twin_pair_X_requirements_v1.0.0.md
```

**Purpose:**
- Traceability to requirements
- Quality assessment (does artifact meet requirements?)
- Version tracking

**Scope:**
- Per-file stamping
- Minimal overhead
- Manageable manually during exploration

### Future: GUID-Based Identification

**End vision:** GUID per artifact with metadata resolution

**Architecture:**
- Unique GUID identifies exact artifact
- GUID resolves to: requirements + version + hash + metadata
- Stable across requirement evolution
- Perfect for bug reproduction (extract exact code footprint)

**Requirements:**
- GUID generation mechanism
- GUID registry/resolution system
- Automation infrastructure
- Deployment tracking

**Migration path:**
- MVP uses requirement references (now)
- Build automation and deployment infrastructure
- Implement GUID system when capacity exists
- CIP created at Project 03 closure

**Rationale:**
- GUID architecturally superior for bug reproduction
- But premature without automation infrastructure
- Requirement references satisfy current needs
- "Local rules apply" - future projects can adopt GUIDs

---

## Common Names Glossary (Cross-API Standardization)

### Principle: Same Thing = Same Name + Same Schema

**Constraint:** Use one name only for the same thing across all APIs.

**Example:**
- Directory is always `dir` (local name) everywhere
- Uses same AVRO schema across all APIs
- Even though namespaces differ (`runtime.contextapi.dir` vs `pipeline.processapi.dir`)
- Local name and schema are consistent system-wide

### Benefits

1. **Consistency** - Same concept behaves identically everywhere
2. **Learnability** - Learn once, use everywhere (know what `dir` means system-wide)
3. **Composability** - Output with `dir` automatically compatible with input expecting `dir`
4. **Reusability** - Common AVRO schemas shared across APIs
5. **Predictability** - Know what to expect when you see `dir`
6. **Type safety** - Common schemas ensure compatible data structures

### Implementation: Lightweight Glossary (Not Registry)

**Approach:** Document standards in glossary, enforce through convention and discipline.

**Why glossary over registry:**
- Lightweight - just documentation, no infrastructure
- MVP-friendly - start immediately
- Human-first - developers read and understand
- Flexible - easy to evolve, discuss, refine
- Convention over enforcement - trust and discipline
- Discoverable - browse glossary to see standards
- Minimal and complete - documentation sufficient

**Glossary structure example:**

```markdown
# Common Names Glossary

## dir
**Represents:** Directory path
**Type:** String (path)
**AVRO Schema:**
{
  "type": "string",
  "pattern": "^(/[^/]+)+/?$"
}
**Used by:** runtime.contextapi, pipeline.processapi, file.operationsapi
**Example:** "/tmp/data"
**Notes:** Always absolute path, optional trailing slash

## timestamp
**Represents:** Point in time
**Type:** Long (milliseconds since epoch)
**AVRO Schema:**
{
  "type": "long",
  "logicalType": "timestamp-millis"
}
**Used by:** All APIs (standard metadata)
**Example:** 1699564800000
**Notes:** UTC timezone, millisecond precision

## filepath
**Represents:** File path (absolute or relative)
**Type:** String
**AVRO Schema:**
{
  "type": "string",
  "minLength": 1
}
**Used by:** file.operationsapi, pipeline.processapi
**Example:** "/tmp/data/file.json" or "relative/path.txt"
**Notes:** May be relative or absolute
```

### Enforcement Mechanisms

**Convention-based (MVP):**
- Code review (check glossary conformance)
- Help system (references glossary definitions)
- API tests (validate name and schema match glossary)
- Documentation (API help references common names)
- Discipline and awareness

**Optional future tooling (if evidence shows need):**
- Linting tool to check glossary conformance
- Auto-generate schemas from glossary
- Build-time validation
- Schema registry integration

### Glossary Governance

**Who decides:**
- Common names emerge through use (not upfront specification)
- When pattern repeats across APIs → candidate for glossary
- Collaborative decision (discuss, document, adopt)

**Evolution:**
- Start small (MVP: dir, timestamp, filepath, status, error)
- Add as needed based on evidence
- Version glossary (like other artifacts)
- Backward compatibility considerations

**Scope:**
- Infrastructure concepts (paths, timestamps, status, error)
- Common data types (user, session, configuration)
- Domain concepts if truly cross-cutting
- Don't add speculatively - add when proven common

### Discovery

**How developers find standards:**
- Browse glossary document
- Help system references glossary entries
- Code review feedback
- API documentation shows common names with (common) marker

**Example help output:**
```bash
runtime/contextapi/init -h

Arguments:
  -dir <path>        Root directory (common: see glossary)
  -config <object>   Configuration object
  -timestamp <long>  Initialization time (common: see glossary)
```

---

## API Design Patterns

### Single Concern Principle

**Each API addresses one concern:**
- ✅ Good: `deploymentapi` - build, teardown, validate (all deployment)
- ❌ Bad: `utils-api` - mixed unrelated utilities

**How to identify concerns:**
- Methods naturally group by domain
- Shared state makes sense
- Argument namespace coherent
- Would deploy together

### Argument Naming Consistency

**Same concept = same name across API:**
- If multiple methods use "file path" → same argument name
- Enforced at API level (namespace boundary)
- Makes API predictable and learnable

**Example:**
```javascript
// Good - consistent naming
read(state, { filepath })
write(state, { filepath, content })
delete(state, { filepath })

// Bad - inconsistent
read(state, { path })
write(state, { file, content })
delete(state, { target })
```

### Method Signatures and Type System

**Schema Requirements (AVRO):**

Every API method has three AVRO schema components:
1. **Input schema** - Defines method input structure and types
2. **Output schema** - Defines method output structure and types
3. **Shared API state schema** - Defines API-level state accessible to all methods

**Type safety and composition:**
- All data (input, output, state) managed via AVRO schemas
- Type-safe method composition (output type → input type compatibility)
- Schema evolution support (versioned schemas)
- Validation at boundaries

**Execution context responsibility:**
- Manages output → input transfer between methods in pipeline
- Validates type compatibility (can method2 accept method1's output?)
- Handles type coercion/transformation if needed
- Enforces schema contracts

**Standard pattern:**
```javascript
// Method with AVRO schemas
function methodName(state, input) {
  // input: validated against input schema (AVRO)
  // state: API state (validated against API state schema)

  // 1. Validate inputs (AVRO validation)
  // 2. Perform operation (stateless logic)
  // 3. Create output (conforms to output schema)
  // 4. Return output + updated state

  return {
    output: result,        // validated against output schema
    state: newApiState,    // validated against API state schema
    metadata: {...}
  };
}
```

**Characteristics:**
- Input validated against AVRO input schema
- Output validated against AVRO output schema
- API state validated against AVRO state schema
- Type-safe composition enabled by schemas
- Pure function (no side effects)
- Execution context handles output → input flow

### Error Handling

**Errors are state transitions:**
```javascript
// Error state transition
return {
  state: {
    ...currentstate,
    error: {
      code: 'BUILD_FAILED',
      message: 'Node.js version too old',
      timestamp: Date.now()
    }
  },
  metadata: { success: false }
};
```

**Error philosophy:**
- Errors don't throw (breaks pipeline)
- Errors are captured in state
- Next method can inspect error state
- Pipeline decides how to handle errors

---

## MVP vs End Vision

### MVP Scope

**AI-primary invocation:**
- JS functions as methods
- TypeScript types from AVRO schemas
- Direct imports for type safety
- Framework handles ctx and state

**Three-layer structure:**
- `[package]/[api]/[method]`
- Proven from spl1
- Simple, concrete

**Flat ctx access:**
- Squash pattern for layered input
- Optional chaining (`?.`) for access
- Simpler data structures than spl1

**State backing at API level:**
- Methods share API state
- State persists in pipeline
- Kafka record structure (minimal)

**Requirement stamping:**
- Per-file headers
- Traceability to requirements
- Manual management

### End Vision (Future CIPs)

**Full CLI wrapper ("AI absent" mode):**
- Help generated from AVRO schemas
- Standard invocation syntax
- Multi-level argument parsing
- For humans operating without AI

**N-tier organizational hierarchy:**
- Flexible depth above API level
- `[domain]/[subdomain]/.../[api]/[method]`
- Grow as needed based on evidence

**Hierarchical APIs:**
- APIs can contain sub-APIs
- State scoping: child sees parent, siblings isolated
- Progressive context refinement
- Complex but powerful

**GUID-based identification:**
- Unique artifact tracking
- Metadata resolution
- Perfect bug reproduction
- Requires automation infrastructure

**Advanced state persistence:**
- Kafka integration
- Schema evolution tooling
- Performance optimization

### Migration Philosophy

**Pattern: Build MVP, Capture Vision, Migrate with Evidence**

1. **MVP satisfies current needs** (minimal and complete)
2. **End vision informs design** (don't paint into corners)
3. **Migrate when capacity + evidence exist** (not speculative)
4. **"Local rules apply"** (no retroactive burden)

**Examples:**
- JS primary now → Full CLI wrapper future
- Requirements now → GUIDs future
- Three-layer now → N-tier future
- Flat APIs now → Hierarchical future

---

## Design Principles Summary

**1. API is the elementary unit**
- Smallest deployable standalone unit
- Concern + namespace + state boundary
- Cannot decompose further

**2. State backing is explicit**
- Stateless code, state external
- Immutable state transitions
- Complete audit trail

**3. JS-primary invocation**
- AI writes JS, calls functions directly
- TypeScript types from AVRO schemas
- CLI is secondary wrapper for humans

**4. Minimal and complete**
- Start simple (MVP)
- Add based on evidence
- Question every addition

**5. Argument namespace at API level**
- Consistency enforced
- Same concept = same name
- Predictable interface

**6. Errors are state**
- Don't throw (breaks pipeline)
- Captured in state transitions
- Pipeline handles errors

**7. Local rules apply**
- Projects satisfy their requirements
- No retroactive burden
- Freedom to evolve

---

## Implementation Roadmap

### Twin Pair 2 (Current)

**Goal:** Prove state-backed API pattern works

**Deliverables:**
1. State-backed API implementation (concrete example)
2. API design template (pattern for future APIs)

**Scope:**
- Three-layer structure (`[package]/[api]/[method]`)
- Minimal Kafka record structure
- State transition implementation
- 2-3 methods demonstrating pattern
- Requirement reference stamping

**Validates:**
- State backing practical
- API structure works
- Pattern reusable

### Twin Pair 3 (Next)

**Goal:** Prove runtime orchestration works

**Focus:**
- Runtime state stack
- Pipeline definition
- Layer responsibilities
- How APIs compose in pipelines

### Twin Pair 4 (Integration)

**Goal:** Prove full execution model works

**Focus:**
- Complete hello world
- Multiple APIs chaining
- State flowing through pipeline
- End-to-end validation

### Post-Project 03 (CIPs)

**Future enhancements:**
- N-tier organizational hierarchy
- Hierarchical APIs with state scoping
- GUID-based artifact identification
- Dedicated CLI parser
- AVRO schema integration
- Advanced pipeline orchestration

---

## Related Documents

- **Twin Pair 2 Requirements:** `Twin_pair_2_requirements_v1.0.0.md` (to be created)
- **API Design Template:** To be created in Twin Pair 2
- **State Record Specification:** To be defined in Twin Pair 2
- **Runtime Architecture:** To be defined in Twin Pair 3
- **Foundation References:**
  - Data Architecture: `../02-initial-workplan/Data_architecture_v1.0.0.md`
  - API Pipelining: `../02-initial-workplan/API_pipelining_v1.0.0.md`
  - Philosophy: `../../foundations/PRINCIPLES.md` → `../02-initial-workplan/Philosophy_v1.1.0.md`

---

## Module Structure (Project 08)

### Four-Level Hierarchy

SPL2 modules have a four-level structure:

```
Module root (work module instance)
└── Package (e.g., spl/)
    └── API (e.g., spl/dev/)
        └── Methods (e.g., spl/dev/create/)
```

**Each level has:**
- `README.md` - Mutable entry point (human/AI readable)
- `_reqs/` - Requirements and selfevals (versioned immutables + executable tests)
- Level-appropriate structure (schemas, index.js, etc.)

**Level responsibilities:**

| Level | Purpose | Contains |
|-------|---------|----------|
| Module | Work unit, standalone mycelium | Package(s), module-level reqs |
| Package | Organizational grouping | API(s), package-level reqs |
| API | Concern boundary, namespace | Methods, schemas, API overview |
| Method | Invokable leaf | index.js, method req, schemas |

### Standalone Work Modules

Work modules are self-contained:
- All dependencies copied into `_reqs/` with version stamps
- No external refs for validation
- Portable - can run anywhere
- Inheritance via copying, not linking

**Version-stamped naming shows provenance:**
```
_reqs/
├── work_module_v1.0.0.md           # Type req
├── spl_dev_implementation_v1.0.0.md # Instance req
├── api_node_v1.0.0_selfeval.js     # Inherited selfeval
└── api_node_v1.0.0_selfeval_data.json
```

---

## Executable Selfeval Pattern (Project 08)

### Motivation

Eliminate bureaucracy layer of JSON manifests that reference test scripts. Make self-eval directly executable.

### File Naming

- **Scripts:** `{req_name}_selfeval*.js` (e.g., `api_node_v1.0.0_selfeval.js`)
- **Data files:** `{req_name}_selfeval_data.json` (optional)
- **Multiple per req:** Use suffix (e.g., `_selfeval_folders.js`, `_selfeval_files.js`)

All selfeval files live in `_reqs/` folder.

### Single Concern Principle

Each selfeval tests ONE thing:
- `*_selfeval_folders.js` - checks required folders exist
- `*_selfeval_files.js` - checks required files exist
- Minimal, complete, simple
- Focused error messages

**Benefits:**
- First failure is exact and actionable
- Simple scripts, easy to understand
- Clear progression: fix one thing, run again
- Stop-on-first-fail friendly

### Script Signature

```javascript
function selfeval(data) {
  // data from {req_name}_selfeval_data.json or null
  // perform tests
  // exit(0) = pass, exit(1) = fail with message
}

if (require.main === module) {
  let data = null;
  try {
    data = require('./{req_name}_selfeval_data.json');
  } catch (e) {}
  selfeval(data);
}
module.exports = selfeval;
```

### Data File Format

```json
{
  "requiredFolders": ["spl", "spl/dev"],
  "requiredFiles": ["README.md", "index.js"],
  "internalFolders": ["_reqs", "_schemas"]
}
```

### Local Rules Apply

- Each node runs its own selfevals
- Selfevals only test what their req specifies
- No checking child nodes (they test themselves)
- Execution cascades through tree (root → package → api → methods)

### Test Runner

Cascading test execution:
1. Discover all `*_selfeval*.js` in `_reqs/`
2. Load matching `*_selfeval_data.json` files
3. Execute each script with its data (or null)
4. Stop on first failure
5. Report results

Works autonomously - point it at any module.

---

## API Invocation Model (Project 08)

### Stateful API, Stateless Methods

**API-level invocation = stateful + default:**
- Primary pattern for using APIs
- Creates persistent state/context
- Configuration persists across method calls
- Sets defaults, environment, preferences

```javascript
invoke('spl/dev', {
  envRoot: '/custom/path',
  setupRoot: './setup',
  verbosity: 'debug'
});
```

**Method-level invocation = stateless + override:**
- Methods don't keep their own state
- Receive context from three sources (the sandwich)
- Can override API-level config for this call only

### Three-Layer Sandwich

Each method invocation resolves input from three layers:

```
┌─────────────────────────────┐
│  Method input (explicit)    │  ← Highest priority
├─────────────────────────────┤
│  Previous output (chained)  │  ← Middle
├─────────────────────────────┤
│  API state (persistent)     │  ← Lowest priority
└─────────────────────────────┘
```

**Priority:** Method input > Previous output > API state

Override is per-call only - doesn't change API state.

### API Invocation Schema

API invocation can include:
- **envRoot** - where to create environments
- **setupRoot** - where setup folder lives
- **defaults** - map of method defaults
- **batch** - array of method calls to execute

All optional, but API invocation is the **primary pattern**.

```javascript
invoke('spl/dev', {
  envRoot: '/custom/path',
  setupRoot: './setup',
  defaults: {
    install: { packages: 'standard' },
    cycle: { single: false, exit: false }
  },
  batch: [
    ['create', { name: 'my-env' }],
    ['install', {}],
    ['submit', { workPackage: './work/pkg' }]
  ]
});
```

---

## Native vs Wrapper APIs (Project 08)

### Two API Layers

**Native APIs** (DSL vocabulary):
- SPL2 vocabulary from DSL glossary
- Our schemas, our method names
- For "splectrum proper" use
- May combine multiple wrapper calls

**Wrapper APIs** (external tool vocabulary):
- Mirror external tool's native interface
- External tool's vocabulary/schema preserved
- Mechanical 1:1 mapping
- Implementation detail, not for direct use

### Decision Criterion

**Does the external tool's vocabulary fit DSL?**

- **Yes** → Direct native API (no wrapper needed)
- **No** → Wrapper API + Native API on top

**Examples:**
- `console` - vocabulary fits (`log`, `error`, `warn`) → Direct native `spl/console`
- `fs` - vocabulary doesn't fit (`readFileSync`, callbacks) → Wrapper + Native `spl/file`

### Underscore Namespace Convention

**Single underscore `_`** = splectrum internal (higher precedence)
- `_reqs/`, `_schemas/`, `_meta/`
- Our infrastructure, our control

**Double underscore `__`** = wrapper internal (lower precedence)
- `__readFileSync/`, `__input.avsc`
- External tool's namespace, not our control
- Subordinate to splectrum internal

**Structure example:**
```
spl/
├── file/                    # Native API (DSL vocabulary)
│   ├── read/
│   └── write/
└── fs/                      # Wrapper API package
    ├── __readFileSync/      # Double underscore on methods
    ├── __writeFileSync/
    └── _schemas/            # Single underscore (our folder)
        ├── __readFileSync-input.avsc   # Double underscore (their vocab)
        └── __readFileSync-output.avsc
```

### Work Module Discipline

Creating wrapper alone is incomplete:
- Must create native API in same work module
- Only then is external tool "integrated into splectrum"
- Wrapper is implementation detail, not deliverable

**Double underscore can be omitted IF:**
- One-to-one mapping exists in naming AND semantics
- External tool vocabulary happens to match DSL

---

## Work Package Pattern (Project 08)

### Structure

Self-contained, portable module with everything needed for implementation:

```
spl/dev/create/
├── README.md             # Entry point (mutable)
├── index.js              # Implementation
├── _reqs/
│   ├── spl_dev_create_v1.0.0.md           # Method req
│   ├── spl_dev_create_v1.0.0_selfeval*.js # Tests
│   └── api_node_v1.0.0_selfeval.js        # Inherited
├── _schemas/
│   ├── input.avsc
│   └── output.avsc
└── _meta/                # Journey evidence (after execution)
    ├── status.json
    ├── cycle-log.json
    └── fluency.json
```

### Handoff Pattern

1. Receive folder with spec, schemas, tests (stub implementation)
2. Drop into dev env
3. Run harness
4. Tests fail with guidance
5. Implement until 100% pass
6. Done

**"Dumb execution, smart definition"** - definition is complete, execution follows tests.

### Setup Folder Pattern

Dev environment is ephemeral. Setup folder accumulates completed work.

```
setup/
├── base-modules/          # Packages for installation
├── work-packages/         # Input queue (pristine specs)
└── completed-modules/     # Output - evolved work modules
    └── spl-dev-create/    # Completed: spec + impl + meta
```

**Perfect for AI delegation:**
- Hand agent: setup folder + work package name
- Agent implements to spec
- Returns: completed module with _meta/ evidence
- Setup folder state advances

---

## Fluency and Friction Metrics (Project 08)

### Fluency Metric

Measure of implementation smoothness:

**Measures:**
- Cycles to completion (overall)
- Cycles per test
- Time to green

**Interpretation:**
- High fluency (few cycles) → clear spec, good tests, straightforward
- Low fluency (many cycles) → unclear spec, poor guidance, complex

### Friction as Partnership Signal

**Key insight:** Low fluency indicates partnership misalignment, not capability gap.

**Friction points reveal:**
- Misunderstanding in spec
- Ambiguity in requirements
- Gap between intent and expression

**Response to friction:**
- Review partnership artifacts (spec, guidance, tests)
- Find the misalignment
- Clarify and improve the definition
- **Not** escalate to "more capable agent"

**Partnership is king** - friction is feedback on partnership quality, not executor performance.

---

## Version History

- **v0.4.0** (2025-11-20): Project 08 patterns - module structure (4-level hierarchy), executable selfeval pattern, API invocation model (stateful API, stateless methods, three-layer sandwich), native vs wrapper APIs with underscore namespace convention, work package pattern, fluency/friction metrics.
- **v0.3.0** (2025-11-19): Project 07 patterns - schema-driven property selection, boundary validation model, wrapper vs DSL APIs, invocation at any level, runtime/execution responsibilities, package types, self-eval development model. Updated structure to use underscore prefix convention and method folders.
- **v0.2.0** (2025-11-18): AI-primary paradigm shift - JS invocation primary, CLI secondary wrapper.
- **v0.1.0** (2025-11-10): Initial design document capturing decisions from Twin Pair 1 and Twin Pair 2 planning discussions. MVP scope defined. End vision captured. Ready for implementation.

---

## Notes

This is a **living document** - it evolves as we implement and learn.

**Current status:** Design phase - capturing architectural decisions before implementation.

**Next steps:** Create Twin Pair 2 requirements, implement first state-backed API, validate pattern through use.

**Remember:** Minimal and complete. Build MVP, validate through use, evolve based on evidence.
