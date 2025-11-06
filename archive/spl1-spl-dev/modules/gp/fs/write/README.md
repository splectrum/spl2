# gp/fs/write

Writes content to files with encoding support and workspace source integration.

## Purpose
Creates or modifies files with content from direct input or workspace references.

## Parameters
- `--file` (required) - Path to file to write
- `--content` (optional) - Direct content to write (can be array for multi-part)
- `--source` (optional) - Workspace key to read content from
- `--encoding` (optional) - Content encoding (utf8, binary, base64, etc.)

## Output Structure
Creates file and returns standardized file record with metadata in workspace.

## Usage Examples

**Write text content:**
```bash
gp/fs/write --file=output.txt --content="Hello World"
```

**Write from workspace source:**
```bash
gp/fs/write --file=copy.txt --source=gp/fs/read_original.txt
```

**Write with specific encoding:**
```bash
gp/fs/write --file=data.bin --content="SGVsbG8=" --encoding=base64
```

**Write multi-part content:**
```bash
gp/fs/write --file=combined.txt --content="Part 1" --content="Part 2"
```

## Integration Patterns

**Copy via workspace:**
```bash
gp/fs/read --file=source.txt @@
gp/fs/write --file=destination.txt --source=gp/fs/read_source.txt
```

**Pipeline processing:**
```bash
gp/fs/write --file=temp.json --content="{\"test\": true}" @@
gp/fs/read --file=temp.json
```

**With session isolation:**
```bash
gp/config/set-session-working-dir --path=/tmp/write-test @@
gp/fs/write --file=isolated.txt --content="test data"
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Handles multiple content sources (direct content vs workspace source)
3. Array content is joined with spaces for command-line convenience
4. Automatically detects target file type for encoding decisions
5. Creates parent directories if needed
6. Binary content support via base64 encoding
7. Updates workspace with file record and metadata

## History Output
```
fs/write: Successfully wrote output.txt (12 bytes, utf8)
```

## Related Methods
- `gp/fs/read` - Read file contents
- `gp/fs/copy` - Direct file copying
- `gp/fs/exists` - Check file existence before writing