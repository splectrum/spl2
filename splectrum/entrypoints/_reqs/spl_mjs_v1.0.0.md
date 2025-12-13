**Type:** plain req
**Version:** 1.0.0

# spl_mjs

## Purpose

Main splectrum CLI entrypoint. Bootstraps module system and handles CLI invocation.

## Spec

**Location:** `splectrum/entrypoints/spl.mjs`

**Invoked by:** `bin/spl` (Node) or `bin/splb` (Bare)

### Invocation Modes

| Mode | Example | Description |
|------|---------|-------------|
| Command | `spl spl/dev/cycle --name=env-123` | Invoke container method |
| Inline | `spl "/* */ await spl.dev.cycle(...)"` | Execute inline JS |
| File | `spl ./workflow.js --env=prod` | Run external script |
| Library | `spl status` | Run scripts/ library script |

### Execution Flow

1. Create record (capture input, timestamp, runtime info)
2. Load module (`cli-static`)
3. Initialize platform modules (fs, path)
4. Bind record to module
5. Create CLI processor
6. Resolve node, detect mode, parse args
7. Validate and handle errors
8. Execute via app handler

### Dependencies

| Import | Purpose |
|--------|---------|
| `../lib/moduleBootstrap.js` | Module loader |
| `../modules/bm_spl/spl/cli/_lib/cli.js` | CLI processing |

### Platform Compatibility

Works on both Node and Bare runtimes via:
- Import maps in package.json
- Platform-specific modules (fs, path, process)

## Self-eval

- [ ] File exists at entrypoints/spl.mjs
- [ ] Imports use correct relative paths (../)
- [ ] Creates record with proper structure
- [ ] Loads cli-static module
- [ ] Handles all invocation modes
- [ ] Works on Node runtime
- [ ] Works on Bare runtime

## Comments

spl.mjs is the single entrypoint for both runtimes. All platform differences handled by import maps and module abstraction. CLI processing delegated to cli lib.
