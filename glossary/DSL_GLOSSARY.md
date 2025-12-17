# DSL Glossary

**Requirements:** chats/immutables/glossary_requirements_v1.0.0.md
**Status:** Active - manually maintained
**Context:** Splectrum Domain-Specific Language (runtime, APIs, methods, properties)

This glossary defines the consistent vocabulary for Splectrum development. Each term has one meaning throughout Splectrum.

---

## Vocabulary (Alphabetical)

| Term | Description | Req |
|------|-------------|-----|
| api | **branch** - Module node within a package; groups related methods under a common namespace; has state | projects/06-glossary-term-requirements/reqs/api_v1.0.0.md |
| api_overview | **Structure** - Overview document for an API. Inventory and top-level interface - what the API is, what it consists of, method signatures | projects/08-dev-environment-api/api_overview_req_v1.0.0.md |
| branch | **module_node** - Non-leaf node with batch capability; can contain child nodes; base for module_root, package, api | projects/09-console-v5-stream-native/branch_v1.0.0.md |
| create | **method** - Method name for creation operations; bring something into existence that did not exist before | projects/08-dev-environment-api/create_v1.0.0.md |
| cycle | **method** - Method name for iterative execution; run one iteration of a repeating process with return-and-resume pattern | projects/08-dev-environment-api/cycle_v1.0.0.md |
| destroy | **method** - Method name for destruction operations; tear down and remove, freeing resources | projects/08-dev-environment-api/destroy_v1.0.0.md |
| execution | **api** - Request execution management API; handles pipeline execution within runtime context | projects/06-glossary-term-requirements/reqs/execution_v1.0.0.md |
| extract | **method** - Method name for extraction operations; remove and retrieve something from a container or system | projects/08-dev-environment-api/extract_v1.0.0.md |
| greet | **method** - Method name for outputting greetings; common behavior pattern | projects/06-glossary-term-requirements/reqs/greet_v1.0.0.md |
| headers | **Property** (Object, hierarchical) - Metadata component of Kafka-compatible record; hierarchical nested object | projects/06-glossary-term-requirements/reqs/headers_v1.0.0.md |
| hello | **method** - Method name for announcing presence; common behavior pattern | projects/06-glossary-term-requirements/reqs/hello_v1.0.0.md |
| install | **method** - Method name for installation operations; add components to existing structure | projects/08-dev-environment-api/install_v1.0.0.md |
| invoke | **method** - Method name for invoking a single method with execution context; atomic invocation | projects/06-glossary-term-requirements/reqs/invoke_v1.0.0.md |
| key | **Property** (String) - Primary key component of Kafka-compatible record; implements primary_key | projects/06-glossary-term-requirements/reqs/key_v1.0.0.md |
| clear | **verb** - App-internal command to remove a specific context value; inverse of set | projects/11-app-architecture/reqs/clear_v1.0.0.md |
| major | **Version component** - First component of semver; increment for breaking changes | projects/06-glossary-term-requirements/reqs/major_v1.0.0.md |
| method | **module_node** - Invokable leaf node; contains implementation in index.js | projects/06-glossary-term-requirements/reqs/method_v1.0.0.md |
| module_node | **Structure** - Base structural type for SPL2 hierarchy; all nodes derive from module_node; has index.js with standard async signature | projects/09-console-v5-stream-native/module_node_v1.1.0.md |
| module_root | **branch** - Root node of a module bundle; entry point for module-level operations | projects/09-console-v5-stream-native/module_root_v1.0.0.md |
| minor | **Version component** - Second component of semver; increment for new backward-compatible features | projects/06-glossary-term-requirements/reqs/minor_v1.0.0.md |
| nopac | **flag** - Invocation flag to skip confirmation prompt; opposite of pac; enables scripting mode | projects/11-app-architecture/reqs/nopac_v1.0.0.md |
| node_version | **Property** (String) - Node.js version of execution environment | projects/06-glossary-term-requirements/reqs/node_version_v1.0.0.md |
| pac | **flag** - Invocation flag to force confirmation prompt (Prompt And Confirm); enables functional help | projects/11-app-architecture/reqs/pac_v1.0.0.md |
| package | **branch** - Top-level module node; root of an API tree | projects/06-glossary-term-requirements/reqs/package_v1.0.0.md |
| patch | **Version component** - Third component of semver; increment for backward-compatible bug fixes | projects/06-glossary-term-requirements/reqs/patch_v1.0.0.md |
| primary_key | **Concept** - Record identity in Kafka/streaming; determines partitioning, consumer groups, record set shaping | projects/06-glossary-term-requirements/reqs/primary_key_v1.0.0.md |
| prXX | **package** - Reserved naming pattern for internal test packages; not for external deployment | projects/06-glossary-term-requirements/reqs/prXX_v1.0.0.md |
| reset | **verb** - App-internal command to reset all context to defaults; bulk clear operation | projects/11-app-architecture/reqs/reset_v1.0.0.md |
| run | **method** - Method name for executing/starting a process; entry point | projects/06-glossary-term-requirements/reqs/run_v1.0.0.md |
| runtime | **api** - API for runtime context management; the context within which execution contexts run | projects/06-glossary-term-requirements/reqs/runtime_v1.0.0.md |
| runtime_id | **Property** (String, UUID) - Unique identifier for runtime execution instance | projects/06-glossary-term-requirements/reqs/runtime_id_v1.0.0.md |
| set | **verb** - App-internal command to set a context value; establishes named context for subsequent operations | projects/11-app-architecture/reqs/set_v1.0.0.md |
| silent | **flag** - Invocation flag to suppress explanation output; opposite of verbose; minimal output mode | projects/11-app-architecture/reqs/silent_v1.0.0.md |
| spl | **package** - Core Splectrum package; contains runtime infrastructure APIs | projects/06-glossary-term-requirements/reqs/spl_v1.0.0.md |
| spl__dev | **api** - Dev Environment API for autonomous development with test-driven implementation; manages ephemeral dev environments and work package execution | projects/08-dev-environment-api/spl_dev_api_v1.0.0.md |
| start_time | **Property** (String, ISO 8601) - Timestamp when something began; general initiation time marker | projects/06-glossary-term-requirements/reqs/start_time_v1.0.0.md |
| status | **method** - Method name for status query operations; report current state without modification (read-only) | projects/08-dev-environment-api/status_v1.0.0.md |
| submit | **method** - Method name for submission operations; provide work or input for processing | projects/08-dev-environment-api/submit_v1.0.0.md |
| value | **Property** (Object) - Contents component of key-value pair; used with designated key property | projects/06-glossary-term-requirements/reqs/value_v1.0.0.md |
| verb | **Structure** - App-internal command; single-word operation that cannot clash with package names (packages are nouns) | projects/11-app-architecture/reqs/verb_v1.0.0.md |
| verbose | **flag** - Invocation flag to enable full explanation output; opposite of silent; learning mode | projects/11-app-architecture/reqs/verbose_v1.0.0.md |
| version | **Property** (String, semver) - Version identifier using semantic versioning; platform-wide scheme | projects/06-glossary-term-requirements/reqs/version_v1.0.0.md |

---

## Notes

- **Glossary scope:** Global across all SPL2 development
- **One term, one meaning:** Same concept always uses same term
- **Description format:** Type in bold, followed by description; schema in parentheses where applicable
- **Req column:** All refs are relative to repo root
- **Naming convention:** Single underscore for word boundary (`module_node`), double underscore for hierarchy (`spl__runtime__run`)
- **Maintenance:** Update glossary when introducing new vocabulary; add before or during implementation

---

**Externalized from:** projects/03-runtime-hello-world/GLOSSARY.md
**Date:** 2025-11-13
