# Project 12: Project Plan

**Created:** 2025-12-12

---

## Product 1: spl/avro API

AVRO schema operations - enabling infrastructure for building other wrapper APIs. Platform-agnostic (Node/Bare).

### Stages

| Stage | Description | Outcome |
|-------|-------------|---------|
| 1. Bare test | Validate Bare runtime baseline works | Bare environment confirmed working |
| 2. avsc analysis | Assess avsc library compatibility with Bare | Compatibility report, known limitations |
| 3. API design | Design spl/avro methods based on findings | API specification, method signatures |
| 4. Implementation | Build the API | Working spl/avro API |

### Methods (Proposed)

- spl/avro/load - Load schema from file, return cached type
- spl/avro/validate - Validate data against schema
- spl/avro/clone - Clone/coerce data with schema
- spl/avro/registry - List available schemas
- spl/avro/types - Generate TypeScript types

### Quality Criteria

*To be defined*

---

## Product 2: spl/git API

Git operations wrapper. High-signal operations for audit trails and context recovery.

### Stages

| Stage | Description | Outcome |
|-------|-------------|---------|
| 1. Design | Design spl/git methods, record structure | API specification |
| 2. Implementation | Build the API | Working spl/git API |

### Methods (Proposed)

- spl/git/status - Working tree status
- spl/git/diff - Show changes
- spl/git/commit - Create commit
- spl/git/log - Commit history
- spl/git/branch - Branch operations

### Quality Criteria

*To be defined*

---

## Product 3: spl/container/select

XPath-style query language over splectrum structure. Nodes map to folders, attributes map to files with JSON content traversal.

### Stages

| Stage | Description | Outcome |
|-------|-------------|---------|
| 1. Research | Assess available xpath/jsonpath libraries, Bare compatibility | Research report, build vs extend decision |
| 2. Vision | Design the vision for container selection | Vision document |
| 3. Syntax roadmap | Design xpath-style syntax, define axes and predicates | Syntax specification |
| 4. MVP implementation | Implement minimum viable select | Working spl/container/select |

### Concept

- Navigate folders as nodes: `/spl/dev/deploy`
- Query file attributes: `[@index.json]`
- Traverse JSON content: `[@index.json/identity/type = 'method']`

### Examples (Proposed)

- `/spl/dev/*` - all children of spl/dev
- `//*[@index.json/identity/extends = 'spl/api']` - all APIs
- `//*[@_reqs]` - all containers with requirements

### Quality Criteria

*To be defined*

---

## Product 4: Additional Wrapper APIs

Research and work planning for additional wrapper APIs, with potential implementation.

### Stages

| Stage | Description | Outcome |
|-------|-------------|---------|
| 1. Research | Assess candidates, Bare compatibility, value/effort | Research report |
| 2. Work planning | Prioritize, define scope, add to backlog or implement | Prioritized list |
| 3. Implementation | Implement selected APIs (if capacity) | Working APIs |

### Candidates

**High value:**
- spl/http - web requests, API calls, fetching docs
- spl/archive - 7zip/tar/zip for packaging, distribution, backup

**Medium value:**
- spl/template - mustache/handlebars for code generation
- spl/diff - general file diffing beyond git
- spl/crypto - hashing, checksums for integrity

**Lower priority:**
- spl/markdown - parsing/manipulation
- spl/yaml - transformation

### Quality Criteria

*To be defined*

---

## Notes

- Platform-agnostic approach: validate Bare compatibility early
- Products sequence may evolve based on learnings
