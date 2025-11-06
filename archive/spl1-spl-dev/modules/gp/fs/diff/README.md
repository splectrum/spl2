# gp/fs/diff

Compares files or directories to identify differences.

## Purpose
Analyzes differences between two filesystem paths, comparing metadata and optionally content.

## Parameters
- `--from` (required) - Source path for comparison
- `--to` (required) - Target path for comparison
- `--content` (optional) - Compare file contents for text files

## Output Structure
Returns comparison results with difference details, types, and metadata comparisons.

## Usage Examples

**Compare two files:**
```bash
gp/fs/diff --from=version1.txt --to=version2.txt
```

**Compare with content analysis:**
```bash
gp/fs/diff --from=config-old.json --to=config-new.json --content=true
```

**Compare directories:**
```bash
gp/fs/diff --from=backup/data --to=current/data
```

## Integration Patterns

**Version validation:**
```bash
gp/fs/diff --from=template.config --to=instance.config --content=true @@
# Verify customizations
```

**Backup verification:**
```bash
gp/fs/diff --from=original.db --to=backup.db @@
# Ensure backup integrity
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves both paths relative to appDataRoot
3. Compares existence, type, size, and timestamps
4. Content comparison for small text files when requested
5. Handles missing files gracefully
6. Returns structured difference analysis
7. Creates diff operation record in workspace

## History Output
```
fs/diff: compared version1.txt and version2.txt
fs/diff: found differences between config-old.json and config-new.json
```

## Related Methods
- `gp/fs/info` - Get detailed file metadata
- `gp/fs/read` - Read files for manual comparison
- `gp/fs/exists` - Check file existence before comparison