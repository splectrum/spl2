# gp/fs/list

Lists files and directories with metadata.

## Purpose
Enumerates directory contents with optional file statistics for filesystem inspection.

## Parameters
- `--path` (optional) - Directory path to list (defaults to current working directory)
- `--stats` (optional) - Include detailed file statistics

## Output Structure
Returns directory listing with file/directory metadata in workspace record format.

## Usage Examples

**List current directory:**
```bash
gp/fs/list
```

**List specific directory:**
```bash
gp/fs/list --path=src/modules
```

**List with detailed statistics:**
```bash
gp/fs/list --path=data --stats=true
```

## Integration Patterns

**With session working directory:**
```bash
gp/config/set-session-working-dir --path=/tmp/workspace @@
gp/fs/list --path=.
```

**Pipeline with filtering:**
```bash
gp/fs/list --path=src @@ 
gp/fs/find --pattern="*.js" --path=src
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves path relative to appDataRoot
3. Enumerates directory entries with type detection
4. Creates standardized directory record in workspace
5. Optional statistics include size, dates, permissions

## History Output
```
fs/list: found 15 entries in src/modules
```

## Related Methods
- `gp/fs/find` - Pattern-based file search
- `gp/fs/exists` - Path existence checking
- `gp/fs/info` - Detailed file/directory information