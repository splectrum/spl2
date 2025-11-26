# spl/dev/deploy v1.0.0

Create a dev environment instance from implementation/.

## Purpose

Deploys a new isolated environment for development and testing. Copies implementation/ contents to a timestamped environment folder with proper lib resolution setup.

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Custom environment name (default: env-{timestamp}) |

### Input Constraints

- name: If provided, must not already exist in environments/

## Outputs

| Field | Type | Description |
|-------|------|-------------|
| created | string | Absolute path of created environment |
| name | string | Environment name (e.g., env-1234567890) |
| stats | object | Verification stats: { files, folders, size } |

## Behavior

1. Resolve paths relative to runtime.cwd (bundle root)
2. Check implementation/ exists
3. Generate environment name (custom or timestamp-based)
4. Create environment directory structure:
   - environments/{name}/
   - environments/{name}/modules/
   - environments/{name}/lib/
   - environments/{name}/node_modules/lib/
   - environments/{name}/events/requests/
5. Copy types/ to modules/types/
6. Copy wm_* work module to modules/
7. Create lib/ symlinks pointing to work module _lib/
8. Create node_modules/lib/ re-exports
9. Create package.json
10. Copy handler.js and submit.js
11. Return output with path, name, and stats

## Error Conditions

| Condition | Error Message |
|-----------|---------------|
| implementation/ not found | "implementation/ directory not found" |
| Environment already exists | "Environment already exists: {name}" |
| No work module found | "No work module (wm_*) found in implementation/" |

## Selfevals

### SE-1: Environment created
Verify that the environment directory is created at the expected path.

### SE-2: modules/ contains types and work module
Verify that modules/types/ and modules/wm_*/ exist.

### SE-3: lib symlinks created
Verify that lib/ contains symlinks to work module _lib/ files.

### SE-4: node_modules/lib re-exports created
Verify that node_modules/lib/ contains re-export files.

### SE-5: package.json created
Verify that package.json exists with correct structure.

### SE-6: handler.js and submit.js copied
Verify that handler.js and submit.js exist in environment.

### SE-7: Error when implementation/ missing
Verify that error is set when implementation/ doesn't exist.

### SE-8: Stats returned for verification
Verify that output includes stats for independent verification.

## Notes

- Environment is isolated - changes don't affect implementation/ until publish
- Use spl/dev/cycle to test after making changes
- Use spl/dev/publish to copy work module back to implementation/
- Use spl/dev/destroy to clean up
- v1.0.0: Initial implementation based on deploy.js
