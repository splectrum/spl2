**Type:** plain req
**Version:** 1.0.0

# bin_setup

## Purpose

CLI entry points for the splectrum node. Shell scripts that invoke the splectrum runtime.

## Expected Contents

| File | Purpose |
|------|---------|
| `spl` | Node runtime entry point - invokes `node ../entrypoints/spl.mjs` |
| `splb` | Bare runtime entry point - invokes `bare ../entrypoints/spl.mjs` |

## PATH Setup

Add the bin folder to system PATH via `/etc/environment`:

```bash
# Edit /etc/environment (requires sudo)
sudo nano /etc/environment

# Add or modify PATH line to include:
PATH="/home/herma/splectrum/spl2/splectrum/bin:..."
```

**Why /etc/environment:**
- Works for all sessions (interactive, non-interactive, login, non-login)
- Works for all users
- Standard location on all Linux systems using PAM
- Applies to automated tools (including AI assistants)

**After editing:** Log out and back in, or start a new session for changes to take effect.

## Verification

```bash
which spl        # Should show .../splectrum/bin/spl
spl spl/whoami   # Should show spl package info
splb spl/whoami  # Should show same (Bare runtime)
```

## Self-eval

- [ ] bin folder exists at splectrum/bin/
- [ ] spl script present and executable
- [ ] splb script present and executable
- [ ] PATH includes splectrum/bin (check with `echo $PATH`)
- [ ] `spl spl/whoami` works without full path

## Comments

The bin folder belongs to the splectrum node (functional unit), not the repo. Entry points stay with the node if deployed elsewhere.
