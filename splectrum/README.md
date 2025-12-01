# Splectrum Node

DSL engine entrypoint - JS package for Bare and Node.js.

## Quick Start

```bash
# From repo root
./spl help
./spl status

# Run method
./spl spl/dev/cycle --name=my-env

# Run script
./spl ./scripts/status.js
```

## Structure

```
splectrum/
├── spl.mjs          # Entry point
├── apps/            # Application containers
├── lib/             # Exposed API libraries
├── modules/         # Formal module bundles
├── runtime/         # App session state
├── scripts/         # Free scripts
├── docs/            # Documentation
├── _reqs/           # Requirement specs
├── node_modules/    # npm dependencies
└── package.json     # Package manifest
```

## Invocation Modes

```bash
# Method - package/api/method
./spl spl/dev/cycle --name=env-123

# Script - from scripts/ folder
./spl status

# File - explicit path
./spl ./my-script.js

# Inline - requires /* preamble
./spl "/* */ console.log(runtime.nodeRoot)"
```

## See Also

- README.json - Structured metadata
- _reqs/ - Requirement specifications
- docs/ - Additional documentation
