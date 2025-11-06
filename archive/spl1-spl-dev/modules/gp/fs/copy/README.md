# gp/fs/copy

Copies files from source to destination.

## Purpose
Duplicates files while preserving content and metadata.

## Parameters
- `--from` (required) - Source file path
- `--to` (required) - Destination file path

## Output Structure
Returns copy operation record with source/destination paths and success status.

## Usage Examples

**Simple file copy:**
```bash
gp/fs/copy --from=data.txt --to=backup.txt
```

**Copy to different directory:**
```bash
gp/fs/copy --from=src/config.json --to=backup/config.json
```

**Copy with new name:**
```bash
gp/fs/copy --from=template.txt --to=instance-001.txt
```

## Integration Patterns

**Backup before modification:**
```bash
gp/fs/copy --from=important.json --to=important.json.bak @@
gp/fs/write --file=important.json --content="updated data"
```

**Template instantiation:**
```bash
gp/fs/copy --from=templates/base.config --to=instances/project-a.config @@
gp/fs/copy --from=templates/base.config --to=instances/project-b.config
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves both source and destination paths relative to appDataRoot
3. Performs filesystem copy operation
4. Preserves file contents exactly
5. Creates parent directories for destination if needed
6. Creates copy operation record in workspace

## History Output
```
fs/copy: Successfully copied data.txt to backup.txt
```

## Related Methods
- `gp/fs/move` - Move/rename files
- `gp/fs/read` + `gp/fs/write` - Copy via workspace
- `gp/fs/exists` - Check source existence before copying