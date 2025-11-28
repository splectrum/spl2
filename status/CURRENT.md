# Current Status

**Last Updated:** 2025-11-28

---

## Active Project

**Project 10: Dev Env v0 Bundle Continued**

- Type: Exploration Project
- Status: Execution phase
- Location: `projects/10-dev-env-v0-bundle-continued/`

### Current Work

**Session 6 continued.** Request processing pipeline with FAF and consumer trail implemented.

**Completed Session 6:**
- Global `spl` entry point with node resolution
- Four invocation modes: command, library script, file script, inline script
- Request record structure (headers = metadata, value = state)
- Consumer trail for boundary crossings
- FAF (Fire and Forget) pipeline with atomic writes and dedupe
- Session structure: inbox/processing/outbox model
- App → Session handoff via FAF to inbox
- Response lifecycle: `timeReceived` and `timeResponded` timestamps
- App metastate (`appModuleOverride`) design
- Module resolution with app override (app stack → node stack)
- Bootstrap layer: `lib/moduleBootstrap.js` with `requireSpl()`
- POC/Pilot/Production implementation levels
- Development pipeline: creative coding → work module → formal implementation
- Script/module interface alignment (same record interface)

**Current flow:**
```
CLI → Entry point → builds record → App
  → FAF to app/requests/ (audit)
  → FAF to session/inbox/
  → Consumer picks from inbox → processing → outbox
  → App picks from outbox (stamps consumer)
  → timeResponded stamped
  → FAF to app/requests/*.response.json
  → Response to CLI
```

**Key structures:**
```
splectrum/
├── lib/moduleBootstrap.js     # Bootstrap layer (requireSpl)
├── apps/cli-static/
│   ├── scripts/faf.js         # POC FAF implementation
│   └── requests/              # Request/response audit trail
└── runtime/cli-static/
    └── requests/
        ├── inbox/             # Incoming from app
        ├── processing/        # Being worked on
        ├── outbox/            # Complete, waiting for app
        └── scripts/           # Consumer handlers
```

**Next steps:**
1. Test `requireSpl` with test script (needs script runner update for ES modules)
2. Update script runner to use record interface (align with modules)
3. Consider FAF as lib function
4. Switch existing code to use `requireSpl`

**Key design decisions this session:**
- Splectrum implementation always async (FAF). Sync is wrapper.
- Consumer trail tracks boundary crossings (scales to P2P)
- Data is the audit trail (happy path + exception visibility)
- Scripts and modules share interface (freedom is structure, not interface)
- Creative coding → formalize is clean handoff (can be autonomous)

**Key docs:**
- `EVENT_STORAGE_DESIGN.md` - Request API, consumer trail, FAF, visibility
- `NODE_STRUCTURE_DESIGN.md` - Module resolution, session structure, bootstrap
- `IMPLEMENTATION_APPROACH_DESIGN.md` - POC/Pilot/Production, pipeline, script alignment

**Key files:**
- `splectrum/lib/moduleBootstrap.js` - requireSpl (new)
- `splectrum/apps/cli-static/` - POC app with FAF
- `splectrum/runtime/cli-static/requests/` - Session with inbox/outbox

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
