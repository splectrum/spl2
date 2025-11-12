# Top-Level Artifacts: Rooms in a House

**Date:** 2025-11-13
**Context:** Chat while working - exploring repository structure using rooms metaphor

## Meta-Observation: Chat While We Work

User observation at start: "what we are doing now is 'chat while we work'"

**Demonstrates duality pattern:**
- Surface: Having informal conversation about structure
- Underneath: While talking, we're capturing (chats/), making decisions that affect house structure
- Work and conversation happening simultaneously, fluidly

This chat itself will inform whether glossary/ becomes a room. The conversation **is** the work.

## The Rooms Metaphor

User introduced "rooms in a house" as way to think about top-level structure.

**Not artifact-based** (what files/folders) but **activity-based** (what do you do there).

Like actual rooms: kitchen, bathroom, bedroom, living room, library - each has a purpose/activity.

## Current Rooms

**foundations/** - Reference foundational principles (how we work, what we build, partnership health)
- Three pillars: WOW, PRINCIPLES, PARTNERSHIP

**projects/** - Do formal work (manufacture deliverables)
- The factory itself
- Where "manufacturing" happens

**chats/** - Have informal collaborative conversations
- Just created this room!
- Capture working discussions

**archive/** - Look up historical reference materials

## Manufacturing vs House Structure

**User's insight:** Beauty of project structure is you can work away locally on deliverables without being required to externalize them.

**Pattern:**
- **Manufacturing:** Happens in project folders - work-in-progress, local deliverables
- **House rooms:** Top-level - externalized, "ready for collection," productized
- **Key:** Not everything manufactured needs externalization (immediately or ever)

Like making something in factory and having it ready for collection. Manufacturing happens all over, but only some things get moved to house rooms.

## The Glossary Question

**Existing work:** Already have glossaries manufactured:
- DSL/API glossary
- Foundations glossary (under construction)

**Proposal:** Should `glossary/` be a room in the house?

**Initial exploration of what glossary is for:**
- Terms with requirements/special meaning
- Different contexts need different glossaries
- User proposed: one for artifacts/structure itself

## What Activity is Glossary?

**Key clarification:** Rooms are activity-based, not artifact-based.

**The glossary activity:** "Establish and maintain shared language (context-specific)"

**Purpose:**
- Define what terms mean in specific contexts
- Enable clear communication
- Living, evolving definitions

**Stepping stone that applies:** Minimal and complete
- Simplicity paramount
- Completeness highly desired but never fully achieved
- Living thing that evolves

## Why Glossary is Distinct from Foundations

**Foundations:** Principles, methodologies, patterns - guides behavior

**Glossary:** "What do these specific words mean here" - clarifies language

Different activities:
- Foundations activity: Reference how to work
- Glossary activity: Define context-specific language

## Contexts Needing Glossaries

- DSL/API context (technical terms)
- Foundations context (stepping stones, artifact types, patterns)
- Structure context (what is a project? foundation? chat? room?)

Each context has own language requiring definition.

## Natural Dump Point Discovery

**User insight:** Don't figure out where fire and forget dump fits best. Natural dump point is **before each response**.

**Conversation rhythm:**
1. User says something (chunk)
2. AI processes, thinks
3. **DUMP** - capture what just processed
4. Return answer

**Why this works:**
- Automatic - built into response cycle
- No decision fatigue - dump before every response
- Won't forget - part of rhythm
- Natural chunking - conversation chunks itself
- Like breathing: inhale, process, exhale/dump, speak

**This is fire and forget at operational level** - don't overthink when to capture, just make it part of response rhythm.

## Decision: glossary/ Room Confirmed

**Simple name:** `glossary/`

**Activity:** When structured conversation emerges in a context, define terms so we know what we're talking about.

**That's it.** Don't overcomplicate.

**Contexts get glossaries as needed:**
- DSL/API context
- Foundations context (stepping stones, patterns, etc.)
- Structure/rooms context (what is a project? foundation? chat?)
- Future contexts as they emerge

**User observation:** AI already does "screen dump" at response point, so adding capture dump is just part of same flow. Natural rhythm.

## Naming the Three Glossaries

**1. DSL glossary** - Already exists in project 03
- SPL2 runtime/API vocabulary (packages, APIs, methods, properties, Kafka records)
- Has requirements already (glossary_requirements_v1.0.0.md)

**2. Stepping Stones glossary** - For foundations
- Defines navigational concepts: minimal and complete, sufficient and complete, fire and forget, artifact-to-requirements pinning, twin pair methodology, etc.

**3. ??? glossary** - For repository structure

**Naming exploration for #3:**
- Started with: artifacts, structure, repository
- User asked: single word for "meeting places"? (venues, forums, commons, spaces, hubs, quarters)
- User asked: single word for "places of interest"? (landmarks, destinations, sites, locations)
- User preferred: informal word, between venue and hub
- Options: spots, hangouts, corners, places

**Decision: SPOTS**
- Casual, informal ("the projects spot", "the chat spot")
- User connection: "know a leopard by its spots" - what we put in place defines us (defines the project)
- Top-level folders are "spots" where different activities happen

**Final three glossaries:**
1. `DSL_GLOSSARY` (or similar naming from project 03)
2. `STEPPING_STONES_GLOSSARY`
3. `SPOTS_GLOSSARY`

## Implementation Complete

**Created glossary/ spot with four files:**

1. **GLOSSARY_REQUIREMENTS_v1.0.0.md**
   - General requirements for all glossaries
   - Context-specific scope, simplicity, living documents
   - Manual maintenance for now
   - Based on Project 03 requirements but adapted for all contexts

2. **DSL_GLOSSARY_v1.0.0.md**
   - Externalized from projects/03-runtime-hello-world/GLOSSARY.md
   - SPL2 runtime/API vocabulary (packages, APIs, methods, properties, Kafka records)
   - Formal structure: Term | Type | Schema | Description | Requirement
   - 17 terms defined (_, _context, _runtime, execution, greet, headers, hello, invoke, key, nodeVersion, prXX, run, runtime, runtimeId, spl, startTime, value, version)

3. **STEPPING_STONES_GLOSSARY_v1.0.0.md** (embryonic)
   - Navigational concepts for foundations
   - Informal structure: Term | Description | When to Use | Related Detail Files
   - 8 stepping stones defined: artifact-to-requirements pinning, duality pattern, fire and forget, headline/detail separation, minimal and complete, stepping stones (meta), sufficient and complete, twin pair methodology
   - Journey metaphor: stones encountered repeatedly, choose which to step on

4. **SPOTS_GLOSSARY_v1.0.0.md** (embryonic)
   - Repository structure definitions
   - Structure: Spot | Activity | Contents | Pattern/Notes
   - 5 spots defined: archive/ (reference), chats/ (informal conversations), foundations/ (principles), glossary/ (language definitions), projects/ (formal work)
   - Rooms metaphor: activity-based locations, manufacturing vs house structure

**Pattern demonstrated:**
- Glossary/ spot now exists with its own glossary (SPOTS_GLOSSARY) that defines it - self-referential!
- Different glossary contexts use different structures (formal for DSL, informal for Stepping Stones/Spots)
- Artifact-to-requirements pinning applied (all reference GLOSSARY_REQUIREMENTS_v1.0.0.md)
- Embryonic glossaries ready to grow through use

## Changelog Pattern Discovery

**User observation:** Glossary files aren't versioned like detail files - they're mutable living documents.

**The distinction:**
1. **Immutable versioned detail files** (in projects/): Philosophy_v1.0.0.md, etc.
   - Complete snapshots, never change, multiple versions coexist
   - References pin to specific version

2. **Mutable living documents** (glossary/, foundations/): DSL_GLOSSARY.md, WOW.md, etc.
   - No version in filename - always "latest"
   - Evolve in place, reference immutable docs
   - Need CHANGELOG to track evolution

**Proposed changelog pattern (git-diff based):**

**Process:**
1. Copy current file to temp (before)
2. Make changes to actual file
3. Run `diff` between before and after
4. Append diff output to CHANGELOG
5. Add header (date + one-line summary) above diff

**Why this works:**
- **Precise** - Shows exactly what changed
- **Automatable** - Mechanical process, ready for tooling
- **Fire and forget** - No interpretation needed
- **Sufficient and complete** - Full context preserved
- **Standard format** - Everyone understands diffs

**Example changelog structure:**
```markdown
## 2025-11-13 - Added "fire and forget" stepping stone

```diff
@@ -7,6 +7,7 @@
| Artifact-to-requirements pinning | ... |
| Duality pattern | ... |
+| Fire and forget | Additive not corrective... |
| Headline/detail separation | ... |
```

**Applies to:**
- All glossary files (DSL_GLOSSARY.md, STEPPING_STONES_GLOSSARY.md, SPOTS_GLOSSARY.md, GLOSSARY_REQUIREMENTS.md)
- Foundation files (WOW.md, PRINCIPLES.md, PARTNERSHIP.md)
- Any other mutable living documents

**Next:** Rename glossary files (remove version numbers), create initial CHANGELOGs

## Changelog Pattern Implementation

**Glossary files renamed (removed _v1.0.0):**
- DSL_GLOSSARY_v1.0.0.md → DSL_GLOSSARY.md
- STEPPING_STONES_GLOSSARY_v1.0.0.md → STEPPING_STONES_GLOSSARY.md
- SPOTS_GLOSSARY_v1.0.0.md → SPOTS_GLOSSARY.md
- GLOSSARY_REQUIREMENTS_v1.0.0.md → GLOSSARY_REQUIREMENTS.md

**All files updated internally:** Requirements references now point to unversioned GLOSSARY_REQUIREMENTS.md, headers no longer show version numbers.

**CHANGELOG files created for glossaries:**
- DSL_GLOSSARY_CHANGELOG.md - Initial creation entry (17 terms from project 03)
- STEPPING_STONES_GLOSSARY_CHANGELOG.md - Initial creation entry (8 stepping stones, embryonic)
- SPOTS_GLOSSARY_CHANGELOG.md - Initial creation entry (5 spots, embryonic)
- GLOSSARY_REQUIREMENTS_CHANGELOG.md - Initial creation entry (based on project 03 reqs)

**CHANGELOG files created for foundations:**
- WOW_CHANGELOG.md - Existing file brought under changelog management (evolved through projects 01-03)
- PRINCIPLES_CHANGELOG.md - Existing file brought under changelog management (evolved through projects 01-02)
- PARTNERSHIP_CHANGELOG.md - Existing file brought under changelog management (created/updated post-project 03)

**Pattern established:**
- Mutable living documents (glossary/, foundations/) now have unversioned names + CHANGELOGs
- Immutable detail files (in projects/) remain versioned
- Clear distinction: living docs reference immutable docs, but are themselves mutable
- Changelog entries use date + summary + diff format (git-diff based)
- Ready for tooling: mechanical process (copy before, edit, diff, append to changelog)

## Immutables from Chats Discovery

**User insight:** Requirements files are immutable, not mutable living documents!

**Problem identified:** GLOSSARY_REQUIREMENTS.md was treated as mutable (with CHANGELOG), but requirements are immutable and versioned.

**Gap discovered:** Where do immutables created during informal "chat while we work" go?
- Projects/ contains immutables from formal work
- Chats/ contains informal work captures
- But "chat while we work" can produce requirements, designs, etc. that need to be immutable and referenceable

**Solution: chats/immutables/**

**Pattern:**
- Informal work (chats/) can produce immutable outputs (requirements, designs, etc.)
- These go in `chats/immutables/` with standard versioning (e.g., `glossary_requirements_v1.0.0.md`)
- Formal work (projects/) produces immutables in project folders
- Both follow same versioning/immutability pattern, just different manufacturing context

**Implementation:**
- Created `chats/immutables/` folder
- Moved `GLOSSARY_REQUIREMENTS.md` → `chats/immutables/glossary_requirements_v1.0.0.md`
- Removed `GLOSSARY_REQUIREMENTS_CHANGELOG.md` (requirements are immutable, no changelog needed)
- Updated all glossary files to reference `chats/immutables/glossary_requirements_v1.0.0.md`

**Why this works:**
- No forced formality ("create a project just for requirements file")
- "Chat while we work" can still produce referenceable artifacts
- Clear distinction: chat captures (mutable additive) vs immutables (versioned)
- Artifact-to-requirements pinning pattern still works (glossaries pin to versioned requirements)

**Local rules apply:** chats/immutables/ pattern should be documented in CHAT_REQUIREMENTS (needs v1.1.0 to add this discovery), not in SPOTS_GLOSSARY (too granular for top-level spot definitions).

## Three Activity Types for Change Management

**User insight:** Three formal change management patterns exist in SPL2:

1. **Adhoc activity** - Through informal "chat while we work"; emergent, low formality; artifacts in chats/ (captures) or chats/immutables/ (requirements, designs)

2. **Unplanned activity** - At project closure (maintenance); emerged during project work; medium formality; artifacts in project folders

3. **Planned activity** - Through formal project addons; known work, backlog item; high formality; artifacts in project folders

**Decision:** Added all three as stepping stones to STEPPING_STONES_GLOSSARY (WOW concepts, but glossary is sufficient - WOW.md is headline only).

**Changelog pattern demonstrated:** Used copy-before, edit, diff, append-to-changelog process successfully.

## Glossary Term Requirements - New Backlog Item

**User observation:** Glossary terms probably need requirements attached, but too disruptive for adhoc/unplanned activity.

**Analysis:** Substantial enough and ready for project brief:
- Significant scope (requirements for all existing terms + pattern for future)
- Foundation-level impact (meta-pattern work)
- Needs design thinking (what do requirements for conceptual patterns look like?)
- Tooling implications (affects glossary management tooling CIP)

**Decision:** Created planned activity - new backlog item

**Created:**
- `projects/backlog/glossary-term-requirements.md` - Exploration Project, Medium priority
- Updated `projects/BACKLOG.md` - added to backlog table

**Scope:**
- Define requirements format for glossary terms (context-appropriate)
- Create requirements for all existing terms (17 DSL + 11 stepping stones + 5 spots)
- Establish validation and maintenance patterns
- Enable artifact-to-requirements pinning for glossary entries
- Foundation for glossary management tooling

**Timeline:** 1-2 weeks when prioritized
