# CLAUDE.md - SPL2 Project Navigation

## Project Purpose

SPL2 is a platform for AI to create and manage software solutions with a focus on P2P applications. Clean restart from spl1 - simplified, AI-optimized, with maximum freedom of implementation.

## Start Here (New Session)

**Understand how we work:**
- Read `foundations/WOW.md` - Philosophy, PRINCE2, TDC methodologies
- Read `foundations/PRINCIPLES.md` - What SPL2 is, design principles
- Read `foundations/PARTNERSHIP.md` - Partnership health, collaboration patterns, friction metric

**Understand current state:**
- Read `projects/INDEX.md` - Completed projects and current status (3 complete, 1 active)
- Read `projects/BACKLOG.md` - Next work to do (10+ projects with priorities)

**Everything else references from these foundation documents.**

## Repository Structure

```
spl2/
├── foundations/          # How we work (WOW) and what we build (PRINCIPLES)
│   ├── WOW.md           # References versioned detail files in projects/
│   ├── PRINCIPLES.md    # References versioned detail files in projects/
│   ├── PARTNERSHIP.md   # Partnership health, collaboration patterns (headline)
│   └── *_CHANGELOG.md   # Track changes to mutable foundation documents
├── chats/               # Informal collaborative work captures
│   ├── YYYY-MM-DD_*.md  # Chat captures (sufficient and complete pattern)
│   ├── CHAT_REQUIREMENTS_v1.0.0.md  # How chat capture works
│   └── immutables/      # Adhoc-created versioned artifacts (requirements, designs)
├── glossary/            # Context-specific terminology
│   ├── DSL_GLOSSARY.md  # Runtime/API vocabulary (mutable, with CHANGELOG)
│   ├── STEPPING_STONES_GLOSSARY.md  # Foundation concepts (mutable, with CHANGELOG)
│   ├── SPOTS_GLOSSARY.md  # Repository structure terms (mutable, with CHANGELOG)
│   └── *_CHANGELOG.md   # Track changes to glossaries
├── projects/            # All formal project work
│   ├── INDEX.md         # Project status register
│   ├── BACKLOG.md       # Work to do (with priorities/dependencies)
│   ├── backlog/         # Individual backlog item details
│   ├── project-types/   # Project type requirements (Explorative, etc.)
│   ├── 01-*/            # Completed: Preliminary to Workplan
│   ├── 02-*/            # Completed: Initial Workplan
│   ├── 03-*/            # Completed: Runtime Structure Hello World
│   └── 04-*/            # Active: Bare Runtime Hello World
├── archive/             # Reference: spl1 materials (legacy)
├── CLAUDE.md            # This file - navigation guide
└── README.md            # Project overview
```

## How Documentation Works

**Mutable-immutable dualism:**
- **Mutable entry points** (foundations/, glossary/) - Always "current", unversioned names, protected by CHANGELOGs
- **Immutable artifacts** (projects/, chats/immutables/) - Versioned, never change, referenceable
- Entry points branch to standalone immutables in version jackets

**Pattern:**
- Foundations (WOW.md, PRINCIPLES.md, PARTNERSHIP.md) are **headlines** - concise, mutable, with CHANGELOGs
- Detail files live in project folders - **versioned immutables** (e.g., Philosophy_v1.1.0.md)
- Glossaries (DSL, Stepping Stones, Spots) are **mutable** - always current, with CHANGELOGs tracking evolution
- Requirements are **immutable** - versioned in projects/ (formal work) or chats/immutables/ (adhoc work)
- All artifacts reference their requirements document (first line)

**Example:** WOW.md (mutable) references Philosophy_v1.1.0.md (immutable) - that versioned file lives in the project folder where it was created/evolved.

## Key Patterns Established

**Stepping stones (navigational concepts):**
- Journey metaphor: patterns encountered repeatedly throughout work
- Same stones appear at different decision points - choose which to step on based on context
- See STEPPING_STONES_GLOSSARY.md for full list (minimal and complete, artifact-to-requirements pinning, duality pattern, fire and forget, sufficient and complete, twin pair methodology, etc.)

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

## Where to Find Things

**How we work:** `foundations/WOW.md` → references detail files
**What we're building:** `foundations/PRINCIPLES.md` → references detail files
**Partnership health:** `foundations/PARTNERSHIP.md` → current state, friction metric, patches
**Terminology:** `glossary/` - DSL_GLOSSARY.md (runtime/API terms), STEPPING_STONES_GLOSSARY.md (foundation concepts), SPOTS_GLOSSARY.md (repository structure)
**Chat captures:** `chats/` - informal collaborative work discussions, discoveries, decisions
**Adhoc requirements:** `chats/immutables/` - versioned artifacts created during informal work
**Project status:** `projects/INDEX.md` (3 complete, 1 active)
**Next work:** `projects/BACKLOG.md` (11 projects now, including glossary-term-requirements)
**Completed project artifacts:** `projects/01-*/`, `projects/02-*/`, `projects/03-*/`
**Active project:** `projects/04-bare-runtime-hello-world/`
**Lessons learned:** `projects/XX-*/LESSONS_LEARNED.md` in each project folder
**Partnership reflections:** `projects/XX-*/PARTNERSHIP_REFLECTION*.md` at project closures
**Project types:** `projects/project-types/` (Explorative, etc.)
**Detailed methodology:** Follow references from WOW.md to versioned files

## Archive (Reference Only)

`archive/spl1-docs/` and `archive/spl1-spl-dev/` contain legacy spl1 materials. Reference when specific proven solutions are needed, but don't feel constrained by spl1's architecture.
