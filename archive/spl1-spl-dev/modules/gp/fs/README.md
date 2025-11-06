# gp/fs API

Filesystem operations with unrestricted repository access for SPL applications.

## Quick Reference

| Method | Purpose | Core Operation |
|--------|---------|---------------|
| `list --path={dir}` | List directory contents | Directory enumeration with metadata |
| `read --file={path}` | Read file contents | File content retrieval with encoding |
| `write --file={path} --content={data}` | Write file contents | File creation/modification |
| `exists --path={path}` | Check existence | Path validation and type detection |
| `info --path={path}` | Get file/directory info | Metadata extraction (size, dates, permissions) |
| `copy --from={src} --to={dest}` | Copy files | File duplication |
| `move --from={src} --to={dest}` | Move/rename files | File relocation |
| `delete --file={path}` | Delete files | File removal |
| `mkdir --path={dir}` | Create directories | Directory creation |
| `rmdir --path={dir}` | Remove directories | Directory removal |
| `find --pattern={glob}` | Find files/directories | Pattern-based search with filters |
| `grep --pattern={regex}` | Search file contents | Content pattern matching |
| `diff --from={path1} --to={path2}` | Compare files | File/directory comparison |

## Key Features

- **Unrestricted Access**: Full repository access without security boundaries
- **Session Working Directory**: Supports `gp/config/set-session-working-dir` overrides
- **Individual Parameter Extraction**: SPL coding standard compliance
- **Binary/Text Support**: Automatic encoding detection and handling
- **Kafka Record Pattern**: Standardized workspace record structure

## Testing Pattern

All fs methods support gp/test framework:

```bash
spl_execute dev gp/test/discover --modules=gp/fs/METHOD @@ gp/test/plan @@ gp/test/execute @@ gp/test/report
```

## Common Usage Patterns

**File operations pipeline:**
```bash
gp/fs/write --file=test.txt --content="hello world" @@
gp/fs/read --file=test.txt @@
gp/fs/copy --from=test.txt --to=backup.txt
```

**Directory management:**
```bash
gp/fs/mkdir --path=temp-workspace @@
gp/fs/list --path=temp-workspace @@
gp/fs/rmdir --path=temp-workspace --recursive=true
```

**Search and analysis:**
```bash
gp/fs/find --pattern="*.js" --path=src @@
gp/fs/grep --pattern="function" --path=src
```

**With session isolation:**
```bash
gp/config/set-session-working-dir --path=/tmp/isolated @@
gp/fs/write --file=isolated.txt --content="test data" @@
gp/config/clear-session-working-dir
```

## Implementation Notes

- Uses `spl.getFullAppDataPath()` for session working directory support
- No path validation or security restrictions (unrestricted repository access)
- All methods follow SPL coding standards (no try/catch, happy path programming)
- Binary file support with base64 encoding for JSON safety
- Workspace records stored under `gp/fs` with operation-specific keys
- History logging: One concise entry per operation with key information