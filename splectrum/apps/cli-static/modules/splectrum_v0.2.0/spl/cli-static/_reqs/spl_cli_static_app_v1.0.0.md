# CLI-Static App Requirement

**Version:** 1.0.0
**Container:** spl/cli-static
**Type:** App

## Purpose

Bootstrap app for splectrum CLI. Provides terminal routing and handles all CLI requests.

## Role

cli-static is the current bootstrap app:
- Entry point for all `spl` command invocations
- Manages app state and session
- Routes requests to appropriate handlers
- Where new tool wrappers should be created (tools/ package)

## Early App Context

The entry point (spl.mjs) must set app context BEFORE CLI argument parsing:

```javascript
// Set app context early (enables app overlay for wrapper detection in parseArgs)
record.headers.spl.runtime.appAPI = 'spl/cli-static'
record.headers.spl['cli-static'] = { enableAppOverlay: true }
```

**Why:** Wrapper detection (`isWrapper()` in cli.js) needs app overlay enabled to find wrappers in work_module. Without early app context, only splectrum modules would be searched.

## Tool Wrappers

New external tool wrappers (spl/wrapper instances) should be created in this app's work_module:

```
apps/cli-static/modules/work_module/tools/
├── 7zip/
├── git/
└── <new-wrapper>/
```

See `spl/wrapper` type for wrapper implementation pattern.

## Structure

- `spl/cli-static` - App container
- `spl/cli-static/execute` - Request handler
- `spl/cli-static-session` - Session management
- `spl/cli-static-session/start` - Session start handler

## Comments

"Static" refers to the non-interactive nature of CLI invocations (vs future interactive/REPL modes). Each invocation is a single request-response cycle.
