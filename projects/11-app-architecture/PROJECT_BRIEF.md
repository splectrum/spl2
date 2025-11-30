**Req:** projects/08-dev-environment-api/exploration_project_v1.1.0.md

# Project 11: App Architecture

## Purpose

Implement the repo/node/app architecture, migrating dev bundle and ops infrastructure into system apps. Fuse freestyle and formal implementation modes. The repo + splectrum node becomes a solid unit.

## Design References

- [Repo/Node/App Design](../../chats/immutables/repo_node_app_design_2025-11-30.md) - Core architecture
- [App Unification Discussion](../../chats/immutables/app_unification_discussion_2025-11-30.md) - Background discussion

## Vision

**Node as seat:** One node per repo, serving its surroundings through apps.

**Key concepts:**
- Spot apps manage external data (name = spot folder name)
- System apps for internal functions (underscore prefix: _boot, _dev, _ops, _cli)
- Bidirectional naming convention (spot ↔ app ↔ data root)
- Location-aware routing (invokedFrom → spot → app)
- Apps contain scripts/ + modules/ (freestyle + formal together)

## Products

### 1. App Architecture Core
**Description:** Foundation for spot and system apps.
**Quality Criteria:**
- apps/ folder structure established
- App pattern defined (scripts/, modules/, config/, state/, session/)
- Spot app routing working (invokedFrom → spot detection → app)
- System app pattern working (underscore prefix, no spot binding)

### 2. System App: _cli
**Description:** Evolve cli-static into _cli system app.
**Quality Criteria:**
- Migrated from apps/cli-static/ to apps/_cli/
- Location-aware routing functional
- Entry point integration complete

### 3. System App: _dev
**Description:** Dev bundle functionality as system app.
**Quality Criteria:**
- Development workflow functional (scripts first, graduate to modules)
- No separate environment ceremony needed
- Self-contained development within app

### 4. System App: _ops
**Description:** Ops sidecar functionality as system app.
**Quality Criteria:**
- Upgrade/rollback/status functional
- Migrated from splectrum/ops/ sidecar
- Integrated into single node

### 5. Spot App: projects
**Description:** First spot app managing projects/ folder.
**Quality Criteria:**
- Data root = repo/projects/
- Routing from projects/ subfolder works
- Demonstrates spot app pattern

### 6. Single Node Consolidation
**Description:** Remove scattered infrastructure, consolidate to one node.
**Quality Criteria:**
- Ops sidecar removed (functionality in _ops)
- Dev bundles simplified (use _dev app)
- One splectrum/ serving entire repo

## Success Criteria

- App architecture working (spot + system apps)
- Location-aware routing functional
- Dev bundle functionality in _dev app
- Ops functionality in _ops app
- Single node serving entire repo
- Freestyle + formal modes integrated in apps

## Scope

**In scope:**
- App architecture implementation
- System apps (_cli, _dev, _ops)
- Initial spot app (projects)
- Entry point routing
- Migration of existing functionality

**Out of scope:**
- _boot app (future - node from scratch)
- All spot apps (just projects for now)
- P2P/multi-node scenarios

## Approach

Exploration project with twin pair methodology. High collaboration - discovering the right patterns through implementation.

**Phased:**
1. App architecture core (patterns, routing)
2. _cli migration (evolve cli-static)
3. _dev creation (dev workflow as app)
4. _ops migration (ops sidecar into app)
5. projects spot app (demonstrate pattern)
6. Consolidation (remove old infrastructure)

## Constraints

- Maintain working system throughout migration
- Don't break existing spl commands
- Incremental migration, not big bang
