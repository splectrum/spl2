# Repo / Node / App Design

**Date:** 2025-11-30
**Status:** Design document - starting point for implementation
**Context:** Post Project 10, app unification discussion

---

## Overview

A simple, convention-based architecture where:
- **Repo** is the git repository containing code and data
- **Node** is the splectrum seat serving the repo
- **Apps** are functional units managing specific concerns

---

## Core Concept: Node as Seat

The node is a **seat** - a stable foundation serving its surroundings.

- One node per repo (not scattered nodes everywhere)
- Apps provide specialized functions from the seat
- The node serves projects, developers, integrations
- Centralized capability, not scattered infrastructure

```
repo/                          # Git repository
├── projects/                  # Data spots (managed by apps)
├── foundations/
├── design/
└── splectrum/                 # The node (seat)
    └── apps/                  # Functional units
```

---

## App Types

Two kinds of apps, distinguished by naming convention:

### Spot Apps
- Manage external data (repo folders)
- Named after the spot they manage
- Example: `apps/projects/` manages `repo/projects/`

### System Apps
- Internal node functions
- Prefixed with underscore
- Example: `apps/_boot/`, `apps/_dev/`, `apps/_ops/`

```
apps/
├── projects/      # spot app → manages ../projects/
├── foundations/   # spot app → manages ../foundations/
├── design/        # spot app → manages ../design/
├── root/          # spot app → manages repo root
├── _boot/         # system app (no spot)
├── _dev/          # system app (no spot)
├── _ops/          # system app (no spot)
└── _cli/          # system app (no spot)
```

**Convention:** Underscore prefix = internal/system, no spot binding.

---

## Bidirectional Naming Convention

The spot↔app binding works both directions:

### Outside-in (invoke from spot)

```
User invokes spl from projects/10-xxx/
→ Node detects invokedFrom
→ Walks up to find spot root (projects/)
→ Spot name = "projects"
→ Routes to apps/projects/
→ App receives:
    spotRoot: repo/projects/
    invokedFrom: repo/projects/10-xxx/
```

### Inside-in (invoke from node)

```
User at splectrum/, chooses app "projects"
→ App name = "projects"
→ Data root = repo/projects/ (if exists)
→ App works with that data root
```

**Same convention, both directions:**
```
spot folder name ←→ app name ←→ data root
```

---

## Constraints (Reasonable)

1. **Spots are repo root subfolders only** - no nested spots
2. **Root app manages repo root** - not subfolders (separation of concerns)
3. **App without matching spot** - internal only (system apps)
4. **Spot without matching app** - not managed by splectrum (yet)

---

## Location-Aware Routing

When `spl` is invoked:

1. Node resolves (finds `splectrum/`)
2. Records `invokedFrom` (where user invoked from)
3. Determines spot by walking up from `invokedFrom`
4. Routes to app with same name as spot
5. App receives `spotRoot` and `invokedFrom`

```javascript
// What the app receives
{
  spotRoot: '/path/to/repo/projects/',      // data working directory
  invokedFrom: '/path/to/repo/projects/10-xxx/',  // user context
  // ... rest of request
}
```

App works with `spotRoot` as its data root, has context from `invokedFrom`.

---

## App Structure

Each app (spot or system) follows the same pattern:

```
apps/[name]/
├── scripts/       # Freestyle implementation
├── modules/       # Formal implementation (graduated scripts)
├── config/        # App configuration
├── state/         # Persistent app state
└── session/       # Runtime (inbox/processing/outbox)
```

### Freestyle + Formal Integration

Apps contain both modes:
- **scripts/** for proving, iterating, testing
- **modules/** for stable, formalized code

Natural graduation: script → module (just move/structure the file)

### Self-Eval is Just Scripts

No special machinery. Scripts that test = self-eval.
Apps are natural self-eval builders.

---

## System Apps

### _boot
- Creates node structure from scratch
- Installs other apps
- Installs modules
- Self-updates

### _dev
- Development workflow
- Replaces dev bundle ceremony
- Works with overlay for safety

### _ops
- Operations (upgrade, rollback, status)
- Manages node health
- Version management

### _cli
- Interactive CLI
- Default for terminal use
- Routes to other apps based on context

---

## Node Install (From Scratch)

```
1. Create skeleton:  repo/splectrum/ (folders)
2. Install boot:     apps/_boot/
3. Boot installs:    other apps, modules
4. Done
```

Minimal bootstrap, boot app does the rest.

---

## Development Workflow (Simplified)

```
1. Work in app (spot or system)
2. Write scripts, iterate
3. Graduate to modules when stable
4. Test = run scripts
5. Done
```

No environments, no deploy cycle, no publish ceremony.
Clone = install. Structure emerges naturally.

---

## Evolution Path

Start with flat `apps/` folder. Can evolve to structured if needed:

```
# Future (if needed)
apps/
├── spots/         # spot apps
│   ├── projects/
│   └── foundations/
└── system/        # system apps
    ├── _boot/
    └── _dev/
```

The underscore convention provides separation without structure.
Restructure later without breaking naming conventions.

---

## Summary

| Concept | Description |
|---------|-------------|
| Node | Seat serving the repo (one per repo) |
| Spot | Repo root subfolder (data) |
| Spot App | Manages a spot (name = spot name) |
| System App | Internal function (underscore prefix) |
| Routing | Location-aware (invokedFrom → spot → app) |
| Data Root | Bidirectional: spot↔app↔data root |
| App Structure | scripts/ + modules/ (freestyle + formal) |

**Core principle:** Name IS the contract. Convention over configuration.
