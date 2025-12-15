# CLI Lib Requirement

**Version:** 1.0.0
**Container:** spl/cli
**Type:** Lib

## Purpose

CLI entry point utilities for processing command-line invocations. Bound pattern: `create(module, record)` returns object with methods that read/write record internally.

## Location

`spl/cli/_lib/cli.js`

## Methods

| Method | Description |
|--------|-------------|
| `resolveNode()` | Find nearest splectrum/ folder from invokedFrom |
| `detectMode()` | Detect invocation mode (command, script, file, library) |
| `parseArgs()` | Parse CLI arguments into input record |
| `rewriteHelp()` | Rewrite --help/-h to whoami --usage |
| `isWrapper(methodPath)` | Check if method instantiates spl/wrapper |
| `isExternalScriptFile()` | Check if mode is external file |
| `loadExternalScriptFile()` | Load external script content |
| `validate()` | Validate CLI state |
| `handleError()` | Output error and exit |

## Wrapper Detection

`isWrapper(methodPath)` checks if a container instantiates `spl/wrapper` for passthrough mode. When true, all arguments after the method are treated as positional (flags like `--oneline` pass to the wrapped tool, not splectrum).

**Requirement:** App context must be set on record BEFORE `parseArgs()` is called:

```javascript
record.headers.spl.runtime.appAPI = 'spl/cli-static'
record.headers.spl['cli-static'] = { enableAppOverlay: true }
```

This enables app overlay resolution so wrappers in work_module can be found. See `spl.mjs` for implementation.

## Call Order

In spl.mjs entry point:

1. Create record
2. Load module, init, bind record
3. **Set app context** (appAPI + enableAppOverlay)
4. Create cli bound to module + record
5. `cli.resolveNode()`
6. `cli.detectMode()`
7. `cli.parseArgs()` - uses isWrapper here
8. `cli.rewriteHelp()`
9. `cli.validate()` or `cli.handleError()`

## Comments

The cli lib is entrypoint infrastructure specific to spl.mjs. It receives raw record because it builds the record structure during CLI processing.
