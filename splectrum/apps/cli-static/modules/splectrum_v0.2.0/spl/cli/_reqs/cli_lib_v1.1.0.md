# CLI Lib Requirement

**Version:** 1.1.0
**Container:** spl/cli
**Type:** Lib

## Purpose

CLI entry point utilities for processing command-line invocations. Bound pattern: `create(module)` returns object with methods that read/write record internally via module.

## Location

`spl/cli/_lib/cli.js`

## Mode Classification

Mode detection is syntax-based (no existence checks). Resolution happens later with full context including app overlay.

| Prefix | Mode | Status | Example |
|--------|------|--------|---------|
| (no `/`) | script | active | `spl selfeval-all` |
| `./` or `../` path | file | active | `spl ./myscript.js` |
| `/*` | inline | active | `spl '/* */ module.output("hi")'` |
| `../` (no path chars) | stateless | future | `spl ../reset` |
| (has `/`) | command | active | `spl spl/container/whoami` |

### Script Mode
Single word without `/` - resolved via module.resolveScript() which checks:
1. App scripts first: `apps/{appName}/scripts/{name}.js`
2. Node scripts: `scripts/{name}.js`

### Future: Stateless Mode
`../` prefix for stateless commands when main commands are stateful/data-driven. Not yet implemented - apps not fully set up.

## Methods

| Method | Description |
|--------|-------------|
| `resolveNode()` | Find nearest splectrum/ folder from invokedFrom |
| `detectMode()` | Detect invocation mode via syntax (no existence checks) |
| `parseArgs()` | Parse CLI arguments into input record |
| `rewriteHelp()` | Rewrite --help/-h to whoami --usage |
| `isWrapper(methodPath)` | Check if method instantiates spl/wrapper |
| `isExternalScriptFile()` | Check if mode is external file |
| `loadExternalScriptFile()` | Load external script content |
| `validate()` | Validate CLI state |
| `handleError()` | Output error and exit |

## Wrapper Detection

`isWrapper(methodPath)` checks if a container instantiates `spl/wrapper` for passthrough mode. When true, all arguments after the method are treated as positional (flags like `--oneline` pass to the wrapped tool, not splectrum).

## Call Order

In spl.mjs entry point:

1. Create record
2. Load module, init, bind record
3. Set app context (appAPI + enableAppOverlay)
4. Create cli bound to module
5. `cli.resolveNode()`
6. `cli.detectMode()` - syntax-based, no resolution
7. `cli.parseArgs()` - uses isWrapper here
8. `cli.rewriteHelp()`
9. `cli.validate()` or `cli.handleError()`
10. Execute: script resolution happens here with full context

## Script Resolution

Script resolution moved to module.js with app overlay support:
- `module.resolveScript(name)` - returns absolute path or null
- Checks app scripts first (if enableAppOverlay), then node scripts
