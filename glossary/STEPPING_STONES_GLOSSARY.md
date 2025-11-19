# Stepping Stones Glossary

**Requirements:** projects/04-bare-runtime-hello-world/Stepping_stones_glossary_requirements_v1.1.0.md
**Status:** Active - requirements register function established
**Context:** Foundations - navigational concepts and requirements register for SPL2 work

This glossary defines stepping stones - the navigational concepts used throughout SPL2 foundations and work patterns. Stepping stones are encountered repeatedly on the journey, helping choose paths and make decisions.

---

## Stepping Stones (Alphabetical)

| Term | Description | Req |
|------|-------------|-----|
| activity | Work that creates immutables and updates mutables, within a defined context (chat, project). Ownership pattern: activity registers change with spot, spot executes | activity_v1.0.0.md |
| adhoc activity | **Extends activity** - Informal "chat while we work"; emergent, low formality; artifacts in chats/ or chats/immutables/ | adhoc_activity_v1.0.0.md |
| autonomy | Freedom to act within defined boundaries. **Constraints create freedom:** reqs + self-eval define the fence, autonomy operates within. Prerequisites: state reqs, define self-eval. Trust builds through accurate self-eval. See Constraints_create_freedom_v1.0.0.md | autonomy_v1.0.0.md |
| backlog | See backlog register | |
| backlog register | **register** - Work queue of projects in execution order; top item is next to execute. Mutable. See projects/BACKLOG.md | backlog_register_v1.0.0.md |
| blank project | Base project type with PRINCE2 requirements; straightforward execution with clear deliverables; no special methodology. Other project types extend this | blank_project_v1.0.1.md |
| chicken and egg | Circular dependency where evolution is mandatory; without evolution, infinite loop. X and Y need each other, so they co-evolve | chicken_and_egg_v1.0.0.md |
| collaboration | Joint activity that is interactive; partnership with mutual respect aiming to deepen understanding and trigger insight; different but overlapping roles | collaboration_v1.0.0.md |
| commit message | Headline for git commit; identifies scope, summarizes why, hooks to detail; not a changelog or diff explanation | commit_message_v1.0.0.md |
| dsl glossary | Glossary type for SPL2 Domain-Specific Language vocabulary - runtime, APIs, methods, properties. Entry structure: Term, Description, Req | dsl_glossary_v1.0.0.md |
| exploration project | **Extends blank project** - Architecture discovery through twin pair methodology; high uncertainty requiring evidence-based evolution | exploration_project_v1.0.0.md |
| fire and forget | Launch and move on; self-contained action without follow-up; additive not corrective; no backward consistency checking | fire_and_forget_v1.0.0.md |
| friction | Resistance that impedes flow; internal (anxiety, confusion) or external (blockers, unclear reqs); primary partnership health metric | friction_v1.0.0.md |
| glossary | Registry of terms with associated reqs; can be created for different contexts; terms can represent vocabulary, functional units, patterns. Four territories: creator's (stepping stones), user's (howto), language (DSL), functional (spots) | glossary_v1.1.0.md |
| index | Fast lookup and ordering; navigational aid for finding things quickly | index_v1.0.0.md |
| preamble | Reference block at the start of an artifact; contains one or more preamble refs (Type, Extends, Requirements, etc.) | preamble_v1.0.0.md |
| preamble ref | Reference within the preamble; points to requirements, types, or related artifacts; enables quality assessment and local rules apply | preamble_ref_v1.0.0.md |
| ref | Reference - pointer to another artifact or term. Abbreviation used throughout SPL2 | ref_v1.0.0.md |
| register | Log of what exists for a specific item type; inventory or catalog. Mutable | register_v1.0.0.md |
| haicc | Human-AI Collaboration Creativity - partnership methodology where each brings unique strengths to create what neither could alone. See CIP-012 | haicc_v1.0.0.md |
| local rules apply | Artifacts are self-sufficient in reqs; no external supervisor needed. Each artifact has its own reqs version and self-eval. No retroactive burden | local_rules_apply_v1.0.0.md |
| maturity | What is achieved through evolution in time; sign of sufficient longevity. Journey from inception to maturity is positive - allows maturing within context. Evidence-based advancement | maturity_v1.0.0.md |
| minimal and complete | Try to be complete with minimal means, knowing it will fall short and need continued effort. For situations where complete isn't fully known. Question every addition | minimal_and_complete_v1.0.0.md |
| more than complete | For situations where complete exists but is hard to figure out; be overgenerous to capture completeness within | more_than_complete_v1.0.0.md |
| mycelium | Logical data repository layer supporting multiple physical repositories (Git, Fossil, Pijul, etc.); the network beneath Splectrum. Repository abstraction | mycelium_v1.0.0.md |
| panta rhei | "Everything flows" - design philosophy where state flows like a river through stateless code; immutable records preserve history, event sourcing emerges naturally | panta_rhei_v1.0.0.md |
| plain req | Base req type using natural language for spec and self-eval. Structure: Type, Extends (optional), Spec, Self-eval, Comments (optional). All req types extend this | plain_req_v1.0.0.md |
| planned activity | **Extends activity** - Formal project work; known work, on the workplan; high formality; artifacts in project folders | planned_activity_v1.0.0.md |
| pragmatism | Usability tests determine "good enough" rather than theoretical perfection; context-dependent. Practical value over abstract ideals | pragmatism_v1.0.0.md |
| project | Formal work unit for delivering products; replaces sprint in agile. Set of related products with maintenance cycle. Project types enable complex delivery | project_v1.0.0.md |
| reqs | Requirements - clear statement of what needs to be achieved; defines the fence for autonomy. Structure: spec + self-eval. Without reqs, no autonomy can be granted | reqs_v1.0.0.md |
| requirements | See reqs | |
| self-eval | Self-evaluation - verification against reqs. Enables autonomy through accountability. Trust builds through accurate self-eval, erodes through inaccurate. Defined before work begins | self_eval_v1.0.0.md |
| self-evaluation | See self-eval | |
| single concern | Within a defined context, aim to deal with one thing only; criterion for boundaries and granularity | single_concern_v1.0.0.md |
| spec | Specification - the WHAT component of reqs. Natural language statement of what needs to be achieved. Part of req (spec + self-eval = req) | spec_v1.0.0.md |
| specification | See spec | |
| splectrum | Platform for building P2P applications with AI collaboration; built on Mycelium data layer; enables HAICC methodology | splectrum_v1.0.0.md |
| stepping stones | See stepping stones glossary | |
| stepping stones glossary | Navigational concepts encountered repeatedly throughout journey; active choice-making aids for path-finding. Glossary entry structure: Term, Description, Req | stepping_stones_glossary_v1.0.0.md |
| twin pair methodology | Create deliverable and req in tandem; discover through doing what's actually needed; skip unnecessary work | twin_pair_methodology_v1.0.0.md |
| unplanned activity | **Extends activity** - Emerged during project work, not on workplan; handled at closure; medium formality; artifacts in project folders | unplanned_activity_v1.0.0.md |
| versioned | Artifact using global versioning scheme (semver: major.minor.patch). Filename pattern: `name_vX.Y.Z.md`. Platform-wide consistency | versioned_v1.0.0.md |
| versioned immutable | **versioned** - Artifact that doesn't change once created but can have new versions. Evolution creates new version | versioned_immutable_v1.0.0.md |

---

## Notes

- **Entry structure:** Term | Description | Req (three columns)
- **Description format:** Type/extends in bold where applicable, then description
- **Req column:** Points to versioned req file in projects/06-glossary-term-requirements/reqs/
- **Journey metaphor:** Stepping stones are navigational aids - same stones appear repeatedly at different decision points
- **Emerge through use:** Discovered and crystallized from working patterns, not pre-planned
- **Minimal and complete applies:** Grows as new stepping stones emerge and are validated

---

**Created:** 2025-11-13
**Evolution:** Will be updated as new stepping stones are discovered and validated
