# DSL Glossary

**Requirements:** chats/immutables/glossary_requirements_v1.0.0.md
**Status:** Active - manually maintained
**Context:** SPL2 Domain-Specific Language (runtime, APIs, methods, properties)

This glossary defines the consistent vocabulary for SPL2 development. Each term has one meaning throughout SPL2.

---

## Vocabulary (Alphabetical)

| Term | Description | Req |
|------|-------------|-----|
| api | **api_node** - Api node within a package; groups related methods under a common namespace | api_v1.0.0.md |
| api_node | **Structure** - Folder in SPL2 API hierarchy; can be package, api, or method; underscore prefix for internal folders and auxiliary files | api_node_v1.0.0.md |
| execution | **api** - Request execution management API; handles pipeline execution within runtime context | execution_v1.0.0.md |
| greet | **method** - Method name for outputting greetings; common behavior pattern | greet_v1.0.0.md |
| headers | **Property** (Object, hierarchical) - Metadata component of Kafka-compatible record; hierarchical nested object | headers_v1.0.0.md |
| hello | **method** - Method name for announcing presence; common behavior pattern | hello_v1.0.0.md |
| invoke | **method** - Method name for invoking a single method with execution context; atomic invocation | invoke_v1.0.0.md |
| key | **Property** (String) - Primary key component of Kafka-compatible record; implements primary_key | key_v1.0.0.md |
| major | **Version component** - First component of semver; increment for breaking changes | major_v1.0.0.md |
| method | **api_node** - Invokable api node; leaf of API hierarchy; contains index.js | method_v1.0.0.md |
| minor | **Version component** - Second component of semver; increment for new backward-compatible features | minor_v1.0.0.md |
| node_version | **Property** (String) - Node.js version of execution environment | node_version_v1.0.0.md |
| package | **api_node** - Top-level api node; root of an API tree | package_v1.0.0.md |
| patch | **Version component** - Third component of semver; increment for backward-compatible bug fixes | patch_v1.0.0.md |
| primary_key | **Concept** - Record identity in Kafka/streaming; determines partitioning, consumer groups, record set shaping | primary_key_v1.0.0.md |
| prXX | **package** - Reserved naming pattern for internal test packages; not for external deployment | prXX_v1.0.0.md |
| run | **method** - Method name for executing/starting a process; entry point | run_v1.0.0.md |
| runtime | **api** - API for runtime context management; the context within which execution contexts run | runtime_v1.0.0.md |
| runtime_id | **Property** (String, UUID) - Unique identifier for runtime execution instance | runtime_id_v1.0.0.md |
| spl | **package** - Core Splectrum package; contains runtime infrastructure APIs | spl_v1.0.0.md |
| start_time | **Property** (String, ISO 8601) - Timestamp when something began; general initiation time marker | start_time_v1.0.0.md |
| value | **Property** (Object) - Contents component of key-value pair; used with designated key property | value_v1.0.0.md |
| version | **Property** (String, semver) - Version identifier using semantic versioning; platform-wide scheme | version_v1.0.0.md |

---

## Notes

- **Glossary scope:** Global across all SPL2 development
- **One term, one meaning:** Same concept always uses same term
- **Description format:** Type in bold, followed by description; schema in parentheses where applicable
- **Req column:** Points to versioned req file in projects/06-glossary-term-requirements/reqs/
- **Naming convention:** Single underscore for word boundary (`api_node`), double underscore for hierarchy (`spl__runtime__run`)
- **Maintenance:** Update glossary when introducing new vocabulary; add before or during implementation

---

**Externalized from:** projects/03-runtime-hello-world/GLOSSARY.md
**Date:** 2025-11-13
