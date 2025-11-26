**Type:** plain req

# spl/dev/clone

## Spec

Clone a dev environment iteration to a new location.

### Inputs

| Field | Required | Description |
|-------|----------|-------------|
| path | Yes | Destination path relative to current location |
| name | No | Package name (auto-detected from path if not provided) |
| description | No | Package description (default generated if not provided) |

### Outputs

| Field | Description |
|-------|-------------|
| created | The path that was created |
| package | The package.json contents (name, version, description) |

### Behavior

- Copy all files and folders from source, except contents of environments/
- Update package.json with correct name, version, description
- Error if destination already exists (like git clone)

### Name/Description Auto-detection

When name not provided:
- Detect project number from path pattern `projects/NN-name/dev/`
- Generate name as `prNN-destName` (e.g., `pr10-v1.0`)

When description not provided:
- Generate as `Project NN - Dev environment destName`

### Version Detection

- If destination folder matches `vX.Y` pattern, set version to `X.Y.0`
- Otherwise set version to `0.0.0`

## Self-eval

- [ ] Destination path is created
- [ ] All files and folders copied (except environments/ contents)
- [ ] package.json updated with correct name
- [ ] package.json updated with correct version
- [ ] package.json updated with correct description
- [ ] environments/ folder exists but is empty
- [ ] Errors if destination already exists

## Comments

v1.0.0: Initial spec based on clone.js shell script implementation.
