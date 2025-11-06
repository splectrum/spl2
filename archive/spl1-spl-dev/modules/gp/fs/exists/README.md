# gp/fs/exists

Checks if files or directories exist with type detection.

## Purpose
Validates path existence and identifies type (file/directory) for conditional workflows.

## Parameters
- `--path` (required) - Path to check for existence

## Output Structure
Returns existence record with boolean status and optional type/metadata information.

## Usage Examples

**Check file existence:**
```bash
gp/fs/exists --path=config.json
```

**Check directory existence:**
```bash
gp/fs/exists --path=src/modules
```

**Check relative path:**
```bash
gp/fs/exists --path=../shared/data.txt
```

## Integration Patterns

**Conditional processing:**
```bash
gp/fs/exists --path=backup.txt @@
gp/fs/copy --from=data.txt --to=backup.txt  # Only if backup doesn't exist
```

**Directory validation:**
```bash
gp/fs/exists --path=temp-workspace @@
gp/fs/mkdir --path=temp-workspace  # Create if doesn't exist
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves path relative to appDataRoot
3. Checks filesystem for path existence
4. If exists, gathers basic type information (file/directory)
5. Creates existence record in workspace
6. No errors for non-existent paths (returns false)

## History Output
```
fs/exists: config.json exists
fs/exists: missing.txt does not exist
```

## Related Methods
- `gp/fs/info` - Detailed file/directory information
- `gp/fs/list` - Directory content enumeration
- `gp/fs/find` - Pattern-based existence checking