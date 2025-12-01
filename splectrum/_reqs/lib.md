# Lib

**Type:** Folder (library)

## Definition

Bootstrapping and dual entrypoint (CLI + programmatic) management. Also provides API library resolution to module URLs.

## Requirements

- Contains bootstrap infrastructure code
- Provides requireSpl() for API library resolution
- No executable entrypoint (library folder)

## Resolution Pattern

`lib/spl` → `modules/bm_spl/spl/_lib/spl.js`
`lib/spl/cli` → `modules/bm_spl/spl/cli/_lib/cli.js`
