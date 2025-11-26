**Requirements:** projects/08-dev-environment-api/exploration_project_v1.1.0.md

# Project 10: Dev Env v0 Bundle Continued

## Purpose

Continue development of the v0 dev environment bundle. Build core APIs and methods, strengthen library implementation, and complete deferred items from Project 09.

## Background

Project 09 pivoted from Console v5 migration to establishing foundational patterns:
- v0 template with full dev cycle (deploy → prepare → test → publish → destroy → clone)
- Type hierarchy design (module_node as base, types/ folder)
- Overlay + extraction patterns (selectFile, collectAll)
- Selfeval inheritance system
- Library resolution (3-layer: node_modules → lib/ symlinks → module _lib/)
- Event record structure (Kafka-style headers with API namespacing)

## Products

**Single Twin Product:** Dev Environment Bundle + Requirements

Iterative implementation picking from candidate list as needed. Mix in items as encountered.

### Candidate List

| Item | Category | Notes |
|------|----------|-------|
| spl/runtime API | Core API | Runtime state management |
| spl/pipeline API | Core API | Event routing and handling |
| core.js strengthening | Library | Core library functions |
| overlay.js strengthening | Library | Overlay/extraction utilities |
| Arithmetic iterations 1.2-1.5 | Exercise | Event router, error handling, middleware |
| Arithmetic iterations 2-4 | Exercise | Operator precedence, nested expressions |
| Console v5 migration | API | When foundation solid |

## Success Criteria

- Dev bundle implementation strengthened (library functions robust)
- Core Splectrum API infrastructure in place (spl/runtime, spl/pipeline)
- Ready for spl/bug API project (next in backlog)

## Constraints

- Start from v0 template, clone to iterations
- Build what's needed for real API work
- Arithmetic exercises are tools, not goals

## Key Files

| Location | Purpose |
|----------|---------|
| `projects/10-dev-env-v0-bundle-continued/dev/v0/` | Working dev environment |
| `projects/09-console-v5-stream-native/TYPE_HIERARCHY_OVERLAY_DESIGN.md` | Architecture roadmap |
| `projects/09-console-v5-stream-native/LIB_RESOLUTION_PATTERN.md` | Lib resolution design |
| `projects/09-console-v5-stream-native/OVERLAY_EXTRACTION_PATTERN.md` | Overlay pattern |
