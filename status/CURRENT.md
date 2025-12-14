# Current Status

**Last Updated:** 2025-12-15

---

## Status: Project 12 Active

**Project 12: Wrapper APIs** - Exploration Project

### Objective

Wrap existing tools (git, file, search) within splectrum context. Platform-agnostic (Node/Bare).

### Current Phase

**Wrapper infrastructure complete. CLI passthrough WIP.**

### Completed This Session (2025-12-15)

**spl/crud/set - Property mutation with dot-path syntax:**
```bash
spl spl/foo/set container.extends="spl/bar"
spl spl/foo/set container.instance.children.list+="new"  # append
spl spl/foo/set container.instance.children.list-="old"  # remove
```

**spl/introspection/info - Quick query tool:**
```bash
spl spl/container/info --stack              # Type stack
spl spl/container/info --stack=instantiates # Instance chain
spl spl/container/info --methods            # Available methods
spl spl/container/info --children           # Allowed children
```

**spl/http API - HTTP client:**
```bash
spl spl/http/get --url=https://example.com
spl spl/http/post --url=https://api.example.com --body='{"key":"value"}'
```

**spl/wrapper type - External tool wrapper pattern:**
- String input schema (passthrough args)
- Philosophy documented in `spl/wrapper/_reqs/spl_wrapper_type_v1.0.0.md`
- Handlers implement own --help/--dryRun from positional args
- Structured output for errors

**tools package - External tool wrappers:**
```bash
spl tools/7zip a archive.7z ./src           # Create archive
spl tools/7zip l archive.7z                 # List contents
spl tools/git status                        # Git status
spl tools/git log -5                        # Recent commits
```

**CLI wrapper detection (WIP):**
- Added `isWrapper()` check to cli.js
- Intent: all args positional for wrappers (no flag parsing)
- Current: detection works but flags like `--oneline` still captured
- Next: debug why wrapper mode not fully working

### Key Files Changed

- `splectrum/modules/bm_spl/spl/cli/_lib/cli.js` - wrapper detection
- `spl/wrapper/` - type definition and reqs
- `spl/http/` - HTTP client API
- `spl/crud/set/` - property mutation
- `spl/introspection/info/` - quick queries
- `tools/7zip/`, `tools/git/` - wrappers

### Bug List

See `status/BUGLIST.md`

### Next Steps

1. **Fix CLI wrapper passthrough** - `--flags` should pass to tool, not splectrum
2. **spl/file API** - wrap file operations
3. **bm_spl migration** - bring legacy modules into work_module

---

## Session Entry

1. Read this file
2. Run `spl get-started` for command reference
3. Check wrapper passthrough issue in `cli.js` - `isWrapper()` detects correctly but flag parsing still happens
