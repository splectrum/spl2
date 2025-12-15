# Lessons Learned - Project 12: Wrapper APIs

## Project Evolution

**Original scope:** Wrapper APIs exploration

**Actual deliverables:** First versioned release (v0.1.0), cleanup, infrastructure improvements

The project expanded from wrapper API exploration to completing the first formal release. This included fixing selfeval bugs, registering requirements properly, and establishing the releases/ spot.

## Key Deliverables

### First Release (v0.1.0)
- Module copied to splectrum/modules/splectrum_v0.1.0
- Registered in hierarchy.json
- work_module deregistered from app hierarchy
- Archive copy in releases/archive/

### Infrastructure Fixes
- Selfeval lib runner bug fix (unregistered .js files detection)
- _reqs/index.json added to containers missing them
- Container index.json cleanup (removed unexpected api/extends null fields)
- _lib/index.json for containers with lib files (cli, lift, whoami)
- Bootstrap req created (splectrum/lib/_reqs/module_bootstrap_v1.0.0.md)

### Wrapper Passthrough (Earlier in Project)
- Early app context setup in spl.mjs
- --flags now pass through to wrapped tools correctly
- lift --modules and --recursive modes

## Methodology Insights

### What Worked

**spl tools over raw operations:** Using `spl get-started`, `spl set`, `spl lift` instead of direct file editing. The tools know the correct formats and enforce consistency.

**Selfeval as verification:** Running selfeval after changes catches issues immediately. The --meta=enriched and --meta=report flags reveal exactly what's wrong.

**Lift --resource pattern:** `spl container/lift --resource=_reqs/index.json` pulls the correct template from the type chain. No need to guess the format.

### What Was Learned

**Slow down:** Rushing through tasks leads to errors. Multiple issues in this session came from not checking properly before proceeding.

**Check all affected containers:** When making changes that affect multiple containers, verify each one. The lib runner bug affected multiple containers that weren't initially checked.

**Module hierarchy format:** The hierarchy.json layers array expects objects with `name` property, not plain strings. Format consistency matters.

**Selfeval can have bugs:** The selfeval lib runner had a bug - it returned PASS when there were .js files but no index.json. Fixed by checking for files before returning EMPTY.

### What Could Be Improved

**Better session focus:** The session had scattered attention - fixing things as they were discovered rather than systematic verification upfront.

**Verify before proceeding:** Should have run comprehensive selfeval on all containers before attempting release.

**Use splectrum tools consistently:** Several times fell back to bash/grep when spl scripts would have been more appropriate.

## Technical Decisions

### Release Process
1. Verify all selfeval passes
2. Copy work_module to splectrum/modules/splectrum_vX.Y.Z
3. Register in splectrum/modules/hierarchy.json
4. Deregister work_module from app hierarchy
5. Archive copy in releases/archive/

### Selfeval Lib Runner Fix
```javascript
// Before: returned EMPTY (pass) when no index.json
// After: checks for .js files, returns FAIL if found without manifest
try {
  const actualFiles = fs.readdirSync(libPath).filter(f => f.endsWith('.js'))
  if (actualFiles.length > 0) {
    return { pass: false, ... }
  }
} catch (dirErr) {
  // _lib directory doesn't exist - that's fine
}
```

## Partnership Notes

This session had friction around rushing and not following established patterns. The user had to redirect multiple times to use spl tools properly. Key reminders:
- Use `spl get-started` for command reference
- Use spl scripts instead of bash loops
- Check selfeval to verify changes
- Slow down and verify each step

## Next Steps (For Future Projects)

- Establish formal release workflow (spl/release API?)
- Add version management to container metadata
- Consider release notes format in releases/ spot
