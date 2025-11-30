**Requirements:** See `projects/04-bare-runtime-hello-world/Backlog_register_requirements_v1.1.0.md`

# Project Backlog

**Last Updated:** 2025-11-30

Backlog of identified projects for SPL2 development. Projects analyzed for priority and dependencies during Project 02 (Dependency & Priority Analysis).

---

## Implementation Pipeline (Current Focus)

Phased approach to get implementation infrastructure working.

### Phase 1 - Foundation

| Backlog Item | Priority | Dependencies | Addons | Comments |
|--------------|----------|--------------|--------|----------|
| [spl/bug API](backlog/spl-bug-api.md) | High | Project 11 (App Architecture) | | Bug report as API state. Captures failure context for reconstruction. Bug reports from event streams. |

### Phase 2 - Complete Pipeline

| Backlog Item | Priority | Dependencies | Comments |
|--------------|----------|--------------|----------|
| [Dev Environment API](backlog/dev-environment-api.md) | High | spl/pipeline, spl/bug | Complete the 6 remaining methods from Project 08 foundation. |
| [spl/pipeline v2](backlog/spl-pipeline-v2.md) | High | Phase 1 complete | Strengthen based on Phase 1 learnings. |
| [spl/bug v2](backlog/spl-bug-v2.md) | High | Phase 1 complete | Upgrade based on learnings + ITIL vocabulary alignment. |
| [API Design Documentation](backlog/api-design-documentation.md) | High | Phase 1 complete | Split API_DESIGN.md, integrate Project 09 design notes. CIP-014. |
| [ITIL Introduction](backlog/itil-introduction.md) | High | Phase 1 complete | ITIL concepts wrapped in SPL2/DSL vocabulary. Service design foundation. |

---

## Other Backlog Items

| Backlog Item | Priority | Dependencies | Addons | Comments |
|--------------|----------|--------------|--------|----------|
| [CIP Processing](backlog/cip-processing.md) | High | None | | Standard maintenance project - process 15 accumulated CIPs. Create backlog items, update foundations, spawn CIPs, close processed ones. Repeatable project triggered by CIP debt. |
| [AVRO Wrapper API](backlog/avro-wrapper-api.md) | High | Console API Exploration | | SPL2 wrapper for AVRO schema operations. Schema loading/caching, validation helpers, Bare compatibility. Foundation for all APIs - every API uses AVRO schemas. |
| [Bare Runtime Compatibility](backlog/bare-runtime-compatibility.md) | High | Bare Runtime Hello World | Phase 2 Dev Setup | Deep dive: Node.js → Bare workflow, tooling compatibility (Vite, Vitest), SPL2 patterns on Bare. Prerequisite for Pear platform work. |
| [Browser Platform Exploration](backlog/browser-platform-exploration.md) | High | Bare Runtime Compatibility | | Validate browser as third pillar platform for SPL2 runtime. File system abstraction (IndexedDB/OPFS), browser lifecycle, basic P2P validation (WebRTC/WebTransport). Completes three-pillar portability (Node/Bare/Browser). |
| [Kafka Compatible Records](backlog/kafka-compatible-records.md) | High | Runtime Structure Hello World | | Record format, storage (file-based), immutability, metadata capture. Foundation for state management. |
| [AVRO Schema and RPC](backlog/avro-schema-and-rpc.md) | High | Runtime Structure Hello World | | AVRO schemas for records and APIs, type checking, composition validation, RPC for client-server communication. |
| [API State Management](backlog/api-state-management.md) | High | Runtime Structure Hello World<br>Kafka Compatible Records | | State backing mechanism, execution state stack, state transitions, stateless code with state backing. |
| [DSL Engine Foundation](backlog/dsl-engine-foundation.md) | High | Runtime Structure Hello World<br>Kafka Compatible Records<br>AVRO Schema and RPC<br>API State Management | | Core DSL engine: discoverability, type-guided composition, pattern reuse, API library. AI as primary user. Unlocks custom languages. |
| [Pear P2P Platform](backlog/pear-p2p-platform.md) | High | Bare Runtime Compatibility | Phase 4 Dev Setup | P2P networking, device discovery, state synchronization, multi-device execution. Unlocks P2P use cases. |
| [Repository Streaming Structure](backlog/repository-streaming-structure.md) | High | | Natural Language Schema Transformation | Design repository as streaming system: tables (immutable/insert-only artifacts) with indexes (compact mutable lookups). Kafka-compatible changelog streams. Foundation-level impact on information lookup friction. |
| [Natural Language Schema Transformation](backlog/natural-language-schema-transformation.md) | High | | | Bidirectional transformation: natural language requirements ↔ rigid schemas (AVRO/JSON Schema). Enables automated validation, compatibility checking, cross-domain methodology. Key unlock for TDC as general AI methodology. Addon to Repository Streaming Structure. |
| [Reference Library Spot](backlog/reference-library-spot.md) | Medium | | | Explore and design spot for curated external technology documentation. Capture validated patterns, fill gaps in upstream docs, preserve original contributions (like dual-platform patterns). Reduce friction vs repeated web research. |
| [Development Environment Setup](backlog/dev-environment-setup.md) | Low | | Phase 1 (Node.js)<br>Phase 2 (Bare)<br>Phase 3 (UI)<br>Phase 4 (Pear) | Reference document. Products distributed to projects: Phase 1 in Runtime Hello World, Phase 2 in Bare Compatibility, Phase 3 in first UI project, Phase 4 in Pear exploration. |

---

## Notes

- Individual project details in `backlog/[project-name].md`
- Backlog evolves - new projects added as discovered
- Priority and dependencies reassessed as learning occurs
