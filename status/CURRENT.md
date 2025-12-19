# Current Status

**Last Updated:** 2025-12-19

---

## Project 13: spl Tooling and Release Documentation

**Target:** v0.2.0

### Current Focus

**IN PROGRESS: Req Coverage & Handler Migration**

#### Completed This Session

1. **`--base64` flag for crud write** - Implemented base64 content encoding to bypass shell escaping issues. Updated req (`spl_crud_instance_v1.1.0.md`), schema, handler, and get-started docs.

2. **Handler selfeval enforcement** - Updated `selfeval_handler.js`:
   - Checks no `import` statements
   - Checks no direct `require()` calls
   - Requires `module.require()` only (removed lib-prefix restriction)

3. **Docs updated for lib pattern**:
   - `handler_type_v1.0.0.md` - explicit no-imports rule
   - `inline_scripts.md` - use `await import()` for npm
   - `spl_wrapper_type_v1.0.0.md` - lib pattern for shell execution
   - `avsc_lib_v1.1.0.md` - native import for npm

4. **Removed `require_refactor_plan.md`** - selfeval is now source of truth

5. **Handler migrations completed**:
   - `spl/app/execute` - reverted to default handler (was dead code)
   - `spl/cli-static/execute` - created `_lib/execute.js` lib

6. **Created `selfeval_reqs_coverage.js`** - new runner checks .js files have reqs:
   - `_lib/*.js` → `<name>_lib_v*.md`
   - `_lib/selfeval_*.js` → `selfeval_<name>_runner_v*.md`
   - `_selfevals/**/*.js` → `selfeval_<name>_test_runner_v*.md`

7. **Reqs created (3/14)**:
   - `spl/_reqs/spl_lib_v1.0.0.md`
   - `spl/cli-static/execute/_reqs/execute_lib_v1.0.0.md`
   - `spl/cli-static-session/_reqs/watchers_lib_v1.0.0.md`
   - `spl/container/_reqs/selfeval_reqs_coverage_runner_v1.0.0.md`

#### Next Tasks (Continue)

**Create remaining reqs (11 remaining)**:
- `spl/container`: `selfeval_schemas_data_runner_v*.md`
- `spl/crud`: `crud_lib_v*.md`
- `spl/crud/lift`: `lift_lib_v*.md`
- `spl/introspection`: `selfeval_lib_v*.md`, `selfeval_final_runner_v*.md`
- `spl/introspection/whoami`: `whoami_lib_v*.md`
- `spl/introspection/selfeval`: `selfeval_command_test_runner_v*.md`
- `spl/module`: `selfeval_module_runner_v*.md`
- `spl/script`: `ai_lib_v*.md`
- `spl/wrapper`: `wrapper_lib_v*.md`

**Migrate remaining handlers (9)**:
- `spl/crud/*` (7 containers) - all have imports
- `spl/introspection/selfeval`
- `spl/introspection/info`

**Then**:
- Run selfeval-all to verify no regressions

### Selfeval Status

```bash
# Handler check (no imports)
spl selfeval-all spl  # 9 handlers still failing

# Reqs coverage check
spl selfeval-all spl --runner=reqs_coverage  # 11 missing reqs
```

### Recent Changes (uncommitted)

- `spl/crud/write/index.js` - added --base64 flag support
- `spl/crud/write/_schemas/input.avsc` - added base64 field
- `spl/crud/_reqs/spl_crud_instance_v1.1.0.md` - documented --base64 flag
- `splectrum/docs/get-started/crud.json` - updated write docs for --base64
- `spl/container/_lib/selfeval_handler.js` - no-imports check
- `spl/container/_lib/selfeval_reqs_coverage.js` - new runner
- `spl/container/_selfevals/index.json` - registered reqs_coverage
- `spl/container/_lib/index.json` - registered new lib
- `spl/cli-static/execute/_lib/execute.js` - new lib
- `spl/cli-static/execute/_lib/index.json` - lib manifest
- `spl/app/execute/index.js` - reverted to default
- 4 _reqs/*.md files created

---

## Session Entry

1. `spl get-started crud` - file operations
2. `spl get-started tools` - tool wrappers
3. Read this file for current project status
4. Continue creating missing reqs (see list above)
5. `spl selfeval-all spl --runner=reqs_coverage` - check progress
