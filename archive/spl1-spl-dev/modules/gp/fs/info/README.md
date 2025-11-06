# gp/fs/info

Retrieves detailed file or directory metadata.

## Purpose
Extracts comprehensive filesystem information including size, timestamps, and permissions.

## Parameters
- `--path` (required) - Path to file or directory

## Output Structure
Returns detailed metadata record with size, dates, type, and permission information.

## Usage Examples

**Get file information:**
```bash
gp/fs/info --path=data.json
```

**Get directory information:**
```bash
gp/fs/info --path=src/modules
```

**Check file size:**
```bash
gp/fs/info --path=large-file.zip
```

## Integration Patterns

**Size validation:**
```bash
gp/fs/info --path=upload.dat @@
# Process based on file size from workspace record
```

**Timestamp comparison:**
```bash
gp/fs/info --path=source.txt @@
gp/fs/info --path=destination.txt @@
# Compare modification times
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves path relative to appDataRoot
3. Extracts filesystem metadata via stats
4. Includes: type (file/directory), size, creation/modification/access times
5. Permission information with readable/writable/executable flags
6. Creates standardized info record in workspace

## History Output
```
fs/info: retrieved info for data.json (file, 2048 bytes)
fs/info: retrieved info for src (directory, 0 bytes)
```

## Related Methods
- `gp/fs/exists` - Simple existence checking
- `gp/fs/list` - Directory contents with basic metadata
- `gp/fs/find` - Search with size/date filters