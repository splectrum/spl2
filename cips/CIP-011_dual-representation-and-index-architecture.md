# CIP-011: Dual Representation and Index Architecture

**Status:** Proposed
**Created:** 2025-11-14
**Type:** Architectural Foundation
**Scope:** Data layer implementation, native/derived representations, index materialization

## Summary

Define the architecture for Splectrum's dual representation model where:
- **Native layer:** AI-optimized Kafka records (streaming, schema-enforced, partitioned)
- **Derived layer:** Human-friendly filesystem (markdown, CSV, git-versionable)
- **Index layer:** Mutable, dynamic views materialized from immutable artifact stream
- **Flexibility:** Start simple, add new indexes without data migration

The key insight: **Indexes are views, not data** - create new ways to access without moving/transforming the underlying artifacts.

---

## Context

Following CIP-009 (splectrum-native repository model) and CIP-010 (product vision), discussion turned to the concrete data structures Splectrum produces and how they feed into multiple data layer interfaces.

The realization: We need **dual representation** - one optimized for AI (native Kafka), one optimized for humans (derived filesystem), with **indexes** providing flexible access patterns without migration headaches.

---

## The Architecture Vision

### Three Layers

```
┌─────────────────────────────────────────────────┐
│    NATIVE LAYER (AI-Optimized)                  │
│    Kafka Topics/Records                         │
│    - Schema-enforced (AVRO)                     │
│    - Streaming-optimized                        │
│    - Partitioned by spots                       │
└─────────────────────────────────────────────────┘
                    ↓ ↑
        (Bidirectional transformation)
                    ↓ ↑
┌─────────────────────────────────────────────────┐
│    DERIVED LAYER (Human-Friendly)               │
│    Filesystem Structure                         │
│    - Natural language, markdown, CSV            │
│    - Git-versionable                            │
│    - Human-editable                             │
└─────────────────────────────────────────────────┘
                    ↓
        (Indexes materialize from native)
                    ↓
┌─────────────────────────────────────────────────┐
│    INDEX LAYER (Flexible Views)                 │
│    Multiple Access Patterns                     │
│    - Glossary index (term → artifacts)         │
│    - Dependency index (relationships)           │
│    - Timeline index (temporal queries)          │
│    - Type index (filter by type)                │
│    - Custom indexes (as needed)                 │
└─────────────────────────────────────────────────┘
```

---

## Native Layer: AI-Optimized Kafka

### Repository as Kafka Topic

**Topic:** `spl2-repo` (or per-repository topics for multi-repo)

**Partitioning:** By spots (activity-based locations)
```
Partitions:
  0: foundations/
  1: glossary/
  2: projects/
  3: cips/
  4: chats/
  5: archive/
```

**Benefit:** Parallel processing per spot, natural ordering within spot

### Record Structure

```javascript
{
  key: "spot/path",  // PK spacing: "foundations/WOW.md"
  value: {
    content: "...",  // Actual artifact content
    format: "markdown" | "csv" | "json" | "avro" | "binary",
    schema: "optional-schema-ref",  // For structured content
    metadata: {
      version: "1.2.0",
      hash: "sha256:abc123...",  // Content verification
      timestamp: 1699900000000,
      author: "human" | "ai" | "collaborative",
      requirementsRef: "requirements_v1.0.0.md",
      previous: "artifact-id"  // Version chain
    }
  },
  headers: {
    "schema.ref": "artifact-schema-v1",
    "content.type": "text/markdown"
  },
  timestamp: 1699900000000,
  partition: 0  // foundations/
}
```

### Content Flexibility

**The key insight:** Immutables contain **all sorts of content** in a **variety of formats**.

**With rigid schema:**
- API definitions (AVRO schemas)
- Records (structured data)
- Metadata (always schema-enforced)

**Without rigid schema:**
- Natural language requirements (markdown)
- Design documents (free-form text)
- Chat captures (conversational)
- Images, diagrams (binary)

**Hybrid approach:**
- Metadata envelope: Always AVRO-enforced
- Content field: Format indicator + flexible payload
- Schema reference: Optional, when content is structured

### PK Spacing Strategy

**Primary key format:** `spot/path/to/artifact`

Examples:
- `foundations/WOW.md`
- `projects/04-bare-runtime-hello-world/PROJECT_BRIEF.md`
- `cips/CIP-009_splectrum-native-repository-model.md`
- `chats/2025-11-14_haicc-stack-and-product-vision.md`

**Benefits:**
- Natural ordering within spot
- Partition affinity (same spot → same partition)
- Human-readable keys
- Path-based queries efficient

**Alternatives considered:**
- Content hash (not human-readable)
- UUID (no semantic meaning)
- Composite `spot|timestamp|sequence` (too complex)

---

## Derived Layer: Human-Friendly Filesystem

### Current Structure Preserved

```
spl2/
├── foundations/
│   └── WOW.md
├── glossary/
│   └── DSL_GLOSSARY.md
├── projects/
│   └── 04-bare-runtime-hello-world/
│       └── PROJECT_BRIEF.md
├── cips/
│   └── CIP-009_*.md
└── chats/
    └── 2025-11-14_*.md
```

**This IS the derived representation!**

### Transformation: Native → Derived

**Continuous background process:**
1. Consume from Kafka topic
2. Parse record (key, value, metadata)
3. Write to filesystem at path indicated by key
4. Preserve format (markdown stays markdown, CSV stays CSV)
5. Add metadata as front-matter or separate file (if needed)

**Example:**
```javascript
// Kafka record
key: "foundations/WOW.md"
value: { content: "# Ways of Working...", format: "markdown", ... }

// Becomes filesystem
/spl2/foundations/WOW.md
  ↓
# Ways of Working
...
```

### Transformation: Derived → Native

**Git commit hook or manual sync:**
1. Detect filesystem changes (git diff, file watcher)
2. Read changed files
3. Parse content + extract metadata
4. Produce Kafka record with updated content
5. Preserve lineage (previous version reference)

**Conflict detection:**
- Checksum comparison (file hash vs Kafka record hash)
- Timestamp check (filesystem mtime vs Kafka timestamp)
- Warning on divergence, conflict resolution strategy needed

---

## Index Layer: Flexible, Dynamic Views

### The Killer Feature

> **"No migration headaches"** - Indexes are just views over the immutable artifact stream. Create new access patterns without moving data!

### How Indexes Work

**Pattern:** Kafka Streams / ksqlDB materialized views

1. **Subscribe** to artifact stream (native Kafka topic)
2. **Process** each artifact (extract, transform, aggregate)
3. **Materialize** view (store in optimized format)
4. **Publish** changelog (for cascading indexes)
5. **Serve** queries (from materialized view, not raw stream)

**Rebuild anytime:**
- Indexes are **ephemeral** (can be deleted and rebuilt)
- Source of truth: Artifact stream (immutable)
- Replay stream → regenerate index (CQRS pattern)

### Index Types (Examples)

#### 1. Glossary Index

**Purpose:** Term lookup (term → artifact references)

**Source:** All artifacts containing glossary terms

**Structure:**
```javascript
{
  indexType: "glossary",
  entries: [
    {
      term: "HAICC",
      definitions: [
        { artifact: "cips/CIP-010_*.md", location: "line 42" },
        { artifact: "chats/2025-11-14_haicc-*.md", location: "line 120" }
      ]
    }
  ],
  metadata: {
    builtFrom: "artifact-stream-offset-12345",
    timestamp: ...,
    version: "index-v1"
  }
}
```

**Update trigger:** New artifact with glossary term detected

**Storage format:** JSON (structured) or CSV (human-readable)

#### 2. Dependency Index

**Purpose:** Relationship traversal (artifact → dependencies)

**Source:** Artifact metadata (`requirementsRef`, `previous`, etc.)

**Structure:**
```javascript
{
  indexType: "dependency-graph",
  nodes: [
    { id: "artifact-id", type: "requirement", ... }
  ],
  edges: [
    { from: "code-artifact", to: "requirement-artifact", type: "satisfies" },
    { from: "artifact-v2", to: "artifact-v1", type: "version-of" }
  ]
}
```

**Update trigger:** New artifact with dependency metadata

**Storage format:** Graph database (RocksDB) or JSON (small graphs)

#### 3. Timeline Index

**Purpose:** Temporal queries (artifacts by time range)

**Source:** Artifact timestamps

**Structure:**
```javascript
{
  indexType: "timeline",
  buckets: [
    {
      date: "2025-11-14",
      artifacts: [
        { id: "artifact-1", timestamp: ..., type: "cip" },
        { id: "artifact-2", timestamp: ..., type: "chat" }
      ]
    }
  ]
}
```

**Update trigger:** Every new artifact

**Storage format:** Time-series database or partitioned JSON

#### 4. Type Index

**Purpose:** Filter by artifact type

**Source:** Artifact type field

**Structure:**
```javascript
{
  indexType: "by-type",
  types: {
    "requirement": ["artifact-1", "artifact-2", ...],
    "code": ["artifact-3", "artifact-4", ...],
    "schema": ["artifact-5", ...],
    "cip": ["artifact-6", ...]
  }
}
```

**Update trigger:** New artifact

**Storage format:** Inverted index (RocksDB) or JSON

#### 5. Full-Text Search Index

**Purpose:** Content search across all artifacts

**Source:** Artifact content

**Structure:** Inverted index (word → artifact IDs)

**Update trigger:** New artifact

**Storage format:** Embedded search engine (e.g., SQLite FTS5, MeiliSearch)

### Cascading Changelogs

**Architecture:**
```
Base: artifact-stream (topic: artifacts)
    ↓ consumed by
Index 1: glossary-index (topic: glossary-index-changelog)
    ↓ consumed by
Index 2: dependency-index (topic: dependency-changelog)
    ↓ consumed by
Derived: filesystem-sync (topic: filesystem-changelog)
    ↓
Applications consume at appropriate level
```

**Each level:**
- Subscribes to parent changelog
- Maintains its own materialized view
- Publishes changelog of its updates
- Enables cascading (downstream consumers react to upstream changes)

**Like ksqlDB:**
```sql
CREATE STREAM artifacts (...);

CREATE TABLE glossary_index AS
  SELECT term, COLLECT_LIST(artifact_id) as artifacts
  FROM artifacts
  WHERE contains_glossary_term(content)
  GROUP BY term
  EMIT CHANGES;

-- glossary_index has changelog topic automatically
```

### Performance: Cascading Change Management

**Challenge:** Artifact change → triggers many index rebuilds → potentially large cascade

**Solutions:**

**1. Incremental Materialization**
- Only rebuild affected index entries, not entire index
- Example: New artifact with glossary term → update only that term's entry

**2. Debouncing/Batching**
- Collect updates for N seconds or M records
- Batch rebuild (more efficient than one-by-one)

**3. Async Processing**
- Don't block artifact creation on index updates
- Eventual consistency (indexes catch up asynchronously)

**4. Partition Indexes**
- Split large indexes by partition key (spot, date, type)
- Rebuild affected partition, not whole index

**5. Snapshot + Delta**
- Periodic full snapshot of index
- Delta updates between snapshots
- Rebuild from latest snapshot + deltas (faster than full replay)

**6. Changelog Compaction**
- Kafka log compaction (keep only latest per key)
- Prunes history, keeps index size bounded

---

## What This Enables

### Flexibility: No Migration Headaches

**Traditional database:** Change schema → migrate data → painful!
```
Old schema → Export data → Transform → Import to new schema
(Downtime, risk, complexity)
```

**Splectrum approach:** Create new index!
```
Artifact stream (unchanged) → New index subscribes → Materializes new view
(No downtime, no risk, iterative)
```

**Examples:**

**Need graph queries?** Create dependency index
- No data migration
- Artifact stream stays same
- Index materializes from stream

**Need full-text search?** Create search index
- Consume artifact stream
- Build inverted index
- Artifacts untouched

**Need different grouping?** Create new index with different key
- Same source data
- Different view
- Both coexist

**Deprecate old view?** Delete index, create new one
- Rebuild from stream
- No data loss (stream is source of truth)

### Flexibility: Start Simple, Evolve

**Phase 1: Filesystem only**
- Just files and folders
- Git version control
- Human-friendly (current state)

**Phase 2: Add Kafka backing**
- Filesystem → Kafka sync
- Artifact stream established
- Indexes start simple (glossary CSV)

**Phase 3: Add sophisticated indexes**
- Dependency graph (RocksDB)
- Full-text search (embedded engine)
- Timeline queries (time-series)

**Phase 4: Multi-model interfaces**
- Document store (artifact by ID)
- Graph queries (traverse dependencies)
- Streaming (subscribe to changes)
- Transactional (atomic index updates)

**At each phase:** No breaking changes to data, only additive!

### Flexibility: Multiple Derived Representations

**Not just filesystem!**

**Derived representation 1:** Filesystem (current, for humans + git)
**Derived representation 2:** Web UI rendering (HTML from markdown)
**Derived representation 3:** API documentation (generated from schemas)
**Derived representation 4:** Dashboard/analytics (aggregated metrics)
**Derived representation 5:** Alternative AI format (different serialization)

**All consume from same native Kafka stream!**

```
                    Kafka Artifact Stream
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   Filesystem          Web Renderer       API Doc Gen
   (human)            (dashboard)         (schemas)
```

**Each representation:**
- Optimized for its consumer
- Can be regenerated from stream
- Evolves independently
- No coupling to others

---

## Data Layer Interface Mapping

### How Native/Index Architecture Feeds Interfaces

#### Document Store Interface

**Query:** `dataLayer.document.get("artifact-id")`

**Backed by:**
- Type index (artifact-id → artifact)
- Or direct Kafka consume (seek to key)

**Returns:** Complete artifact object

#### Graph Interface

**Query:** `dataLayer.graph.traverse({ start: "artifact-id", relationship: "satisfies" })`

**Backed by:**
- Dependency index (materialized graph)
- Nodes = artifacts
- Edges = relationships from metadata

**Returns:** Array of related artifacts

#### Streaming Interface

**Query:** `dataLayer.stream.subscribe({ type: "schema", from: "beginning" })`

**Backed by:**
- Direct Kafka consumption
- Type index for filtering
- Consumer group for offset management

**Returns:** Stream of artifacts (push)

#### Transactional Interface

**Query:**
```javascript
dataLayer.transaction.execute([
  { op: "create", artifact: {...} },
  { op: "update", index: "glossary", entry: {...} }
])
```

**Backed by:**
- Kafka transactions (atomic multi-partition writes)
- Index update logs (WAL)
- Snapshot isolation

**Returns:** Success/failure (atomic)

---

## The Upgrade Paradigm: Independent Evolution

### The Critical Consequence

**Traditional upgrade pain:**
```
New app version needs extra field
    ↓
Migrate database schema (ALTER TABLE, downtime)
    ↓
Update ALL consumers (rendering, APIs, reports)
    ↓
Coordinated deployment (big bang, risky)
    ↓
Pain, risk, complexity
```

**Splectrum upgrade model:**
```
New app version needs extra field
    ↓
Update content bucket creation (producer adds field)
    ↓
Old artifacts unchanged (still valid)
    ↓
Rendering views unchanged (ignore new field or use default)
    ↓
Rolling upgrade (consumers upgrade independently)
    ↓
Zero downtime, no coordination needed
```

### The Microservices Dream Realized

**Independent service evolution:**

**Service A (Producer):**
- Version 1.0: Creates `{ name, age }`
- Version 2.0: Creates `{ name, age, email }`
- **Upgrades independently** - just starts creating richer artifacts

**Service B (Consumer - Rendering):**
- Version 1.0: Displays name, age
- **Still works!** Ignores email field
- **Upgrades when ready** - not forced by producer change

**Service C (Consumer - Indexing):**
- Version 1.0: Indexes by type
- **Unaffected** - doesn't care about content changes
- **Upgrades independently** if needs email indexing

**The magic:** All three services evolve at their own pace, no coordination required!

### Schema Evolution Through AVRO

**Leverage AVRO compatibility modes:**

**BACKWARD compatible** (most common):
- New version can read old data
- Add optional fields with defaults
- Example: Adding `email` with default `null`

```javascript
// Old artifact (schema v1)
{
  schema: "artifact-v1.avro",
  data: { name: "Alice", age: 30 }
}

// New artifact (schema v2 - BACKWARD compatible)
{
  schema: "artifact-v2.avro",
  data: { name: "Bob", age: 25, email: "bob@example.com" }
}

// Old consumer reading new artifact:
// Ignores email field ✅

// New consumer reading old artifact:
// Uses email default (null) ✅
```

**FORWARD compatible:**
- Old version can read new data
- Remove optional fields
- Old consumers ignore unknown fields

**FULL compatible:**
- Both directions work
- Maximum flexibility
- Add/remove optional fields only

### Immutable Artifacts Enable This

**Because artifacts never change:**

1. **Old artifacts always valid** → no forced migrations
2. **New artifacts additive** → backward compatible by design
3. **Consumers choose schema version** → upgrade when ready
4. **No coordination needed** → true independence

**Contrast with traditional databases:**
```sql
-- Forces ALL code to change
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- Every query must now handle email
-- Every application must be aware
-- Coordinated upgrade required
```

**Splectrum allows:**
```javascript
// Old code (unchanged)
const user = artifacts.get(id);
render(user.name, user.age);  // email ignored, still works

// New code (uses new field)
const user = artifacts.get(id);
render(user.name, user.age, user.email || 'N/A');  // handles both old and new
```

### Practical Example: Dashboard Evolution

**Phase 1: Simple counter**
```javascript
// dashboard-v1: Just counts artifacts
artifacts.stream.subscribe((artifact) => {
  counter.increment();
  // Doesn't care about content at all
});
```

**Phase 2: Add type breakdown** (producer unchanged)
```javascript
// dashboard-v2: Adds type statistics
artifacts.stream.subscribe((artifact) => {
  counter.increment();
  typeCount[artifact.type]++;  // Uses type field
  // Ignores other fields
});

// dashboard-v1 still running - still works! ✅
```

**Phase 3: Producer adds author field**
```javascript
// Producer upgraded (adds author to new artifacts)
{
  type: "requirement",
  author: "human",     // NEW FIELD
  timestamp: ...,      // NEW FIELD
  content: "..."
}

// dashboard-v1: Ignores new fields ✅
// dashboard-v2: Ignores new fields ✅
// Both keep working!
```

**Phase 4: Dashboard uses author**
```javascript
// dashboard-v3: Adds author statistics
artifacts.stream.subscribe((artifact) => {
  counter.increment();
  typeCount[artifact.type]++;
  authorCount[artifact.author || 'unknown']++;  // Handles old (no author) and new
});

// All three versions coexist:
// dashboard-v1: Still running ✅
// dashboard-v2: Still running ✅
// dashboard-v3: Joins the party ✅
```

### Rendering View Independence

**The key insight:** Rendering views don't need updates when data model extends!

**Example scenario:**

**Producer adds new fields:**
- Requirements now include `priority` field
- Code artifacts now include `coverage` metric
- Schemas gain `examples` section

**Existing rendering views:**
- Glossary renderer: Displays terms → **unchanged** (doesn't use new fields)
- Timeline view: Shows artifacts by date → **unchanged** (doesn't need new fields)
- Dependency graph: Visualizes relationships → **unchanged** (metadata still same)

**Only views that WANT new fields update:**
- Priority dashboard: **upgrades** to show priority field
- Coverage report: **upgrades** to display coverage metrics
- Schema browser: **upgrades** to show examples

**Others continue unchanged** - no forced upgrades!

### Microservices Benefits

This architecture naturally supports microservices patterns:

**1. Independent Deployment**
- Each service upgrades on its own schedule
- No "big bang" coordinated releases
- Gradual rollout, easy rollback

**2. Bounded Contexts**
- Each service consumes what it needs from stream
- Ignores fields outside its domain
- Schema changes don't ripple across services

**3. Evolutionary Architecture**
- Start simple, add fields incrementally
- Services adopt new fields when ready
- No breaking changes force cascading updates

**4. Polyglot Consumers**
- Different services in different languages
- Each uses its own schema version
- No central schema enforcement (beyond AVRO compatibility)

**5. Resilience**
- Service downtime doesn't block producer upgrades
- Consumers catch up when back online
- Schema mismatch handled gracefully (defaults, ignoring unknowns)

### The "No Migration Headaches" Extends to Upgrades

**Original insight:** No migration when creating new indexes

**Extended insight:** No migration when evolving application either!

**Both stem from same principle:**
- Immutable artifacts (source of truth never changes)
- Consumers choose their view (schema version, fields used)
- Additive evolution (backward compatible by default)

**The freedom this provides:**
- Experiment with new fields (add, use, remove if not useful)
- Upgrade services independently (no coordination overhead)
- Support multiple versions simultaneously (gradual transition)
- Roll back easily (old schema still valid)

### Success Criteria

**This upgrade model succeeds when:**

1. **Producers can add fields** without breaking consumers
2. **Consumers upgrade independently** without coordination
3. **Old artifacts remain valid** indefinitely
4. **Schema evolution is additive** (backward compatible by default)
5. **Rendering views stable** across data model extensions
6. **Microservices truly independent** (no forced coupling)

---

## Design Decisions (To Be Made)

### 1. Bidirectional Sync Strategy

**Native → Derived:**
- Continuous background consumer? ✅ (real-time sync)
- Batched (every N records or T seconds)? (efficiency)
- On demand (user command)? (control)

**Derived → Native:**
- Git commit hook? ✅ (automatic)
- File save event? (real-time, complex)
- Explicit command (`splectrum sync`)? ✅ (predictable)

**Conflict resolution:**
- Last-write-wins with warnings? (simple, lossy)
- Three-way merge? (complex, correct)
- Manual resolution required? (safe, friction)

### 2. Index Persistence Format

**Options per index type:**

**Glossary:** CSV (human-readable, git-friendly)
**Dependency graph:** RocksDB (efficient traversal, embedded)
**Timeline:** SQLite (queryable, lightweight)
**Full-text search:** MeiliSearch or SQLite FTS5 (specialized)
**Type index:** In-memory + WAL (fast, durable)

**Trade-offs:**
- Human-readable vs performance
- Embedded vs external
- Query capabilities vs simplicity

### 3. PK Spacing and Partitioning

**Current proposal:** Spot-based partitioning, path-based keys

**Alternatives:**
- Hash-based partitioning (even distribution, no locality)
- Time-based partitioning (recent data hot, old cold)
- Size-based (large artifacts separate from small)

**Evaluation criteria:**
- Query patterns (how will data be accessed?)
- Parallelism (can consumers work independently?)
- Hotspots (avoid overloaded partitions)

### 4. Schema Evolution Strategy

**Rigid parts (always AVRO):**
- Metadata envelope
- Index structures
- Well-defined records

**Flexible parts (format indicator):**
- Artifact content (markdown, CSV, binary)
- Free-form natural language
- Unknown future formats

**Bridge mechanisms:**
- Wrapper schema: `{ format: "X", content: bytes }`
- Schema registry for evolving structured parts
- Compatibility rules (backward, forward, full)

### 5. Bootstrap and Migration

**Initial population:**
- Existing filesystem → scan and produce to Kafka
- Git history → replay into Kafka (time-travel!)
- Snapshot + forward (current state + new changes)

**Version upgrades:**
- Schema v1 records → upgrade to v2?
- Lazy migration (on read)?
- Batch reprocessing (replay + transform)?

---

## Implementation Phases

### Phase 1: Foundation (Current State)

**Status quo:**
- Filesystem structure (works, proven)
- Git version control
- Human editing workflow

**No changes needed yet.**

### Phase 2: Native Layer Bootstrap

**Goals:**
- Kafka infrastructure setup
- Filesystem → Kafka initial sync
- Artifact stream established

**Deliverables:**
- Kafka topic(s) created
- Sync tool: filesystem → Kafka producer
- Monitoring/verification (checksums match)

**Risk:** Bidirectional sync complexity deferred

### Phase 3: First Indexes

**Goals:**
- Prove index materialization pattern
- Simple indexes (glossary, type)
- Rebuild mechanism validated

**Deliverables:**
- Glossary index (CSV format)
- Type index (JSON format)
- Consumer group consuming artifact stream
- Index rebuild tool/command

**Benefit:** Demonstrates "no migration" value

### Phase 4: Derived Sync (Bidirectional)

**Goals:**
- Native → Derived continuous sync
- Derived → Native on-demand sync
- Conflict detection and warnings

**Deliverables:**
- Background filesystem updater (Kafka → files)
- Git hook or sync command (files → Kafka)
- Conflict detection logic
- User documentation

**Risk:** Conflict resolution complexity

### Phase 5: Multi-Model Interfaces

**Goals:**
- Document store API (backed by indexes)
- Graph query API (backed by dependency index)
- Streaming API (backed by Kafka)
- Transactional API (backed by Kafka transactions)

**Deliverables:**
- Data layer API implementation
- Index-backed query execution
- Performance benchmarks
- Interface documentation

**Benefit:** Full multi-model data layer operational

### Phase 6: Advanced Indexes

**Goals:**
- Sophisticated indexes (dependency graph, full-text search, timeline)
- Cascading changelogs
- Performance optimization

**Deliverables:**
- RocksDB-backed dependency index
- Full-text search index (MeiliSearch or FTS5)
- Timeline/temporal queries
- Snapshot + delta optimization

**Benefit:** Rich query capabilities

---

## Open Questions

### Technical

1. **Kafka or Kafka-compatible?** (Redpanda, Apache Pulsar alternatives?)
2. **Embedded or external Kafka?** (Complexity vs control)
3. **How to handle binary artifacts?** (Images, PDFs, etc. in Kafka?)
4. **Index rebuild triggers?** (Automatic, manual, scheduled?)
5. **Changelog retention?** (Forever, time-based, size-based?)
6. **Multi-repository model?** (One Kafka cluster, multiple topics? Or distributed?)

### Operational

1. **Who runs Kafka?** (Local dev, shared server, cloud?)
2. **Backup/restore strategy?** (Kafka has replication, but snapshots?)
3. **Monitoring/observability?** (Kafka metrics, index lag, sync status?)
4. **Failure modes?** (Kafka down, index corrupted, sync conflicts?)
5. **Development workflow?** (How do developers work with this locally?)

### Strategic

1. **When to introduce?** (MVP without Kafka, or Kafka from start?)
2. **Migration path?** (Existing users/projects - how do they adopt?)
3. **P2P implications?** (Kafka + P2P = complex, or natural fit?)
4. **Browser compatibility?** (Kafka in browser? Alternative for web?)

---

## Key Insights

### 1. Flexibility Is The Feature

> **"No migration headaches"** - because indexes are views, not data. Create new access patterns without moving artifacts.

**This is transformative:**
- Try new query pattern → create index, test, iterate
- Deprecate old approach → delete index, create new one
- Evolve schema → old records stay, new index handles both
- Experiment freely → source of truth (artifact stream) untouched

### 2. Dual Representation Serves Both

**AI gets:** Kafka streams (efficient, schema-enforced, type-guided)
**Humans get:** Filesystem (familiar, git-friendly, editable)
**Both win:** No compromise, each optimized for their consumer

### 3. Cascading Enables Composition

**Indexes build on indexes:**
- Base artifact stream
- → Glossary index
- → Dependency index (uses glossary)
- → Timeline view (uses both)

**Changelogs enable reactivity:**
- Artifact created → glossary updates → downstream consumers notified

### 4. Start Simple, Evolve Organically

**Don't need everything at once:**
- Phase 1: Just filesystem (proven, works)
- Phase 2: Add Kafka backing (stream established)
- Phase 3: Simple indexes (prove pattern)
- Phase 4+: Sophistication as needed

**Each phase adds value without breaking previous:**
- Filesystem still works (derived from Kafka)
- Indexes are additive (source stream unchanged)
- Interfaces layer on top (don't replace foundation)

---

## Success Criteria

**This architecture succeeds when:**

1. **Developers can add new access patterns** without data migration
2. **AI can consume efficiently** (streaming, schema-enforced, partitioned)
3. **Humans can edit naturally** (filesystem, git, familiar tools)
4. **Indexes rebuild reliably** (from artifact stream, always correct)
5. **Performance is acceptable** (cascading doesn't create bottlenecks)
6. **System is understandable** (concepts clear, debugging tractable)

---

## Related Work

**CIP-009:** splectrum-native repository model (location-transparent, multi-model)
**CIP-010:** Product vision and positioning (HAICC, P2P, communities)

**Backlog items:**
- Repository Streaming Structure (high priority) - implements this architecture
- Natural Language Schema Transformation (high priority) - bridges rigid/flexible
- Kafka Compatible Records (high priority) - native layer foundation
- API State Management (high priority) - uses streaming + transactional

**Research:**
- Phase 1: Kafka stream-table duality, multi-model databases
- Phase 2: Event Sourcing + CQRS, P2P systems, Merkle trees

---

## Next Steps

**When processing this CIP:**

1. **Validate with prototypes:**
   - Simple Kafka → filesystem sync
   - Single index materialization (glossary)
   - Rebuild mechanism

2. **Design detailed specs:**
   - Artifact record schema (AVRO)
   - Index formats (per type)
   - Sync protocol (bidirectional)
   - API surface (data layer interfaces)

3. **Update backlog:**
   - Break "Repository Streaming Structure" into phases
   - Add specific tasks (Kafka setup, sync tool, first index)
   - Sequence appropriately (dependencies clear)

4. **Create design documents:**
   - Kafka topic design
   - Index architecture per type
   - Sync tool specification
   - Performance optimization strategies

5. **Consider alternatives:**
   - Kafka-compatible alternatives (Redpanda, Pulsar)
   - Embedded vs external
   - MVP without Kafka (defer complexity?)

---

**Status:** Proposed - Major architectural direction for data layer
**Scope:** Affects all data storage, access, and synchronization
**Priority:** High - Foundational for multi-model data layer implementation

**The excitement:** We fully enter data land! The flexibility is the feature - start simple, evolve organically, no migration pain.
