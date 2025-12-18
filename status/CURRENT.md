# Current Status

**Last Updated:** 2025-12-18

---

## Project 13: spl Tooling and Release Documentation

**Target:** v0.2.0

### Current Focus

**COMPLETED: CRUD Resource Operations & Wrapper Lib Refactor**

Extended crud methods to support resource file operations:
- `create --resource` - create new resource files
- `read --resource` - read from work_module (wildcard support)
- `write --resource` - write to existing resources
- `delete --resource` - delete individual resources
- `lift --resource` - now returns file contents

Wrapper lib refactor:
- `spl/wrapper/_lib/wrapper.js` - shared execSync logic
- `tools/git` and `tools/7zip` use inherited wrapper lib
- Factory pattern documented in `get-started libs`

**Next tasks:**
- Phase 3: Move npm requires from methods to libs, add selfeval validator
- Create promote-script to publish scripts to splectrum node scripts folder
- Create container map script
- Link map script from get-started
- Create tools/gh wrapper

### Recent Commit

```
32c5e5d Project 13: crud read/write/delete --resource, wrapper lib refactor
```

25 files changed. Reqs updated: spl_crud_instance_v1.1.0, Create_v1.1.0

### Known Failures

```
spl selfeval-all spl --failFast
  PASS | 23/23
```

---

## Session Entry

1. `spl get-started crud` - file operations
2. `spl get-started tools` - tool wrappers
3. `spl get-started libs` - lib require pattern
4. Read this file for current project status
5. `spl selfeval-all spl --failFast` - verify system health
