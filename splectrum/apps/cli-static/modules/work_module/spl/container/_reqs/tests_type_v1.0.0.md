**Type:** plain req
**Version:** 1.0.0

# tests_type

## Spec

The `_tests` folder is an internal container folder holding test collections for a container.

**Structure:**
- Folder name: `_tests` (underscore prefix = internal)
- Task entrypoint: `tests.json`
- No README.md/README.json (internal folder)

**Test collection structure:**
- Each test collection is a separate file
- Naming: `<subject>_tests.js` or `<subject>_tests.json`
- Subject typically matches a req or selfeval being tested

**tests.json entrypoint:**
- Lists available test collections
- Provides entry for test execution tasks

## Self-eval

- [ ] Folder named `_tests` with underscore prefix
- [ ] Contains `tests.json` task entrypoint
- [ ] No README.md or README.json present
- [ ] Test collection files follow naming convention `<subject>_tests.<ext>`
- [ ] tests.json lists available collections

## Comments

Internal folders use underscore prefix to distinguish from visible (navigable) folders. The task entrypoint (`tests.json`) enables direct execution without spidering through README.

Test collections are separate files to allow granular execution and clear mapping to what is being tested.
