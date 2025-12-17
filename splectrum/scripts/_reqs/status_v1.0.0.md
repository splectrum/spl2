**Type:** plain req
**Version:** 1.0.0

# status

## Spec

Node status and diagnostics. Shows node configuration, directories, and available resources.

**Invocation:**
```bash
spl status [--verbose]
```

**Output:**
- Node root path
- Node directories (scripts/, docs/, _reqs/, modules/)
- Bundle directories if present (implementation/, environments/)
- Package info (name, version, description)

**Options:**
- `--verbose` - Also list available scripts and methods

## Self-eval

- [ ] `spl status` shows node directories and package info
- [ ] `--verbose` lists scripts and methods

## Comments

Established fixture for node diagnostics. Quick health check for node configuration.
