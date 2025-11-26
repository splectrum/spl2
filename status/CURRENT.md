# Current Status

**Last Updated:** 2025-11-26

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Self-hosting achieved.** Full spl/dev workflow working via CLI.

**Completed:**
- All spl/dev methods: deploy, prepare, test, cycle, publish, upgrade
- Module management model: wm_* (work) → bm_spl (base, monolithic)
- Dual publish: timestamped wm_* + bm_* artifacts
- 17 selfevals passing

**Working workflow:**
```bash
./spl spl/dev/deploy                      # Create environment
./spl spl/dev/cycle --name=env-*          # prepare + test
./spl spl/dev/publish --name=env-*        # Create artifacts
# Manual: cp -r bm_spl-{ts} bm_spl        # Promote
./spl spl/dev/upgrade                     # Install to splectrum/
```

**In Progress:**
- Discussion: repo-wide `./spl` entry point

**Key files:**
- `dev/v0/spl` - working entry point
- `dev/v0/splectrum/modules/bm_spl/` - deployed base module
- `dev/v0/environments/env-1764151558962/` - development environment
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
