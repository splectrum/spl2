# Splectrum Node

This is the root Splectrum node for the spl2 repository.

## Quick Start

```bash
# Add to PATH (in ~/.bashrc)
export PATH="/home/herma/splectrum/spl2:$PATH"

# Run commands from anywhere
spl spl/dev/deploy --name=my-env
spl status
spl help
```

## Node Structure

```
splectrum/
├── README.md        # This file
├── package.json     # Node identifier (name: "splectrum")
├── docs/            # Additional documentation
├── _reqs/           # Node requirements
├── scripts/         # Script library
├── spl.mjs          # Entry point implementation
├── run.js           # Method runner
├── lib/             # Library symlinks
└── modules/         # Installed modules
```

## Invocation Modes

```bash
# Command mode (default) - package/api/method
spl spl/dev/cycle --name=env-123

# Library mode - scripts from scripts/ folder
spl status
spl help

# File mode - explicit path
spl ./my-script.js --arg=value

# Inline mode - requires /* preamble
spl "/* */ console.log(runtime.nodeRoot)"
```

## See Also

- `docs/` - Additional documentation
- `scripts/` - Available scripts
- `_reqs/` - Node requirements
