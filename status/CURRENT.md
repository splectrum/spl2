# Current Status

**Last Updated:** 2025-11-30

---

## Active Project

**Project 11: App Architecture**

- Type: Exploration Project
- Status: **Created - ready for initiation**
- Location: `projects/11-app-architecture/`

### Vision

Implement repo/node/app architecture:
- Node as seat serving repo (one node, many apps)
- Spot apps manage external data (name = spot folder)
- System apps for internal functions (underscore prefix: _boot, _dev, _ops, _cli)
- Location-aware routing (invokedFrom → spot → app)
- Freestyle + formal in same app

### Products

1. App Architecture Core
2. _cli (evolved from cli-static)
3. _dev (dev bundle as app)
4. _ops (ops sidecar as app)
5. projects spot app
6. Single node consolidation

### Design References

- `chats/immutables/repo_node_app_design_2025-11-30.md`
- `chats/immutables/app_unification_discussion_2025-11-30.md`

---

## Model Dev Environment

**Location:** `projects/10-dev-env-v0-bundle-continued/dev/v0/`

The current development bundle. Contains working spl/dev and spl/ops implementations. Will be migrated to _dev app during this project.

---

## Recent Completions

| Project | Completed | Key Outcomes |
|---------|-----------|--------------|
| 10 - Dev Env v0 Bundle Continued | 2025-11-30 | Self-hosting dev cycle, spl/dev + spl/ops APIs, CLI pipeline, unified scripting, 6 design docs |
| 09 - Console v5 Stream Native | 2025-11-26 | v0 dev env template, type hierarchy, lib resolution, selfeval inheritance |
| 08 - Dev Environment API | 2025-11-20 | 4-level module structure, executable selfeval pattern, test runner |

---

## Session Entry Points

**Starting a new session?**

1. Read this file for current context
2. Check `projects/INDEX.md` for full project status
3. Check `projects/BACKLOG.md` for work queue

**Looking up SPL2 concepts?**

MANDATORY: Use glossaries as index - see CLAUDE.md "Glossary-First Lookup" section.
- Understanding → STEPPING_STONES_GLOSSARY.md
- Action → HOWTO_GLOSSARY.md

---

## Notes

This file provides session context without requiring CLAUDE.md updates. Update when project status changes significantly.
