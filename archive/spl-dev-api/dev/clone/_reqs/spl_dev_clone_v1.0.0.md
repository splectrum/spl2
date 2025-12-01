# spl/dev/clone v1.0.0

Clone a dev environment iteration to a new location.

## Purpose

Creates a copy of a dev environment bundle at a new location, updating package.json with appropriate name, version, and description. Used for creating new iterations or starting fresh work.

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| path | string | Yes | Destination path, resolved relative to runtime.cwd |
| name | string | No | Package name (auto-detected from path if not provided) |
| description | string | No | Package description (default generated if not provided) |

### Input Constraints

- path: Must not point to existing directory
- name: If provided, used as-is for package.json name
- description: If provided, used as-is for package.json description

## Outputs

| Field | Type | Description |
|-------|------|-------------|
| created | string | Absolute path of created directory |
| package | object | Package.json contents: { name, version, description } |
| stats | object | Verification stats: { files, folders, size } |

## Behavior

1. Resolve destination path relative to runtime.cwd (not process.cwd)
2. Error if destination already exists
3. Create destination directory
4. Copy source contents:
   - All files in explicit copy list (package.json, deploy.js, etc.)
   - implementation/ folder (recursive)
   - Create empty environments/ folder
5. Update package.json with name, version, description
6. Return output with created path, package info, and stats

### Files Copied

Explicit list:
- package.json, deploy.js, prepare.js, test.js, cycle.js
- publish.js, destroy.js, handler.js, submit.js, clone.js

Folders:
- implementation/ (recursive copy)
- environments/ (created empty)

### Name Auto-detection

When name not provided:
- Detect project number from path pattern `projects/NN-name/dev/`
- Generate name as `prNN-destName` (e.g., `pr10-v1.0`)

### Description Auto-detection

When description not provided:
- Generate as `Project NN - Dev environment destName`

### Version Detection

- If destination folder matches `vX.Y` pattern, set version to `X.Y.0`
- Otherwise set version to `0.0.0`

## Error Conditions

| Condition | Error Message |
|-----------|---------------|
| Destination exists | "Destination already exists: {path}" |

## Selfevals

### SE-1: Destination created
Verify that the destination directory is created at the expected path.

### SE-2: Clone with custom name
Verify that providing a custom name uses that name in package.json.

### SE-3: Clone with custom description
Verify that providing a custom description uses that description in package.json.

### SE-4: Error when destination exists
Verify that cloning to an existing directory sets error and completed=true.

### SE-5: Stats returned for verification
Verify that output includes stats (files, folders, size) for independent verification.

### SE-6: Environments folder empty
Verify that environments/ folder exists but contains no files.

## Notes

- Stats-based comparison tests are context-dependent (only valid from bundle root)
- Method uses runtime.cwd for path resolution, not process.cwd()
- v1.0.0: Initial implementation
