# Dev Environment Pipeline Completion

**Priority:** High
**Dependencies:** Project 10 (Dev Env v0 Bundle Continued)
**Type:** Exploration Project

---

## Summary

Complete the pipeline infrastructure and code migration started in Project 10. Session 9 established watcher-based session pipeline as prototype; this project formalizes and extends it.

## Scope

### Pipeline Formalization
- Proper multilayer pipeline (spl/pipeline API)
- Event routing and handling patterns
- Build on watcher structure from Project 10 Session 9

### Library Strengthening
- overlay.js improvements (extraction, layer handling)
- spl.js library extensions as needed

### Code Migration
- Upgrade spl/dev methods to new pattern (no static lib/core.js imports)
- Upgrade spl/ops methods to new pattern
- Remove deprecated core.js
- Upgrade all splectrum nodes with new module versions

### Optional
- Arithmetic iterations (if useful for pipeline validation)
- Console v5 migration (when foundation solid)

## Success Criteria

- spl/pipeline API defined and implemented
- All spl/dev and spl/ops methods use new pattern
- Splectrum nodes upgraded
- Ready for spl/bug API project

## Context

Project 10 delivered:
- Dev environment bundle (v0 template)
- spl/dev API (deploy, prepare, test, cycle, publish, upgrade)
- CLI pipeline with unified request model
- Session pipeline (watcher-based prototype)
- spl.js library (faf, error handling, I/O helpers)
- Method execution pathway (record, spl, requireSpl, requireNonSpl signature)
- Free scripting pattern for rapid prototyping

---

**Created:** 2025-11-30
