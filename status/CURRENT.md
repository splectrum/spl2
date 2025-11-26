# Current Status

**Last Updated:** 2025-11-26

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

Migrating dev bundle scripts to spl/dev API methods for self-hosting.

**Completed:**
- upgrade.js and spl entry point (splectrum install infrastructure)
- spl/runtime API (metastate schema, req)
- spl/request API (metastate schema, req)
- API_NAMESPACE_MODEL.md design doc
- Type hierarchy update (state.avsc + metastate.avsc on branch nodes)
- PROJECT_PLAN.md created
- Full req audit for all work module nodes
- spl/dev/deploy method implemented (in dev environment)

**In Progress:**
- Dev environment deployed: env-1764151558962
- Implementing spl/dev methods: deploy (done), prepare, test, cycle, publish, destroy, upgrade

**Blocking:**
- prepare.js hardcodes `work_module`, needs update to find wm_* pattern

**Next:**
1. Fix prepare.js to find wm_* dynamically
2. Continue spl/dev methods in environment
3. Publish back, upgrade, test

**Key files:**
- `dev/v0/environments/env-1764151558962/` - active dev environment
- `dev/v0/implementation/wm_spl_dev/` - source (do not edit directly)
- `PROJECT_PLAN.md` - candidate list and status
- `API_NAMESPACE_MODEL.md` - design doc
- `DAILY_LOG.md` - session notes

---

## Model Dev Environment

**Location:** `projects/09-console-v5-stream-native/dev/v0/`

The always-current, portable dev environment template. Clone this when creating new projects.

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
