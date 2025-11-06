# gp/fs/read

Reads file contents with automatic encoding detection.

## Purpose
Retrieves file contents with proper encoding handling for both text and binary files.

## Parameters
- `--file` (required) - Path to file to read
- `--encoding` (optional) - Specific encoding (utf8, binary, base64, etc.)

## Output Structure
Returns file contents in workspace record with metadata including encoding, size, and timestamps.

## Usage Examples

**Read text file:**
```bash
gp/fs/read --file=config.json
```

**Read with specific encoding:**
```bash
gp/fs/read --file=data.txt --encoding=utf8
```

**Read binary file:**
```bash
gp/fs/read --file=image.png
```

## Integration Patterns

**Read and process pipeline:**
```bash
gp/fs/read --file=input.txt @@
gp/fs/write --file=output.txt --source=gp/fs/read_input.txt
```

**With session isolation:**
```bash
gp/config/set-session-working-dir --path=/tmp/read-test @@
gp/fs/read --file=test-data.json
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Automatically detects file type (text vs binary) based on extension
3. Text files: Read with specified or default encoding
4. Binary files: Read as buffer, encode as base64 for JSON safety
5. Creates standardized file record with content and metadata
6. Stores in workspace under operation-specific key

## History Output
```
fs/read: successfully read config.json (1024 bytes, utf8)
```

## Related Methods
- `gp/fs/write` - Write file contents
- `gp/fs/exists` - Check file existence before reading
- `gp/fs/info` - Get file metadata without reading contents