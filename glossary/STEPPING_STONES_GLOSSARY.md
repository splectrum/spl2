# Stepping Stones Glossary

**Requirements:** projects/04-bare-runtime-hello-world/Stepping_stones_glossary_requirements_v1.1.0.md
**Status:** Active - requirements register function established
**Context:** Foundations - navigational concepts and requirements register for SPL2 work

This glossary defines stepping stones - the navigational concepts used throughout SPL2 foundations and work patterns. Stepping stones are encountered repeatedly on the journey, helping choose paths and make decisions.

---

## Stepping Stones (Alphabetical)

| Term | Description | Req |
|------|-------------|-----|
| activity | Work that creates immutables and updates mutables, within a defined context (chat, project). Ownership pattern: activity registers change with spot, spot executes | projects/06-glossary-term-requirements/reqs/activity_v1.0.0.md |
| adhoc activity | **Extends activity** - Informal "chat while we work"; emergent, low formality; artifacts in chats/ or chats/immutables/ | projects/06-glossary-term-requirements/reqs/adhoc_activity_v1.0.0.md |
| autonomy | Freedom to act within defined boundaries. **Constraints create freedom:** reqs + self-eval define the fence, autonomy operates within. Prerequisites: state reqs, define self-eval. Trust builds through accurate self-eval. See Constraints_create_freedom_v1.0.0.md | projects/06-glossary-term-requirements/reqs/autonomy_v1.0.0.md |
| backlog | See backlog register | |
| backlog register | **register** - Work queue of projects in execution order; top item is next to execute. Mutable. See projects/BACKLOG.md | projects/08-dev-environment-api/backlog_register_v1.1.0.md |
| base module | **Extends module** - Foundational runtime and support functionality. Layer 0, everything overlays on top | projects/08-dev-environment-api/base_module_v1.0.0.md |
| blank project | Base project type with PRINCE2 requirements; straightforward execution with clear deliverables; no special methodology. Other project types extend this | projects/10-dev-env-v0-bundle-continued/reqs/blank_project_v1.2.0.md |
| chicken and egg | Circular dependency where evolution is mandatory; without evolution, infinite loop. X and Y need each other, so they co-evolve | projects/06-glossary-term-requirements/reqs/chicken_and_egg_v1.0.0.md |
| collaboration | Joint activity that is interactive; partnership with mutual respect aiming to deepen understanding and trigger insight; different but overlapping roles | projects/06-glossary-term-requirements/reqs/collaboration_v1.0.0.md |
| commit message | Headline for git commit; identifies scope, summarizes why, hooks to detail; not a changelog or diff explanation | projects/06-glossary-term-requirements/reqs/commit_message_v1.0.0.md |
| delegation | Handing work to another agent. Mindset shift from sole executor to orchestrator who chooses when to do vs delegate. Work module is unit of handoff. Planning mode alongside implementation mode | projects/08-dev-environment-api/delegation_v1.0.0.md |
| dev modules | **Extends modules** - Type-aware modules folder for dev environments. Layer 0 = types/, Layers 1..n-1 = base modules, Layer n = work module. Overlay resolution with selectFile/collectAll. Dev only, not in production | projects/09-console-v5-stream-native/dev modules_v1.0.0.md |
| dsl glossary | Glossary type for SPL2 Domain-Specific Language vocabulary - runtime, APIs, methods, properties. Entry structure: Term, Description, Req | projects/06-glossary-term-requirements/reqs/dsl_glossary_v1.0.0.md |
| exploration project | **Extends blank project** - Architecture discovery through twin pair methodology; high uncertainty requiring evidence-based evolution | projects/08-dev-environment-api/exploration_project_v1.1.0.md |
| fire and forget | Launch and move on; self-contained action without follow-up; additive not corrective; no backward consistency checking | projects/06-glossary-term-requirements/reqs/fire_and_forget_v1.0.0.md |
| friction | Resistance that impedes flow; internal (anxiety, confusion) or external (blockers, unclear reqs); primary partnership health metric | projects/06-glossary-term-requirements/reqs/friction_v1.0.0.md |
| glossary | Registry of terms with associated reqs. Four territories. Critical rule: mutable-to-mutable references use term names (not paths) to stay current as reqs evolve. Howtos are minimal routers, no duplication | projects/09-console-v5-stream-native/glossary_v1.2.0.md |
| index | Fast lookup and ordering; navigational aid for finding things quickly | projects/06-glossary-term-requirements/reqs/index_v1.0.0.md |
| preamble | Reference block at the start of an artifact; contains one or more preamble refs (Type, Extends, Requirements, etc.) | projects/06-glossary-term-requirements/reqs/preamble_v1.0.0.md |
| preamble ref | Reference within the preamble; points to requirements, types, or related artifacts; enables quality assessment and local rules apply | projects/06-glossary-term-requirements/reqs/preamble_ref_v1.0.0.md |
| ref | Reference - pointer to another artifact or term. Abbreviation used throughout SPL2 | projects/06-glossary-term-requirements/reqs/ref_v1.0.0.md |
| register | Log of what exists for a specific item type; inventory or catalog. Mutable | projects/06-glossary-term-requirements/reqs/register_v1.0.0.md |
| haicc | Human-AI Collaboration Creativity - partnership methodology where each brings unique strengths to create what neither could alone. See CIP-012 | projects/06-glossary-term-requirements/reqs/haicc_v1.0.0.md |
| howto glossary | Entry point for goal-oriented action ("How do I do X?"). Procedures that spider INTO stepping stones for concepts. Minimal routers, not duplicators | projects/09-console-v5-stream-native/howto_glossary_v1.1.0.md |
| local rules apply | Artifacts are self-sufficient in reqs; no external supervisor needed. Each artifact has its own reqs version and self-eval. No retroactive burden | projects/06-glossary-term-requirements/reqs/local_rules_apply_v1.0.0.md |
| maturity | What is achieved through evolution in time; sign of sufficient longevity. Journey from inception to maturity is positive - allows maturing within context. Evidence-based advancement | projects/06-glossary-term-requirements/reqs/maturity_v1.0.0.md |
| minimal and complete | Try to be complete with minimal means, knowing it will fall short and need continued effort. For situations where complete isn't fully known. Question every addition | projects/06-glossary-term-requirements/reqs/minimal_and_complete_v1.0.0.md |
| module | Root API node structure containing api-node hierarchy (package/API/method). Self-contained mycelium with relative refs and portability. Types: install module, work module | projects/08-dev-environment-api/module_v1.0.0.md |
| modules | Reserved folder within env context for module layer management. Contains named modules with _index.json defining layer order | projects/08-dev-environment-api/modules_v1.0.0.md |
| more than complete | For situations where complete exists but is hard to figure out; be overgenerous to capture completeness within | projects/06-glossary-term-requirements/reqs/more_than_complete_v1.0.0.md |
| mycelium | Logical data repository layer supporting multiple physical repositories (Git, Fossil, Pijul, etc.); the network beneath Splectrum. Repository abstraction | projects/06-glossary-term-requirements/reqs/mycelium_v1.0.0.md |
| panta rhei | "Everything flows" - design philosophy where state flows like a river through stateless code; immutable records preserve history, event sourcing emerges naturally | projects/06-glossary-term-requirements/reqs/panta_rhei_v1.0.0.md |
| patch module | **Extends module** - Partial API unit for targeted fixes. Layer 2+, overlays base/work, only contains changed parts | projects/08-dev-environment-api/patch_module_v1.0.0.md |
| plain req | Base req type using natural language for spec and self-eval. Structure: Type, Extends (optional), Spec, Self-eval, Comments (optional). All req types extend this | projects/06-glossary-term-requirements/reqs/plain_req_v1.0.0.md |
| planned activity | **Extends activity** - Formal project work; known work, on the workplan; high formality; artifacts in project folders | projects/06-glossary-term-requirements/reqs/planned_activity_v1.0.0.md |
| pragmatism | Usability tests determine "good enough" rather than theoretical perfection; context-dependent. Practical value over abstract ideals | projects/06-glossary-term-requirements/reqs/pragmatism_v1.0.0.md |
| project | Formal work unit for delivering products; replaces sprint in agile. Set of related products with maintenance cycle. Project types enable complex delivery | projects/08-dev-environment-api/project_v1.3.0.md |
| reqs | Requirements - clear statement of what needs to be achieved; defines the fence for autonomy. Structure: spec + self-eval. Without reqs, no autonomy can be granted | projects/06-glossary-term-requirements/reqs/reqs_v1.0.0.md |
| requirements | See reqs | |
| self-eval | Self-evaluation - verification against reqs. Enables autonomy through accountability. Trust builds through accurate self-eval, erodes through inaccurate. Defined before work begins | projects/06-glossary-term-requirements/reqs/self_eval_v1.0.0.md |
| self-evaluation | See self-eval | |
| single concern | Within a defined context, aim to deal with one thing only; criterion for boundaries and granularity | projects/06-glossary-term-requirements/reqs/single_concern_v1.0.0.md |
| spec | Specification - the WHAT component of reqs. Natural language statement of what needs to be achieved. Part of req (spec + self-eval = req) | projects/06-glossary-term-requirements/reqs/spec_v1.0.0.md |
| specification | See spec | |
| splectrum | Platform for building P2P applications with AI collaboration; built on Mycelium data layer; enables HAICC methodology | projects/06-glossary-term-requirements/reqs/splectrum_v1.0.0.md |
| stepping stones | See stepping stones glossary | |
| stepping stones glossary | Entry point for understanding concepts ("What is X?"). Navigational concepts for comprehension, not action. Spiders into related concepts via extends. Howtos spider INTO here for concepts needed to execute | projects/09-console-v5-stream-native/stepping_stones_glossary_v1.1.0.md |
| twin pair methodology | Create deliverable and req in tandem; discover through doing what's actually needed; skip unnecessary work | projects/06-glossary-term-requirements/reqs/twin_pair_methodology_v1.0.0.md |
| unplanned activity | **Extends activity** - Emerged during project work, not on workplan; handled at closure; medium formality; artifacts in project folders | projects/06-glossary-term-requirements/reqs/unplanned_activity_v1.0.0.md |
| versioned | Artifact using global versioning scheme (semver: major.minor.patch). Filename pattern: `name_vX.Y.Z.md`. Platform-wide consistency | projects/06-glossary-term-requirements/reqs/versioned_v1.0.0.md |
| versioned immutable | **versioned** - Artifact that doesn't change once created but can have new versions. Evolution creates new version | projects/06-glossary-term-requirements/reqs/versioned_immutable_v1.0.0.md |
| work module | **Extends module** - Implementation work module. Layer 1+, overlays base, contains work package and _meta state tracking | projects/08-dev-environment-api/work_module_v1.0.0.md |
| work package | Self-contained, portable module with spec, self-eval manifest, tests, schemas, and stub implementation. All refs relative to package root. Unit of handoff for autonomous execution | projects/08-dev-environment-api/work_package_v1.0.0.md |

---

## Notes

- **Entry structure:** Term | Description | Req (three columns)
- **Description format:** Type/extends in bold where applicable, then description
- **Req column:** All refs are relative to repo root
- **Journey metaphor:** Stepping stones are navigational aids - same stones appear repeatedly at different decision points
- **Emerge through use:** Discovered and crystallized from working patterns, not pre-planned
- **Minimal and complete applies:** Grows as new stepping stones emerge and are validated

---

**Created:** 2025-11-13
**Evolution:** Will be updated as new stepping stones are discovered and validated
