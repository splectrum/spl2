# gp/fs/mkdir

Creates directories with optional recursive creation.

## Purpose
Creates directory structures with support for nested directory creation.

## Parameters
- `--path` (required) - Directory path to create
- `--recursive` (optional) - Create parent directories if needed

## Output Structure
Returns directory creation record with success status and options used.

## Usage Examples

**Create single directory:**
```bash
gp/fs/mkdir --path=temp-workspace
```

**Create nested directories:**
```bash
gp/fs/mkdir --path=project/src/modules --recursive=true
```

**Create in session directory:**
```bash
gp/fs/mkdir --path=test-data
```

## Integration Patterns

**Workspace setup:**
```bash
gp/fs/mkdir --path=workspace/input --recursive=true @@
gp/fs/mkdir --path=workspace/output --recursive=true @@
gp/fs/write --file=workspace/input/data.txt --content="test"
```

**Conditional creation:**
```bash
gp/fs/exists --path=temp @@
gp/fs/mkdir --path=temp  # Only create if doesn't exist
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Resolves path relative to appDataRoot
3. Creates directory with specified options
4. Recursive option creates parent directories as needed
5. No error if directory already exists
6. Creates mkdir operation record in workspace

## History Output
```
fs/mkdir: successfully created directory temp-workspace
fs/mkdir: successfully created directory project/src/modules (recursive)
```

## Related Methods
- `gp/fs/rmdir` - Remove directories
- `gp/fs/exists` - Check directory existence
- `gp/fs/list` - Verify directory contents after creation