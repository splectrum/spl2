# spl/runtime API v1.0.0

Runtime context API providing execution environment properties.

## Purpose

Provides methods with information about the execution environment without depending on process globals. All context is passed via the record.

## Properties (metastate)

### cwd
- **Type:** string
- **Required:** yes
- **Description:** Bundle root directory. The base path for resolving relative paths. Set by the spl entry point to its own directory.
- **Constraints:** Must be an absolute path. Must exist as a directory.

### splectrumDir
- **Type:** string
- **Required:** yes
- **Description:** Splectrum installation directory. Location of run.js, modules/, lib/, etc.
- **Constraints:** Must be an absolute path. Must exist as a directory. Must contain run.js.

### invokedFrom
- **Type:** string
- **Required:** yes
- **Description:** Directory from which the spl command was invoked. The user's working directory at invocation time.
- **Constraints:** Must be an absolute path. Must exist as a directory.

## Initialization

Set by the spl entry point before method invocation:
1. cwd = directory containing the spl entry script (bundle root)
2. splectrumDir = cwd + '/splectrum'
3. invokedFrom = process.cwd() at invocation time

## Usage

Methods access runtime properties via:
```javascript
const runtime = spl.headers.spl.runtime
const basePath = runtime.cwd
```

## Design Notes

- Methods must not use process.cwd() - use runtime.cwd instead
- All paths should be resolved relative to runtime.cwd
- invokedFrom preserved for cases where user's original location matters

## Selfevals

### SE-1: All properties present
Verify that cwd, splectrumDir, and invokedFrom are all present in the record headers.

### SE-2: All paths absolute
Verify that all three properties are absolute paths (start with /).

### SE-3: cwd exists
Verify that cwd points to an existing directory.

### SE-4: splectrumDir exists and contains run.js
Verify that splectrumDir points to an existing directory containing run.js.

### SE-5: invokedFrom exists
Verify that invokedFrom points to an existing directory.
