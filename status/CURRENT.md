# Current Status

**Last Updated:** 2025-12-14

---

## Status: Project 12 Active

**Project 12: Wrapper APIs** - Exploration Project

### Objective

Wrap existing tools (git, file, search) within splectrum context. Platform-agnostic (Node/Bare).

### Current Phase

**Method resolution design discovered.** See `design/METHOD_RESOLUTION.md`.

### Completed This Session

**Whoami output improvements:**
- Changed `api | 9 methods` to `children | 9 [spl/api]` - shows actual children type
- Changed level format from `spl [1/5]` to `spl [1] | (instantiates: spl/package)`
- Renamed `buildApi` to `buildChildren` in report.js
- Renamed `api` facet to `children` facet in whoami.js

**Bug fixes:**
- `cli.js rewriteHelp()` - now always appends /whoami (whoami on whoami is valid)
- Removed drifted `module.js` copy from `spl/module/_lib/` (type shouldn't have implementation)
- Updated `spl/module/index.json` to new type/instance children structure
- Fixed `selfeval_module.js` to skip when running on type definition

**Design discovery - Method Resolution:**
- `spl spl/container/whoami --help` returns "No input schema found"
- Root cause: `module.resolve` doesn't follow parent API's type chain for methods
- Methods are special: need "API association" before normal type chain kicks in
- See `design/METHOD_RESOLUTION.md` for full writeup

### Key Insight

Methods (spl/method instances) occupy a special place in splectrum:
- They're not standalone containers - they're extensions of their API definition
- `spl/container/whoami` is "whoami applied to spl/container"
- Resolution must first find original definition (spl/introspection/whoami), THEN use that method's stack
- This is different from regular containers which use their own type stack directly

### Key Commands

```bash
spl spl/container/selfeval         # Validate (4 levels) - PASSES
spl spl/whoami                     # Shows children | 9 [spl/api]
spl spl/introspection/whoami       # Shows children | 2 [spl/method]
```

### Bug List

See `status/BUGLIST.md`:
1. ~~--help returns "No input schema found"~~ PARTIALLY FIXED (rewrite works, resolution doesn't)
2. Input schemas audit needed across methods
3. ~~spl/whoami doesn't show expected children~~ FIXED
4. ~~spl index.json structure~~ FIXED

**NEW:** Method resolution incomplete - see `design/METHOD_RESOLUTION.md`

### Next Steps

1. **Fix method resolution in `_lib/module.js`** - implement API association for methods
2. Audit what else is affected by method resolution
3. Continue with spl/http API

---

## Session Entry

1. Read this file
2. Read `design/METHOD_RESOLUTION.md` - understand method resolution issue
3. **Key finding:** Handler (index.js) resolution works for methods, but schema/lib resolution doesn't
4. Fix needed in `_lib/module.js` `resolveOverlay` - extend method resolution to ALL file types, not just index.js
5. Current logic on line 198: `if (!nodeIndex && segments.length >= 2 && subPath === 'index.js')` - the `subPath === 'index.js'` restriction must be removed

## State Summary for Transfer

**What works:**
- `spl spl/container/whoami` - handler resolves correctly
- `spl spl/introspection/whoami --help` - shows input schema (method defined here)
- All selfeval passes

**What's broken:**
- `spl spl/container/whoami --help` - "No input schema found"
- `module.resolve('spl/container/whoami', '_schemas/input.avsc')` returns null
- Any non-index.js file resolution for inherited methods

**Root cause:**
`resolveOverlay` in `_lib/module.js` line 198 only does method resolution for `index.js`. Other files (schemas, libs) don't get method resolution treatment.
