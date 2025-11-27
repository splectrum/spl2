# Current Status

**Last Updated:** 2025-11-27

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Session 6 in progress.** Global entry point implemented.

**Completed Session 6 (so far):**
- Global `spl` entry point with node resolution
- Three invocation modes: command, inline script, file script
- Node detection via `splectrum/package.json` with `name: "splectrum"`
- Added to PATH (`~/.bashrc`)
- WYSIWI principle documented

**Working commands (global now!):**
```bash
# From anywhere - resolves nearest splectrum node
spl spl/dev/cycle --name=env-123          # Command mode
spl "console.log(runtime.nodeRoot)"       # Inline script mode
spl ./script.js --arg=value               # File script mode

# From dev bundle - resolves to dev bundle node
cd projects/10-.../dev/v0
spl spl/dev/deploy                        # Uses dev bundle node

# From repo root - resolves to root node
cd /home/herma/splectrum/spl2
spl spl/dev/deploy                        # Uses root node
```

**Known issues (still to address):**
- Clone selfeval disabled (needs proper runtime context)
- Event records not visible (handler shortcut)
- Handcrafted records in tests bypass runtime

**Implementation plan (Session 6):**
1. ~~Entry point with node resolution~~ DONE
2. Script library - NEXT
3. Event persistence
4. Request record creation/expansion
5. Dev mode detection and implementation
6. Selfeval refactoring
7. Further code refactoring

**Key docs:**
- `SESSION_6_DISCUSSION.md` - WYSIWI principle, implementation plan
- `ENTRY_POINT_DESIGN.md` - Entry point design

**Key files:**
- `spl` - repo root entry point
- `splectrum/` - root node
- `splectrum/ops/` - sidecar node
- `dev/v0/splectrum/` - dev bundle node
- `SPLECTRUM_NODE_DESIGN.md` - node architecture
- `ENTRY_POINT_DESIGN.md` - entry point design (new)
- `DAILY_LOG.md` - session notes

---

## Model Dev Environment

**Location:** `projects/10-dev-env-v0-bundle-continued/dev/v0/`

The current development bundle. Contains working spl/dev and spl/ops implementations.

---

## Recent Completions

| Project | Completed | Key Outcomes |
|---------|-----------|--------------|
| 09 - Console v5 Stream Native | 2025-11-26 | v0 dev env template, type hierarchy, lib resolution, selfeval inheritance, overlay patterns. Pivoted from Console migration to dev env foundation. |
| 08 - Dev Environment API | 2025-11-20 | 4-level module structure, executable selfeval pattern, test runner, delegation stepping stone |
| 07 - Console API Exploration | 2025-11-19 | v7 wrapper API, 3 design docs, status/ spot, CIP-015 |
| 06 - Glossary Term Requirements | 2025-11-18 | 67+ term reqs, unified glossary structure |

---

## Session Entry Points

**Starting a new session?**

1. Read this file for current context
2. Check `projects/INDEX.md` for full project status
3. Check `projects/BACKLOG.md` for work queue (top item = next project)

**Starting a new project?**

Follow `create project` howto in HOWTO_GLOSSARY.md

**Looking up SPL2 concepts?**

MANDATORY: Use glossaries as index - see CLAUDE.md "Glossary-First Lookup" section.
- Understanding → STEPPING_STONES_GLOSSARY.md
- Action → HOWTO_GLOSSARY.md

---

## Notes

This file provides session context without requiring CLAUDE.md updates. Update when project status changes significantly.
