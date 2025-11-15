# Location-Transparent References and Cross-Repository Linking

**Date:** 2025-11-14
**Context:** Adhoc discussion exploring repository model evolution and cross-repository reference patterns
**Participants:** Human (Herma), AI (Claude)

---

## Background

This discussion emerged from reviewing the two backlog items added during Project 04 closure:
- **Repository Streaming Structure** - Modeling repository as streaming system (tables + indexes + Kafka-compatible streams)
- **Natural Language Schema Transformation** - Bidirectional transformation between natural language requirements ↔ rigid schemas

The conversation explored how this repository model should evolve to support:
1. Migration from single repository (spl2) to multiple repositories
2. Cross-repository linking as repositories split
3. Location-transparent references (filesystem, GitHub, P2P)
4. Seamless integration of external resources (web, P2P networks)

---

## Key Insights

### 1. Location-Transparent References

**Core Principle:** Indexes contain logical references, not physical locations.

**Index format:**
```csv
term,detail_ref
"Collaboration","spl2-foundations:artifacts/Collaboration_detail_v1.0.0.md"
"RuntimeAPI","spl2-runtime:docs/API_spec_v2.1.0.md"
```

**Resolution strategies (try in priority order):**
1. Local filesystem: `~/splectrum/spl2-runtime/docs/API_spec_v2.1.0.md`
2. Local cache: `~/.splectrum/cache/spl2-runtime/docs/API_spec_v2.1.0.md`
3. GitHub: `https://github.com/splectrum/spl2-runtime/blob/main/docs/...`
4. P2P network: DHT lookup for `spl2-runtime` → peer download
5. Mirrors/forks: Configured alternatives

**The reference is a logical identifier, not a path. Resolution layer handles WHERE.**

**Parallels to established patterns:**
- **URN vs URL:** What it is (URN) vs where it lives (URL)
- **Git objects:** SHA hash reference, location-independent resolution
- **Package managers:** Logical name (express@4.18.0), multiple resolution sources
- **DNS/DHT:** Logical name → physical location lookup

**Benefits:**
- ✅ References survive repository migrations (don't break when location changes)
- ✅ Multiple resolution strategies (automatic fallback: local → cache → remote → P2P)
- ✅ Offline-capable (cache makes everything local eventually)
- ✅ P2P-ready (same reference model works for distributed networks)
- ✅ Efficient (immutability enables permanent caching)

---

### 2. Smooth Repository Migration Pattern

**The Challenge:** Single repository (spl2) will evolve into multiple repositories, not all at once. Need nearly transparent migration.

**The Solution:** Logical references enable migration without breaking existing references.

#### Phase 1: Single Repository with Logical References (Now)

**Current internal references:**
```csv
term,detail_ref
"Collaboration","projects/05-.../Collaboration_detail_v1.0.0.md"
```

**Evolve to logical references (still internal):**
```csv
term,detail_ref
"Collaboration","spl2:projects/05-.../Collaboration_detail_v1.0.0.md"
```

**Resolution:** Strip `spl2:` prefix → relative path (within same repo)

**Impact:** Zero breaking changes, references now migration-ready

#### Phase 2: First Split (e.g., Extract Foundations)

**Action:** Create `spl2-foundations` repository, move foundations/ content

**Update indexes in spl2:**
```csv
term,detail_ref
"Collaboration","spl2-foundations:artifacts/Collaboration_detail_v1.0.0.md"
"RuntimeAPI","spl2:projects/runtime/API_spec_v2.1.0.md"
```

**Resolution config:**
```yaml
# spl2/.splectrum/resolution.yaml
repositories:
  spl2: .  # Current repo
  spl2-foundations: ../spl2-foundations  # Sibling repo
```

**For users:**
- Clone both repos as siblings
- Resolution automatically finds documents
- **Nearly transparent** - indexes updated, references still resolve

**CHANGELOG documents the split:**
```markdown
# glossary/INDEX_CHANGELOG.md

## 2025-11-15: Foundation split
- Foundation terms now reference spl2-foundations repository
- Resolution: Clone spl2-foundations as sibling to spl2
- See: spl2/.splectrum/resolution.yaml for configuration
```

#### Phase 3: Repository Model Extraction (The Meta-Move)

**Action:** Create `splectrum-repository-model` repository

**What moves:**
- Repository model requirements
- Resolution protocol specification
- Index format specifications
- Migration guides
- Reference implementation (if code exists)

**The beauty:** Repository model demonstrates itself!

**References TO repository model from other repos:**
```csv
# spl2/foundations/index.csv
concept,detail_ref
"Repository Model","splectrum-repository-model:docs/Overview_v1.0.0.md"
"Index Format","splectrum-repository-model:specs/Index_format_v1.0.0.md"
```

**References FROM repository model to examples:**
```csv
# splectrum-repository-model/examples/index.csv
example,detail_ref
"SPL2 Glossary","spl2:glossary/index.csv"
"SPL2 Foundations","spl2-foundations:index.csv"
```

**Self-demonstrating pattern:** Repository model uses its own patterns to manage its own extraction and documentation.

#### Phase 4: Continued Evolution (N Repositories)

```
splectrum/
├── spl2/                           # Core project
├── spl2-foundations/               # Foundations & principles
├── spl2-runtime/                   # Runtime implementation
├── spl2-applications/              # Example applications
├── splectrum-repository-model/     # Repository model itself
├── splectrum-dsl-engine/          # DSL engine (future)
└── splectrum-methodology/         # TDC methodology (future)
```

**Each repo's resolution config:**
```yaml
# spl2-applications/.splectrum/resolution.yaml
repositories:
  spl2: ../spl2
  spl2-runtime: ../spl2-runtime
  spl2-foundations: ../spl2-foundations
  splectrum-repository-model: ../splectrum-repository-model
```

**Indexes freely reference across repos - cross-linking works transparently.**

---

### 3. Nearly Transparent Migration

**Key insight:** Logical references enable migration without breaking existing references.

**Migration checklist (for any split):**
1. Identify what's moving (artifacts, projects, etc.)
2. Create target repository (extract content)
3. Update indexes (change `spl2:path` → `new-repo:path`)
4. Update resolution config (add new repository mapping)
5. Document in CHANGELOG (what moved, why, how to configure)
6. Validate references (CI/CD checks all references resolve)

**For users:**
```bash
# One-time setup when new repo added
cd ~/splectrum
git clone https://github.com/splectrum/spl2-foundations

# Or automated:
splectrum sync  # Clones missing repos based on resolution configs
```

**Transparency maintained because:**
- References are logical (don't contain filesystem paths)
- Resolution layer handles location lookup
- Caching makes remote feel local
- Errors are clear ("Repository spl2-foundations not found. Run: splectrum sync")

**Index CHANGELOG becomes migration documentation** - documents evolution of the knowledge graph.

---

### 4. No Submodules - Standalone Entities with Interlinking

**Decision:** Not using git submodules. Prefer standalone repositories with explicit interlinking.

**Rationale:**
- Each repository is independent (can be cloned/used standalone)
- No tight coupling at git level
- Cross-references explicit (in indexes and resolution config)
- Simpler mental model (separate repos, not nested)
- Works better with P2P distribution (independent units)

**Responsibility:** Repository owning the index is responsible for referential integrity
- Valid references (ensuring referenced documents exist somewhere)
- Version pinning (specifying exact version for immutability)
- Testing/validation (CI/CD checks that all references resolve)
- Documentation (README explains referenced repositories)

**Index owner doesn't control WHERE documents live, but validates THAT they exist.**

---

### 5. Cross-Repository Reference Intensity

**Why cross-linking will grow:**

#### Specialization Requires Integration
```
spl2-runtime references:
├─ spl2-foundations (principles, patterns)
├─ splectrum-repository-model (how to structure docs)
└─ splectrum-methodology (TDC practices)

splectrum-methodology references:
├─ spl2 (working example)
├─ spl2-foundations (philosophy)
├─ splectrum-repository-model (documentation patterns)
└─ [other domain examples]
```

#### Examples Reference Specifications
```
spl2-applications:
├─ References spl2-runtime:docs/API_spec_v2.1.0.md
├─ References spl2-foundations:patterns/P2P_architecture_v1.0.0.md
└─ References splectrum-methodology:practices/Project_lifecycle_v1.2.0.md
```

#### Evolution Tracking
```
splectrum-repository-model:docs/Migration_v2.0.0.md
└─ References: spl2:projects/XX-repository-model/Migration_v1.0.0.md
   (shows evolution from v1.0 → v2.0)
```

#### Methodology Generalization
When TDC becomes domain-agnostic:
```
splectrum-methodology (general patterns)
├─ Referenced by: spl2 (software domain)
├─ Referenced by: splectrum-hardware (hardware domain)
├─ Referenced by: splectrum-research (research domain)
└─ References back: spl2 (foundational example)
```

#### Community Contributions
```
alice-spl2-extensions:
├─ References: spl2-runtime:docs/API_spec_v2.1.0.md
├─ References: splectrum-repository-model:specs/Index_format_v1.0.0.md
└─ Provides: Extensions that spl2-applications can reference
```

**Result:** Indexes form a distributed, evolving knowledge graph
- No central authority (each repo governs itself)
- References are logical (survive migrations)
- Resolution is local decision (filesystem, GitHub, P2P, cache)

---

### 6. Universal Reference Model - External Resources

**Profound extension:** Index format is agnostic to WHAT it references.

**The same index can reference:**
- Internal artifacts (Splectrum repos)
- External web resources (versioned or mutable)
- P2P resources (Pear, IPFS, etc.)
- Local files (outside repos)

**Universal index format:**
```csv
term,detail_ref,type,immutability
"Collaboration","spl2-foundations:artifacts/Collaboration_v1.0.0.md","internal","immutable"
"AVRO Spec","https://avro.apache.org/docs/1.11.1/specification/","external-web","versioned-url"
"Kafka Streams","https://kafka.apache.org/documentation/streams/","external-web","mutable"
"Pear Docs","pear://docs.pears.com/api","external-p2p","live"
"Local Notes","file:///home/herma/notes/spl2-ideas.md","local","mutable"
```

**Same resolution interface, different strategies:**

#### Internal References (Splectrum Repos)
```
Reference: "spl2-foundations:artifacts/Collaboration_v1.0.0.md"
Resolution: Local → Cache → GitHub → P2P
Immutability: Guaranteed (versioned filename)
Validation: SHA hash, version pin
```

#### External Web (Versioned URLs)
```
Reference: "https://avro.apache.org/docs/1.11.1/specification/"
Resolution: Direct fetch → Cache
Immutability: URL includes version (1.11.1)
Validation: Cache with timestamp, optional archive.org fallback
```

#### External Web (Mutable)
```
Reference: "https://kafka.apache.org/documentation/streams/"
Resolution: Fetch → Cache with TTL
Immutability: None (content may change)
Validation: Timestamp capture, periodic refresh
Metadata: last_checked, content_hash (detect changes)
```

#### External P2P
```
Reference: "pear://docs.pears.com/api"
Resolution: P2P network → Cache
Immutability: Depends on source (may be versioned)
Validation: Signature verification
```

#### Local Files (Outside Repos)
```
Reference: "file:///home/herma/notes/spl2-ideas.md"
Resolution: Direct filesystem access
Immutability: None (working notes)
Validation: Existence check only
```

---

### 7. Handling Different Immutability Guarantees

**Enhanced index format with metadata:**
```csv
term,detail_ref,source_type,immutability,last_validated,content_hash
"Collaboration","spl2-foundations:artifacts/Collaboration_v1.0.0.md","internal","immutable","","sha256:abc123"
"AVRO Spec","https://avro.apache.org/docs/1.11.1/specification/","external","versioned-url","2025-11-14","sha256:def456"
"Kafka Guide","https://kafka.apache.org/documentation/","external","mutable","2025-11-14","sha256:789xyz"
"Pear API","pear://docs.pears.com/api/v2","p2p","versioned","2025-11-14","sha256:fedcba"
```

**Metadata enables different handling strategies:**
- `immutable` → Cache forever, never re-fetch
- `versioned-url` → Cache until version changes
- `mutable` → Cache with TTL, refresh periodically
- Content hash → Detect when mutable content changes

**From AI/tooling perspective - same interface:**
```javascript
// Same function, different reference types
const content = await resolve("spl2-foundations:artifacts/Collaboration_v1.0.0.md")
const content = await resolve("https://avro.apache.org/docs/1.11.1/spec/")
const content = await resolve("pear://docs.pears.com/api/v2")
```

---

### 8. Use Cases Unlocked by Universal References

#### Reference Upstream Documentation
```csv
# spl2-runtime/references/index.csv
technology,spec_ref,version,notes
"AVRO","https://avro.apache.org/docs/1.11.1/specification/","1.11.1","Official spec (stable URL)"
"Kafka","https://kafka.apache.org/35/documentation/streams/","3.5","Kafka Streams (versioned)"
"Bare","https://github.com/holepunchto/bare/blob/main/README.md","live","Latest docs (mutable)"
"Pear","pear://docs.pears.com/","live","P2P distribution docs"
```

**Benefits:**
- Single source of truth (index lists all references)
- Version tracking (know which spec version you reference)
- Cached locally (offline access to web resources)
- Change detection (know when mutable content changes)

#### Capture Web Resources as Immutable Artifacts

**Problem:** Web pages change or disappear

**Pattern:** Capture snapshot, store as internal artifact

```csv
# Before (mutable web reference)
"Node Streams","https://nodejs.org/api/stream.html","external","mutable"

# After (captured immutable)
"Node Streams","spl2-runtime:references/nodejs_streams_v18.12.0.md","internal","immutable"
```

**Workflow:**
```bash
# Capture web resource
splectrum capture https://nodejs.org/api/stream.html \
  --output spl2-runtime:references/nodejs_streams_v18.12.0.md \
  --metadata version=18.12.0,captured=2025-11-14

# Index updated automatically
# Web content now preserved as versioned artifact
```

**Reference progression over time:**
```csv
# Evolution: Mutable external → Immutable internal

# Day 1: Direct reference (mutable)
"Bare API","https://github.com/holepunchto/bare#api","external","mutable"

# Day 30: Captured snapshot (immutable)
"Bare API","spl2-runtime:references/bare_api_2025-11-14.md","internal","immutable"

# Day 60: Curated documentation (versioned)
"Bare API","spl2-runtime:docs/Bare_API_v1.0.0.md","internal","immutable"
```

#### Cross-Link to Community Resources
```csv
# spl2/learning/index.csv
topic,resource_ref,type,quality
"P2P Patterns","https://github.com/kappa-db/kappa-core","github","high"
"Streaming Architecture","https://martin.kleppmann.com/papers/","academic","high"
"CRDT Intro","https://crdt.tech/","external","excellent"
"Pear Examples","pear://examples.pears.com/","p2p","official"
```

**Curated references with quality ratings.**

#### Multi-Source Documentation Sets
```csv
# glossary/DSL_GLOSSARY_index.csv
term,primary_ref,upstream_ref,example_ref
"Record","spl2:glossary/DSL_GLOSSARY.md#record","https://avro.apache.org/docs/1.11.1/spec/#schema-record","spl2:examples/record_usage.js"
"Stream","spl2:glossary/DSL_GLOSSARY.md#stream","https://kafka.apache.org/documentation/#streams","spl2:examples/stream_basic.js"
```

**For each term:**
- Primary definition (internal, curated)
- Upstream specification (external, authoritative)
- Working example (internal, practical)

**AI can fetch all three for complete context.**

#### Working Notes Integration
```csv
# Personal index (not committed)
topic,detail_ref,status
"Migration Ideas","file:///home/herma/notes/spl2-migration.md","draft"
"API Design","spl2:projects/wip/api-thoughts.md","active"
```

**Seamless integration of:**
- Committed work (internal refs)
- Work in progress (repo refs to uncommitted)
- Personal notes (local file refs)

---

### 9. Change Detection for Mutable References

#### Strategy 1: Timestamp + Content Hash
```csv
ref,last_fetched,content_hash,changed
"https://kafka.apache.org/docs/","2025-11-14T10:30:00Z","sha256:abc123","false"
"https://nodejs.org/api/stream.html","2025-11-14T10:30:00Z","sha256:def456","true"
```

**Detection workflow:**
```javascript
async function validateMutableRef(ref, metadata) {
  const fresh = await fetch(ref)
  const freshHash = sha256(fresh)

  if (freshHash !== metadata.content_hash) {
    // Content changed!
    console.warn(`Content changed: ${ref}`)
    console.warn(`Old hash: ${metadata.content_hash}`)
    console.warn(`New hash: ${freshHash}`)

    // Options:
    // 1. Update hash (accept change)
    // 2. Capture snapshot (preserve old version)
    // 3. Alert maintainer (review needed)
  }
}
```

#### Strategy 2: Capture Policy
```yaml
# .splectrum/capture-policy.yaml
external_references:
  immutability_policy:
    versioned_urls: cache_forever
    mutable_urls:
      cache_duration: 30d
      on_change: alert
      archive: true

  auto_capture:
    - pattern: "https://avro.apache.org/**"
      action: archive_on_change
    - pattern: "https://nodejs.org/api/**"
      action: snapshot_monthly
```

---

### 10. The Elegant Unification

**Everything becomes referenceable in the same way:**
```
Internal artifacts (guaranteed immutable)
  ↓
External versioned (best-effort immutable)
  ↓
External mutable (timestamped snapshots)
  ↓
Local working files (live, not immutable)
```

**The index is the universal catalog:**
- What exists (term/topic)
- Where to find it (reference)
- What guarantees apply (immutability metadata)
- When last validated (timestamp)
- What changed (content hash)

**Resolution layer handles the complexity:**
- Fetch strategies (local, cache, web, P2P)
- Validation (hash, version, signature)
- Caching (forever, TTL, on-demand)
- Change detection (hash comparison)
- Fallbacks (archive.org, mirrors, old snapshots)

---

### 11. Web Integration Pattern Example

**AVRO specification reference:**

```csv
# spl2-runtime/references/index.csv
spec,official_ref,local_copy,notes
"AVRO 1.11.1","https://avro.apache.org/docs/1.11.1/specification/","references/avro_spec_1.11.1.md","Captured 2025-11-14"
```

**First reference:**
1. Fetch from official URL
2. Cache locally
3. Capture as markdown (optional)
4. Store content hash
5. Add to index

**Subsequent references:**
1. Check local cache (instant)
2. Validate hash (ensure not corrupted)
3. Return cached content

**Periodic validation:**
1. Re-fetch from official URL
2. Compare hashes
3. If changed: Alert, capture new version, update index
4. If same: Update last_validated timestamp

**Offline mode:**
1. Use cache only
2. Flag if content might be stale
3. Continue working (cached content available)

---

### 12. P2P Integration Pattern

**Pear documentation reference:**

```csv
resource,ref,verification
"Pear Core API","pear://docs.pears.com/api/core","pubkey:abc123"
"Pear Runtime","pear://docs.pears.com/runtime","pubkey:abc123"
```

**Resolution:**
1. Query DHT for `docs.pears.com`
2. Find peers hosting content
3. Download `/api/core`
4. Verify signature (pubkey:abc123)
5. Cache locally
6. Return content

**Benefits:**
- ✅ Distributed (no single point of failure)
- ✅ Verifiable (signature ensures authenticity)
- ✅ Cacheable (immutable content, cache forever)
- ✅ Same interface as other references

---

## The Beautiful Synthesis

### Self-Similarity
Repository model uses itself to manage itself - the meta-pattern demonstrated through its own evolution.

### Smooth Migration
Logical references survive repository splits transparently - from single repo → N repos → P2P distribution.

### Local Autonomy
Each repository governs its own indexes and artifacts independently.

### Global Coherence
Cross-references form a distributed knowledge graph spanning all repositories.

### Location Transparency
Same reference resolves via multiple strategies: local, cache, GitHub, P2P, mirrors.

### Immutable Content
References stay valid forever through versioned documents and content-addressed storage.

### Mutable Indexes
Can reorganize and update navigation without breaking references.

### Bootstrapping Elegance
System documents and implements its own evolution pattern.

### Universal References
Internal artifacts, external web resources, P2P networks, local files - all referenceable the same way.

### Fractal Pattern
Same patterns work at all scales: file, repo, network.

---

## What This Enables

**A unified knowledge graph spanning:**
- Internal artifacts (controlled, immutable)
- External specifications (referenced, versioned)
- Community resources (curated, quality-rated)
- P2P documentation (distributed, verifiable)
- Working notes (personal, evolving)

**All navigable through compact indexes.**
**All resolvable through unified protocol.**
**All cacheable for offline use.**
**All verifiable (to varying degrees).**

**The repository model becomes a universal reference framework** - not just for Splectrum artifacts, but for all knowledge relevant to the work.

---

## Implementation Path (Small Steps)

### Step 1: Introduce Logical References (Current spl2)
- Add `spl2:` prefix to references in indexes
- Impact: Minimal (internal change)
- Validation: References still resolve (strip prefix = relative path)
- Artifact: Updated index format specification

### Step 2: Build Resolution Layer (Simple Version)
- Create: `tools/resolve.js` or similar
- Simple reference resolution (parse repo:path, load config, resolve)
- Impact: Enables testing cross-repo references
- Validation: Create dummy second repo, test resolution
- Artifact: Resolution protocol specification v1.0.0

### Step 3: Extract Repository Model Documentation
- Create: Backlog item for repository model extraction
- Scope: Document patterns, specify formats, specify protocol, document migration
- Keep in spl2 initially (projects/XX-repository-model/)
- Validation: Self-documenting (uses own patterns)

### Step 4: First Real Split (When Ready)
- Candidate: Foundations (relatively stable, high-value for cross-reference)
- Process: Create repo, move content, update indexes, document, validate
- Impact: Proves cross-repo pattern works
- Learning: Discover friction points, refine tooling

### Step 5: Extract Repository Model (After Step 4 Success)
- Now: Repository model moves to its own repo
- Why after Step 4: Pattern proven with one split, now extract the pattern itself
- Self-demonstration: Repository model uses its own patterns to manage extraction

---

## Key Decisions

1. **No git submodules** - Standalone repositories with explicit interlinking
2. **Logical references** - What it is, not where it lives (URN-style)
3. **Location-transparent resolution** - Multiple strategies, automatic fallback
4. **Index responsibility** - Repository owning index validates referential integrity
5. **Universal reference model** - Internal + external web + P2P + local files
6. **Immutability metadata** - Different guarantees, same interface
7. **Change detection** - Content hashing for mutable external resources
8. **Progressive capture** - Mutable external → snapshot → curated internal artifact

---

## Strategic Impact

**Repository model becomes:**
- Foundation for all Splectrum work (documentation, code, methodology)
- Universal reference framework (internal + external resources)
- Self-demonstrating pattern (uses itself to manage itself)
- Generalizable methodology (applicable beyond Splectrum)
- P2P-ready architecture (location-transparent by design)

**Enables:**
- Smooth migration from monorepo to distributed repositories
- Cross-repository linking with referential integrity
- Integration of external knowledge (web, P2P, community)
- Offline-first workflows (comprehensive caching)
- Community contributions (forks can join the graph)
- Methodology generalization (same patterns, different domains)

---

## This Could Be a Thing of Beauty

**The beauty emerges from:**
1. **Self-similarity:** Repository model uses itself to manage itself
2. **Smooth migration:** Logical references survive repository splits
3. **Local autonomy:** Each repo governs its own indexes
4. **Global coherence:** Cross-references form distributed knowledge graph
5. **Location transparency:** Same reference, multiple resolution strategies
6. **Immutable content:** References stay valid forever (versioned documents)
7. **Mutable indexes:** Can reorganize without breaking references
8. **Bootstrapping elegance:** System documents its own evolution
9. **Universal references:** Internal + external + P2P + local - same interface
10. **Fractal pattern:** Same patterns at all scales (file, repo, network)

**It's beautiful because it's:**
- Simple (logical references, immutable documents, mutable indexes)
- Powerful (supports single repo → N repos → P2P distribution)
- Self-demonstrating (repository model is its own example)
- Fractal (same patterns at all scales)
- Universal (works for any knowledge, not just code)

---

## Next Considerations

When ready to formalize this work:
- Create backlog item for repository model exploration
- Prototype logical references in current spl2
- Build simple resolution tool
- Plan first repository split (foundations candidate)
- Extract repository model to dedicated repo (after first split proves pattern)

**Small steps, each validated, building toward the elegant whole.**

---

## Post-Discussion Insights

### Naming: splectrum-native Repository Model

**Conclusion:** This should be called the **splectrum-native repository model**.

**"Native" captures:**
- Built for purpose (not adapted from elsewhere)
- Optimized for environment (AI collaboration, P2P, distributed)
- Foundation layer (what everything else builds on)
- Identity (how Splectrum repositories work)
- Adoption framework (others can be "splectrum-native compatible")

**Repository naming structure:**
```
splectrum/
├── splectrum-native/           # The repository model itself
├── spl2/                       # Uses splectrum-native
├── spl2-foundations/           # Uses splectrum-native
├── spl2-runtime/               # Uses splectrum-native
└── splectrum-methodology/      # Uses splectrum-native
```

**Three foundation repositories:**
1. **splectrum-native** - Repository model (structure, navigation, references)
2. **splectrum-methodology** - TDC methodology (how we work with AI)
3. **spl2-foundations** - Philosophy and principles (what we believe)

### Critical Design Realization: Data Layer Foundation

**Key insight:** The splectrum-native repository model maps directly to data layer implementation.

**Repository structure:**
```
Repository Layer (splectrum-native):
├─ Tables (immutable streams of documents)
├─ Indexes (mutable CSV lookups)
├─ References (logical, location-transparent)
└─ Resolution (fetch + cache + validate)
```

**Maps to multiple data layer interfaces:**
```
Data Layer Interfaces:
├─ Streaming interface (append-only changelog)
├─ Transactional interface (project folders = transactions)
├─ Document store interface (versioned artifacts)
├─ Relational interface (indexes = queryable tables)
└─ Key-value interface (resolution cache)
```

**Same underlying data (files in repos), different access patterns (interface choice).**

**Example interface exposure:**
```javascript
// Repository as data layer
const spl = new Splectrum({
  repositories: ['spl2', 'spl2-foundations'],
  resolution: { /* config */ }
})

// Multiple interfaces to same data
const stream = spl.stream('spl2-foundations:artifacts')          // Streaming
const doc = await spl.get('spl2-foundations:Collab_v1.0.0.md')   // Document
const results = spl.query('SELECT * FROM glossary WHERE ...')    // Relational
const tx = spl.transaction('projects/new-project')               // Transactional
const val = await spl.resolve('spl2-runtime:docs/API.md')        // Key-Value
```

### CIP Recommendation

**Proposed:** Create CIP for splectrum-native as data layer foundation

**Why CIP:**
- Foundation-level impact (affects entire Splectrum architecture)
- Cross-cutting implications (repository model + data layer + runtime)
- Needs collaborative design thinking (multiple perspectives required)
- May evolve significantly (as implications discovered)

**Key design questions to explore:**

1. **Is splectrum-native the implementation foundation for data layer?**
   - Or is data layer broader (includes runtime state, execution records)?
   - How does file-based model map to runtime APIs?

2. **Interface exposure strategy**
   - Which interfaces to expose? (streaming, transactional, document, relational, KV)
   - How do they map to underlying repository structure?

3. **Runtime state vs repository state**
   - Repository: Persistent (artifacts, indexes, CHANGELOG)
   - Runtime: Ephemeral (execution state, active transactions, network)
   - How do they interact?

4. **Kafka/AVRO integration point**
   - Kafka-compatible changelog semantics
   - AVRO schemas for structured metadata
   - Schema registry for requirements/versions
   - How does this map to actual Kafka/AVRO usage?

5. **P2P distribution model**
   - Local: File system, Git, process isolation
   - Distributed: DHT, content verification, eventual consistency
   - How does data layer handle both transparently?

**If splectrum-native IS the data layer foundation:**
- Repository model becomes runtime specification
- File operations → API calls
- Git commits → transaction commits
- Index lookups → query interface
- Reference resolution → content-addressed storage

**Benefits of unified architecture:**
- ✅ Repository model = Data model = Runtime implementation
- ✅ No impedance mismatch (one coherent design)
- ✅ Multiple interface patterns (developer choice)
- ✅ Natural P2P fit (location-transparent by design)
- ✅ Schema evolution built-in (NL requirements + AVRO)
- ✅ Methodology meets implementation (same foundation)

**Dependencies:**
- Repository Streaming Structure backlog item
- Natural Language Schema Transformation addon
- Kafka Compatible Records
- AVRO Schema and RPC
- Pear P2P Platform

**Next steps:**
1. Create CIP (capture design questions)
2. Collaborative discussion (explore implications)
3. Spike/prototype (validate interface patterns)
4. Requirements extraction (formalize as project)
5. Implementation (after design validated)

---

**End of chat capture**

This discussion represents fundamental architectural thinking for how Splectrum will evolve from single repository to distributed knowledge graph, with location-transparent references enabling smooth migration, cross-repository linking, and seamless integration of external resources.

The realization that splectrum-native repository model could serve as the foundation for the entire data layer - exposing multiple interface patterns (streaming, transactional, document store, relational, key-value) over the same underlying structure - represents a significant architectural unification that warrants CIP-level collaborative design exploration.

The universal reference model - treating internal artifacts, external web resources, P2P networks, and local files with the same logical reference pattern - appears to be a genuinely novel contribution that could have impact beyond Splectrum.
