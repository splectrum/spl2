**Type:** plain req
**Version:** 1.0.0

# splb

## Purpose

Bare runtime entry point for splectrum CLI.

## Spec

Shell script that invokes spl.mjs using Bare runtime.

**Location:** `splectrum/bin/splb`

**Invokes:** `bare ../entrypoints/spl.mjs "$@"`

**Usage:**
```bash
splb <command> [options]
splb spl/whoami
splb spl/container/selfeval
```

## Self-eval

- [ ] File exists at bin/splb
- [ ] File is executable (chmod +x)
- [ ] Uses LF line endings (not CRLF)
- [ ] Shebang is #!/bin/sh
- [ ] Invokes bare with correct path to spl.mjs
- [ ] Passes all arguments ($@)

## Comments

Bare is a lightweight JavaScript runtime. splb provides P2P-capable runtime for splectrum, using same spl.mjs entrypoint as Node version.
