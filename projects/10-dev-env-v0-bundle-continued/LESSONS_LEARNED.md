# Lessons Learned

## Methodology

### Friction as Catalyst

The dev bundle workflow (deploy → environment → cycle → publish) felt like overhead during exploration. Rather than forcing discipline, we recognized this as a design signal. The friction led to:

1. **Interactive mode discovery** - Working directly in `implementation/` without deploying
2. **Free scripting integration** - Scripts as first-class citizens alongside formal methods
3. **App concept prototype** - cli-static as first app within splectrum architecture

**Lesson:** Don't fight the workflow - if it feels wrong, the design needs adjustment. Friction points to opportunity.

### Exploring vs Implementing

Two distinct modes emerged:

| Mode | Characteristics | Appropriate Workflow |
|------|-----------------|---------------------|
| Implementing from spec | Structure defined, requirements clear | Deploy/cycle/publish (verification against spec) |
| Interactive exploration | Discovering design through implementation | Direct work in implementation/ (structure evolves) |

The original workflow assumed implementing mode. Exploration needed something different.

### Record-First Pattern

Moving record creation to entry point (spl.mjs) clarified responsibilities:
- CLI-specific logic stays in entry point
- App receives clean request record
- Same record evolves through pipeline (not new records created)
- FAF captures snapshots = event sourcing naturally

## Architecture

### Unified Request Model

Three execution modes unified under single dispatch:

| Mode | method field | Notes |
|------|--------------|-------|
| Command | `spl/dev/cycle` | Module method |
| Library | `/absolute/path.js` | Script file |
| Inline | `spl/script/inline` | Code in request.script |

All three share: same record structure, same bootstrap (requireSpl/requireNonSpl), same output pattern.

### Script Wrapper Design

**Principle:** Same bootstrap as formal implementations + convenience + freedom.

Scripts get:
- `record` - the request record
- `spl` - pre-loaded lib/spl (convenience)
- `requireSpl` - load splectrum libs
- `requireNonSpl` - load platform modules

Code moves freely: inline → library script → formal method. No lock-in.

### App as First-Class Concept

cli-static established the app pattern:
- `spl.mjs` - external entry point (thin, standard)
- `app.mjs` - implementation (name, help, handle)
- Session pipeline (inbox → processing → outbox)
- Sync/async bridge (external sync, internal async)

Apps extend spl/app base (future), add specific methods, manage their own state.

### Consumer Pattern

Two consumer types identified:
1. **Persistent** - long-running, state file control, bidirectional communication
2. **Transient** - short-lived, TTL-based (maxTime + maxTriggers)

Consumer stamps trail in headers, handler owns destination and cleanup.

## Technology

### requireSpl/requireNonSpl

Single entry point for splectrum resources vs platform externals:
- `requireSpl('lib/spl', record)` - returns bound object with record internalized
- `requireNonSpl('fs')` - platform modules

Bound pattern: methods read/write record internally, caller doesn't know property paths.

### Entry Point Convention

`spl.mjs` = external entry point wherever it appears:
- Direct invocation with JSON record
- `--help` for self-documentation
- Export `handle` for programmatic use

### Module Management Simplified

- Single monolithic `bm_spl` module for all API code
- Small `wm_*` work modules for additions/fixes
- Versioning at codebase level (git), not module level
- Symlink version pattern for atomic upgrade/rollback

## Process

### Self-Hosting Achievement

Full cycle working:
```bash
./spl spl/dev/deploy
./spl spl/dev/cycle --name=env-*
./spl spl/dev/publish --name=env-*
./spl spl/dev/upgrade
```

Plus repo-wide ops:
```bash
./splectrum/ops/spl spl/ops/status
./splectrum/ops/spl spl/ops/upgrade --source=...
./splectrum/ops/spl spl/ops/rollback
```

### Events Must Be Visible

Fire-and-forget should create observable events, not invisible ones. Records written to filesystem enable traceability and debugging.

### Selfevals Through Runtime Path

Hand-crafting records in selfevals bypasses the real path. When runtime changes, selfevals break in confusing ways. Better: selfevals invoke methods through same API as real usage (scripting environment ideal for this).

## What Didn't Work

### Rushing Leads to Shortcuts

Speed pressure caused bypassing proper workflow (writing directly to implementation/ instead of environment). Lost traceability, broke tests. Solution wasn't more discipline - it was recognizing the workflow needed adjustment.

### Context-Dependent Tests

Clone selfeval disabled because it requires bundle root context. When run from environment, context is wrong. Need better approach for context-dependent validation.

## Follow-On Items

Captured in backlog:
- Dev Env Pipeline Completion - formalize pipeline, upgrade spl/dev methods, upgrade nodes

Design documents created for future reference:
- API_NAMESPACE_MODEL.md
- ENTRY_POINT_DESIGN.md
- CONSUMER_DESIGN.md
- SPLECTRUM_NODE_DESIGN.md
