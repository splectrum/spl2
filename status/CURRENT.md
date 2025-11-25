# Current Status

**Last Updated:** 2025-11-25

---

## Active Project

**Project 09: Console v5 Stream Native** (Initiated 2025-11-21)

Convert Console API v4 to stream-native execution. Discover event model, handler patterns, and self-eval requirements through real implementation.

**Current Phase:** Product Twin 1 - Building Blocks Exploration
**Stage:** Hierarchy overlay and selfeval inheritance complete

**Status:** Full dev cycle with inherited selfevals working

**See:**
- `projects/09-console-v5-stream-native/SESSION_RESTART.md` - Session restart guide
- `projects/09-console-v5-stream-native/DAILY_LOG.md` - Detailed progress
- `projects/09-console-v5-stream-native/dev/v0/` - Dev environment template

---

## Recent Completions

| Project | Completed | Key Outcomes |
|---------|-----------|--------------|
| 08 - Dev Environment API | 2025-11-20 | 4-level module structure, executable selfeval pattern, test runner, delegation stepping stone |
| 07 - Console API Exploration | 2025-11-19 | v7 wrapper API, 3 design docs, status/ spot, CIP-015 |
| 06 - Glossary Term Requirements | 2025-11-18 | 67+ term reqs, unified glossary structure |
| 05 - Foundation Update | 2025-11-17 | Headlines format, design/ spot, friction as KPI |

---

## Session 8 Progress (2025-11-25)

**Hierarchy Overlay:**
- prepare.js builds hierarchy.json with layer sequences per node
- Dynamic: reads type declarations at runtime, no hardcoded structure
- Layer order: work_module ancestors → type chain

**Selfeval Inheritance:**
- test.js collects selfevals from all layers using overlay
- Same-named selfevals follow overlay (lower layer wins)
- module_node selfeval validates folder structure on all nodes

**Scripts in v0/v1.1:**
| Script | Purpose |
|--------|---------|
| `deploy.js` | Create env from implementation |
| `prepare.js` | Build hierarchy.json |
| `test.js` | Run selfevals from all layers |
| `cycle.js` | Convenience: prepare + test |
| `publish.js` | Publish with type flattening |
| `destroy.js` | Clean up |
| `clone.js` | Create new iteration |

---

## Session Entry Points

**Starting a new session?**

1. Read this file for current context
2. Check `projects/INDEX.md` for full project status
3. Check `projects/BACKLOG.md` for work queue
4. Review active project's SESSION_RESTART.md for detailed state

**Looking up SPL2 concepts?**

Use glossaries as index - see CLAUDE.md "Efficient Search" section.

---

## Notes

This file provides session context without requiring CLAUDE.md updates. Update when project status changes significantly.
