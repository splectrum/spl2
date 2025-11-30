# Current Status

**Last Updated:** 2025-11-30

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Session 8.** Unified request model and script execution.

**Completed this session:**

- Unified request model:
  - Transformation moved to spl.mjs (CLI-specific stays in entry point)
  - App receives clean request with `method`, `input`, optional `script`
  - Three dispatch types: command (`spl/dev/cycle`), library (`/path.js`), inline (`spl/script/inline`)
  - Input AVRO-ready: named args + positional as `"0"`, `"1"` (numeric keys)
  - Consumer metadata in `headers.spl.consumer` with `sourcePath`

- Script wrapper design:
  - Same bootstrap as formal implementations + convenience + freedom
  - Provides: `record`, `spl` (pre-loaded), `requireSpl`, `requireNonSpl`
  - Scripts can use splectrum patterns AND non-splectrum (direct imports, npm)
  - Uniform interface for inline and library scripts
  - Code moves freely: inline → library → method

- Script execution working:
  - Inline: `spl "/**/spl.output({ hello: 'world' })"`
  - Library: `spl test-interface --foo=bar`
  - Both use same wrapAndExecute with full bootstrap

- Testing insight:
  - Scripting environment ideal for selfevals
  - Full record access, set up test cases, partial loading
  - Same bootstrap as production
  - Selfevals as library scripts in `_selfevals/` locations

**Remaining:**
- Method execution (module dispatch)
- Session logic (inbox → processing → outbox pipeline)

**Key docs:** (in `projects/10-dev-env-v0-bundle-continued/`)
- `CONSUMER_DESIGN.md` - consumer pattern, transient/persistent
- `DAILY_LOG.md` - Session 8 notes on unified request model, script wrapper design

**Key files:**
- `splectrum/spl.mjs` - CLI entry point, unified request transformation
- `splectrum/apps/cli-static/app.mjs` - direct execution, wrapAndExecute
- `splectrum/modules/bm_spl/spl/_lib/spl.js` - input(), output() helpers
- `splectrum/scripts/test-interface.js` - example script with full interface

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
