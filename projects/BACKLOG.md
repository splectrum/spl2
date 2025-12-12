**Requirements:** See `projects/04-bare-runtime-hello-world/Backlog_register_requirements_v1.1.0.md`

# Project Backlog

**Last Updated:** 2025-12-12

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
| [spl/pipeline v2](backlog/spl-pipeline-v2.md) | High | spl/bug API | Strengthen based on Phase 1 learnings. |
| [API Design Documentation](backlog/api-design-documentation.md) | High | spl/bug API | Split API_DESIGN.md, integrate Project 09 design notes. CIP-014. |
| [ITIL Introduction](backlog/itil-introduction.md) | High | spl/bug API | ITIL concepts wrapped in SPL2/DSL vocabulary. Service design foundation. |

---

## Other Backlog Items

| Backlog Item | Priority | Dependencies | Addons | Comments |
|--------------|----------|--------------|--------|----------|
| [Spot Apps / Data Resources](backlog/spot-apps-data-resources.md) | High | Project 11 | | Apps that manage data areas. Data resources vs functional resources. CRUD on typed items (projects, glossary terms). `../` prefix distinguishes functional calls. |
| App Architecture | High | Project 11 | | Original Project 11 scope. App as stateful component, app-session handover, namespaced headers, execute=load+handle pattern. Design docs in projects/11-app-architecture/notes/. |
| PAC Handler Design | Medium | App Architecture | | Prompt And Confirm at handler level. Methods implement --dry-run/--silent, handler orchestrates --pac. Pluggable handlers (CLI, browser, AI agent). Design doc: pac_handler_design_2025-12-07.md. |
| [Session/Context Tools](backlog/session-context-tools.md) | Medium | Wrapper APIs | | Context recovery with snippet extraction (RAG/vibe engineering). Builds on wrapper API audit trails for rich context. |
| Scripting Layer | Low | App Architecture | | Client-agnostic scripting syntax. Context management (set/with), multi-command, fluent layer over formal syntax. Design docs: cli_namespacing_and_context, natural_language_bridge. |
| [Bare Runtime Compatibility](backlog/bare-runtime-compatibility.md) | High | | | Deep dive: Node.js → Bare workflow, tooling compatibility (Vite, Vitest), SPL2 patterns on Bare. Prerequisite for Pear platform work. |
| [Browser Platform Exploration](backlog/browser-platform-exploration.md) | High | Bare Runtime Compatibility | | Validate browser as third pillar platform for SPL2 runtime. File system abstraction (IndexedDB/OPFS), browser lifecycle, basic P2P validation (WebRTC/WebTransport). Completes three-pillar portability (Node/Bare/Browser). |
| [Pear P2P Platform](backlog/pear-p2p-platform.md) | High | Bare Runtime Compatibility | | P2P networking, device discovery, state synchronization, multi-device execution. Unlocks P2P use cases. |
| [Repository Streaming Structure](backlog/repository-streaming-structure.md) | High | | Natural Language Schema Transformation | Design repository as streaming system: tables (immutable/insert-only artifacts) with indexes (compact mutable lookups). Kafka-compatible changelog streams. Foundation-level impact on information lookup friction. |
| [Natural Language Schema Transformation](backlog/natural-language-schema-transformation.md) | High | | | Bidirectional transformation: natural language requirements ↔ rigid schemas (AVRO/JSON Schema). Enables automated validation, compatibility checking, cross-domain methodology. Key unlock for TDC as general AI methodology. Addon to Repository Streaming Structure. |
| [Reference Library Spot](backlog/reference-library-spot.md) | Medium | | | Explore and design spot for curated external technology documentation. Capture validated patterns, fill gaps in upstream docs, preserve original contributions (like dual-platform patterns). Reduce friction vs repeated web research. |

---

## Notes

- Individual project details in `backlog/[project-name].md`
- Backlog evolves - new projects added as discovered
- Priority and dependencies reassessed as learning occurs
