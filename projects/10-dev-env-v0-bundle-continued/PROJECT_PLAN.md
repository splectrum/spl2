# Project Plan

**Project:** 10 - Dev Env v0 Bundle Continued
**Type:** Exploration Project
**Created:** 2025-11-26

---

## Product Set

**Single Twin Product:** Dev Environment Bundle + Requirements

Iterative implementation picking from candidate list as needed.

## Candidate List

| Item | Category | Status | Notes |
|------|----------|--------|-------|
| spl/dev API | Core API | DONE | All methods: deploy, prepare, test, cycle, publish, upgrade |
| spl/runtime API | Core API | DONE | metastate schema, req complete |
| spl/request API | Core API | DONE | metastate schema, req complete |
| spl/pipeline API | Core API | | Event routing and handling |
| core.js strengthening | Library | | Core library functions |
| overlay.js strengthening | Library | | Overlay/extraction utilities |
| Arithmetic iterations 1.2-1.5 | Exercise | | Event router, error handling, middleware |
| Arithmetic iterations 2-4 | Exercise | | Operator precedence, nested expressions |
| Console v5 migration | API | | When foundation solid |

## Infrastructure Completed

| Item | Notes |
|------|-------|
| Self-hosting | Full spl/dev workflow via ./spl CLI |
| Module management | wm_* (work) → bm_spl (monolithic base) |
| Dual publish | Timestamped wm_* + bm_* artifacts |
| upgrade.js | Creates splectrum install from bundle |
| spl entry point | Shell wrapper + spl.mjs ES module |
| Runtime in record | cwd, splectrumDir, invokedFrom in headers |
| Type hierarchy update | state.avsc + metastate.avsc on branch nodes |
| API_NAMESPACE_MODEL.md | Design doc for properties + methods |

## Success Criteria

- Dev bundle implementation strengthened (library functions robust)
- Core Splectrum API infrastructure in place (spl/runtime, spl/pipeline)
- Ready for spl/bug API project (next in backlog)

## Approach

- Start from v0 template, clone to iterations
- Build what's needed for real API work
- Arithmetic exercises are tools, not goals
- Mix in items as encountered

---

**Last Updated:** 2025-11-26
