# Current Status

**Last Updated:** 2025-12-15

---

## Status: Project 12 Active

**Project 12: Wrapper APIs** - Exploration Project

### Objective

Wrap existing tools (git, file, search) within splectrum context. Platform-agnostic (Node/Bare).

### Current Phase

**Method resolution FIXED. spl/script API created.**

### Completed This Session (2025-12-15)

**Method resolution fix in `module.js buildTypeStackInternal`:**
- Virtual method resolution for instantiates mode
- Instantiates mode continues past duplicates instead of stopping
- `--help` now works on all inherited methods

**spl/script API created:**
- New API for scripting/exploration
- `ai.js` helper lib with utilities: `stack()`, `methods()`, `readJson()`, `physicalMethod()`, `table()`, etc.
- Design reqs for future REPL mode
- See `spl/script/_reqs/` for roadmap

**selfeval input.avsc added:**
- Pattern for documenting method-specific args
- `--help` now shows all selfeval flags

**get-started.js updated:**
- Added inline script syntax documentation

### Key Commands

```bash
# Introspection
spl spl/container/whoami --help    # Shows all input args - NOW WORKS!
spl spl/container/selfeval --help  # Shows selfeval-specific args

# Inline scripts with ai helper
spl '/* explore */
const ai = await module.require("lib/spl/script/ai.js")
module.output(ai.table(await ai.methods("spl/container")))
'
```

### Bug List

See `status/BUGLIST.md`

### Next Steps

1. Continue with spl/http API (Project 12 objective)
2. Implement --methods flag for whoami
3. Consider REPL mode (see `spl/script/_reqs/repl_design.md`)

---

## Session Entry

1. Read this file
2. Run `spl get-started` for quick reference
3. Use inline scripts with ai.js to explore:
   ```bash
   spl '/* test */
   const ai = await module.require("lib/spl/script/ai.js")
   module.output(ai.json(ai.stack("spl/container")))
   '
   ```
4. Method resolution complete - can proceed with wrapper APIs
