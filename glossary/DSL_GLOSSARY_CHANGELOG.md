# DSL Glossary Changelog

This file tracks changes to DSL_GLOSSARY.md using diff format.

---

## 2025-11-18 - Project 06: Term requirements and structure overhaul

Major restructuring as part of Glossary Term Requirements project.

**Structure changes:**
- Converted from 5-column table to 3-column: Term | Description | Req
- Type/schema shown in bold within description
- All terms now have associated requirement files

**Term changes:**
- Removed: _, _context, _runtime (replaced by api_node concept with underscore prefix pattern)
- Added: api_node (base concept), package, api, method (hierarchy), primary_key, major, minor, patch
- Renamed: nodeVersion→node_version, runtimeId→runtime_id, startTime→start_time

**Naming convention established:**
- Single underscore for word boundary: `api_node`
- Double underscore for hierarchy: `spl__runtime__run`

**Req files created (24):**
api_node, package, api, method, execution, runtime, spl, greet, hello, invoke, run, headers, key, value, primary_key, node_version, runtime_id, start_time, version, major, minor, patch, prXX

---

## 2025-11-13 - Initial creation

Glossary created with 17 terms defining SPL2 runtime/API vocabulary (packages, APIs, methods, properties, Kafka records). Externalized from projects/03-runtime-hello-world/GLOSSARY.md.

Initial content includes: _, _context, _runtime, execution, greet, headers, hello, invoke, key, nodeVersion, prXX, run, runtime, runtimeId, spl, startTime, value, version.
