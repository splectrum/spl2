# Stepping Stones Glossary Changelog

This file tracks changes to STEPPING_STONES_GLOSSARY.md using diff format.

---

## 2025-11-19 - blank_project v1.0.1: Project creation actions

**Changes:**
- Updated blank_project req reference: v1.0.0 → v1.0.1
- Added explicit project creation actions to blank_project spec
- Added "Remove backlog item" as required action when project originates from backlog
- Added self-eval check for backlog removal

**Context:** Project 07 closure - discovered backlog item removal was not documented as project creation action.

---

## 2025-11-18 - Project 06: Term requirements and major restructuring

Major restructuring as part of Glossary Term Requirements project.

**Structure changes:**
- Converted from 4-column table to 3-column: Term | Description | Req
- Extends/type shown in bold within description
- All terms now have associated requirement files

**Terms removed:**
- duality pattern (meta-comment, not stepping stone)
- headline/detail separation (foundation req, not stepping stone)
- sufficient and complete (covered by more than complete)

**Terms added:**
- activity (base concept with microservice ownership pattern)
- preamble, preamble_ref, ref
- register, index, backlog_register
- versioned (global versioning scheme)
- project, blank_project, exploration_project
- splectrum, mycelium, panta_rhei, haicc
- friction, maturity, autonomy, local_rules_apply
- collaboration, pragmatism, single_concern
- dsl_glossary, spots_glossary

**Terms renamed:**
- artifact-to-requirements pinning → preamble ref

**Req files created (35+):**
activity, adhoc_activity, planned_activity, unplanned_activity, preamble, preamble_ref, versioned, versioned_immutable, minimal_and_complete, more_than_complete, twin_pair_methodology, chicken_and_egg, collaboration, pragmatism, single_concern, project, blank_project, exploration_project, splectrum, mycelium, panta_rhei, haicc, friction, maturity, autonomy, local_rules_apply, register, index, backlog_register, glossary, stepping_stones_glossary, commit_message, fire_and_forget, ref, and more

---

## 2025-11-18 - Updated Autonomy stepping stone with "Constraints Create Freedom" paradox

Updated Autonomy definition to capture the key insight that constraints enable freedom. Fencing (requirements + self-evaluation tools) enables autonomy within - without boundaries, no autonomy can be granted.

**Changes:**
- Added "Constraints create freedom" as core concept
- Clarified prerequisites: state requirements, define self-evaluation tools, then autonomy granted
- Added context-bound nature: autonomy always operates within defined fence
- Updated "When to Use" to emphasize defining reqs + self-eval before free action

**Context:** API design paradigm shift discussion - emerged from exploring scripting-to-API promotion pattern and HAICC autonomy model.

---

## 2025-11-13 - Initial creation

Glossary created with 8 stepping stones defining navigational concepts for SPL2 foundations and work patterns.

Initial stepping stones: artifact-to-requirements pinning, duality pattern, fire and forget, headline/detail separation, minimal and complete, stepping stones (meta-concept), sufficient and complete, twin pair methodology.

Status: Embryonic - will evolve through use as new stepping stones emerge and are validated.

---

## 2025-11-13 - Added three change management activity types

Added adhoc activity, planned activity, and unplanned activity stepping stones to capture the three formal change management patterns in SPL2.

```diff
--- /tmp/stepping_stones_before.md	2025-11-13 07:20:07.500823966 +0800
+++ /home/herma/splectrum/spl2/glossary/STEPPING_STONES_GLOSSARY.md	2025-11-13 07:22:12.216024550 +0800
@@ -12,14 +12,17 @@

 | Term | Description | When to Use | Related Detail Files |
 |------|-------------|-------------|---------------------|
+| Adhoc activity | Change activity through informal "chat while we work"; emergent, low formality; artifacts in chats/ (captures) or chats/immutables/ (requirements, designs) | When changes emerge during informal conversation; when formal project overhead not needed; for lightweight requirements or discoveries | Discovered in chats/2025-11-13_rooms-and-glossary.md |
 | Artifact-to-requirements pinning | All artifacts reference their requirements version as mandatory first line; enables quality assessment and versioned evolution without forced upgrades | When creating any artifact (document, code, template); when assessing artifact quality | TDC_framework_v1.1.0.md |
 | Duality pattern | Structure underneath (requirements, versioning, patterns) supports informal surface (simple language, natural conversation); the rigor enables the freedom | When establishing patterns that need both structure and flexibility; understanding how SPL2 balances formality and informality | Captured in chats/2025-11-13_terminology-and-chat-capture.md |
 | Fire and forget | Additive not corrective; capture chunks standalone without backward-looking consistency checking; prefer overlap over missing information | When capturing chats, meeting notes, or any sufficient-and-complete context; when speed and low friction matter more than polish | CHAT_REQUIREMENTS_v1.0.0.md |
 | Headline/detail separation | Foundations are headlines (concise, stable); detail lives in versioned files in project folders; foundations reference current version | When creating or evolving foundation documents; when detail threatens to make foundations unwieldy | Philosophy_v1.1.0.md, TDC_framework_v1.1.0.md |
 | Minimal and complete | Start minimal, gaps acceptable, grow based on evidence; question every addition - is this needed NOW?; simplicity paramount | When creating artifacts, designing systems, writing code; default mode for SPL2 work; when building new things | Philosophy_v1.1.0.md |
+| Planned activity | Change activity through formal project addons; known work, backlog item; high formality; artifacts in project folders | When work is known upfront and scheduled; for formal feature development or significant planned changes | PRINCE2_operational_v1.2.0.md |
 | Stepping stones | Navigational concepts encountered repeatedly throughout journey; same types appear at different decision points; active choice-making aids for path-finding | Meta-concept - this is what all these terms are! Used when establishing or recognizing foundational patterns | Captured in chats/2025-11-13_terminology-and-chat-capture.md |
 | Sufficient and complete | Capture essence with overlap/redundancy; prefer too much over missing key insights; completeness highly desired but never fully achieved (living) | When capturing conversations, documenting existing systems, preserving context; when missing information is more costly than redundancy | CHAT_REQUIREMENTS_v1.0.0.md |
 | Twin pair methodology | Create deliverable and template in parallel; discover through doing what's actually needed; skip work when discovery reveals it's unnecessary | When exploring new patterns in Explorative Projects; when template would help future work but requirements unclear upfront | Project_types_EXPLORATIVE_v1.0.0.md |
+| Unplanned activity | Change activity at project closure (maintenance); emerged during project work; medium formality; artifacts in project folders | When changes emerge during project execution; handled at project closure as maintenance activity; for foundation updates or discovered needs | PRINCE2_operational_v1.2.0.md |

 ---
```
