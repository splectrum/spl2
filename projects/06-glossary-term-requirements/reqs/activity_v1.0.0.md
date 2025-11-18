**Type:** plain req

# activity

## Spec

Work that creates immutables and updates mutables, within a defined context (chat, project).

Immutables can only be created within the activity's context. Mutables can be updated from elsewhere.

Ownership pattern (microservice): Activity registers desired change with spot. Spot as owner executes the change. Others have read-only permission.

Currently: Manual execution until tooling in place.

Scope: Global.

Purpose: Structured work with clear ownership and change management.

## Self-eval

- [ ] Takes place within defined context
- [ ] Creates immutables within context
- [ ] Updates mutables via spot ownership
- [ ] Clear activity type (adhoc/unplanned/planned)

## Comments

Three activity types extend this: adhoc_activity (chat), unplanned_activity (project, off workplan), planned_activity (project, on workplan).
