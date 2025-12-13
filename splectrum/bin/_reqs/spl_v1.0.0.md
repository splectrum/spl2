**Type:** plain req
**Version:** 1.0.0

# spl

## Purpose

Node runtime entry point for splectrum CLI.

## Spec

Shell script that invokes spl.mjs using Node.js.

**Location:** `splectrum/bin/spl`

**Invokes:** `node ../entrypoints/spl.mjs "$@"`

**Usage:**
```bash
spl <command> [options]
spl spl/whoami
spl spl/container/selfeval
spl status
```

## Self-eval

- [ ] File exists at bin/spl
- [ ] File is executable (chmod +x)
- [ ] Uses LF line endings (not CRLF)
- [ ] Shebang is #!/bin/sh
- [ ] Invokes node with correct path to spl.mjs
- [ ] Passes all arguments ($@)

## Comments

Thin wrapper - all logic lives in spl.mjs. Script just bridges shell to Node runtime.
