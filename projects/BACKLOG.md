**Requirements:** See `projects/02-initial-workplan/Backlog_register_requirements_v1.0.0.md`

# Project Backlog

**Last Updated:** 2025-11-13

Backlog of identified projects for SPL2 development. Projects analyzed for priority and dependencies during Project 02 (Dependency & Priority Analysis).

---

## Backlog Items

| Backlog Item | Priority | Dependencies | Addons | Comments |
|--------------|----------|--------------|--------|----------|
| [Foundation Update & Documentation Templates](backlog/foundation-update-documentation-templates.md) | Highest (Critical) | Runtime Structure Hello World | N/A | Restructure foundations (catch phrase format), create glossaries (methodology + API vocabulary), enhance technical docs, establish documentation templates. Captures Project 03 learning while fresh. High leverage - affects all future projects. 1 week. |
| [Runtime Structure "Hello World"](backlog/runtime-hello-world.md) | Critical | None | Phase 1 Dev Setup (Node.js) | **COMPLETED (Project 03)** - Validated core architecture on Node.js: invocation → context → pipeline → execution. Integrates runtime, pipelining, state-backed APIs. Unlocks everything. 1-2 weeks. |
| [Bare Runtime Hello World](backlog/bare-runtime-hello-world.md) | Critical | Runtime Structure Hello World | [Import Resolution Experiment](backlog/addons/import-resolution-experiment.md) | **PROJECT 04 - Initiated** - Validate runtime structure works on Bare platform: install, setup, run runtime hello world on Bare. Proves target platform viability. 3-5 days. |
| [Bare Runtime Compatibility](backlog/bare-runtime-compatibility.md) | High (possibly Critical) | Bare Runtime Hello World | Phase 2 Dev Setup (Bare) | Deep dive: Node.js → Bare workflow, tooling compatibility (Vite, Vitest), SPL2 patterns on Bare. Prerequisite for Pear. 1-2 weeks. |
| [Bug Report Infrastructure](backlog/bug-report-infrastructure.md) | High (Foundational) | Runtime Structure Hello World | N/A | Automated bug report generation with complete execution footprint for reconstruction. Captures: code versions, input, state, environment, error details. Enables exact failure reproduction. Critical for reconstruction-based architecture. 1-2 weeks. |
| [Kafka Compatible Records](backlog/kafka-compatible-records.md) | High | Runtime Structure Hello World | N/A | Record format, storage (file-based), immutability, metadata capture. Foundation for state management. 1-2 weeks. |
| [AVRO Schema and RPC](backlog/avro-schema-and-rpc.md) | High | Runtime Structure Hello World | N/A | AVRO schemas for records and APIs, type checking, composition validation, RPC for client-server. 1-2 weeks. |
| [API State Management](backlog/api-state-management.md) | High | Runtime Structure Hello World, Kafka Compatible Records | N/A | State backing mechanism, execution state stack, state transitions, stateless code with state backing. 1-2 weeks. |
| [DSL Engine Foundation](backlog/dsl-engine-foundation.md) | High | Runtime Structure Hello World, Kafka Compatible Records, AVRO Schema and RPC, API State Management | N/A | Core DSL engine: discoverability, type-guided composition, pattern reuse, API library. AI as primary user. Unlocks custom languages. 3-4 weeks. |
| [Pear P2P Platform](backlog/pear-p2p-platform.md) | High | Bare Runtime Compatibility | Phase 4 Dev Setup (Pear) | P2P networking, device discovery, state synchronization, multi-device execution. Unlocks P2P use cases. 2-3 weeks. |
| [Glossary Term Requirements](backlog/glossary-term-requirements.md) | Medium | Glossaries exist (DSL, Stepping Stones, Spots) | N/A | Define requirements for glossary terms themselves, enabling artifact-to-requirements pinning for glossary entries. Create requirements for all existing terms. Foundation for glossary quality assessment and management tooling. 1-2 weeks. |
| [Development Environment Setup](backlog/dev-environment-setup.md) | N/A (Progressive) | Progressive pathway | Phase 1 (Node.js), Phase 2 (Bare), Phase 3 (UI), Phase 4 (Pear) | Reference document. Products distributed to projects: Phase 1 in Runtime Hello World, Phase 2 in Bare Compatibility, Phase 3 in first UI project, Phase 4 in Pear exploration. |

---

## Notes

- Individual project details in `backlog/[project-name].md`
- Backlog evolves - new projects added as discovered
- Priority and dependencies reassessed as learning occurs
