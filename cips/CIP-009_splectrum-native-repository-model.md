# CIP-009: splectrum-native Repository Model

**Status:** Proposed
**Created:** 2025-11-14
**Type:** Architectural Foundation
**Scope:** Repository structure, data layer, cross-repository linking

## Summary

Define and implement the **splectrum-native repository model** - a polyglot persistence architecture optimized for human-AI collaboration that serves as the foundation for SPL2's data layer.

This model combines:
- **Immutable artifact streams** (event sourcing)
- **Multiple mutable indexes** (CQRS projections)
- **Location-transparent references** (URN-style logical identifiers)
- **Multi-model query interfaces** (document, graph, streaming, transactional)
- **Natural language schemas** as first-class representation
- **P2P network native** design

## Context

During Project 04 (Bare Runtime Hello World) closure, extensive discussions surfaced the need for a repository model that:
1. Scales from single repository to multiple repositories seamlessly
2. Enables cross-repository and cross-platform linking (local/GitHub/P2P/web)
3. Reduces information lookup friction through streaming structure
4. Supports multiple data access patterns over unified storage
5. Optimizes for human-AI collaborative work patterns

This realization connects directly to SPL2's data layer implementation, where we need to expose transactional, streaming, document store, and graph query interfaces.

## Background Research

Comprehensive state-of-the-art research conducted across multiple domains validates core patterns and identifies genuine innovations:

### Phase 1 Research: Multi-Interface Data Systems
**Document:** `chats/2025-11-14_state-of-art-research-phase1-multi-interface-data-systems.md`

**Key Findings:**
- **Multi-model databases** (CosmosDB ARS model, ArangoDB) prove multiple interfaces over unified storage works at scale
- **Stream-table duality** (Kafka) directly maps to our artifacts (KStream) + indexes (KTable) pattern
- **Content-addressed storage** (IPFS, Git) validates immutability + Merkle tree verification
- **Schema evolution** (Confluent Schema Registry) provides compatibility checking patterns
- **No prior work found** on bidirectional NL ↔ rigid schema transformation (our innovation)

### Phase 2 Research: Knowledge Graphs & P2P Systems
**Document:** `chats/2025-11-14_state-of-art-research-phase2-knowledge-graphs-p2p-systems.md`

**Key Findings:**
- **RDF/Wikidata** prove URI-based cross-references scale to billions of statements
- **Event Sourcing + CQRS** pattern exactly matches our implicit architecture
- **OrbitDB** (Merkle-CRDTs, ipfs-log) parallels our artifact streams
- **Holochain** (agent-centric, personal source chains) suggests personal artifact streams + shared indexes
- **Persistent data structures** (Okasaki) theory validates structural sharing for efficiency
- **Datomic** distinction: accumulate-only (semantic) vs append-only (structural) - we're accumulate-only

### Design Discussion
**Document:** `chats/2025-11-14_location-transparent-references-and-cross-repo-linking.md`

**Key Patterns:**
- Location-transparent reference format: `repo:path` (URN-style logical identifiers)
- Separate resolution layer (filesystem, GitHub, P2P, web)
- Universal reference model spanning internal/external/P2P resources
- Smooth migration from single to multiple repositories via index updates
- CSV indexes as lightweight, version-controllable, human-readable format

## Connection to Existing Backlog

Two backlog items created during Project 04 closure capture specific aspects:

1. **[Repository Streaming Structure](../backlog/repository-streaming-structure.md)** (High Priority)
   - Repository as streaming system: tables (immutable artifacts) + indexes (mutable) + Kafka-compatible changelog streams
   - Foundation-level impact on information lookup friction

2. **[Natural Language Schema Transformation](../backlog/natural-language-schema-transformation.md)** (High Priority, Addon)
   - Bidirectional transformation: natural language requirements ↔ rigid schemas (AVRO/JSON Schema)
   - Key unlock for TDC as general AI methodology
   - Contains extensive design appendix from Project 04 closure

This CIP provides the **architectural context** for those backlog items and connects them to the broader data layer vision.

## What Makes It "splectrum-native"

The repository model is native to Splectrum's unique needs:

**1. Human-AI Collaboration Optimized**
- Natural language as first-class schema representation
- Immutable artifacts reduce conflict and confusion
- Multiple indexes support different thinking/query patterns
- Partnership friction metric can track information lookup costs

**2. TDC Methodology Aligned**
- Artifacts pin to requirements (artifact-to-requirements pattern)
- Immutability enables quality assessment over time
- Event sourcing provides complete audit trail
- CQRS enables multiple views without duplication

**3. P2P Network Native**
- Location-transparent references work across network topologies
- Content-addressed artifacts enable distributed verification
- CRDTs for conflict-free index synchronization
- Agent-centric: personal source chains + shared validation

**4. AI-Optimized DSL Foundation**
- Multiple query interfaces (document, graph, streaming, transactional) over same data
- Schema discovery via indexes
- Type-guided composition through schema metadata
- Pattern reuse through artifact versioning

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Query Interfaces Layer                     │
│  (Document Store | Graph Query | Streaming | Transactional) │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Index Layer (CQRS)                        │
│  • Mutable projections rebuilt from artifacts               │
│  • Multiple indexes for different access patterns           │
│  • CSV format: lightweight, version-controllable            │
│  • CHANGELOGs track evolution                               │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Artifact Stream Layer (Event Store)             │
│  • Immutable artifacts (never change)                        │
│  • Content-addressed (hash-based verification)              │
│  • Versioned (x.y.z)                                         │
│  • Pin to requirements                                       │
│  • Merkle tree for O(log n) verification                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Resolution Layer (Location-Transparent)         │
│  • URN-style references: repo:path                           │
│  • Resolvers: filesystem | GitHub | P2P | web               │
│  • Universal reference model (internal + external)          │
│  • Transparent cross-repository linking                      │
└─────────────────────────────────────────────────────────────┘
```

## Avenues Worth Pursuing

Based on research findings, these directions show promise:

**1. Agent-Centric Architecture** (Holochain-inspired)
- Personal artifact source chains per developer
- Shared indexes for discovery (DHT-style)
- Validation rules in requirements documents
- Local-first, sync when needed

**2. Merkle Tree Verification**
- Hash artifacts on creation
- Build Merkle tree over streams
- Verify index integrity without full scan
- Enable efficient P2P sync protocols

**3. Multi-Model Query Layer**
- Document store interface (read artifact by ID)
- Graph query interface (follow references between artifacts)
- Streaming interface (subscribe to artifact stream)
- Transactional interface (ACID guarantees for index updates)

**4. Schema Registry Integration**
- Confluent Schema Registry patterns for compatibility checking
- AVRO schema evolution rules
- Natural language ↔ AVRO bidirectional transformation
- Cross-domain schema discovery

**5. CRDT-Based Index Synchronization**
- Conflict-free index updates across devices
- OrbitDB-style Merkle-CRDTs for P2P
- Offline-first with eventual consistency
- HAM algorithm (Gun.js) for distributed conflict resolution

**6. Persistent Data Structure Optimizations**
- Structural sharing for efficient versioning
- Copy-on-write for immutable updates
- O(log n) access through tree structures
- Memory-efficient artifact storage

## Processing This CIP

When processed, this CIP should:

**1. Create/Update Backlog Items**
- Location-Transparent Reference System (new project)
- Multi-Model Query Interface Layer (new project)
- Merkle Tree Verification Infrastructure (new project)
- Agent-Centric Source Chain Architecture (exploration)
- Update existing: Repository Streaming Structure (incorporate architectural context)
- Update existing: Natural Language Schema Transformation (connect to schema registry patterns)

**2. Create New CIPs**
- CIP: CRDT-Based Index Synchronization (P2P specific)
- CIP: Schema Registry for SPL2 (schema management patterns)
- CIP: Persistent Data Structure Optimizations (performance focus)

**3. Conduct Further Research**
- Benchmark CRDT algorithms (ORSet, LWW-Element-Set, Merkle-CRDT)
- Evaluate schema registry implementations (Confluent vs alternatives)
- Prototype location-transparent resolver
- Test CSV index performance at scale

**4. Update Foundations**
- PRINCIPLES.md: Add splectrum-native repository model to architecture principles
- Data_architecture_vX.X.X: Create new version incorporating multi-model interface layer
- TDC_framework_vX.X.X: Connect artifact streams to Event Sourcing pattern explicitly

## References

**Chat Captures:**
- `chats/2025-11-14_location-transparent-references-and-cross-repo-linking.md` - Design discussion
- `chats/2025-11-14_state-of-art-research-phase1-multi-interface-data-systems.md` - Phase 1 research
- `chats/2025-11-14_state-of-art-research-phase2-knowledge-graphs-p2p-systems.md` - Phase 2 research

**Backlog Items:**
- `projects/backlog/repository-streaming-structure.md` - Streaming system design
- `projects/backlog/natural-language-schema-transformation.md` - NL ↔ schema transformation

**Methodology:**
- `projects/02-initial-workplan/CIP_REGISTER.md` - CIP Register and workflow

## Key Insight

splectrum-native provides the architectural foundation for presenting SPL2's totality:

> **Collaborative human-AI TDC** + **Powerful DSL engine** + **AI-optimized multi-model data repository** + **P2P network native**

The repository model is the data layer that makes all other components possible. It's not just how we store files - it's the persistence architecture that enables:
- TDC methodology (immutable artifacts, requirements traceability)
- DSL engine (schema discovery, type-guided composition)
- AI optimization (multiple query patterns, natural language schemas)
- P2P networking (location-transparent, content-addressed, distributed)

Everything else builds on this foundation.

---

**Next Steps:** Process CIP to create formal backlog items and focused sub-CIPs. Consider creating proof-of-concept for location-transparent resolver and CSV index performance testing.
