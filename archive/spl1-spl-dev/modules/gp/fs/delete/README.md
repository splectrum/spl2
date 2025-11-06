# gp/fs/delete

Deletes files from the filesystem.

## Purpose
Removes files permanently from the filesystem.

## Parameters
- `--file` (required) - Path to file to delete

## Output Structure
Returns delete operation record with file path and success status.

## Usage Examples

**Delete single file:**
```bash
gp/fs/delete --file=temp.txt
```

**Delete from subdirectory:**
```bash
gp/fs/delete --file=workspace/temp/data.json
```

**Delete backup files:**
```bash
gp/fs/delete --file=config.json.bak
```

## Integration Patterns

**Cleanup after processing:**
```bash
gp/fs/write --file=temp-processing.json --content="{}" @@
# ... processing steps ... @@
gp/fs/delete --file=temp-processing.json
```

**Conditional cleanup:**
```bash
gp/fs/exists --path=old-version.txt @@
gp/fs/delete --file=old-version.txt  # Only if exists
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves file path relative to appDataRoot
3. Performs filesystem delete operation
4. File is permanently removed
5. No error if file doesn't exist
6. Creates delete operation record in workspace

## History Output
```
fs/delete: successfully deleted temp.txt
```

## Related Methods
- `gp/fs/rmdir` - Remove directories
- `gp/fs/exists` - Check file existence before deleting
- `gp/fs/move` - Move files instead of deleting