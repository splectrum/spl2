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

## SPL Commands

Run `spl get-started` for quick reference of common commands.
