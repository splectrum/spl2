# gp/fs/move

Moves or renames files and directories.

## Purpose
Relocates files/directories or changes their names using filesystem move operation.

## Parameters
- `--from` (required) - Source path (file or directory)
- `--to` (required) - Destination path

## Output Structure
Returns move operation record with source/destination paths and success status.

## Usage Examples

**Rename file:**
```bash
gp/fs/move --from=old-name.txt --to=new-name.txt
```

**Move to different directory:**
```bash
gp/fs/move --from=temp/data.json --to=archive/data.json
```

**Move directory:**
```bash
gp/fs/move --from=old-folder --to=new-folder
```

## Integration Patterns

**Organize files:**
```bash
gp/fs/move --from=downloads/report.pdf --to=documents/reports/report.pdf @@
gp/fs/move --from=downloads/image.jpg --to=media/images/image.jpg
```

**Atomic file replacement:**
```bash
gp/fs/write --file=config.tmp --content="new config" @@
gp/fs/move --from=config.tmp --to=config.json
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves both source and destination paths relative to appDataRoot
3. Performs filesystem move/rename operation
4. Works for both files and directories
5. Source path no longer exists after successful move
6. Creates parent directories for destination if needed
7. Creates move operation record in workspace

## History Output
```
fs/move: Successfully moved old-name.txt to new-name.txt
```

## Related Methods
- `gp/fs/copy` - Copy files (keeps source)
- `gp/fs/delete` - Remove files
- `gp/fs/exists` - Check paths before moving