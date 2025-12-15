**Type:** plain req
**Version:** 1.0.0

# selfevals_type

## Spec

The `_selfevals` folder is an internal container folder holding self-evaluations for a container.

**Structure:**
- Folder name: `_selfevals` (underscore prefix = internal)
- Task entrypoint: `selfevals.json`
- No README.md/README.json (internal folder)

**Selfeval file structure:**
- Each selfeval is a separate file
- Naming: `<req_name>_selfeval.md` - references the req being evaluated
- One selfeval per req

**selfevals.json entrypoint:**
- Lists available selfevals
- Provides entry for selfeval execution tasks

## Self-eval

- [ ] Folder named `_selfevals` with underscore prefix
- [ ] Contains `selfevals.json` task entrypoint
- [ ] No README.md or README.json present
- [ ] Selfeval files follow naming convention `<req_name>_selfeval.md`
- [ ] Each selfeval references exactly one req
- [ ] selfevals.json lists available selfevals

## Comments

Selfevals are linked to reqs by naming convention. The req name in the filename creates the traceability without explicit metadata.

Internal folders use underscore prefix to distinguish from visible (navigable) folders. The task entrypoint (`selfevals.json`) enables direct execution without spidering through README.
