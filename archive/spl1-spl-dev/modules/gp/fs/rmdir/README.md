# gp/fs/rmdir

Removes directories with optional recursive removal.

## Purpose
Deletes directories from the filesystem with support for non-empty directory removal.

## Parameters
- `--path` (required) - Directory path to remove
- `--recursive` (optional) - Remove directory and all contents
- `--force` (optional) - Force removal without confirmation

## Output Structure
Returns directory removal record with path and options used.

## Usage Examples

**Remove empty directory:**
```bash
gp/fs/rmdir --path=empty-folder
```

**Remove directory and contents:**
```bash
gp/fs/rmdir --path=temp-workspace --recursive=true
```

**Force removal:**
```bash
gp/fs/rmdir --path=stubborn-folder --recursive=true --force=true
```

## Integration Patterns

**Cleanup after processing:**
```bash
gp/fs/mkdir --path=temp-work --recursive=true @@
# ... processing steps ... @@
gp/fs/rmdir --path=temp-work --recursive=true
```

**Selective cleanup:**
```bash
gp/fs/list --path=temp @@
gp/fs/rmdir --path=temp/folder-a --recursive=true @@
gp/fs/rmdir --path=temp/folder-b --recursive=true
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves directory path relative to appDataRoot
3. Removes directory according to specified options
4. Recursive option removes all contents first
5. Force option bypasses safety checks
6. Creates rmdir operation record in workspace

## History Output
```
fs/rmdir: successfully removed directory temp-workspace
fs/rmdir: successfully removed directory old-data (recursive)
```

## Related Methods
- `gp/fs/mkdir` - Create directories
- `gp/fs/delete` - Remove files
- `gp/fs/list` - Check directory contents before removal