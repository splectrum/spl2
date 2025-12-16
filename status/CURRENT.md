# Current Status

**Last Updated:** 2025-12-16

---

## Status: Project 13 In Progress

**Project 13: spl Tooling and Release Documentation** - In Progress

**Target:** v0.2.0

### Current Focus

Fixing selfeval issues before continuing with tools/gh wrapper.

**Immediate:**
1. Fix spl/wrapper `_reqs/index.json` - uses `reqs` array, should be `requirements` per schema
2. Fix schemas inheritance failure - drift detected between spl/wrapper and parent schemas

**Then:**
- Create tools/gh wrapper
- Design spl/source native API (submit, pr, release workflows)

### Design Documents Created This Session

1. **design/INTEGRATION_DESIGN.md** - Three-layer integration architecture:
   - Core: Native SPL
   - P2P: Holepunch/Pear (wrapper first, native later)
   - External: MCP for AI agent management
   - Inter-node: AVRO RPC for typed P2P calls
   - Dev pattern: Repo node as control plane for Pear nodes

2. **design/SYNTHESIS_DESIGN.md** - Documentation synthesis and AI context:
   - Distributed sources, synthesized view
   - Analysis layer (consistency, coverage, quality state)
   - RAG-ready architecture for AI context optimization
   - Introspection methods: synthesize, analyze, context

### Tools Product Set Updated

Reprioritized with tiered approach (see `projects/13-spl-tooling-and-release-docs/TOOLS_PRODUCT_SET.md`):

- **Tier 1 Core:** git, docker, pear, ssh (truly external)
- **Tier 2 Productivity:** ffmpeg, gh, rsync
- **Tier 3 Sysadmin:** apt, systemctl, ps, kill (privileged ops)
- **Tier 4 Niche:** npm, pandoc, imagemagick
- **Deprioritized:** jq, curl, find, grep, tar (JS-native alternatives)

Added Script Helper Libraries section - JS-native capabilities for AI scripting.

### Bugs Fixed This Session

1. **--help/--meta not working on inherited methods** - FIXED
   - Root cause: `isWrapper()` in cli.js fell back to parent container
   - Fix: Only check exact path, no fallback
   - Now `spl spl/wrapper/selfeval --help` shows usage correctly

### Known Bugs (Remaining)

1. **spl/wrapper reqs failure** - `_reqs/index.json` uses `reqs` array, code/schema expects `requirements`

2. **spl/wrapper schemas inheritance failure** - drift detected, need to check input.avsc compatibility

### Code Changes

- `spl/cli/_lib/cli.js`: Fixed `isWrapper()` to only check exact path (line 161-175)

---

## Session Entry

1. Read this file
2. Run `spl get-started` for command reference
3. Run `spl spl/wrapper/selfeval --meta=detail` to see current failures
4. Fix remaining selfeval issues, then continue with tools/gh

---

## Quick Reference

```
spl spl/container/selfeval          # Verify system
spl spl/wrapper/selfeval --meta=detail  # Check wrapper issues
spl spl/container/whoami --levels=all   # Full type chain
spl get-started                     # Command reference
```
