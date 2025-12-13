# CLAUDE.md - SPL2 Project Navigation

## Project Purpose

SPL2 is a platform for AI to create and manage software solutions with a focus on P2P applications. Clean restart from spl1 - simplified, AI-optimized, with maximum freedom of implementation.

## CRITICAL: Collaboration First

**This is collab land. If in any doubt, ASK.**

- Don't assume external conventions apply - splectrum has its own approach
- If it's not in a req, discuss it first before implementing
- Don't jump to solutions - discuss design choices
- Splectrum prefers different approaches than standard patterns
- When unsure: stop, think, ask

**Anti-pattern:** Seeing a problem and immediately applying "standard" fixes without asking if that's what splectrum wants.

**Use splectrum tools:** Always prefer `spl` commands over raw bash/file operations when possible. Use `spl spl/whoami`, `spl spl/container/selfeval`, etc. to explore and validate.

## Start Here (New Session)

**Current state (start here):**
- Read `status/CURRENT.md` - Active work, recent context, session entry point

**Understand how we work:**
- Read `foundations/WOW.md` - Philosophy, PRINCE2, TDC methodologies
- Read `foundations/PRINCIPLES.md` - What SPL2 is, design principles
- Read `foundations/PARTNERSHIP.md` - Partnership health, collaboration patterns, friction metric

**Project status:**
- Read `projects/INDEX.md` - Completed projects and current status
- Read `projects/BACKLOG.md` - Work queue with priorities/dependencies

**Everything else references from these foundation documents.**

## How Documentation Works

**Mutable-immutable dualism:**
- **Mutable entry points** (foundations/, design/, glossary/) - Always "current", unversioned names, protected by CHANGELOGs
- **Immutable artifacts** (projects/, chats/immutables/, cips/) - Versioned, never change, referenceable
- Entry points branch to standalone immutables in version jackets

**Pattern:**
- Foundations (WOW.md, PRINCIPLES.md, PARTNERSHIP.md) are **headlines** - concise, mutable, with CHANGELOGs
- Detail files live in project folders - **versioned immutables** (e.g., Philosophy_v1.1.0.md)
- Design docs (API_DESIGN.md, etc.) are **mutable** - always current, with CHANGELOGs tracking evolution, cataloged in DESIGN_REGISTER.md
- Glossaries (DSL, Stepping Stones, Spots) are **mutable** - always current, with CHANGELOGs tracking evolution
- Requirements are **immutable** - versioned in projects/ (formal work) or chats/immutables/ (adhoc work)
- CIPs are **immutable** - once created, never change; tracked via CIP_REGISTER.md (mutable, living)
- All artifacts reference their requirements document (first line)

**Example:** WOW.md (mutable) references Philosophy_v1.1.0.md (immutable) - that versioned file lives in the project folder where it was created/evolved.

## Key Patterns Established

**Stepping stones (navigational concepts):**
- Journey metaphor: patterns encountered repeatedly throughout work
- Same stones appear at different decision points - choose which to step on based on context
- See STEPPING_STONES_GLOSSARY.md for full list

**Activity types (change management):**
- **Adhoc activity:** Informal "chat while we work"; artifacts in chats/ or chats/immutables/
- **Unplanned activity:** Project closure maintenance; emerged during work; artifacts in projects/
- **Planned activity:** Formal backlog items; known work; artifacts in projects/

**Mutable-immutable dualism:**
- Mutable entry points (foundations, glossaries) protected by CHANGELOGs
- Immutable artifacts (requirements, detail files) in version jackets
- Solves findability vs traceability tension

**Partnership reflection:**
- Mandatory at project closure (PRINCE2_operational_v1.2.0)
- Three artifacts: Reflection (AI), Review (collaborative), Foundation doc (current state)
- Purpose: Surface misunderstandings, align understanding, reduce friction
- Primary metric: Friction level (technical + emotional)

**Learning stance:**
- Be happy to fail at times and learn from it - it's worth it and can be fun
- Adjustments happen organically, from experience on the ground
- Surprise at interpretation gaps is calibration, not frustration
- "So alike but so different" - same words, different mental models is the core challenge and opportunity

## Glossary-First Lookup (MANDATORY)

**ALWAYS start with the appropriate glossary. Never grep/scan the repo first.**

The glossaries are the index to everything. Scanning projects or grepping the repo bypasses the knowledge structure and leads to errors (like missing the extends chain, or finding outdated information).

**Two entry points based on intent:**

| Intent | Glossary | Question |
|--------|----------|----------|
| **Understand** something | STEPPING_STONES_GLOSSARY.md | "What is X?" |
| **Do** something | HOWTO_GLOSSARY.md | "How do I do X?" |

**Spider pattern:**
- Glossary entry → Req file (from Req column)
- Req file → Extends chain (follow extends to get full picture)
- Howtos spider INTO stepping stones for concepts needed

**Glossary locations:**
- `glossary/HOWTO_GLOSSARY.md` - Procedures, actions (goal-oriented entry point)
- `glossary/STEPPING_STONES_GLOSSARY.md` - Concepts, patterns (understanding entry point)
- `glossary/DSL_GLOSSARY.md` - Runtime/API vocabulary
- `glossary/SPOTS_GLOSSARY.md` - Repository structure terms

**Example - closing a project:**
1. Goal: close project → HOWTO_GLOSSARY.md
2. Find `close project` howto → follow req
3. Req says: look up project type in stepping stones
4. Find project type (e.g., `exploration project`) → follow req
5. Req has extends: `blank project` → follow that req too
6. Now have full closure procedure

**Example - understanding a concept:**
1. Question: what is a work module? → STEPPING_STONES_GLOSSARY.md
2. Find `work module` → follow req
3. Req has extends: `module` → follow that req too
4. Now have full understanding

**Only grep/scan if:** Term genuinely not in any glossary (rare - consider adding it).

## Where to Find Things

**Current state:** `status/CURRENT.md` - active work, session entry point
**How we work:** `foundations/WOW.md` → references detail files
**What we're building:** `foundations/PRINCIPLES.md` → references detail files
**Partnership health:** `foundations/PARTNERSHIP.md` → current state, friction metric
**Platform design:** `design/DESIGN_REGISTER.md` → catalog of elements, `design/API_DESIGN.md` → API architecture
**Terminology:** `glossary/` - see Efficient Search section above
**Project status:** `projects/INDEX.md`
**Work queue:** `projects/BACKLOG.md`
**Chat captures:** `chats/` - informal work discussions
**CIP tracking:** `cips/CIP_REGISTER.md`
**Completed projects:** `projects/NN-*/` folders
**Lessons learned:** `projects/NN-*/LESSONS_LEARNED.md`
**Partnership reflections:** `projects/NN-*/PARTNERSHIP_REFLECTION*.md`

## Working with Claude Code

**Todo List Usage:**
- Use TodoWrite tool for **small to medium** lists only (never large lists)
- Purpose: Track progress through multi-step work, provide visibility to user
- When to use: Complex work that benefits from granular tracking (e.g., Project 03 closure scale)
- When NOT to use: Simple, straightforward execution - adds overhead without benefit
- This is internal guidance for AI assistant, not a methodology stepping stone

## Archive (Reference Only)

`archive/spl1-docs/` and `archive/spl1-spl-dev/` contain legacy spl1 materials. Reference when specific proven solutions are needed, but don't feel constrained by spl1's architecture.
