# Session Restart Guide - Project 09

**Last Updated:** 2025-11-25 (Session 8)

---

## Current Status

**Project:** Console v5 Stream Native (Exploration)

**Phase:** Product Twin 1 - Building Blocks Exploration
**Stage:** Hierarchy overlay and selfeval inheritance complete

---

## What's Working

**v0 Dev Environment Template:**
- Clean structure: `implementation/` contains `types/` and `work_module/`
- Scripts: deploy.js, prepare.js, test.js, cycle.js, publish.js, destroy.js, clone.js
- Clone creates new iterations (e.g., `node clone.js ../v1.2`)

**v1.1 Working Iteration:**
- Full cycle tested: deploy → cycle (prepare + test) → publish → destroy
- Hierarchy map built dynamically from type declarations
- Selfevals collected from all layers with overlay logic
- Type hierarchy flattening on publish (standalone modules)

**Scripts in v0/v1.1:**
| Script | Purpose |
|--------|---------|
| `deploy.js` | Create env from implementation (copies modules, lib resolution) |
| `prepare.js` | Build hierarchy.json (layer sequences for all nodes) |
| `test.js` | Run selfevals from all layers using hierarchy overlay |
| `cycle.js` | Convenience: prepare + test |
| `publish.js` | Copy work_module back with timestamp, flatten type hierarchy |
| `destroy.js` | Clean up environment(s) |
| `clone.js` | Create new iteration from v0 |
| `handler.js` | Request handler (copied to env) |
| `submit.js` | Test request submitter (copied to env) |

---

## Quick Start

```bash
cd dev/v0
node clone.js ../v1.2           # Create new iteration
cd ../v1.2
node deploy.js                   # Create environment
node cycle.js                    # Build hierarchy + run tests
# ... develop in environments/env-*/modules/work_module/ ...
node cycle.js                    # Re-run after changes
node publish.js                  # Publish with type flattening
node destroy.js                  # Clean up
```

---

## Structure

**v0 (template):**
```
dev/v0/
├── package.json
├── deploy.js, prepare.js, test.js, cycle.js
├── publish.js, destroy.js, clone.js
├── handler.js, submit.js
├── environments/           # Empty in template
└── implementation/
    ├── types/              # Type definitions (module_node, method, api, etc.)
    │   └── module_node/
    │       ├── _lib/       # Shared lib (inherited by all)
    │       └── _reqs/      # Type selfeval (inherited by all)
    └── work_module/        # Base work module with hello method
        └── _lib/
            ├── core.js     # SPL wrapper
            └── overlay.js  # Overlay resolution library
```

**Created environment:**
```
env-{timestamp}/
├── package.json
├── hierarchy.json          # Layer sequences for all nodes (built by prepare.js)
├── handler.js, submit.js
├── events/requests/
├── lib/                    # Symlinks to modules/work_module/_lib/
├── node_modules/lib/       # Re-exports from lib/
└── modules/
    ├── types/
    └── work_module/
```

---

## Session 8 Accomplishments

1. **Added `_lib/` and `_reqs/` to module_node type** - All nodes inherit these folders
2. **Created module_node selfeval** - Structural validation: underscore folders must be in type, non-underscore must be type instances
3. **Created prepare.js** - Builds hierarchy.json with layer sequences per node
4. **Created overlay.js** - `selectFile()` (first wins) and `collectAll()` (accumulate with overlay)
5. **Updated test.js** - Collects selfevals from all layers using hierarchy overlay
6. **Created cycle.js** - Convenience script (prepare + test)
7. **Updated clone.js** - Includes new scripts
8. **Tested in v1.1** - Full end-to-end: deploy → cycle → publish → destroy

**Key Design:**
- Hierarchy is dynamic - reads type declarations at runtime
- Layer sequence per node: work_module ancestors → type chain
- Same-named selfevals follow overlay (lower layer wins)
- Type selfeval runs on every node (structural validation inherited)

---

## Next Steps

1. **Value/API state** - Implement batch processing with value payload
2. **Arithmetic method** - Multi-step method to test iteration loop
3. **lib() resolution** - Use overlay.js for runtime file resolution

---

**Ready for handover:** Hierarchy overlay complete with inherited selfevals.
