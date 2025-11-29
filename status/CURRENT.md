# Current Status

**Last Updated:** 2025-11-29

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Session 7 in progress.** CLI pipeline restructure with record-first pattern.

**Completed this session:**
- Fixed path references in foundation docs (proper `folder/file.md` format)
- Extracted CLI utilities to `lib/cli.js` with bound pattern
- Record-first pattern: create Kafka record at entry, all functions operate on record
- `requireSpl(uri, record)` - single function for lib binding
- `cli.validate()` + `cli.handleError()` - validation with console-friendly output
- spl.mjs now thin: record creation + requireSpl + flow

**Current pattern:**
```javascript
// spl.mjs
import { requireSpl } from './lib/moduleBootstrap.js'

const record = {
  headers: { spl: { request: {...}, runtime: {...} } },
  value: { argv, cwd, mode, input, method, error... }
}

const cli = requireSpl('lib/cli', record)

cli.resolveNode()
if (!cli.validate()) cli.handleError()
cli.detectMode()
cli.parseArgs()
// dispatch...
```

**Bound pattern:**
- `cli.js` exports `create(record)` returning bound object
- Methods read/write record internally
- Caller doesn't know property paths
- Same pattern for all libs (cli, core, etc.)

**Next steps:**
1. Add `requireNonSpl(moduleName)` skeleton for platform externals
2. Add module resolution to requireSpl (for spl/dev/cycle style paths)
3. Implement dispatch and execution handlers
4. Add FAF before handleError exits
5. Later: platform.js switch logic in requireNonSpl

**Key design decisions:**
- Record created first thing (all input captured)
- `headers` = public metadata (flows downstream), `value` = internal state
- spl/cli extends spl/runtime conceptually
- Free style (lib/) and formal (modules/) share bound pattern
- `requireSpl` for splectrum, `requireNonSpl` for platform externals

**Key docs:** (in `projects/10-dev-env-v0-bundle-continued/`)
- `NODE_STRUCTURE_DESIGN.md` - lib/ organization, CLI record pattern, bound pattern

**Key files:**
- `splectrum/spl.mjs` - thin entry point
- `splectrum/lib/moduleBootstrap.js` - requireSpl
- `splectrum/lib/cli.js` - CLI bound object

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
