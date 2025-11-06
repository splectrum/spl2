# gp/fs/find

Searches for files and directories using glob patterns and filters.

## Purpose
Locates files and directories based on name patterns, types, sizes, and other criteria.

## Parameters
- `--pattern` (optional) - Glob pattern to match names (e.g., "*.js", "test-*")
- `--path` (optional) - Starting directory for search
- `--type` (optional) - Filter by type: "file", "directory", or "all"
- `--size` (optional) - Size filter (e.g., ">1024", "<1m", "=0")
- `--recursive` (optional) - Search subdirectories
- `--maxDepth` (optional) - Maximum recursion depth
- `--empty` (optional) - Find only empty files/directories

## Output Structure
Returns search results with matching paths, types, sizes, and timestamps.

## Usage Examples

**Find JavaScript files:**
```bash
gp/fs/find --pattern="*.js" --path=src
```

**Find large files:**
```bash
gp/fs/find --size=">1m" --type=file
```

**Find empty directories:**
```bash
gp/fs/find --type=directory --empty=true
```

**Complex search:**
```bash
gp/fs/find --pattern="test-*" --path=data --maxDepth=2 --recursive=true
```

## Integration Patterns

**Bulk processing:**
```bash
gp/fs/find --pattern="*.tmp" --path=workspace @@
# Process each temp file found
```

**Cleanup workflows:**
```bash
gp/fs/find --empty=true --type=directory @@
# Remove empty directories
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Starts search from specified path or current directory
3. Applies glob pattern matching with wildcards (* and **)
4. Filters results by type, size, and other criteria
5. Recursively traverses directories if enabled
6. Returns structured results with metadata
7. Creates find operation record in workspace

## History Output
```
fs/find: found 15 items matching "*.js" in src
fs/find: found 3 items in workspace
```

## Related Methods
- `gp/fs/list` - Simple directory enumeration
- `gp/fs/grep` - Search file contents
- `gp/fs/exists` - Check specific paths