# Pipeline Design and Data Layer Notes

**Date:** 2025-11-23
**Context:** Product Twin 1 - Building Blocks Exploration

---

## Pipeline Execution Model

### Three Layers

**1. Free Script Handler** (audit trail)
- Initializes pipeline with steps
- Kicks processor for execution
- Receives final output when complete
- Own audit trail

**2. Pipeline Processor** (audit trail)
- Manages step-by-step execution
- Each step processed independently
- Returns output to handler when last step completes
- Own audit trail

**3. Request Processing Sequence** (one per step)
- Step 0: initialization (fire-and-reference)
- Step 1, 2, 3...: processor loads previous, processes, fire-and-reference new
- Each step = independent event stream (single concern)
- Full reconstruction possible from references

---

## Fire-and-Reference Pattern

**Not "fire-and-forget"** - Fire-and-Reference!

- Each step creates event that is preserved (immutable)
- References enable reconstruction (spider/mycelium pattern)
- Follow references to reconstruct full execution
- Single concern per event stream

**Example flow for `3 + 5 - 2`:**

```javascript
// Free handler creates pipeline
pipeline.initialize({ value: "3 + 5 - 2", steps: ["add", "subtract"] })
pipeline.kick()

// Step 0 (initialization) - fire-and-reference
{
  pipelineId: "pipeline-123",
  stepId: "step-0",
  value: "3 + 5 - 2",
  steps: ["add", "subtract"],
  refersTo: null  // initialization has no parent
}

// Step 1 - fire-and-reference
{
  pipelineId: "pipeline-123",
  stepId: "step-1",
  value: 8,
  refersTo: "step-0"  // references previous step
}

// Step 2 (last step) - fire-and-reference
{
  pipelineId: "pipeline-123",
  stepId: "step-2",
  result: 6,  // result instead of value for last step
  refersTo: "step-1"
}

// Pipeline processor waits/listens for step-2 to appear on topic
// Extracts result: 6
// Returns output: 6 to free handler
```

---

## Reference Direction Pattern

### Top-Down = Happy Path

**Pipeline references down to steps:**
- Primary execution record is pipeline
- Pipeline contains references to all step records
- Follow references from parent → children
- Natural reconstruction flow
- Always available, part of the records

**Example:**
```javascript
// Pipeline record (PRIMARY execution point)
{
  pipelineId: "pipeline-123",
  steps: [
    "pipeline-123/step-0",
    "pipeline-123/step-1",
    "pipeline-123/step-2"
  ]
}

// Step records (SECONDARY execution - not entry points)
{ stepId: "step-0", value: "3 + 5 - 2" }
{ stepId: "step-1", value: 8 }
{ stepId: "step-2", result: 6 }
```

### Bottom-Up Index = If Required

**Step → parent pipeline lookup:**
- Created when needed (not in primary records)
- For exception/debugging scenarios
- Optional infrastructure
- Separate from primary records

**Example:**
```javascript
// Bottom-up index (created if needed, separate)
{
  "pipeline-123/step-0": "pipeline-123",
  "pipeline-123/step-1": "pipeline-123",
  "pipeline-123/step-2": "pipeline-123"
}
```

**Usage:**
- **Happy path:** Start at pipeline, follow top-down refs
- **Exception path:** If you only have step ID, use bottom-up index to find parent pipeline

---

## Filesystem Implementation

### Primary Key = Folder + Filename

**Pattern:**
- Folder = pipeline ID (primary key prefix)
- Filename = step ID + timestamp (ensures uniqueness + ordering)
- Most recent = last step executed
- Metadata inside confirms step details

**Structure:**
```
events/
  pipeline-123/           ← Primary key (pipeline ID)
    step-0_20251123T143020Z.json
    step-1_20251123T143021Z.json
    step-2_20251123T143022Z.json
```

**Happy path to get last executed step:**

1. Query filesystem: most recent file in `events/pipeline-123/`
2. Sorted by timestamp → `step-2_20251123T143022Z.json` is most recent
3. Open file, read metadata to confirm exact step number

**Query example:**
```javascript
// Get last step for pipeline-123
const lastStepFile = getMostRecentFile('events/pipeline-123/')
// Returns: step-2_20251123T143022Z.json

const lastStep = JSON.parse(readFile(lastStepFile))
// Metadata confirms: { stepId: "step-2", stepNumber: 2, ... }
```

**Design choice: Subfolders**
- Natural grouping of related events
- Easy queries (ls pipeline-123/)
- Scales better (thousands of pipelines don't clutter single folder)
- Aligns with "folder + filename = primary key" pattern

---

## Data Layer Interfaces

### Two Complementary Interfaces

Both interfaces operate on the same underlying immutable event stream, providing different access patterns.

#### Interface 1: Streaming (Immutable)

**Purpose:** Append-only event stream operations

**Methods:**
- **publish(topic, event)** - Create new event (append-only)
- **consume(topic, options)** - Read events in order
- **seek(topic, position)** - Jump to position in stream (e.g., "latest", "first", offset)

**Characteristics:**
- Events never modified, only appended
- Full audit trail preserved
- Sequential access patterns
- Reconstruction-friendly

**Example:**
```javascript
// Publishing events
stream.publish('pipeline-123', { stepId: 'step-0', value: '3 + 5 - 2' })
stream.publish('pipeline-123', { stepId: 'step-1', value: 8 })

// Consuming events
const allSteps = stream.consume('pipeline-123')  // All steps in order
const latest = stream.seek('pipeline-123', 'latest')  // Most recent step
```

#### Interface 2: Mutable File (Versioned)

**Purpose:** Convenient "current state" access

**Methods:**
- **write(path, data)** - Create new version (calls publish under the hood)
- **read(path)** - Get latest version (calls seek 'latest' under the hood)

**Characteristics:**
- Appears mutable from interface perspective
- Actually immutable underneath (versions accumulate)
- Convenience layer over streaming interface
- "Current state" semantics

**Example:**
```javascript
// Writing (creates new version = publish)
file.write('pipeline-123/current', { stepId: 'step-1', value: 8 })

// Reading (gets latest version)
const current = file.read('pipeline-123/current')  // Gets step-1 (latest version)
```

### Relationship

**Key insight:** Both interfaces operate on same immutable event stream

- **Streaming interface:** Explicit append/consume operations
- **Mutable interface:** Convenience layer (read = latest, write = publish)
- **Underneath:** All events preserved, versioned, immutable

**Usage patterns:**
- Use **streaming** for audit trails, reconstruction, analysis
- Use **mutable** for "current state" convenience in handlers

**Example - same data, different views:**
```javascript
// Streaming view: all versions visible
const history = stream.consume('pipeline-123')
// [step-0, step-1, step-2]

// Mutable view: only latest visible
const current = file.read('pipeline-123')
// step-2 (most recent)
```

---

## Execution Context as Metadata

**Key simplification:** Runtime/execution context goes in event header metadata

**Not nested multilevel records:**
```javascript
// OLD (complex nested structure)
{
  execution: {
    runtime: {
      value: { ... },
      platform: "node"
    }
  },
  current: { ... },
  history: { ... }
}
```

**NEW (flat with metadata header):**
```javascript
// Event record
{
  // Metadata header
  metadata: {
    platform: "node",
    environment: { ... },
    timestamp: "...",
    version: "..."
  },

  // Request data (flat, simple)
  stepId: "step-1",
  value: 8,
  refersTo: "step-0"
}
```

**Benefits:**
- Simpler event records (single concern)
- Context available but not nested
- Easier to reconstruct (metadata is header)
- No multilevel structure complexity

---

## Value → Result Flow

**Pattern for pipeline execution:**

1. **Input** → **value** at Step 0 (initialization)
2. **value** → **value** through processing steps (Step 1..N-1)
3. **value** → **result** at last step (Step N)
4. **result** → **output** returned to free handler

**Example:**
```javascript
// Step 0: input → value
{ value: "3 + 5 - 2" }

// Step 1: value → value (intermediate)
{ value: 8 }

// Step 2: value → result (last step)
{ result: 6 }

// Free handler receives: output = 6
```

---

## Programmatic Disconnection Pattern

**Last step special handling:**

1. Steps 0..N-1 processed by pipeline processor
2. Step N (last step) fired-and-referenced to topic
3. **Processor waits/listens** on topic for step N to appear
4. When detected (via listener/notification), processor picks it up
5. Extracts `result` field
6. Returns as `output` to free handler

**Key:** Programmatic disconnection via listener/notification mechanism

- Not direct creation of final step
- Final step appears on topic (same pattern as all steps)
- Processor waits for it
- Completes when detected

---

## Key Principles

1. **Fire-and-reference, not fire-and-forget** - Events preserved, references enable reconstruction
2. **Top-down = happy path** - Pipeline references down to steps
3. **Bottom-up index = if required** - Optional, for exception scenarios
4. **Primary key = folder + filename** - Filesystem encoding pattern
5. **Most recent = last step** - Query by timestamp sorting
6. **Two data layer interfaces** - Streaming (explicit) + Mutable (convenience)
7. **Same underlying storage** - Immutable events, different access patterns
8. **Execution context in metadata** - Header, not nested structure
9. **Value → result flow** - Input becomes value, last step produces result
10. **Programmatic disconnection** - Processor waits/listens for last step

---

## Implementation for Prototype

**Data layer** (`dev/lib/data-layer/`):
- `stream.js` - Streaming interface (publish, consume, seek)
- `file.js` - Mutable interface (read, write)
- Both operate on `events/` filesystem structure

**Pipeline processor** (`dev/lib/pipeline/`):
- Initialize with steps
- Process step-by-step
- Fire-and-reference pattern
- Wait/listen for last step
- Return result to handler

**Event structure:**
- Metadata header (platform, environment, timestamp, version)
- Request data (stepId, value/result, refersTo)
- Flat, single concern

**Filesystem structure:**
```
events/
  pipeline-{id}/
    step-{n}_{timestamp}.json
```

---

**These explorations inform Product Twin 1 implementation design.**
