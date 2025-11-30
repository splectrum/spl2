# Dev Environment Pipeline Completion

**Priority:** High
**Dependencies:** Project 10 (Dev Env v0 Bundle Continued)
**Type:** Exploration Project

---

## Summary

Implement the repo/node/app architecture, migrating dev bundle and ops infrastructure into system apps. Fuse freestyle and formal implementation modes. The repo + splectrum node becomes a solid unit.

## Vision

**Reference:** [Repo/Node/App Design](../chats/immutables/repo_node_app_design_2025-11-30.md)

Key concepts:
- Node as seat serving repo (one node, many apps)
- Spot apps manage external data (name = spot folder name)
- System apps for internal functions (underscore prefix: _boot, _dev, _ops, _cli)
- Bidirectional naming convention (spot ↔ app ↔ data root)
- Location-aware routing (invokedFrom → spot → app)
- Apps contain scripts/ + modules/ (freestyle + formal together)

## Scope

### App Architecture Implementation
- Establish apps/ folder structure
- Implement spot app pattern (data root = repo/[spot]/)
- Implement system app pattern (underscore prefix)
- Location-aware routing in entry point
- Bidirectional spot↔app binding

### System App Migration
- `_dev` - migrate dev bundle functionality into system app
- `_ops` - migrate ops sidecar into system app
- `_cli` - evolve cli-static into system app
- `_boot` - create bootstrap app (install/manage)

### Spot Apps (Initial)
- `projects` - manages projects/ spot
- `root` - manages repo root

### Pipeline Integration
- Session pipeline (inbox → processing → outbox) within apps
- Proper multilayer pipeline patterns
- Event routing and handling

### Code Migration
- Upgrade methods to new pattern
- Remove deprecated infrastructure
- Consolidate to single node

## Success Criteria

- App architecture working (spot + system apps)
- Dev bundle functionality in `_dev` app
- Ops functionality in `_ops` app
- Location-aware routing functional
- Single node serving entire repo
- Freestyle + formal modes integrated in apps

## Context

Project 10 delivered:
- Self-hosting dev cycle
- CLI pipeline with unified request model
- Session pipeline (watcher-based prototype)
- Free scripting pattern
- App concept prototyped (cli-static)

Design discussions captured:
- [App Unification Discussion](../chats/immutables/app_unification_discussion_2025-11-30.md)
- [Repo/Node/App Design](../chats/immutables/repo_node_app_design_2025-11-30.md)

---

**Created:** 2025-11-30
**Updated:** 2025-11-30 - Incorporated app architecture vision
