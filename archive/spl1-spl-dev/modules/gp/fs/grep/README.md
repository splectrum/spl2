# gp/fs/grep

Searches file contents for text patterns using regular expressions.

## Purpose
Finds text patterns within files, supporting regex matching and context options.

## Parameters
- `--pattern` (required) - Regular expression or text pattern to search for
- `--path` (optional) - Starting directory or specific file to search
- `--caseSensitive` (optional) - Case-sensitive matching
- `--recursive` (optional) - Search files in subdirectories

## Output Structure
Returns search results with matching files, line numbers, content, and match details.

## Usage Examples

**Search for function definitions:**
```bash
gp/fs/grep --pattern="function \\w+" --path=src
```

**Case-sensitive search:**
```bash
gp/fs/grep --pattern="ERROR" --caseSensitive=true --path=logs
```

**Search specific file:**
```bash
gp/fs/grep --pattern="config" --path=settings.json
```

**Recursive content search:**
```bash
gp/fs/grep --pattern="TODO" --path=. --recursive=true
```

## Integration Patterns

**Code analysis:**
```bash
gp/fs/grep --pattern="console\\.log" --path=src --recursive=true @@
# Find debug statements
```

**Configuration validation:**
```bash
gp/fs/grep --pattern="localhost" --path=config @@
# Find hardcoded local references
```

## Behavior
1. Uses session working directory via `spl.getFullAppDataPath()`
2. Searches text files only (skips binary files automatically)
3. Applies regex pattern matching with configurable flags
4. Returns line numbers and context for each match
5. Supports both file and directory targets
6. Recursive search traverses subdirectories
7. Creates grep operation record with detailed results

## History Output
```
fs/grep: found 8 matches in 3 files for pattern "function"
fs/grep: found 0 matches in 12 files for pattern "deprecated"
```

## Related Methods
- `gp/fs/find` - Search by file names/paths
- `gp/fs/read` - Read specific files
- `gp/fs/list` - Enumerate files to search