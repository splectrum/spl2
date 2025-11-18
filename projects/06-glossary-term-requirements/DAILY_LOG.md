# Daily Log - Project 06: Glossary Term Requirements

Chronological record of decisions, issues, and learnings throughout project.

---

## 2025-11-18

### Product 1: Template Development

**Key decisions:**
- Template structure: Type reference (first line) → Spec → Self-eval → Comments (optional)
- Abbreviations as primary terms (reqs, spec, self-eval) with redirect entries for full forms
- All terms lowercase
- Versioned filenames: `term_v1.0.0.md`
- "plain req" as the req type (natural language spec + self-eval)

**Req files created:**
- `plain_req_v1.0.0.md` - self-referential bootstrap defining the req type
- `reqs_v1.0.0.md` - what reqs are (spec + self-eval = req)
- `spec_v1.0.0.md` - the WHAT component
- `self_eval_v1.0.0.md` - the TEST component
- `versioned_immutable_v1.0.0.md` - artifact pattern with version naming
- `stepping_stones_glossary_v1.0.0.md` - glossary entry structure

**Glossary updates:**
- Added to STEPPING_STONES_GLOSSARY.md: reqs, requirements (redirect), self-eval, self-evaluation (redirect), spec, specification (redirect), plain req, glossary, stepping stones glossary, versioned, versioned immutable

**Discovery:**
- Building reqs for reqs is inherently self-referential (chicken and egg pattern)
- Comments field needed for examples/detail that would bloat spec

**Product 1 complete.** Ready for Product 2: DSL Glossary Terms.

---

### Product 2: DSL Glossary Terms

**Key decisions:**
- Single underscore for word boundary (`api_node`), double underscore for hierarchy (`spl__runtime__run`)
- Removed `_`, `_context`, `_runtime` - underscore pattern now part of api_node req
- hello and greet are common behavior method names (not just test artifacts)
- value = contents of key-value pair (general), not just Kafka payload
- Platform-wide semver with major/minor/patch defined
- primary_key as fundamental Kafka/streaming concept

**Req files created (24):**
- Hierarchy: api_node, package, api, method
- APIs: execution, runtime, spl
- Methods: greet, hello, invoke, run
- Record structure: headers, key, value, primary_key
- Properties: node_version, runtime_id, start_time, version
- Version components: major, minor, patch
- Reserved: prXX

**DSL_GLOSSARY.md updated:**
- New terms with Current Reqs column
- Renamed: nodeVersion→node_version, runtimeId→runtime_id, startTime→start_time
- Updated Notes with naming convention

**Discovery:**
- Should update glossary as we go, not batch at end
- Extends pattern works well for hierarchy (package/api/method extend api_node)

**Product 2 complete.** Ready for Product 3: Stepping Stones Terms.

---

### Product 3: Stepping Stones Terms

**Key decisions:**
- Unified glossary structure: Term | Description | Req (three columns)
- Description format: type/extends in bold, then description
- Lowercase with spaces for terms (distinct from DSL underscores)
- Removed: duality pattern (meta-comment), headline/detail separation (foundation req), sufficient and complete (covered by more than complete)
- Added: activity (base), preamble, preamble ref, ref, register, index, versioned (global scheme)
- Renamed: artifact-to-requirements pinning → preamble ref

**Req files created (35+):**
- Activity types: activity, adhoc_activity, planned_activity, unplanned_activity
- Artifacts: preamble, preamble_ref, versioned, versioned_immutable
- Completeness: minimal_and_complete, more_than_complete
- Methodology: twin_pair_methodology, chicken_and_egg, collaboration, pragmatism, single_concern
- Projects: project, blank_project, exploration_project
- Platform: splectrum, mycelium, panta_rhei, haicc
- Health: friction, maturity, autonomy, local_rules_apply
- Structure: register, index, backlog_register, glossary, stepping_stones_glossary
- Commits: commit_message
- Other: fire_and_forget, ref

**Glossary restructured:**
- Both DSL and Stepping Stones now use Term | Description | Req
- DSL: type/schema in bold within description
- Stepping Stones: extends/type in bold within description

**Discovery:**
- Three completeness patterns: minimal and complete (unknown), more than complete (hard to extract), and the unnamed third for preservation
- Activity as base with microservice ownership pattern
- Project replaces sprint - delivers products with maintenance cycle

**Product 3 complete.** Ready for Product 4: Spots Glossary Terms.

---

### Product 4: Spots Glossary Terms

**Key decisions:**
- Unified glossary structure: Term | Description | Req (matching DSL and Stepping Stones)
- Description format: **spot** in bold for spot types, then functional description
- Spot names keep trailing slash (archive/, chats/, etc.) to match directory names
- spot_v1.0.0.md is the base term (like api_node for DSL, activity for Stepping Stones)

**Req files created (8):**
- Glossary: spots_glossary
- Base concept: spot
- Spots: archive/, chats/, cips/, foundations/, glossary/, projects/

**SPOTS_GLOSSARY.md restructured:**
- Converted from 4-column table (Spot | Activity | Contents | Pattern/Notes) to 3-column (Term | Description | Req)
- Added spots_glossary and spot as foundational terms
- All spots now show **spot** type in description
- Preserved Rooms Metaphor section for context

**Discovery:**
- Spots glossary was the most compact (8 terms vs 24 DSL, 35+ Stepping Stones)
- Functional descriptions work well for activity-based locations
- Rooms metaphor documentation valuable for understanding the "why"

**Product 4 complete.** Ready for Product 5: Spots Structure Twin Pair.

---

