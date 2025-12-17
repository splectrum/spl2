# Current Status

**Last Updated:** 2025-12-17

---

## Project 13: spl Tooling and Release Documentation

**Target:** v0.2.0

### Current Focus

**Next:**
- Implement selfeval output improvements (req: selfeval_method_v1.1.0.md)
  - Status vocabulary: PASS, FAIL, SKIP, NONE
  - Topline with counts and failure list
  - FAIL-first output ordering
  - Tests runner lists all files
- Distribute tests to specific containers (spl/api, spl/wrapper, etc.)
- Create tools/gh wrapper
- Design spl/source native API (submit, pr, release workflows)

**Done This Session:**
- get-started expansion: ai-first, index-json, reqs, wrappers, tools topics
- freetext.js helper for doc rendering (lib/spl/script/freetext.js)
- Scripts folder cleanup: removed help.js, test-avsc.js; added _reqs with versioned files
- docs/get-started/_reqs for topic structure documentation
- CLAUDE.md trimmed to 28 lines - single channel through `spl get-started`
- SPL2 → Splectrum naming across surface docs
- Fixed tools/7zip and tools/git selfeval failures (instantiates stack check)
- selfeval_method_v1.1.0.md req for output improvements

### Known Failures

```
spl selfeval-all spl --failFast
  (all passing)
```

---

## Session Entry

1. `spl get-started` - operational reference
2. Read this file for current project status
3. `spl selfeval-all spl --failFast` - verify system health
