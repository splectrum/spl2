# Current Status

**Last Updated:** 2025-11-29

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Session 7 in progress.** CLI pipeline and app framework.

**Completed this session:**
- Pre-request pipeline complete (spl/cli):
  - Record-first pattern with headers/value structure
  - `runtime.invokedFrom`, `runtime.platform.type` in headers
  - Mode detection, arg parsing, external file preloading
  - Internal vs external script detection (inside nodeRoot = library mode)
  - Error handling with FAF (sync) to `runtime/error/cli/`

- Entry point framework:
  - `lib/entryPoint.js` - framework for spl.mjs entry points
  - Apps provide `{name, help, handle}` in `app.mjs`
  - `spl.mjs` = thin shell, wires app to framework
  - Supports: global spl, direct --help, direct JSON, programmatic import

- cli-static app structure:
  - `apps/cli-static/spl.mjs` - entry point shell
  - `apps/cli-static/app.mjs` - name, help, handle
  - Hand-off from splectrum/spl.mjs working

- Core lib:
  - `lib/spl` at package level (`modules/bm_spl/spl/_lib/spl.js`)
  - FAF with `{ sync: true }` option for pre-exit writes

**Next:** Implement inbox/outbox pattern in cli-static handle()
- FAF to session inbox
- Session processes (dispatch to command/library/script)
- FAF to outbox
- App consumes and outputs to console

**Key docs:** (in `projects/10-dev-env-v0-bundle-continued/`)
- `DAILY_LOG.md` - Session 7 notes, task split, app architecture
- `NODE_STRUCTURE_DESIGN.md` - node structure, lib organization

**Key files:**
- `splectrum/spl.mjs` - CLI entry point
- `splectrum/lib/moduleBootstrap.js` - requireSpl, requireNonSpl
- `splectrum/lib/entryPoint.js` - app entry point framework
- `splectrum/modules/bm_spl/spl/_lib/spl.js` - core lib (FAF)
- `splectrum/modules/bm_spl/spl/cli/_lib/cli.js` - CLI lib
- `splectrum/apps/cli-static/spl.mjs` - app entry point
- `splectrum/apps/cli-static/app.mjs` - app implementation

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
