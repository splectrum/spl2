# Current Status

**Last Updated:** 2025-11-26

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Splectrum node deployment complete.** Root node and sidecar installed.

**Completed this session:**
- Symlink version pattern in `spl/dev/upgrade` (keeps last 5 versions)
- Root node installed at `spl2/splectrum/`
- Sidecar installed at `spl2/splectrum/ops/`
- spl/ops API: status, list, upgrade, rollback
- Entry point design doc (ENTRY_POINT_DESIGN.md)

**Working commands:**
```bash
# From dev bundle
./spl spl/dev/deploy                      # Create environment
./spl spl/dev/cycle --name=env-*          # prepare + test
./spl spl/dev/publish --name=env-*        # Create artifacts
./spl spl/dev/upgrade                     # Install to splectrum/

# From repo root (sidecar)
./splectrum/ops/spl spl/ops/status        # Show root node status
./splectrum/ops/spl spl/ops/list          # List versions
./splectrum/ops/spl spl/ops/upgrade --candidate=path/to/bm_spl-*
./splectrum/ops/spl spl/ops/rollback      # Revert to previous
```

**Known issues (need review):**
- Clone selfeval disabled (needs proper runtime context)
- Event records not visible (handler shortcut)
- Handcrafted records in tests bypass runtime

**In Progress:**
- Entry point design: triple mode (CLI, inline script, file)
- Node resolution (find nearest splectrum/)
- Script library (scripts/ folder with resolution)
- Interactive vs detached mode

**Next session:**
- Review and fix selfeval/runtime issues
- Implement entry point design
- Consider interactive mode for implementation workflow

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
