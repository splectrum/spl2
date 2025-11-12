# DSL Glossary

**Requirements:** chats/immutables/glossary_requirements_v1.0.0.md
**Status:** Active - manually maintained
**Context:** SPL2 Domain-Specific Language (runtime, APIs, methods, properties)

This glossary defines the consistent vocabulary for SPL2 development. Each term has one meaning throughout SPL2.

---

## Vocabulary (Alphabetical)

| Term | Type | Schema | Description | Requirement |
|------|------|--------|-------------|-------------|
| _ | Naming convention (prefix) | N/A | Underscore prefix pattern for auxiliary library modules; indicates non-invokable utility code at any level (package/API/method) | Modules with underscore prefix must be auxiliary libraries (not methods invokable via execution); must follow standard structure ({name}/index.js); must export utility functions/objects rather than single method signature; can exist at package level (spl/_context), API level (spl/runtime/_runtime), or method level as needed |
| _context | Auxiliary library name | N/A | Package-level auxiliary library within spl package providing generic context accessor utilities for hierarchical Kafka records and flat arguments | Must provide createRecordAccessor (read/write with get/set/getMetadata/setData/getData/setMetadata), createReadOnlyRecordAccessor (read-only variant), and createArgsAccessor (flat args accessor); enables uniform interface for state manipulation across all SPL2 code; fundamental utility used by all packages and APIs |
| _runtime | Auxiliary library name | N/A | API-level auxiliary library within spl/runtime providing runtime-specific utilities including module resolution | Must provide resolveModule (convention-based module loading), invokeMethod (resolve and invoke in one call), and getModuleMetadata (introspection); enables dynamic method loading and execution; used for bootstrapping and runtime method invocation |
| execution | API name | N/A | Execution context management API within spl package; manages method invocation and context orchestration | Must create execution context records, invoke methods with appropriate parameters and context, and manage state transfer between method invocations |
| greet | Method name | N/A | Output hello world greeting (pr03/hello/greet); test method demonstrating basic execution flow | Must generate and output "Hello World" message, demonstrating method execution and state manipulation |
| headers | Property name (Kafka record field) | Object (hierarchical) | Metadata component of Kafka-compatible record structure; hierarchical nested object storing operational metadata, configuration, and input/output properties | Must use hierarchical object structure with nested namespacing (e.g., `{spl: {runtime: {version: "0.1.0"}}}`); accessed via dot notation navigation; stores metadata separate from data payload; AVRO compatible with nested schemas |
| hello | API name | N/A | Hello world demonstration API within pr03 package for testing basic execution flow | Must demonstrate minimal working API implementation with state manipulation and output generation; proves execution model works end-to-end |
| invoke | Method name | N/A | Invoke a single method with execution context (spl/execution/invoke); core method invocation mechanism | Must accept method reference and arguments, execute target method with appropriate context and state, handle method output for potential chaining |
| key | Property name (Kafka record field) | String | Primary key component of Kafka-compatible record structure; uniquely identifies the record | Must uniquely identify the record within its scope; for API state records, identifies specific API invocation or data entity; for runtime/execution contexts, identifies the session/context instance |
| nodeVersion | Property name | String (version format) | Node.js version of execution environment; captured for reproducibility and environment validation | Must capture actual Node.js version (e.g., "v20.10.0"); stored in runtime context headers as `spl.runtime.nodeVersion`; used for bug reproduction and compatibility checking |
| prXX | Package name pattern | N/A | Project package naming pattern (pr01, pr02, pr03, etc.) - package associated with project XX for product delivery evaluation; internal use only, not for external deployment | Must contain evaluation/test artifacts for the associated project; used to validate concepts and patterns; provides traceability to originating project; not deployed externally |
| run | Method name | N/A | Initialize and run runtime context (spl/runtime/run); entry point for SPL2 execution | Must create runtime Kafka record structure (key/headers/value), initialize runtime properties (version, nodeVersion, runtimeId, startTime) in headers, create execution context in value, and initiate method execution |
| runtime | API name | N/A | Runtime context management API within spl package; manages session-level execution state and configuration | Must initialize runtime context record, manage runtime properties in headers (version, nodeVersion, runtimeId, startTime), provide entry point for execution, and contain execution context records in value property |
| runtimeId | Property name | String (UUID) | Unique identifier for runtime execution instance; used for request tracking and debugging | Must be globally unique (UUID format); stored in runtime context headers as `spl.runtime.runtimeId`; enables correlation of logs, errors, and state across execution lifecycle |
| spl | Package name | N/A | Core Splectrum package containing runtime infrastructure APIs for execution management and orchestration | Must provide foundational infrastructure for SPL2 execution model including runtime context API, execution context API, and method invocation mechanisms; contains production-ready infrastructure APIs |
| startTime | Property name | String (ISO 8601) | Timestamp when runtime execution began; used for debugging and performance analysis | Must be ISO 8601 format timestamp (e.g., "2025-11-11T10:30:00.000Z"); stored in runtime context headers as `spl.runtime.startTime`; enables execution timeline analysis |
| value | Property name (Kafka record field) | Object (varies by context) | Data payload component of Kafka-compatible record structure; stores actual state data | Must store state data separate from metadata (headers); for runtime context, contains execution context records (numbered "1", "2", etc.); for execution context, contains API state records (namespaced); for API state, contains application data |
| version | Property name | String (semver: x.y.z) | Runtime version identifier for SPL2 execution environment; used for code footprint identification and compatibility checking | Must follow semantic versioning format (x.y.z); stored in runtime context headers as `spl.runtime.version`; identifies exact runtime code version for reproducibility and bug investigation |

---

## Notes

- **Glossary scope:** Global across all SPL2 development
- **One term, one meaning:** Same concept always uses same term with same schema
- **Schema column:** Shows value types and structure; N/A for naming conventions and identifiers
- **Maintenance:** Update glossary when introducing new vocabulary; add before or during implementation
- **Tooling commitment:** Manual maintenance for Project 03 with push for early tooling development
- **High-priority CIP:** Glossary management tooling (validation, enforcement, schema integration, requirement generation)

---

**Externalized from:** projects/03-runtime-hello-world/GLOSSARY.md
**Date:** 2025-11-13
