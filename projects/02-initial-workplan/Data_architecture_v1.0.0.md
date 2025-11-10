# Data Architecture v1.0.0

**Created:** Project 02 (initial-workplan)
**Version:** 1.0.0
**Status:** Preliminary - will evolve through hands-on coding exploration

Extracted from PRINCIPLES_DETAILED.md for better organization.

---

## Minimal and Complete (Expanded)

**What must be captured for completeness:**

1. **Initial state** - Starting conditions before process executes
2. **Executed code** - The code that ran (or immutable reference like git hash)
3. **Input** - Data provided to the process
4. **Output** - Data produced by the process
5. **Logging** - Events and information generated during execution
6. **External data dependencies** - Additional data fetched during processing
   - Repository data, database queries, API calls, file reads, etc.
   - Use immutable references (git hashes, versions) when they exist
   - Capture actual data when immutable references don't exist

**Rationale:** These 6 items enable out-of-context replay. Without external data dependencies captured, replay is impossible for most real processes.

**Lazy functional approach explained:**
- Core provides *potential* (raw materials: outputs + metadata)
- Separate tools *actualize* (process for specific purposes)
- Don't do work in core that tools can do later
- Separation of concerns: generation vs interpretation

**Example pattern:**
```
Core: Execute → outputs + raw metadata
Tools: Raw metadata → audit / debug / trace / visualization / replay
```

---

## Kafka-Compatible Record Structure

**Full structure:**
```javascript
{
  key: "...",        // optional, use when needed
  value: {...},      // actual data payload
  headers: {...},    // metadata for reconstruction
  timestamp: ...     // optional, use when needed
}
```

**What goes where:**
- `value`: The actual output data
- `headers`: Metadata (initial state, code ref, input, output, logging, external dependencies)
- `key`: Optional identifier (use as needed)
- `timestamp`: Optional timing information (use as needed)

**Important:** Kafka-compatible is a structural constraint, not infrastructure requirement. Can store on filesystem, database, or actual Kafka. Structure must be exportable/importable to real Kafka.

**Benefits:**
- Event sourcing naturally (immutable + encapsulated)
- Each record stands alone (complete for reconstruction)
- Process as streams or batches
- Replay/reprocess easily
- Infrastructure-agnostic but structured

---

## Process Structure

**Complete process lifecycle:**

1. **Accept input** - Receive data to process
2. **Load state** - Initialize from Kafka record
3. **Execute** - Run process (may involve multiple API calls)
4. **Produce output** - Generate results
5. **Persist state** - Write new state to Kafka record

**Key characteristics:**
- State persists for entire input → output transformation
- All API calls during process share the same state
- State backing at API level (set of methods share same Kafka record)
- State scoped to process execution
- Self-contained, explicit state passing

**Process as state transition:**
```
State₁ (Kafka record) → [Process] → State₂ (Kafka record)
```

- State₁ remains unchanged (immutable)
- State₂ is new record (immutable)
- Each transition fully captured and observable
- Sequence of transitions forms stream of state evolution
